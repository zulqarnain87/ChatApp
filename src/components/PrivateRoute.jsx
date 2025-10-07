// Protects routes by checking auth state; redirects to /login if unauthenticated
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // while auth status is being determined, show a loading placeholder
  if (loading) return <div className="p-4">Loading...</div>

  // if there's no user, redirect to login
  if (!user) return <Navigate to="/login" replace />

  // if user exists, render the protected children
  return children
}
