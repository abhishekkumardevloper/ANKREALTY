// src/pages/BuyPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Search, MapPin, X, Bed, Bath, 
  Maximize, CheckCircle, ArrowRight, Calculator,
  Home, DollarSign, Loader2, SlidersHorizontal, ChevronDown, 
  Phone, ShieldCheck, MessageSquare, Send, Mail, ChevronRight,
  Building2, Banknote, Users, TrendingUp, Award, Sparkles, LandPlot, 
  RefreshCw, Key, Briefcase, Zap, FileSignature, Map, PieChart,
  Instagram, Youtube, Linkedin
} from "lucide-react";

// Assuming these exist in your project like they do for HomePage
import { bankOffers, exploreLocalities, socialLinks } from '@/lib/siteData';
import { WHATSAPP_URL, createPropertySearch } from '@/lib/api';

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

// --- MISSING DATA ARRAYS RESTORED ---
const topRowLogos = [
  "/images (3).png", "/images__9_-removebg-preview.png", "/images (1).png", "/images (2).png", "/183f468e401f4220bce9e4f7b1e3ffd820251112162925170.png",
];

const bottomRowLogos = [
  "/images.png", "/4f3bb698972531.Y3JvcCw5NTAsNzQzLDIyMywyMQ-removebg-preview.png", "/Max_Estates_logo.svg.png", "/M3M-Jacob-and-Co-logo.png",
];

const localityHighlights = [
  { name: 'Noida Sector 150', avgPrice: '₹8,500/sqft onwards', connectivity: 'Metro & Expressway', landmark: '9-hole golf course', tags: ['Residential Hub', 'Greenest Sector'] },
  { name: 'Noida Extension', avgPrice: '₹4,200/sqft onwards', connectivity: 'Upcoming Metro', landmark: 'Gaur City Mall', tags: ['Affordable Housing', 'Rapid Development'] },
  { name: 'Yamuna Expressway', avgPrice: '₹35L onwards (Plot)', connectivity: 'Airport & F1 Track', landmark: 'Jewar Airport Site', tags: ['High Plot Demand', 'Investment Hotspot'] },
  { name: 'Sector 137, Noida', avgPrice: '₹6,800/sqft onwards', connectivity: 'Operational Metro', landmark: 'Logix Technova Park', tags: ['IT Corridor', 'Established Society'] },
];

const processSteps = [
  { title: "Search Property", desc: "Discover premium listings, plots, and projects with ease.", icon: Search },
  { title: "Book Site Visit", desc: "Our local experts coordinate viewings that fit your schedule.", icon: MapPin },
  { title: "Legal Verification", desc: "Transparent review of property documents for total peace of mind.", icon: ShieldCheck },
  { title: "Close & Transact", desc: "Benefit from human guidance through documentation and final handover.", icon: FileSignature }
];

const dummyMapPins = [
  { id: 1, name: "Premium Plot - Sector 150", top: "35%", left: "45%", price: "₹1.2 Cr" },
  { id: 2, name: "Villa Plot - Yamuna Exp.", top: "65%", left: "60%", price: "₹85 L" },
  { id: 3, name: "Commercial Land - Ext.", top: "25%", left: "30%", price: "₹3.5 Cr" },
  { id: 4, name: "Corner Plot - Sec 137", top: "50%", left: "55%", price: "₹2.1 Cr" },
  { id: 5, name: "Golf View Plot - Sec 128", top: "40%", left: "20%", price: "₹5 Cr" },
];

const socialIconMap = { instagram: Instagram, youtube: Youtube, linkedin: Linkedin, whatsapp: MessageSquare };

