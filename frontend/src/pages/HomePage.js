import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Banknote, Bell, Briefcase, Building2, Calculator, ChevronRight, 
  Handshake, Instagram, Linkedin, Mail, MapPin, MessageCircle, Search, Users, Youtube,
  TrendingUp, Award, ShieldCheck
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-200 relative">
      <Navbar />
      <RegisterPopup />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-28 px-4 md:px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="absolute inset-0" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4 }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/95 z-10" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto text-center mt-10 w-full">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-sm text-red-400 text-xs md:text-sm font-bold tracking-widest uppercase">
              <Award className="w-4 h-4" /> Trusted by thousands of buyers
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight uppercase drop-shadow-lg">
              Discover premium properties across <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">India</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
              Search verified homes, premium plots, rentals, and commercial spaces with a faster, cleaner, production-ready experience.
            </motion.p>
          </motion.div>

          {/* Search Box */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-12 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-4 md:p-6 max-w-5xl mx-auto border border-white/20 text-left relative z-30">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6 px-2 border-b border-slate-100 pb-4">
              {categoryOptions.map((cat) => (
                <button key={cat.value} onClick={() => setSearch((prev) => ({ ...prev, category: cat.value }))} className={`px-6 py-2.5 rounded-full font-bold transition-all ${search.category === cat.value ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>{cat.label}</button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              <div className="relative md:border-r md:border-slate-200 group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                <Input value={search.city} onChange={(e) => setSearch((prev) => ({ ...prev, city: e.target.value }))} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)} placeholder="City or micro-market" className="h-14 pl-12 border-0 shadow-none focus-visible:ring-0 bg-transparent text-lg placeholder:text-slate-400 font-medium" />
                
                {searchFocused && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-4 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden">
                    {suggestions.slice(0, 5).map((item) => (
                      <button key={item.name} type="button" onClick={() => { setSearch((prev) => ({ ...prev, city: item.city, property_type: item.propertyType })); setSearchFocused(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors flex justify-between items-center group/item">
                        <div>
                          <p className="font-bold text-slate-900 group-hover/item:text-red-600 transition-colors">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.city}</p>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold">{item.badge}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative md:border-r md:border-slate-200 group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                <select value={search.property_type} onChange={(e) => setSearch((prev) => ({ ...prev, property_type: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none font-medium text-lg cursor-pointer">
                  <option value="">Property Type</option>
                  {propertyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              
              <div className="relative group">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                <select value={search.max_price} onChange={(e) => setSearch((prev) => ({ ...prev, max_price: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none font-medium text-lg cursor-pointer">
                  <option value="">Max Budget</option>
                  <option value="5000000">Up to ₹50 Lac</option>
                  <option value="10000000">Up to ₹1 Cr</option>
                  <option value="30000000">Up to ₹3 Cr</option>
                  <option value="50000000">Above ₹3 Cr</option>
                </select>
              </div>
              
              <Button onClick={handleSearch} className="w-full h-14 bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 text-white font-black text-lg rounded-xl shadow-lg shadow-red-600/25">
                <Search className="mr-2 h-5 w-5" /> Search
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
            <div key={i} className="text-center px-4">
              <stat.icon className="w-8 h-8 mx-auto text-red-500 mb-3 opacity-80" />
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- TRUSTED BRANDS ANIMATION --- */}
      <section className="py-20 relative w-full overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="w-full">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-10 text-center">
            Trusted by leading brands across India
          </h2>
          <div className="relative flex flex-col gap-10 overflow-hidden w-full">
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="flex gap-12 sm:gap-20 w-max">
              {[...topRowLogos, ...topRowLogos, ...topRowLogos].map((src, i) => (
                <div key={`top-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500">
                  <img src={src} alt="Brand Logo" className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </motion.div>

            <motion.div animate={{ x: ["-50%", "0%"] }} transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="flex gap-12 sm:gap-20 w-max">
              {[...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos].map((src, i) => (
                <div key={`bottom-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500">
                  <img src={src} alt="Brand Logo" className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </motion.div>

            <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* --- FEATURED INVENTORY --- */}
      <section className="py-24 px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2"><Award className="w-4 h-4"/> Featured inventory</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Buy, sell, and rent with confidence</h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="border-slate-300 font-bold hover:bg-slate-900 hover:text-white transition-colors h-12 px-6 rounded-xl">View all properties <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProperties.map((property) => (
              <motion.div variants={fadeUp} key={property.id} onClick={() => navigate(`/property/${property.id}`, { state: { property } })} className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer relative group flex flex-col">
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-slate-900 shadow-lg z-10 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-red-600"/> {property.tag}
                </div>
                
                <div className="relative h-56 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <img src={property.image} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-600 mb-2">{property.category} • {property.propertyType}</p>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">{property.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex items-center font-medium"><MapPin className="w-4 h-4 mr-1.5 text-slate-400"/> {property.location}, {property.city}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-200/60">
                    <span className="font-black text-slate-900 text-xl">{property.price}</span>
                    <span className="bg-slate-100 group-hover:bg-red-50 text-slate-900 group-hover:text-red-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- WHY INDIA & LOAN FORM --- */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Investment Hub</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Why buyers choose India’s growth markets</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              Strong infrastructure pipelines, expanding business districts, and maturing social infrastructure continue to improve end-user demand and investment resilience. Trusted by thousands of buyers, <span className="font-bold text-slate-900">ANK Realty</span> simplifies the journey with verified inventory and dedicated human support.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: 'Verified listings', body: 'Property screening and lead qualification reduce wasted site visits.', icon: ShieldCheck },
                { title: 'Local expertise', body: 'Actionable help on pricing, ROI, and document readiness.', icon: MapPin },
                { title: 'Wide discovery', body: 'Explore residential, plotted, rental, and corporate inventory.', icon: Building2 },
                { title: 'Human support', body: 'Dedicated experts for search, loan guidance, and leasing support.', icon: Users },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <item.icon className="w-6 h-6 text-red-600 mb-4" />
                  <h3 className="font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="bg-red-600/20 p-3 rounded-2xl">
                <Calculator className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-3xl font-black">Apply Loan</h3>
            </div>
            
            <div className="space-y-4 mb-8 relative z-10">
              {bankOffers.map((offer) => (
                <div key={offer.bank} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-black text-lg">{offer.bank}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{offer.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-black text-xl">{offer.rate}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Indicative</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6 relative z-10">
              <Input value={loanLead.name} onChange={(e) => setLoanLead((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your full name" className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-14 rounded-xl focus:border-red-500" />
              <Input value={loanLead.phone} onChange={(e) => setLoanLead((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-14 rounded-xl focus:border-red-500" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Button onClick={handleLoanLead} className="bg-red-600 hover:bg-red-700 h-14 rounded-xl text-base px-8 font-bold flex-1 shadow-lg shadow-red-600/20">Request callback</Button>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex-1">
                <Button variant="outline" className="w-full h-14 border-white/20 text-slate-900 bg-white hover:bg-slate-100 rounded-xl px-6 font-bold">
                  <MessageCircle className="w-5 h-5 mr-2 text-green-600" /> WhatsApp Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- NEWSLETTER CTA --- */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-red-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-red-500/30">
            <Bell className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Never Miss a Property Deal</h2>
          <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">Get pre-launch alerts, price updates, and curated property matches directly to your inbox and WhatsApp.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 h-16 rounded-2xl px-6 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-lg" />
            <Button onClick={handleNewsletter} className="h-16 px-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-lg shadow-xl shadow-red-600/20">Subscribe Now</Button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-24 pb-12 px-6 border-t-[8px] border-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-4xl font-black tracking-tight">ANK<span className="text-red-600">Realty.</span></h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium">
                Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support across major hubs.
              </p>
              <div className="flex space-x-4 pt-4">
                {socialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon] || Handshake;
                  return <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer group"><Icon className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>;
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Quick Links</h4>
              <ul className="space-y-5 text-slate-400 font-medium">
                <li><Link to="/properties" className="hover:text-red-500 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2"/> All Properties</Link></li>
                <li><Link to="/about" className="hover:text-red-500 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2"/> About Us</Link></li>
                <li><Link to="/careers" className="hover:text-red-500 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2"/> Careers</Link></li>
                <li><Link to="/contact" className="hover:text-red-500 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2"/> Contact Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Categories</h4>
              <ul className="space-y-5 text-slate-400 font-medium">
                <li><Link to="/properties?property_type=plot" className="hover:text-red-500 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2"/> Premium Plots</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2"/> Residential Properties</Link></li>
                <li><Link to="/properties?property_type=commercial" className="hover:text-red-500 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2"/> Commercial Spaces</Link></li>
                <li><Link to="/rent" className="hover:text-red-500 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2"/> Rental Homes</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest text-sm">Contact Us</h4>
              <div className="space-y-6 text-slate-400 font-medium">
                <div className="flex items-start bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                  <MapPin className="w-6 h-6 mr-4 text-red-500 shrink-0" /> 
                  <p className="text-sm">Tapasya Corp Heights, Sector 126, Noida, UP 201301</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                  <Mail className="w-6 h-6 mr-4 text-red-500 shrink-0" /> 
                  <p className="text-sm">info@ankrealty.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
