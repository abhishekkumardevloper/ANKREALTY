import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Bed,
  Briefcase,
  Building,
  Building2,
  Calculator,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  DollarSign,
  Facebook,
  Heart,
  Home,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  Map as MapIcon,
  MapPin,
  Maximize,
  MessageSquare,
  PlayCircle,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
  Users,
  Video,
  X,
  Award
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://ankrealty.onrender.com/api';

const socialLinks = {
  facebook: '#',
  twitter: '#',
  instagram: '#',
  linkedin: '#',
};

const bankOffers = [
  { bank: 'HDFC Bank', rate: '8.35%', note: 'Special rate for premium properties' },
  { bank: 'SBI', rate: '8.40%', note: 'Zero processing fee' },
  { bank: 'ICICI Bank', rate: '8.45%', note: 'Instant approval for pre-approved clients' },
];

const categoryOptions = [
  { label: 'Buy Property', value: 'buy' },
  { label: 'Resale Deals', value: 'resale' },
  { label: 'Rent & Lease', value: 'rent' },
];

const exploreCategories = [
  {
    title: 'Luxury Villas',
    desc: 'Exclusive independent homes',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1613490908578-81cc3d17961b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Premium Apartments',
    desc: 'High-rise luxury living',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Commercial Spaces',
    desc: 'Grade-A office & retail',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Residential Plots',
    desc: 'Build your dream home',
    icon: MapIcon,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
  },
];

const processSteps = [
  {
    title: 'Discover',
    desc: 'Browse a curated collection of verified properties that match your lifestyle and budget.',
    icon: Search,
  },
  {
    title: 'Visit & Evaluate',
    desc: 'Schedule guided site visits with market insights, location analysis, and clear comparisons.',
    icon: MapPin,
  },
  {
    title: 'Negotiate & Finance',
    desc: 'Use banking tie-ups and expert negotiation support to secure the best possible deal.',
    icon: HandshakeFallback,
  },
  {
    title: 'Seamless Handover',
    desc: 'From paperwork to registry and possession, we manage the entire journey end to end.',
    icon: KeyFallback,
  },
];

const testimonials = [
  {
    name: 'Rajesh Singhania',
    role: 'Tech Executive',
    text: 'The team made finding a luxury apartment effortless. Their transparency and market knowledge are excellent.',
    rating: 5,
  },
  {
    name: 'Meera Kapoor',
    role: 'Business Owner',
    text: 'We secured our office space quickly and the negotiation support genuinely saved us money.',
    rating: 5,
  },
  {
    name: 'Amit Desai',
    role: 'NRI Investor',
    text: 'Video tours and legal guidance gave me confidence to invest from abroad without stress.',
    rating: 5,
  },
];

function HandshakeFallback({ className }) {
  return <Briefcase className={className} />;
}

function KeyFallback({ className }) {
  return <Sparkles className={className} />;
}

function SafeImg({ src, alt, className, fallback }) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={errored ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}

function getYouTubeID(url) {
  if (!url) return null;
  try {
    if (url.includes('youtube.com/watch')) return new URLSearchParams(new URL(url).search).get('v');
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
    if (url.includes('youtube.com/embed/')) return url.split('youtube.com/embed/')[1]?.split('?')[0];
  } catch {
    return null;
  }
  return null;
}

