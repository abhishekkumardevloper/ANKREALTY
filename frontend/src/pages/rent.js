// src/pages/RentPage.jsx (Used for Resale Properties)
import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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

// API Configuration matching your environment
const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api";

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
  const navigate = useNavigate(); 
  
  // DYNAMIC DATA STATES
  const [resaleProperties, setResaleProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // FILTER STATES
  const [searchCity, setSearchCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchResaleProperties = async () => {
      setLoading(true);
      try {
        // Fetch properties strictly in the 'resale' category
        const response = await axios.get(`${API_BASE}/properties?category=resale&limit=100`);
        setResaleProperties(response.data || []);
      } catch (error) {
        console.error("Error fetching resale properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResaleProperties();
  }, []);

  // FILTER & SORT LOGIC
  const filteredAndSortedRentals = useMemo(() => {
    let result = resaleProperties.filter(r => {
      const matchesCity = searchCity 
        ? (r.city?.toLowerCase().includes(searchCity.toLowerCase()) || r.title?.toLowerCase().includes(searchCity.toLowerCase()) || r.location?.toLowerCase().includes(searchCity.toLowerCase())) 
        : true;
      const matchesPrice = maxPrice ? Number(r.price) <= Number(maxPrice) : true;
      const matchesType = propertyType ? (r.property_type || "").toLowerCase() === propertyType.toLowerCase() : true;
      
      return matchesCity && matchesPrice && matchesType;
    });

    // Sorting
    if (sortBy === "price_low") result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "price_high") result.sort((a, b) => Number(b.price) - Number(a.price));
    // Default 'newest' is handled by the backend's descending created_at sort
    
    return result;
  }, [resaleProperties, searchCity, maxPrice, propertyType, sortBy]);

  // Helper to safely get the main image
  const getMainImage = (property) => {
    if (property.images && property.images.length > 0) return property.images[0];
    return property.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"; // Fallback
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative selection:bg-[#D4AF37]/30">
      <Navbar />
      
      {/* HERO SECTION */}
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
               <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span> Zero Brokerage Options Available
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
              Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">Resale Home</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-light">
              Discover verified resale apartments, floors, and premium homes. Connect directly with owners and get transparent pricing.
            </p>

            {/* SEARCH WIDGET */}
            <div className="bg-white p-3 rounded-2xl md:rounded-full mx-auto flex flex-col md:flex-row shadow-2xl items-center border border-[#D4AF37]/20">
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

               <Button className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-12 px-8 rounded-xl md:rounded-full w-full md:w-auto mt-2 md:mt-0 shadow-lg shadow-[#8B0000]/30 md:ml-2 transition-all">
                  <Search className="w-5 h-5 md:mr-2" /> <span className="md:inline hidden">Search</span>
               </Button>
            </div>
         </div>
      </section>

      {/* LISTINGS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
           <div>
              <h2 className="text-2xl font-black text-slate-900">Premium Resale Properties</h2>
              <p className="text-slate-500 font-medium mt-1">Found {filteredAndSortedRentals.length} verified resale units available</p>
           </div>
           <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center bg-white border border-slate-200 hover:border-[#D4AF37]/50 transition-colors rounded-lg px-3 py-2 shadow-sm">
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
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#8B0000] w-12 h-12"/></div>
        ) : filteredAndSortedRentals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <Search className="w-8 h-8 text-slate-300"/>
             </div>
             <h3 className="text-xl font-bold text-slate-700">No resale listings match your criteria</h3>
             <p className="text-slate-500 mt-2 max-w-md mx-auto">We couldn't find any properties matching your exact filters. Try broadening your search.</p>
             <Button onClick={() => {setSearchCity(""); setMaxPrice(""); setPropertyType("");}} className="mt-6 bg-[#D4AF37]/10 text-[#8B0000] hover:bg-[#D4AF37]/20 font-bold px-8">
               Clear All Filters
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedRentals.map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-300 group cursor-pointer flex flex-col transform hover:-translate-y-1"
                  onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                >
                  <div className="h-60 relative overflow-hidden p-2">
                     <div className="w-full h-full rounded-3xl overflow-hidden relative">
                       <img 
                         src={getMainImage(property)} 
                         alt={property.title}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                       <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-lg text-xs font-black uppercase shadow-sm flex items-center gap-1.5">
                         <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span> {property.projectStatus || 'Resale'}
                       </div>
                       <button className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-[#8B0000] backdrop-blur-md rounded-full text-white transition-all border border-white/20">
                         <ShieldCheck className="w-4 h-4" />
                       </button>
                     </div>
                  </div>
                  
                  <div className="p-6 pt-3 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-2">
                         <p className="text-[#8B0000] text-xs font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                           {property.property_type || property.type || 'Property'}
                         </p>
                     </div>
                     <h3 className="font-black text-xl text-slate-900 line-clamp-1 mb-2 group-hover:text-[#8B0000] transition-colors">
                       {property.title}
                     </h3>
                     <p className="text-slate-500 text-sm flex items-center mb-5">
                       <MapPin className="w-4 h-4 mr-1 text-slate-400"/> {property.location}, {property.city}
                     </p>
                     
                     <div className="grid grid-cols-3 gap-2 mb-6 text-slate-600 text-sm font-bold">
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                          <Bed className="w-4 h-4 text-[#D4AF37] mb-1"/> {property.bhk || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                          <Bath className="w-4 h-4 text-[#D4AF37] mb-1"/> {property.bathrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                          <Maximize className="w-4 h-4 text-[#D4AF37] mb-1"/> {property.area || property.size || '-'} <span className="text-[10px] font-normal">sqft</span>
                        </div>
                     </div>
                     
                     <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Expected Price</p>
                           <span className="text-2xl font-black text-slate-900">
                             {property.price > 0 ? `₹${property.price >= 10000000 ? (property.price / 10000000).toFixed(2) + ' Cr' : (property.price / 100000).toFixed(2) + ' Lac'}` : 'On Request'}
                           </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#8B0000] group-hover:text-[#D4AF37] transition-colors">
                          <ArrowRight className="w-5 h-5"/>
                        </div>
                     </div>
                  </div>
                </div>
            ))}
          </div>
        )}
      </section>

      {/* MARKET INSIGHTS */}
      <section className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#8B0000] text-xs font-bold uppercase mb-4 border border-[#D4AF37]/30">
              <TrendingUp className="w-3 h-3 text-[#D4AF37]"/> Market Insights
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">Understand Local Resale Trends</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Make informed decisions. Resale values are moving based on inventory and location demand. Compare market pricing before finalizing your deal.
            </p>
            <div className="space-y-4">
               <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5"/>
                  <p className="text-sm text-slate-700 font-medium">Average 2BHK resale demand remains strongest in central Noida sectors.</p>
               </div>
               <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Info className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5"/>
                  <p className="text-sm text-slate-700 font-medium">Large-size units and premium towers are seeing faster price movement.</p>
               </div>
            </div>
          </div>
          
          <div className="lg:w-2/3 w-full bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
            <h3 className="font-bold text-white text-xl mb-6 relative z-10 flex items-center gap-2">
              Average Resale Benchmark (Indicative)
            </h3>
            <div className="h-64 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="month" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                    itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                    formatter={(value) => [`₹${value}`, 'Trend index']}
                  />
                  <Area type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={4} fillOpacity={1} fill="url(#colorRent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050505] text-white pt-20 pb-10 px-6 border-t-[6px] border-[#8B0000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
            <div className="md:col-span-2 space-y-6 pr-4">
              <h3 className="text-3xl font-black tracking-tight text-[#D4AF37]">ANK <span className="text-white">REALTY</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The Red Carpet of Real Estate. We are India's most trusted property portal, committed to providing transparency, verified listings, and end-to-end property solutions.
              </p>
              <div className="space-y-3 pt-2">
                <p className="flex items-center text-slate-300"><Phone className="w-5 h-5 mr-3 text-[#D4AF37]"/> Toll Free: 1800-123-4567</p>
                <p className="flex items-center text-slate-300"><Mail className="w-5 h-5 mr-3 text-[#D4AF37]"/> support@ankrealty.com</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Properties</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><Link to="/buy" className="hover:text-[#D4AF37] transition-colors">Property for Sale</Link></li>
                <li><Link to="/rent" className="hover:text-[#D4AF37] transition-colors">Property Resale</Link></li>
                <li><Link to="/buy" className="hover:text-[#D4AF37] transition-colors">Commercial Projects</Link></li>
                <li><Link to="/buy" className="hover:text-[#D4AF37] transition-colors">New Projects</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Company</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-[#D4AF37] transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link></li>
                <li><Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">For Builders & Agents</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><Link to="/sell" className="hover:text-[#D4AF37] transition-colors">List your Property</Link></li>
                <li><Link to="/advertise" className="hover:text-[#D4AF37] transition-colors">Advertise with Us</Link></li>
                <li><Link to="/agent-login" className="hover:text-[#D4AF37] transition-colors">Agent Portal</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
               <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Facebook</span>
               <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Twitter</span>
               <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Instagram</span>
               <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
