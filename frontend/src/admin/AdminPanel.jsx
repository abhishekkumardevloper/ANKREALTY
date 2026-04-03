// src/admin/AdminPanel.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import PropertyList from './PropertyList';
import AddProperty from './AddProperty';
import BlogList from './BlogList'; // Will provide next
import YoutubeList from './YoutubeList'; // Will provide next
import LeadManager from './LeadManager'; // Will provide next
import { useAuth } from '@/contexts/AuthContext';

// Helper function to safely extract FastAPI error messages
const getErrorMessage = (error) => {
  if (error?.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const fieldName = detail[0].loc ? detail[0].loc[detail[0].loc.length - 1] : 'Field';
      return `Error in ${fieldName}: ${detail[0].msg}`;
    }
  }
  return error?.message || 'An unexpected error occurred.';
};

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
        let adminDashData = { pending_list: [] };
        let propsData = [];
        let inqData = [];
        let blogData = [];
        let videoData = [];

        try { const res = await api.get('/dashboard/admin'); adminDashData = res.data || {}; } catch(e) { console.error(e); }
        try { const res = await api.get('/properties?limit=100'); propsData = res.data || []; } catch(e) { console.error(e); }
        try { const res = await api.get('/inquiries'); inqData = res.data || []; } catch(e) { console.error(e); }
        try { const res = await api.get('/blogs'); blogData = res.data || []; } catch(e) { console.error(e); }
        try { const res = await api.get('/youtube-videos'); videoData = res.data || []; } catch(e) { console.error(e); }
        
        const pendingList = adminDashData?.pending_list || [];
        const merged = [...pendingList, ...(propsData || []).filter((item) => !pendingList.some((pending) => pending?.id === item?.id))];
        
        setProperties(merged);
        setInquiries(inqData || []);
        setBlogs(blogData || []);
        setYoutubeVideos(videoData || []);

      } else {
        const agentDash = await api.get('/dashboard/agent');
        setProperties(agentDash?.data?.properties || []);
        setInquiries(agentDash?.data?.inquiries || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [api, isAdmin]);

  useEffect(() => { 
    fetchAllData(); 
  }, [fetchAllData]);

  const filteredByPage = useMemo(() => {
    const safeProperties = properties || [];
    if (!['buy', 'resale', 'client-project'].includes(page)) return safeProperties;
    return safeProperties.filter((item) => item?.category === page);
  }, [page, properties]);

  // --- SAVE PROPERTY ---
  const saveProperty = async (payload) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editing) {
        await api.put(`/properties/${editing.id}`, payload, config);
        toast.success('Property updated successfully.');
      } else {
        await api.post('/properties', payload, config);
        toast.success('Property created successfully.');
      }
      setEditing(null);
      setPage('dashboard');
      fetchAllData();
    } catch (error) {
      console.error("Save Property Error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  // --- DELETE PROPERTY ---
  const deleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
    
    try {
      await api.delete(`/properties/${id}`);
      toast.success("Property deleted successfully.");
      fetchAllData(); 
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  // --- APPROVE/REJECT PROPERTY ---
  const updatePropertyStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this property as ${status}?`)) return;

    try {
      await api.put(`/admin/properties/${id}/status?status=${status}`);
      toast.success(`Property marked as ${status}.`);
      fetchAllData();
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  const renderPage = () => {
    if (page === 'dashboard') {
      return <Dashboard properties={properties} inquiries={inquiries} role={userRole} loading={loading} onDelete={deleteProperty} />;
    }
    
    if (page === 'crm') {
      return <LeadManager inquiries={inquiries} loading={loading} />;
    }
    
    if (page === 'add-property') {
      return <AddProperty onSave={saveProperty} editing={editing} onCancel={() => { setEditing(null); setPage('dashboard'); }} />;
    }
    
    if (['buy', 'resale', 'client-project'].includes(page)) {
      const titleMap = { 'buy': 'Buy Properties', 'resale': 'Resale Properties', 'client-project': 'Corporate Leases' };
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

    if (page === 'blogs' && isAdmin) return <BlogList blogs={blogs} refreshData={fetchAllData} loading={loading} />;
    if (page === 'youtube' && isAdmin) return <YoutubeList videos={youtubeVideos} refreshData={fetchAllData} loading={loading} />;

    return <Dashboard properties={properties} inquiries={inquiries} role={userRole} loading={loading} onDelete={deleteProperty} />;
  };

  return (
    <AdminLayout page={page} setPage={(next) => { setEditing(null); setPage(next); }} role={userRole}>
      {renderPage()}
    </AdminLayout>
  );
}
