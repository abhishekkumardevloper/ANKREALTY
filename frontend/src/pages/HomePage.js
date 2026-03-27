import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Banknote, Bell, Briefcase, Building2, Calculator, ChevronRight, 
  Handshake, Instagram, Linkedin, Mail, MapPin, MessageCircle, Search, Users, Youtube, ShieldCheck 
} from 'lucide-react';

// Tumhare original imports - Make sure ye files tumhare folder me hain!
import Navbar from '../components/Navbar';
import RegisterPopup from './RegisterPopup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bankOffers, exploreLocalities, newsArticles, socialLinks } from '@/lib/siteData';
import { WHATSAPP_URL, createPropertySearch } from '@/lib/api';

// --- ATTRACIVE INLINE DATA (To guarantee it works and looks good) ---
const featuredProperties = [
  { 
    id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sector 151', propertyType: 'Apartment', 
    category: 'Buy', price: '₹ 1.85 Cr', 
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    tag: 'New Launch'
  },
  { 
    id: 'f3', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sector 97', propertyType: 'Villa', 
    category: 'Buy', price: '₹ 3.50 Cr', 
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    tag: 'Ultra Luxury'
  },
  { 
    id: 'r1', title: 'Supertech Supernova', city: 'Noida', location: 'Sector 94', propertyType: 'Apartment', 
    category: 'Rent', price: '₹ 45,000 /mo', 
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    tag: 'Premium Rent'
  },
  { 
    id: 'p1', title: 'Bajrang Vatika', city: 'Noida Ext', location: 'Sector 10', propertyType: 'Plot', 
    category: 'Buy', price: '₹ 45 Lac', 
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    tag: 'High ROI Plot'
  },
];

// Fallback images for localities in case your siteData doesn't have images
const localityImages = [
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80'
];

const topRowLogos = [
  "/images (3).png", "/images__9_-removebg-preview.png", "/images (1).png", "/images (2).png", "/183f468e401f4220bce9e4f7b1e3ffd820251112162925170.png",
];

const bottomRowLogos = [
  "/images.png", "/4f3bb698972531.Y3JvcCw5NTAsNzQzLDIyMywyMQ-removebg-preview.png", "/Max_Estates_logo.svg.png", "/M3M-Jacob-and-Co-logo.png",
];

const categoryOptions = [
  { label: 'Buy', value: 'buy' },
  { label: 'Sell', value: 'sell' },
  { label: 'Rent', value: 'rent' },
];

const propertyTypeOptions = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Plot', value: 'plot' },
];

const socialIconMap = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
};

