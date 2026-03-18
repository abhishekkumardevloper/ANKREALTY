import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Home, MessageSquare, Phone, Search, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function CrmDashboard() {
  const { api, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState({ total_listings: 0, total_views: 0, total_inquiries: 0, properties: [], inquiries: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard/agent');
        setData(response.data);
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load CRM dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  const filteredProperties = useMemo(() => data.properties.filter((item) => [item.title, item.city, item.location].filter(Boolean).some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))), [data.properties, searchTerm]);
  const filteredInquiries = useMemo(() => data.inquiries.filter((item) => [item.from_user_name, item.message, item.property_id].filter(Boolean).some((field) => String(field).toLowerCase().includes(searchTerm.toLowerCase()))), [data.inquiries, searchTerm]);

  const stats = [
    { title: 'Total Leads', value: data.total_inquiries, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { title: 'Active Properties', value: data.total_listings, icon: Home, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Property Views', value: data.total_views, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Scheduled Follow Ups', value: filteredInquiries.length, icon: Calendar, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-950"><h1 className="text-2xl font-black text-white tracking-tight">ANK Realty<span className="text-red-500">.</span><span className="text-sm font-medium text-slate-500 ml-2">CRM</span></h1></div>
        <nav className="flex-1 py-6 px-4 space-y-2">{[{ id: 'dashboard', label: 'Dashboard' }, { id: 'properties', label: 'Properties' }, { id: 'inquiries', label: 'Leads / Inquiries' }].map((item) => <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left px-4 py-3 rounded-xl font-medium ${activeTab === item.id ? 'bg-red-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>{item.label}</button>)}</nav>
        <div className="p-4 border-t border-slate-800"><div className="mt-4 flex items-center gap-3 px-4 py-2"><div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">{user?.name?.charAt(0) || 'A'}</div><div><p className="text-sm font-bold text-white">{user?.name || 'Agent User'}</p><p className="text-xs text-slate-500">{user?.role || 'agent'}</p></div></div></div>
      </aside>
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10"><h2 className="text-2xl font-bold text-slate-800 capitalize">{activeTab}</h2><div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input placeholder="Search leads or properties..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-80 bg-slate-50 border-slate-200" /></div></header>
        <div className="p-8 flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <div className="space-y-8"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{stats.map((stat) => <div key={stat.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"><div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}><stat.icon className="w-7 h-7" /></div><div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p><h3 className="text-2xl font-black text-slate-900">{loading ? '-' : stat.value}</h3></div></div>)}</div><div className="bg-white rounded-2xl border border-slate-100 p-6"><h3 className="text-lg font-bold text-slate-900 mb-4">Recent leads</h3><div className="space-y-3">{filteredInquiries.slice(0, 5).map((lead) => <div key={lead.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100"><div className="flex items-center justify-between gap-4"><div><p className="font-bold text-slate-900">{lead.from_user_name}</p><p className="text-sm text-slate-500">{lead.message}</p></div><span className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</span></div></div>)}{!filteredInquiries.length && <div className="text-slate-500">No inquiries available yet.</div>}</div></div></div>}
          {activeTab === 'properties' && <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"><div className="p-6 border-b border-slate-100 flex items-center justify-between"><h3 className="text-lg font-bold text-slate-900">Managed properties</h3><Button className="bg-slate-900 hover:bg-black" onClick={() => window.location.href='/post-property'}>Post property</Button></div><div className="divide-y divide-slate-100">{filteredProperties.map((item) => <div key={item.id} className="p-5 flex items-center justify-between gap-4"><div><p className="font-bold text-slate-900">{item.title}</p><p className="text-sm text-slate-500">{item.location}, {item.city}</p></div><div className="text-right"><p className="font-black text-slate-900">₹ {Number(item.price || 0).toLocaleString('en-IN')}</p><p className="text-xs text-slate-400 uppercase">{item.status}</p></div></div>)}{!filteredProperties.length && <div className="p-8 text-slate-500">No properties found.</div>}</div></div>}
          {activeTab === 'inquiries' && <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"><div className="p-6 border-b border-slate-100"><h3 className="text-lg font-bold text-slate-900">Lead management</h3></div><div className="divide-y divide-slate-100">{filteredInquiries.map((item) => <div key={item.id} className="p-5 flex items-start justify-between gap-4"><div><p className="font-bold text-slate-900">{item.from_user_name}</p><p className="text-sm text-slate-500 mt-1">{item.message}</p><p className="text-xs text-slate-400 mt-2">Property ID: {item.property_id}</p></div><div className="flex flex-col gap-2"><a href={`tel:${(item.from_user_name || '').replace(/\s+/g, '')}`}><Button variant="outline" size="sm"><Phone className="w-4 h-4 mr-1" /> Call</Button></a></div></div>)}{!filteredInquiries.length && <div className="p-8 text-slate-500">No leads matched your search.</div>}</div></div>}
        </div>
      </main>
    </div>
  );
}
