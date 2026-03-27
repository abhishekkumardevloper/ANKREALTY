import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Banknote, Bell, Briefcase, Building2, Calculator, ChevronRight, 
  Handshake, Instagram, Linkedin, Mail, MapPin, MessageCircle, Search, Users, Youtube,
  TrendingUp, Award, ShieldCheck, Home, Key, PieChart, Map
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RegisterPopup from './RegisterPopup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bankOffers, exploreLocalities, newsArticles, socialLinks } from '@/lib/siteData';
import { WHATSAPP_URL, createPropertySearch } from '@/lib/api';

// --- RICH CONTENT ---
const featuredProperties = [
  { 
    id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sector 151', propertyType: 'Apartment', 
    category: 'buy', price: '₹ 1.85 Cr onwards', 
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    tag: 'New Launch'
  },
  { 
    id: 'f3', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sector 97', propertyType: 'Villa', 
    category: 'buy', price: '₹ 3.50 Cr onwards', 
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    tag: 'Ultra Luxury'
  },
  { 
    id: 'p1', title: 'Bajrang Vatika', city: 'Noida Extension', location: 'Sector 10', propertyType: 'Plot', 
    category: 'buy', price: '₹ 45 L onwards', 
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    tag: 'Premium Plots'
  },
  { 
    id: 'u1', title: 'Himalayan View Estate', city: 'Dehradun', location: 'Rajpur Road', propertyType: 'Villa', 
    category: 'buy', price: '₹ 2.10 Cr onwards', 
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    tag: 'Mountain View'
  },
];

// --- LOGO ARRAYS ---
const topRowLogos = [
  "/images (3).png", "/images__9_-removebg-preview.png", "/images (1).png", "/images (2).png", "/183f468e401f4220bce9e4f7b1e3ffd820251112162925170.png",
];

const bottomRowLogos = [
  "/images.png", "/4f3bb698972531.Y3JvcCw5NTAsNzQzLDIyMywyMQ-removebg-preview.png", "/Max_Estates_logo.svg.png", "/M3M-Jacob-and-Co-logo.png",
];

const categoryOptions = [
  { label: 'Buy', value: 'buy' }, { label: 'Sell', value: 'sell' }, { label: 'Rent', value: 'rent' },
];

const propertyTypeOptions = [
  { label: 'Apartment', value: 'apartment' }, { label: 'Villa', value: 'villa' }, 
  { label: 'Commercial', value: 'commercial' }, { label: 'Plot', value: 'plot' },
];

