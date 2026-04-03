// src/admin/AddVideo.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AddVideo({ onSave, editing, onCancel }) {
  const [form, setForm] = useState({ title: '', videoUrl: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || '',
        videoUrl: editing.videoUrl || '',
        description: editing.description || ''
      });
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.videoUrl) {
      return toast.error("Title and YouTube Link are required.");
    }
    
    setIsSubmitting(true);
    await onSave(form); // Directly sending JSON as per original backend setup
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <button type="button" onClick={onCancel} className="text-slate-500 hover:text-[#8B0000] mb-2 flex items-center text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Videos
          </button>
          <h1 className="text-2xl font-black text-slate-900">{editing ? 'Edit YouTube Video' : 'Add New YouTube Video'}</h1>
        </div>
      </div>

      <form className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6" onSubmit={handleSubmit}>
        
        <div className="flex items-center gap-4 bg-red-50 p-4 rounded-xl border border-red-100">
           <Youtube className="w-8 h-8 text-red-600" />
           <p className="text-sm font-medium text-red-900">Make sure your link is a valid YouTube Watch URL or Embed URL.</p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-widest">Video Title *</label>
          <input required name="title" placeholder="e.g. 4BHK Villa Tour in Sector 150" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-widest">YouTube URL *</label>
          <input required type="url" name="videoUrl" placeholder="https://www.youtube.com/watch?v=..." value={form.videoUrl} onChange={(e) => setForm({...form, videoUrl: e.target.value})} className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-widest">Short Description</label>
          <textarea name="description" rows={4} placeholder="Brief details about the video..." value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 resize-y" />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
           <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-6 rounded-xl font-bold border-slate-200 text-slate-600">Cancel</Button>
           <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg">
             {isSubmitting ? 'Saving...' : (editing ? 'Update Video' : 'Add Video')} <Save className="w-4 h-4 ml-2" />
           </Button>
        </div>
      </form>
    </div>
  );
}
