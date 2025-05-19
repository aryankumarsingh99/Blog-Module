import React from "react";

const BlogForm = ({
  editMode,
  error,
  form,
  handleChange,
  handleSubmit,
  setShowUpload,
  isSaving,
  lastSaved,
}) => (
  <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
    <h3 className="text-xl font-semibold mb-4">{editMode ? "Edit Blog" : "Upload Blog"}</h3>
    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        className="border rounded w-full py-2 px-3"
        placeholder="Enter blog title"
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="border rounded w-full py-2 px-3"
        placeholder="Enter blog description"
        rows="3"
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
      <input
        type="file"
        name="image"
        onChange={handleChange}
        className="border rounded w-full py-2 px-3"
        accept="image/*"
      />
    </div>
    <div className="flex justify-between items-center mt-2">
      <span className="text-xs text-gray-400">
        {isSaving
          ? "Saving draft..."
          : lastSaved
          ? `Draft saved at ${lastSaved.toLocaleTimeString()}`
          : ""}
      </span>
      <div>
        <button
          type="button"
          className="bg-white text-red-700 px-4 py-2 rounded mr-2"
          onClick={() => setShowUpload(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editMode ? "Update Blog" : "Upload Blog"}
        </button>
      </div>
    </div>
  </form>
);

export default BlogForm;