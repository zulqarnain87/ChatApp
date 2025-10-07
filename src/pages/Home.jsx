// Home page: a simple protected landing page that shows the current user's name and a logout button
import React from 'react'
import { useAuth } from '../context/AuthContext'
import LogoutButton from '../components/LogoutButton'
import Navbar from "../components/Navbar";

export default function Home() {
  const { user } = useAuth()

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full p-8">
        <h1 className="text-2xl font-semibold">Welcome{user?.displayName ? `, ${user.displayName}` : ''}!</h1>
        <p className="mt-4">You are signed in as: <strong>{user?.email}</strong></p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
    </>
  )
}
