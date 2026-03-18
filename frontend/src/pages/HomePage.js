import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Banknote, Bell, Briefcase, Building2, Calculator, ChevronRight, 
  Handshake, Instagram, Linkedin, Mail, MapPin, MessageCircle, Search, Users, 
  Youtube, X, Send, Map, Star, Key, Shield, FileText, TrendingUp, Phone 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RegisterPopup from './RegisterPopup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bankOffers, exploreLocalities, newsArticles, socialLinks } from '@/lib/siteData';
import { WHATSAPP_URL, createPropertySearch } from '@/lib/api';

// --- DATA FROM CODE 2 ---
const featuredProperties = [
  { id: 'p1', title: 'Bajrang Vatika', city: 'Noida Extension', location: 'Sector 10', propertyType: 'plot', category: 'buy', price: '₹ 45 L onwards', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
  { id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sector 151', propertyType: 'apartment', category: 'buy', price: '₹ 1.85 Cr onwards', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
  { id: 'c1', title: 'M3M Line', city: 'Noida', location: 'Sector 72', propertyType: 'commercial', category: 'buy', price: '₹ 80 L onwards', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
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

// --- DATA FROM CODE 3 (Logos for Animation) ---
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

export default function HomePage() {
  const navigate = useNavigate();
  
  // Search State (Code 1)
  const [search, setSearch] = useState({ category: 'buy', city: '', property_type: '', max_price: '' });
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Newsletter & Loan State (Code 1)
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });

  // Chatbot State (Code 3)
  const [isChatOpen, setIsChatOpen] = useState(false);

  // EMI Calculator State (Code 3)
  const [loanAmount, setLoanAmount] = useState(5000000); 
  const [interestRate, setInterestRate] = useState(8.5); 
  const [loanTenure, setLoanTenure] = useState(20); 
  const [emiResult, setEmiResult] = useState({ emi: 0, totalInterest: 0, totalPayment: 0 });

  // EMI Calculation Effect (Code 3)
  useEffect(() => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;

    if (p > 0 && r > 0 && n > 0) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      setEmiResult({
        emi: Math.round(emi),
        totalInterest: Math.round(totalPayment - p),
        totalPayment: Math.round(totalPayment)
      });
    }
  }, [loanAmount, interestRate, loanTenure]);

  // Search Logic (Code 1)
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

      {/* --- HERO SECTION (From Code 1) --- */}
      <section className="relative pt-32 pb-28 px-4 md:px-6 overflow-hidden min-h-[85vh]">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-slate-900/85 z-10" />
        <div className="relative z-20 max-w-6xl mx-auto text-center mt-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-bold tracking-widest uppercase">Trusted by thousands of buyers across India</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight uppercase">Discover premium property opportunities across <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Delhi NCR</span></h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">Search verified homes, plotted developments, rentals, and commercial spaces with a faster, cleaner, production-ready experience.</p>

          <div className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-6 max-w-5xl mx-auto border border-slate-100 text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6 px-2 border-b border-slate-100 pb-4">
              {categoryOptions.map((cat) => (
                <button key={cat.value} onClick={() => setSearch((prev) => ({ ...prev, category: cat.value }))} className={`px-4 py-2 rounded-full font-bold ${search.category === cat.value ? 'bg-red-50 text-red-600 border border-red-200' : 'text-slate-500 border border-transparent hover:text-slate-900'}`}>{cat.label}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              <div className="relative md:border-r md:border-slate-200">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input value={search.city} onChange={(e) => setSearch((prev) => ({ ...prev, city: e.target.value }))} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 150)} placeholder="City or micro-market" className="h-14 pl-12 border-0 shadow-none focus-visible:ring-0" />
                {searchFocused && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-20">
                    {suggestions.slice(0, 5).map((item) => (
                      <button key={item.name} type="button" onClick={() => { setSearch((prev) => ({ ...prev, city: item.city, property_type: item.propertyType })); setSearchFocused(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.badge}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative md:border-r md:border-slate-200">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select value={search.property_type} onChange={(e) => setSearch((prev) => ({ ...prev, property_type: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none font-medium">
                  <option value="">Property Type</option>
                  {propertyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select value={search.max_price} onChange={(e) => setSearch((prev) => ({ ...prev, max_price: e.target.value }))} className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none font-medium">
                  <option value="">Budget</option>
                  <option value="5000000">Up to ₹50 Lac</option>
                  <option value="10000000">Up to ₹1 Cr</option>
                  <option value="30000000">Up to ₹3 Cr</option>
                  <option value="50000000">Above ₹3 Cr</option>
                </select>
              </div>
              <Button onClick={handleSearch} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-xl shadow-lg"><Search className="mr-2 h-5 w-5" /> Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUSTED BRANDS ANIMATION (From Code 3) --- */}
      <section className="py-12 sm:py-16 relative w-full overflow-hidden bg-white -mt-10 z-20 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-b border-slate-100">
        <div className="w-full">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 sm:mb-12 text-center">
            Trusted by leading brands across India
          </h2>
          <div className="relative flex flex-col gap-8 sm:gap-12 overflow-hidden w-full">
            {/* First Row: Moving Left */}
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="flex gap-8 sm:gap-16 w-max"
            >
              {[...topRowLogos, ...topRowLogos, ...topRowLogos, ...topRowLogos].map((src, i) => (
                <div key={`top-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 sm:h-20 flex items-center justify-center">
                  <img src={src} alt={`Client logo ${i}`} className="max-w-full max-h-full object-contain filter brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </motion.div>

            {/* Second Row: Moving Right */}
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="flex gap-8 sm:gap-16 w-max"
            >
              {[...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos].map((src, i) => (
                <div key={`bottom-${i}`} className="flex-shrink-0 w-32 sm:w-48 h-16 sm:h-20 flex items-center justify-center">
                  <img src={src} alt={`Client logo ${i}`} className="max-w-full max-h-full object-contain filter brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </motion.div>
            
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* --- EXPLORE LOCALITIES (From Code 1) --- */}
      <section className="py-16 bg-white relative z-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Explore Localities</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Explore high-intent localities</h2>
              <p className="text-slate-500 mt-3 max-w-2xl">Jump straight into the corridors buyers and investors ask about most often.</p>
            </div>
            <Link to="/properties"><Button variant="outline" className="border-slate-300 font-bold">Browse all inventory <ChevronRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {exploreLocalities.map((item) => (
              <button key={item.name} onClick={() => navigate(createPropertySearch({ city: item.city, property_type: item.propertyType, category: 'buy' }))} className="text-left p-6 rounded-[1.75rem] bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all group">
                <p className="text-xs uppercase tracking-[0.25em] text-red-500 font-bold mb-3">{item.badge}</p>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-red-600">{item.name}</h3>
                <p className="text-slate-500 text-sm">View curated property options in {item.city}.</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED PROPERTIES (From Code 1 & 2) --- */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Featured inventory</p>
              <h2 className="text-3xl md:text-4xl font-black">Buy, sell, and rent with confidence</h2>
            </div>
            <Link to="/properties"><Button variant="outline">View all properties</Button></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} onClick={() => navigate(`/property/${property.id}`, { state: { property } })} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition cursor-pointer group">
                <div className="relative h-56 overflow-hidden">
                   <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-3">{property.category} • {property.propertyType}</p>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-red-600 transition-colors">{property.title}</h3>
                  <p className="text-slate-500 mb-3">{property.location}, {property.city}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className="font-black text-slate-900 text-lg">{property.price}</span>
                    <span className="text-red-600 font-bold flex items-center">View details <ArrowRight className="w-4 h-4 ml-2" /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY INDIA & EMI CALCULATOR (Combined Code 1 & 3) --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Why India</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6">Why buyers continue choosing India’s growth markets</h2>
            <p className="text-slate-600 text-lg leading-8 mb-8">Strong infrastructure pipelines, expanding business districts, and maturing social infrastructure continue to improve end-user demand and investment resilience. Trusted by thousands of buyers across India, ANK Realty simplifies the journey with verified inventory and human support.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                ['Verified listings', 'Property screening and lead qualification reduce wasted site visits.'],
                ['Local market guidance', 'Actionable help on pricing, ROI, and document readiness.'],
                ['Cross-category discovery', 'Explore residential, plotted, rental, and corporate inventory in one flow.'],
                ['Human support', 'Dedicated experts for search, loan guidance, and leasing support.'],
              ].map(([title, body]) => (
                <div key={title} className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
                  <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-7">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* EMI Calculator from Code 3 injected here for better utility than simple input form */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-slate-800 p-2.5 rounded-xl"><Calculator className="w-6 h-6 text-red-500" /></div>
              <div><h3 className="text-3xl font-black">Plan Your Investment</h3></div>
            </div>
            
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-slate-300">Loan Amount</span><span className="font-bold text-base text-white font-mono">₹{loanAmount.toLocaleString('en-IN')}</span></div>
                <input type="range" min="500000" max="50000000" step="100000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-slate-300">Interest Rate</span><span className="font-bold text-base text-white font-mono">{interestRate}%</span></div>
                <input type="range" min="5" max="15" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-slate-300">Loan Tenure</span><span className="font-bold text-base text-white font-mono">{loanTenure} Years</span></div>
                <input type="range" min="1" max="30" step="1" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700 text-center mb-6">
              <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Your Monthly EMI</p>
              <p className="text-4xl font-black text-red-500 font-mono">₹{emiResult.emi.toLocaleString('en-IN')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input value={loanLead.name} onChange={(e) => setLoanLead((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your name" className="bg-white/10 text-white border-white/20 h-12" />
              <Input value={loanLead.phone} onChange={(e) => setLoanLead((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="bg-white/10 text-white border-white/20 h-12" />
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Button onClick={handleLoanLead} className="bg-red-600 hover:bg-red-700 h-12 flex-1 font-bold text-base">Request loan callback</Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUICK CATEGORIES (From Code 1) --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { title: 'Builders', body: 'Explore developer-backed launches and compare price bands.', to: '/buy', icon: Building2 },
            { title: 'Agents', body: 'Connect with ANK experts for guided tours and negotiation support.', to: '/contact', icon: Users },
            { title: 'Corporate Leasing', body: 'Find office, retail, and relocation solutions for your team.', to: '/corporate-leasing', icon: Briefcase },
          ].map((item) => (
            <Link key={item.title} to={item.to} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all">
              <item.icon className="w-8 h-8 text-red-600 mb-5" />
              <h3 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 mb-4">{item.body}</p>
              <span className="font-bold text-red-600 flex items-center">Open <ArrowRight className="w-4 h-4 ml-2" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- NEWS & INSIGHTS (From Code 1 & 2) --- */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">News & Insights</p>
              <h2 className="text-3xl md:text-4xl font-black">Dynamic content blocks for buyers, sellers, and investors</h2>
            </div>
            <Link to="/blog"><Button variant="outline">Open resource center</Button></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {newsArticles.map((article) => (
              <Link key={article.id} to="/blog" className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <div className="h-52 overflow-hidden">
                   <img src={article.image} alt={article.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-red-500 font-bold mb-3">{article.category}</p>
                  <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-red-600 transition-colors">{article.title}</h3>
                  <p className="text-slate-500 text-sm leading-7 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="text-sm text-slate-400 font-medium flex items-center justify-between">
                    <span>{article.date} • {article.readTime}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER SECTION (From Code 1) --- */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Bell className="w-14 h-14 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black mb-4">Never Miss a Property Deal</h2>
          <p className="text-slate-400 text-lg mb-10">Get pre-launch alerts, price updates, and curated property matches on email and WhatsApp.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 h-14 rounded-xl px-5 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-red-500" />
            <Button onClick={handleNewsletter} className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg">Subscribe</Button>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><Button variant="outline" className="h-14 border-white/20 text-white hover:bg-white/10"><MessageCircle className="w-4 h-4 mr-2" /> WhatsApp</Button></a>
          </div>
        </div>
      </section>

      {/* --- FOOTER (From Code 1) --- */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t-[8px] border-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-3xl font-extrabold tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support.</p>
              <div className="flex space-x-4 pt-2">
                {socialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon] || Handshake;
                  return <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer"><Icon className="w-4 h-4" /></a>;
                })}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/properties" className="hover:text-red-500">All Properties</Link></li>
                <li><Link to="/about" className="hover:text-red-500">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-red-500">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-red-500">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/properties?property_type=plot" className="hover:text-red-500">Premium Plots</Link></li>
                <li><Link to="/buy" className="hover:text-red-500">Residential Properties</Link></li>
                <li><Link to="/properties?property_type=commercial" className="hover:text-red-500">Commercial Spaces</Link></li>
                <li><Link to="/rent" className="hover:text-red-500">Rental Homes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-5 text-slate-400 font-medium text-sm">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-500 shrink-0" /> Tapasya Corp Heights, Noida, UP 201301</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-500 shrink-0" /> info@ankrealty.com</p>
                <p className="flex items-center"><MessageCircle className="w-5 h-5 mr-3 text-red-500 shrink-0" /> WhatsApp support available</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-300">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* --- FLOATING CHATBOT (From Code 3) --- */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
            <div className="bg-slate-900 text-white p-4 font-bold flex justify-between items-center shadow-md relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                ANK AI Assistant
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-slate-700 p-1 rounded-md transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="p-4 flex-1 bg-slate-50 flex flex-col gap-3 h-[380px] overflow-y-auto">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                   <Building2 className="w-4 h-4 text-red-600"/>
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm border border-slate-100 text-slate-700">
                  Welcome to ANK Realty! I am your virtual assistant. Please choose a subject below so I can assist you better:
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-2 pl-10">
                {[
                  "Schedule a Visit", "Price Details & Negotiation", "Legal Verification Check",
                  "Home Loan Options", "Property Locations & Tours", "Connect with an Agent"
                ].map((subject, i) => (
                  <button key={i} className="text-left bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 p-2.5 rounded-xl text-sm font-medium transition-all border border-slate-200 hover:border-red-200 shadow-sm">
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-red-400" />
              <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsChatOpen(true)} 
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
          >
            <MessageSquare className="w-7 h-7" />
            <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Chat with us!
            </span>
          </button>
        )}
      </div>

    </div>
  );
}
