// src/pages/PropertyListingPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api";

export default function PropertyListingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Safe fallback if useAuth is not perfectly configured yet
  const authContext = useAuth ? useAuth() : null;
  const user = authContext ? authContext.user : null;

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

  // Fetch only active/approved properties from backend
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // Only append valid, non-empty, non-'all' filters to API call
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
      // Ensure we get a good amount of listings
      params.append('limit', '100'); 

      const response = await axios.get(`${API_BASE}/properties?${params.toString()}`);
      
      const apiProps = Array.isArray(response.data) 
        ? response.data.filter(p => p.status?.toLowerCase() === 'approved' || p.status?.toLowerCase() === 'active') 
        : [];
      
      setProperties(apiProps);
    } catch (error) {
      console.error('Error fetching properties from backend:', error);
      toast.error('Failed to load properties. Check network connection.');
      setProperties([]);
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
    fetchProperties(); // Triggers the useCallback above
  };

  const addToFavorites = async (propertyId, e) => {
    e.stopPropagation(); 
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/auth'); // Or whatever your auth route is
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/favorites`, { property_id: propertyId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Added to favorites');
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.detail || 'Failed to add to favorites');
    }
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'On Request';
    const num = Number(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // Helper to safely get the main image
  const getMainImage = (property) => {
    if (property.images && property.images.length > 0) return property.images[0];
    return property.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"; // Fallback
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#D4AF37]/30 flex flex-col">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="bg-slate-900 pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <CheckCircle className="w-4 h-4" /> Verified Inventory
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">Premium Real Estate</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl font-light">
            Explore thousands of verified properties across India. Find your dream home, investment, or next rental space today.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* LEFT SIDEBAR: FILTERS */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 border border-slate-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Filter className="h-5 w-5 text-[#8B0000]" />
              <h2 className="text-xl font-black text-slate-900">Search Filters</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Category</Label>
                <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
                  <SelectTrigger className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-[#D4AF37] font-medium">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="resale">Resale</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Property Type</Label>
                <Select value={filters.property_type} onValueChange={(v) => handleFilterChange('property_type', v)}>
                  <SelectTrigger className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-[#D4AF37] font-medium">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="plot">Plot / Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">City Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="e.g. Noida, Delhi"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="h-12 pl-10 bg-slate-50 rounded-xl border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Bedrooms</Label>
                <Select value={filters.bhk} onValueChange={(v) => handleFilterChange('bhk', v)}>
                  <SelectTrigger className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-[#D4AF37] font-medium">
                    <SelectValue placeholder="Any Configuration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Configuration</SelectItem>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4">4+ BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Budget Range (₹)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number" placeholder="Min Price" value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-medium"
                  />
                  <Input
                    type="number" placeholder="Max Price" value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-medium"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <Button onClick={applyFilters} className="w-full h-14 bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl shadow-lg shadow-[#8B0000]/30 transition-all hover:-translate-y-0.5">
                  <Search className="w-4 h-4 mr-2"/> Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: PROPERTIES GRID */}
        <div className="lg:w-3/4">
          
          <div className="flex justify-between items-center mb-6 px-2">
             <h3 className="font-black text-slate-900 text-xl">Showing {properties.length} Results</h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
               <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
               <p className="text-slate-500 font-bold tracking-wider uppercase text-sm">Fetching Live Inventory...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300 shadow-sm">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
                 <Search className="w-10 h-10 text-slate-300"/>
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-2">No properties found</h3>
               <p className="text-slate-500 max-w-md mx-auto text-base">We couldn't find any properties matching your exact filters. Try broadening your search or adjusting your budget.</p>
               <Button 
                 onClick={() => {
                   setFilters({category:'', property_type:'', city:'', min_price:'', max_price:'', bhk:'', furnishing:''});
                   setTimeout(() => fetchProperties(), 100);
                 }} 
                 className="mt-8 bg-[#8B0000] hover:bg-[#600000] text-white font-bold px-8 h-12 rounded-xl shadow-md"
               >
                 Clear All Filters
               </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {properties.map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-300 group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                >
                  {/* Image Area */}
                  <div className="h-64 relative overflow-hidden p-2">
                     <div className="w-full h-full rounded-3xl overflow-hidden relative">
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                       <img 
                         src={getMainImage(property)} 
                         alt={property.title}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                       
                       {/* Badges */}
                       <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                         <span className="bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                           <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]"/> Verified
                         </span>
                       </div>
                       <div className="absolute top-4 right-4 z-10 flex gap-2">
                         <span className="bg-[#8B0000] text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-md flex items-center">
                           {property.category || 'Buy'}
                         </span>
                         <button 
                           onClick={(e) => addToFavorites(property.id, e)} 
                           className="p-2 bg-black/40 hover:bg-[#D4AF37] backdrop-blur-md rounded-lg text-white transition-all shadow-md"
                         >
                           <Heart className="h-4 w-4" />
                         </button>
                       </div>
                     </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 pt-4 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-2">
                        <p className="text-[#D4AF37] text-xs font-extrabold uppercase tracking-[0.2em] mb-1">
                          {property.property_type || property.type || 'Property'}
                        </p>
                     </div>
                     <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1 group-hover:text-[#8B0000] transition-colors">
                       {property.title}
                     </h3>
                     <p className="text-slate-500 text-sm flex items-center mb-5 font-medium">
                       <MapPin className="w-4 h-4 mr-1.5 text-slate-400"/> {property.location}, {property.city}
                     </p>

                     {/* Specs Grid */}
                     <div className="grid grid-cols-3 gap-2 mb-6 text-slate-600 text-sm font-bold">
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                          <BedDouble className="w-4 h-4 text-[#D4AF37] mb-1"/> 
                          {property.bhk || property.bedrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                          <Bath className="w-4 h-4 text-[#D4AF37] mb-1"/> 
                          {property.bathrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                          <Layers className="w-4 h-4 text-[#D4AF37] mb-1"/> 
                          {property.area || property.size || '-'} <span className="text-[9px] font-normal">sqft</span>
                        </div>
                     </div>

                     <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-black text-slate-900 block">
                            {formatCurrency(property.price)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Expected Price</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#8B0000] group-hover:text-white transition-colors shadow-sm">
                          <ArrowRight className="w-5 h-5"/>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <footer className="bg-[#050505] text-white pt-24 pb-12 px-6 border-t-[8px] border-[#8B0000] mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-4xl font-black tracking-tight text-[#D4AF37]">ANK<span className="text-white">REALTY</span></h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service, transparency, and expertise in the Indian real estate market.
              </p>
              <div className="flex space-x-4 pt-2">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer group"><Mail className="w-5 h-5 group-hover:scale-110 transition-transform"/></div>
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer group"><Phone className="w-5 h-5 group-hover:scale-110 transition-transform"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Quick Links</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-base">
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Buy Property</Link></li>
                <li><Link to="/sell" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Sell Property</Link></li>
                <li><Link to="/rent" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Rent Property</Link></li>
                <li><Link to="/contact" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Categories</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-base">
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Apartments</Link></li>
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Villas</Link></li>
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Plots / Land</Link></li>
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Commercial</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Contact Us</h4>
              <div className="space-y-5 text-slate-400 font-medium text-base">
                <div className="flex items-start bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <MapPin className="w-6 h-6 mr-4 text-[#D4AF37] shrink-0" /> 
                  <p className="text-sm">Tapasya Corp Heights, Sector 126, Noida, UP 201301</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Mail className="w-6 h-6 mr-4 text-[#D4AF37] shrink-0" /> 
                  <p className="text-sm">info@ankrealty.com</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Phone className="w-6 h-6 mr-4 text-[#D4AF37] shrink-0" /> 
                  <p className="text-sm">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
