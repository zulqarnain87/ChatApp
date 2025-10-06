// Login page: allows existing users to sign in with email and password
import React, { useState } from "react"
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [unverifiedUser, setUnverifiedUser] = useState(null) // store user if not verified
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setUnverifiedUser(null)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (!user.emailVerified) {
        setError("Your email is not verified. Please verify before logging in.")
        setUnverifiedUser(user) // keep ref for resend
        await auth.signOut() // prevent access
        return
      }

      navigate("/") // redirect if verified
    } catch (err) {
      console.error(err)
      setError(err.message || "Failed to sign in")
    }
  }

  const handleResend = async () => {
    if (unverifiedUser) {
      try {
        await sendEmailVerification(unverifiedUser)
        setMessage("Verification email has been resent. Please check your inbox.")
      } catch (err) {
        console.error(err)
        setError("Failed to resend verification email.")
      }
    }
  }

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
        Welcome Back 👋
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 text-red-600 px-4 py-2 text-sm">
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
          <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
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
          <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
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
          Log in
        </button>
      </form>

      {unverifiedUser && (
        <div className="mt-4 text-center">
          <button
            onClick={handleResend}
            className="text-yellow-500 hover:underline font-medium"
          >
            Resend verification email
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-yellow-500 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}
