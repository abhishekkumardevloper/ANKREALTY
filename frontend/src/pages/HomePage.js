import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Banknote, Bell, Briefcase, Building2, Calculator, ChevronRight, 
  Instagram, Linkedin, Mail, MapPin, MessageCircle, Search, Users, Youtube, ShieldCheck, TrendingUp 
} from 'lucide-react';
import Navbar from '../components/Navbar';

// --- INLINED DATA (To completely prevent White Screen crashes) ---
const WHATSAPP_URL = "https://wa.me/919876543210";

const exploreLocalities = [
  { name: 'Sector 150', city: 'Noida', propertyType: 'apartment', badge: 'Sports City', image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80' },
  { name: 'Sector 45', city: 'Noida', propertyType: 'apartment', badge: 'Premium', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' },
  { name: 'Tech Zone 4', city: 'Greater Noida', propertyType: 'villa', badge: 'IT Hub', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
  { name: 'Sector 129', city: 'Noida', propertyType: 'commercial', badge: 'Commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
  { name: 'Sector 10', city: 'Noida Ext', propertyType: 'plot', badge: 'Investment', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' },
];

const featuredProperties = [
  { id: 'f1', title: 'Experion Saatori', location: 'Sector 151', city: 'Noida', type: 'Apartment', category: 'Sale', price: 18500000, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
  { id: 'gw3', title: 'VVIP Addresses', location: 'Sector 12', city: 'Greater Noida West', type: 'Villa', category: 'Sale', price: 10500000, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
  { id: 'p1', title: 'Bajrang Vatika', location: 'Sector 10', city: 'Noida Extension', type: 'Plot', category: 'Sale', price: 4500000, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' },
  { id: 'r1', title: 'Supertech Supernova', location: 'Sector 94', city: 'Noida', type: 'Apartment', category: 'Rent', price: 45000, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80' },
];

const newsArticles = [
  { id: 1, title: 'Noida Airport fuels real estate boom in Yamuna Expressway', category: 'Market Trend', excerpt: 'Property rates near the upcoming Jewar airport have seen a 20% appreciation in the last two quarters.', date: 'Oct 12, 2025', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80' },
  { id: 2, title: 'Top 5 reasons to invest in Commercial real estate this year', category: 'Investment', excerpt: 'With high street retail and premium office spaces showing robust rental yields, investors are shifting focus.', date: 'Oct 08, 2025', readTime: '7 min read', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { id: 3, title: 'How RERA has changed the home buying experience', category: 'Guide', excerpt: 'A comprehensive look at how regulatory frameworks are protecting home buyers from project delays.', date: 'Sep 28, 2025', readTime: '4 min read', image: 'https://images.unsplash.com/photo-1556800045-89b531dc1b76?w=800&q=80' }
];

export default function HomePage() {
  const navigate = useNavigate();
  
  // --- Search Bar State ---
  const [search, setSearch] = useState({ category: 'buy', city: '', property_type: '', max_price: '' });
  const [searchFocused, setSearchFocused] = useState(false);
  
  // --- EMI Calculator State ---
  const [loanAmt, setLoanAmt] = useState(5000000);
  const [intRate, setIntRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  // Suggestions Logic
  const suggestions = useMemo(() => {
    const query = search.city.trim().toLowerCase();
    if (!query) return exploreLocalities;
    return exploreLocalities.filter((item) => item.name.toLowerCase().includes(query) || item.city.toLowerCase().includes(query));
  }, [search.city]);

  // Handle Dynamic Search Routing
  const handleSearch = () => {
    const basePath = search.category === 'rent' ? '/rent' : '/buy';
    const params = new URLSearchParams();
    if (search.city) params.append('city', search.city);
    if (search.property_type) params.append('property_type', search.property_type);
    if (search.max_price) params.append('max_price', search.max_price);
    navigate(`${basePath}?${params.toString()}`);
  };

  // EMI Calculation Logic
  const calculateEMI = () => {
    const p = loanAmt;
    const r = intRate / 12 / 100;
    const n = tenure * 12;
    if (p > 0 && r > 0 && n > 0) {
      return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-200 relative">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-32 px-4 md:px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Background */}
        <div 
          className="absolute inset-0 z-0 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/95 z-10" />
        
        <div className="relative z-20 max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-5 py-2 rounded-full border border-red-500/30 bg-red-500/20 backdrop-blur-md text-red-100 text-xs font-bold tracking-widest uppercase shadow-lg">
            India's Premium Real Estate Portfolio
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl">
            Find the property that <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">defines your future</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover verified luxury homes, high-yield plots, and premium corporate spaces across Delhi NCR.
          </p>

          {/* WORKING ELEMENT 1: Advanced Interactive Search Bar */}
          <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-3 md:p-4 max-w-5xl mx-auto border border-white/20 text-left">
            <div className="flex flex-wrap gap-2 mb-4 px-4 pt-2">
              <button onClick={() => setSearch((prev) => ({ ...prev, category: 'buy' }))} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${search.category === 'buy' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-200 hover:bg-white/10'}`}>Buy</button>
              <button onClick={() => setSearch((prev) => ({ ...prev, category: 'rent' }))} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${search.category === 'rent' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-200 hover:bg-white/10'}`}>Rent</button>
            </div>

            <div className="bg-white rounded-3xl p-2 grid grid-cols-1 md:grid-cols-4 gap-2 relative shadow-inner">
              
              <div className="relative md:border-r md:border-slate-100 bg-slate-50 rounded-2xl md:rounded-none md:bg-transparent">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <input 
                  type="text"
                  value={search.city} 
                  onChange={(e) => setSearch((prev) => ({ ...prev, city: e.target.value }))} 
                  onFocus={() => setSearchFocused(true)} 
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)} 
                  placeholder="City or locality..." 
                  className="h-14 pl-12 w-full bg-transparent border-0 outline-none text-slate-900 font-bold placeholder:font-normal" 
                />
                
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

              <div className="relative md:border-r md:border-slate-100 bg-slate-50 rounded-2xl md:rounded-none md:bg-transparent">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <select 
                  value={search.property_type} 
                  onChange={(e) => setSearch((prev) => ({ ...prev, property_type: e.target.value }))} 
                  className="h-14 pl-12 pr-4 bg-transparent border-0 w-full text-slate-900 font-bold appearance-none outline-none cursor-pointer"
                >
                  <option value="" className="font-normal">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot / Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

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
                  <option value="100000000">Above ₹3 Cr</option>
                </select>
              </div>

              <button onClick={handleSearch} className="w-full h-14 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-lg transition-all hover:scale-[1.02]">
                <Search className="mr-2 h-5 w-5" /> Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED INVENTORY --- */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Curated Portfolio</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Handpicked Properties</h2>
            </div>
            <Link to="/buy">
              <button className="border border-slate-300 font-bold h-12 rounded-xl px-6 hover:bg-white bg-transparent transition-colors">
                View All Listings
              </button>
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
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Verified
                </div>
                
                <div className="relative h-56 overflow-hidden p-2 pb-0">
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <img src={property.image} alt={property.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
                    {property.category} • {property.type}
                  </p>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">{property.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex items-center"><MapPin className="w-4 h-4 mr-1 text-slate-400"/> {property.location}, {property.city}</p>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Price</p>
                      <span className="font-black text-slate-900 text-xl">
                        {property.category === 'Rent' 
                          ? `₹${property.price.toLocaleString('en-IN')}/mo` 
                          : `₹${(property.price / 10000000).toFixed(2)} Cr`}
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

      {/* --- WORKING ELEMENT 2: INTERACTIVE EMI CALCULATOR --- */}
      <section className="py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3">Financial Planning</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Calculate your investment instantly</h2>
            <p className="text-slate-600 text-lg leading-8 mb-10">
              Planning to buy your dream home? Use our interactive calculator to estimate your monthly EMI. Adjust the loan amount, interest rate, and tenure to see how it fits into your financial goals.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                ['Lowest Interest Rates', 'Compare offers from top banks starting at 8.35% p.a.'],
                ['Zero Hidden Fees', 'Transparent processing with no surprise charges at the end.'],
              ].map(([title, body]) => (
                <div key={title} className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
                  <h3 className="font-black text-slate-900 mb-2 flex items-center"><TrendingUp className="w-4 h-4 text-red-500 mr-2"/> {title}</h3>
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
              
              {/* Live Display */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 mb-8 text-center">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Estimated Monthly EMI</p>
                <p className="text-5xl font-black text-red-500 font-mono">
                  ₹{calculateEMI().toLocaleString('en-IN')}<span className="text-xl text-slate-400 font-sans font-medium"> /mo</span>
                </p>
              </div>

              {/* Interactive Sliders */}
              <div className="space-y-6 bg-white rounded-3xl p-6 shadow-inner text-slate-900">
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
            </div>
          </div>
        </div>
      </section>

      {/* --- QUICK LINKS --- */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: 'Buy a Property', body: 'Explore verified developer launches and premium resale options.', to: '/buy', icon: Building2 },
            { title: 'Rent a Space', body: 'Find ready-to-move luxury apartments and villas easily.', to: '/rent', icon: Home },
            { title: 'Corporate Solutions', body: 'Strategic retail and office spaces for growing businesses.', to: '/buy?property_type=commercial', icon: Briefcase },
          ].map((item) => (
            <Link key={item.title} to={item.to} className="p-10 rounded-[2.5rem] bg-white border border-slate-200 hover:border-red-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                <item.icon className="w-8 h-8 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed text-lg">{item.body}</p>
              <span className="font-black text-red-600 flex items-center">Explore <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" /></span>
            </Link>
          ))}
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