export default function BuyPage() {
  const navigate = useNavigate();
  const { user, api } = useAuth();

  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [savedProperties, setSavedProperties] = useState(new Set());
  const [isChatOpen, setIsChatOpen] = useState(false);

  const chatSubjects = [
    'Schedule a Visit',
    'Price Details & Negotiation',
    'Legal Verification Check',
    'Home Loan Options',
    'Property Locations & Tours',
  ];

  const [searchLocation, setSearchLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });
  const [isLoanSubmitting, setIsLoanSubmitting] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const [propsRes, videoRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/properties?category=buy&limit=100`),
          axios.get(`${API_BASE}/youtube-videos`),
        ]);

        if (propsRes.status === 'fulfilled' && propsRes.value.data) {
          const data = propsRes.value.data;
          setProperties(data);
          setFeaturedProperties(data.slice(0, 4));
          const uniqueLocs = [...new Set(data.map((p) => p.location).filter(Boolean))].sort();
          setAvailableLocations(uniqueLocs);
        }

        if (videoRes.status === 'fulfilled' && videoRes.value.data) {
          setVideos(Array.isArray(videoRes.value.data) ? videoRes.value.data.slice(0, 3) : []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  useEffect(() => {
    if (user && api) {
      api
        .get('/favorites')
        .then((res) => setSavedProperties(new Set(res.data.map((f) => f.property_id))))
        .catch(console.error);
    } else {
      setSavedProperties(new Set());
    }
  }, [user, api]);

  const filteredAndSortedProperties = useMemo(() => {
    let result = properties.filter((p) => {
      const matchesLocation = searchLocation
        ? p.location?.toLowerCase() === searchLocation.toLowerCase() || p.city?.toLowerCase() === searchLocation.toLowerCase()
        : true;
      const matchesPrice = maxPrice ? Number(p.price) <= Number(maxPrice) : true;
      const matchesType = propertyType ? p.property_type?.toLowerCase() === propertyType.toLowerCase() : true;
      return matchesLocation && matchesPrice && matchesType;
    });

    if (sortBy === 'price_low') result.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === 'price_high') result.sort((a, b) => Number(b.price) - Number(a.price));
    return result;
  }, [properties, searchLocation, maxPrice, propertyType, sortBy]);

  const handleSearchClick = () => {
    document.getElementById('property-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

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
        setSavedProperties((prev) => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
        toast.success('Removed from your collection.');
      } else {
        await api.post('/favorites', { property_id: propertyId });
        setSavedProperties((prev) => new Set([...prev, propertyId]));
        toast.success('Property saved to your dashboard.');
      }
    } catch (error) {
      console.error('Error saving favorite:', error);
      toast.error('Failed to update favorites. Please try again.');
    }
  };

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
    if (property?.images?.length > 0) return property.images[0];
    return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop';
  };

  const mapLocation = searchLocation || 'Noida, Uttar Pradesh';
  const dynamicMapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  const stats = [
    { label: 'Verified Properties', value: '10,000+', icon: ShieldCheck },
    { label: 'Happy Customers', value: '5,000+', icon: Users },
    { label: 'Cities Covered', value: '25+', icon: MapPin },
    { label: 'Years Experience', value: '15+', icon: TrendingUp },
  ];

  const propertyCards = filteredAndSortedProperties;

  return (
    <div className="min-h-screen bg-[#f8f6f1] font-sans text-slate-900 selection:bg-[#D4AF37]/30 relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        :root {
          --gold: #D4AF37;
          --gold-light: #F3E5AB;
          --gold-dark: #AA8000;
          --crimson: #8B0000;
          --crimson-dark: #5a0000;
          --ink: #020202;
          --ink-soft: #0f0f0f;
          --cream: #f8f6f1;
        }
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        .shimmer-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); transform: translateX(-100%); }
        .shimmer-btn:hover::after { animation: shimmer 1.2s ease; }
        .float-anim { animation: float 5s ease-in-out infinite; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 4px; background: #1e293b; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--gold); cursor: pointer; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(212,175,55,0.5); }
        select option { background: #0f172a; color: #fff; }
        .card-3d { transform-style: preserve-3d; }
        .card-3d:hover { transform: translateY(-8px) rotateX(2deg); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--ink)]">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2000&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.18,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#020202] via-[#0d0d0d]/90 to-[#0a0a12]" />
          <div
            className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--gold)]/25 bg-[var(--gold)]/8 text-[var(--gold)] text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm mb-6">
                <Award className="w-3.5 h-3.5" /> Properties for Sale
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight">
                Find Your <br />
                <span className="italic text-[var(--gold)]">Perfect</span> <span>Home</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed mt-6 font-light">
                Explore premium apartments, villas, and plots with verified listings, expert support, and a refined buying experience.
              </p>

              <div className="flex flex-wrap gap-6 pt-8">
                {stats.slice(0, 3).map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-bold text-[var(--gold)]">{s.value}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-5 border border-white/60">
                <div className="flex flex-wrap gap-2 mb-5 pb-4 border-b border-slate-100">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => navigate(`/properties?category=${cat.value}`)}
                      className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-slate-100 text-slate-500 hover:bg-[var(--crimson)] hover:text-white"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  {[
                    {
                      icon: MapPin,
                      key: 'location',
                      label: 'Location',
                      options: availableLocations.map((l) => ({ label: l, value: l })),
                    },
                    {
                      icon: Building2,
                      key: 'propertyType',
                      label: 'Type',
                      options: [
                        { label: 'Apartment', value: 'apartment' },
                        { label: 'Villa', value: 'villa' },
                        { label: 'Commercial', value: 'commercial' },
                        { label: 'Plot', value: 'plot' },
                      ],
                    },
                    {
                      icon: DollarSign,
                      key: 'budget',
                      label: 'Budget',
                      options: [
                        { label: 'Up to ₹50 Lac', value: '5000000' },
                        { label: 'Up to ₹1 Cr', value: '10000000' },
                        { label: 'Up to ₹3 Cr', value: '30000000' },
                        { label: 'Above ₹3 Cr', value: '50000000' },
                      ],
                    },
                  ].map((s, i) => (
                    <div key={i} className="relative bg-slate-50 rounded-xl border border-slate-200 hover:border-[var(--gold)]/50 transition-colors group">
                      <s.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-[var(--gold)] transition-colors" />
                      <select
                        value={i === 0 ? searchLocation : i === 1 ? propertyType : maxPrice}
                        onChange={(e) => {
                          if (i === 0) setSearchLocation(e.target.value);
                          if (i === 1) setPropertyType(e.target.value);
                          if (i === 2) setMaxPrice(e.target.value);
                        }}
                        className="h-12 pl-10 pr-4 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none text-sm font-medium cursor-pointer"
                      >
                        <option value="">{s.label}</option>
                        {s.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSearchClick}
                  className="shimmer-btn relative overflow-hidden w-full h-12 bg-[var(--crimson)] text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:bg-[var(--crimson-dark)]"
                >
                  <Search className="h-4 w-4" /> Search Properties
                </button>
              </div>
            </div>

            <div className="hidden lg:flex items-end justify-center float-anim" style={{ height: '560px' }}>
              <div className="w-full max-w-[520px] rounded-[2rem] bg-white/5 border border-white/10 p-8 backdrop-blur-sm shadow-2xl">
                <div className="rounded-[1.5rem] overflow-hidden bg-gradient-to-br from-[#111] to-[#050505] p-8">
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="h-24 rounded-2xl bg-white/10" />
                    <div className="h-24 rounded-2xl bg-[var(--gold)]/15" />
                    <div className="h-28 rounded-2xl bg-white/10 col-span-2" />
                  </div>
                  <p className="text-[var(--gold)] uppercase tracking-[0.25em] text-xs font-bold mb-2">Curated Inventory</p>
                  <h3 className="font-display text-4xl text-white leading-tight">A more refined way to buy property.</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--cream)] to-transparent z-10 pointer-events-none" />
      </section>

      {/* STATS */}
      <section className="relative z-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center py-8 px-4 text-center group">
                <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-3 group-hover:bg-[var(--gold)]/20 transition-colors">
                  <stat.icon className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROPERTY GRID */}
      <section id="property-grid" className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-12">
            <div>
              <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Explore Listings</p>
              <h2 className="font-display text-4xl sm:text-5xl text-slate-900 leading-tight">Properties for <em>Sale</em></h2>
              <p className="text-slate-500 mt-3">Found {propertyCards.length} verified listings</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white border border-slate-200 hover:border-[var(--gold)]/50 transition-colors rounded-lg px-3 py-2 shadow-sm relative group w-full lg:w-auto">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-2 group-focus-within:text-[var(--crimson)]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent outline-none text-sm font-bold text-slate-700 cursor-pointer appearance-none pr-5 w-full"
                >
                  <option value="newest">Sort By: Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-[var(--crimson)] animate-spin" />
            </div>
          ) : propertyCards.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">No properties found</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                We couldn't find any properties matching your filters. Try broadening the search.
              </p>
              <Button
                onClick={() => {
                  setSearchLocation('');
                  setMaxPrice('');
                  setPropertyType('');
                }}
                className="mt-6 bg-[var(--gold)]/10 text-[var(--crimson)] hover:bg-[var(--gold)]/20 font-bold transition-colors"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {propertyCards.map((property) => {
                const isSaved = savedProperties.has(property.id);
                return (
                  <div
                    key={property.id}
                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[var(--gold)]/50 transition-all duration-300 group cursor-pointer flex flex-col relative"
                    onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                  >
                    <button
                      onClick={(e) => handleSaveProperty(e, property.id)}
                      className={`absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all z-20 shadow-md ${
                        isSaved ? 'text-[var(--crimson)] bg-red-50 border border-red-100' : 'text-slate-400 hover:text-[var(--crimson)] hover:bg-red-50'
                      }`}
                      title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-[var(--crimson)] text-[var(--crimson)]' : ''}`} />
                    </button>

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
                            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" /> {property.projectStatus || 'Featured'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-4 flex-1 flex flex-col relative z-20 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[var(--crimson)] text-xs font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                          {property.property_type || 'Property'}
                        </p>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1 group-hover:text-[var(--crimson)] transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-slate-500 text-sm flex items-center mb-4 font-medium">
                        <MapPin className="w-4 h-4 mr-1 text-slate-400" /> {property.location}, {property.city}
                      </p>

                      <div className="grid grid-cols-3 gap-2 mb-6 text-slate-600 text-sm font-bold">
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Bed className="w-4 h-4 text-[var(--gold)] mb-1" /> {property.bhk || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Bath className="w-4 h-4 text-[var(--gold)] mb-1" /> {property.bathrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Maximize className="w-4 h-4 text-[var(--gold)] mb-1" /> {property.area || property.size || '-'} <span className="text-[10px] font-normal">sqft</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Price</p>
                          <span className="text-2xl font-black text-slate-900">
                            {property.price > 0
                              ? `₹${property.price >= 10000000 ? (property.price / 10000000).toFixed(2) + ' Cr' : (property.price / 100000).toFixed(2) + ' Lac'}`
                              : 'On Request'}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[var(--crimson)] group-hover:text-white transition-colors border border-slate-100 group-hover:border-[var(--crimson)]">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* EXPLORE CATEGORIES */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Portfolio</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-tight">
              Explore Our <em>Asset Classes</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {exploreCategories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/properties?property_type=${cat.title.split(' ')[1]?.toLowerCase() || cat.title.toLowerCase()}`)}
                className="relative h-80 sm:h-96 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/90 via-[#020202]/30 to-transparent" />
                <div className="absolute inset-0 bg-[var(--gold)]/0 group-hover:bg-[var(--gold)]/5 transition-colors duration-500" />
                <div className="absolute bottom-6 left-6 right-6">
                  <cat.icon className="w-8 h-8 text-[var(--gold)] mb-3" />
                  <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                  <p className="text-slate-300 text-sm mt-1">{cat.desc}</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Process</p>
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900 leading-tight">Your Journey to the <em>Perfect Property</em></h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-16 right-16 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative group"
              >
                <div className="w-20 h-20 mx-auto bg-white border-2 border-slate-100 rounded-full shadow-lg flex items-center justify-center relative z-10 group-hover:border-[var(--gold)]/40 transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-[var(--crimson)]" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[var(--gold)] text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white shadow">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--ink)] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <p className="text-[var(--gold)] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Signature Collection
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-white">Exclusive <em>Primary Listings</em></h2>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-sm font-semibold text-white hover:bg-white hover:text-slate-900 transition-all whitespace-nowrap"
            >
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => {
                const isSaved = savedProperties.has(property.id);
                return (
                  <motion.div
                    key={property.id}
                    whileHover={{ y: -6 }}
                    className="card-3d bg-[#111] rounded-2xl overflow-hidden border border-white/10 cursor-pointer group flex flex-col transition-all duration-300 hover:border-[var(--gold)]/30"
                    onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                  >
                    <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-900 z-20 flex items-center gap-1.5 uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-[var(--gold)]" /> {property.projectStatus || 'Featured'}
                    </div>
                    <button
                      onClick={(e) => handleSaveProperty(e, property.id)}
                      className={`absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center z-20 border transition-colors ${
                        isSaved ? 'border-[var(--crimson)] text-[var(--crimson)]' : 'border-white/20 text-white hover:text-[var(--crimson)]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-[var(--crimson)]' : ''}`} />
                    </button>
                    <div className="relative h-56 overflow-hidden bg-slate-800">
                      <img
                        src={getMainImage(property)}
                        alt={property.title}
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-1">
                          {property.category} · {property.property_type}
                        </p>
                        <h3 className="text-lg font-bold text-white line-clamp-1">{property.title}</h3>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-slate-400 text-sm mb-4 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" /> {property.location}, {property.city}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="font-bold text-white text-xl">{formatCurrency(property.price)}</span>
                        <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-[var(--crimson)] flex items-center justify-center transition-colors border border-white/10">
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-10 text-slate-500">No premium properties currently available.</p>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3">The ANK Advantage</p>
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900">Why Investors <em>Choose Us</em></h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                t: 'Zero Brokerage',
                d: 'We charge no brokerage on new developer projects, so you keep more value with every deal.',
                i: DollarSign,
              },
              {
                t: 'Legal Verification',
                d: 'Each listing is checked through a physical and legal verification process before going live.',
                i: Shield,
              },
              {
                t: 'End-to-End Support',
                d: 'From search to loan guidance, registry, and possession, we stay with you throughout.',
                i: ThumbsUp,
              },
            ].map((usp, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-slate-200 group hover:border-[var(--gold)]/40 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[var(--crimson)] transition-colors">
                  <usp.i className="w-7 h-7 text-[var(--gold)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{usp.t}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{usp.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI CALCULATOR */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--ink)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--crimson)]/15 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--gold)]/8 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="text-[var(--gold)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Financial Planning</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white">Smart <em>EMI Calculator</em></h2>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/10 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-8">
              {[
                { label: 'Loan Amount', value: formatCurrency(loanAmount), state: loanAmount, set: setLoanAmount, min: 500000, max: 100000000, step: 100000 },
                { label: 'Interest Rate (p.a.)', value: `${interestRate.toFixed(1)}%`, state: interestRate, set: setInterestRate, min: 5, max: 15, step: 0.1 },
                { label: 'Loan Tenure', value: `${loanTenure} Years`, state: loanTenure, set: setLoanTenure, min: 1, max: 30, step: 1 },
              ].map((inp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{inp.label}</label>
                    <span className="text-lg font-bold text-[var(--gold)]">{inp.value}</span>
                  </div>
                  <input type="range" min={inp.min} max={inp.max} step={inp.step} value={inp.state} onChange={(e) => inp.set(Number(e.target.value))} className="w-full" />
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-[var(--crimson)] to-[#3a0000] p-8 rounded-2xl text-center border border-[var(--crimson)]/30 shadow-2xl">
              <Calculator className="w-10 h-10 text-[var(--gold)] mb-4 mx-auto opacity-80" />
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Monthly EMI</p>
              <h3 className="text-4xl sm:text-5xl font-black text-white mb-8">{formatCurrency(calculateEMI())}</h3>
              <div className="space-y-3 pt-6 border-t border-white/15 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Principal</span>
                  <span className="font-bold text-white">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Total Interest</span>
                  <span className="font-bold text-white">{formatCurrency(calculateEMI() * loanTenure * 12 - loanAmount)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/15">
                  <span className="text-white font-semibold text-xs uppercase tracking-wider">Total Payable</span>
                  <span className="font-black text-[var(--gold)] text-lg">{formatCurrency(calculateEMI() * loanTenure * 12)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOAN ADVISORY */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-4">Financial Advisory</p>
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900 leading-tight mb-6">
              Get pre-approved for <em>your dream home.</em>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Skip the bank queues. Our financial experts guide you to the lowest interest rates and highest loan eligibility.
            </p>
            <div className="space-y-3">
              {bankOffers.map((offer, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base text-slate-900">{offer.bank}</p>
                    <p className="text-[var(--crimson)] text-xs font-semibold uppercase tracking-wider mt-0.5">{offer.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--gold)] font-black text-xl">{offer.rate}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Indicative ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-[var(--gold)]/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="bg-[var(--gold)]/15 p-3.5 rounded-xl border border-[var(--gold)]/20">
                <Banknote className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Request Loan Call</h3>
                <p className="text-slate-400 text-sm">Get a free consultation today</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6 relative z-10">
              <Input value={loanLead.name} onChange={(e) => setLoanLead((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" className="bg-white/8 border-white/15 text-white h-13 rounded-xl px-4 placeholder:text-slate-500 focus:border-[var(--gold)]" />
              <Input value={loanLead.phone} onChange={(e) => setLoanLead((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone number" type="tel" className="bg-white/8 border-white/15 text-white h-13 rounded-xl px-4 placeholder:text-slate-500 focus:border-[var(--gold)]" />
            </div>
            <button
              onClick={handleLoanLead}
              disabled={isLoanSubmitting}
              className="w-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] text-slate-900 h-13 rounded-xl text-sm font-bold shadow-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity relative z-10"
            >
              {isLoanSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get Free Consultation <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </section>

      {/* VIDEOS */}
      {videos.length > 0 && (
        <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--cream)] border-t border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Property Tours & Insights</p>
              <h2 className="font-display text-4xl sm:text-5xl text-slate-900 leading-tight">Featured Real Estate Videos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videos.map((vid) => {
                const ytId = getYouTubeID(vid.videoUrl);
                return (
                  <div key={vid.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[var(--gold)]/50 transition-all duration-300 group flex flex-col">
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
                      <div className="text-[10px] font-black uppercase tracking-widest text-[var(--crimson)] mb-2 flex items-center gap-1.5">
                        <PlayCircle className="w-3.5 h-3.5" /> Video Tour
                      </div>
                      <h3 className="font-black text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-[var(--crimson)] transition-colors">
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
                <Button variant="outline" className="border-slate-300 font-bold hover:bg-[var(--crimson)] hover:text-white transition-colors h-12 px-8 rounded-xl text-base">
                  View All Videos <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* MAP */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 gap-8 lg:gap-16 relative">
            <div className="max-w-2xl">
              <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
                <MapIcon className="w-4 h-4" /> Location insights
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-slate-900 leading-tight">
                Explore {searchLocation || 'Top Corridors'} Visually
              </h2>
              <p className="text-slate-600 text-lg md:text-xl mt-5 leading-relaxed">
                Pan and zoom to discover the neighborhoods, connectivity hubs, and infrastructure shaping real estate value.
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
            />
          </div>
        </div>
      </section>

      {/* FLOATING CHAT */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 border border-[var(--gold)]/30 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
            <div className="bg-[#050505] text-[var(--gold)] border-b border-[var(--gold)]/30 p-4 font-bold flex justify-between items-center shadow-md relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                ANK AI Assistant
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-slate-800 text-slate-300 hover:text-white p-1 rounded-md transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 bg-slate-50 flex flex-col gap-3 h-[380px] overflow-y-auto">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/50 flex items-center justify-center shrink-0 shadow-sm">
                  <Home className="w-4 h-4 text-[var(--crimson)]" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm border border-slate-100 text-slate-700">
                  Welcome to ANK Realty. Please choose a subject below so I can assist you better.
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2 pl-10">
                {chatSubjects.map((subject, i) => (
                  <button
                    key={i}
                    className="text-left bg-white hover:bg-[var(--crimson)]/5 text-slate-700 hover:text-[var(--crimson)] p-2.5 rounded-xl text-sm font-medium transition-all border border-slate-200 hover:border-[var(--gold)]/50 shadow-sm"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[var(--gold)]" />
              <button className="bg-[var(--crimson)] text-white p-2 rounded-full hover:bg-[var(--crimson-dark)] shadow-md shadow-[var(--crimson)]/30 transition-colors">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-[var(--crimson)] hover:bg-[var(--crimson-dark)] border-2 border-white/10 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(139,0,0,0.4)] hover:scale-110 transition-transform flex items-center justify-center group"
          >
            <MessageSquare className="w-7 h-7" />
            <span className="absolute right-full mr-4 bg-[#050505] border border-[var(--gold)]/30 text-[var(--gold)] text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              Chat with us!
            </span>
          </button>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-[#050505] text-white pt-24 pb-12 px-6 border-t-[8px] border-[var(--crimson)] mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-4xl font-black tracking-tight text-[var(--gold)]">
                ANK <span className="text-white">REALTY</span>
              </h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium">
                Premium property discovery, verified advisory, and owner-first support across major hubs.
              </p>
              <div className="flex space-x-3 pt-2">
                <a href={socialLinks.linkedin} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[var(--gold)]/30 flex items-center justify-center hover:bg-[var(--crimson)] hover:border-[var(--crimson)] text-[var(--gold)] hover:text-white transition-all cursor-pointer">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href={socialLinks.twitter} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[var(--gold)]/30 flex items-center justify-center hover:bg-[var(--crimson)] hover:border-[var(--crimson)] text-[var(--gold)] hover:text-white transition-all cursor-pointer">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href={socialLinks.facebook} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[var(--gold)]/30 flex items-center justify-center hover:bg-[var(--crimson)] hover:border-[var(--crimson)] text-[var(--gold)] hover:text-white transition-all cursor-pointer">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href={socialLinks.instagram} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[var(--gold)]/30 flex items-center justify-center hover:bg-[var(--crimson)] hover:border-[var(--crimson)] text-[var(--gold)] hover:text-white transition-all cursor-pointer">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs mb-6 text-white uppercase tracking-[0.2em]">Quick Links</h4>
              <ul className="space-y-3.5 text-slate-400 text-sm">
                {[
                  { label: 'All Properties', to: '/properties' },
                  { label: 'About Us', to: '/about' },
                  { label: 'Careers', to: '/careers' },
                  { label: 'Contact Support', to: '/contact' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link to={item.to} className="hover:text-[var(--gold)] transition-colors flex items-center gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--crimson)]" /> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs mb-6 text-white uppercase tracking-[0.2em]">Categories</h4>
              <ul className="space-y-3.5 text-slate-400 text-sm">
                {[
                  { label: 'Premium Plots', to: '/properties?property_type=plot' },
                  { label: 'Residential Homes', to: '/properties?category=buy' },
                  { label: 'Corporate Leasing', to: '/corporate-leasing' },
                  { label: 'Rental Homes', to: '/properties?category=rent' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link to={item.to} className="hover:text-[var(--gold)] transition-colors flex items-center gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--crimson)]" /> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs mb-6 text-white uppercase tracking-[0.2em]">Headquarters</h4>
              <div className="space-y-3.5">
                {[
                  { icon: MapPin, text: 'Sector 62, Noida, Uttar Pradesh 201309' },
                  { icon: Mail, text: 'info@ankrealty.com' },
                  { icon: Banknote, text: '+91 92664 58945' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5 hover:border-[var(--gold)]/30 transition-colors group">
                    <item.icon className="w-4.5 h-4.5 text-[var(--gold)] shrink-0 mt-0.5" />
                    <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row justify-between items-center gap-5 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <Link to="/privacy" className="hover:text-[var(--gold)] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[var(--gold)] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
