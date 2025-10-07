// Simple logout button component that signs the user out using Firebase Auth
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function LogoutButton() {
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      await signOut(auth) // signOut signs the current user out
      navigate('/login')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return (
    <button onClick={onLogout} className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700">
      Sign out
    </button>
  )
}
