import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Banknote, Bell, Briefcase, Building2, Calculator, ChevronRight, 
  Handshake, Instagram, Linkedin, Mail, MapPin, MessageCircle, Search, Users, Youtube,
  TrendingUp, Award, ShieldCheck, Home, Key, PieChart, Map, Sparkles, Building, FileSignature, Zap, LandPlot
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RegisterPopup from './RegisterPopup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bankOffers, exploreLocalities, socialLinks } from '@/lib/siteData';
import { WHATSAPP_URL, createPropertySearch } from '@/lib/api';

const topRowLogos = [
  "/images (3).png",
  "/images__9_-removebg-preview.png",
  "/images (1).png",
  "/images (2).png",
  "/183f468e401f4220bce9e4f7b1e3ffd820251112162925170.png",
];

const bottomRowLogos = [
  "/images.png",
  "/4f3bb698972531.Y3JvcCw5NTAsNzQzLDIyMywyMQ-removebg-preview.png",
  "/Max_Estates_logo.svg.png",
  "/M3M-Jacob-and-Co-logo.png",
];

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
    id: 'p1', title: 'Paras Evanue', city: 'Noida Extension', location: 'Sector 10', propertyType: 'Plot', 
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

// DATA for New Sections
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

// --- DUMMY MAP PINS ---
const dummyMapPins = [
  { id: 1, name: "Premium Plot - Sector 150", top: "35%", left: "45%", price: "₹1.2 Cr" },
  { id: 2, name: "Villa Plot - Yamuna Exp.", top: "65%", left: "60%", price: "₹85 L" },
  { id: 3, name: "Commercial Land - Ext.", top: "25%", left: "30%", price: "₹3.5 Cr" },
  { id: 4, name: "Corner Plot - Sec 137", top: "50%", left: "55%", price: "₹2.1 Cr" },
  { id: 5, name: "Golf View Plot - Sec 128", top: "40%", left: "20%", price: "₹5 Cr" },
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
  const [loanAmount, setLoanAmount] = useState(7500000); 
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
      <section className="relative pt-32 pb-24 px-4 md:px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
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

        <div className="relative z-20 max-w-6xl mx-auto text-center mt-10 w-full">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-2 px-5 py-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 backdrop-blur-sm text-[#D4AF37] text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Award className="w-4 h-4" /> Your Trusted Real Estate Partner
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight uppercase drop-shadow-lg">
              Discover premium properties across <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">India</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
              Search verified luxury homes, premium plots, rentals, and commercial spaces with an exclusive, expert-led experience.
            </motion.p>
          </motion.div>

          {/* Search Box */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-14 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-4 md:p-6 max-w-5xl mx-auto border border-[#D4AF37]/20 text-left relative z-30">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6 px-2 border-b border-slate-200 pb-5">
              {categoryOptions.map((cat) => (
                <button key={cat.value} onClick={() => setSearch((prev) => ({ ...prev, category: cat.value }))} className={`px-6 py-3 rounded-full text-base font-bold transition-all ${search.category === cat.value ? 'bg-[#8B0000] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>{cat.label}</button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              <div className="relative md:border-r md:border-slate-200 group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#8B0000] transition-colors" />
                <Input value={search.city} onChange={(e) => setSearch((prev) => ({ ...prev, city: e.target.value }))} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)} placeholder="Search by city or locality" className="h-14 pl-12 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base placeholder:text-slate-400 font-medium" />
                
                {searchFocused && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-4 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden">
                    {suggestions.slice(0, 5).map((item) => (
                      <button key={item.name} type="button" onClick={() => { setSearch((prev) => ({ ...prev, city: item.city, property_type: item.propertyType })); setSearchFocused(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors flex justify-between items-center group/item">
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
              
              <div className="relative md:border-r md:border-slate-200 group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#8B0000] transition-colors" />
                <select value={search.property_type} onChange={(e) => setSearch((prev) => ({ ...prev, property_type: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none font-medium text-base cursor-pointer">
                  <option value="">Select Property Type</option>
                  {propertyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              
              <div className="relative group">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#8B0000] transition-colors" />
                <select value={search.max_price} onChange={(e) => setSearch((prev) => ({ ...prev, max_price: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none font-medium text-base cursor-pointer">
                  <option value="">Select Max Budget</option>
                  <option value="5000000">Up to ₹50 Lac</option>
                  <option value="10000000">Up to ₹1 Cr</option>
                  <option value="30000000">Up to ₹3 Cr</option>
                  <option value="50000000">Above ₹3 Cr</option>
                </select>
              </div>
              
              <Button onClick={handleSearch} className="w-full h-14 bg-[#8B0000] hover:bg-[#600000] hover:-translate-y-0.5 transition-all duration-300 text-white font-black text-base rounded-xl shadow-lg shadow-[#8B0000]/30">
                <Search className="mr-2 h-5 w-5" /> Search Properties
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- QUICK STATS EXTENSION --- */}
      <section className="relative z-30 -mt-10 max-w-6xl mx-auto px-4">
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
      {/* --- TRUSTED BRANDS INFINITE SLIDER (FIXED) --- */}
      <section className="py-12 sm:py-16 relative w-full overflow-hidden bg-white -mt-10 z-20 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-b border-slate-100">
        <div className="w-full">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 sm:mb-12 text-center">
            Trusted by leading brands across India
          </h2>
          <div className="relative flex flex-col gap-8 sm:gap-12 overflow-hidden w-full">
            {/* Top Row: Left Animation */}
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="flex gap-12 sm:gap-20 w-max items-center"
            >
              {[...topRowLogos, ...topRowLogos, ...topRowLogos].map((src, i) => (
                <div key={`top-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 flex items-center justify-center">
                  <img src={src} alt="Client" className="max-w-full max-h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                </div>
              ))}
            </motion.div>

            {/* Bottom Row: Right Animation */}
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="flex gap-12 sm:gap-20 w-max items-center"
            >
              {[...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos].map((src, i) => (
                <div key={`bottom-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 flex items-center justify-center">
                  <img src={src} alt="Client" className="max-w-full max-h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                </div>
              ))}
            </motion.div>

            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>
   {/* --- FEATURED INVENTORY --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2"><Award className="w-4 h-4"/> Featured inventory</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Verified properties tailored for you</h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="border-slate-300 font-bold hover:bg-[#8B0000] hover:text-white transition-colors h-12 px-6 rounded-xl text-base">View all properties <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProperties.map((property) => (
              <motion.div variants={fadeUp} key={property.id} onClick={() => navigate(`/property/${property.id}`, { state: { property } })} className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#D4AF37]/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative group flex flex-col">
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-slate-900 shadow-lg z-10 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]"/> {property.tag}
                </div>
                
                <div className="relative h-56 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <img src={property.image} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="p-6 flex-1 flex flex-col relative z-20 bg-white">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8B0000] mb-2">{property.category} • {property.propertyType}</p>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#8B0000] transition-colors line-clamp-1 md:text-2xl">{property.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex items-center font-medium md:text-base"><MapPin className="w-4 h-4 mr-1.5 text-slate-400"/> {property.location}, {property.city}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100">
                    <span className="font-black text-slate-900 text-xl md:text-2xl">{property.price}</span>
                    <span className="bg-slate-50 group-hover:bg-[#8B0000] text-slate-400 group-hover:text-[#D4AF37] w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- PREMIUM SERVICES SECTION --- */}
      <section className="py-24 px-6 bg-white">
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

      {/* --- NOIDA PLOT FINDER MAP WITH PINS --- */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 gap-8 lg:gap-16 relative">
            <div className="max-w-2xl">
              <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2"><Map className="w-4 h-4"/> Discover opportunities in prime hubs</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Explore Plots & Localities in Noida</h2>
              <p className="text-slate-600 text-lg md:text-xl mt-5 leading-relaxed">
                Use our dynamic map view to locate premium plots, upcoming projects, and established sectors. Hover over the pins below to see available plot opportunities!
              </p>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 md:block hidden pointer-events-none text-[#D4AF37] opacity-20">
                <LandPlot className="w-48 h-48" />
            </div>
          </div>
          
          <div className="w-full h-[550px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white relative bg-slate-200 group">
            {/* WORKING NOIDA GOOGLE MAP IFRAME */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.61368048703!2d77.32498705!3d28.5355161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1711545600000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Noida Real Estate Map"
              className="grayscale-[30%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            ></iframe>
            
            {/* DUMMY PINS OVERLAY */}
            {dummyMapPins.map(pin => (
               <div key={pin.id} className="absolute z-10 flex flex-col items-center group/pin cursor-pointer" style={{ top: pin.top, left: pin.left }}>
                  {/* Tooltip Popup */}
                  <div className="bg-white px-4 py-2 rounded-xl shadow-2xl mb-2 opacity-0 group-hover/pin:opacity-100 transition-all duration-300 whitespace-nowrap border border-slate-200 transform translate-y-4 group-hover/pin:translate-y-0 pointer-events-none">
                     <p className="font-bold text-slate-900 text-sm mb-0.5">{pin.name}</p>
                     <p className="text-[#8B0000] font-black text-sm">{pin.price}</p>
                  </div>
                  {/* Visual Pin Indicator */}
                  <div className="relative">
                     <div className="w-6 h-6 bg-[#8B0000] rounded-full absolute -inset-1.5 animate-ping opacity-60"></div>
                     <div className="w-8 h-8 bg-[#D4AF37] border-2 border-white rounded-full flex items-center justify-center shadow-lg relative z-10 hover:bg-[#8B0000] transition-colors">
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                     </div>
                  </div>
               </div>
            ))}

            {/* SLEEK MAP INFO CARD */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-200 max-w-[320px] transition-all duration-300 group-hover:shadow-[#D4AF37]/20 group-hover:-translate-y-1">
              <div className="flex items-center gap-2.5 mb-3 border-b border-slate-100 pb-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-lg" />
                 <h3 className="font-black text-slate-900 text-base">Live Property Markers</h3>
              </div>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">Map currently displaying 5 exclusive plot listings. Hover over the golden pins to view property details and prices.</p>
              <Button className="w-full h-11 text-sm bg-[#8B0000] hover:bg-[#600000] text-white rounded-xl font-bold shadow-md shadow-[#8B0000]/30 transition-all hover:-translate-y-0.5">Contact Our Plot Experts</Button>
            </div>
          </div>
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
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-1000">
                 <PieChart className="w-64 h-64" />
            </div>

            {/* Controls */}
            <div className="space-y-8 relative z-10">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-base font-bold text-slate-700 md:text-lg">Loan Amount (Plot/Home)</label>
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

            {/* Results */}
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

      {/* --- NOIDA LOCALITY HIGHLIGHTS --- */}
      <section className="py-24 px-6 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <p className="text-[#D4AF37] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2 justify-center"><MapPin className="w-4 h-4"/> Micro-Market Expert Insights</p>
             <h2 className="text-3xl md:text-5xl font-black text-white">Explore Key Localities in Noida</h2>
             <p className="text-slate-400 mt-4 text-lg">Dive deeper into the average prices, connectivity, and demand status of top investment hubs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {localityHighlights.map((locality, i) => (
                <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/10 transition-all duration-300 group">
                    <h3 className="text-xl font-black mb-3 group-hover:text-[#D4AF37] transition-colors">{locality.name}</h3>
                    <div className="space-y-1.5 text-sm text-slate-300 mb-5">
                        <p><span className="font-bold text-white">Avg. Price:</span> {locality.avgPrice}</p>
                        <p><span className="font-bold text-white">Key Hub:</span> {locality.connectivity}</p>
                        <p><span className="font-bold text-white">Highlight:</span> {locality.landmark}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                        {locality.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-[#8B0000]/30 text-[#D4AF37] text-[10px] font-medium tracking-wide">{tag}</span>
                        ))}
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY INDIA & LOAN FORM --- */}
      <section className="py-24 px-6 bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3">Investment Hub Insights</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-slate-900">Why investors choose India’s growth corridors</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10 md:text-xl md:leading-relaxed">
              Strong infrastructure pipelines, expanding business districts, and maturing social infrastructure continue to improve end-user demand and investment resilience. Trusted by thousands of buyers, <span className="font-bold text-[#8B0000]">ANK Realty</span> simplifies the journey with verified inventory, plot insights, and dedicated human support.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: 'Verified listings', body: 'Lead qualification reduce wasted site visits for homes and plots.', icon: ShieldCheck },
                { title: 'Local expertise', body: 'Actionable help on pricing, potential ROI, and document readiness.', icon: MapPin },
                { title: 'Wide discovery', body: 'Explore residential, premium plots, rentals, and commercial hubs.', icon: Building2 },
                { title: 'Dedicated support', body: 'Dedicated experts for search, loan guidance, and leasing support.', icon: Users },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#D4AF37]/50 transition-all flex flex-col">
                  <item.icon className="w-6 h-6 text-[#D4AF37] mb-4" />
                  <h3 className="text-lg font-black text-slate-900 mb-1.5 md:text-xl">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mt-auto md:text-base">{item.body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-[#8B0000] text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="bg-[#D4AF37]/20 p-3 rounded-2xl shadow-inner border border-[#D4AF37]/20">
                <Banknote className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-3xl font-black md:text-4xl">Request Loan Call</h3>
            </div>
            
            <div className="space-y-4 mb-8 relative z-10">
              {bankOffers.slice(0, 3).map((offer) => ( // Showing only top 3 for cleaner form feel
                <div key={offer.bank} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-black text-lg md:text-xl">{offer.bank}</p>
                    <p className="text-[#D4AF37]/80 text-sm mt-0.5">{offer.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#D4AF37] font-black text-xl md:text-2xl">{offer.rate}</p>
                    <p className="text-[11px] text-white/50 uppercase tracking-wider mt-1">Indicative</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6 relative z-10">
              <Input value={loanLead.name} onChange={(e) => setLoanLead((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your full name" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-14 text-base rounded-xl focus:border-[#D4AF37]" />
              <Input value={loanLead.phone} onChange={(e) => setLoanLead((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-14 text-base rounded-xl focus:border-[#D4AF37]" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Button onClick={handleLoanLead} className="bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 h-14 rounded-xl text-base px-8 font-black flex-1 shadow-lg shadow-[#D4AF37]/30 transition-all hover:-translate-y-0.5">Request callback</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- NEWSLETTER CTA --- */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000]/80 to-slate-900/90 mix-blend-multiply z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="bg-[#D4AF37]/20 w-20 h-20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm border border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Bell className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Never Miss a Property Deal</h2>
          <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">Get pre-launch alerts, price updates, and curated plot/property matches directly to your inbox and WhatsApp.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto w-full">
            <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 h-16 rounded-xl px-6 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-base" />
            <Button onClick={handleNewsletter} className="h-16 px-10 bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 font-black rounded-xl text-base shadow-xl shadow-[#D4AF37]/30 transition-all hover:-translate-y-0.5">Subscribe Now</Button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-24 pb-12 px-6 border-t-[8px] border-[#8B0000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-4xl font-black tracking-tight text-[#D4AF37] md:text-5xl">ANK<span className="text-white">REALTY</span></h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium">
                Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support across major hubs. Your Trusted Partner.
              </p>
              <div className="flex space-x-4 pt-4">
                {socialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon] || Handshake;
                  return <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer group"><Icon className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>;
                })}
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
