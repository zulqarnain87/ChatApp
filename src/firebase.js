// Initializes Firebase and exports common services used across the app.
// Developer: paste your firebaseConfig object with apiKey, authDomain, etc.
// Exports: auth (Firebase Auth), db (Firestore), storage (Firebase Storage) — db/storage are optional.
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Replace the following config with your project's keys.
const firebaseConfig = {
 
  apiKey: "AIzaSyAKIggJIJq-gIqzREZJ8dpiqeLDZ1_AHH8",
  authDomain: "boloreactapp.firebaseapp.com",
  projectId: "boloreactapp",
  storageBucket: "boloreactapp.firebasestorage.app",
  messagingSenderId: "716841950119",
  appId: "1:716841950119:web:b75a63c3e9496dc8a83482",
  measurementId: "G-3QWB000ESZ",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig)

// Initialize and export Firebase services
export const auth = getAuth(app) ;
export const db = getFirestore(app) ;
export const storage = getStorage(app) ;

