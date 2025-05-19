import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Signup from './component/Signup';
import Home from './component/Home';
import Blog from './component/Blog';
import UserProfile from './component/UserProfile';

// Main App component with route definitions
function App() {
  return (
    <Router>
      <Routes>
        {/* Login page (default route) */}
        <Route path="/" element={<Login />} />
        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />
        {/* Home page */}
        <Route path="/home" element={<Home />} />
        {/* Blog listing page */}
        <Route path="/blog" element={<Blog />} />
        {/* User profile page */}
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
