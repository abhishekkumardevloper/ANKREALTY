import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import {
  ArrowRight, Banknote, Briefcase, Building2, Calculator, ChevronRight,
  Handshake, Instagram, Linkedin, Mail, MapPin, Search, Users, TrendingUp,
  Award, ShieldCheck, Home, Key, PieChart, Map as MapIcon, Sparkles,
  Building, RefreshCw, DollarSign, Phone, Loader2, Video, PlayCircle,
  CheckCircle, Twitter, Facebook, Heart, ArrowUpRight, Star, Clock,
  ThumbsUp, Shield, HelpCircle, Send, Plus
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RegisterPopup from './RegisterPopup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as siteData from '@/lib/siteData';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

// --- STATIC DATA & CONTENT EXPANSION ---
const bankOffers = Array.isArray(siteData?.bankOffers) ? siteData.bankOffers : [
  { bank: 'HDFC Bank', rate: '8.35%', note: 'Zero Processing Fee' },
  { bank: 'SBI Home Loans', rate: '8.40%', note: 'Women Borrower Discount' },
  { bank: 'ICICI Bank', rate: '8.45%', note: 'Instant Approval' }
];
const socialLinks = siteData?.socialLinks || {};

const topRowLogos = ['/images (3).png', '/images__9_-removebg-preview.png', '/images (1).png', '/images (2).png', '/183f468e401f4220bce9e4f7b1e3ffd820251112162925170.png'];
const bottomRowLogos = ['/images.png', '/4f3bb698972531.Y3JvcCw5NTAsNzQzLDIyMywyMQ-removebg-preview.png', '/Max_Estates_logo.svg.png', '/M3M-Jacob-and-Co-logo.png'];

const categoryOptions = [
  { label: 'Buy Property', value: 'buy' },
  { label: 'Resale Deals', value: 'resale' },
  { label: 'Rent & Lease', value: 'rent' },
];

const exploreCategories = [
  { title: 'Luxury Villas', desc: 'Exclusive independent homes', icon: Home, image: 'https://images.unsplash.com/photo-1613490908578-81cc3d17961b?q=80&w=800&auto=format&fit=crop' },
  { title: 'Premium Apartments', desc: 'High-rise luxury living', icon: Building, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop' },
  { title: 'Commercial Spaces', desc: 'Grade-A office & retail', icon: Briefcase, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop' },
  { title: 'Residential Plots', desc: 'Build your dream home', icon: MapIcon, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop' },
];

const processSteps = [
  { title: 'Discover', desc: 'Browse our curated collection of verified properties matching your unique lifestyle and financial criteria.', icon: Search },
  { title: 'Visit & Evaluate', desc: 'Schedule accompanied site visits with our local experts who provide deep market insights.', icon: MapPin },
  { title: 'Negotiate & Finance', desc: 'Leverage our banking tie-ups and negotiation expertise to secure the absolute best deal.', icon: Handshake },
  { title: 'Seamless Handover', desc: 'From legal paperwork to registry and possession, we manage the entire lifecycle.', icon: Key },
];

const testimonials = [
  { name: 'Rajesh Singhania', role: 'Tech Executive', text: 'ANK Realty made finding my luxury apartment in Noida completely effortless. Their transparency and knowledge are unmatched.', rating: 5 },
  { name: 'Meera Kapoor', role: 'Business Owner', text: 'Securing our new corporate office space was a breeze. The team handled negotiations brilliantly, saving us 15% on lease terms.', rating: 5 },
  { name: 'Amit Desai', role: 'NRI Investor', text: 'Managing investments from abroad is tough, but ANK Realty’s video tours and legal assistance gave me absolute peace of mind.', rating: 5 },
];

const topCities = [
  { name: 'Noida', count: '1,200+ Properties', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop' },
  { name: 'Gurugram', count: '950+ Properties', image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?q=80&w=800&auto=format&fit=crop' },
  { name: 'Delhi', count: '800+ Properties', image: 'https://images.unsplash.com/photo-1585084335487-f653d0e213b3?q=80&w=800&auto=format&fit=crop' },
  { name: 'Greater Noida', count: '1,500+ Properties', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop' },
];

const faqs = [
  { q: 'Are all properties listed on your platform verified?', a: 'Yes. Every property undergoes a rigorous 40-point physical and legal verification process before it is listed on ANK Realty.' },
  { q: 'Do you charge brokerage on new developer projects?', a: 'No, we charge absolutely ZERO brokerage on new launch and primary market developer projects.' },
  { q: 'Can you assist with home loan approvals?', a: 'Absolutely. We have exclusive tie-ups with HDFC, SBI, and ICICI to offer you expedited approvals and the lowest interest rates.' },
  { q: 'Do you manage NRI property investments?', a: 'Yes, we provide end-to-end portfolio management, virtual tours, and legal compliance specifically tailored for NRI investors.' },
];

// --- 3D ANIMATION VARIANTS ---
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: 'spring', bounce: 0.4 } } };
const scaleUp = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, type: 'spring' } } };
const textReveal = { hidden: { opacity: 0, y: 40, rotateX: -45 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } } };

