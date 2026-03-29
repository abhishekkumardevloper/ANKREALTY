// src/admin/AdminPanel.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import PropertyList from './PropertyList';
import AddProperty from './AddProperty';

// YAHAN CHANGES KIYE HAIN: 
// Hum aapki existing files (Addblog aur Addvideo) ko hi list ki tarah use karenge
import BlogList from './AddBlog'; 
import YoutubeList from './AddVideo';

import { useAuth } from '@/contexts/AuthContext';

export default function AdminPanel() {
  const { user, api } = useAuth();
  const userRole = user?.role || localStorage.getItem('role') || 'agent';
  const isAdmin = userRole === 'admin';
  
  const [page, setPage] = useState('dashboard');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const [adminDash, allProperties, allInquiries, allBlogs, allVideos] = await Promise.all([
          api.get('/dashboard/admin'),
          api.get('/properties?limit=100'),
          api.get('/inquiries'),
          api.get('/blogs').catch(() => ({ data: [] })),
          api.get('/youtube-videos').catch(() => ({ data: [] })),
        ]);
        
        const pendingList = adminDash.data.pending_list || [];
        const merged = [...pendingList, ...(allProperties.data || []).filter((item) => !pendingList.some((pending) => pending.id === item.id))];
        
        setProperties(merged);
        setInquiries(allInquiries.data || []);
        setBlogs(allBlogs.data || []);
        setYoutubeVideos(allVideos.data || []);
      } else {
        const [agentDash] = await Promise.all([api.get('/dashboard/agent')]);
        setProperties(agentDash.data.properties || []);
        setInquiries(agentDash.data.inquiries || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load admin panel data.');
    } finally {
      setLoading(false);
    }
  }, [api, isAdmin]);

  useEffect(() => { 
    fetchAllData(); 
  }, [fetchAllData]);

  const filteredByPage = useMemo(() => {
    if (!['buy', 'resale', 'client-project'].includes(page)) return properties;
    return properties.filter((item) => item.category === page);
  }, [page, properties]);

  const saveProperty = async (payload) => {
    try {
      if (editing) {
        await api.put(`/properties/${editing.id}`, payload);
        toast.success('Property updated successfully.');
      } else {
        await api.post('/properties', payload);
        toast.success('Property created successfully.');
      }
      setEditing(null);
      setPage('dashboard');
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to save property.');
    }
  };

  const renderPage = () => {
    if (page === 'dashboard') return <Dashboard properties={properties} inquiries={inquiries} role={userRole} loading={loading} />;
    
    if (page === 'add-property') return <AddProperty onSave={saveProperty} editing={editing} onCancel={() => { setEditing(null); setPage('dashboard'); }} />;
    
    if (['buy', 'resale', 'client-project'].includes(page)) {
      const titleMap = { 'buy': 'Buy Properties', 'resale': 'Resale Properties', 'client-project': 'Client Projects' };
      return <PropertyList title={titleMap[page]} listings={filteredByPage} loading={loading} onEdit={(item) => { setEditing(item); setPage('add-property'); }} showModeration={isAdmin} />;
    }

    // Yahan hum aapki files ko render kar rahe hain
    if (page === 'blogs' && isAdmin) return <BlogList blogs={blogs} refreshData={fetchAllData} loading={loading} />;
    if (page === 'youtube' && isAdmin) return <YoutubeList videos={youtubeVideos} refreshData={fetchAllData} loading={loading} />;

    return <Dashboard properties={properties} inquiries={inquiries} role={userRole} loading={loading} />;
  };

  return (
    <AdminLayout page={page} setPage={(next) => { setEditing(null); setPage(next); }} role={userRole}>
      {renderPage()}
    </AdminLayout>
  );
}