export default function HomePage() {
  const navigate = useNavigate();
  
  // States
  const [search, setSearch] = useState({ category: 'buy', city: '', property_type: '', max_price: '' });
  const [searchFocused, setSearchFocused] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  // Lead & EMI States
  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });
  const [loanAmt, setLoanAmt] = useState(5000000);
  const [intRate, setIntRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  // Safe Suggestions
  const suggestions = useMemo(() => {
    if (!exploreLocalities || !Array.isArray(exploreLocalities)) return [];
    const query = search.city.trim().toLowerCase();
    if (!query) return exploreLocalities;
    return exploreLocalities.filter((item) => 
      (item.name && item.name.toLowerCase().includes(query)) || 
      (item.city && item.city.toLowerCase().includes(query))
    );
  }, [search.city]);

  const handleSearch = () => {
    // Falls back to safe routing if createPropertySearch fails
    try {
      navigate(createPropertySearch(search));
    } catch (e) {
      navigate(`/${search.category}?city=${search.city}&type=${search.property_type}`);
    }
  };
  
  const handleNewsletter = () => {
    if (!newsletterEmail.includes('@')) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ANK Realty, subscribe me for property deals. My email is ${newsletterEmail}.`)}`, '_blank');
  };
  
  const handleLoanLead = () => {
    if (!loanLead.name || loanLead.phone.length < 10) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ANK Realty, I want a home-loan consultation. Name: ${loanLead.name}, Phone: ${loanLead.phone}.`)}`, '_blank');
  };

  // EMI Logic
  const calculateEMI = () => {
    const p = loanAmt;
    const r = intRate / 12 / 100;
    const n = tenure * 12;
    if (p > 0 && r > 0 && n > 0) return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    return 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-200 relative">
      <Navbar />
      <RegisterPopup />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-28 px-4 md:px-6 overflow-hidden min-h-[85vh] flex flex-col justify-center">
        <div className="absolute inset-0 z-0 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-slate-900/85 z-10" />
        
        <div className="relative z-20 max-w-6xl mx-auto text-center mt-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-bold tracking-widest uppercase shadow-lg shadow-red-500/10">
            Trusted by thousands of buyers across India
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight uppercase drop-shadow-2xl">
            Discover premium property across <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Delhi NCR</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Search verified homes, plotted developments, rentals, and commercial spaces with a seamless, professional experience.
          </p>

          <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-4 md:p-5 max-w-5xl mx-auto border border-white/20 text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-5 px-4 pt-2">
              {categoryOptions.map((cat) => (
                <button 
                  key={cat.value} 
                  onClick={() => setSearch((prev) => ({ ...prev, category: cat.value }))} 
                  className={`px-6 py-2 rounded-full font-bold transition-all ${search.category === cat.value ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-200 hover:bg-white/10'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 relative bg-white p-2 rounded-3xl shadow-inner">
              <div className="relative md:border-r md:border-slate-100 bg-slate-50 rounded-2xl md:rounded-none md:bg-transparent">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <Input value={search.city} onChange={(e) => setSearch((prev) => ({ ...prev, city: e.target.value }))} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)} placeholder="City or sector..." className="h-14 pl-12 bg-transparent border-0 shadow-none focus-visible:ring-0 font-bold text-slate-900 placeholder:font-normal" />
                {searchFocused && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50">
                    {suggestions.slice(0, 5).map((item) => (
                      <button key={item.name} type="button" onClick={() => { setSearch((prev) => ({ ...prev, city: item.name, property_type: item.propertyType || '' })); setSearchFocused(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 flex justify-between items-center transition-colors">
                        <span className="font-bold text-slate-900">{item.name}</span>
                        <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">{item.badge || 'Location'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative md:border-r md:border-slate-100 bg-slate-50 rounded-2xl md:rounded-none md:bg-transparent">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <select value={search.property_type} onChange={(e) => setSearch((prev) => ({ ...prev, property_type: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-900 font-bold appearance-none outline-none cursor-pointer">
                  <option value="" className="font-normal">Property Type</option>
                  {propertyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <div className="relative bg-slate-50 rounded-2xl md:rounded-none md:bg-transparent">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <select value={search.max_price} onChange={(e) => setSearch((prev) => ({ ...prev, max_price: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-900 font-bold appearance-none outline-none cursor-pointer">
                  <option value="" className="font-normal">Budget</option>
                  <option value="5000000">Up to ₹50 Lac</option>
                  <option value="10000000">Up to ₹1 Cr</option>
                  <option value="30000000">Up to ₹3 Cr</option>
                  <option value="100000000">Above ₹3 Cr</option>
                </select>
              </div>
              <Button onClick={handleSearch} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-red-600/30 transition-transform hover:scale-[1.02]"><Search className="mr-2 h-5 w-5" /> Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUSTED BRANDS ANIMATION --- */}
      <section className="py-12 sm:py-16 relative w-full overflow-hidden bg-white -mt-10 z-20 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-b border-slate-100">
        <div className="w-full">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 sm:mb-12 text-center">
            Trusted by leading brands across India
          </h2>
          <div className="relative flex flex-col gap-8 sm:gap-12 overflow-hidden w-full">
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="flex gap-8 sm:gap-16 w-max">
              {[...topRowLogos, ...topRowLogos, ...topRowLogos].map((src, i) => (
                <div key={`top-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 sm:h-20 flex items-center justify-center">
                  <img src={src} alt="Brand logo" className="max-w-full max-h-full object-contain filter brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </motion.div>
            <motion.div animate={{ x: ["-50%", "0%"] }} transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="flex gap-8 sm:gap-16 w-max">
              {[...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos].map((src, i) => (
                <div key={`bottom-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 sm:h-20 flex items-center justify-center">
                  <img src={src} alt="Brand logo" className="max-w-full max-h-full object-contain filter brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </motion.div>
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* --- EXPLORE LOCALITIES (With Background Images) --- */}
      <section className="py-24 bg-white relative z-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Location Spotlight</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Explore high-intent localities</h2>
              <p className="text-slate-500 mt-3 max-w-2xl text-lg">Jump straight into the corridors buyers and investors ask about most often.</p>
            </div>
            <Link to="/buy">
              <Button variant="outline" className="border-slate-300 font-bold h-12 rounded-xl px-6 hover:bg-slate-50">
                Browse all inventory <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {(exploreLocalities || []).map((item, index) => {
              // Safe fallback image if siteData item lacks an image
              const safeImg = item.image || localityImages[index % localityImages.length];
              return (
                <button 
                  key={item.name || index} 
                  onClick={() => {
                    try { navigate(createPropertySearch({ city: item.name || item.city, category: 'buy' })); }
                    catch (e) { navigate(`/buy?city=${item.name || item.city}`); }
                  }} 
                  className="text-left rounded-3xl overflow-hidden relative h-72 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="absolute inset-0">
                    <img src={safeImg} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 flex flex-col justify-end">
                    <p className="text-[10px] uppercase tracking-[0.25em] bg-red-600 text-white px-3 py-1.5 rounded-lg w-fit font-bold mb-3 shadow-md">{item.badge || 'Prime'}</p>
                    <h3 className="text-2xl font-black text-white mb-1 group-hover:text-red-400 transition-colors">{item.name}</h3>
                    <p className="text-slate-300 text-sm font-medium">{item.city}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FEATURED INVENTORY (Attractive Cards) --- */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Handpicked For You</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Buy, sell, and rent with confidence</h2>
            </div>
            <Link to="/buy">
              <Button variant="outline" className="border-slate-300 font-bold h-12 rounded-xl px-6 hover:bg-white">
                View all properties
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProperties.map((property) => (
              <div 
                key={property.id} 
                onClick={() => navigate(`/property/${property.id}`)} 
                className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-red-200 transition-all duration-300 cursor-pointer relative group flex flex-col"
              >
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-black text-slate-900 shadow-lg z-10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> {property.tag || 'Verified'}
                </div>
                
                <div className="relative h-56 overflow-hidden p-2 pb-0">
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <img src={property.image} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
                    {property.category} • {property.propertyType || property.type}
                  </p>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">{property.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex items-center"><MapPin className="w-4 h-4 mr-1 text-slate-400"/> {property.location}, {property.city}</p>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Price</p>
                      <span className="font-black text-slate-900 text-xl">{property.price}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5"/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EMI CALCULATOR & LOAN ASSIST --- */}
      <section className="py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Financial Planning</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Calculate your investment instantly</h2>
            <p className="text-slate-600 text-lg leading-8 mb-10">
              Planning to buy your dream home or a premium plot? Use our interactive calculator to estimate your monthly EMI. Adjust the parameters to see how it fits your financial goals.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                ['Top Bank Offers', 'Compare home loan rates starting at 8.35% p.a.'],
                ['Transparent Process', 'No hidden fees, smooth documentation support.'],
              ].map(([title, body]) => (
                <div key={title} className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
                  <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-6">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calculator className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-black">Smart EMI Calculator</h3>
              </div>
              
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 mb-8 text-center">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Estimated Monthly EMI</p>
                <p className="text-5xl font-black text-red-500 font-mono">
                  ₹{calculateEMI().toLocaleString('en-IN')}<span className="text-xl text-slate-400 font-sans font-medium"> /mo</span>
                </p>
              </div>

              <div className="space-y-6 bg-white rounded-3xl p-6 shadow-inner text-slate-900 mb-8">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold">
                    <span className="text-slate-500">Loan Amount</span>
                    <span className="text-slate-900 text-lg">₹{(loanAmt / 100000).toLocaleString('en-IN')} Lacs</span>
                  </div>
                  <input type="range" min="1000000" max="50000000" step="500000" value={loanAmt} onChange={(e)=>setLoanAmt(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold">
                    <span className="text-slate-500">Interest Rate (p.a.)</span>
                    <span className="text-slate-900 text-lg">{intRate}%</span>
                  </div>
                  <input type="range" min="7" max="12" step="0.1" value={intRate} onChange={(e)=>setIntRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold">
                    <span className="text-slate-500">Loan Tenure</span>
                    <span className="text-slate-900 text-lg">{tenure} Years</span>
                  </div>
                  <input type="range" min="5" max="30" step="1" value={tenure} onChange={(e)=>setTenure(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input value={loanLead.name} onChange={(e) => setLoanLead((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your name" className="bg-white/10 border-white/20 text-white placeholder-slate-400 h-12 rounded-xl focus:border-red-500" />
                <Input value={loanLead.phone} onChange={(e) => setLoanLead((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="bg-white/10 border-white/20 text-white placeholder-slate-400 h-12 rounded-xl focus:border-red-500" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleLoanLead} className="bg-red-600 hover:bg-red-700 h-12 rounded-xl text-base px-6 font-bold w-full sm:w-auto">Request Bank Callback</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEWS & INSIGHTS --- */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Market Intelligence</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">News & Insights</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(newsArticles || []).map((article, index) => (
              <div key={article.id || index} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <div className="h-56 overflow-hidden relative p-2 pb-0">
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <img src={article.image || localityImages[index % localityImages.length]} alt={article.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-red-600 font-bold mb-3 bg-red-50 px-2 py-1 rounded w-fit">{article.category}</p>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-slate-500 text-sm leading-6 mb-6 line-clamp-3">{article.excerpt}</p>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{article.date} • {article.readTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER CTA --- */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/50">
            <Bell className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6">Never Miss a Deal</h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">Get pre-launch alerts, price updates, and curated property matches directly on email and WhatsApp.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 h-16 rounded-2xl px-6 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 text-lg" />
            <Button onClick={handleNewsletter} className="h-16 px-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-lg shadow-lg shadow-red-600/30 transition-transform hover:scale-105">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 px-6 border-t-[8px] border-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-4xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-loose font-medium">Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support across India.</p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 transition-all"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 transition-all"><Youtube className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 transition-all"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest">Quick Links</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/rent" className="hover:text-red-500 transition-colors">Rent Property</Link></li>
                <li><Link to="/sell" className="hover:text-red-500 transition-colors">Sell Property</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest">Categories</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-sm">
                <li><Link to="/buy?property_type=plot" className="hover:text-red-500 transition-colors">Premium Plots</Link></li>
                <li><Link to="/buy?property_type=apartment" className="hover:text-red-500 transition-colors">Luxury Apartments</Link></li>
                <li><Link to="/buy?property_type=commercial" className="hover:text-red-500 transition-colors">Commercial Spaces</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest">Contact Us</h4>
              <div className="space-y-6 text-slate-400 font-medium text-sm">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-4 text-red-500 shrink-0" /> Sector 25, Noida, UP 201301</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-4 text-red-500 shrink-0" /> support@ankrealty.com</p>
                <p className="flex items-center"><Phone className="w-5 h-5 mr-4 text-red-500 shrink-0" /> Toll Free: 1800-123-4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
