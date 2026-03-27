import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import resaleListings from '../lib/resaleListings';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Search, MapPin, X, CheckCircle, Bed, Bath, 
  Maximize, Calendar, Loader2, Filter, Home, 
  TrendingUp, Info, Mail, Phone, DollarSign, ChevronDown, ShieldCheck, ArrowRight
} from "lucide-react";
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid 
} from 'recharts';

// API Configuration
const API_URL = 'http://127.0.0.1:8000/api/properties';

// Helper to assign consistent rental-themed images
const getPlaceholderImage = (id, type) => {
  const images = {
    apartment: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=800&q=80"],
    villa: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"],
    default: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80"]
  };
  const safeType = type ? type.toLowerCase() : 'default';
  const list = images[safeType] || images.default;
  return list[id % list.length];
};

// Static Chart Data (Simulated Market Trends)
const rentTrends = [
  { month: 'Jan', price: 24000 }, 
  { month: 'Feb', price: 24200 },
  { month: 'Mar', price: 24500 }, 
  { month: 'Apr', price: 25000 },
  { month: 'May', price: 26000 }, 
  { month: 'Jun', price: 28000 },
  { month: 'Jul', price: 27500 }, 
  { month: 'Aug', price: 27000 },
];

export default function RentPage() {
  const navigate = useNavigate(); // Hook for routing
  const [resaleProperties, setResaleProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Advanced Filter States
  const [searchCity, setSearchCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // FETCH DATA
  useEffect(() => {
    const fetchResaleProperties = async () => {
      try {
        const response = await axios.get(API_URL);
        const activeResale = Array.isArray(response.data)
          ? response.data.filter((p) => {
              const status = (p.status || "").toLowerCase();
              const category = (p.category || p.type || "").toLowerCase();
              return (status === "active" || status === "approved") && (category === "sell" || category === "resale");
            })
          : [];
        setResaleProperties([...resaleListings, ...activeResale]);
      } catch (error) {
        console.error("Error fetching resale properties:", error);
        setResaleProperties(resaleListings);
      } finally {
        setLoading(false);
      }
    };
    fetchResaleProperties();
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedRentals = useMemo(() => {
    let result = resaleProperties.filter(r => {
      const matchesCity = searchCity ? (r.city?.toLowerCase().includes(searchCity.toLowerCase()) || r.title?.toLowerCase().includes(searchCity.toLowerCase())) : true;
      const matchesPrice = maxPrice ? Number(r.price) <= Number(maxPrice) : true;
      const matchesType = propertyType ? (r.property_type || r.category || r.type || "").toLowerCase() === propertyType.toLowerCase() : true;
      return matchesCity && matchesPrice && matchesType;
    });

    if (sortBy === "price_low") result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "price_high") result.sort((a, b) => Number(b.price) - Number(a.price));
    
    return result;
  }, [resaleProperties, searchCity, maxPrice, propertyType, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <Navbar />
      
      {/* HERO & ADVANCED SEARCH SECTION */}
      <section className="bg-slate-900 text-white pt-32 pb-24 px-6 relative overflow-hidden">
         <div className="absolute inset-0 opacity-40 mix-blend-overlay" 
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
         
         <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-xl">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Zero Brokerage Options Available
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
              Find Your Perfect <span className="text-red-500">Resale Home</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-light">
              Discover verified resale apartments, floors, and premium homes. Connect directly with owners and get transparent pricing.
            </p>

            {/* ADVANCED SEARCH WIDGET */}
            <div className="bg-white p-3 rounded-2xl md:rounded-full mx-auto flex flex-col md:flex-row shadow-2xl items-center border border-slate-200">
               <div className="w-full md:flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100">
                  <MapPin className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
                  <input 
                    type="text" placeholder="City or Locality..." 
                    value={searchCity} onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 font-medium"
                  />
               </div>
               
               <div className="w-full md:w-48 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 relative group">
                  <Home className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
                  <select 
                    value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="pg">PG / Co-living</option>
                  </select>
                  <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none"/>
               </div>

               <div className="w-full md:w-48 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 relative">
                  <DollarSign className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
                  <select 
                    value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">Max Budget</option>
                    <option value="10000000">Up to ₹ 1 Cr</option>
                    <option value="20000000">Up to ₹ 2 Cr</option>
                    <option value="30000000">Up to ₹ 3 Cr</option>
                    <option value="50000000">Up to ₹ 5 Cr</option>
                    <option value="100000000">Up to ₹ 10 Cr</option>
                  </select>
                  <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none"/>
               </div>

               <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 rounded-xl md:rounded-full w-full md:w-auto mt-2 md:mt-0 shadow-lg md:ml-2">
                  <Search className="w-5 h-5 md:mr-2" /> <span className="md:inline hidden">Search</span>
               </Button>
            </div>
         </div>
      </section>

      {/* FULL WIDTH LISTINGS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
           <div>
              <h2 className="text-2xl font-black text-slate-900">Premium Resale Properties</h2>
              <p className="text-slate-500 font-medium mt-1">Found {filteredAndSortedRentals.length} verified resale units available</p>
           </div>
           <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                <Filter className="w-4 h-4 text-slate-400 mr-2"/>
                <select 
                  value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent outline-none text-sm font-bold text-slate-700 cursor-pointer appearance-none pr-4"
                >
                  <option value="newest">Sort By: Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600 w-12 h-12"/></div>
        ) : filteredAndSortedRentals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <Search className="w-8 h-8 text-slate-300"/>
             </div>
             <h3 className="text-xl font-bold text-slate-700">No resale listings match your criteria</h3>
             <p className="text-slate-500 mt-2 max-w-md mx-auto">We couldn't find any properties matching your exact filters. Try broadening your search.</p>
             <Button onClick={() => {setSearchCity(""); setMaxPrice(""); setPropertyType("");}} className="mt-6 bg-red-50 text-red-600 hover:bg-red-100 font-bold px-8">
               Clear All Filters
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedRentals.map((property) => {
               // Extract real cover image from backend if it exists, otherwise use placeholder
               const coverImage = property.images && property.images.length > 0 
                 ? property.images[0] 
                 : property.imageUrl || getPlaceholderImage(property.id, property.category || property.type);

              return (
                <div 
                  key={property.id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all duration-300 group cursor-pointer flex flex-col transform hover:-translate-y-1"
                  onClick={() => navigate(`/property/${property.id}`)} // 🔥 NAVIGATES TO DETAILS PAGE
                >
                  {/* Image Area */}
                  <div className="h-60 relative overflow-hidden p-2">
                     <div className="w-full h-full rounded-3xl overflow-hidden relative">
                       <img 
                         src={coverImage} 
                         alt={property.title}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                       <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-lg text-xs font-black uppercase shadow-sm flex items-center gap-1.5">
                         <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Resale
                       </div>
                       <button className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-white backdrop-blur-md rounded-full text-white hover:text-red-500 transition-all">
                         <ShieldCheck className="w-4 h-4" />
                       </button>
                     </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-6 pt-3 flex-1 flex flex-col">
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                       {property.category || property.type || 'Resale'}
                     </p>
                     <h3 className="font-black text-xl text-slate-900 line-clamp-1 mb-2 group-hover:text-red-600 transition-colors">
                       {property.title}
                     </h3>
                     <p className="text-slate-500 text-sm flex items-center mb-5"><MapPin className="w-4 h-4 mr-1 text-slate-400"/> {property.city}</p>
                     
                     <div className="grid grid-cols-3 gap-2 mb-6 text-slate-600 text-sm font-bold">
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                          <Bed className="w-4 h-4 text-slate-400 mb-1"/> {property.bedrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                          <Bath className="w-4 h-4 text-slate-400 mb-1"/> {property.bathrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                          <Maximize className="w-4 h-4 text-slate-400 mb-1"/> {property.area || property.size || '-'} <span className="text-[10px] font-normal">sqft</span>
                        </div>
                     </div>
                     
                     <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Expected Price</p>
                            <span className="text-2xl font-black text-slate-900">{property.price ? `₹${Number(property.price).toLocaleString('en-IN')}` : property.priceText || 'On Request'}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                          <ArrowRight className="w-5 h-5"/>
                        </div>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MARKET INSIGHTS SECTION */}
      <section className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase mb-4 border border-blue-100">
              <TrendingUp className="w-3 h-3"/> Market Insights
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">Understand Local Resale Trends</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Make informed decisions. Resale values are moving based on inventory and location demand. Compare market pricing before finalizing your deal.
            </p>
            <div className="space-y-4">
               <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/>
                  <p className="text-sm text-slate-700 font-medium">Average 2BHK resale demand remains strongest in central Noida sectors.</p>
               </div>
               <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"/>
                  <p className="text-sm text-slate-700 font-medium">Large-size units and premium towers are seeing faster price movement.</p>
               </div>
            </div>
          </div>
          
          <div className="lg:w-2/3 w-full bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            <h3 className="font-bold text-white text-xl mb-6 relative z-10 flex items-center gap-2">
              Average Resale Benchmark (Indicative)
            </h3>
            <div className="h-64 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="month" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                    itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                    formatter={(value) => [`₹${value}`, 'Trend index']}
                  />
                  <Area type="monotone" dataKey="price" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorRent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
            <div className="md:col-span-2 space-y-6 pr-4">
              <h3 className="text-3xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The Red Carpet of Real Estate. We are India's most trusted property portal, committed to providing transparency, verified listings, and end-to-end property solutions.
              </p>
              <div className="space-y-3 pt-2">
                <p className="flex items-center text-slate-300"><Phone className="w-5 h-5 mr-3 text-red-500"/> Toll Free: 1800-123-4567</p>
                <p className="flex items-center text-slate-300"><Mail className="w-5 h-5 mr-3 text-red-500"/> support@ankrealty.com</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Properties</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link to="/buy" className="hover:text-white transition-colors">Property for Sale</Link></li>
                <li><Link to="/rent" className="hover:text-white transition-colors">Property Resale</Link></li>
                <li><Link to="/buy" className="hover:text-white transition-colors">Commercial Projects</Link></li>
                <li><Link to="/buy" className="hover:text-white transition-colors">New Projects</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Company</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">For Builders & Agents</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link to="/sell" className="hover:text-white transition-colors">List your Property</Link></li>
                <li><Link to="/advertise" className="hover:text-white transition-colors">Advertise with Us</Link></li>
                <li><Link to="/agent-login" className="hover:text-white transition-colors">Agent Portal</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
               <span className="hover:text-white cursor-pointer">Facebook</span>
               <span className="hover:text-white cursor-pointer">Twitter</span>
               <span className="hover:text-white cursor-pointer">Instagram</span>
               <span className="hover:text-white cursor-pointer">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}