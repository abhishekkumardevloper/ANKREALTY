// src/admin/AddBlog.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Image as ImageIcon, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AddBlog({ onSave, editing, onCancel }) {
  const [form, setForm] = useState({ title: '', excerpt: '', content: '' });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || '',
        excerpt: editing.excerpt || '',
        content: editing.content || ''
      });
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      return toast.error("Title and Content are required.");
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('excerpt', form.excerpt);
    formData.append('content', form.content);
    if (image) formData.append('image', image);

    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <button type="button" onClick={onCancel} className="text-slate-500 hover:text-[#8B0000] mb-2 flex items-center text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Blogs
          </button>
          <h1 className="text-2xl font-black text-slate-900">{editing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
        </div>
      </div>

      <form className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-widest">Blog Title *</label>
          <input required name="title" placeholder="e.g. Real Estate Trends 2026" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-widest">Short Excerpt (Intro)</label>
          <input name="excerpt" placeholder="A brief summary of the article..." value={form.excerpt} onChange={(e) => setForm({...form, excerpt: e.target.value})} className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-widest">Cover Image</label>
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 ${image || (editing && editing.imageUrl) ? 'border-emerald-500 bg-emerald-50' : 'border-dashed border-slate-300 hover:bg-slate-50 hover:border-[#D4AF37]'} rounded-xl cursor-pointer transition-colors`}>
             {image || (editing && editing.imageUrl) ? (
                 <div className="flex flex-col items-center text-emerald-600">
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <span className="text-sm font-bold">{image ? image.name : 'Existing Image Attached'}</span>
                 </div>
             ) : (
                 <div className="flex flex-col items-center text-slate-400">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-bold">Upload Cover Image (JPG, PNG)</span>
                 </div>
             )}
             <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
          </label>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-widest">Full Content *</label>
          <textarea required name="content" rows={10} placeholder="Write your blog content here..." value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 resize-y" />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
           <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-6 rounded-xl font-bold border-slate-200 text-slate-600">Cancel</Button>
           <Button type="submit" disabled={isSubmitting} className="bg-[#003B30] hover:bg-[#00261c] text-white font-bold h-12 px-8 rounded-xl shadow-lg">
             {isSubmitting ? 'Saving...' : (editing ? 'Update Blog' : 'Publish Blog')} <Save className="w-4 h-4 ml-2" />
           </Button>
        </div>
      </form>
    </div>
  );
}
