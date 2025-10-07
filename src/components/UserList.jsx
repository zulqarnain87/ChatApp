import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // track logged-in user safely
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      setUsers(snapshot.docs.map((doc) => doc.data()));
    };
    fetchUsers();
  }, []);

  const handleSelect = (user) => {
    if (!currentUser || user.uid === currentUser.uid) return;

    const chatId =
      currentUser.uid > user.uid
        ? currentUser.uid + "_" + user.uid
        : user.uid + "_" + currentUser.uid;

    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">All Users</h3>
      <ul className="space-y-2">
        {users
          .filter(
            (u) =>
              u.uid && // skip empty docs
              currentUser && // wait for auth user
              u.uid !== currentUser.uid // hide current user
          )
          .map((user) => (
            <li
              key={user.uid}
              onClick={() => handleSelect(user)}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}
