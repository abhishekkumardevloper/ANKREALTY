import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Home, Heart, ArrowRight, Star, 
  Building, CheckCircle, Key, FileText, Loader2, Mail, 
  TrendingUp, Calculator, Shield, BookOpen, Phone,
  ChevronRight, Map, Banknote, X, MessageSquare, Send,
  Building2, Briefcase, Ruler, Users, Award, ThumbsUp, Quote, Newspaper, Bell
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// --- LOGO ARRAYS FOR ANIMATION ---
const topRowLogos = [
  "/images (3).png",
  "/images (2).png",
  "/images (1).png",
  "/logo (2).png",
  "/183f468e401f4220bce9e4f7b1e3ffd820251112162925170.png",
];

const bottomRowLogos = [
  "/images.png",
  "/4f3bb698972531.Y3JvcCw5NTAsNzQzLDIyMywyMQ-removebg-preview.png",
  "/Max_Estates_logo.svg.png",
  "/M3M-Jacob-and-Co-logo.png",
];

// --- HARDCODED PROPERTY DATA WITH UNIQUE IMAGES ---
const generateImage = (category, index) => {
  const residentialImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'  
  ];
  const commercialImages = [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'  
  ];

  if (category === 'Commercial') return commercialImages[index % commercialImages.length];
  const safeIndex = (typeof index === 'number' ? index : index?.length || 0) % residentialImages.length;
  return residentialImages[safeIndex];
};

// Data Hydration Helper
const enrichProperty = (p) => ({
  ...p,
  builder: p.title.split(' ')[0],
  bhk: p.category === 'Commercial' ? 'Retail / Office' : (Math.floor(Math.random() * 3) + 2) + ' BHK',
  status: p.tag === 'Fresh' ? 'Under Construction' : 'Ready to Move',
  rera: `UPRERA-PRJ${Math.floor(1000 + Math.random() * 9000)}`
});