export default function BuyPage() {
  const navigate = useNavigate();
  
  // DYNAMIC DATA STATES
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [premiumPlots, setPremiumPlots] = useState([]);
  const [resaleProperties, setResaleProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // CHATBOT STATE
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });
  const [searchFocused, setSearchFocused] = useState(false);

  const chatSubjects = [
    "Schedule a Visit", "Price Details & Negotiation", "Legal Verification Check", "Home Loan Options", "Property Locations & Tours"
  ];

  // Advanced Filter States
  const [searchCity, setSearchCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // EMI Calculator States
  const [loanAmt, setLoanAmt] = useState(5000000);
  const [intRate, setIntRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  // FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const [mainRes, featuredRes, plotsRes, resaleRes] = await Promise.all([
          fetch(`${API_BASE}/properties?category=buy&limit=100`),
          fetch(`${API_BASE}/properties`),
          fetch(`${API_BASE}/properties?property_type=plot&limit=4`),
          fetch(`${API_BASE}/properties?category=resale&limit=4`)
        ]);
        
        // Safety checks for JSON to prevent the HTML crash
        if (mainRes.ok && mainRes.headers.get("content-type")?.includes("application/json")) {
          const data = await mainRes.json();
          setProperties(data.filter(p => (p.status || 'pending').toLowerCase() === 'approved'));
        }
        
        if (featuredRes.ok && featuredRes.headers.get("content-type")?.includes("application/json")) {
           const allProps = await featuredRes.json();
           setFeaturedProperties(allProps.slice(0, 4));
        }
        
        if (plotsRes.ok && plotsRes.headers.get("content-type")?.includes("application/json")) {
          setPremiumPlots(await plotsRes.json());
        }
        
        if (resaleRes.ok && resaleRes.headers.get("content-type")?.includes("application/json")) {
          setResaleProperties(await resaleRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  const suggestions = useMemo(() => {
    const query = searchCity.trim().toLowerCase();
    if (!query) return exploreLocalities || [];
    return (exploreLocalities || []).filter((item) => item.name.toLowerCase().includes(query) || item.city.toLowerCase().includes(query));
  }, [searchCity]);

  const handleSearch = () => {
    // Only scroll down to results
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  };
  
  const handleNewsletter = () => {
    if (!newsletterEmail.includes('@')) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ANK Realty, subscribe me for property deals. My email is ${newsletterEmail}.`)}`, '_blank', 'noopener,noreferrer');
  };
  
  const handleLoanLead = () => {
    if (!loanLead.name || loanLead.phone.replace(/\D/g, '').length < 10) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ANK Realty, I want a home-loan comparison. Name: ${loanLead.name}, Phone: ${loanLead.phone}.`)}`, '_blank', 'noopener,noreferrer');
  };

  // Filter & Sort Logic
  const filteredAndSortedProperties = useMemo(() => {
    let result = properties.filter(p => {
      const matchesCity = searchCity 
        ? (p.city?.toLowerCase().includes(searchCity.toLowerCase()) || p.location?.toLowerCase().includes(searchCity.toLowerCase()) || p.title?.toLowerCase().includes(searchCity.toLowerCase())) 
        : true;
      const matchesPrice = maxPrice ? Number(p.price) <= Number(maxPrice) : true;
      const matchesType = propertyType ? p.property_type?.toLowerCase() === propertyType.toLowerCase() : true;
      
      return matchesCity && matchesPrice && matchesType;
    });

    if (sortBy === "price_low") result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "price_high") result.sort((a, b) => Number(b.price) - Number(a.price));
    
    return result;
  }, [properties, searchCity, maxPrice, propertyType, sortBy]);

  const calculateEMI = () => {
    const p = loanAmt;
    const r = intRate / 12 / 100;
    const n = tenure * 12;
    if (p > 0 && r > 0 && n > 0) {
      return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }
    return 0;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Price on Request';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getMainImage = (property) => {
    if (property.images && property.images.length > 0) return property.images[0];
    return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'; 
  };

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
            <div className="bg-white p-3 rounded-2xl md:rounded-full mx-auto flex flex-col md:flex-row shadow-2xl items-center border border-[#D4AF37]/20">
               <div className="w-full md:flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 relative group">
                  <MapPin className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
                  <input 
                    type="text" placeholder="City or Locality..." 
                    value={searchCity} onChange={(e) => setSearchCity(e.target.value)}
                    onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 font-medium"
                  />
                  
                  {searchFocused && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-4 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden text-left">
                      {suggestions.slice(0, 5).map((item) => (
                        <button key={item.name} type="button" onClick={() => { setSearchCity(item.city); setSearchFocused(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors flex justify-between items-center group/item">
                          <div>
                            <p className="text-base font-bold text-slate-900 group-hover/item:text-[#8B0000] transition-colors">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.city}</p>
                          </div>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold">{item.badge}</span>
                        </button>
                      ))}
                    </div>
                  )}
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
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
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
                    <option value="5000000">Up to ₹ 50 Lacs</option>
                    <option value="10000000">Up to ₹ 1 Crore</option>
                    <option value="30000000">Up to ₹ 3 Crore</option>
                    <option value="50000000">Up to ₹ 5 Crore</option>
                    <option value="100000000">Up to ₹ 10 Crore</option>
                  </select>
                  <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none"/>
               </div>

               <Button onClick={handleSearch} className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-12 px-8 rounded-xl md:rounded-full w-full md:w-auto mt-2 md:mt-0 shadow-lg shadow-[#8B0000]/30 md:ml-2 transition-all">
                  <Search className="w-5 h-5 md:mr-2" /> <span className="md:inline hidden">Search</span>
               </Button>
            </div>
         </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
           <div>
              <h2 className="text-2xl font-black text-slate-900">Properties for Sale</h2>
              <p className="text-slate-500 font-medium mt-1">Found {filteredAndSortedProperties.length} verified listings</p>
           </div>
           <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center bg-white border border-slate-200 hover:border-[#D4AF37]/50 transition-colors rounded-lg px-3 py-2 shadow-sm">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-2"/>
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
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#8B0000] animate-spin" /></div>
        ) : filteredAndSortedProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <Search className="w-8 h-8 text-slate-300"/>
             </div>
             <h3 className="text-xl font-bold text-slate-700">No properties found</h3>
             <p className="text-slate-500 mt-2">Try removing some filters to see more results.</p>
             <Button onClick={() => {setSearchCity(""); setMaxPrice(""); setPropertyType("");}} className="mt-4 bg-[#D4AF37]/10 text-[#8B0000] hover:bg-[#D4AF37]/20 font-bold transition-colors">
               Clear All Filters
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProperties.map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-300 group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                >
                  <div className="h-60 relative overflow-hidden p-2">
                     <div className="w-full h-full rounded-3xl overflow-hidden relative bg-slate-100">
                       <img 
                         src={getMainImage(property)} 
                         alt={property.title}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                       <div className="absolute top-3 left-3 flex flex-col gap-2">
                         <span className="bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-lg text-xs font-black uppercase shadow-sm flex items-center gap-1">
                           <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]"/> Verified
                         </span>
                       </div>
                     </div>
                  </div>

                  <div className="p-6 pt-4 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-2">
                        <p className="text-[#8B0000] text-xs font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                          {property.property_type || 'Property'}
                        </p>
                     </div>
                     <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1 group-hover:text-[#8B0000] transition-colors">
                       {property.title}
                     </h3>
                     <p className="text-slate-500 text-sm flex items-center mb-4">
                       <MapPin className="w-4 h-4 mr-1 text-slate-400"/> {property.location}, {property.city}
                     </p>

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
                             {formatCurrency(property.price)}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#8B0000] group-hover:text-[#D4AF37] transition-colors border border-slate-100 group-hover:border-[#8B0000]">
                          <ArrowRight className="w-5 h-5"/>
                        </div>
                     </div>
                  </div>
                </div>
            ))}
          </div>
        )}
      </section>

      {/* --- QUICK STATS EXTENSION --- */}
      <section className="relative z-30 mt-6 mb-16 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-slate-100">
          {[
            { label: 'Verified Properties', value: '10,000+', icon: ShieldCheck },
            { label: 'Happy Customers', value: '5,000+', icon: Users },
            { label: 'Cities Covered', value: '25+', icon: MapPin },
            { label: 'Years Experience', value: '15+', icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="text-center px-4 group">
              <stat.icon className="w-8 h-8 mx-auto text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-3xl font-black text-slate-900 md:text-4xl">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURED INVENTORY (DYNAMIC) --- */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2"><Award className="w-4 h-4"/> Featured inventory</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Verified properties tailored for you</h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="border-slate-300 font-bold hover:bg-[#8B0000] hover:text-white transition-colors h-12 px-6 rounded-xl text-base">View all properties <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>

          {loading ? (
             <div className="text-center py-10 text-slate-500 font-medium">Loading featured properties...</div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProperties.map((property) => (
                <div key={property.id} onClick={() => navigate(`/property/${property.id}`, { state: { property } })} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#D4AF37]/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative group flex flex-col">
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-slate-900 shadow-lg z-10 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]"/> {property.projectStatus || 'Featured'}
                  </div>
                  
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     <img src={getMainImage(property)} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col relative z-20 bg-white">
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8B0000] mb-2">{property.category} • {property.property_type}</p>
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#8B0000] transition-colors line-clamp-1 md:text-2xl">{property.title}</h3>
                    <p className="text-slate-500 text-sm mb-6 flex items-center font-medium md:text-base"><MapPin className="w-4 h-4 mr-1.5 text-slate-400"/> {property.location}, {property.city}</p>
                    
                    <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100">
                      <span className="font-black text-slate-900 text-xl md:text-2xl">{formatCurrency(property.price)}</span>
                      <span className="bg-slate-50 group-hover:bg-[#8B0000] text-slate-400 group-hover:text-[#D4AF37] w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 font-medium">No featured properties available at the moment.</div>
          )}
        </div>
      </section>

      {/* --- PREMIUM PLOTS SECTION (DYNAMIC) --- */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-[#D4AF37] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2"><LandPlot className="w-4 h-4"/> Build Your Vision</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Exclusive Premium Plots</h2>
            </div>
            <Link to="/properties?property_type=plot">
              <Button variant="outline" className="border-slate-300 font-bold hover:bg-[#D4AF37] hover:text-white transition-colors h-12 px-6 rounded-xl text-base">View all plots <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>

          {loading ? (
             <div className="text-center py-10 text-slate-500 font-medium">Loading plots...</div>
          ) : premiumPlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {premiumPlots.map((property) => (
                <div key={property.id} onClick={() => navigate(`/property/${property.id}`, { state: { property } })} className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#D4AF37]/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative group flex flex-col">
                  <div className="absolute top-4 left-4 bg-[#D4AF37]/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-white shadow-lg z-10 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5"/> {property.projectStatus || 'Premium'}
                  </div>
                  
                  <div className="relative h-56 overflow-hidden bg-slate-200">
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     <img src={getMainImage(property)} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col relative z-20 bg-white">
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">{property.category} • {property.property_type}</p>
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-1 md:text-2xl">{property.title}</h3>
                    <p className="text-slate-500 text-sm mb-6 flex items-center font-medium md:text-base"><MapPin className="w-4 h-4 mr-1.5 text-slate-400"/> {property.location}, {property.city}</p>
                    
                    <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100">
                      <span className="font-black text-slate-900 text-xl md:text-2xl">{formatCurrency(property.price)}</span>
                      <span className="bg-slate-50 group-hover:bg-[#D4AF37] text-slate-400 group-hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 font-medium">No plots available at the moment.</div>
          )}
        </div>
      </section>

      {/* --- EMI CALCULATOR SECTION --- */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
             <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3">Financial Planning Made Simple</p>
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Home Loan & Plot EMI Calculator</h2>
             <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">Plan your property purchase with confidence. Estimate your monthly mortgage payments instantly.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center relative group hover:border-[#D4AF37]/50 transition-colors">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-1000">
                 <PieChart className="w-64 h-64" />
            </div>

            <div className="space-y-8 relative z-10">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-base font-bold text-slate-700 md:text-lg">Loan Amount</label>
                  <span className="text-2xl font-black text-[#8B0000] md:text-3xl">{formatCurrency(loanAmount)}</span>
                </div>
                <input 
                  type="range" min="500000" max="100000000" step="100000" 
                  value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-base font-bold text-slate-700 md:text-lg">Interest Rate (p.a.)</label>
                  <span className="text-2xl font-black text-[#8B0000] md:text-3xl">{interestRate}%</span>
                </div>
                <input 
                  type="range" min="5" max="15" step="0.1" 
                  value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-base font-bold text-slate-700 md:text-lg">Loan Tenure</label>
                  <span className="text-2xl font-black text-[#8B0000] md:text-3xl">{loanTenure} Years</span>
                </div>
                <input 
                  type="range" min="1" max="30" step="1" 
                  value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 text-center relative overflow-hidden flex flex-col items-center">
               <Calculator className="w-12 h-12 text-[#D4AF37] mb-6" />
               <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2 md:text-sm">Equated Monthly Installment (EMI)</p>
               <h3 className="text-4xl font-black text-[#8B0000] mb-6 md:text-5xl lg:text-6xl">{formatCurrency(calculateEMI())}</h3>
               
               <div className="space-y-3.5 pt-6 border-t border-slate-200 text-sm md:text-base w-full max-w-sm mx-auto">
                 <div className="flex justify-between">
                   <span className="text-slate-500 font-medium">Principal Amount</span>
                   <span className="font-bold text-slate-900">{formatCurrency(loanAmount)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-500 font-medium">Total Interest</span>
                   <span className="font-bold text-slate-900">{formatCurrency((calculateEMI() * loanTenure * 12) - loanAmount)}</span>
                 </div>
                 <div className="flex justify-between pt-3.5 border-t border-slate-200">
                   <span className="text-slate-700 font-bold">Total Payable</span>
                   <span className="font-black text-[#8B0000]">{formatCurrency(calculateEMI() * loanTenure * 12)}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NOIDA PLOT FINDER MAP WITH PINS --- */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 gap-8 lg:gap-16 relative">
            <div className="max-w-2xl">
              <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2"><Map className="w-4 h-4"/> Discover opportunities</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Explore Localities</h2>
            </div>
          </div>
          
          <div className="w-full h-[550px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white relative bg-slate-200 group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112173.65997672212!2d77.2917757991953!3d28.5222010899063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1711756534243!5m2!1sen!2sin"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Noida Real Estate Map"
              className="grayscale-[30%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            ></iframe>
          </div>
        </div>
      </section>

      {/* --- PREMIUM SERVICES SECTION --- */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3">Our Expert Offerings</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">Premium Real Estate Services</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Residential & Plots", desc: "Find your dream home or build on premium plots curated for high demand and ROI.", icon: LandPlot },
              { title: "Commercial Leasing", desc: "Strategic office spaces, retail outlets, and corporate hubs to scale your business.", icon: Briefcase },
              { title: "Property Verification", desc: "Ensure safe investments with our expert document screening and legal assistance.", icon: ShieldCheck }
            ].map((service, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-[#D4AF37] hover:bg-white hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 group-hover:bg-[#8B0000] transition-colors duration-300 shadow-inner">
                  <service.icon className="w-8 h-8 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 md:text-3xl">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6 text-base">{service.desc}</p>
                <div className="flex items-center text-base text-[#8B0000] font-bold group-hover:text-[#D4AF37] transition-colors">
                  Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/10 to-transparent z-0 pointer-events-none"/>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <p className="text-[#D4AF37] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2 justify-center"><Zap className="w-4 h-4"/> Step-by-step guidance</p>
             <h2 className="text-3xl md:text-5xl font-black text-white">How ANK Realty Simplifies Buying</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
             <div className="absolute top-10 left-0 right-0 h-1 bg-white/5 md:block hidden" />
             {processSteps.map((step, idx) => (
                <div key={idx} className="relative group text-center flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-[#8B0000] border-4 border-[#D4AF37]/50 flex items-center justify-center mb-6 z-10 transition-transform duration-300 group-hover:scale-110 shadow-xl shadow-[#8B0000]/50">
                        <step.icon className="w-9 h-9 text-[#D4AF37]" />
                        <span className="absolute -top-3 -right-3 w-8 h-8 bg-white text-[#8B0000] rounded-full flex items-center justify-center font-black text-lg shadow-lg border-2 border-[#8B0000]">0{idx+1}</span>
                    </div>
                    <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                    <p className="text-slate-400 text-base leading-relaxed">{step.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- FLOATING CHATBOT --- */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 border border-[#D4AF37]/30 overflow-hidden flex flex-col">
            <div className="bg-[#050505] text-[#D4AF37] border-b border-[#D4AF37]/30 p-4 font-bold flex justify-between items-center shadow-md relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                ANK AI Assistant
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-slate-800 text-slate-300 hover:text-white p-1 rounded-md transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="p-4 flex-1 bg-slate-50 flex flex-col gap-3 h-[380px] overflow-y-auto">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-sm">
                   <Home className="w-4 h-4 text-[#8B0000]"/>
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm border border-slate-100 text-slate-700">
                  Welcome to ANK Realty! I am your virtual assistant. Please choose a subject below so I can assist you better:
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-2 pl-10">
                {chatSubjects.map((subject, i) => (
                  <button key={i} className="text-left bg-white hover:bg-[#8B0000]/5 text-slate-700 hover:text-[#8B0000] p-2.5 rounded-xl text-sm font-medium transition-all border border-slate-200 hover:border-[#D4AF37]/50 shadow-sm">
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[#D4AF37]" />
              <button className="bg-[#8B0000] text-white p-2 rounded-full hover:bg-[#600000] shadow-md shadow-[#8B0000]/30 transition-colors">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsChatOpen(true)} 
            className="bg-[#8B0000] hover:bg-[#600000] border-2 border-white/10 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(139,0,0,0.4)] hover:scale-110 transition-transform flex items-center justify-center group"
          >
            <MessageSquare className="w-7 h-7" />
            <span className="absolute right-full mr-4 bg-[#050505] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              Chat with us!
            </span>
          </button>
        )}
      </div>

      {/* --- ADDED FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-24 pb-12 px-6 border-t-[8px] border-[#8B0000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-4xl font-black tracking-tight text-[#D4AF37]">ANK <span className="text-white">REALTY</span></h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium">
                Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support across major hubs. Your Trusted Partner.
              </p>
              <div className="flex space-x-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer">
                  <Mail className="w-4 h-4"/>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer">
                  <Phone className="w-4 h-4"/>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Quick Links</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-base">
                <li><Link to="/properties" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> All Properties</Link></li>
                <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> About Us</Link></li>
                <li><Link to="/careers" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Careers</Link></li>
                <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Contact Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Categories</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-base">
                <li><Link to="/properties?property_type=plot" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Premium Plots</Link></li>
                <li><Link to="/buy" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Residential Homes</Link></li>
                <li><Link to="/properties?property_type=commercial" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Commercial Spaces</Link></li>
                <li><Link to="/rent" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Rental Homes</Link></li>
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
