import React from "react";

const BlogModal = ({ selectedBlog, setSelectedBlog, API_URL }) => {
  if (!selectedBlog) return null;
  return (
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
        <div className="text-gray-800 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />
      </div>
    </div>
  );
};

export default BlogModal;