export const propertiesData = [
  { id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sec 151', category: 'buy', tag: 'Fresh', type: 'Residential', price: 18500000, area: 2400, description: 'Premium residential development offering a harmonious blend of contemporary architecture.', imageUrl: generateImage('Residential', 0) },
  { id: 'f2', title: 'Smart World Elie Saab', city: 'Noida', location: 'Sec 98', category: 'buy', tag: 'Fresh', type: 'Residential', price: 22000000, area: 3100, description: 'Exclusive designer residential enclave conceptualized by globally renowned designers.', imageUrl: generateImage('Residential', 1) },
  { id: 'f3', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sec 97', category: 'buy', tag: 'Fresh', type: 'Residential', price: 35000000, area: 4500, description: 'Pinnacle of ultra-luxury real estate inspired by meticulous craftsmanship.', imageUrl: generateImage('Residential', 2) },
  { id: 'f4', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', tag: 'Fresh', type: 'Residential', price: 17500000, area: 2200, description: 'Future of sustainable and tranquil residential living.', imageUrl: generateImage('Residential', 3) },
  { id: 'c1', title: 'M3M Line', city: 'Noida', location: 'Sec 72', category: 'buy', tag: 'Commercial', type: 'Commercial', price: 8000000, area: 500, description: 'Ultimate high-street commercial destination offering a brilliant mix of premium retail spaces.', imageUrl: generateImage('Commercial', 0) },
  { id: 'c2', title: 'Max Estate Commercial', city: 'Noida', location: 'Sec 105', category: 'buy', tag: 'Commercial', type: 'Commercial', price: 12000000, area: 1200, description: 'Redefine your corporate identity offering elite Grade A office spaces.', imageUrl: generateImage('Commercial', 1) },
  ...[
    'Lotus Panache – Sec 110', 'Lotus Boulevard – Sec 100', 'Great Value Sharnam – Sec 107', 
    'Prateek Stylome – Sec 45', 'Mahagun Moderne – Sec 78'
  ].map((name, i) => {
    const title = name.split(' – ')[0];
    const location = name.split(' – ')[1];
    return {
      id: `rs${i}`, title: title, city: 'Noida', location: location, category: 'buy', tag: 'Resale', type: 'Residential', price: 12000000 + (i * 1000000), area: 1500 + (i * 100), description: `Exceptional resale opportunity at ${title}.`, imageUrl: generateImage('Residential', i + 2)
    };
  })
].map(enrichProperty);

const testimonialsData = [
  { name: "Rahul Sharma", role: "IT Professional", review: "ANK Realty made finding our dream home in Noida a breeze. Their transparency and legal verification checks gave us complete peace of mind. Highly recommended!", rating: 5 },
  { name: "Priya Desai", role: "Business Owner", review: "I invested in a commercial space through ANK Realty. Their market insights were spot on, and the ROI has already exceeded my expectations within a year.", rating: 5 },
  { name: "Amit Verma", role: "NRI Investor", review: "Managing property investments from abroad is tough, but the team at ANK Realty handled everything perfectly—from virtual tours to the final registry.", rating: 5 }
];

const blogsData = [
  { title: "Top 5 Emerging Localities in NCR for 2026", date: "March 10, 2026", category: "Market Trends", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  { title: "A Complete Guide to Applying for Home Loans", date: "February 28, 2026", category: "Finance", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" },
  { title: "RERA Guidelines Every Homebuyer Must Know", date: "February 15, 2026", category: "Legal", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80" }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('buy');
  
  // EMI CALCULATOR
  const [loanAmount, setLoanAmount] = useState(5000000); 
  const [interestRate, setInterestRate] = useState(8.5); 
  const [loanTenure, setLoanTenure] = useState(20); 
  const [emiResult, setEmiResult] = useState({ emi: 0, totalInterest: 0, totalPayment: 0 });

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

  useEffect(() => {
    setTimeout(() => {
      setProperties(propertiesData);
      setLoading(false);
    }, 800);
  }, []);

  const featuredProperties = properties.filter(p => p.tag === 'Fresh').slice(0, 4);
  const commercialProperties = properties.filter(p => p.tag === 'Commercial').slice(0, 4);
  const resaleProperties = properties.filter(p => p.tag === 'Resale').slice(0, 4);

  // Reusable Rich Property Card
  const PropertyCard = ({ property }) => (
    <div 
      onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative h-60 overflow-hidden">
        <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center">
            <CheckCircle className="w-3 h-3 mr-1"/> {property.rera}
          </span>
          <span className="bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm w-fit">
            {property.status}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
              {property.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium flex items-center mt-1">
              <Building2 className="w-4 h-4 mr-1.5 text-slate-400" /> By {property.builder}
            </p>
          </div>
          <div className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-lg border border-red-100">
            {property.tag}
          </div>
        </div>

        <p className="text-slate-600 text-sm flex items-center mb-4">
          <MapPin className="h-4 w-4 mr-1.5 text-red-500"/> {property.location}, {property.city}
        </p>
        
        <div className="grid grid-cols-3 gap-2 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-center border-r border-slate-200 last:border-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Typology</p>
            <p className="text-sm font-bold text-slate-800">{property.bhk}</p>
          </div>
          <div className="text-center border-r border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Area</p>
            <p className="text-sm font-bold text-slate-800 flex items-center justify-center"><Ruler className="w-3 h-3 mr-1"/>{property.area}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Type</p>
            <p className="text-sm font-bold text-slate-800 truncate px-1">{property.type}</p>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Starting Price</p>
            <p className="text-2xl font-black text-slate-900">
              ₹{property.price >= 10000000 ? (property.price / 10000000).toFixed(2) + ' Cr' : (property.price / 100000).toFixed(2) + ' L'}
            </p>
          </div>
          <Button variant="outline" className="h-10 px-5 border-slate-200 text-slate-700 hover:bg-red-600 hover:text-white hover:border-red-600 text-sm font-bold rounded-xl transition-all">
            Details <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );

  const PropertyGrid = ({ title, subtitle, items }) => (
    <section className="py-16 px-6 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">{title}</h2>
            <p className="text-lg text-slate-500">{subtitle}</p>
          </div>
          <Button variant="link" className="text-red-600 font-bold hover:text-red-700 p-0 hidden md:flex">
            View All Projects <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-red-600" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {items.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-200 relative">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-40 px-4 md:px-6 flex items-center justify-center overflow-hidden min-h-[85vh]">
        <div 
          className="absolute inset-0 z-0 scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-900/95 z-10" />

        <div className="relative z-20 w-full max-w-6xl mx-auto text-center mt-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold tracking-wide backdrop-blur-sm">
            Discover Your Next Investment
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl">
            India's Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Real Estate</span> Hub.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-light">
            Explore 12,000+ verified projects, plots, and commercial spaces from top developers across the country.
          </p>
          
          {/* Advanced Search Portal Style */}
          <div className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-6 max-w-5xl mx-auto w-full">
            <div className="flex justify-center md:justify-start gap-4 mb-6 px-2 border-b border-slate-100 pb-4">
              {['New Projects', 'Resale', 'Commercial', 'Plots'].map((cat, idx) => (
                <button
                  key={cat} onClick={() => setSearchCategory(cat)}
                  className={`text-sm md:text-base font-bold capitalize transition-all pb-4 -mb-[17px] border-b-2 ${
                    searchCategory === cat ? 'text-red-600 border-red-600' : 'text-slate-500 border-transparent hover:text-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative border-r border-slate-200">
                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                 <Input placeholder="City or Micro-market" className="h-14 pl-12 bg-transparent border-0 focus-visible:ring-0 text-slate-900 text-base shadow-none" />
              </div>
              <div className="relative border-r border-slate-200">
                 <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                 <select className="h-14 pl-12 pr-4 bg-transparent border-0 focus:ring-0 w-full text-slate-700 text-base appearance-none outline-none shadow-none cursor-pointer">
                   <option value="">Property Type</option>
                   <option value="apartment">Luxury Apartment</option>
                   <option value="villa">Villa / Penthouse</option>
                   <option value="office">Office Space</option>
                 </select>
              </div>
              <div className="relative">
                 <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                 <select className="h-14 pl-12 pr-4 bg-transparent border-0 focus:ring-0 w-full text-slate-700 text-base appearance-none outline-none shadow-none cursor-pointer">
                   <option value="">Budget</option>
                   <option value="1cr">₹50 Lac - ₹1 Cr</option>
                   <option value="2cr">₹1 Cr - ₹3 Cr</option>
                   <option value="5cr">₹3 Cr - ₹5 Cr</option>
                   <option value="5cr+">₹5 Cr +</option>
                 </select>
              </div>
              <div>
                <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-600/30 transition-all">
                  <Search className="mr-2 h-5 w-5" /> Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUSTED BRANDS ANIMATION --- */}
      <section className="py-12 sm:py-16 relative w-full overflow-hidden bg-white -mt-10 z-20 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-b border-slate-100">
        <div className="w-full">
          {/* Heading */}
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
                <div
                  key={`top-${i}`}
                  className="flex-shrink-0 w-32 sm:w-48 h-16 sm:h-20 flex items-center justify-center"
                >
                  <img 
                    src={src} 
                    alt={`Client logo ${i}`} 
                    className="max-w-full max-h-full object-contain filter brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
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
                <div
                  key={`bottom-${i}`}
                  className="flex-shrink-0 w-32 sm:w-48 h-16 sm:h-20 flex items-center justify-center"
                >
                  <img 
                    src={src} 
                    alt={`Client logo ${i}`} 
                    className="max-w-full max-h-full object-contain filter brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </motion.div>

            {/* Fade Gradients (Left & Right Edges) */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>
      {/* --- QUICK CATEGORIES --- */}
      <section className="py-12 bg-white border-b border-slate-100 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { title: "Apartments", icon: Building2 },
              { title: "Villas", icon: Home },
              { title: "Commercial", icon: Briefcase },
              { title: "Plots", icon: Map },
              { title: "New Launch", icon: Star },
              { title: "Ready to Move", icon: Key }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:bg-red-50 hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-all">
                  <item.icon className="w-6 h-6 text-slate-600 group-hover:text-red-600" />
                </div>
                <p className="font-bold text-slate-800 text-sm">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRENDING MICRO-MARKETS --- */}
      <section className="py-16 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Explore Top Localities</h2>
            <p className="text-slate-500">Discover premium properties in the most sought-after investment corridors.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Yamuna Expressway', count: '120+ Projects', img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80' },
              { name: 'Noida Sector 150', count: '85+ Projects', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80' },
              { name: 'Greater Noida West', count: '200+ Projects', img: 'https://images.unsplash.com/photo-1515263487990-61b07816bc32?auto=format&fit=crop&w=600&q=80' },
              { name: 'Golf Course Ext.', count: '45+ Projects', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' }
            ].map((loc, idx) => (
              <div key={idx} className="relative h-40 md:h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
                <img src={loc.img} alt={loc.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-bold text-lg leading-tight mb-1">{loc.name}</h4>
                  <p className="text-red-300 text-xs font-bold uppercase tracking-wide">{loc.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DYNAMIC PROPERTY SECTIONS --- */}
      <PropertyGrid title="New & Upcoming Projects" subtitle="Discover exclusive launches from A-grade developers." items={featuredProperties} />
      
      {/* --- WHY CHOOSE US (STATS BANNER) --- */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Why India Trusts <span className="text-red-500">ANK Realty.</span></h2>
           <p className="text-slate-400 mb-16 max-w-2xl mx-auto text-lg">We bring transparency, exclusive deals, and zero-hassle paperwork to your property buying journey.</p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
             {[
               { icon: Users, num: "15,000+", label: "Happy Families" },
               { icon: Building2, num: "500+", label: "Projects Delivered" },
               { icon: Award, num: "15+ Years", label: "Industry Experience" },
               { icon: ThumbsUp, num: "100%", label: "Transparency" }
             ].map((stat, idx) => (
               <div key={idx} className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 border border-slate-700 shadow-inner">
                   <stat.icon className="w-8 h-8 text-red-500" />
                 </div>
                 <h3 className="text-4xl font-black text-white mb-1 font-mono">{stat.num}</h3>
                 <p className="text-slate-400 font-bold uppercase tracking-wider text-sm">{stat.label}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      <PropertyGrid title="Premium Commercial Spaces" subtitle="High-ROI retail shops, food courts, and corporate offices." items={commercialProperties} />

      <PropertyGrid title="Ready To Move & Resale" subtitle="Skip the wait. Move into your dream home today." items={resaleProperties} />

      {/* --- CLIENT TESTIMONIALS --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Hear From Our Clients</h2>
            <p className="text-slate-500">Don't just take our word for it. See what our community says.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((test, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-slate-200" />
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(test.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-700 italic mb-8 leading-relaxed relative z-10">"{test.review}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{test.name}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EMI CALCULATOR & SERVICES --- */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-7/12 w-full">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-sm font-bold tracking-wide">🌟 ANK Realty Exclusive</div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">Complete <span className="text-red-600">Property Solutions.</span></h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl">From finding the perfect plot to getting the keys, ANK Realty provides end-to-end premium services.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: Shield, title: "Legal & Verified", desc: "Rigorous 30-point check." },
                { icon: Banknote, title: "Home Loan Assistance", desc: "Quick bank approvals." },
                { icon: FileText, title: "Property Registration", desc: "Hassle-free registry." },
                { icon: TrendingUp, title: "Investment Advisory", desc: "Data-driven ROI insights." }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
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
          
          {/* CALCULATOR */}
          <div className="lg:w-5/12 w-full">
            <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white relative shadow-2xl">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="bg-slate-800 p-2.5 rounded-xl"><Calculator className="w-6 h-6 text-red-500" /></div>
                <div><h3 className="text-2xl font-bold">EMI Calculator</h3></div>
              </div>
              <div className="space-y-5 mb-6 relative z-10">
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
              <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-5 border border-slate-700 relative z-10 text-center">
                <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Your Monthly EMI</p>
                <p className="text-3xl font-black text-red-500 mb-4 font-mono">₹{emiResult.emi.toLocaleString('en-IN')}</p>
                <Button className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg h-11 text-sm shadow-lg shadow-red-600/20">Apply for Home Loan</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- REAL ESTATE INSIGHTS / BLOGS --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">News & Insights</h2>
              <p className="text-lg text-slate-500">Stay updated with the latest real estate trends and market analysis.</p>
            </div>
            <Button variant="link" className="text-red-600 font-bold hover:text-red-700 p-0 hidden md:flex items-center">
              <Newspaper className="w-4 h-4 mr-2" /> View All Articles
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {blogsData.map((blog, idx) => (
               <div key={idx} className="group cursor-pointer">
                 <div className="relative h-60 rounded-3xl overflow-hidden mb-5">
                   <img src={blog.img} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                     {blog.category}
                   </div>
                 </div>
                 <p className="text-sm text-red-600 font-bold mb-2">{blog.date}</p>
                 <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug mb-3">
                   {blog.title}
                 </h3>
                 <p className="text-slate-500 font-medium group-hover:underline flex items-center">Read Article <ArrowRight className="w-4 h-4 ml-1" /></p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER CTA --- */}
      <section className="py-16 px-6 bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Bell className="w-12 h-12 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Never Miss a Property Deal</h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">Subscribe to our VIP newsletter and get early access to pre-launches, exclusive discounts, and market reports.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
             <input type="email" placeholder="Enter your email address" className="flex-1 h-14 rounded-xl px-5 border-0 focus:ring-4 focus:ring-white/20 text-slate-900 font-medium shadow-lg" />
             <Button className="h-14 px-8 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-colors">
               Subscribe Now
             </Button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-extrabold tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed pr-4 font-medium">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service, transparency, and expertise in the Indian real estate market.
              </p>
              <div className="flex space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Mail className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Phone className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Buy Property</Link></li>
                <li><Link to="/sell" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Sell Property</Link></li>
                <li><Link to="/rent" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Rent Property</Link></li>
                <li><Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Luxury Apartments</Link></li>
                <li><Link to="/buy" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Villas & Penthouses</Link></li>
                <li><Link to="/buy" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Plots / Land</Link></li>
                <li><Link to="/buy" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Commercial Space</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium text-sm">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-600 shrink-0"/> 123 Business Avenue, Tech Park, Mumbai, 400001</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-600 shrink-0"/> info@ankrealty.com</p>
                <p className="flex items-center"><Phone className="w-5 h-5 mr-3 text-red-600 shrink-0"/> +91 98765 43210</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* --- FLOATING CHATBOT --- */}
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