const getYouTubeID = (url) => {
  if (!url) return null;
  try {
    if (url.includes('youtube.com/watch')) return new URLSearchParams(new URL(url).search).get('v');
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
    if (url.includes('youtube.com/embed/')) return url.split('youtube.com/embed/')[1]?.split('?')[0];
  } catch (error) { return null; }
  return null;
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 1], [0, 300]);
  
  const [search, setSearch] = useState({ category: 'buy', location: '', property_type: '', max_price: '' });
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [resaleProperties, setResaleProperties] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [savedProperties, setSavedProperties] = useState(new Set());

  // Loan State
  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });
  const [isLoanSubmitting, setIsLoanSubmitting] = useState(false);
  const [loanAmount, setLoanAmount] = useState(7500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  // FAQ State
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      try {
        const [featuredRes, resaleRes, videoRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/properties`),
          axios.get(`${API_BASE}/properties?category=resale&limit=4`),
          axios.get(`${API_BASE}/youtube-videos`),
        ]);

        if (featuredRes.status === 'fulfilled' && featuredRes.value.data) {
          const allProps = featuredRes.value.data;
          setFeaturedProperties(allProps.slice(0, 4));
          const uniqueLocs = [...new Set(allProps.map(p => p.location).filter(Boolean))].sort();
          setAvailableLocations(uniqueLocs);
        }
        
        if (resaleRes.status === 'fulfilled' && resaleRes.value.data) {
          setResaleProperties(Array.isArray(resaleRes.value.data) ? resaleRes.value.data.slice(0, 4) : []);
        }
        
        if (videoRes.status === 'fulfilled' && videoRes.value.data) {
          setVideos(Array.isArray(videoRes.value.data) ? videoRes.value.data.slice(0, 3) : []);
        }
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomePageData();
  }, []);

  useEffect(() => {
    if (user && api) {
      api.get('/favorites').then(res => setSavedProperties(new Set(res.data.map(f => f.property_id)))).catch(console.error);
    } else {
      setSavedProperties(new Set());
    }
  }, [user, api]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.category) params.append('category', search.category);
    if (search.property_type) params.append('property_type', search.property_type);
    if (search.location) params.append('location', search.location);
    if (search.max_price) params.append('max_price', search.max_price);
    navigate(`/properties?${params.toString()}`);
  };

  const handleSaveProperty = async (e, propertyId) => {
    e.stopPropagation(); 
    if (!user) {
      toast.error('Please login to save properties.');
      return navigate('/auth');
    }
    try {
      if (savedProperties.has(propertyId)) {
        await api.delete(`/favorites/${propertyId}`);
        setSavedProperties(prev => { const newSet = new Set(prev); newSet.delete(propertyId); return newSet; });
        toast.success('Removed from your collection.');
      } else {
        await api.post('/favorites', { property_id: propertyId });
        setSavedProperties(prev => { const newSet = new Set(prev); newSet.add(propertyId); return newSet; });
        toast.success('Property saved! Added to your dashboard.');
      }
    } catch (error) {
      toast.error('Failed to update favorites. Please try again.');
    }
  };

  const handleLoanLead = async () => {
    if (!loanLead.name || loanLead.phone.replace(/\D/g, '').length < 10) return toast.error('Please enter a valid name and 10-digit phone number.');
    setIsLoanSubmitting(true);
    try {
      await axios.post(`${API_BASE}/contacts`, {
        name: loanLead.name, phone: loanLead.phone, email: 'N/A', interest: 'Home Loan Inquiry', message: 'Client requested a callback regarding home loan and EMI consultation from the homepage.',
      });
      toast.success('Request received successfully! Our loan expert will call you shortly.');
      setLoanLead({ name: '', phone: '' });
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsLoanSubmitting(false);
    }
  };

  const calculateEMI = () => {
    const p = loanAmount, r = interestRate / 12 / 100, n = loanTenure * 12;
    return (p && r && n) ? Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Price on Request';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getMainImage = (property) => property?.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop';
  const mapLocation = search.location || 'Noida, Uttar Pradesh';
  const dynamicMapSrc = `https://maps.google.com/maps?q=$${encodeURIComponent(mapLocation)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#D4AF37]/30 relative overflow-x-hidden">
      <Navbar />
      <RegisterPopup />

      {/* =========================================
          1. CINEMATIC 3D HERO SECTION
      ========================================= */}
      <section className="relative pt-32 pb-32 px-4 md:px-6 overflow-hidden min-h-[95vh] flex flex-col justify-center perspective-[2000px]">
        <motion.div style={{ y: heroParallax }} className="absolute inset-0 z-0 bg-[#020202]">
          <motion.div
            initial={{ scale: 1.1, rotate: 1 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 30, ease: 'easeOut' }}
            className="absolute inset-0 opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-[#020202]/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/20 to-[#020202] z-10" />
        </motion.div>

        <div className="relative z-20 max-w-6xl mx-auto text-center mt-12 w-full">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.div variants={textReveal} className="inline-flex items-center gap-2 mb-4 px-6 py-2.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 backdrop-blur-md text-[#D4AF37] text-xs font-black tracking-[0.25em] uppercase shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              <Award className="w-4 h-4" /> India's Premier Real Estate Network
            </motion.div>

            <motion.h1 variants={textReveal} className="text-5xl md:text-7xl lg:text-[6rem] font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl">
              Elevate Your Standard <br className="hidden md:block" /> of{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA8000]">Living</span>
                <motion.span initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-2 left-0 h-2 bg-[#D4AF37]/40 rounded-full blur-[2px]" />
              </span>
            </motion.h1>

            <motion.p variants={textReveal} className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
              Discover verified luxury estates, high-ROI commercial spaces, and premium plots with our elite advisory team.
            </motion.p>
          </motion.div>

          {/* 3D Search Glassmorphism Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 15 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, boxShadow: "0 40px 80px -15px rgba(212, 175, 55, 0.2)" }}
            className="mt-16 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-6 md:p-8 max-w-5xl mx-auto border border-white/50 text-left relative z-30 transform-gpu"
          >
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8 border-b border-slate-200 pb-6">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSearch((prev) => ({ ...prev, category: cat.value }))}
                  className={`px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                    search.category === cat.value
                      ? 'bg-gradient-to-r from-[#8B0000] to-[#600000] text-white shadow-xl shadow-[#8B0000]/30 scale-105'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {[
                { icon: MapPin, value: search.location, key: 'location', default: 'City, Locality, or Project', options: availableLocations.map(l => ({label: l, value: l})) },
                { icon: Building2, value: search.property_type, key: 'property_type', default: 'Property Type', options: [{label: 'Apartment', value: 'apartment'}, {label: 'Villa', value: 'villa'}, {label: 'Commercial', value: 'commercial'}, {label: 'Plot', value: 'plot'}] },
                { icon: DollarSign, value: search.max_price, key: 'max_price', default: 'Max Budget', options: [{label: 'Up to ₹50 Lac', value: '5000000'}, {label: 'Up to ₹1 Cr', value: '10000000'}, {label: 'Up to ₹3 Cr', value: '30000000'}, {label: 'Above ₹3 Cr', value: '50000000'}] }
              ].map((select, i) => (
                <div key={i} className="relative group bg-slate-50 rounded-2xl border border-slate-200 hover:border-[#D4AF37]/60 transition-colors shadow-inner">
                  <select.icon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-[#D4AF37] transition-colors" />
                  <select
                    value={select.value}
                    onChange={(e) => setSearch((prev) => ({ ...prev, [select.key]: e.target.value }))}
                    className="h-16 pl-14 pr-5 bg-transparent border-0 w-full text-slate-800 appearance-none outline-none font-bold text-base cursor-pointer"
                  >
                    <option value="">{select.default}</option>
                    {select.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={handleSearch}
                className="relative overflow-hidden w-full h-16 bg-[#8B0000] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#8B0000]/40 flex items-center justify-center group border border-[#600000]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <Search className="mr-2 h-6 w-6" /> Search Assets
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          2. TRUST BAR & STATS
      ========================================= */}
      <section className="relative z-30 -mt-12 max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {[
            { label: 'Verified Listings', value: '10,000+', icon: ShieldCheck },
            { label: 'Happy Families', value: '5,000+', icon: Users },
            { label: 'Cities Covered', value: '25+', icon: MapPin },
            { label: 'Years of Legacy', value: '15+', icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="text-center px-4 group cursor-default">
              <stat.icon className="w-10 h-10 mx-auto text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-4xl font-black text-slate-900 md:text-5xl">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================
          3. EXPLORE CATEGORIES GRID
      ========================================= */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4">Portfolio Segments</p>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Explore Our Assets</h2>
          </div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exploreCategories.map((cat, i) => (
              <motion.div 
                key={i} variants={scaleUp} whileHover={{ y: -10, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.1)' }}
                onClick={() => navigate(`/properties?property_type=${cat.title.split(' ')[1].toLowerCase()}`)}
                className="relative h-96 rounded-[2.5rem] overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-slate-900 z-0">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent z-10" />
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <cat.icon className="w-10 h-10 text-[#D4AF37] mb-4 drop-shadow-lg" />
                  <h3 className="text-2xl font-black text-white mb-2">{cat.title}</h3>
                  <p className="text-slate-300 text-sm font-medium">{cat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================================
          4. HOW IT WORKS (Timeline Journey)
      ========================================= */}
      <section className="py-32 px-6 bg-white border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-slate-50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="text-center mb-20 max-w-3xl mx-auto">
            <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4">The ANK Process</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Your Journey to the Perfect Property</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-slate-200" />
            
            {processSteps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="relative text-center group">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 rounded-full shadow-xl flex items-center justify-center relative z-10 group-hover:border-[#D4AF37]/50 transition-colors duration-500 group-hover:scale-110">
                  <step.icon className="w-10 h-10 text-[#8B0000]" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#D4AF37] text-white font-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-8 mb-3">{step.title}</h3>
                <p className="text-slate-500 font-medium text-sm px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          5. FEATURED PROPERTIES (3D Cards)
      ========================================= */}
      <section className="py-32 px-6 bg-[#020202] text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" /> Signature Collection
              </p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">Exclusive Primary Listings</h2>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/properties" className="inline-flex items-center justify-center h-14 px-8 rounded-full border-2 border-white/20 font-bold text-white hover:bg-white hover:text-slate-900 transition-colors">
                View Complete Collection <ArrowUpRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>
          ) : featuredProperties.length > 0 ? (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
              {featuredProperties.map((property) => {
                const isSaved = savedProperties.has(property.id);
                return (
                  <motion.div
                    variants={fadeUp} key={property.id}
                    whileHover={{ y: -15, rotateX: 2, rotateY: -2, boxShadow: '0 40px 60px -15px rgba(212,175,55,0.2)' }}
                    onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                    className="bg-[#111] rounded-[2.5rem] overflow-hidden border border-white/10 cursor-pointer relative group flex flex-col transform-gpu transition-all duration-300"
                  >
                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-slate-900 shadow-xl z-20 flex items-center gap-2 uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> {property.projectStatus || 'Featured'}
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => handleSaveProperty(e, property.id)} 
                      className={`absolute top-5 right-5 w-12 h-12 bg-[#020202]/50 backdrop-blur-md rounded-full flex items-center justify-center z-20 border border-white/20 shadow-xl ${isSaved ? 'text-[#8B0000] border-[#8B0000]' : 'text-white hover:text-[#8B0000]'}`}
                    >
                      <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-[#8B0000]' : ''}`} />
                    </motion.button>

                    <div className="relative h-72 overflow-hidden bg-[#020202]">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent z-10 opacity-90" />
                      <img src={getMainImage(property)} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80 group-hover:opacity-100" />
                      
                      <div className="absolute bottom-5 left-6 right-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1.5">
                           {property.category} • {property.property_type}
                         </p>
                         <h3 className="text-2xl font-black text-white leading-tight line-clamp-1 drop-shadow-lg">
                           {property.title}
                         </h3>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col bg-[#111] relative z-20">
                      <p className="text-slate-400 text-sm mb-6 flex items-center font-medium">
                        <MapPin className="w-4 h-4 mr-2 text-[#D4AF37]" /> {property.location}, {property.city}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/10">
                        <span className="font-black text-white text-2xl">{formatCurrency(property.price)}</span>
                        <div className="bg-white/5 group-hover:bg-[#8B0000] text-slate-400 group-hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 transform group-hover:rotate-45 border border-white/10">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-10 text-slate-400 font-medium">No premium properties currently available.</div>
          )}
        </div>
      </section>

      {/* =========================================
          6. PERFECT LOGO ANIMATION
      ========================================= */}
      <section className="py-20 relative w-full overflow-hidden bg-white z-20 border-b border-slate-100">
        <div className="w-full max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-12 text-center">
            Network & Developer Partners
          </h2>
          <div className="relative flex flex-col gap-10 overflow-hidden w-full" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
            <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="flex gap-16 sm:gap-24 w-max items-center">
              {[...topRowLogos, ...topRowLogos, ...topRowLogos, ...topRowLogos].map((src, i) => (
                <div key={`top-${i}`} className="flex-shrink-0 w-32 sm:w-44 h-16 flex items-center justify-center">
                  <img src={src} alt="Partner" className="max-w-full max-h-full object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110" />
                </div>
              ))}
            </motion.div>
            <motion.div animate={{ x: ['-50%', '0%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="flex gap-16 sm:gap-24 w-max items-center">
              {[...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos].map((src, i) => (
                <div key={`bottom-${i}`} className="flex-shrink-0 w-32 sm:w-44 h-16 flex items-center justify-center">
                  <img src={src} alt="Partner" className="max-w-full max-h-full object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          7. RESALE PROPERTIES
      ========================================= */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" /> Secondary Market
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Ready to Move-In Homes</h2>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/properties?category=resale" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-[#8B0000] font-bold text-white shadow-lg shadow-[#8B0000]/30 transition-colors">
                View All Resale <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#8B0000]" /></div>
          ) : resaleProperties.length > 0 ? (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
              {resaleProperties.map((property) => {
                const isSaved = savedProperties.has(property.id);
                return (
                  <motion.div
                    variants={fadeUp} key={property.id}
                    whileHover={{ y: -10, boxShadow: '0 30px 50px -10px rgba(0,0,0,0.1)' }}
                    onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                    className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 cursor-pointer relative group flex flex-col transition-all duration-300"
                  >
                    <div className="absolute top-5 left-5 bg-emerald-500/95 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-white shadow-md z-20 flex items-center gap-2 uppercase tracking-widest">
                      <Key className="w-3.5 h-3.5" /> {property.projectStatus || 'Ready'}
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => handleSaveProperty(e, property.id)} 
                      className={`absolute top-5 right-5 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center z-20 shadow-md ${isSaved ? 'text-[#8B0000] border-2 border-red-100' : 'text-slate-400 hover:text-[#8B0000]'}`}
                    >
                      <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-[#8B0000]' : ''}`} />
                    </motion.button>

                    <div className="relative h-64 overflow-hidden bg-slate-100">
                      <img src={getMainImage(property)} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                    </div>

                    <div className="p-6 flex-1 flex flex-col bg-white">
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#8B0000] transition-colors line-clamp-1">{property.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 flex items-center font-medium"><MapPin className="w-4 h-4 mr-2 text-slate-400" /> {property.location}, {property.city}</p>
                      <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100">
                        <span className="font-black text-slate-900 text-2xl">{formatCurrency(property.price)}</span>
                        <div className="bg-slate-50 group-hover:bg-[#8B0000] text-slate-400 group-hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-10 text-slate-500 font-medium">No resale properties currently available.</div>
          )}
        </div>
      </section>

      {/* =========================================
          8. TOP CITIES / NEIGHBORHOODS
      ========================================= */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4">Locations</p>
            <h2 className="text-4xl font-black text-slate-900">Discover Top Neighborhoods</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCities.map((city, i) => (
              <motion.div 
                key={i} whileHover={{ scale: 1.03 }} onClick={() => navigate(`/properties?location=${city.name}`)}
                className="relative h-80 rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg"
              >
                <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                <div className="absolute bottom-6 left-6 text-left">
                  <h3 className="text-2xl font-black text-white mb-1">{city.name}</h3>
                  <p className="text-slate-300 font-medium text-sm">{city.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          9. YOUTUBE VIDEO TOURS (RESTORED & ENHANCED)
      ========================================= */}
      {videos.length > 0 && (
        <section className="py-32 px-6 bg-[#020202] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B0000]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-xs mb-4">Virtual Experience</p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">Immersive Property Tours</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videos.map((vid) => {
                const ytId = getYouTubeID(vid.videoUrl);
                return (
                  <motion.div key={vid.id} whileHover={{ y: -10 }} className="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col group backdrop-blur-sm">
                    <div className="relative aspect-video bg-black">
                      {ytId ? (
                        <iframe src={`https://www.youtube.com/embed/${ytId}?rel=0`} title={vid.title} className="w-full h-full absolute inset-0" allowFullScreen />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500"><Video className="w-10 h-10" /></div>
                      )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-3 flex items-center gap-2">
                        <PlayCircle className="w-4 h-4" /> Watch Now
                      </div>
                      <h3 className="font-black text-white text-xl mb-3 line-clamp-2">{vid.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-3 mt-auto leading-relaxed">{vid.description || 'Exclusive insights and walkthroughs from our real estate experts.'}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="text-center mt-16">
              <Link to="/videos">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-[#D4AF37] font-bold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-slate-900 transition-colors">
                  Explore Video Gallery <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =========================================
          10. USPs / WHY CHOOSE ANK REALTY
      ========================================= */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20 max-w-3xl mx-auto">
            <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4">The ANK Advantage</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Why Investors Choose Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { t: 'Zero Brokerage', d: 'We charge absolutely no brokerage on new developer projects.', i: DollarSign },
              { t: 'Legal Verification', d: '40-point legal and physical check before any listing goes live.', i: Shield },
              { t: 'End-to-End Support', d: 'From initial search and loan approval to final registry.', i: ThumbsUp },
            ].map((usp, i) => (
               <motion.div key={i} whileHover={{ y: -10 }} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm text-center group hover:border-[#D4AF37]/50 transition-colors">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#8B0000] transition-colors">
                   <usp.i className="w-10 h-10 text-[#D4AF37] group-hover:text-white" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4">{usp.t}</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">{usp.d}</p>
               </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          11. CLIENT TESTIMONIALS
      ========================================= */}
      <section className="py-32 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900">Voices of Trust</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200">
                <div className="flex gap-1 mb-6">
                  {[...Array(test.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <p className="text-slate-700 font-medium text-lg leading-relaxed mb-8 italic">"{test.text}"</p>
                <div>
                  <h4 className="font-black text-slate-900">{test.name}</h4>
                  <p className="text-sm font-bold text-[#8B0000] uppercase tracking-widest mt-1">{test.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          12. LUXURY EMI CALCULATOR
      ========================================= */}
      <section className="py-32 px-6 bg-[#020202] border-y border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#8B0000]/20 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-xs mb-4">Financial Planning</p>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">Smart EMI Calculator</h2>
            <p className="text-slate-400 text-lg leading-relaxed">Plan your luxury property purchase with absolute precision.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-8 md:p-14 shadow-2xl border border-white/10 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              {[
                { label: 'Loan Amount', value: formatCurrency(loanAmount), state: loanAmount, set: setLoanAmount, min: 500000, max: 100000000, step: 100000 },
                { label: 'Interest Rate (p.a.)', value: `${interestRate}%`, state: interestRate, set: setInterestRate, min: 5, max: 15, step: 0.1 },
                { label: 'Loan Tenure', value: `${loanTenure} Years`, state: loanTenure, set: setLoanTenure, min: 1, max: 30, step: 1 }
              ].map((input, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-widest">{input.label}</label>
                    <span className="text-2xl font-black text-[#D4AF37]">{input.value}</span>
                  </div>
                  <input type="range" min={input.min} max={input.max} step={input.step} value={input.state} onChange={(e) => input.set(Number(e.target.value))} className="w-full h-2.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#D4AF37] hover:accent-[#e5c453] transition-all" />
                </div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-[#8B0000] to-[#500000] p-12 rounded-[2.5rem] border border-[#8B0000]/50 text-center relative overflow-hidden shadow-2xl shadow-[#8B0000]/40">
              <Calculator className="w-12 h-12 text-[#D4AF37] mb-6 mx-auto opacity-80" />
              <p className="text-white/70 font-bold uppercase tracking-widest text-xs mb-3">Equated Monthly Installment</p>
              <h3 className="text-5xl lg:text-6xl font-black text-white mb-10 drop-shadow-lg">{formatCurrency(calculateEMI())}</h3>
              <div className="space-y-4 pt-8 border-t border-white/20 text-sm md:text-base w-full">
                <div className="flex justify-between text-white/80"><span className="font-medium">Principal Amount</span><span className="font-bold text-white">{formatCurrency(loanAmount)}</span></div>
                <div className="flex justify-between text-white/80"><span className="font-medium">Total Interest</span><span className="font-bold text-white">{formatCurrency((calculateEMI() * loanTenure * 12) - loanAmount)}</span></div>
                <div className="flex justify-between pt-4 border-t border-white/20"><span className="text-white font-bold uppercase tracking-wider text-xs mt-1">Total Payable</span><span className="font-black text-[#D4AF37] text-xl">{formatCurrency(calculateEMI() * loanTenure * 12)}</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          13. LOAN LEAD & ADVISORY SECTION
      ========================================= */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4">Financial Advisory</p>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-slate-900">Get pre-approved for your dream home.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              Skip the bank queues. Our financial experts will guide you to the lowest interest rates and highest loan eligibility instantly.
            </p>
            <div className="space-y-4 mb-8">
              {bankOffers.map((offer, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-black text-lg text-slate-900">{offer.bank}</p>
                    <p className="text-[#8B0000] text-xs font-bold uppercase tracking-widest mt-1">{offer.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#D4AF37] font-black text-2xl">{offer.rate}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Indicative ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-slate-900 text-white rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-5 mb-10 relative z-10">
              <div className="bg-[#D4AF37]/20 p-4 rounded-2xl border border-[#D4AF37]/30"><Banknote className="w-8 h-8 text-[#D4AF37]" /></div>
              <h3 className="text-3xl md:text-4xl font-black">Request Loan Call</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mb-8 relative z-10">
              <Input value={loanLead.name} onChange={(e) => setLoanLead((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your full name" className="bg-white/5 border-white/10 text-white h-16 rounded-2xl px-6 focus:border-[#D4AF37]" />
              <Input value={loanLead.phone} onChange={(e) => setLoanLead((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" type="tel" className="bg-white/5 border-white/10 text-white h-16 rounded-2xl px-6 focus:border-[#D4AF37]" />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={handleLoanLead} disabled={isLoanSubmitting} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA8000] text-slate-900 h-16 rounded-2xl text-lg font-black shadow-xl flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {isLoanSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Get Free Consultation'}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          14. FREQUENTLY ASKED QUESTIONS (FAQ)
      ========================================= */}
      <section className="py-32 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500 font-medium">Everything you need to know about buying and leasing with ANK Realty.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 text-left flex justify-between items-center font-black text-slate-900 text-lg hover:text-[#8B0000]">
                  {faq.q}
                  <Plus className={`w-5 h-5 text-[#D4AF37] transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 text-slate-600 font-medium leading-relaxed">
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          15. DYNAMIC MAP & NEWSLETTER
      ========================================= */}
      <section className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-2"><MapIcon className="w-5 h-5" /> Location Intelligence</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Explore {search.location || 'Top Regions'} Visually</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">Use our interactive map view to discover connectivity hubs, upcoming metro lines, and social infrastructure driving real estate appreciation.</p>
            
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#D4AF37] opacity-20 blur-3xl rounded-full" />
               <h4 className="text-2xl font-black mb-2">Join our VIP list</h4>
               <p className="text-slate-400 text-sm mb-6 font-medium">Get exclusive access to pre-launch properties and market reports.</p>
               <div className="flex gap-3 relative z-10">
                 <Input placeholder="Enter your email" className="bg-white/10 border-white/20 text-white h-14 rounded-xl focus:border-[#D4AF37]" />
                 <Button className="h-14 px-6 bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 font-black rounded-xl"><Send className="w-5 h-5" /></Button>
               </div>
            </div>
          </div>
          
          <div className="w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-slate-50 relative bg-slate-200">
            <iframe src={dynamicMapSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="grayscale-[30%] hover:grayscale-0 transition-all duration-700 opacity-90 hover:opacity-100" />
          </div>
        </div>
      </section>

      {/* =========================================
          16. MEGA FOOTER
      ========================================= */}
      <footer className="bg-[#020202] text-white pt-24 pb-12 px-6 border-t-[8px] border-[#8B0000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8 pr-4">
              <h3 className="text-4xl font-black tracking-tight text-[#D4AF37]">ANK <span className="text-white">REALTY</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support. Your Trusted Partner.</p>
              <div className="flex space-x-4">
                {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                  <motion.a whileHover={{ scale: 1.1, backgroundColor: '#8B0000', borderColor: '#8B0000' }} key={i} href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-sm mb-8 text-white uppercase tracking-widest">Quick Links</h4>
              <ul className="space-y-5 text-slate-400 font-medium">
                {['All Properties', 'About Us', 'Careers', 'Contact Support', 'Submit Property'].map((item, i) => (
                   <li key={i}><Link to="#" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#8B0000]" /> {item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black text-sm mb-8 text-white uppercase tracking-widest">Categories</h4>
              <ul className="space-y-5 text-slate-400 font-medium">
                 {['Premium Plots', 'Residential Homes', 'Corporate Leasing', 'Rental Homes', 'New Launches'].map((item, i) => (
                   <li key={i}><Link to="#" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#8B0000]" /> {item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black text-sm mb-8 text-white uppercase tracking-widest">Contact Headquarters</h4>
              <div className="space-y-5 text-slate-400 font-medium">
                <div className="flex items-start bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/50 transition-colors">
                  <MapPin className="w-6 h-6 mr-4 text-[#D4AF37] shrink-0" />
                  <p className="text-sm leading-relaxed">Sector 62, Noida, <br/>Uttar Pradesh 201309</p>
                </div>
                <div className="flex items-center bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/50 transition-colors">
                  <Mail className="w-6 h-6 mr-4 text-[#D4AF37] shrink-0" />
                  <p className="text-sm">info@ankrealty.com</p>
                </div>
                <div className="flex items-center bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/50 transition-colors">
                  <Phone className="w-6 h-6 mr-4 text-[#D4AF37] shrink-0" />
                  <p className="text-sm">+91 92664 58945</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
              <Link to="/sitemap" className="hover:text-[#D4AF37] transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for Advanced Animations */}
      <style dangerouslySetInlineStyle={{__html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .perspective-1000 { perspective: 1000px; }
        .transform-gpu { transform: translateZ(0); }
      `}} />
    </div>
  );
}
