// src/admin/LeadManager.jsx
import React, { useState, useMemo } from 'react';
import { 
  Search, Mail, Phone, Clock, MessageSquare, Building, 
  Home, Plus, X, CheckCircle, Users, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function LeadManager({ inquiries = [], loading, refreshData }) {
  const { api } = useAuth();
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, corporate, property
  
  // Manual Lead Addition State
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    interest: '',
    message: ''
  });

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
    const total = inquiries.length;
    const corporate = inquiries.filter(i => i.property_id?.toLowerCase().includes('corporate')).length;
    const property = total - corporate;
    return { total, corporate, property };
  }, [inquiries]);

  // --- FILTERING LOGIC ---
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      // Search Match
      const searchString = `${inq.from_user_name} ${inq.message} ${inq.property_id} ${inq.phone}`.toLowerCase();
      const matchesSearch = searchString.includes(search.toLowerCase());
      
      // Type Match
      const isCorporate = inq.property_id?.toLowerCase().includes('corporate');
      let matchesFilter = true;
      if (filter === 'corporate') matchesFilter = isCorporate;
      if (filter === 'property') matchesFilter = !isCorporate;

      return matchesSearch && matchesFilter;
    });
  }, [inquiries, search, filter]);

  // --- ADD MANUAL LEAD ---
  const handleAddLead = async (e) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) return toast.error("Name and Phone are required.");
    
    setIsSubmitting(true);
    try {
      // Using the public contacts endpoint to dump lead directly into CRM
      await api.post('/contacts', {
        name: newLead.name,
        phone: newLead.phone,
        email: newLead.email || 'N/A',
        interest: newLead.interest || 'Manual Entry',
        message: newLead.message
      });
      
      toast.success("Lead added successfully!");
      setIsAddLeadOpen(false);
      setNewLead({ name: '', phone: '', email: '', interest: '', message: '' });
      if (refreshData) refreshData();
    } catch (error) {
      toast.error("Failed to add lead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      
      {/* HEADER ROW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Lead CRM</h2>
          <p className="text-slate-500 text-sm mt-1">Manage web contacts, corporate inquiries, and property leads.</p>
        </div>
        <Button onClick={() => setIsAddLeadOpen(true)} className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl h-11 px-6 shadow-md transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Manual Lead
        </Button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Leads</p>
            <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Property Inquiries</p>
            <p className="text-2xl font-black text-slate-900">{stats.property}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Corporate Leases</p>
            <p className="text-2xl font-black text-slate-900">{stats.corporate}</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search by name, phone, message, or property..." 
            className="w-full pl-12 pr-4 h-12 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 shadow-sm transition-all" 
          />
        </div>
        <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm shrink-0">
          {['all', 'property', 'corporate'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 h-10 rounded-lg text-sm font-bold capitalize transition-all ${filter === f ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* LEADS LIST */}
      <div className="space-y-4">
        {filteredInquiries.map(lead => {
          const isCorp = lead.property_id?.toLowerCase().includes('corporate');
          return (
            <div key={lead.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md hover:border-slate-300 transition-all">
              
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${isCorp ? 'bg-purple-50 border-purple-100 text-purple-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                    {isCorp ? <Building className="w-5 h-5" /> : <Home className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-none">{lead.from_user_name || 'Anonymous User'}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${isCorp ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {isCorp ? 'Corporate Lead' : 'Property Lead'}
                      </span>
                      <span className="text-xs font-bold text-slate-400 flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(lead.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 font-medium leading-relaxed mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Inquiry Details / Message</span>
                  {lead.message}
                </div>
                
                {/* Reference ID / Source */}
                <div className="text-xs font-bold text-slate-500 bg-slate-100 inline-flex px-3 py-1.5 rounded-lg border border-slate-200">
                  Source ID: <span className="text-slate-800 ml-1">{lead.property_id}</span>
                </div>
              </div>

              {/* Right Content / Actions */}
              <div className="flex flex-row md:flex-col gap-3 md:w-48 shrink-0 md:border-l md:border-slate-100 md:pl-6">
                <p className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Quick Actions</p>
                
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold h-11 rounded-xl transition-colors">
                    <Phone className="w-4 h-4" /> Call Lead
                  </a>
                )}
                
                {lead.phone && (
                  <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#075E54] font-bold h-11 rounded-xl transition-colors">
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>
                )}

                <a href={`mailto:dummy@email.com`} className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold h-11 rounded-xl transition-colors">
                  <Mail className="w-4 h-4" /> Email
                </a>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {!loading && filteredInquiries.length === 0 && (
          <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-1">No Leads Found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search or filter settings.</p>
          </div>
        )}
        
        {loading && (
          <div className="p-12 text-center text-slate-500 font-medium">Loading your CRM data...</div>
        )}
      </div>

      {/* --- ADD LEAD MODAL --- */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-900">Add Manual Lead</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Record an offline contact</p>
              </div>
              <button onClick={() => setIsAddLeadOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddLead} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-widest">Client Name *</label>
                <Input required value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} placeholder="e.g. Rahul Sharma" className="h-12 border-slate-200 focus:border-[#8B0000]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-widest">Phone *</label>
                  <Input required type="tel" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} placeholder="+91..." className="h-12 border-slate-200 focus:border-[#8B0000]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-widest">Email</label>
                  <Input type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} placeholder="Email address" className="h-12 border-slate-200 focus:border-[#8B0000]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-widest">Interested In (Property / Service)</label>
                <Input value={newLead.interest} onChange={e => setNewLead({...newLead, interest: e.target.value})} placeholder="e.g. 3BHK in Sector 150 or Corporate Lease" className="h-12 border-slate-200 focus:border-[#8B0000]" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-widest">Lead Notes</label>
                <Textarea value={newLead.message} onChange={e => setNewLead({...newLead, message: e.target.value})} rows={3} placeholder="Budget, timeline, specific requirements..." className="border-slate-200 focus:border-[#8B0000] resize-none" />
              </div>
              
              <div className="pt-2 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddLeadOpen(false)} className="flex-1 h-12 rounded-xl font-bold border-slate-200 text-slate-600">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl shadow-md">
                  {isSubmitting ? 'Saving...' : 'Save Lead'} <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
