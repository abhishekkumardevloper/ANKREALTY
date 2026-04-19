// src/pages/BuyPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  Search, MapPin, X, Bed, Bath, 
  Maximize, CheckCircle, ArrowRight, Calculator,
  Home, DollarSign, Loader2, SlidersHorizontal, ChevronDown, 
  Phone, ShieldCheck, MessageSquare, Send, Mail, Heart,
  Facebook, Twitter, Instagram, Linkedin,
  Map as MapIcon, PieChart, Video, PlayCircle, Briefcase, 
  Banknote, Users, TrendingUp, Award, Sparkles, Building2
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

const bankOffers = [
  { bank: 'HDFC Bank', rate: '8.35%', note: 'Special rate for premium properties' },
  { bank: 'SBI', rate: '8.40%', note: 'Zero processing fee' },
  { bank: 'ICICI Bank', rate: '8.45%', note: 'Instant approval for pre-approved clients' }
];

export default function BuyPage() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  
  // DYNAMIC DATA STATES
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [savedProperties, setSavedProperties] = useState(new Set());
  
  // CHATBOT STATE
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatSubjects = [
    "Schedule a Visit",
    "Price Details & Negotiation",
    "Legal Verification Check",
    "Home Loan Options",
    "Property Locations & Tours"
  ];

  // Advanced Filter States
  const [searchLocation, setSearchLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // EMI Calculator States (FIXED NAMES)
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });
  const [isLoanSubmitting, setIsLoanSubmitting] = useState(false);

  // FETCH PROPERTIES & VIDEOS
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const [propsRes, videoRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/properties?category=buy&limit=100`),
          axios.get(`${API_BASE}/youtube-videos`)
        ]);

        if (propsRes.status === 'fulfilled' && propsRes.value.data) {
          const data = propsRes.value.data;
          setProperties(data);
          
          // Set featured properties
          setFeaturedProperties(data.slice(0, 4));

          // Extract unique locations dynamically
          const uniqueLocs = [...new Set(data.map(p => p.location).filter(Boolean))].sort();
          setAvailableLocations(uniqueLocs);
        }

        if (videoRes.status === 'fulfilled' && videoRes.value.data) {
          setVideos(Array.isArray(videoRes.value.data) ? videoRes.value.data.slice(0, 3) : []);
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPageData();
  }, []);

  // FETCH USER FAVORITES
  useEffect(() => {
    if (user && api) {
      api.get('/favorites').then(res => {
        const favIds = new Set(res.data.map(f => f.property_id));
        setSavedProperties(favIds);
      }).catch(console.error);
    } else {
      setSavedProperties(new Set());
    }
  }, [user, api]);

  // FAVORITE TOGGLE LOGIC
  const handleSaveProperty = async (e, propertyId) => {
    e.stopPropagation(); 
    
    if (!user) {
      toast.error('Please login to save properties.');
      navigate('/auth');
      return;
    }
    
    try {
      if (savedProperties.has(propertyId)) {
        await api.delete(`/favorites/${propertyId}`);
        setSavedProperties(prev => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
        toast.success('Removed from your collection.');
      } else {
        await api.post('/favorites', { property_id: propertyId });
        setSavedProperties(prev => {
          const newSet = new Set(prev);
          newSet.add(propertyId);
          return newSet;
        });
        toast.success('Property saved! Added to your dashboard.');
      }
    } catch (error) {
      console.error('Error saving favorite:', error);
      toast.error('Failed to update favorites. Please try again.');
    }
  };

  // FILTER & SORT LOGIC
  const filteredAndSortedProperties = useMemo(() => {
    let result = properties.filter(p => {
      const matchesLocation = searchLocation 
        ? (p.location?.toLowerCase() === searchLocation.toLowerCase() || p.city?.toLowerCase() === searchLocation.toLowerCase()) 
        : true;
      const matchesPrice = maxPrice ? Number(p.price) <= Number(maxPrice) : true;
      const matchesType = propertyType ? p.property_type?.toLowerCase() === propertyType.toLowerCase() : true;
      
      return matchesLocation && matchesPrice && matchesType;
    });

    if (sortBy === "price_low") result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "price_high") result.sort((a, b) => Number(b.price) - Number(a.price));
    
    return result;
  }, [properties, searchLocation, maxPrice, propertyType, sortBy]);

  const handleSearchClick = () => {
    document.getElementById('property-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  // FULLY FUNCTIONAL LOAN SUBMISSION TO CRM
  const handleLoanLead = async () => {
    if (!loanLead.name || loanLead.phone.replace(/\D/g, '').length < 10) {
      return toast.error('Please enter a valid name and 10-digit phone number.');
    }

    setIsLoanSubmitting(true);
    try {
      await axios.post(`${API_BASE}/contacts`, {
        name: loanLead.name,
        phone: loanLead.phone,
        email: 'N/A',
        interest: 'Home Loan Inquiry',
        message: 'Client requested a callback regarding home loan and EMI consultation from the Buy Page.',
      });
      toast.success('Request received successfully! Our loan expert will call you shortly.');
      setLoanLead({ name: '', phone: '' });
    } catch (error) {
      console.error('Loan Request Error:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsLoanSubmitting(false);
    }
  };

  // EMI Calculation Logic (FIXED NAMES)
  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;
    if (p > 0 && r > 0 && n > 0) {
      return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }
    return 0;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Price on Request';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMainImage = (property) => {
    if (property.images && property.images.length > 0) return property.images[0];
    return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'; 
  };

  const getYouTubeID = (url) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch')) return new URLSearchParams(new URL(url).search).get('v');
      if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
      if (url.includes('youtube.com/embed/')) return url.split('youtube.com/embed/')[1]?.split('?')[0];
    } catch (error) {
      return null;
    }
    return null;
  };

  const mapLocation = searchLocation || 'Noida, Uttar Pradesh';
  const dynamicMapSrc = `https://maps.google.com/maps?q=$${encodeURIComponent(mapLocation)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative selection:bg-[#D4AF37]/30 pb-0">
      <Navbar />

      {/* HERO & ADVANCED SEARCH SECTION */}
      <section className="bg-slate-900 text-white pt-32 pb-24 px-6 relative overflow-hidden">
         <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2000&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
         
         <div className="relative z-10 max-w-5xl mx-auto text-center">
            <span className="bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              Properties for Sale
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">Dream Home</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-light">
              Explore India's most premium apartments, villas, and plots. Verified listings, direct seller contact, zero hassle.
            </p>

            {/* ADVANCED SEARCH WIDGET */}
            <div className="bg-white p-3 rounded-2xl md:rounded-full mx-auto flex flex-col md:flex-row shadow-2xl items-center border border-[#D4AF37]/20 text-slate-900">
               
               <div className="w-full md:flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 relative group">
                  <MapPin className="text-slate-400 w-5 h-5 mr-3 shrink-0 group-focus-within:text-[#8B0000] transition-colors" />
                  <select 
                    value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">All Locations</option>
                    {availableLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none"/>
               </div>
               
               <div className="w-full md:w-48 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 relative group">
                  <Home className="text-slate-400 w-5 h-5 mr-3 shrink-0 group-focus-within:text-[#8B0000] transition-colors" />
                  <select 
                    value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none"/>
               </div>

               <div className="w-full md:w-48 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 relative group">
                  <DollarSign className="text-slate-400 w-5 h-5 mr-3 shrink-0 group-focus-within:text-[#8B0000] transition-colors" />
                  <select 
                    value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">Max Budget</option>
                    <option value="5000000">Up to ₹ 50 Lacs</option>
                    <option value="10000000">Up to ₹ 1 Crore</option>
                    <option value="30000000">Up to ₹ 3 Crore</option>
                    <option value="50000000">Up to ₹ 5 Crore</option>
                    <option value="100000000">Up to ₹ 10 Crore</option>
                  </select>
                  <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none"/>
               </div>

               <Button onClick={handleSearchClick} className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-12 px-8 rounded-xl md:rounded-full w-full md:w-auto mt-2 md:mt-0 shadow-lg shadow-[#8B0000]/30 md:ml-2 transition-all hover:-translate-y-0.5">
                  <Search className="w-5 h-5 md:mr-2" /> <span className="md:inline hidden">Search</span>
               </Button>
            </div>
         </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section id="property-grid" className="max-w-7xl mx-auto px-6 py-12 mt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
           <div>
              <h2 className="text-2xl font-black text-slate-900">Properties for Sale</h2>
              <p className="text-slate-500 font-medium mt-1">Found {filteredAndSortedProperties.length} verified listings</p>
           </div>
           <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center bg-white border border-slate-200 hover:border-[#D4AF37]/50 transition-colors rounded-lg px-3 py-2 shadow-sm relative group">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-2 group-focus-within:text-[#8B0000]"/>
                <select 
                  value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent outline-none text-sm font-bold text-slate-700 cursor-pointer appearance-none pr-4 w-full"
                >
                  <option value="newest">Sort By: Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 w-3 h-3 text-slate-400 pointer-events-none"/>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#8B0000] animate-spin" /></div>
        ) : filteredAndSortedProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm animate-in fade-in zoom-in duration-500">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <Search className="w-8 h-8 text-slate-300"/>
             </div>
             <h3 className="text-xl font-bold text-slate-700">No properties found</h3>
             <p className="text-slate-500 mt-2 max-w-md mx-auto">We couldn't find any properties matching your exact filters. Try broadening your search.</p>
             <Button onClick={() => {setSearchLocation(""); setMaxPrice(""); setPropertyType("");}} className="mt-6 bg-[#D4AF37]/10 text-[#8B0000] hover:bg-[#D4AF37]/20 font-bold transition-colors">
               Clear All Filters
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProperties.map((property) => {
              const isSaved = savedProperties.has(property.id);

              return (
                <div 
                  key={property.id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-300 group cursor-pointer flex flex-col relative"
                  onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                >
                  {/* ADDED: Save Property Button */}
                  <button 
                    onClick={(e) => handleSaveProperty(e, property.id)} 
                    className={`absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all z-20 shadow-md ${isSaved ? 'text-[#8B0000] bg-red-50 border border-red-100' : 'text-slate-400 hover:text-[#8B0000] hover:bg-red-50'}`}
                    title={isSaved ? "Remove from favorites" : "Save to favorites"}
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-[#8B0000] text-[#8B0000]' : ''}`} />
                  </button>

                  {/* Image Area */}
                  <div className="h-60 relative overflow-hidden p-2">
                     <div className="w-full h-full rounded-3xl overflow-hidden relative bg-slate-100">
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                       <img 
                         src={getMainImage(property)} 
                         alt={property.title}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                       <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                         <span className="bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-lg text-xs font-black uppercase shadow-sm flex items-center gap-1">
                           <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]"/> Verified
                         </span>
                       </div>
                     </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 pt-4 flex-1 flex flex-col relative z-20 bg-white">
                     <div className="flex justify-between items-start mb-2">
                        <p className="text-[#8B0000] text-xs font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                          {property.property_type || 'Property'}
                        </p>
                     </div>
                     <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1 group-hover:text-[#8B0000] transition-colors">
                       {property.title}
                     </h3>
                     <p className="text-slate-500 text-sm flex items-center mb-4 font-medium">
                       <MapPin className="w-4 h-4 mr-1 text-slate-400"/> {property.location}, {property.city}
                     </p>

                     {/* Features */}
                     <div className="grid grid-cols-3 gap-2 mb-6 text-slate-600 text-sm font-bold">
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Bed className="w-4 h-4 text-[#D4AF37] mb-1"/> {property.bhk || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Bath className="w-4 h-4 text-[#D4AF37] mb-1"/> {property.bathrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Maximize className="w-4 h-4 text-[#D4AF37] mb-1"/> {property.area || property.size || '-'} <span className="text-[10px] font-normal">sqft</span>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Price</p>
                          <span className="text-2xl font-black text-slate-900">
                              ₹{property.price >= 10000000 ? (property.price / 10000000).toFixed(2) + ' Cr' : (property.price / 100000).toFixed(2) + ' Lac'}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#8B0000] group-hover:text-white transition-colors border border-slate-100 group-hover:border-[#8B0000]">
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

      {/* COMPACT INTERACTIVE EMI CALCULATOR */}
      <section className="py-16 px-6 bg-white border-t border-slate-200">
         <div className="max-w-7xl mx-auto bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group hover:border-[#D4AF37]/50 border border-transparent transition-colors">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
            
            <div className="md:w-1/2 relative z-10 text-white">
               <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6 shadow-inner border border-[#D4AF37]/30">
                 <Calculator className="w-6 h-6 text-[#D4AF37]"/>
               </div>
               <h2 className="text-3xl font-black mb-4">Plan Your Purchase</h2>
               <p className="text-slate-400 mb-8 leading-relaxed">
                 Use our interactive mortgage calculator to estimate your monthly payments. Adjust the sliders to see how loan amount and tenure affect your EMI.
               </p>
               
               <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                 <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Estimated EMI</p>
                 <p className="text-5xl font-black text-[#8B0000] font-mono">₹{calculateEMI().toLocaleString('en-IN')}<span className="text-lg text-slate-400 font-sans"> /mo</span></p>
               </div>
            </div>

            <div className="md:w-1/2 w-full relative z-10 space-y-6 bg-white p-8 rounded-3xl shadow-xl text-slate-900">
               <div>
                 <div className="flex justify-between text-sm mb-2 font-bold">
                   <span className="text-slate-500">Loan Amount</span>
                   <span className="text-[#8B0000] text-lg font-black">₹{loanAmount.toLocaleString('en-IN')}</span>
                 </div>
                 <input type="range" min="1000000" max="100000000" step="500000" value={loanAmount} onChange={(e)=>setLoanAmount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]" />
               </div>
               
               <div>
                 <div className="flex justify-between text-sm mb-2 font-bold">
                   <span className="text-slate-500">Interest Rate</span>
                   <span className="text-[#8B0000] text-lg font-black">{interestRate}% p.a.</span>
                 </div>
                 <input type="range" min="6" max="12" step="0.1" value={interestRate} onChange={(e)=>setInterestRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]" />
               </div>

               <div>
                 <div className="flex justify-between text-sm mb-2 font-bold">
                   <span className="text-slate-500">Loan Tenure</span>
                   <span className="text-[#8B0000] text-lg font-black">{loanTenure} Years</span>
                 </div>
                 <input type="range" min="5" max="30" step="1" value={loanTenure} onChange={(e)=>setLoanTenure(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]" />
               </div>
            </div>
         </div>
      </section>

      {/* --- CORPORATE LEASING BANNER --- */}
      <section className="py-20 px-6 bg-[#050505] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-0" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <p className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Commercial & Enterprise
            </p>
            <h2 className="text-3xl md:text-5xl font-black mb-6">Premium Corporate Leasing Solutions</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              We represent Fortune 500 companies and growing enterprises, providing bespoke commercial leasing, retail spaces, and grade-A office solutions tailored for modern businesses.
            </p>
            <ul className="space-y-3 mb-8 hidden md:block">
              {['Grade-A Office Spaces', 'Turnkey Interior Solutions', 'Pan-India Portfolio Management'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-200 font-bold text-sm">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] mr-2" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 w-full lg:w-auto">
            <Link to="/corporate-leasing">
              <Button className="w-full lg:w-auto h-14 px-8 bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 font-black rounded-xl text-base shadow-xl shadow-[#D4AF37]/20 transition-all hover:-translate-y-1">
                Explore Corporate Spaces <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- PROMOTIONAL VIDEOS --- */}
      {videos.length > 0 && (
        <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3">Property Tours & Insights</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Featured Real Estate Videos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videos.map((vid) => {
                const ytId = getYouTubeID(vid.videoUrl);
                return (
                  <div key={vid.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 group flex flex-col">
                    <div className="relative aspect-video bg-slate-900">
                      {ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                          title={vid.title}
                          className="w-full h-full absolute inset-0"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <Video className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#8B0000] mb-2 flex items-center gap-1.5">
                        <PlayCircle className="w-3.5 h-3.5" /> Video Tour
                      </div>
                      <h3 className="font-black text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-[#8B0000] transition-colors">
                        {vid.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-auto">
                        {vid.description || 'Watch our latest property tour and market insights directly from our experts.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link to="/videos">
                <Button variant="outline" className="border-slate-300 font-bold hover:bg-[#8B0000] hover:text-white transition-colors h-12 px-8 rounded-xl text-base">
                  View All Videos <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* --- DYNAMIC MAP LOCATION FINDER --- */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 gap-8 lg:gap-16 relative">
            <div className="max-w-2xl">
              <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
                <MapIcon className="w-4 h-4" /> Location insights
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Explore {searchLocation || 'Top Corridors'} Visually
              </h2>
              <p className="text-slate-600 text-lg md:text-xl mt-5 leading-relaxed">
                Our interactive map view updates dynamically. Pan and zoom to discover the neighborhoods, connectivity hubs, and infrastructure shaping real estate.
              </p>
            </div>
          </div>

          <div className="w-full h-[550px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white relative bg-slate-200 group">
            <iframe
              src={dynamicMapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Real Estate Map View"
              className="grayscale-[20%] hover:grayscale-0 transition-all duration-700 opacity-90 hover:opacity-100"
            ></iframe>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-24 pb-12 px-6 border-t-[8px] border-[#8B0000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-4xl font-black tracking-tight text-[#D4AF37]">
                ANK <span className="text-white">REALTY</span>
              </h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium">
                Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support across major hubs. Your Trusted Partner.
              </p>
              <div className="flex space-x-3 pt-2">
                <a href={socialLinks?.linkedin || '#'} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href={socialLinks?.twitter || '#'} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href={socialLinks?.facebook || '#'} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href={socialLinks?.instagram || '#'} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Quick Links</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-base">
                <li>
                  <Link to="/properties" className="hover:text-[#D4AF37] transition-colors flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> All Properties
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#D4AF37] transition-colors flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-[#D4AF37] transition-colors flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#D4AF37] transition-colors flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Contact Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Categories</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-base">
                <li>
                  <Link to="/properties?property_type=plot" className="hover:text-[#D4AF37] transition-colors flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Premium Plots
                  </Link>
                </li>
                <li>
                  <Link to="/properties?category=buy" className="hover:text-[#D4AF37] transition-colors flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Residential Homes
                  </Link>
                </li>
                <li>
                  <Link to="/corporate-leasing" className="hover:text-[#D4AF37] transition-colors flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Corporate Leasing
                  </Link>
                </li>
                <li>
                  <Link to="/properties?category=rent" className="hover:text-[#D4AF37] transition-colors flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Rental Homes
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Contact Us</h4>
              <div className="space-y-5 text-slate-400 font-medium text-base">
                <div className="flex items-start bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <MapPin className="w-6 h-6 mr-4 text-[#D4AF37] shrink-0" />
                  <p className="text-sm">Sector 62, Noida, Uttar Pradesh 201309</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Mail className="w-6 h-6 mr-4 text-[#D4AF37] shrink-0" />
                  <p className="text-sm">info@ankrealty.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
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
