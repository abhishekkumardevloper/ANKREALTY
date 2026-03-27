import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Banknote, Bell, Briefcase, Building2, Calculator, ChevronRight, 
  Handshake, Instagram, Linkedin, Mail, MapPin, MessageCircle, Search, Users, Youtube 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RegisterPopup from './RegisterPopup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bankOffers, newsArticles, socialLinks } from '@/lib/siteData';
import { WHATSAPP_URL, createPropertySearch } from '@/lib/api';

// Pulling in our real data so featured properties match the rest of the app
import resaleListings from '../lib/resaleListings';

// --- ENRICHED LOCALITIES WITH IMAGES ---
const exploreLocalities = [
  { name: 'Sector 150', city: 'Noida', propertyType: 'apartment', badge: 'Sports City', image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80' },
  { name: 'Sector 45', city: 'Noida', propertyType: 'apartment', badge: 'Premium', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' },
  { name: 'Tech Zone 4', city: 'Greater Noida', propertyType: 'villa', badge: 'IT Hub', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
  { name: 'Sector 129', city: 'Noida', propertyType: 'commercial', badge: 'Commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
  { name: 'Sector 10', city: 'Noida Ext', propertyType: 'plot', badge: 'Investment', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' },
];

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
  instagram: <Instagram className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  whatsapp: <MessageCircle className="w-4 h-4" />,
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

  // Grab the first 8 listings from our real data to display as featured
  const featuredProperties = resaleListings.slice(0, 8);

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

      {/* --- TRUSTED BRANDS ANIMATION --- */}
      <section className="py-12 sm:py-16 relative w-full overflow-hidden bg-white -mt-10 z-20 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-b border-slate-100">
        <div className="w-full">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 sm:mb-12 text-center">
            Trusted by leading brands across India
          </h2>
          <div className="relative flex flex-col gap-8 sm:gap-12 overflow-hidden w-full">
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

      {/* --- EXPLORE LOCALITIES (WITH IMAGES) --- */}
      <section className="py-20 bg-white relative z-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Explore Localities</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Explore high-intent localities</h2>
              <p className="text-slate-500 mt-3 max-w-2xl">Jump straight into the corridors buyers and investors ask about most often.</p>
            </div>
            <Link to="/buy"><Button variant="outline" className="border-slate-300 font-bold">Browse all inventory <ChevronRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {exploreLocalities.map((item) => (
              <button 
                key={item.name} 
                onClick={() => navigate(createPropertySearch({ city: item.city, property_type: item.propertyType, category: 'buy' }))} 
                className="text-left rounded-[1.75rem] overflow-hidden relative h-64 hover:-translate-y-2 transition-transform duration-300 group"
              >
                <div className="absolute inset-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-6 flex flex-col justify-end">
                  <p className="text-[10px] uppercase tracking-[0.25em] bg-red-600 text-white px-2 py-1 rounded w-fit font-bold mb-2 shadow-sm">{item.badge}</p>
                  <h3 className="text-xl font-black text-white mb-1 group-hover:text-red-400 transition-colors">{item.name}</h3>
                  <p className="text-slate-300 text-xs font-medium">{item.city}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED INVENTORY (Mapped to Real Data) --- */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Featured inventory</p>
              <h2 className="text-3xl md:text-4xl font-black">Buy, sell, and rent with confidence</h2>
            </div>
            <Link to="/buy"><Button variant="outline">View all properties</Button></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <div 
                key={property.id} 
                onClick={() => navigate(`/property/${property.id}`, { state: { property } })} 
                className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition cursor-pointer relative group flex flex-col"
              >
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-900 shadow-sm z-10 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-600" /> Verified
                </div>
                
                <div className="relative h-48 overflow-hidden">
                   <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 bg-slate-100 px-2 py-0.5 rounded w-fit">
                    {property.category} • {property.property_type}
                  </p>
                  <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1">{property.title}</h3>
                  <p className="text-slate-500 text-sm mb-4"><MapPin className="inline w-3 h-3 mr-1"/> {property.location}, {property.city}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <span className="font-black text-slate-900 text-lg">
                      {property.price > 0 ? `₹${(property.price / 10000000).toFixed(2)} Cr` : 'On Request'}
                    </span>
                    <span className="text-red-600 font-bold flex items-center text-sm bg-red-50 px-2 py-1 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                      View <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY INDIA & LOAN FORM --- */}
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
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8"><Calculator className="w-7 h-7 text-red-500" /><h3 className="text-3xl font-black">Apply Loan</h3></div>
            <div className="space-y-4 mb-8">
              {bankOffers.map((offer) => (
                <div key={offer.bank} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-lg">{offer.bank}</p>
                    <p className="text-slate-300 text-sm">{offer.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-black">{offer.rate}</p>
                    <p className="text-xs text-slate-400">Indicative rate</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input value={loanLead.name} onChange={(e) => setLoanLead((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your name" className="bg-white text-slate-900 h-12 rounded-xl" />
              <Input value={loanLead.phone} onChange={(e) => setLoanLead((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="bg-white text-slate-900 h-12 rounded-xl" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleLoanLead} className="bg-red-600 hover:bg-red-700 h-12 rounded-xl text-base px-6">Request callback</Button>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><Button variant="outline" className="h-12 border-white/20 text-slate-900 hover:bg-white/10 hover:text-white rounded-xl px-6">Contact on WhatsApp</Button></a>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEWS & INSIGHTS --- */}
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
              <Link key={article.id} to="/blog" className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                <img src={article.image} alt={article.title} className="h-52 w-full object-cover" />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-red-500 font-bold mb-3">{article.category}</p>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{article.title}</h3>
                  <p className="text-slate-500 text-sm leading-7 mb-4">{article.excerpt}</p>
                  <div className="text-sm text-slate-400">{article.date} • {article.readTime}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORIES & QUICK LINKS --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { title: 'Builders', body: 'Explore developer-backed launches and compare price bands.', to: '/buy', icon: Building2 },
            { title: 'Agents', body: 'Connect with ANK experts for guided tours and negotiation support.', to: '/contact', icon: Users },
            { title: 'Corporate Leasing', body: 'Find office, retail, and relocation solutions for your team.', to: '/buy', icon: Briefcase },
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

      {/* --- NEWSLETTER CTA --- */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Bell className="w-14 h-14 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black mb-4">Never Miss a Property Deal</h2>
          <p className="text-slate-400 text-lg mb-10">Get pre-launch alerts, price updates, and curated property matches on email and WhatsApp.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 h-14 rounded-xl px-5 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-red-500" />
            <Button onClick={handleNewsletter} className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg">Subscribe</Button>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><Button variant="outline" className="h-14 border-white/20 text-slate-900 hover:bg-white/10 hover:text-white rounded-xl"><MessageCircle className="w-4 h-4 mr-2" /> WhatsApp</Button></a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t-[8px] border-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-3xl font-extrabold tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support.</p>
              <div className="flex space-x-4 pt-2">
                {socialLinks.map((link) => {
                  return <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer">{socialIconMap[link.icon]}</a>;
                })}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500">Buy Property</Link></li>
                <li><Link to="/rent" className="hover:text-red-500">Rent Property</Link></li>
                <li><Link to="/sell" className="hover:text-red-500">Sell Property</Link></li>
                <li><Link to="/contact" className="hover:text-red-500">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500">Premium Plots</Link></li>
                <li><Link to="/buy" className="hover:text-red-500">Residential Properties</Link></li>
                <li><Link to="/buy" className="hover:text-red-500">Commercial Spaces</Link></li>
                <li><Link to="/rent" className="hover:text-red-500">Rental Homes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-5 text-slate-400 font-medium text-sm">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-500 shrink-0" /> Sector 25, Noida, UP 201301</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-500 shrink-0" /> support@ankrealty.com</p>
                <p className="flex items-center"><Phone className="w-5 h-5 mr-3 text-red-500 shrink-0" /> Toll Free: 1800-123-4567</p>
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
    </div>
  );
}
