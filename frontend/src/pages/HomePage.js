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

// --- LOGO DATA ---
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

const categoryOptions = [{ label: 'Buy', value: 'buy' }, { label: 'Sell', value: 'sell' }, { label: 'Rent', value: 'rent' }];
const propertyTypeOptions = [{ label: 'Apartment', value: 'apartment' }, { label: 'Villa', value: 'villa' }, { label: 'Commercial', value: 'commercial' }, { label: 'Plot', value: 'plot' }];
const socialIconMap = { instagram: Instagram, youtube: Youtube, linkedin: Linkedin, whatsapp: MessageCircle };

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ category: 'buy', city: '', property_type: '', max_price: '' });
  const [searchFocused, setSearchFocused] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });

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
          <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "easeOut" }} className="absolute inset-0" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/95 z-10" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto text-center mt-10 w-full">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-2 px-5 py-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 backdrop-blur-sm text-[#D4AF37] text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Award className="w-4 h-4" /> Premium Real Estate Partners
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight uppercase drop-shadow-lg">
              Discover Luxury across <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">India</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
              Search verified luxury homes, premium plots, and commercial spaces with an expert-led experience.
            </motion.p>
          </motion.div>

          <div className="mt-14 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-4 md:p-6 max-w-5xl mx-auto border border-[#D4AF37]/20 text-left relative z-30">
            <div className="flex flex-wrap gap-3 mb-6 px-2 border-b border-slate-200 pb-5">
              {categoryOptions.map((cat) => (
                <button key={cat.value} onClick={() => setSearch((prev) => ({ ...prev, category: cat.value }))} className={`px-6 py-3 rounded-full text-base font-bold transition-all ${search.category === cat.value ? 'bg-[#8B0000] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>{cat.label}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              <div className="relative md:border-r group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#8B0000]" />
                <Input value={search.city} onChange={(e) => setSearch((prev) => ({ ...prev, city: e.target.value }))} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)} placeholder="Search by city" className="h-14 pl-12 border-0 bg-transparent text-base" />
              </div>
              <div className="relative md:border-r group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select value={search.property_type} onChange={(e) => setSearch((prev) => ({ ...prev, property_type: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full appearance-none outline-none font-medium">
                  <option value="">Property Type</option>
                  {propertyTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="relative group">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select value={search.max_price} onChange={(e) => setSearch((prev) => ({ ...prev, max_price: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full appearance-none outline-none font-medium">
                  <option value="">Budget</option>
                  <option value="10000000">Up to ₹1 Cr</option>
                  <option value="50000000">Above ₹3 Cr</option>
                </select>
              </div>
              <Button onClick={handleSearch} className="w-full h-14 bg-[#8B0000] hover:bg-[#600000] text-white font-black rounded-xl shadow-lg shadow-[#8B0000]/30 transition-all">
                Search Properties
              </Button>
            </div>
          </div>
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

      {/* --- SERVICES --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#8B0000] font-bold uppercase tracking-widest text-xs mb-3">Our Offerings</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">Premium Services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Residential & Plots", desc: "Find your dream home or build on premium plots curated for high ROI.", icon: LandPlot },
              { title: "Commercial Leasing", desc: "Strategic office spaces and retail outlets to scale your business.", icon: Briefcase },
              { title: "Property Verification", desc: "Ensure safe investments with our expert document screening.", icon: ShieldCheck }
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 hover:border-[#D4AF37] hover:shadow-2xl transition-all group">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 group-hover:bg-[#8B0000] transition-colors shadow-inner">
                  <s.icon className="w-7 h-7 text-[#D4AF37] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{s.desc}</p>
                <div className="flex items-center text-[#8B0000] font-bold">Learn more <ArrowRight className="w-4 h-4 ml-2" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EMI CALCULATOR --- */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">EMI Calculator</h2>
            <p className="text-slate-600 mt-4">Estimate your monthly mortgage payments instantly.</p>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-4"><label className="font-bold">Amount</label><span className="text-xl font-black text-[#8B0000]">{formatCurrency(loanAmount)}</span></div>
                <input type="range" min="500000" max="100000000" step="100000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]" />
              </div>
              <div>
                <div className="flex justify-between mb-4"><label className="font-bold">Rate (%)</label><span className="text-xl font-black text-[#8B0000]">{interestRate}%</span></div>
                <input type="range" min="5" max="15" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]" />
              </div>
            </div>
            <div className="bg-slate-900 text-white p-10 rounded-3xl text-center">
              <Calculator className="w-10 h-10 text-[#D4AF37] mx-auto mb-6" />
              <p className="text-slate-400 text-sm uppercase mb-2">Monthly EMI</p>
              <h3 className="text-4xl md:text-5xl font-black text-[#D4AF37] mb-6">{formatCurrency(calculateEMI())}</h3>
              <Button onClick={handleLoanLead} className="w-full bg-[#8B0000] hover:bg-[#600000] h-12 rounded-xl font-bold transition-all">Get Detailed Quote</Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-24 pb-12 px-6 border-t-[8px] border-[#8B0000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-4xl font-black text-[#D4AF37]">ANK<span className="text-white">REALTY</span></h3>
              <p className="text-slate-400 font-medium">Your trusted partner for premium property discovery and verified advisory in Northern India.</p>
              <div className="flex space-x-4">
                {socialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon] || Handshake;
                  return <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#8B0000] text-[#D4AF37] hover:text-white transition-all"><Icon className="w-4 h-4" /></a>;
                })}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-8 uppercase text-xs text-slate-500 tracking-widest">Office</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Tapasya Corp Heights, Sector 126,<br />Noida, UP 201301<br />info@ankrealty.com</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex justify-between items-center text-xs text-slate-600">
            <p>© {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
