// Provides authentication state (current user + loading) to the app via React Context.
// Exports: AuthProvider to wrap the app, and useAuth hook to consume auth state.
import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null) // createContext used to create a Context object for auth state

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // useState used to hold the current user
  const [loading, setLoading] = useState(true) // useState used to track whether auth is initializing

  useEffect(() => {
    // useEffect used to subscribe to auth state changes when the provider mounts
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser) // update user state when auth changes
      setLoading(false) // auth finished initializing
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext) // useContext used to consume the nearest AuthContext value
}
