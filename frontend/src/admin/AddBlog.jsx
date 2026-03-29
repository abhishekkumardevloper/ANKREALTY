// src/admin/AddBlog.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AddBlog({ onSave, editing, onCancel }) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState(""); // Added for card previews
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setExcerpt(editing.excerpt || "");
      setContent(editing.content || "");
      
      // If editing, use existing image URL if available
      if (editing.imageUrl) {
        setImagePreview(editing.imageUrl);
      }
    } else {
      // Reset form on new entry
      setTitle("");
      setExcerpt("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
    }
  }, [editing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (optional, here set to 5MB max as an example)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!title.trim()) {
      toast.error("Blog title is required.");
      return;
    }
    if (!content.trim()) {
      toast.error("Blog content is required.");
      return;
    }
    if (!editing && !imageFile && !imagePreview) {
      toast.warning("A cover image is highly recommended.");
    }

    // Prepare FormData for the backend
    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (editing && imagePreview) {
      // Tell backend to keep existing image if no new file is uploaded
      formData.append("existingImageUrl", imagePreview);
    }

    onSave(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <button onClick={onCancel} className="text-slate-500 hover:text-[#003B30] mb-2 flex items-center text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Blogs
          </button>
          <h1 className="text-2xl font-black text-slate-900">
            {editing ? "Edit Blog Article" : "Create New Article"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Publish news, insights, and updates to the frontend.</p>
        </div>
        <Button onClick={handleSubmit} className="bg-[#003B30] hover:bg-[#00261c] text-white font-bold h-11 px-6 rounded-xl shadow-md">
          <Save className="w-4 h-4 mr-2" /> {editing ? "Update Article" : "Publish Article"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Content Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Article Title *</label>
              <Input
                type="text"
                placeholder="e.g., Top Real Estate Trends in 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Short Excerpt (Optional)</label>
              <Textarea
                rows={2}
                placeholder="A brief summary shown on the blog cards..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Full Content *</label>
              <Textarea
                rows={15}
                placeholder="Write your article content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="leading-relaxed font-medium text-slate-700"
              />
              <p className="text-[11px] text-slate-400 mt-2 font-medium">Supports plain text. Markdown or HTML rendering depends on your frontend setup.</p>
            </div>
          </div>
        </div>

        {/* Sidebar: Media & Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4">Cover Image</h2>
            
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors bg-slate-50/50">
                <ImageIcon className="w-8 h-8 text-slate-400 mb-3" />
                <span className="text-sm text-slate-600 font-bold mb-1">Upload Cover Image</span>
                <span className="text-xs text-slate-400 font-medium px-4 text-center">Recommended size: 1200x630px</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative w-full aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                  <img 
                    src={imagePreview} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow-lg hover:bg-red-600"
                    >
                      <X className="w-3 h-3 mr-1" /> Remove Image
                    </button>
                  </div>
                </div>
                <label className="block w-full text-center text-xs font-bold text-[#003B30] bg-emerald-50 hover:bg-emerald-100 py-2.5 rounded-lg cursor-pointer transition-colors border border-emerald-100">
                  Change Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            )}
            
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-1">Visibility Note</h4>
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  Once published, this article will be immediately visible on the public ANK Realty blog section.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
