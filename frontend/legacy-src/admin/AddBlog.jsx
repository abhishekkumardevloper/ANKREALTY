// src/admin/AddBlog.jsx

import React, { useState, useEffect } from "react";

export default function AddBlog({ onSave, editing, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setContent(editing.content || "");
      // If editing, you might pass down an existing image URL from your server
      if (editing.imageUrl) {
        setImagePreview(editing.imageUrl);
      }
    }
  }, [editing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a local preview URL so the user can see the image immediately
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and Content are required.");
      return;
    }

    // Because we have a file, we MUST use FormData, not standard JSON
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Pass the FormData object back to AdminPanel
    onSave(formData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {editing ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 font-medium">
          ✕ Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Blog Title</label>
          <input
            type="text"
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Top 10 Real Estate Investment Tips for 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Cover Image Upload Area */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg border border-slate-300 transition-colors">
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {imageFile && <span className="text-sm text-slate-500">{imageFile.name}</span>}
          </div>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-2">Image Preview:</p>
              <img 
                src={imagePreview} 
                alt="Blog Cover Preview" 
                className="w-full max-w-md h-48 object-cover rounded-lg border border-slate-200"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Blog Content</label>
          <textarea
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[250px]"
            placeholder="Write your article here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {editing ? "Update Blog" : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}