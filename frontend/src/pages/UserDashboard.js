// src/pages/UserDashboard.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Calendar, MessageSquare, MapPin, Trash2, 
  ArrowRight, Loader2, Building, Clock, 
  CheckCircle, ChevronRight, ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function UserDashboard() {
  const { user, api } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const fetchDashboardData = useCallback(async () => {
    if (!api) return;
    setLoading(true);
    try {
      const [favResult, inqResult] = await Promise.allSettled([
        api.get('/favorites'),
        api.get('/inquiries')
      ]);

      setFavorites(favResult.status === 'fulfilled' ? (Array.isArray(favResult.value.data) ? favResult.value.data : []) : []);
      setInquiries(inqResult.status === 'fulfilled' ? (Array.isArray(inqResult.value.data) ? inqResult.value.data : []) : []);
      
      // Future feature: Site visits
      setAppointments([]); 

    } catch (error) {
      console.error('Dashboard Sync Error:', error);
      toast.error('Sync failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const removeFavorite = async (favoriteId) => {
    try {
      // Assuming your backend delete route uses the favorite's primary key ID
      await api.delete(`/favorites/${favoriteId}`);
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
      toast.success('Property removed from your collection');
    } catch (error) {
      toast.error("Action failed. Try again.");
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Price on Request';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans selection:bg-[#D4AF37]/30 flex flex-col">
      <Navbar />

      {/* PROFESSIONAL WELCOME HEADER */}
      <section className="bg-[#0F172A] pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.3em]">
                <div className="h-[2px] w-10 bg-[#D4AF37]"></div>
                Client Portal
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {greeting}, <span className="text-[#D4AF37]">{user?.name?.split(' ')[0] || 'Guest'}</span>
              </h1>
              <p className="text-slate-400 font-medium max-w-xl text-lg">
                Manage your saved luxury properties, site visit schedules, and advisory communications in one place.
              </p>
            </div>
            
            <div className="flex gap-6 md:gap-10 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
              <div className="text-center">
                <p className="text-3xl font-black text-white">{favorites.length}</p>
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mt-1">Shortlisted</p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-white">{inquiries.length}</p>
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mt-1">Inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 w-full flex-1 pb-20 relative z-20">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* NAVIGATION DRAWER */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white p-3 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 sticky top-28">
              {[
                { id: 'favorites', label: 'My Shortlist', icon: Heart },
                { id: 'appointments', label: 'Site Visits', icon: Calendar },
                { id: 'inquiries', label: 'My Inquiries', icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl font-bold text-sm transition-all group mb-1 ${
                    activeTab === tab.id 
                      ? 'bg-[#0F172A] text-white shadow-lg shadow-slate-900/20' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                    {tab.label}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-all ${activeTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-50'}`} />
                </button>
              ))}
              <div className="mt-6 pt-6 border-t border-slate-100 px-2">
                 <button onClick={() => navigate('/properties')} className="w-full bg-[#8B0000] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#600000] transition-colors shadow-lg shadow-[#8B0000]/20 flex justify-center items-center gap-2">
                   Find More Properties <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC CONTENT AREA */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
                <p className="text-slate-400 font-bold tracking-[0.2em] uppercase text-[11px]">Syncing Dashboard</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                
                {/* FAVORITES TAB */}
                {activeTab === 'favorites' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {favorites.length === 0 ? (
                      <div className="md:col-span-2"><EmptyState icon={Heart} title="Collection Empty" desc="Save your favorite luxury properties to track their current status and market price." /></div>
                    ) : (
                      favorites.map((fav) => {
                        // Handle Supabase Joined Data Structure safely
                        const property = fav.properties || fav.property || fav;
                        
                        return (
                          <div key={fav.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm group hover:shadow-2xl hover:border-[#D4AF37]/40 transition-all duration-500 flex flex-col">
                            <div className="relative h-56 overflow-hidden bg-slate-100">
                              {property.images && property.images.length > 0 ? (
                                <img src={property.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={property.title} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Building className="w-12 h-12" /></div>
                              )}
                              
                              <button 
                                onClick={(e) => { e.preventDefault(); removeFavorite(fav.id); }} 
                                className="absolute top-5 right-5 w-11 h-11 bg-white/90 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-xl z-10"
                                title="Remove from favorites"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                              <div className="flex-1">
                                <h3 className="font-black text-slate-900 text-xl mb-2 line-clamp-1 leading-tight">{property.title || 'Property Unavailable'}</h3>
                                <p className="flex items-center text-slate-500 text-sm font-medium mb-6">
                                  <MapPin className="w-4 h-4 mr-2 text-[#D4AF37]" /> 
                                  {property.location ? `${property.location}, ${property.city}` : 'Location unknown'}
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Listed Price</span>
                                  <span className="text-2xl font-black text-[#0F172A]">{formatCurrency(property.price)}</span>
                                </div>
                                <Link to={`/property/${property.id}`} className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] transition-all shadow-sm hover:shadow-md">
                                  <ExternalLink className="w-5 h-5" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* APPOINTMENTS TAB */}
                {activeTab === 'appointments' && (
                  <div className="space-y-6">
                    {appointments.length === 0 ? <EmptyState icon={Calendar} title="No Tours Scheduled" desc="You haven't requested any property visits yet. Experience properties in person for a better perspective." /> : (
                      appointments.map((a) => (
                        <div key={a.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between group hover:border-[#D4AF37]/50 transition-all">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                              <Clock className="w-8 h-8 text-slate-400 group-hover:text-[#D4AF37]" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 text-xl">{a.property_title}</h4>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-slate-500 font-bold text-sm bg-slate-100 px-3 py-1 rounded-lg flex items-center gap-2"><Calendar className="w-4 h-4"/> {a.date}</span>
                                <span className="text-slate-500 font-bold text-sm bg-slate-100 px-3 py-1 rounded-lg flex items-center gap-2"><Clock className="w-4 h-4"/> {a.time}</span>
                              </div>
                            </div>
                          </div>
                          <span className="mt-4 md:mt-0 px-6 py-2 bg-emerald-50 text-emerald-700 text-xs font-black uppercase rounded-full border border-emerald-100 shadow-sm">Visit Confirmed</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* INQUIRIES TAB */}
                {activeTab === 'inquiries' && (
                  <div className="space-y-6 max-w-4xl">
                    {inquiries.length === 0 ? <EmptyState icon={MessageSquare} title="Inquiry Log Empty" desc="All your discussions with property owners and our support team will be securely logged here." /> : (
                      inquiries.map((inq) => (
                        <div key={inq.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-[#8B0000] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8B0000]/20">
                                <Building className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Reference ID</span>
                                <span className="text-sm font-black text-slate-900">{inq.property_id || 'General Support Inquiry'}</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                              {new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-slate-700 font-medium text-base leading-relaxed relative">
                            <div className="absolute -top-3 left-6 bg-[#D4AF37] text-[10px] px-3 py-0.5 rounded-md font-black text-white uppercase tracking-tighter shadow-sm">Your Message</div>
                            "{inq.message}"
                          </div>
                          <div className="mt-6 flex items-center gap-3 text-emerald-600 font-black text-[11px] uppercase tracking-widest px-2">
                            <CheckCircle className="w-4 h-4" />
                            Delivered to Advisory Team
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const EmptyState = ({ icon: Icon, title, desc }) => (
  <div className="w-full text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
      <Icon className="h-10 w-10 text-slate-300" />
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-400 mb-10 max-w-sm mx-auto text-base font-medium leading-relaxed">{desc}</p>
    <Link to="/properties" className="inline-flex items-center gap-3 bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#8B0000] transition-all shadow-xl">
      Browse Inventory <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
);
