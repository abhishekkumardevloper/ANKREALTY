import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Banknote, Bell, Briefcase, Building2, Calculator, ChevronRight, 
  Instagram, Linkedin, Mail, MapPin, MessageCircle, Search, Users, Youtube, ShieldCheck 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Import your real property data
import resaleListings from '../lib/resaleListings';

// --- INLINED DATA TO PREVENT CRASHES ---
const WHATSAPP_URL = "https://wa.me/919876543210";

const exploreLocalities = [
  { name: 'Sector 150', city: 'Noida', propertyType: 'apartment', badge: 'Sports City', image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80' },
  { name: 'Sector 45', city: 'Noida', propertyType: 'apartment', badge: 'Premium', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' },
  { name: 'Tech Zone 4', city: 'Greater Noida', propertyType: 'villa', badge: 'IT Hub', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
  { name: 'Sector 129', city: 'Noida', propertyType: 'commercial', badge: 'Commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
  { name: 'Sector 10', city: 'Noida Ext', propertyType: 'plot', badge: 'Investment', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' },
];

const newsArticles = [
  { id: 1, title: 'Noida Airport fuels real estate boom in Yamuna Expressway', category: 'Market Trend', excerpt: 'Property rates near the upcoming Jewar airport have seen a 20% appreciation in the last two quarters.', date: 'Oct 12, 2025', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80' },
  { id: 2, title: 'Top 5 reasons to invest in Commercial real estate this year', category: 'Investment', excerpt: 'With high street retail and premium office spaces showing robust rental yields, investors are shifting focus.', date: 'Oct 08, 2025', readTime: '7 min read', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { id: 3, title: 'How RERA has changed the home buying experience', category: 'Guide', excerpt: 'A comprehensive look at how regulatory frameworks are protecting home buyers from project delays.', date: 'Sep 28, 2025', readTime: '4 min read', image: 'https://images.unsplash.com/photo-1556800045-89b531dc1b76?w=800&q=80' }
];

const bankOffers = [
  { bank: 'HDFC Bank', rate: '8.35%', note: 'Zero processing fee for premium projects' },
  { bank: 'SBI Home Loans', rate: '8.40%', note: 'Special rates for women co-applicants' }
];

const categoryOptions = [
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
];

const propertyTypeOptions = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Plot', value: 'plot' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ category: 'buy', city: '', property_type: '', max_price: '' });
  const [searchFocused, setSearchFocused] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });

  // Filter local suggestions based on city input
  const suggestions = useMemo(() => {
    const query = search.city.trim().toLowerCase();
    if (!query) return exploreLocalities;
    return exploreLocalities.filter((item) => item.name.toLowerCase().includes(query) || item.city.toLowerCase().includes(query));
  }, [search.city]);

  // Grab the first 8 real listings to display
  const featuredProperties = resaleListings.slice(0, 8);

  const handleSearch = () => {
    // Route to correct page based on category
    const basePath = search.category === 'rent' ? '/rent' : '/buy';
    const params = new URLSearchParams();
    if (search.city) params.append('city', search.city);
    if (search.property_type) params.append('property_type', search.property_type);
    if (search.max_price) params.append('max_price', search.max_price);
    navigate(`${basePath}?${params.toString()}`);
  };
  
  const handleNewsletter = () => {
    if (!newsletterEmail.includes('@')) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ANK Realty, subscribe me. Email: ${newsletterEmail}.`)}`, '_blank', 'noopener,noreferrer');
  };
  
  const handleLoanLead = () => {
    if (!loanLead.name || loanLead.phone.length < 10) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ANK Realty, I want a loan callback. Name: ${loanLead.name}, Phone: ${loanLead.phone}.`)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-200 relative">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-32 px-4 md:px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/90 z-10" />
        
        <div className="relative z-20 max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-5 py-2 rounded-full border border-red-500/30 bg-red-500/20 backdrop-blur-md text-red-100 text-xs font-bold tracking-widest uppercase shadow-lg shadow-red-500/10">
            India's Premium Real Estate Network
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl">
            Find the property that <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">defines your future</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Search verified homes, plotted developments, and premium rentals across Delhi NCR with a seamless, zero-hassle experience.
          </p>

          {/* Glassmorphism Search Bar */}
          <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-3 md:p-4 max-w-5xl mx-auto border border-white/20 text-left transition-all duration-300 hover:bg-white/20">
            <div className="flex flex-wrap gap-2 mb-4 px-4 pt-2">
              {categoryOptions.map((cat) => (
                <button 
                  key={cat.value} 
                  onClick={() => setSearch((prev) => ({ ...prev, category: cat.value }))} 
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${search.category === cat.value ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-200 hover:bg-white/10'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-2 grid grid-cols-1 md:grid-cols-4 gap-2 relative shadow-inner">
              
              {/* City Input */}
              <div className="relative md:border-r md:border-slate-100 bg-slate-50 rounded-2xl md:rounded-none md:bg-transparent">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <Input 
                  value={search.city} 
                  onChange={(e) => setSearch((prev) => ({ ...prev, city: e.target.value }))} 
                  onFocus={() => setSearchFocused(true)} 
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)} 
                  placeholder="City or sector..." 
                  className="h-14 pl-12 bg-transparent border-0 shadow-none focus-visible:ring-0 text-slate-900 font-bold placeholder:font-normal" 
                />
                
                {/* Search Suggestions Dropdown */}
                {searchFocused && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50">
                    {suggestions.slice(0, 5).map((item) => (
                      <button 
                        key={item.name} 
                        onClick={() => { setSearch((prev) => ({ ...prev, city: item.name, property_type: item.propertyType })); setSearchFocused(false); }} 
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 flex justify-between items-center transition-colors"
                      >
                        <span className="font-bold text-slate-900">{item.name}</span>
                        <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">{item.badge}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Type Select */}
              <div className="relative md:border-r md:border-slate-100 bg-slate-50 rounded-2xl md:rounded-none md:bg-transparent">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <select 
                  value={search.property_type} 
                  onChange={(e) => setSearch((prev) => ({ ...prev, property_type: e.target.value }))} 
                  className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-900 font-bold appearance-none outline-none cursor-pointer"
                >
                  <option value="" className="font-normal">Property Type</option>
                  {propertyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>

              {/* Budget Select */}
              <div className="relative bg-slate-50 rounded-2xl md:rounded-none md:bg-transparent">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <select 
                  value={search.max_price} 
                  onChange={(e) => setSearch((prev) => ({ ...prev, max_price: e.target.value }))} 
                  className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-900 font-bold appearance-none outline-none cursor-pointer"
                >
                  <option value="" className="font-normal">Max Budget</option>
                  <option value="5000000">Up to ₹50 Lac</option>
                  <option value="10000000">Up to ₹1 Cr</option>
                  <option value="30000000">Up to ₹3 Cr</option>
                  <option value="50000000">Above ₹3 Cr</option>
                </select>
              </div>

              <Button onClick={handleSearch} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]">
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPLORE LOCALITIES --- */}
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
            {exploreLocalities.map((item) => (
              <button 
                key={item.name} 
                onClick={() => navigate(`/buy?city=${item.name}&property_type=${item.propertyType}`)} 
                className="text-left rounded-3xl overflow-hidden relative h-72 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="absolute inset-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 flex flex-col justify-end">
                  <p className="text-[10px] uppercase tracking-[0.25em] bg-red-600 text-white px-3 py-1.5 rounded-lg w-fit font-bold mb-3 shadow-md">
                    {item.badge}
                  </p>
                  <h3 className="text-2xl font-black text-white mb-1 group-hover:text-red-400 transition-colors">{item.name}</h3>
                  <p className="text-slate-300 text-sm font-medium">{item.city}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED INVENTORY (Pulling from real data) --- */}
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
                onClick={() => navigate(`/property/${property.id}`, { state: { property } })} 
                className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-red-200 transition-all duration-300 cursor-pointer relative group flex flex-col"
              >
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-black text-slate-900 shadow-lg z-10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Verified
                </div>
                
                <div className="relative h-56 overflow-hidden p-2 pb-0">
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
                    {property.category} • {property.property_type}
                  </p>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">{property.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex items-center"><MapPin className="w-4 h-4 mr-1 text-slate-400"/> {property.location}, {property.city}</p>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Price</p>
                      <span className="font-black text-slate-900 text-xl">
                        {property.price > 0 ? `₹${(property.price / 10000000).toFixed(2)} Cr` : 'On Request'}
                      </span>
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

      {/* --- WHY INDIA & LOAN FORM --- */}
      <section className="py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Investment Perspective</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Why buyers continue choosing India’s growth markets</h2>
            <p className="text-slate-600 text-lg leading-8 mb-10">Strong infrastructure pipelines, expanding business districts, and maturing social infrastructure continue to improve end-user demand and investment resilience. Trusted by thousands of buyers, ANK Realty simplifies the journey.</p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                ['Verified listings', 'Property screening and lead qualification reduce wasted site visits.'],
                ['Local market guidance', 'Actionable help on pricing, ROI, and document readiness.'],
                ['Cross-category discovery', 'Explore residential, plotted, rental, and corporate inventory.'],
                ['Human support', 'Dedicated experts for search, loan guidance, and leasing support.'],
              ].map(([title, body]) => (
                <div key={title} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors">
                  <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-6">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30">
                  <Calculator className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-black">Home Loan Assist</h3>
              </div>
              
              <div className="space-y-4 mb-10">
                {bankOffers.map((offer) => (
                  <div key={offer.bank} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="font-black text-lg">{offer.bank}</p>
                      <p className="text-slate-400 text-sm mt-1">{offer.note}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-black text-xl">{offer.rate}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Starting Rate</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Input value={loanLead.name} onChange={(e) => setLoanLead((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your full name" className="bg-white/10 border-white/20 text-white placeholder-slate-400 h-14 rounded-xl focus:border-red-500" />
                <Input value={loanLead.phone} onChange={(e) => setLoanLead((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="bg-white/10 border-white/20 text-white placeholder-slate-400 h-14 rounded-xl focus:border-red-500" />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleLoanLead} className="bg-red-600 hover:bg-red-700 h-14 rounded-xl text-base px-8 shadow-lg shadow-red-600/30 w-full sm:w-auto font-bold">Request Callback</Button>
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
            {newsArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <div className="h-56 overflow-hidden relative p-2 pb-0">
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <img src={article.image} alt={article.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-red-600 font-bold mb-3 bg-red-50 px-2 py-1 rounded w-fit">{article.category}</p>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-red-600 transition-colors">{article.title}</h3>
                  <p className="text-slate-500 text-sm leading-6 mb-6 line-clamp-3">{article.excerpt}</p>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{article.date} • {article.readTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- QUICK LINKS --- */}
      <section className="py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: 'Builders', body: 'Explore developer-backed launches and compare price bands.', to: '/buy', icon: Building2 },
            { title: 'Agents', body: 'Connect with ANK experts for guided tours and negotiation support.', to: '/contact', icon: Users },
            { title: 'Corporate Leasing', body: 'Find office, retail, and relocation solutions for your team.', to: '/rent', icon: Briefcase },
          ].map((item) => (
            <Link key={item.title} to={item.to} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed text-lg">{item.body}</p>
              <span className="font-black text-red-600 flex items-center">Get Started <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" /></span>
            </Link>
          ))}
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
              <p className="text-slate-400 text-sm leading-loose font-medium">Premium property discovery, verified advisory, corporate leasing help, and owner-first listing support.</p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all"><Youtube className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest">Quick Links</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/rent" className="hover:text-red-500 transition-colors">Rent Property</Link></li>
                <li><Link to="/sell" className="hover:text-red-500 transition-colors">Sell Property</Link></li>
                <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-8 text-white uppercase tracking-widest">Categories</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Premium Plots</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Residential Properties</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Commercial Spaces</Link></li>
                <li><Link to="/rent" className="hover:text-red-500 transition-colors">Rental Homes</Link></li>
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
