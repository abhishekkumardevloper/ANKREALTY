// src/pages/UserDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Calendar, MessageSquare, MapPin, Trash2, ArrowRight, Loader2, Building, Clock } from 'lucide-react';
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

  // Safely extract error messages
  const getErrorMessage = (error) => {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      return typeof detail === 'string' ? detail : "Something went wrong";
    }
    return error.message || 'An unexpected error occurred.';
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Using Promise.allSettled to ensure one failing endpoint doesn't break the whole dashboard
      const [favResult, dashResult, inqResult] = await Promise.allSettled([
        api.get('/favorites'),
        api.get('/dashboard/user'), // Assuming you have this or will add it
        api.get('/inquiries')
      ]);

      const favData = favResult.status === 'fulfilled' ? favResult.value.data : [];
      const dashData = dashResult.status === 'fulfilled' ? dashResult.value.data : {};
      const inqData = inqResult.status === 'fulfilled' ? inqResult.value.data : [];

      // Map the data safely
      setFavorites(Array.isArray(favData) ? favData : []);
      setAppointments(dashData?.appointments || []);
      setInquiries(Array.isArray(inqData) ? inqData : []);

    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load some dashboard data.');
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
      setFavorites((prev) => prev.filter((p) => p.property_id !== propertyId && p.id !== propertyId));
      toast.success('Property removed from favorites');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Price on Request';
    const num = Number(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#D4AF37]/30 flex flex-col">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="bg-slate-900 pt-32 pb-16 px-6 relative overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
              My <span className="text-[#D4AF37]">Portfolio</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              Welcome back, <span className="text-white font-bold">{user?.name || 'Valued Client'}</span>! Manage your real estate journey here.
            </p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => navigate('/properties')} className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-[#8B0000]/20 transition-all hover:-translate-y-0.5 flex items-center">
               Explore Properties <ArrowRight className="w-4 h-4 ml-2" />
             </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
        
        {/* CUSTOM TABS NAVIGATION */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 w-fit">
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'favorites' ? 'bg-[#8B0000] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4 mr-2" /> Saved Properties ({favorites.length})
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'appointments' ? 'bg-[#8B0000] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" /> Site Visits ({appointments.length})
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'inquiries' ? 'bg-[#8B0000] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> My Inquiries ({inquiries.length})
          </button>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
             <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
             <p className="text-slate-500 font-bold tracking-wider uppercase text-sm">Loading your data...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            
            {/* FAVORITES TAB */}
            {activeTab === 'favorites' && (
              <div>
                {favorites.length === 0 ? (
                  <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-300 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
                      <Heart className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No saved properties yet</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto font-medium">Keep track of homes you love by clicking the heart icon on any property listing.</p>
                    <Link to="/properties" className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 font-black px-8 h-12 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all hover:-translate-y-0.5">
                      Start Browsing
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favorites.map((fav) => {
                      const property = fav.property || fav; // Handle nested structure depending on backend
                      return (
                        <div key={property.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                          <Link to={`/property/${property.property_id || property.id}`} className="block h-56 relative overflow-hidden p-2 pb-0">
                            <div className="w-full h-full rounded-2xl overflow-hidden relative">
                              <img
                                src={property.images?.[0] || property.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                                alt={property.title || 'Property'}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                          </Link>
                          <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-black text-xl text-slate-900 mb-2 line-clamp-1 group-hover:text-[#8B0000] transition-colors">
                              {property.title || 'Premium Property'}
                            </h3>
                            <p className="text-slate-500 text-sm flex items-center mb-5 font-medium">
                              <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
                              {property.city || property.location || 'Location unavailable'}
                            </p>
                            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-[#003B30] font-black text-xl">
                                {formatCurrency(property.price)}
                              </span>
                              <button
                                onClick={() => removeFavorite(property.property_id || property.id)}
                                className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                title="Remove from favorites"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
              <div>
                {appointments.length === 0 ? (
                  <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-300 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
                      <Calendar className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No site visits scheduled</h3>
                    <p className="text-slate-500 mb-6 font-medium">You don't have any upcoming property tours. Schedule one from a property's detail page.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {appointments.map((a) => (
                      <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-[#D4AF37]/50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming Visit</p>
                          <h3 className="font-black text-slate-900 text-lg mb-2">{a.property_title || 'Property Tour'}</h3>
                          <div className="flex flex-wrap gap-3 mb-3">
                            <span className="flex items-center text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                              <Calendar className="w-4 h-4 mr-1.5 text-slate-400"/> {a.date}
                            </span>
                            <span className="flex items-center text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                              <Clock className="w-4 h-4 mr-1.5 text-slate-400"/> {a.time}
                            </span>
                          </div>
                          {a.message && <p className="text-sm text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">"{a.message}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <div>
                {inquiries.length === 0 ? (
                  <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-300 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
                      <MessageSquare className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No inquiries sent</h3>
                    <p className="text-slate-500 mb-6 font-medium">When you contact a seller or agent, your messages will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {inquiries.map((i) => (
                      <div key={i.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 mt-1">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                              Ref ID: {i.property_id || 'General Inquiry'}
                            </p>
                            <p className="text-xs font-bold text-slate-400">
                              {new Date(i.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium text-sm leading-relaxed">
                            {i.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
