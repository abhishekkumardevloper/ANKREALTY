import React, { useMemo, useState } from 'react';
import { CheckCircle, Clock, Edit2, Search, Trash2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyList({ title = 'Property Management', listings = [], loading = false, onEdit = () => {}, onDelete = () => {}, onApprove = () => {}, onReject = () => {}, showModeration = false }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredListings = useMemo(() => listings.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch = [item.title, item.city, item.location, item.property_type, item.category].filter(Boolean).some((value) => String(value).toLowerCase().includes(term));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [listings, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          <p className="text-slate-500">Search, edit, approve, reject, or delete property records.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search properties..." className="pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 min-w-[240px]" /></div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200"><option value="all">All Statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold"><tr><th className="p-4">Property</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredListings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4"><div className="font-bold text-slate-900">{item.title}</div><div className="text-sm text-slate-500">{item.location}, {item.city}</div></td>
                  <td className="p-4 text-sm capitalize">{item.category} • {item.property_type}</td>
                  <td className="p-4 font-bold">₹ {Number(item.price || 0).toLocaleString('en-IN')}</td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span></td>
                  <td className="p-4"><div className="flex flex-wrap gap-2">{showModeration && item.status === 'pending' && <><Button size="sm" onClick={() => onApprove(item.id)} className="bg-emerald-600 hover:bg-emerald-700"><CheckCircle className="w-4 h-4 mr-1" />Approve</Button><Button size="sm" variant="outline" onClick={() => onReject(item.id)} className="text-red-600 border-red-200"><XCircle className="w-4 h-4 mr-1" />Reject</Button></>}{item.status !== 'pending' && <Button size="sm" variant="outline" onClick={() => onEdit(item)}><Edit2 className="w-4 h-4 mr-1" />Edit</Button>}<Button size="sm" variant="outline" onClick={() => onDelete(item.id)} className="text-slate-600"><Trash2 className="w-4 h-4 mr-1" />Delete</Button></div></td>
                </tr>
              ))}
              {!filteredListings.length && <tr><td colSpan="5" className="p-8 text-center text-slate-500">{loading ? 'Loading properties...' : 'No properties found.'}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
