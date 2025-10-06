// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Discover from "./pages/Discover";
import ChatList from "./pages/ChatList";
import ChatWindow from "./pages/ChatWindow";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute"; 

function App() {
  return (
    // 💡 FIX: Add the basename property set to your repository name
    <BrowserRouter basename="/ChatApp"> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected area */}
        {/* These routes are now relative to /ChatApp */}
        <Route path="/" element={<PrivateRoute><ChatList /></PrivateRoute>} />
        <Route path="/discover" element={<PrivateRoute><Discover /></PrivateRoute>} />
        <Route path="/chats" element={<PrivateRoute><ChatList /></PrivateRoute>} />
        <Route path="/chat/:chatId" element={<PrivateRoute><ChatWindow /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;