// src/admin/YoutubeList.jsx
import React, { useState } from 'react';
import { Edit2, Search, Trash2, Plus, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AddVideo from './AddVideo'; // Form logic
import { useAuth } from '@/contexts/AuthContext';

export default function YoutubeList({ videos = [], refreshData, loading }) {
  const { api } = useAuth();
  const [search, setSearch] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const filteredVideos = videos.filter((v) => 
    v.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (payload) => {
    try {
      if (editingVideo) {
        await api.put(`/youtube-videos/${editingVideo.id}`, payload);
        toast.success("Video updated successfully!");
      } else {
        await api.post('/youtube-videos', payload);
        toast.success("Video published successfully!");
      }
      setIsAdding(false);
      setEditingVideo(null);
      refreshData();
    } catch (error) {
      toast.error("Failed to save video.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await api.delete(`/youtube-videos/${id}`);
      toast.success('Video deleted successfully.');
      refreshData();
    } catch (error) {
      toast.error('Failed to delete video.');
    }
  };

  if (isAdding || editingVideo) {
    return (
      <AddVideo 
        editing={editingVideo} 
        onSave={handleSave} 
        onCancel={() => { setIsAdding(false); setEditingVideo(null); }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Promotional Videos</h2>
          <p className="text-slate-500 text-sm mt-1">Manage YouTube property tours and promotions.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search videos..." 
              className="pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm min-w-[240px] focus:outline-none focus:border-slate-400" 
            />
          </div>
          <Button onClick={() => setIsAdding(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl h-11 px-5 shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add New Video
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Platform</th>
                <th className="p-4">Video Details</th>
                <th className="p-4">Added On</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVideos.map((video) => (
                <tr key={video.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 pl-6 w-20">
                    <div className="w-12 h-10 rounded-lg bg-red-50 flex items-center justify-center border border-red-100 text-red-500">
                      <Youtube className="w-6 h-6" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-base">{video.title}</div>
                    <a href={video.videoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 truncate max-w-sm block">
                      {video.videoUrl}
                    </a>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {new Date(video.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" onClick={() => setEditingVideo(video)} className="h-8 px-3 text-slate-600 font-bold shadow-none">
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(video.id)} className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600 shadow-none border-red-100">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredVideos.length && (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-500 font-medium">
                    {loading ? 'Loading videos...' : 'No promotional videos found.'}
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
