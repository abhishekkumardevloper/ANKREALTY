// src/pages/AgentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Eye, MessageSquare, Plus, MapPin, Edit, 
  Trash2, Building2, TrendingUp, Loader2, CheckCircle, Clock 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function AgentDashboard() {
  const { user, api } = useAuth(); // Using the authenticated 'api' client
  
  const [dashboardData, setDashboardData] = useState({
    total_listings: 0,
    total_views: 0,
    total_inquiries: 0,
    properties: [],
    inquiries: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && api) {
      fetchDashboardData();
    }
  }, [user, api]);

  const fetchDashboardData = async () => {
    try {
      // Using 'api' automatically attaches the auth token
      const response = await api.get('/dashboard/agent');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (propertyId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this property? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/properties/${propertyId}`);
      setDashboardData(prev => ({
        ...prev,
        properties: prev.properties.filter(p => p.id !== propertyId),
        total_listings: prev.total_listings - 1
      }));
      toast.success('Property deleted successfully.');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete property.');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Price on Request';
    if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} Lac`;
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 pb-24 flex flex-col items-center justify-center min-h-[70vh]">
          <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#D4AF37]/30 pb-20">
      <Navbar />

      {/* DASHBOARD HEADER */}
      <div className="bg-slate-900 text-white pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/20 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#D4AF37]/30 shadow-sm">
               <Building2 className="w-3.5 h-3.5" /> Agent Portal
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
              Welcome back, <span className="text-[#D4AF37]">{user?.name?.split(' ')[0] || 'Agent'}</span>
            </h1>
            <p className="text-slate-400 font-medium">Manage your premium listings and client inquiries seamlessly.</p>
          </div>
          
          <Link to="/post-property">
            <Button className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#8B0000]/30 transition-all hover:-translate-y-0.5 whitespace-nowrap">
              <Plus className="w-5 h-5 mr-2" /> Post New Property
            </Button>
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Listings</p>
              <p className="text-4xl font-black text-slate-900 group-hover:text-[#8B0000] transition-colors">{dashboardData.total_listings}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-[#8B0000]/5 group-hover:border-[#8B0000]/20 transition-all">
              <Home className="w-7 h-7 text-[#D4AF37]" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Views</p>
              <p className="text-4xl font-black text-slate-900 group-hover:text-[#8B0000] transition-colors">{dashboardData.total_views}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-[#8B0000]/5 group-hover:border-[#8B0000]/20 transition-all">
              <Eye className="w-7 h-7 text-[#D4AF37]" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">New Inquiries</p>
              <p className="text-4xl font-black text-slate-900 group-hover:text-[#8B0000] transition-colors">{dashboardData.total_inquiries}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-[#8B0000]/5 group-hover:border-[#8B0000]/20 transition-all">
              <MessageSquare className="w-7 h-7 text-[#D4AF37]" />
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="mb-8 bg-white border border-slate-200 p-1.5 rounded-xl h-auto shadow-sm">
            <TabsTrigger value="properties" className="px-6 py-2.5 rounded-lg text-sm font-bold data-[state=active]:bg-[#8B0000] data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
              <Building2 className="w-4 h-4 mr-2" /> My Properties
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="px-6 py-2.5 rounded-lg text-sm font-bold data-[state=active]:bg-[#8B0000] data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
              <MessageSquare className="w-4 h-4 mr-2" /> Client Inquiries
            </TabsTrigger>
          </TabsList>

          {/* PROPERTIES TAB */}
          <TabsContent value="properties">
            {dashboardData.properties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm animate-in fade-in">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <Home className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">No Properties Listed</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">Start building your portfolio by posting your first premium property listing.</p>
                <Link to="/post-property">
                  <Button className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#8B0000]/20">
                    Post Your First Property
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
                {dashboardData.properties.map(property => (
                  <div key={property.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col group">
                    <Link to={`/property/${property.id}`} className="block h-52 relative overflow-hidden bg-slate-100">
                      <img
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                         <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${
                           property.status === 'approved' ? 'bg-green-500 text-white' :
                           property.status === 'rejected' ? 'bg-red-500 text-white' :
                           'bg-amber-500 text-white'
                         }`}>
                           {property.status || 'Pending'}
                         </span>
                      </div>
                    </Link>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[#8B0000] text-[10px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                          {property.category} • {property.property_type}
                        </p>
                      </div>
                      
                      <Link to={`/property/${property.id}`}>
                        <h3 className="font-black text-lg text-slate-900 mb-1 line-clamp-1 group-hover:text-[#8B0000] transition-colors">
                          {property.title}
                        </h3>
                      </Link>
                      
                      <p className="text-slate-500 text-sm flex items-center mb-5 font-medium">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {property.location}, {property.city}
                      </p>

                      <div className="flex items-center justify-between mb-6">
                         <span className="font-black text-xl text-[#003B30]">{formatCurrency(property.price)}</span>
                         <div className="flex items-center text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                           <Eye className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]"/> {property.views || 0}
                         </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex gap-3">
                        <Link to={`/edit-property/${property.id}`} className="flex-1">
                          <Button variant="outline" className="w-full h-10 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-lg text-xs">
                            <Edit className="w-4 h-4 mr-1.5" /> Edit
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          onClick={() => deleteProperty(property.id)}
                          className="flex-1 h-10 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 font-bold rounded-lg text-xs transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* INQUIRIES TAB */}
          <TabsContent value="inquiries">
            {dashboardData.inquiries.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm animate-in fade-in">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <MessageSquare className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">No Inquiries Yet</h3>
                <p className="text-slate-500 max-w-md mx-auto">When clients request details on your properties, their messages will appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
                <div className="divide-y divide-slate-100">
                  {dashboardData.inquiries.map(inquiry => (
                    <div key={inquiry.id} className="p-6 hover:bg-slate-50 transition-colors group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 text-[#8B0000] flex items-center justify-center font-black text-lg shadow-sm border border-[#D4AF37]/30">
                            {inquiry.from_user_name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{inquiry.from_user_name || 'Client Inquiry'}</p>
                            <p className="text-xs text-slate-500 font-medium flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> {new Date(inquiry.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        {!inquiry.read && (
                          <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm self-start md:self-auto">
                            New Lead
                          </span>
                        )}
                      </div>
                      
                      <div className="pl-0 md:pl-13">
                         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-slate-700 text-sm leading-relaxed mb-3">
                           "{inquiry.message}"
                         </div>
                         <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                           <span className="flex items-center bg-slate-100 px-2.5 py-1 rounded-md">
                              <Building2 className="w-3.5 h-3.5 mr-1.5" /> Property ID: {inquiry.property_id}
                           </span>
                           {inquiry.phone && (
                             <span className="text-[#8B0000] cursor-pointer hover:underline flex items-center">
                               Contact: {inquiry.phone}
                             </span>
                           )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
