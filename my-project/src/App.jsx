// src/App.jsx
// Application routes. Uses BrowserRouter with a basename so routes match
// when the app is deployed under a subpath (for example: /ChatApp/).
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ChatList from './pages/ChatList'
import ChatWindow from './pages/ChatWindow'
import Discover from './pages/Discover'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  // import.meta.env.BASE_URL is provided by Vite and reflects the base path
  // using BrowserRouter's basename ensures the router strips the base path
  // when matching routes (fixes "No routes matched location \"/ChatApp/\"").
  return (
    <Router basename="/ChatApp"> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected area */}
        <Route path="/" element={<PrivateRoute><ChatList /></PrivateRoute>} />
        <Route path="/discover" element={<PrivateRoute><Discover /></PrivateRoute>} />
        <Route path="/chats" element={<PrivateRoute><ChatList /></PrivateRoute>} />
        <Route path="/chat/:chatId" element={<PrivateRoute><ChatWindow /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}