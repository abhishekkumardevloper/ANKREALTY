import React from 'react';
import { CheckCircle, Clock, Home, MessageSquare, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, tone }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${tone}`}><Icon className="w-7 h-7" /></div>
    <div>
      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);

export default function Dashboard({ properties = [], inquiries = [], role = 'agent', loading = false }) {
  const active = properties.filter((item) => item.status === 'approved').length;
  const pending = properties.filter((item) => item.status === 'pending').length;
  const rejected = properties.filter((item) => item.status === 'rejected').length;
  const totalValue = properties.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900">{role === 'admin' ? 'Admin overview' : 'Agent overview'}</h1>
        <p className="text-slate-500 mt-1 font-medium">Monitor listing quality, approvals, and lead activity from the real backend data.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Properties" value={loading ? '-' : properties.length} icon={Home} tone="bg-blue-50 text-blue-600" />
        <StatCard title="Approved" value={loading ? '-' : active} icon={CheckCircle} tone="bg-emerald-50 text-emerald-600" />
        <StatCard title="Pending" value={loading ? '-' : pending} icon={Clock} tone="bg-amber-50 text-amber-600" />
        <StatCard title="Inquiries" value={loading ? '-' : inquiries.length} icon={MessageSquare} tone="bg-purple-50 text-purple-600" />
      </div>
      <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100"><h2 className="text-xl font-bold text-slate-900">Recent properties</h2></div>
          <div className="divide-y divide-slate-100">
            {properties.slice(0, 6).map((item) => (
              <div key={item.id} className="p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.city} • {item.category} • {item.property_type}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">₹ {Number(item.price || 0).toLocaleString('en-IN')}</p>
                  <p className="text-xs uppercase tracking-wider text-slate-400">{item.status}</p>
                </div>
              </div>
            ))}
            {!properties.length && <div className="p-8 text-center text-slate-500">No properties available.</div>}
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-5"><TrendingUp className="w-6 h-6 text-green-400" /><h2 className="text-lg font-bold uppercase tracking-widest text-slate-300">Portfolio Value</h2></div>
          <div className="text-5xl font-black font-mono">₹ {loading ? '...' : totalValue.toLocaleString('en-IN')}</div>
          <p className="text-slate-400 mt-3">Based on {properties.length} property records currently available in the dashboard.</p>
          <div className="mt-8 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Approved listings</span><span className="font-bold">{active}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Pending approvals</span><span className="font-bold">{pending}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Rejected listings</span><span className="font-bold">{rejected}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
