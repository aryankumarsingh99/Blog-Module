import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";

const API_URL = "https://blog-module-1.onrender.com";
const AUTO_SAVE_INTERVAL = 30000;
const AUTO_SAVE_DELAY = 5000;

const UserProfile = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("blog_username") || "";
  const [blogs, setBlogs] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
    blogId: null,
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);
  const [notify, setNotify] = useState({ show: false, message: "", color: "green" });
  const [likedBlogs, setLikedBlogs] = useState({});
  const autoSaveTimeout = useRef(null);
  const autoSaveInterval = useRef(null);

  // Fetch user blogs and profile photo on mount or when showUpload changes
  useEffect(() => {
    fetch(`${API_URL}/api/blogs/user/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.blogs || []);
        // Load likes from localStorage
        const likes = JSON.parse(localStorage.getItem("likedBlogs") || "{}");
        setLikedBlogs(likes);
      });
    fetch(`${API_URL}/api/auth/profile-photo/${username}`)
      .then((res) => res.json())
      .then((data) => setProfilePhoto(data.profilePhoto || ""));
  }, [username, showUpload]);

  // Like handler
  const handleLike = (blogId) => {
    setLikedBlogs((prev) => {
      const updated = { ...prev, [blogId]: !prev[blogId] };
      localStorage.setItem("likedBlogs", JSON.stringify(updated));
      setNotify({
        show: true,
        message: updated[blogId] ? "You liked this blog!" : "You unliked this blog!",
        color: updated[blogId] ? "green" : "red",
      });
      setTimeout(() => setNotify({ show: false, message: "", color: "green" }), 1500);
      return updated;
    });
  };

  // Handle profile photo file selection
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  // Upload profile photo to server
  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    const formData = new FormData();
    formData.append("profilePhoto", photoFile);
    const res = await fetch(`${API_URL}/api/auth/profile-photo/${username}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.profilePhoto) setProfilePhoto(data.profilePhoto);
    setPhotoFile(null);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  // Edit an existing blog
  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      description: blog.description,
      image: null,
      blogId: blog._id,
      imageUrl: blog.imageUrl || "",
    });
    setEditMode(true);
    setShowUpload(true);
  };

  // Delete a blog
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/blogs/${id}`, { method: "DELETE" });
    setBlogs(blogs.filter((b) => b._id !== id));
    setNotify({ show: true, message: "Blog deleted successfully!", color: "red" });
    setTimeout(() => setNotify({ show: false, message: "", color: "green" }), 2000);
  };

  // Submit blog (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError("Title and description are required.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("author", username);
    if (form.image) formData.append("image", form.image);
    if (form.blogId) formData.append("blogId", form.blogId);
    if (form.imageUrl) formData.append("imageUrl", form.imageUrl);

    const res = await fetch(`${API_URL}/api/blogs`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setShowUpload(false);
      setForm({ title: "", description: "", image: null, blogId: null, imageUrl: "" });
      setEditMode(false);
      fetch(`${API_URL}/api/blogs/user/${username}`)
        .then((res) => res.json())
        .then((data) => setBlogs(data.blogs || []));
      setNotify({
        show: true,
        message: editMode ? "Blog updated successfully!" : "Blog published successfully!",
        color: "green",
      });
      setTimeout(() => setNotify({ show: false, message: "", color: "green" }), 2000);
    } else {
      setError("Failed to upload blog.");
    }
  };

  // Auto-save draft after delay when form changes
  useEffect(() => {
    if (!showUpload) return;
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(() => {
      if (form.title || form.description) handleAutoSave();
    }, AUTO_SAVE_DELAY);
    return () => clearTimeout(autoSaveTimeout.current);
    // eslint-disable-next-line
  }, [form.title, form.description, form.image]);

  // Periodically auto-save draft while editing
  useEffect(() => {
    if (!showUpload) return;
    autoSaveInterval.current = setInterval(() => {
      if (form.title || form.description) handleAutoSave();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveInterval.current);
    // eslint-disable-next-line
  }, [showUpload, form.title, form.description, form.image]);

  // Auto-save handler with toast notification
  const handleAutoSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("author", username);
    formData.append("draft", "true");
    if (form.image) formData.append("image", form.image);
    if (form.blogId) formData.append("blogId", form.blogId);
    if (form.imageUrl) formData.append("imageUrl", form.imageUrl);

    const res = await fetch(`${API_URL}/api/blogs`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setForm(f => ({ ...f, blogId: data.blog._id, imageUrl: data.blog.imageUrl }));
      setLastSaved(new Date());
      setShowAutoSaveToast(true);
      setTimeout(() => setShowAutoSaveToast(false), 2000);
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen w-full bg-[rgba(64,214,194,0.54)] flex flex-col">
      {/* Heading for UserProfile */}
      <h1 className="text-4xl font-bold text-center text-blue-700 mt-8 mb-6 drop-shadow">User Profile</h1>

      {/* Auto-save toast notification */}
      {showAutoSaveToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg transition-all animate-bounce">
          Draft auto-saved!
        </div>
      )}
      {/* Publish/Edit/Delete/Like notification */}
      {notify.show && (
        <div
          className={`fixed top-20 right-6 z-50 px-6 py-3 rounded shadow-lg transition-all animate-bounce text-white`}
          style={{ backgroundColor: notify.color === "red" ? "#ef4444" : "#22c55e" }}
        >
          {notify.message}
        </div>
      )}

      <div>
        <ProfileHeader
          profilePhoto={profilePhoto ? `${API_URL}${profilePhoto}` : ""}
          username={username}
          handlePhotoChange={handlePhotoChange}
          handlePhotoUpload={handlePhotoUpload}
          photoFile={photoFile}
          onLogout={() => {
            localStorage.removeItem("blog_username");
            navigate("/");
          }}
        />

        <div className="flex justify-end mb-6">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded"
            onClick={() => {
              setEditMode(false);
              setForm({ title: "", description: "", image: null, blogId: null, imageUrl: "" });
              setShowUpload(true);
            }}
          >
            Upload Blog
          </button>
        </div>

        {showUpload && (
          <BlogForm
            editMode={editMode}
            error={error}
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setShowUpload={setShowUpload}
            isSaving={isSaving}
            lastSaved={lastSaved}
          />
        )}

        <BlogList
          blogs={blogs}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleLike={handleLike}
          likedBlogs={likedBlogs}
          setSelectedBlog={setSelectedBlog}
          API_URL={API_URL}
        />

        {/* Blog Details Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 bg-[rgba(111,154,148,0.54)] bg-opacity-70 flex items-center justify-center z-50">
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
              <h3 className="text-3xl font-bold text-blue-700 mb-2">{selectedBlog.title}</h3>
              <div className="text-sm text-gray-500 mb-4">
                By {selectedBlog.author} on {new Date(selectedBlog.createdAt).toLocaleString()}
              </div>
              <p className="text-gray-800 whitespace-pre-line">{selectedBlog.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;