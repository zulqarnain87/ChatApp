// Signup page: provides a form to create a new user with email/password and save displayName
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'
import { auth, db } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Set display name
      await updateProfile(userCredential.user, { displayName: name })

      // Send verification email
      await sendEmailVerification(userCredential.user)

      // Save user in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        createdAt: serverTimestamp(),
        emailVerified: userCredential.user.emailVerified || false, // keep track
      chats: [],
      })

      setMessage("Account created! Please check your email to verify before logging in.")
      
      // Sign them out immediately so they can't use the account before verifying
      auth.signOut()

      // Redirect to login page
      setTimeout(() => navigate('/login'), 3000)

    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to create account')
    }
  }

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
        Create an account ✨
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-2 text-sm">
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none shadow-sm text-gray-900"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none shadow-sm text-gray-900"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none shadow-sm text-gray-900"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none transition"
        >
          Sign up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-yellow-500 hover:underline font-medium">
          Log in
        </Link>
      </p>
    </div>
  )
}
