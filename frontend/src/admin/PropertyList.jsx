// src/admin/PropertyList.jsx
import React, { useMemo, useState } from 'react';
import { CheckCircle, Edit2, Search, Trash2, XCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyList({ 
  title = 'Property Management', 
  listings = [], 
  loading = false, 
  onEdit = () => {}, 
  onDelete = () => {}, 
  onApprove = () => {}, 
  onReject = () => {}, 
  showModeration = false 
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Search and Filter Logic (Made Bulletproof)
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const term = search.toLowerCase();
      const searchableFields = [item.title, item.city, item.location, item.property_type, item.category];
      
      const matchesSearch = searchableFields
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
      
      // Ensure we safely handle missing statuses and casing
      const itemStatus = (item.status || 'pending').toLowerCase();
      const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [listings, search, statusFilter]);

  // Status Badge Styling Helper
  const getStatusBadge = (status) => {
    switch((status || 'pending').toLowerCase()) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200'; // Pending
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">Search, edit, approve, reject, or delete records.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search properties..." 
              className="pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-200 min-w-[260px] text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400" 
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6 whitespace-nowrap">Property Detail</th>
                <th className="p-4 whitespace-nowrap">Type & Category</th>
                <th className="p-4 whitespace-nowrap">Price</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 pr-6 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {filteredListings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Property Details */}
                  <td className="p-4 pl-6">
                    <div className="font-bold text-slate-900 text-base line-clamp-1">{item.title || 'Untitled Property'}</div>
                    <div className="text-xs font-medium text-slate-500 mt-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 shrink-0" />
                      <span className="truncate max-w-[200px]">{item.location || 'N/A'}, {item.city || 'N/A'}</span>
                    </div>
                  </td>
                  
                  {/* Category & Type */}
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-700 capitalize">{item.category || 'N/A'}</div>
                    <div className="text-xs text-slate-500 mt-1 capitalize">{item.property_type || 'N/A'}</div>
                  </td>
                  
                  {/* Price */}
                  <td className="p-4">
                    <div className="font-extrabold text-[#003B30]">
                      {item.price ? `₹ ${Number(item.price).toLocaleString('en-IN')}` : 'Price on Request'}
                    </div>
                  </td>
                  
                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                      {item.status || 'Pending'}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      
                      {/* Moderation Actions (Admin Only & Pending Status) */}
                      {showModeration && (item.status || 'pending').toLowerCase() === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => onApprove(item.id)} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 h-8 px-2 shadow-none">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" onClick={() => onReject(item.id)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 h-8 px-2 shadow-none">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {/* Standard Actions (Edit always available now) */}
                      <Button size="sm" variant="outline" onClick={() => onEdit(item)} className="h-8 px-3 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-none font-bold">
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                      </Button>
                      
                      <Button size="sm" variant="outline" onClick={() => onDelete(item.id)} className="h-8 px-2 text-slate-400 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-none">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Empty State */}
              {!filteredListings.length && (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 mb-3 opacity-20" />
                      <p className="text-sm font-medium">{loading ? 'Loading properties...' : `No ${statusFilter === 'all' ? '' : statusFilter} properties found.`}</p>
                    </div>
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
