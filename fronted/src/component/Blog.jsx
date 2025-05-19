import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [search, setSearch] = useState("");
  const [notify, setNotify] = useState({ show: false, message: "", color: "green" });
  const [likedBlogs, setLikedBlogs] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  const navigate = useNavigate();

  // Fetch all blogs on mount
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.blogs || []);
        // Load likes from localStorage
        const likes = JSON.parse(localStorage.getItem("likedBlogs") || "{}");
        setLikedBlogs(likes);

        // Load like counts from localStorage or initialize
        const counts = JSON.parse(localStorage.getItem("likeCounts") || "{}");
        // If new blogs, initialize their like count to 0
        const updatedCounts = { ...counts };
        (data.blogs || []).forEach(blog => {
          if (updatedCounts[blog._id] === undefined) {
            updatedCounts[blog._id] = 0;
          }
        });
        setLikeCounts(updatedCounts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Like handler
  const handleLike = (blogId) => {
    setLikedBlogs((prev) => {
      const updated = { ...prev, [blogId]: !prev[blogId] };
      localStorage.setItem("likedBlogs", JSON.stringify(updated));

      setLikeCounts((prevCounts) => {
        const newCounts = { ...prevCounts };
        if (updated[blogId]) {
          newCounts[blogId] = (newCounts[blogId] || 0) + 1;
        } else {
          newCounts[blogId] = Math.max((newCounts[blogId] || 1) - 1, 0);
        }
        localStorage.setItem("likeCounts", JSON.stringify(newCounts));
        return newCounts;
      });

      setNotify({
        show: true,
        message: updated[blogId] ? "You liked this blog!" : "You unliked this blog!",
        color: updated[blogId] ? "green" : "red",
      });
      setTimeout(() => setNotify({ show: false, message: "", color: "green" }), 1500);
      return updated;
    });
  };

  // Filter blogs by search input
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[rgba(64,214,194,0.54)] flex flex-col items-center py-10 w-full">
      {/* Like notification */}
      {notify.show && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg transition-all animate-bounce text-white`}
          style={{ backgroundColor: notify.color === "red" ? "#ef4444" : "#22c55e" }}
        >
          {notify.message}
        </div>
      )}

      {/* Logout Button */}
      <div className="flex justify-end w-full px-8 mb-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => {
            localStorage.removeItem("blog_username");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      {/* Page Title */}
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 w-full">
        Latest Blogs
      </h2>

      {/* Search Input */}
      <div className="mb-8 flex justify-center w-full">
        <input
          type="text"
          placeholder="Search your Blog by title or description..."
          className="w-full max-w-2xl px-4 py-2 border  rounded shadow focus:outline-none focus:ring-2 text-xl   focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
          <span className="text-blue-600 text-lg font-semibold">Loading...</span>
        </div>
      ) : filteredBlogs.length === 0 ? (
        // No blogs found
        <div className="text-center text-gray-500">No blogs found.</div>
      ) : (
        // Blog Cards
        <div className="flex flex-wrap gap-8 justify-center w-full px-8">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg shadow p-6 flex flex-col w-full sm:w-[48%] md:w-[31%] lg:w-[19%] xl:w-[18%] mb-4"
            >
              {blog.imageUrl && (
                <img
                  src={`${API_URL}${blog.imageUrl}`}
                  alt="Blog"
                  className="h-48 w-full object-cover rounded mb-2"
                />
              )}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold">{blog.title}</h3>
                <p className="text-gray-700 flex-1 line-clamp-2">{blog.description}</p>
                <div className="text-sm text-gray-500 mt-2 mb-2">
                  By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    View
                  </button>
                  <button
                    className={`ml-2 px-2 py-1 rounded text-white ${likedBlogs[blog._id] ? "bg-pink-500" : "bg-gray-400"}`}
                    onClick={() => handleLike(blog._id)}
                  >
                    {likedBlogs[blog._id] ? "♥ Liked" : "♡ Like"}
                  </button>
                  <span className="ml-2 text-gray-700 font-semibold">
                    {likeCounts[blog._id] || 0} {likeCounts[blog._id] === 1 ? "Like" : "Likes"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0  bg-[rgba(133,205,196,0.54)]   bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-4 text-2xl font-bold text-gray-400 hover:text-gray-700"
              onClick={() => setSelectedBlog(null)}
            >
              &times;
            </button>
            {selectedBlog.imageUrl && (
              <img
                src={`${API_URL}${selectedBlog.imageUrl}`}
                alt="Blog"
                className="mb-4 h-96 w-full object-cover rounded"
              />
            )}
            <h3 className="text-3xl font-bold text-blue-700 mb-2">
              {selectedBlog.title}
            </h3>
            <div className="text-sm text-gray-500 mb-4">
              By {selectedBlog.author} on {new Date(selectedBlog.createdAt).toLocaleString()}
            </div>
            <p className="text-gray-800 whitespace-pre-line">
              {selectedBlog.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;