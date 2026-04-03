// src/pages/UserDashboard.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Calendar, MessageSquare, MapPin, Trash2, 
  ArrowRight, Loader2, Building, Clock, User,
  CheckCircle, ChevronRight
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

      setFavorites(favResult.status === 'fulfilled' ? favResult.value.data : []);
      setInquiries(inqResult.status === 'fulfilled' ? inqResult.value.data : []);
      
      // Simulated appointments if backend endpoint doesn't exist yet
      setAppointments([]); 

    } catch (error) {
      console.error('Dashboard Error:', error);
      toast.error('Unable to sync your latest activity.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const removeFavorite = async (propertyId) => {
    try {
      await api.delete(`/favorites/${propertyId}`);
      setFavorites((prev) => prev.filter((p) => (p.property_id !== propertyId && p.id !== propertyId)));
      toast.success('Removed from your collection');
    } catch (error) {
      toast.error("Could not remove property.");
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#D4AF37]/30 flex flex-col">
      <Navbar />

      {/* REFINED HEADER */}
      <section className="bg-slate-900 pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-[#D4AF37] font-bold text-sm uppercase tracking-[0.2em] mb-2">
                <div className="h-px w-8 bg-[#D4AF37]"></div>
                Client Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{user?.name?.split(' ')[0] || 'Guest'}</span>
              </h1>
              <p className="text-slate-400 font-medium max-w-xl">
                Manage your saved properties, track your site visit schedules, and review your communication with our advisory team.
              </p>
            </div>
            
            {/* QUICK STATS SUMMARY */}
            <div className="flex gap-4 md:gap-8">
              <div className="text-center">
                <p className="text-2xl font-black text-white">{favorites.length}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saved</p>
              </div>
              <div className="w-px h-10 bg-white/10 hidden md:block"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{inquiries.length}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 w-full flex-1 pb-20">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* SIDE NAVIGATION */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              {[
                { id: 'favorites', label: 'Saved Collection', icon: Heart },
                { id: 'appointments', label: 'Site Visits', icon: Calendar },
                { id: 'inquiries', label: 'Message History', icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl font-bold text-sm transition-all group ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                    {tab.label}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                <Loader2 className="w-10 h-10 text-slate-900 animate-spin mb-4" />
                <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">Synchronizing Account</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* FAVORITES VIEW */}
                {activeTab === 'favorites' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.length === 0 ? <EmptyState icon={Heart} title="Your collection is empty" desc="Save properties you're interested in to track price changes and availability." /> : (
                      favorites.map((fav) => {
                        const property = fav.property || fav;
                        return (
                          <div key={property.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-500">
                            <div className="relative h-48 overflow-hidden">
                              <img src={property.images?.[0] || property.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                              <button onClick={() => removeFavorite(property.property_id || property.id)} className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="p-6">
                              <h3 className="font-black text-slate-900 text-lg mb-1 truncate">{property.title}</h3>
                              <p className="flex items-center text-slate-400 text-sm font-medium mb-4"><MapPin className="w-3.5 h-3.5 mr-1" /> {property.city}</p>
                              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <span className="text-xl font-black text-[#003B30]">{formatCurrency(property.price)}</span>
                                <Link to={`/property/${property.property_id || property.id}`} className="text-[10px] font-black uppercase tracking-widest text-[#8B0000] flex items-center hover:gap-2 transition-all">
                                  View Details <ArrowRight className="w-3 h-3 ml-1" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* APPOINTMENTS VIEW */}
                {activeTab === 'appointments' && (
                  <div className="space-y-4">
                    {appointments.length === 0 ? <EmptyState icon={Calendar} title="No visits scheduled" desc="Ready to see a property in person? Book a visit from the property details page." /> : (
                      appointments.map((a) => (
                        <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-[#D4AF37]/10 transition-colors">
                              <Clock className="w-6 h-6 text-slate-400 group-hover:text-[#D4AF37]" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900">{a.property_title}</h4>
                              <p className="text-slate-500 text-sm font-medium">{a.date} at {a.time}</p>
                            </div>
                          </div>
                          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-100">Confirmed</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* INQUIRIES VIEW */}
                {activeTab === 'inquiries' && (
                  <div className="space-y-4">
                    {inquiries.length === 0 ? <EmptyState icon={MessageSquare} title="No active inquiries" desc="Your conversations with property owners and our support team will appear here." /> : (
                      inquiries.map((inq) => (
                        <div key={inq.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#8B0000]/10 rounded-full flex items-center justify-center">
                                <Building className="w-4 h-4 text-[#8B0000]" />
                              </div>
                              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ref: {inq.property_id || 'General'}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 text-sm font-medium leading-relaxed italic">
                            "{inq.message}"
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                            <CheckCircle className="w-3 h-3" /> Delivered to Agent
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

// Reusable Professional Empty State Component
const EmptyState = ({ icon: Icon, title, desc }) => (
  <div className="w-full text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
      <Icon className="h-6 w-6 text-slate-300" />
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm font-medium leading-relaxed">{desc}</p>
    <Link to="/properties" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#8B0000] transition-all">
      Browse Listings <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
);
