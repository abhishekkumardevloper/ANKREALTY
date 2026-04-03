// src/admin/BlogList.jsx
import React, { useState } from 'react';
import { Edit2, Search, Trash2, Plus, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AddBlog from './AddBlog'; // Forms logic in separate file
import { useAuth } from '@/contexts/AuthContext';

export default function BlogList({ blogs = [], refreshData, loading }) {
  const { api } = useAuth();
  const [search, setSearch] = useState('');
  
  // States to toggle between Table view and Form view
  const [isAdding, setIsAdding] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const filteredBlogs = blogs.filter((b) => 
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (formData) => {
    try {
      if (editingBlog) {
        await api.put(`/blogs/${editingBlog.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Blog updated successfully!");
      } else {
        await api.post('/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Blog published successfully!");
      }
      setIsAdding(false);
      setEditingBlog(null);
      refreshData();
    } catch (error) {
      toast.error("Failed to save blog.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted successfully.');
      refreshData();
    } catch (error) {
      toast.error('Failed to delete blog.');
    }
  };

  // If adding or editing, render the AddBlog form component instead of the table
  if (isAdding || editingBlog) {
    return (
      <AddBlog 
        editing={editingBlog} 
        onSave={handleSave} 
        onCancel={() => { setIsAdding(false); setEditingBlog(null); }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Blog Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage news, articles, and insights.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search blogs..." 
              className="pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm min-w-[240px] focus:outline-none focus:border-slate-400" 
            />
          </div>
          <Button onClick={() => setIsAdding(true)} className="bg-[#003B30] hover:bg-[#00261c] text-white font-bold rounded-xl h-11 px-5 shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add New Blog
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Cover</th>
                <th className="p-4">Article Details</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 pl-6 w-24">
                    {blog.imageUrl ? (
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200">
                        <img src={blog.imageUrl} alt="cover" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-base line-clamp-1">{blog.title}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1 flex items-center">
                      <FileText className="w-3 h-3 mr-1" /> {blog.excerpt || 'No excerpt provided'}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" onClick={() => setEditingBlog(blog)} className="h-8 px-3 text-slate-600 font-bold shadow-none">
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(blog.id)} className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600 shadow-none border-red-100">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredBlogs.length && (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-500 font-medium">
                    {loading ? 'Loading blogs...' : 'No blog posts found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
