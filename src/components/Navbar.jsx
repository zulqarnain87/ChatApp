import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-yellow-400 text-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Left Side - Logo */}
          <Link
            to="/"
            className="text-xl font-bold hover:text-gray-800 transition"
          >
            💬 BoloChat
          </Link>

          {/* Right Side - Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/discover"
              className="hover:text-gray-700 font-medium transition"
            >
               Discover 
            </Link>
            <Link
              to="/chats"
              className="hover:text-gray-700 font-medium transition"
            >
               Chats 
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
