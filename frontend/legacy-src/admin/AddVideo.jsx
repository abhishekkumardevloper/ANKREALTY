// src/admin/AddVideo.jsx

import React, { useState, useEffect } from "react";

export default function AddVideo({ onSave, editing, onCancel }) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setVideoUrl(editing.videoUrl || "");
      setDescription(editing.description || "");
    }
  }, [editing]);

  // Helper to convert standard YouTube links to embed links for the preview
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url; // Return as-is for Vimeo or already formatted embed links
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !videoUrl) {
      alert("Title and Video URL are required.");
      return;
    }
    onSave({ title, videoUrl, description });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {editing ? "Edit Video" : "Add New Video"}
        </h2>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 font-medium">
          ✕ Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Video Title</label>
          <input
            type="text"
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Luxury Villa Tour - 4BHK"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Video URL (YouTube/Vimeo)</label>
          <input
            type="url"
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />
        </div>

        {/* Video Preview */}
        {videoUrl && (
          <div className="mt-4 border rounded-lg overflow-hidden bg-slate-50">
            <p className="text-xs text-slate-500 p-2 border-b bg-slate-100">Video Preview</p>
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={getEmbedUrl(videoUrl)}
                title="Video Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
          <textarea
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            rows="3"
            placeholder="Brief description of the property tour..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {editing ? "Update Video" : "Publish Video"}
        </button>
      </form>
    </div>
  );
}