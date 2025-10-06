// src/services/chatService.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Return a canonical chatId for two uids (order-independent)
 */
export function makeChatId(uid1, uid2) {
  return uid1 > uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

/**
 * Create chat if not exists, add chatId to both users' 'chats' array, return chatId
 */
export async function createOrGetChat(uidA, uidB) {
  const chatId = makeChatId(uidA, uidB);
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    // create chat doc
    await setDoc(chatRef, {
      chatId,
      members: [uidA, uidB],
      lastMessage: "",
      updatedAt: serverTimestamp(),
    });

    // add chatId to each user's 'chats' array (merge)
    const userARef = doc(db, "users", uidA);
    const userBRef = doc(db, "users", uidB);
    await updateDoc(userARef, { chats: arrayUnion(chatId) }).catch(async (e) => {
      // if user doc doesn't exist, create it with chats
      await setDoc(userARef, { chats: [chatId] }, { merge: true });
    });
    await updateDoc(userBRef, { chats: arrayUnion(chatId) }).catch(async (e) => {
      await setDoc(userBRef, { chats: [chatId] }, { merge: true });
    });
  }

  return chatId;
}

/**
 * Send a message in a chat. Also update chat doc's lastMessage and updatedAt.
 */
export async function sendMessage(chatId, senderId, text, imageUrl = "") {
  const messagesCol = collection(db, "chats", chatId, "messages");
  await addDoc(messagesCol, {
    senderId,
    text,
    imageUrl,
    timestamp: serverTimestamp(),
  });

  // update chat meta
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Listen to messages (realtime). Returns unsubscribe function.
 * callback receives array of message objects sorted ascending by timestamp.
 */
export function listenToMessages(chatId, callback) {
  const messagesCol = collection(db, "chats", chatId, "messages");
  const q = query(messagesCol, orderBy("timestamp", "asc"));
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(msgs);
  });
}

/**
 * Get user's chatIds array from users/{uid}
 */
export async function getUserChatIds(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return [];
  return userSnap.data().chats || [];
}

/**
 * Get chat doc meta (members, lastMessage, updatedAt)
 */
export async function getChatMeta(chatId) {
  const chatRef = doc(db, "chats", chatId);
  const snap = await getDoc(chatRef);
  if (!snap.exists()) return null;
  return snap.data();
}

/**
 * Get user profile doc by uid
 */
export async function getUserByUid(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/**
 * Search user by email (returns first match or null)
 */
export async function searchUserByEmail(email) {
  const usersCol = collection(db, "users");
  const q = query(usersCol, where("email", "==", email));
  const snap = await getDocs(q);
  return snap.empty ? null : snap.docs[0].data();
}
