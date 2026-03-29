// src/admin/Dashboard.jsx
import React from 'react';
import { CheckCircle, Clock, Home, MessageSquare, TrendingUp, ArrowRight, XCircle } from 'lucide-react';

// Indian Currency Formatter for Large Numbers (Crores/Lakhs)
const formatLargeCurrency = (value) => {
  const num = Number(value) || 0;
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} Lac`;
  return `₹ ${num.toLocaleString('en-IN')}`;
};

// Status Badge Styling Helper
const getStatusBadge = (status) => {
  switch(status?.toLowerCase()) {
    case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-amber-100 text-amber-700 border-amber-200'; // pending
  }
};

const StatCard = ({ title, value, icon: Icon, tone }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${tone}`}>
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);

export default function Dashboard({ properties = [], inquiries = [], role = 'agent', loading = false }) {
  // Calculate Stats
  const active = properties.filter((item) => item.status === 'approved').length;
  const pending = properties.filter((item) => item.status === 'pending').length;
  const rejected = properties.filter((item) => item.status === 'rejected').length;
  const totalValue = properties.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 capitalize">
          {role === 'admin' ? 'Admin Overview' : 'Broker Dashboard'}
        </h1>
        <p className="text-slate-500 mt-1.5 font-medium text-sm">
          Monitor your property portfolio, recent listings, and platform activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Listings" 
          value={loading ? '-' : properties.length} 
          icon={Home} 
          tone="bg-blue-50 text-blue-600 border border-blue-100" 
        />
        <StatCard 
          title="Active Properties" 
          value={loading ? '-' : active} 
          icon={CheckCircle} 
          tone="bg-emerald-50 text-emerald-600 border border-emerald-100" 
        />
        <StatCard 
          title="Pending Approval" 
          value={loading ? '-' : pending} 
          icon={Clock} 
          tone="bg-amber-50 text-amber-600 border border-amber-100" 
        />
        <StatCard 
          title="Total Inquiries" 
          value={loading ? '-' : inquiries.length} 
          icon={MessageSquare} 
          tone="bg-purple-50 text-purple-600 border border-purple-100" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
        
        {/* Left: Recent Properties */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-extrabold text-slate-900">Recently Added Properties</h2>
          </div>
          
          <div className="divide-y divide-slate-100 flex-1">
            {properties.slice(0, 6).map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group">
                <div>
                  <p className="font-bold text-slate-900 text-base line-clamp-1">{item.title || 'Untitled Property'}</p>
                  <div className="text-xs font-medium text-slate-500 mt-1 capitalize flex items-center gap-1.5">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.category || 'N/A'}</span>
                    <span>•</span>
                    <span>{item.city || 'Location N/A'}</span>
                    <span>•</span>
                    <span>{item.property_type || 'Type N/A'}</span>
                  </div>
                </div>
                
                <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <p className="font-extrabold text-[#003B30]">
                    {item.price ? `₹ ${Number(item.price).toLocaleString('en-IN')}` : 'Price on Request'}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                    {item.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
            
            {!loading && properties.length === 0 && (
              <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
                <Home className="w-8 h-8 mb-3 opacity-20" />
                <p className="font-medium text-sm">No properties found in your portfolio.</p>
              </div>
            )}
            
            {loading && (
              <div className="p-12 text-center text-slate-500 font-medium text-sm">
                Loading recent properties...
              </div>
            )}
          </div>
        </div>

        {/* Right: Portfolio Summary & Status Breakdown */}
        <div className="space-y-6">
          
          {/* Portfolio Value Card */}
          <div className="bg-[#003B30] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
              <TrendingUp className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-100">Est. Portfolio Value</h2>
              </div>
              
              <div className="text-5xl md:text-6xl font-black tracking-tight mb-2">
                {loading ? '...' : formatLargeCurrency(totalValue)}
              </div>
              
              <p className="text-emerald-100/70 text-sm font-medium mt-4">
                Cumulative value based on {properties.length} total listed properties across the platform.
              </p>
            </div>
          </div>

          {/* Quick Breakdown Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-5">Listing Health</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-900">Approved & Live</span>
                </div>
                <span className="text-lg font-black text-emerald-700">{active}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-bold text-amber-900">Pending Review</span>
                </div>
                <span className="text-lg font-black text-amber-700">{pending}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-bold text-red-900">Rejected Listings</span>
                </div>
                <span className="text-lg font-black text-red-700">{rejected}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
