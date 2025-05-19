import React from "react";
import { useNavigate } from "react-router-dom";
import blogInfo from "./blogInfo"; // Import the blogInfo array from another file

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{
        // Background image for the home page
        backgroundImage:
          "url('https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNhbWVyYXxlbnwwfHwwfHx8MA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Main welcome card */}
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-10 w-full max-w-2xl text-center mb-8 mt-8">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
          Welcome to Aryan Blog!
        </h1>
        <p className="text-gray-700 mb-8 text-lg">
          Create your Blogs, Publish, Edit and Delete amazing blogs. Start your journey as a writer or a reader!
        </p>
        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            onClick={() => navigate("/blog")}
          >
            Explore Blogs
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            onClick={() => navigate("/profile")}
          >
            Go to Profile
          </button>
        </div>
      </div>

      {/* Extra content: cards about Blog */}
      <div className="w-full flex-1 flex justify-center items-start">
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12 px-4">
          {blogInfo.map((item, idx) => (
            <div
              key={idx}
              className="bg-white bg-opacity-90 rounded-lg shadow-md p-5 flex flex-col items-center text-center h-full"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-40 object-cover rounded mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-blue-700 mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;