import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    try {
      const res = await fetch("https://blog-module-1.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("blog_username", username);
        navigate("/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        // Background image  for login page
        backgroundImage:
          "url('https://images.unsplash.com/photo-1561713383-78b4befb5f86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTQ1fHxjYW1lcmF8ZW58MHx8MHx8fDA%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
          Login
        </h2>
        {/* Display error message if any */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Username:</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password:</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        {/* Link to signup page */}
        <div className="text-center mt-4">
          <button
            className="text-blue-500 underline"
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;