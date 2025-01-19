import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import CreatePost from './components/CreatePost'; 
import Register from './components/Register'; 
import Profile from './components/Profile';
import NotFound from './components/NotFound'; 
import UserPostHistory from './components/UserPostHistory'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-post" element={<CreatePost />} />
        {/* Dynamic profile route */}
        <Route path="/profile/:username" element={<Profile />} />
        {/* Fallback route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
        <Route path="/profile/:userId/posts-history" element={<UserPostHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
