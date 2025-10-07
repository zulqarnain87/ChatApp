import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function ChatWindow() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const currentUser = auth.currentUser;

  // 🟢 Fetch messages
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId]);

  // 🟢 Fetch other user's info for chat header
  useEffect(() => {
    const fetchOtherUser = async () => {
      const [uid1, uid2] = chatId.split("_");
      const otherUid = uid1 === currentUser.uid ? uid2 : uid1;

      const userRef = doc(db, "users", otherUid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setOtherUser(userSnap.data());
      }
    };
    fetchOtherUser();
  }, [chatId, currentUser]);

  // 🟢 Send message safely
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const chatRef = doc(db, "chats", chatId);

    // Chat doc ensure karo
    await setDoc(
      chatRef,
      {
        members: chatId.split("_"),
        lastMessage: input,
        updatedAt: serverTimestamp(), // 🔥 Server ka time
      },
      { merge: true }
    );

    // Message add karo
    await addDoc(collection(chatRef, "messages"), {
      sender: currentUser.uid,
      text: input,
      timestamp: serverTimestamp(), // 🔥 Server ka time
    });

    setInput("");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* 🟡 Chat Header */}
        <div className="p-4 bg-yellow-400 shadow-md text-lg font-semibold">
          {otherUser ? `Chat with ${otherUser.name}` : "Chat"}
        </div>

        {/* 🟡 Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded-lg max-w-xs ${
                msg.sender === currentUser.uid
                  ? "bg-yellow-300 ml-auto"
                  : "bg-white mr-auto"
              }`}
            >
              <p className="text-sm">{msg.text}</p>

              {/* 🟢 SOLVED: Check if timestamp exists AND if it has the toDate function */}
              {msg.timestamp && typeof msg.timestamp.toDate === 'function' && (
                <p className="text-[10px] text-gray-600 mt-1 text-right">
                  {msg.timestamp.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* 🟡 Input */}
        <form onSubmit={sendMessage} className="p-4 bg-white shadow-md flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 mr-2"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}