import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import PropertyList from './PropertyList';
import AddProperty from './AddProperty';
// New components you will need to create/import
import BlogList from './BlogList'; 
import YoutubeList from './YoutubeList';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPanel() {
  const { user, api } = useAuth();
  const userRole = user?.role || localStorage.getItem('role') || 'agent';
  const isAdmin = userRole === 'admin';
  
  const [page, setPage] = useState('dashboard');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        // Added API calls for blogs and youtube videos
        const [adminDash, allProperties, allInquiries, allBlogs, allVideos] = await Promise.all([
          api.get('/dashboard/admin'),
          api.get('/properties?limit=100'),
          api.get('/inquiries'),
          api.get('/blogs').catch(() => ({ data: [] })), // Graceful fallback if API isn't ready
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

  // Updated to include 'buy', 'resale', and 'client-project'
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

  const deleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.delete(`/properties/${propertyId}`);
      toast.success('Property deleted successfully.');
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete property.');
    }
  };

  const updatePropertyStatus = async (propertyId, status) => {
    try {
      await api.put(`/admin/properties/${propertyId}/status?status=${status}`);
      toast.success(`Property ${status} successfully.`);
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update property status.');
    }
  };

  const renderPage = () => {
    // 1. Dashboard
    if (page === 'dashboard') {
      return <Dashboard properties={properties} inquiries={inquiries} role={userRole} loading={loading} />;
    }
    
    // 2. Add / Edit Property
    if (page === 'add-property') {
      return <AddProperty onSave={saveProperty} editing={editing} onCancel={() => { setEditing(null); setPage('dashboard'); }} />;
    }
    
    // 3. Property Listings (Buy, Resale, Client Projects)
    if (['buy', 'resale', 'client-project'].includes(page)) {
      const titleMap = {
        'buy': 'Buy Properties',
        'resale': 'Resale Properties',
        'client-project': 'Client Posted Projects'
      };
      return (
        <PropertyList 
          title={titleMap[page]} 
          listings={filteredByPage} 
          loading={loading} 
          onEdit={(item) => { setEditing(item); setPage('add-property'); }} 
          onDelete={deleteProperty} 
          onApprove={(id) => updatePropertyStatus(id, 'approved')} 
          onReject={(id) => updatePropertyStatus(id, 'rejected')} 
          showModeration={isAdmin} 
        />
      );
    }

    // 4. Blogs Section (Admin Only)
    if (page === 'blogs' && isAdmin) {
      return <BlogList blogs={blogs} refreshData={fetchAllData} loading={loading} />;
    }

    // 5. YouTube Promotions Section (Admin Only)
    if (page === 'youtube' && isAdmin) {
      return <YoutubeList videos={youtubeVideos} refreshData={fetchAllData} loading={loading} />;
    }

    // Fallback
    return <Dashboard properties={properties} inquiries={inquiries} role={userRole} loading={loading} />;
  };

  return (
    <AdminLayout 
      page={page} 
      setPage={(next) => { 
        setEditing(null); 
        setPage(next); 
      }} 
      role={userRole}
    >
      {renderPage()}
    </AdminLayout>
  );
}
