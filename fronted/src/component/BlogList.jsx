import React from "react";

const BlogList = ({ blogs, handleEdit, handleDelete, handleLike, likedBlogs, setSelectedBlog, API_URL }) => (
  <div>
    <h3 className="text-2xl font-semibold pl-8 mb-5">Your Blogs</h3>
    <div className="flex flex-wrap w-full gap-8 justify-center px-2">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="bg-gray-50 rounded-lg shadow p-6 flex flex-col w-full sm:w-[48%] md:w-[31%] lg:w-[19%] xl:w-[18%] mb-4"
        >
          {blog.imageUrl && (
            <img
              src={`${API_URL}${blog.imageUrl}`}
              alt="Blog"
              className="h-32 w-full object-cover rounded mb-2"
            />
          )}
          <div className="flex-1 flex flex-col">
            <h4 className="text-xl font-bold">{blog.title}</h4>
            <p className="text-gray-700 flex-1">{blog.description}</p>
            <div className="text-sm text-gray-500 mt-2">
              {new Date(blog.updatedAt).toLocaleString()}
            </div>
            <div className="mt-2 flex gap-2 items-center">
              <button
                className="text-blue-500 underline"
                onClick={() => handleEdit(blog)}
              >
                Edit
              </button>
              <button
                className="text-red-500 underline"
                onClick={() => handleDelete(blog._id)}
              >
                Delete
              </button>
              <button
                className="text-green-500 underline"
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
            </div>
          </div>
        </div>
      ))}
      {blogs.length === 0 && <div className="text-gray-500">No blogs yet.</div>}
    </div>
  </div>
);

export default BlogList;