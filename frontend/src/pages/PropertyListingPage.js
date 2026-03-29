import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Heart, Filter, Search, CheckCircle, 
  BedDouble, Bath, Layers, Phone, Mail, Loader2, ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

// FIXED: Using Vite environment variable to match the rest of your app
const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

export default function PropertyListingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { user } = useAuth(); 

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    property_type: searchParams.get('property_type') || '',
    city: searchParams.get('city') || '',
    min_price: '',
    max_price: '',
    bhk: '',
    furnishing: ''
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
      params.append('limit', '100'); 

      const response = await axios.get(`${API_BASE}/properties?${params.toString()}`);
      
      // Safety check to ensure we only show approved/active properties to public
      const apiProps = Array.isArray(response.data) 
        ? response.data.filter(p => p.status?.toLowerCase() === 'approved' || p.status?.toLowerCase() === 'active') 
        : [];
      
      setProperties(apiProps);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      toast.error("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchProperties();
  };

  const addToFavorites = async (propertyId, e) => {
    // FIXED: Stop propagation synchronously before doing any async work
    e.preventDefault();
    e.stopPropagation(); 
    
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/auth');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/favorites`, { property_id: propertyId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Added to favorites');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add to favorites');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'On Request';
    const num = Number(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const getMainImage = (property) => {
    if (property.images && property.images.length > 0) return property.images[0];
    return "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"; // Fallback image
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      {/* Header Section */}
      <section className="bg-slate-900 pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000]/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center md:text-left relative z-10">
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Find Your <span className="text-[#D4AF37]">Perfect Property</span></h1>
           <p className="text-slate-400 mt-3 font-medium max-w-2xl">Browse our exclusive collection of verified luxury homes, premium plots, and commercial spaces.</p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8 flex-1 w-full">
          
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
               <h2 className="font-black text-lg text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4"><Filter className="w-5 h-5 text-[#8B0000]" /> Advanced Filters</h2>
               
               <div className="space-y-5">
                  <div>
                    <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-2">City / Location</Label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input 
                        value={filters.city} 
                        onChange={(e) => handleFilterChange('city', e.target.value)} 
                        placeholder="e.g., Noida" 
                        className="pl-9 h-11 bg-slate-50 border-slate-200 focus:border-[#D4AF37] rounded-xl text-sm" 
                      />
                    </div>
                  </div>
                  
                  <Button onClick={applyFilters} className="w-full h-12 bg-[#8B0000] hover:bg-[#600000] text-white font-bold text-base rounded-xl shadow-md shadow-[#8B0000]/20 transition-all hover:-translate-y-0.5 mt-2">
                    Apply Filters
                  </Button>
               </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-[#8B0000] mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">Searching properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center text-center shadow-sm">
                <Search className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-black text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-500 font-medium">We couldn't find any properties matching your current filters. Try clearing them and searching again.</p>
                <Button variant="outline" onClick={() => setFilters({category: '', property_type: '', city: '', min_price: '', max_price: '', bhk: '', furnishing: ''})} className="mt-6 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-bold rounded-xl h-11 px-6">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {properties.map(property => (
                   <div 
                     key={property.id} 
                     className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200 hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer group flex flex-col relative"
                     onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                   >
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-900 shadow-md z-10 uppercase tracking-widest">
                        {property.category}
                      </div>

                      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                        <img 
                          src={getMainImage(property)} 
                          alt={property.title} 
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="p-6 flex flex-col flex-1">
                        <p className="text-xs font-bold text-[#8B0000] uppercase tracking-wider mb-1 flex items-center">
                          {property.property_type} {property.bhk ? `• ${property.bhk} BHK` : ''}
                        </p>
                        <h3 className="font-black text-xl text-slate-900 mb-2 line-clamp-1 group-hover:text-[#D4AF37] transition-colors">{property.title}</h3>
                        <p className="text-slate-500 text-sm font-medium flex items-center mb-6">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {property.location}, {property.city}
                        </p>
                        
                        <div className="mt-auto flex justify-between items-center pt-5 border-t border-slate-100">
                           <span className="font-black text-2xl text-[#003B30]">{formatCurrency(property.price)}</span>
                           
                           {/* FIXED ONCLICK: Stop propagation safely */}
                           <Button 
                             size="icon" 
                             variant="outline" 
                             onClick={(e) => addToFavorites(property.id, e)}
                             className="h-10 w-10 rounded-full border-slate-200 text-slate-400 hover:text-[#8B0000] hover:bg-red-50 hover:border-red-200 shadow-sm transition-colors z-20"
                             aria-label="Save to favorites"
                           >
                             <Heart className="w-5 h-5" />
                           </Button>
                        </div>
                      </div>
                   </div>
                ))}
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
