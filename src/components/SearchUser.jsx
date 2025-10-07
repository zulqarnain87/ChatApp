import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SearchUser() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const q = query(collection(db, "users"), where("email", "==", search));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setResult(querySnapshot.docs[0].data());
      } else {
        setError("User not found ❌");
      }
    } catch (err) {
      console.error(err);
      setError("Error searching user");
    }
  };

  const handleSelect = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const otherUser = result;
    const chatId =
      currentUser.uid > otherUser.uid
        ? currentUser.uid + "_" + otherUser.uid
        : otherUser.uid + "_" + currentUser.uid;

    try {
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        // create new chat doc
        await setDoc(chatRef, {
          chatId,
          members: [currentUser.uid, otherUser.uid],
          lastMessage: "",
          updatedAt: serverTimestamp(),
        });
      }

      // redirect to chat page
      navigate(`/chat/${chatId}`);
    } catch (err) {
      console.error(err);
      setError("Error creating chat");
    }
  };

  return (
    <div className="p-4 bg-white/80 backdrop-blur rounded-xl shadow">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 shadow-sm"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

      {result && (
        <div
          onClick={handleSelect}
          className="mt-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <p className="font-semibold">{result.name}</p>
          <p className="text-sm text-gray-600">{result.email}</p>
        </div>
      )}
    </div>
  );
}
