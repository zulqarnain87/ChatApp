// src/App.jsx 
// 💡 Note the change from BrowserRouter to HashRouter
import { HashRouter, Routes, Route } from "react-router-dom"; 
// ... other imports

function App() {
  return (
    // 💡 Use HashRouter instead of BrowserRouter
    <HashRouter> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected area */}
        {/* The URL will now look like: /ChatApp/#/discover */}
        <Route path="/" element={<PrivateRoute><ChatList /></PrivateRoute>} />
        <Route path="/discover" element={<PrivateRoute><Discover /></PrivateRoute>} />
        <Route path="/chats" element={<PrivateRoute><ChatList /></PrivateRoute>} />
        <Route path="/chat/:chatId" element={<PrivateRoute><ChatWindow /></PrivateRoute>} />
      </Routes>
    </HashRouter>
  );
}

export default App;