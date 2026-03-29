// src/admin/AddVideo.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Youtube, Video as VideoIcon, PlaySquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AddVideo({ onSave, editing, onCancel }) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setVideoUrl(editing.videoUrl || "");
      setDescription(editing.description || "");
    } else {
      setTitle("");
      setVideoUrl("");
      setDescription("");
    }
  }, [editing]);

  // Robust helper to extract YouTube ID and convert to embed link
  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      // Regex to handle various YouTube link formats (watch?v=, youtu.be/, shorts/, embed/)
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
      
      // If it's a Vimeo link, try to format it (Basic conversion)
      if (url.includes('vimeo.com/')) {
        const vimeoId = url.split('vimeo.com/')[1];
        return `https://player.vimeo.com/video/${vimeoId}`;
      }

      return url; // Return as-is if parsing fails
    } catch (e) {
      return url;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Video Title is required.");
      return;
    }
    if (!videoUrl.trim()) {
      toast.error("Video URL is required.");
      return;
    }

    // Since we are only sending text/links (no files), standard JSON payload is perfect
    onSave({ 
      title: title.trim(), 
      videoUrl: videoUrl.trim(), 
      description: description.trim() 
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <button onClick={onCancel} className="text-slate-500 hover:text-[#003B30] mb-2 flex items-center text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Videos
          </button>
          <h1 className="text-2xl font-black text-slate-900">
            {editing ? "Edit Promotional Video" : "Add New Promotional Video"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Embed YouTube or Vimeo links to showcase property tours.</p>
        </div>
        <Button onClick={handleSubmit} className="bg-[#003B30] hover:bg-[#00261c] text-white font-bold h-11 px-6 rounded-xl shadow-md">
          <Save className="w-4 h-4 mr-2" /> {editing ? "Update Video" : "Publish Video"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Form Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
              <VideoIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Video Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Video Title *</label>
              <Input
                type="text"
                placeholder="e.g., Luxury 4BHK Villa Walkthrough"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Video URL (YouTube) *</label>
              <div className="relative">
                <Youtube className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                <Input
                  type="url"
                  className="pl-9 font-medium"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Paste the full YouTube link or short link.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Description (Optional)</label>
              <Textarea
                rows={4}
                placeholder="Brief description of the property tour or video content..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none font-medium text-slate-700"
              />
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                <PlaySquare className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">Live Player Preview</h2>
            </div>
            
            {!videoUrl ? (
              <div className="flex flex-col items-center justify-center w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                <Youtube className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-400">No video URL provided</p>
                <p className="text-xs text-slate-400">Enter a link to see the preview</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-md border border-slate-200">
                  <iframe
                    className="w-full h-full"
                    src={getEmbedUrl(videoUrl)}
                    title="Video Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-1">Preview Success</h4>
                  <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                    If you can see and play the video above, it will render correctly on the public website.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
