import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Heart, Filter, Search, CheckCircle, 
  BedDouble, Bath, Layers, Building, Phone, Mail, Loader2
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

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

// Helper for consistent premium images
const getPlaceholderImage = (id, type) => {
  const images = {
    apartment: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=800&q=80"],
    villa: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"],
    plot: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
    default: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"]
  };
  const safeType = type ? type.toLowerCase() : 'default';
  const list = images[safeType] || images.default;
  // Use a string hash fallback if id isn't purely numeric
  const index = id ? String(id).charCodeAt(0) % list.length : 0;
  return list[index];
};

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
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await axios.get(`${API_BASE}/properties?${params.toString()}`);
      
      // Filter only active/approved properties for public viewing
      const activeProps = Array.isArray(response.data) 
        ? response.data.filter(p => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'approved') 
        : [];
        
      setProperties(activeProps);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
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
    e.stopPropagation(); // Prevent card click from firing
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/auth');
      return;
    }
    try {
      await axios.post(`${API_BASE}/favorites`, { property_id: propertyId });
      toast.success('Added to favorites');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to favorites');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-200">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="bg-slate-900 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
            Discover <span className="text-red-500">Premium Real Estate</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Explore thousands of verified properties across India. Find your dream home, investment, or next rental space today.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR: FILTERS */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 border border-slate-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Filter className="h-5 w-5 text-red-600" />
              <h2 className="text-xl font-black text-slate-900">Search Filters</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</Label>
                <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
                  <SelectTrigger className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-red-500">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell (Owner)</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Property Type</Label>
                <Select value={filters.property_type} onValueChange={(v) => handleFilterChange('property_type', v)}>
                  <SelectTrigger className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-red-500">
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

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">City Location</Label>
                <Input
                  placeholder="e.g. Mumbai, Delhi"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bedrooms</Label>
                <Select value={filters.bhk} onValueChange={(v) => handleFilterChange('bhk', v)}>
                  <SelectTrigger className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-red-500">
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
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Budget Range (₹)</Label>
                <Input
                  type="number" placeholder="Min Price" value={filters.min_price}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                />
                <Input
                  type="number" placeholder="Max Price" value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button onClick={applyFilters} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20">
                  <Search className="w-4 h-4 mr-2"/> Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: PROPERTIES GRID */}
        <div className="lg:w-3/4">
          
          <div className="flex justify-between items-center mb-6 px-2">
             <h3 className="font-bold text-slate-700">Showing {properties.length} Results</h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
               <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
               <p className="text-slate-500 font-medium">Scanning inventory...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                 <Search className="w-8 h-8 text-slate-300"/>
               </div>
               <h3 className="text-xl font-bold text-slate-700">No properties found</h3>
               <p className="text-slate-500 mt-2 max-w-sm mx-auto">Try removing some filters or adjusting your budget to see more available options.</p>
               <Button 
                 onClick={() => {
                   setFilters({category:'', property_type:'', city:'', min_price:'', max_price:'', bhk:'', furnishing:''});
                   setTimeout(() => fetchProperties(), 100);
                 }} 
                 className="mt-6 bg-slate-900 hover:bg-black text-white font-bold px-8 rounded-xl"
               >
                 Clear Filters
               </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property) => {
                
                // Real Image Logic
                const coverImage = property.images && property.images.length > 0 
                  ? property.images[0] 
                  : property.imageUrl || getPlaceholderImage(property.id, property.category || property.property_type);

                return (
                  <div 
                    key={property.id} 
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 group cursor-pointer flex flex-col"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    {/* Image Area */}
                    <div className="h-56 relative overflow-hidden p-2 pb-0">
                       <div className="w-full h-full rounded-2xl overflow-hidden relative">
                         <img 
                           src={coverImage} 
                           alt={property.title}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                         
                         {/* Badges */}
                         <div className="absolute top-3 left-3 flex flex-col gap-2">
                           <span className="bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center">
                             <CheckCircle className="w-3 h-3 mr-1 text-green-600"/> Verified
                           </span>
                           <span className="bg-red-600 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm w-fit">
                             {property.category || 'Sale'}
                           </span>
                         </div>
                         
                         {/* Action Buttons overlay */}
                         <button 
                           onClick={(e) => addToFavorites(property.id, e)} 
                           className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-white backdrop-blur-md rounded-full text-white hover:text-red-500 transition-all z-10"
                         >
                           <Heart className="h-4 w-4" />
                         </button>
                         
                         <div className="absolute bottom-3 left-3">
                           <span className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center">
                             <MapPin className="h-3 w-3 mr-1"/> {property.city}
                           </span>
                         </div>
                       </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                       <div className="flex justify-between items-start mb-1">
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                            {property.property_type || 'Property'}
                          </p>
                       </div>
                       <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-1 group-hover:text-red-600 transition-colors">
                         {property.title}
                       </h3>
                       
                       {/* Specs Grid */}
                       <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100 flex flex-col items-center justify-center">
                            <BedDouble className="w-4 h-4 text-slate-400 mb-0.5"/>
                            <p className="text-sm font-bold text-slate-800">{property.bedrooms || property.bhk || '-'}</p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100 flex flex-col items-center justify-center">
                            <Bath className="w-4 h-4 text-slate-400 mb-0.5"/>
                            <p className="text-sm font-bold text-slate-800">{property.bathrooms || '-'}</p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100 flex flex-col items-center justify-center">
                            <Layers className="w-4 h-4 text-slate-400 mb-0.5"/>
                            <p className="text-sm font-bold text-slate-800">{property.area || property.size || '-'} <span className="text-[9px] font-normal">sqft</span></p>
                          </div>
                       </div>

                       <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Price</p>
                            <span className="text-xl font-black text-slate-900">₹{Number(property.price).toLocaleString('en-IN')}</span>
                          </div>
                          <Button variant="outline" className="h-9 px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600 text-xs font-bold rounded-lg pointer-events-none">
                            View Details
                          </Button>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed pr-4">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service, transparency, and expertise in the Indian real estate market.
              </p>
              <div className="flex space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Mail className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Phone className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/sell" className="hover:text-red-500 transition-colors">Sell Property</Link></li>
                <li><Link to="/rent" className="hover:text-red-500 transition-colors">Rent Property</Link></li>
                <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Apartments</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Villas</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Plots / Land</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Commercial</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium text-sm">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-600 shrink-0"/> 123 Business Avenue, Tech Park, Mumbai, 400001</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-600 shrink-0"/> info@ankrealty.com</p>
                <p className="flex items-center"><Phone className="w-5 h-5 mr-3 text-red-600 shrink-0"/> +91 98765 43210</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}