const socialIconMap = { instagram: Instagram, youtube: Youtube, linkedin: Linkedin, whatsapp: MessageCircle };

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ category: 'buy', city: '', property_type: '', max_price: '' });
  const [searchFocused, setSearchFocused] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  const suggestions = useMemo(() => {
    const query = search.city.trim().toLowerCase();
    if (!query) return exploreLocalities;
    return exploreLocalities.filter((item) => item.name.toLowerCase().includes(query) || item.city.toLowerCase().includes(query));
  }, [search.city]);

  const handleSearch = () => navigate(createPropertySearch(search));
  
  const handleNewsletter = () => {
    if (!newsletterEmail.includes('@')) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ANK Realty, subscribe me for property deals. My email is ${newsletterEmail}.`)}`, '_blank', 'noopener,noreferrer');
  };
  
  const handleLoanLead = () => {
    if (!loanLead.name || loanLead.phone.replace(/\D/g, '').length < 10) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ANK Realty, I want a home-loan comparison. Name: ${loanLead.name}, Phone: ${loanLead.phone}.`)}`, '_blank', 'noopener,noreferrer');
  };

  // EMI Calculation Logic
  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;
    if (p && r && n) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return Math.round(emi);
    }
    return 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#D4AF37]/30 relative">
      <Navbar />
      <RegisterPopup />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 pb-20 px-4 md:px-6 overflow-hidden min-h-[85vh] flex flex-col justify-center">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="absolute inset-0" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/95 z-10" />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto text-center mt-10 w-full">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-5">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 backdrop-blur-sm text-[#D4AF37] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Award className="w-3.5 h-3.5" /> Your Trusted Partner
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight uppercase drop-shadow-lg">
              Discover premium properties across <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">India</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
              Search verified luxury homes, premium plots, rentals, and commercial spaces with an exclusive, production-ready experience.
            </motion.p>
          </motion.div>

          {/* Search Box */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-10 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-2xl p-4 max-w-4xl mx-auto border border-[#D4AF37]/20 text-left relative z-30">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4 px-2 border-b border-slate-200 pb-3">
              {categoryOptions.map((cat) => (
                <button key={cat.value} onClick={() => setSearch((prev) => ({ ...prev, category: cat.value }))} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${search.category === cat.value ? 'bg-[#8B0000] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>{cat.label}</button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 relative">
              <div className="relative md:border-r md:border-slate-200 group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#8B0000] transition-colors" />
                <Input value={search.city} onChange={(e) => setSearch((prev) => ({ ...prev, city: e.target.value }))} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)} placeholder="City or location" className="h-12 pl-10 border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm placeholder:text-slate-400 font-medium" />
                
                {searchFocused && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-3 bg-white border border-slate-100 rounded-xl shadow-2xl p-2 z-50 overflow-hidden">
                    {suggestions.slice(0, 5).map((item) => (
                      <button key={item.name} type="button" onClick={() => { setSearch((prev) => ({ ...prev, city: item.city, property_type: item.propertyType })); setSearchFocused(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex justify-between items-center group/item">
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover/item:text-[#8B0000] transition-colors">{item.name}</p>
                          <p className="text-[10px] text-slate-500">{item.city}</p>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">{item.badge}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative md:border-r md:border-slate-200 group">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#8B0000] transition-colors" />
                <select value={search.property_type} onChange={(e) => setSearch((prev) => ({ ...prev, property_type: e.target.value }))} className="h-12 pl-10 pr-3 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none font-medium text-sm cursor-pointer">
                  <option value="">Property Type</option>
                  {propertyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              
              <div className="relative group">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#8B0000] transition-colors" />
                <select value={search.max_price} onChange={(e) => setSearch((prev) => ({ ...prev, max_price: e.target.value }))} className="h-12 pl-10 pr-3 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none font-medium text-sm cursor-pointer">
                  <option value="">Max Budget</option>
                  <option value="5000000">Up to ₹50 Lac</option>
                  <option value="10000000">Up to ₹1 Cr</option>
                  <option value="30000000">Up to ₹3 Cr</option>
                  <option value="50000000">Above ₹3 Cr</option>
                </select>
              </div>
              
              <Button onClick={handleSearch} className="w-full h-12 bg-[#8B0000] hover:bg-[#600000] hover:-translate-y-0.5 transition-all duration-300 text-white font-black text-sm rounded-xl shadow-lg shadow-[#8B0000]/30">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- QUICK STATS EXTENSION --- */}
      <section className="relative z-30 -mt-8 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-[1.5rem] shadow-xl border border-slate-100 p-5 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-slate-100">
          {[
            { label: 'Verified Properties', value: '10k+', icon: ShieldCheck },
            { label: 'Happy Customers', value: '5k+', icon: Users },
            { label: 'Cities Covered', value: '25+', icon: MapPin },
            { label: 'Years Experience', value: '15+', icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="text-center px-2 group">
              <stat.icon className="w-6 h-6 mx-auto text-[#D4AF37] mb-2 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- PREMIUM SERVICES SECTION --- */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-[10px] mb-2">Excellence in Real Estate</p>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900">Comprehensive Solutions</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Residential Sales", desc: "Find your dream home with our curated list of premium apartments and luxury villas.", icon: Home },
              { title: "Commercial Spaces", desc: "Strategic office spaces and retail locations to accelerate your business growth.", icon: Briefcase },
              { title: "Property Management", desc: "End-to-end management services ensuring high ROI and hassle-free maintenance.", icon: Key }
            ].map((service, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#8B0000] transition-colors duration-300">
                  <service.icon className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{service.desc}</p>
                <div className="flex items-center text-sm text-[#8B0000] font-bold group-hover:text-[#D4AF37] transition-colors">
                  Learn more <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NOIDA PROPERTY MAP (NEW SECTION) --- */}
      <section className="py-20 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/10 to-transparent z-0 pointer-events-none"/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <p className="text-[#D4AF37] font-bold uppercase tracking-[0.25em] text-[10px] mb-2 flex items-center gap-2"><Map className="w-3.5 h-3.5"/> Interactive Map</p>
              <h2 className="text-2xl md:text-4xl font-black text-white">Explore Properties in Noida</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm text-right hidden md:block">
              Browse our prime real estate locations directly on the map. Find the perfect sector for your next investment.
            </p>
          </div>
          
          <div className="w-full h-[450px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 relative bg-slate-800">
            {/* Standard Google Maps Embed centered on Noida. 
                Note: For actual dynamic property pins, a mapping library like react-leaflet or google-maps-react + API Key is required. */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112173.81881514748!2d77.30068991386016!3d28.522202029961623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1711565400000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Noida Property Locations"
              className="grayscale-[30%] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
            ></iframe>
            
            {/* Custom UI Overlay over the map */}
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 max-w-[240px] hidden md:block">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <h3 className="font-black text-slate-900 text-sm">Noida Sector 150 & 151</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">Showing premium apartments, luxury villas, and commercial plots in prime sectors.</p>
              <Button className="w-full h-9 text-xs bg-[#8B0000] hover:bg-[#600000] text-white rounded-xl font-bold">View 45+ Properties</Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED INVENTORY --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-[10px] mb-2 flex items-center gap-2"><Award className="w-3.5 h-3.5"/> Featured inventory</p>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900">Buy, sell, and rent with confidence</h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="border-slate-300 font-bold hover:bg-[#8B0000] hover:text-white transition-colors h-10 px-5 text-sm rounded-xl">View all properties <ChevronRight className="w-4 h-4 ml-1.5" /></Button>
            </Link>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <motion.div variants={fadeUp} key={property.id} onClick={() => navigate(`/property/${property.id}`, { state: { property } })} className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer relative group flex flex-col">
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-900 shadow z-10 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#D4AF37]"/> {property.tag}
                </div>
                
                <div className="relative h-48 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <img src={property.image} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="p-5 flex-1 flex flex-col relative z-20 bg-white">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8B0000] mb-1.5">{property.category} • {property.propertyType}</p>
                  <h3 className="text-lg font-black text-slate-900 mb-1.5 group-hover:text-[#8B0000] transition-colors line-clamp-1">{property.title}</h3>
                  <p className="text-slate-500 text-xs mb-4 flex items-center font-medium"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400"/> {property.location}, {property.city}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="font-black text-slate-900 text-lg">{property.price}</span>
                    <span className="bg-slate-50 group-hover:bg-[#8B0000] text-slate-400 group-hover:text-[#D4AF37] w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- EMI CALCULATOR SECTION --- */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
             <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-[10px] mb-2">Financial Planning</p>
             <h2 className="text-2xl md:text-4xl font-black text-slate-900">Smart EMI Calculator</h2>
             <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">Plan your property purchase with confidence. Estimate your monthly mortgage payments instantly.</p>
          </div>

          <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl border border-slate-100 max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-slate-700">Loan Amount</label>
                  <span className="text-lg font-black text-[#8B0000]">{formatCurrency(loanAmount)}</span>
                </div>
                <input 
                  type="range" min="500000" max="50000000" step="100000" 
                  value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-slate-700">Interest Rate (p.a.)</label>
                  <span className="text-lg font-black text-[#8B0000]">{interestRate}%</span>
                </div>
                <input 
                  type="range" min="5" max="15" step="0.1" 
                  value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-slate-700">Loan Tenure</label>
                  <span className="text-lg font-black text-[#8B0000]">{loanTenure} Years</span>
                </div>
                <input 
                  type="range" min="1" max="30" step="1" 
                  value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                />
              </div>
            </div>

            {/* Results */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-bl-full" />
               <PieChart className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
               <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Equated Monthly Installment (EMI)</p>
               <h3 className="text-4xl font-black text-[#8B0000] mb-5">{formatCurrency(calculateEMI())}</h3>
               
               <div className="space-y-2.5 pt-5 border-t border-slate-200 text-xs">
                 <div className="flex justify-between">
                   <span className="text-slate-500 font-medium">Principal Amount</span>
                   <span className="font-bold text-slate-900">{formatCurrency(loanAmount)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-500 font-medium">Total Interest</span>
                   <span className="font-bold text-slate-900">{formatCurrency((calculateEMI() * loanTenure * 12) - loanAmount)}</span>
                 </div>
                 <div className="flex justify-between pt-2.5 border-t border-slate-200">
                   <span className="text-slate-700 font-bold">Total Payable</span>
                   <span className="font-black text-[#8B0000]">{formatCurrency(calculateEMI() * loanTenure * 12)}</span>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- WHY INDIA & LOAN FORM --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-[10px] mb-2">Investment Hub</p>
            <h2 className="text-2xl md:text-4xl font-black mb-5 leading-tight text-slate-900">Why buyers choose India’s growth markets</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              Strong infrastructure pipelines, expanding business districts, and maturing social infrastructure continue to improve end-user demand and investment resilience. Trusted by thousands of buyers, <span className="font-bold text-[#8B0000]">ANK Realty</span> simplifies the journey with verified inventory and dedicated human support.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Verified listings', body: 'Property screening and lead qualification reduce wasted site visits.', icon: ShieldCheck },
                { title: 'Local expertise', body: 'Actionable help on pricing, ROI, and document readiness.', icon: MapPin },
                { title: 'Wide discovery', body: 'Explore residential, plotted, rental, and corporate inventory.', icon: Building2 },
                { title: 'Human support', body: 'Dedicated experts for search, loan guidance, and leasing support.', icon: Users },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#D4AF37]/50 transition-all">
                  <item.icon className="w-5 h-5 text-[#D4AF37] mb-3" />
                  <h3 className="text-sm font-black text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-[#8B0000] text-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-[#D4AF37]/20 p-2.5 rounded-xl">
                <Calculator className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-2xl font-black">Apply Loan</h3>
            </div>
            
            <div className="space-y-3 mb-6 relative z-10">
              {bankOffers.map((offer) => (
                <div key={offer.bank} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-black text-base">{offer.bank}</p>
                    <p className="text-[#D4AF37]/70 text-[11px] mt-0.5">{offer.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#D4AF37] font-black text-lg">{offer.rate}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Indicative</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid md:grid-cols-2 gap-3 mb-5 relative z-10">
              <Input value={loanLead.name} onChange={(e) => setLoanLead((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your full name" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-11 text-sm rounded-xl focus:border-[#D4AF37]" />
              <Input value={loanLead.phone} onChange={(e) => setLoanLead((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-11 text-sm rounded-xl focus:border-[#D4AF37]" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <Button onClick={handleLoanLead} className="bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 h-11 rounded-xl text-sm px-6 font-black flex-1 shadow-lg shadow-[#D4AF37]/20 transition-colors">Request callback</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- NEWSLETTER CTA --- */}
      <section className="py-20 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000]/80 to-slate-900/90 mix-blend-multiply z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="bg-[#D4AF37]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Bell className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Never Miss a Property Deal</h2>
          <p className="text-slate-300 text-sm md:text-base mb-8 max-w-xl mx-auto">Get pre-launch alerts, price updates, and curated luxury property matches directly to your inbox and WhatsApp.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 h-12 rounded-xl px-5 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm" />
            <Button onClick={handleNewsletter} className="h-12 px-8 bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 font-black rounded-xl text-sm shadow-xl shadow-[#D4AF37]/20">Subscribe Now</Button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-20 pb-10 px-6 border-t-[6px] border-[#8B0000]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="space-y-5 pr-4">
              <h3 className="text-3xl font-black tracking-tight text-[#D4AF37]">ANK<span className="text-white">REALTY</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support across major hubs. Your Trusted Partner.
              </p>
              <div className="flex space-x-3 pt-2">
                {socialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon] || Handshake;
                  return <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer group"><Icon className="w-4 h-4 group-hover:scale-110 transition-transform" /></a>;
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/properties" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> All Properties</Link></li>
                <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> About Us</Link></li>
                <li><Link to="/careers" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Careers</Link></li>
                <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Contact Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/properties?property_type=plot" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Premium Plots</Link></li>
                <li><Link to="/buy" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Residential</Link></li>
                <li><Link to="/properties?property_type=commercial" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Commercial Spaces</Link></li>
                <li><Link to="/rent" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Rental Homes</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium text-sm">
                <div className="flex items-start bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <MapPin className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs">Tapasya Corp Heights, Sector 126, Noida, UP 201301</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Mail className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs">info@ankrealty.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-3 md:mt-0">
              <Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
