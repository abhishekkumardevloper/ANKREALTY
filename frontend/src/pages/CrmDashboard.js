// src/admin/CrmDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { 
  Calendar, Home, MessageSquare, Phone, Search, TrendingUp, Users, 
  Plus, X, MapPin, Building, Mail, Clock, ArrowRight, ShieldCheck, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function CrmDashboard() {
 const auth = useAuth(); // Hook ko directly call karein
const api = auth?.api;
const user = auth?.user;
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data State
  const [data, setData] = useState({ 
    total_listings: 0, 
    total_views: 0, 
    total_inquiries: 0, 
    properties: [], 
    inquiries: [] 
  });

  // Add Lead Modal State
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    clientName: '',
    phone: '',
    propertyId: '',
    message: ''
  });

  // Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Assuming your backend has an axios instance or use standard fetch
        // const response = await api.get('/dashboard/agent');
        
        // --- SIMULATED DATA FOR NOW IF API FAILS ---
        // Replace this block with actual API response when backend is fully connected
        const simulatedData = {
          total_listings: 12,
          total_views: 3450,
          total_inquiries: 28,
          properties: [
            { id: '1', title: 'Experion Saatori', city: 'Noida', location: 'Sec 151', price: 18500000, status: 'approved' },
            { id: '2', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sec 97', price: 35000000, status: 'pending' },
          ],
          inquiries: [
            { id: '101', from_user_name: 'Rahul Sharma', phone: '+91 9876543210', property_id: '1', message: 'I want to schedule a site visit for this weekend.', created_at: new Date().toISOString() },
            { id: '102', from_user_name: 'Priya Singh', phone: '+91 9123456789', property_id: '2', message: 'What is the final negotiable price?', created_at: new Date(Date.now() - 86400000).toISOString() },
          ]
        };
        setData(simulatedData);
      } catch (error) {
        toast.error('Failed to load CRM dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  // Filtering Logic
  const filteredProperties = useMemo(() => 
    data.properties.filter((item) => 
      [item.title, item.city, item.location].filter(Boolean).some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    ), 
  [data.properties, searchTerm]);

  const filteredInquiries = useMemo(() => 
    data.inquiries.filter((item) => 
      [item.from_user_name, item.message, item.property_id].filter(Boolean).some((field) => String(field).toLowerCase().includes(searchTerm.toLowerCase()))
    ), 
  [data.inquiries, searchTerm]);

  // Handle Manual Lead Submission
  const handleAddLeadSubmit = (e) => {
    e.preventDefault();
    if (!newLead.clientName || !newLead.phone) {
      toast.error("Name and Phone are required!");
      return;
    }

    // Create a new mock lead object
    const createdLead = {
      id: `manual_${Date.now()}`,
      from_user_name: newLead.clientName,
      phone: newLead.phone,
      property_id: newLead.propertyId || 'General Inquiry',
      message: newLead.message || 'Added manually via CRM.',
      created_at: new Date().toISOString(),
      isManual: true
    };

    // Update state to show immediately
    setData(prev => ({
      ...prev,
      total_inquiries: prev.total_inquiries + 1,
      inquiries: [createdLead, ...prev.inquiries]
    }));

    toast.success("New lead added successfully!");
    setIsAddLeadOpen(false);
    setNewLead({ clientName: '', phone: '', propertyId: '', message: '' });
  };

  const stats = [
    { title: 'Total Leads', value: data.total_inquiries, icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { title: 'Active Listings', value: data.total_listings, icon: Home, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { title: 'Total Views', value: data.total_views, icon: TrendingUp, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { title: 'Follow Ups', value: filteredInquiries.length, icon: Calendar, color: 'bg-red-50 text-red-600 border-red-100' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-[#D4AF37]/30">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#050505] text-slate-300 flex flex-col fixed h-full z-20 border-r border-slate-800 shadow-2xl">
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-[#000000]">
          <h1 className="text-2xl font-black text-[#D4AF37] tracking-tight">ANK<span className="text-white">REALTY</span></h1>
          <span className="bg-[#8B0000] text-white text-[10px] font-bold px-2 py-0.5 rounded ml-3 uppercase tracking-widest">CRM</span>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Main Menu</p>
          {[
            { id: 'dashboard', label: 'Overview', icon: TrendingUp }, 
            { id: 'properties', label: 'My Inventory', icon: Building }, 
            { id: 'inquiries', label: 'Lead Manager', icon: MessageSquare }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-white/5 m-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-slate-900 font-black shadow-inner">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{user?.name || 'Agent User'}</p>
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">{user?.role || 'Broker'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 capitalize flex items-center gap-2">
            {activeTab.replace('-', ' ')}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#8B0000] transition-colors" />
              <Input 
                placeholder="Search leads, names, or properties..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10 w-72 lg:w-96 bg-slate-50 border-slate-200 rounded-full h-11 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all font-medium" 
              />
            </div>
            <Button onClick={() => setIsAddLeadOpen(true)} className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-full h-11 px-6 shadow-md shadow-[#8B0000]/20 transition-all hover:-translate-y-0.5 hidden sm:flex">
              <Plus className="w-4 h-4 mr-1.5" /> Add Lead
            </Button>
          </div>
        </header>

        {/* SCROLLABLE AREA */}
        <div className="p-8 flex-1 overflow-y-auto">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.title} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-black text-slate-900">{loading ? '-' : stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Leads Column */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-900">Incoming Leads</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('inquiries')} className="text-[#8B0000] font-bold hover:bg-red-50">View All</Button>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="space-y-3">
                      {filteredInquiries.slice(0, 4).map((lead) => (
                        <div key={lead.id} className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#D4AF37]/50 hover:shadow-md transition-all group flex items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                              <Users className="w-5 h-5 text-slate-400 group-hover:text-[#8B0000] transition-colors" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-black text-slate-900 text-base">{lead.from_user_name}</p>
                                {lead.isManual && <span className="bg-amber-100 text-amber-700 text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm">Manual</span>}
                              </div>
                              <p className="text-sm text-slate-500 font-medium mb-2 line-clamp-1">{lead.message}</p>
                              <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                <span className="flex items-center"><Phone className="w-3 h-3 mr-1 text-[#D4AF37]"/> {lead.phone || 'N/A'}</span>
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1 text-slate-300"/> {new Date(lead.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <a href={`tel:${lead.phone?.replace(/\s+/g, '')}`} className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors shrink-0">
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                      {!filteredInquiries.length && (
                        <div className="text-center py-10 text-slate-500 font-medium">No recent inquiries available.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions Column */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border border-white/20">
                      <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl font-black mb-3">Agent Actions</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">Manage your inventory or log an offline client interaction instantly.</p>
                  </div>
                  <div className="space-y-3 relative z-10">
                    <Button onClick={() => setIsAddLeadOpen(true)} className="w-full h-12 bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 font-black rounded-xl shadow-lg shadow-[#D4AF37]/20 flex justify-between items-center px-5">
                      Log New Lead <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Link to="/post-property">
                      <Button variant="outline" className="w-full h-12 mt-3 border-white/20 text-white hover:bg-white/10 hover:text-white font-bold rounded-xl flex justify-between items-center px-5 bg-transparent">
                        Add Property <Home className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROPERTIES */}
          {activeTab === 'properties' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-900">Managed Inventory</h3>
                <Link to="/post-property">
                  <Button className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl shadow-md h-10 px-5">
                    <Plus className="w-4 h-4 mr-1.5" /> Post Listing
                  </Button>
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredProperties.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0 mt-1">
                        <Building className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-900 mb-1">{item.title}</p>
                        <p className="text-sm font-medium text-slate-500 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400"/> {item.location}, {item.city}</p>
                      </div>
                    </div>
                    <div className="sm:text-right flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end w-full sm:w-auto mt-2 sm:mt-0">
                      <p className="text-xl font-black text-[#003B30] mb-1">
                        ₹ {Number(item.price || 0).toLocaleString('en-IN')}
                      </p>
                      <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
                {!filteredProperties.length && (
                  <div className="p-16 text-center">
                    <Building className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-lg font-bold text-slate-600 mb-1">No properties found</p>
                    <p className="text-sm text-slate-400">You haven't listed any properties yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: LEADS / INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Lead Pipeline</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Showing {filteredInquiries.length} results</p>
                </div>
                <Button onClick={() => setIsAddLeadOpen(true)} className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl shadow-md h-10 px-5 sm:hidden flex">
                  <Plus className="w-4 h-4 mr-1.5" /> Add
                </Button>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredInquiries.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-slate-50/80 transition-colors">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 text-lg border border-slate-200 shrink-0">
                        {item.from_user_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-black text-slate-900">{item.from_user_name}</h4>
                          {item.isManual && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-amber-200">Manual Entry</span>}
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-3 relative">
                          <MessageSquare className="w-4 h-4 absolute top-4 left-4 text-slate-300" />
                          <p className="text-sm font-medium text-slate-700 leading-relaxed pl-7">{item.message}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                          <span className="flex items-center bg-slate-100 px-2.5 py-1 rounded-md"><Building className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]"/> Ref: {item.property_id}</span>
                          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400"/> {new Date(item.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-3 shrink-0 mt-4 md:mt-0 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      <a href={`tel:${(item.phone || '').replace(/\s+/g, '')}`} className="flex-1 md:flex-none">
                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md h-11">
                          <Phone className="w-4 h-4 mr-2" /> Call Lead
                        </Button>
                      </a>
                      <a href={`mailto:${item.email || ''}`} className="flex-1 md:flex-none">
                        <Button variant="outline" className="w-full border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded-xl h-11">
                          <Mail className="w-4 h-4 mr-2" /> Email
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
                {!filteredInquiries.length && (
                  <div className="p-16 text-center">
                    <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-lg font-bold text-slate-600 mb-1">No leads found</p>
                    <p className="text-sm text-slate-400">Adjust your search or add a manual lead.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- ADD MANUAL LEAD MODAL --- */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddLeadOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-6 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-xl font-black text-white">Log Offline Lead</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manual CRM Entry</p>
              </div>
              <button onClick={() => setIsAddLeadOpen(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors relative z-10">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddLeadSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Client Full Name <span className="text-[#8B0000]">*</span></Label>
                <Input 
                  placeholder="e.g. Ramesh Kumar" 
                  value={newLead.clientName} onChange={(e) => setNewLead({...newLead, clientName: e.target.value})}
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:border-[#D4AF37] font-medium" required
                />
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Number <span className="text-[#8B0000]">*</span></Label>
                <Input 
                  type="tel" placeholder="+91 98765 XXXXX" 
                  value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:border-[#D4AF37] font-medium" required
                />
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Interested Property</Label>
                <select 
                  value={newLead.propertyId} onChange={(e) => setNewLead({...newLead, propertyId: e.target.value})}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 appearance-none font-medium text-slate-700"
                >
                  <option value="">General Inquiry (No specific property)</option>
                  {data.properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} - {p.city}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lead Notes</Label>
                <Textarea 
                  placeholder="Add context about their requirements, budget, or timeline..." 
                  value={newLead.message} onChange={(e) => setNewLead({...newLead, message: e.target.value})}
                  rows={4} className="bg-slate-50 border-slate-200 rounded-xl focus:border-[#D4AF37] resize-none font-medium p-4"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddLeadOpen(false)} className="flex-1 h-12 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 h-12 bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl shadow-lg shadow-[#8B0000]/20">
                  <CheckCircle className="w-4 h-4 mr-2" /> Save Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
