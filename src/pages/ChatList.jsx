import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import Navbar from "../components/Navbar";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // Sirf wahi chats lao jisme current user member hai
    const q = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      let chatData = [];

      for (let docSnap of snapshot.docs) {
        let chat = docSnap.data();
        chat.id = docSnap.id;

        // 🟢 Other user ka UID nikaal lo
        const [uid1, uid2] = chat.id.split("_");
        const otherUid = uid1 === currentUser.uid ? uid2 : uid1;

        // 🟢 Other user ka naam lao
        const userSnap = await getDoc(doc(db, "users", otherUid));
        if (userSnap.exists()) {
          chat.otherUser = userSnap.data();
        } else {
          chat.otherUser = { name: "Unknown User" };
        }

        chatData.push(chat);
      }

      // latest chat pehle dikhane ke liye sort karo
      chatData.sort((a, b) => b.updatedAt - a.updatedAt);

      setChats(chatData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) return <div className="p-4">Loading chats...</div>;

  return (
    <><Navbar />
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Chats</h2>
      {chats.length === 0 ? (
        <p className="text-gray-600">No chats yet.</p>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => (
            <Link
              to={`/chat/${chat.id}`}
              key={chat.id}
              className="block bg-white shadow rounded-lg p-3 hover:bg-gray-50 transition"
            >
              <div className="font-semibold">{chat.otherUser?.name}</div>
              <div className="text-sm text-gray-600 truncate">
                {chat.lastMessage || "No messages yet"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
