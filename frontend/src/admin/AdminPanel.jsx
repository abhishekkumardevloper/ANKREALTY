// src/admin/BlogManager.jsx
import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function BlogManager() {
  const { api } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '' });
  const [image, setImage] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data || []);
    } catch (e) {}
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('excerpt', form.excerpt);
    formData.append('content', form.content);
    if (image) formData.append('image', image);

    try {
      await api.post('/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      toast.success("Blog published!");
      setIsAdding(false);
      setForm({ title: '', excerpt: '', content: '' }); setImage(null);
      fetchBlogs();
    } catch (e) { toast.error("Failed to publish."); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Deleted.");
      fetchBlogs();
    } catch (e) {}
  };

  if (isAdding) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">Write New Blog</h2>
          <button onClick={() => setIsAdding(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500" /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="text-xs font-bold text-slate-500">Title</label><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full h-11 px-4 border rounded-xl" /></div>
          <div><label className="text-xs font-bold text-slate-500">Short Excerpt</label><input required value={form.excerpt} onChange={e=>setForm({...form, excerpt: e.target.value})} className="w-full h-11 px-4 border rounded-xl" /></div>
          <div>
            <label className="text-xs font-bold text-slate-500">Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded-xl text-sm" />
          </div>
          <div><label className="text-xs font-bold text-slate-500">Full Content</label><textarea required value={form.content} onChange={e=>setForm({...form, content: e.target.value})} className="w-full p-4 border rounded-xl" rows={8} /></div>
          <Button type="submit" className="w-full bg-[#003B30] hover:bg-[#00261c] text-white font-bold h-12 rounded-xl">Publish Blog</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex justify-between items-center shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">Blog Posts</h2>
        <Button onClick={() => setIsAdding(true)} className="bg-[#003B30] hover:bg-[#00261c] text-white font-bold rounded-xl"><Plus className="w-4 h-4 mr-2" /> Write Post</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map(b => (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {b.imageUrl ? <img src={b.imageUrl} className="w-full h-40 object-cover" /> : <div className="w-full h-40 bg-slate-100 flex items-center justify-center"><ImageIcon className="text-slate-300" /></div>}
            <div className="p-5">
              <h3 className="font-bold text-slate-900 truncate mb-1">{b.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{b.excerpt}</p>
              <button onClick={() => handleDelete(b.id)} className="text-xs font-bold text-red-500 flex items-center"><Trash2 className="w-3 h-3 mr-1" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
