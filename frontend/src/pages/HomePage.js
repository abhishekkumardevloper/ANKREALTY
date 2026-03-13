import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Home, Heart, ArrowRight, Star, 
  Building, CheckCircle, Key, FileText, Loader2, Mail, 
  TrendingUp, Calculator, Shield, BookOpen, Phone,
  ChevronRight, Map, Banknote
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// API Configuration
const API_URL = 'http://127.0.0.1:8000/api/properties';

// Helper to assign high-quality placeholder images if backend has no images
const getPlaceholderImage = (type, id) => {
  const images = {
    buy: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"],
    rent: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?auto=format&fit=crop&w=800&q=80"],
    sell: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"]
  };
  const safeType = type ? type.toLowerCase() : 'buy';
  const list = images[safeType] || images.buy;
  const index = id ? String(id).charCodeAt(0) % list.length : 0;
  return list[index];
};

// --- MOCK DATA FOR CONTENT FILLERS ---
const trendingCities = [
 { name: "Mumbai", image: "/download (1).jpeg", props: "1,200+" },
 { name: "Bangalore", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80", props: "3,400+" },
 { name: "Delhi NCR", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80", props: "2,800+" },
 { name: "Pune", image: "/images (3).jpeg", props: "1,900+" },
 { name: "Hyderabad", image: "/images (4).jpeg", props: "2,100+" },
];

const topCollections = [
  { title: "Premium Villas", desc: "Luxury living at its best", icon: Home, count: "450+ Options" },
  { title: "Commercial Spaces", desc: "For your growing business", icon: Building, count: "800+ Options" },
  { title: "Plots & Land", desc: "Build your dream home", icon: Map, count: "1,200+ Options" },
  { title: "Ready to Move", desc: "Shift immediately", icon: Key, count: "3,000+ Options" },
];

const articles = [
  { title: "Real Estate Trends 2026: Where to Invest?", date: "March 5, 2026", category: "Investment" },
  { title: "5 Things to Check Before Buying a Plot", date: "March 2, 2026", category: "Guide" },
  { title: "Home Loan Interest Rates Compared", date: "Feb 28, 2026", category: "Finance" }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchCategory, setSearchCategory] = useState('buy');
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  
  // --- EMI CALCULATOR STATE & LOGIC ---
  const [loanAmount, setLoanAmount] = useState(5000000); // Default 50 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // Default 8.5%
  const [loanTenure, setLoanTenure] = useState(20); // Default 20 Years
  const [emiResult, setEmiResult] = useState({ emi: 0, totalInterest: 0, totalPayment: 0 });

  useEffect(() => {
    // Standard EMI Calculation Formula: P x R x (1+R)^N / [(1+R)^N-1]
    const p = loanAmount;
    const r = interestRate / 12 / 100; // Monthly interest rate
    const n = loanTenure * 12; // Tenure in months

    if (p > 0 && r > 0 && n > 0) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;
      
      setEmiResult({
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment)
      });
    } else {
      setEmiResult({ emi: 0, totalInterest: 0, totalPayment: 0 });
    }
  }, [loanAmount, interestRate, loanTenure]);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const activeProps = Array.isArray(response.data) 
          ? response.data.filter(p => p.status?.toLowerCase() === 'approved' || p.status?.toLowerCase() === 'active') 
          : [];
        setProperties(activeProps);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProperties = properties.slice(0, 3);
  const buyProperties = properties.filter(p => (p.category || p.type)?.toLowerCase() === 'buy').slice(0, 4);
  const rentProperties = properties.filter(p => (p.category || p.type)?.toLowerCase() === 'rent').slice(0, 4);

  const handleSearch = () => {
    navigate(`/${searchCategory}?city=${searchLocation}&type=${propertyType}`);
  };

  // REUSABLE PROPERTY GRID (UPGRADED DESIGN WITH NAVIGATION)
  const PropertyGrid = ({ title, subtitle, items, linkTo }) => (
    <section className="py-16 px-6 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">{title}</h2>
            <p className="text-lg text-slate-500">{subtitle}</p>
          </div>
          <Link to={linkTo} className="hidden md:flex items-center text-red-600 font-bold hover:text-red-700 transition-colors group mt-4 md:mt-0 bg-red-50 px-6 py-2.5 rounded-full">
            Explore All <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-red-600" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-4"/>
            <p className="text-slate-500 font-medium text-lg">New properties coming soon to this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {items.map((property) => {
              // Extract real cover image from backend if it exists, otherwise use placeholder
              const coverImage = property.images && property.images.length > 0 
                ? property.images[0] 
                : property.imageUrl || getPlaceholderImage(property.category || property.type, property.id);

              return (
                <div 
                  key={property.id} 
                  onClick={() => navigate(`/property/${property.id}`)} // 🔥 NAVIGATE TO DETAILS PAGE
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={coverImage}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="bg-white/95 text-slate-900 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1 text-green-600"/> Verified
                      </span>
                      <span className="bg-red-600 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm w-fit">
                        {property.category || property.type}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Add to wishlist logic here */ }} 
                      className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-white backdrop-blur-md rounded-full text-white hover:text-red-500 transition-all z-10"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center">
                        <MapPin className="h-3 w-3 mr-1"/> {property.city}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-1">
                      {property.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-1">{property.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Area</p>
                        <p className="text-sm font-bold text-slate-800">{property.area || property.size || "N/A"} <span className="text-xs font-normal">sqft</span></p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Status</p>
                        <p className="text-sm font-bold text-slate-800">Ready</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total Price</p>
                        <p className="text-xl font-black text-slate-900">₹{Number(property.price).toLocaleString('en-IN')}</p>
                      </div>
                      {/* Set pointer-events-none so the button click just bubbles up to the parent div's navigate */}
                      <Button variant="outline" className="h-9 px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600 text-xs font-bold rounded-lg pointer-events-none">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-200">
      <Navbar />

      {/* 1. MASSIVE HERO SECTION */}
      <section className="relative pt-32 pb-40 px-4 md:px-6 flex items-center justify-center overflow-hidden min-h-[85vh]">
        <div 
          className="absolute inset-0 z-0 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/95 z-10" />

        <div className="relative z-20 w-full max-w-6xl mx-auto text-center mt-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">ANK Realty.</span><br/>
            <span className="text-3xl md:text-5xl font-bold text-slate-200">India's Premium Property Portal</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-light">
            Search from over 12,000+ verified properties, plots, and commercial spaces across top Indian cities.
          </p>
          
          {/* Advanced Search Box */}
          <div className="bg-white rounded-3xl shadow-2xl p-3 md:p-4 max-w-4xl mx-auto w-full">
            {/* Search Tabs */}
            <div className="flex justify-center md:justify-start gap-2 mb-4 px-2 pt-2">
              {['buy', 'rent', 'sell', 'commercial'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchCategory(cat)}
                  className={`px-5 py-2 text-sm font-bold capitalize rounded-full transition-all ${
                    searchCategory === cat 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-transparent text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                 <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                 <Input
                  placeholder="Enter City, Locality, or Landmark"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="h-14 pl-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-red-500 w-full text-slate-900 rounded-2xl text-base"
                />
              </div>
              <div className="md:col-span-4 relative">
                 <Home className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                 <select 
                   className="h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-500 w-full text-slate-700 rounded-2xl text-base appearance-none outline-none"
                   value={propertyType}
                   onChange={(e) => setPropertyType(e.target.value)}
                 >
                   <option value="">Property Type</option>
                   <option value="apartment">Apartment / Flat</option>
                   <option value="villa">Villa / Independent House</option>
                   <option value="plot">Plot / Land</option>
                 </select>
              </div>
              <div className="md:col-span-3">
                <Button onClick={handleSearch} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-red-600/30 transition-all">
                  <Search className="mr-2 h-5 w-5" /> Search
                </Button>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-300">
            <span className="text-slate-400">Popular Searches:</span>
            {['Flats in Mumbai', 'Villas in Pune', 'Plots in Noida', 'Shops in Bangalore'].map((link, i) => (
              <span key={i} className="hover:text-white cursor-pointer border-b border-transparent hover:border-white transition-all">{link}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. EXPLORE TOP CITIES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Explore Real Estate in Top Cities</h2>
          <p className="text-slate-500 mb-10 text-lg">Find properties in India's most sought-after locations</p>
          
          <div className="flex overflow-x-auto pb-6 gap-6 hide-scrollbar snap-x">
            {trendingCities.map((city, idx) => (
              <div key={idx} className="min-w-[200px] flex-1 snap-start group cursor-pointer">
                <div className="relative h-48 rounded-2xl overflow-hidden mb-3 shadow-sm">
                  <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-xl">{city.name}</h3>
                    <p className="text-slate-200 text-sm">{city.props} Properties</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CURATED COLLECTIONS */}
      <section className="py-16 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Top Collections for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCollections.map((collection, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl transition-all group cursor-pointer text-center">
                <div className="w-16 h-16 mx-auto bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5 group-hover:-translate-y-2 transition-transform duration-300">
                  <collection.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{collection.title}</h3>
                <p className="text-slate-500 text-sm mb-4">{collection.desc}</p>
                <span className="text-red-600 font-bold text-sm bg-red-50 px-4 py-1.5 rounded-full inline-block group-hover:bg-red-600 group-hover:text-white transition-colors">
                  {collection.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC PROPERTY SECTIONS */}
      <PropertyGrid title="Featured Properties" subtitle="Handpicked excellence by ANK Realty" items={featuredProperties} linkTo="/buy" />
      <PropertyGrid title="Fresh Properties for Sale" subtitle="Explore the newest plots and homes on the market" items={buyProperties} linkTo="/buy" />
      <PropertyGrid title="Top Properties for Rent" subtitle="Comfortable living spaces within your budget" items={rentProperties} linkTo="/rent" />

     {/* 5. PREMIUM SERVICES / TOOLS SECTION WITH BALANCED CALCULATOR */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* LEFT SIDE - INCREASED CONTENT & WIDTH */}
            <div className="lg:w-7/12 w-full">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-sm font-bold tracking-wide">
                🌟 ANK Realty Exclusive
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                More than just listings. <br/>We offer <span className="text-red-600">Complete Solutions.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl">
                From finding the perfect property to getting the keys, ANK Realty provides end-to-end premium services to make your real estate journey seamless, secure, and stress-free.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { icon: Shield, title: "Legal & Verified", desc: "Rigorous 30-point legal check." },
                  { icon: Banknote, title: "Home Loan Assistance", desc: "Quick approvals with top banks." },
                  { icon: FileText, title: "Property Registration", desc: "Hassle-free registry support." },
                  { icon: TrendingUp, title: "Investment Advisory", desc: "Data-driven ROI insights." }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h4>
                      <p className="text-slate-500 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* RIGHT SIDE - COMPACT CALCULATOR */}
            <div className="lg:w-5/12 w-full">
              <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="bg-slate-800 p-2.5 rounded-xl">
                    <Calculator className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">EMI Calculator</h3>
                    <p className="text-slate-400 text-xs">Estimate your monthly payments</p>
                  </div>
                </div>
                
                {/* Sliders Area - Reduced Spacing */}
                <div className="space-y-5 mb-6 relative z-10">
                  {/* Loan Amount Slider */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Loan Amount</span>
                      <span className="font-bold text-base text-white font-mono">₹{loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <input 
                      type="range" min="500000" max="50000000" step="100000" 
                      value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} 
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" 
                    />
                  </div>

                  {/* Interest Rate Slider */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Interest Rate (P.A.)</span>
                      <span className="font-bold text-base text-white font-mono">{interestRate}%</span>
                    </div>
                    <input 
                      type="range" min="5" max="15" step="0.1" 
                      value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} 
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" 
                    />
                  </div>

                  {/* Tenure Slider */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Loan Tenure</span>
                      <span className="font-bold text-base text-white font-mono">{loanTenure} Years</span>
                    </div>
                    <input 
                      type="range" min="1" max="30" step="1" 
                      value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} 
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" 
                    />
                  </div>
                </div>
                
                {/* Real-time Results Box - Compact */}
                <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-5 border border-slate-700 relative z-10 text-center">
                  <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Your Monthly EMI</p>
                  <p className="text-3xl font-black text-red-500 mb-4 font-mono">
                    ₹{emiResult.emi.toLocaleString('en-IN')}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700 text-left">
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider">Principal</p>
                      <p className="font-bold text-sm text-white font-mono">₹{loanAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider">Total Interest</p>
                      <p className="font-bold text-sm text-white font-mono">₹{emiResult.totalInterest.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg h-11 text-sm transition-all shadow-lg shadow-red-600/20">
                    Apply for Home Loan
                  </Button>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 6. INSIGHTS & ARTICLES */}
      <section className="py-16 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Real Estate Insights</h2>
              <p className="text-slate-500 text-lg">Stay updated with market trends and expert guides</p>
            </div>
            <Button variant="link" className="text-red-600 font-bold hidden md:flex">View All Articles <ChevronRight className="w-4 h-4 ml-1"/></Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{article.category}</span>
                  <span className="text-slate-400 text-sm flex items-center"><BookOpen className="w-3 h-3 mr-1"/> {article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">{article.title}</h3>
                <p className="text-red-600 font-semibold text-sm flex items-center">Read More <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"/></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MASSIVE CTA BANNER */}
      <section className="py-12 px-6 bg-white pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="md:w-2/3 relative z-10 mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Want to Sell or Rent your Property?</h2>
              <p className="text-xl text-red-100 font-medium max-w-xl">
                List your property on ANK Realty and connect with thousands of genuine buyers and tenants instantly. Zero brokerage, maximum reach.
              </p>
            </div>
            
            <div className="md:w-1/3 relative z-10 flex flex-col items-center md:items-end w-full">
              <Link to="/sell" className="w-full md:w-auto">
                <Button className="w-full md:w-auto h-16 px-10 bg-white text-red-600 hover:bg-slate-50 font-black text-xl rounded-2xl shadow-xl shadow-black/20 transition-transform hover:-translate-y-1">
                  Post Property for Free
                </Button>
              </Link>
              <p className="text-red-100 text-sm mt-4 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Takes only 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (Expanded) */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
            <div className="md:col-span-2 space-y-6 pr-4">
              <h3 className="text-3xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The Red Carpet of Real Estate. We are India's most trusted property portal, committed to providing transparency, verified listings, and end-to-end property solutions.
              </p>
              <div className="space-y-3 pt-2">
                <p className="flex items-center text-slate-300"><Phone className="w-5 h-5 mr-3 text-red-500"/> Toll Free: 1800-123-4567</p>
                <p className="flex items-center text-slate-300"><Mail className="w-5 h-5 mr-3 text-red-500"/> support@ankrealty.com</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Properties</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link to="/buy" className="hover:text-white transition-colors">Property for Sale</Link></li>
                <li><Link to="/rent" className="hover:text-white transition-colors">Property for Rent</Link></li>
                <li><Link to="/buy" className="hover:text-white transition-colors">Commercial Projects</Link></li>
                <li><Link to="/buy" className="hover:text-white transition-colors">New Projects</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Company</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">For Builders & Agents</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link to="/sell" className="hover:text-white transition-colors">List your Property</Link></li>
                <li><Link to="/advertise" className="hover:text-white transition-colors">Advertise with Us</Link></li>
                <li><Link to="/agent-login" className="hover:text-white transition-colors">Agent Portal</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
               <span className="hover:text-white cursor-pointer">Facebook</span>
               <span className="hover:text-white cursor-pointer">Twitter</span>
               <span className="hover:text-white cursor-pointer">Instagram</span>
               <span className="hover:text-white cursor-pointer">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}