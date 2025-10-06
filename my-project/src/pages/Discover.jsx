import React from "react";
import SearchUser from "../components/SearchUser";
import UserList from "../components/UserList";
import Navbar from "../components/Navbar";

export default function Discover() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">🔍 Find Users</h1>
      <SearchUser />
      <UserList />
    </div>
    </>
  );
}
