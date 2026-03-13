import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, Home, Heart, ArrowRight, Star, 
  Building, CheckCircle, Key, FileText, Loader2, Mail, 
  TrendingUp, Calculator, Shield, BookOpen, Phone,
  ChevronRight, Map, Banknote, X, MessageSquare, Send
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// --- HARDCODED PROPERTY DATA WITH UNIQUE IMAGES ---
// Using picsum seeds with the property name guarantees a distinct, high-quality placeholder for every plot
const generateImage = (name) => `https://picsum.photos/seed/${encodeURIComponent(name)}/800/600`;

const propertyListings = [
  // FRESH PROPERTIES - NOIDA RESIDENTIAL
  { id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sec 151', category: 'buy', tag: 'Fresh', type: 'Residential', price: 18500000, area: 2400, description: 'Premium fresh residential living spaces in Sector 151 with world-class amenities.', imageUrl: generateImage('Experion Saatori') },
  { id: 'f2', title: 'Smart World Elie Saab', city: 'Noida', location: 'Sec 98', category: 'buy', tag: 'Fresh', type: 'Residential', price: 22000000, area: 3100, description: 'Exclusive designer residences in Sector 98.', imageUrl: generateImage('Smart World Elie Saab') },
  { id: 'f3', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sec 97', category: 'buy', tag: 'Fresh', type: 'Residential', price: 35000000, area: 4500, description: 'Ultra-luxury living conceptualized by Jacob & Co.', imageUrl: generateImage('M3M Jacob & Co') },
  { id: 'f4', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', tag: 'Fresh', type: 'Residential', price: 17500000, area: 2200, description: 'Tranquil and sustainable residential spaces.', imageUrl: generateImage('Max Estate Res') },
  { id: 'f5', title: 'RG Mirage', city: 'Noida', location: 'Sec 120', category: 'buy', tag: 'Fresh', type: 'Residential', price: 11000000, area: 1600, description: 'Modern apartments with seamless connectivity.', imageUrl: generateImage('RG Mirage') },
  { id: 'f6', title: 'Godrej Riverine', city: 'Noida', location: 'Sec 44', category: 'buy', tag: 'Fresh', type: 'Residential', price: 21000000, area: 2800, description: 'Riverside luxury living by Godrej Properties.', imageUrl: generateImage('Godrej Riverine') },
  { id: 'f7', title: 'M3M Cullinan', city: 'Noida', location: 'Sec 94', category: 'buy', tag: 'Fresh', type: 'Residential', price: 40000000, area: 5500, description: 'Bespoke mega-luxury apartments in Sector 94.', imageUrl: generateImage('M3M Cullinan') },
  { id: 'f8', title: 'Great Value Ekanam', city: 'Noida', location: 'Sec 107', category: 'buy', tag: 'Fresh', type: 'Residential', price: 14000000, area: 1950, description: 'Spacious and well-ventilated premium homes.', imageUrl: generateImage('Great Value Ekanam') },

  // FRESH PROPERTIES - NOIDA COMMERCIAL
  { id: 'c1', title: 'M3M Line', city: 'Noida', location: 'Sec 72', category: 'buy', tag: 'Commercial', type: 'Commercial', price: 8000000, area: 500, description: 'High-footfall retail and office spaces.', imageUrl: generateImage('M3M Line') },
  { id: 'c2', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', tag: 'Commercial', type: 'Commercial', price: 12000000, area: 1200, description: 'Grade A corporate office spaces.', imageUrl: generateImage('Max Estate Com') },
  { id: 'c3', title: 'Paras Avenue', city: 'Noida', location: 'Sec 129', category: 'buy', tag: 'Commercial', type: 'Commercial', price: 6500000, area: 450, description: 'Premium high-street retail destination.', imageUrl: generateImage('Paras Avenue') },

  // FRESH PROPERTIES - GREATER NOIDA WEST
  { id: 'gw1', title: 'Fusion – The Brook', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', tag: 'Fresh', type: 'Residential', price: 8500000, area: 1300, description: 'Nature-inspired living in Greater Noida West.', imageUrl: generateImage('Fusion The Brook') },
  { id: 'gw2', title: 'Yatharth Eternia', city: 'Greater Noida West', location: 'Tech Zone 4', category: 'buy', tag: 'Fresh', type: 'Residential', price: 9200000, area: 1450, description: 'Modern amenities right in Tech Zone 4.', imageUrl: generateImage('Yatharth Eternia') },
  { id: 'gw3', title: 'VVIP Addresses', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', tag: 'Fresh', type: 'Residential', price: 10500000, area: 1650, description: 'Prestigious residential address for modern families.', imageUrl: generateImage('VVIP Addresses') },
  { id: 'gw4', title: 'Eldeco La Vida Bella', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', tag: 'Fresh', type: 'Residential', price: 11500000, area: 1800, description: 'Beautifully crafted Spanish-themed homes.', imageUrl: generateImage('Eldeco La Vida') },
  { id: 'gw5', title: 'Elite X', city: 'Greater Noida West', location: 'Sec 10', category: 'buy', tag: 'Fresh', type: 'Residential', price: 7800000, area: 1250, description: 'Smart homes for the smart generation.', imageUrl: generateImage('Elite X') },

  // FRESH PROPERTIES - YAMUNA
  { id: 'y1', title: 'Ace Hive', city: 'Yamuna', location: 'Sec 22A', category: 'buy', tag: 'Fresh', type: 'Residential', price: 6000000, area: 1100, description: 'Emerging luxury destination near Yamuna Expressway.', imageUrl: generateImage('Ace Hive') },
  { id: 'y2', title: 'Eldeco Whispers of Wow', city: 'Yamuna', location: 'Sec 22D', category: 'buy', tag: 'Fresh', type: 'Residential', price: 7200000, area: 1350, description: 'Serene living spaces close to upcoming infra.', imageUrl: generateImage('Eldeco Whispers') },
  { id: 'y3', title: 'Gaur Chrysalis', city: 'Yamuna', location: 'Sec 22D', category: 'buy', tag: 'Fresh', type: 'Residential', price: 6500000, area: 1200, description: 'Premium plotted and high-rise developments.', imageUrl: generateImage('Gaur Chrysalis') },
  { id: 'y4', title: 'Ace Verde', city: 'Yamuna', location: 'Sec 22', category: 'buy', tag: 'Fresh', type: 'Residential', price: 8000000, area: 1500, description: 'Lush green surroundings with modern comforts.', imageUrl: generateImage('Ace Verde') },

  // RESALE PROPERTIES - NOIDA
  ...['Lotus Panache – Sec 110', 'Lotus Boulevard – Sec 100', 'Great Value Sharnam – Sec 107', 'Prateek Stylome – Sec 45', 'Mahagun Moderne – Sec 78', 'Ajnara Grand – Sec 74', 'Godrej Woods – Sec 43', 'ABA Cleo County – Sec 121', 'Amrapali Heartbeat City – Sec 107', 'Gulshan Dynasty – Sec 144', 'Ivy County – Sec 75', 'County 107 – Sec 107', 'Prateek Edifice – Sec 107'].map((name, i) => ({
    id: `rs${i}`, title: name.split(' – ')[0], city: 'Noida', location: name.split(' – ')[1], category: 'buy', tag: 'Resale', type: 'Residential', price: 12000000 + (i * 1000000), area: 1500 + (i * 100), description: `Excellent resale opportunity in ${name.split(' – ')[0]}. Ready to move in immediately.`, imageUrl: generateImage(name + ' Resale')
  })),

  // RENT PROPERTIES - NOIDA
  ...['Lotus Panache – Sec 110', 'Lotus Boulevard – Sec 100', 'Great Value Sharnam – Sec 107', 'Prateek Stylome – Sec 45', 'Mahagun Moderne – Sec 78', 'Ajnara Grand – Sec 74', 'Godrej Woods – Sec 43', 'ABA Cleo County – Sec 121', 'Amrapali Heartbeat City – Sec 107', 'Gulshan Dynasty – Sec 144', 'Ivy County – Sec 75', 'County 107 – Sec 107', 'Prateek Edifice – Sec 107'].map((name, i) => ({
    id: `rt${i}`, title: name.split(' – ')[0], city: 'Noida', location: name.split(' – ')[1], category: 'rent', tag: 'Rent', type: 'Residential', price: 35000 + (i * 5000), area: 1500 + (i * 100), description: `Spacious property available for rent in ${name.split(' – ')[0]}. Prime location with top amenities.`, imageUrl: generateImage(name + ' Rent')
  }))
];

// --- MOCK CONTENT FILLERS ---
const trendingCities = [
  { name: "Mumbai", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80", props: "1,200+" },
  { name: "Bangalore", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80", props: "3,400+" },
  { name: "Delhi NCR", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80", props: "2,800+" },
  { name: "Pune", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80", props: "1,900+" },
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
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // MODAL STATE FOR SAME-PAGE DETAILS
  const [selectedProperty, setSelectedProperty] = useState(null);

  // CHATBOT STATE
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatSubjects = [
    "Schedule a Visit",
    "Price Details & Negotiation",
    "Legal Verification Check",
    "Home Loan Options",
    "Property Locations & Tours",
    "Resale Values & ROI",
    "Connect with an Agent"
  ];
  
  const [searchCategory, setSearchCategory] = useState('buy');
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  
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

  useEffect(() => {
    // Simulating API fetch but prioritizing our extensive hardcoded listings
    setTimeout(() => {
      setProperties(propertyListings);
      setLoading(false);
    }, 800);
  }, []);

  const featuredProperties = properties.filter(p => p.tag === 'Fresh').slice(0, 8);
  const buyProperties = properties.filter(p => p.tag === 'Resale' || p.tag === 'Commercial').slice(0, 8);
  const rentProperties = properties.filter(p => p.category === 'rent').slice(0, 8);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProperty) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedProperty]);

  // REUSABLE PROPERTY GRID WITH MODAL TRIGGER
  const PropertyGrid = ({ title, subtitle, items }) => (
    <section className="py-16 px-6 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">{title}</h2>
            <p className="text-lg text-slate-500">{subtitle}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-red-600" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {items.map((property) => (
              <div 
                key={property.id} 
                onClick={() => setSelectedProperty(property)} // OPENS MODAL INSTEAD OF REDIRECT
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className="bg-white/95 text-slate-900 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-600"/> Verified
                    </span>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm w-fit">
                      {property.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center">
                      <MapPin className="h-3 w-3 mr-1"/> {property.location}, {property.city}
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
                      <p className="text-sm font-bold text-slate-800">{property.area} <span className="text-xs font-normal">sqft</span></p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Type</p>
                      <p className="text-sm font-bold text-slate-800">{property.type}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Price</p>
                      <p className="text-xl font-black text-slate-900">
                        ₹{property.price >= 10000000 ? (property.price / 10000000).toFixed(2) + ' Cr' : (property.price / 100000).toFixed(2) + ' Lac'}
                      </p>
                    </div>
                    <Button variant="outline" className="h-9 px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600 text-xs font-bold rounded-lg pointer-events-none">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/95 z-10" />

        <div className="relative z-20 w-full max-w-6xl mx-auto text-center mt-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">ANK Realty.</span><br/>
            <span className="text-3xl md:text-5xl font-bold text-slate-200">India's Premium Property Portal</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-light">
            Search from over 12,000+ verified properties, plots, and commercial spaces across top Indian cities.
          </p>
          
          {/* Advanced Search */}
          <div className="bg-white rounded-3xl shadow-2xl p-3 md:p-4 max-w-4xl mx-auto w-full">
            <div className="flex justify-center md:justify-start gap-2 mb-4 px-2 pt-2">
              {['buy', 'rent', 'sell', 'commercial'].map((cat) => (
                <button
                  key={cat} onClick={() => setSearchCategory(cat)}
                  className={`px-5 py-2 text-sm font-bold capitalize rounded-full transition-all ${
                    searchCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                 <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                 <Input placeholder="Enter City, Locality, or Landmark" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="h-14 pl-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-red-500 w-full text-slate-900 rounded-2xl text-base" />
              </div>
              <div className="md:col-span-4 relative">
                 <Home className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                 <select className="h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-500 w-full text-slate-700 rounded-2xl text-base appearance-none outline-none" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                   <option value="">Property Type</option>
                   <option value="apartment">Apartment / Flat</option>
                   <option value="villa">Villa / Independent House</option>
                   <option value="plot">Plot / Land</option>
                 </select>
              </div>
              <div className="md:col-span-3">
                <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-red-600/30 transition-all">
                  <Search className="mr-2 h-5 w-5" /> Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DYNAMIC PROPERTY SECTIONS --- */}
      <PropertyGrid title="Fresh Properties" subtitle="Brand new residential and commercial developments" items={featuredProperties} />
      <PropertyGrid title="Resale & Commercial Properties" subtitle="Prime investments across premium sectors" items={buyProperties} />
      <PropertyGrid title="Properties on Rent" subtitle="Spacious and secure living available immediately" items={rentProperties} />

      {/* --- EMI CALCULATOR & SERVICES --- */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-200">
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

      {/* --- FOOTER --- */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800">
         <div className="max-w-7xl mx-auto text-center md:text-left">
            <h3 className="text-3xl font-black tracking-tight mb-4">ANK Realty<span className="text-red-600">.</span></h3>
            <p className="text-slate-400 text-sm">The Red Carpet of Real Estate. End-to-end property solutions across India.</p>
            <p className="text-slate-500 mt-10 text-xs">&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
         </div>
      </footer>

      {/* --- PROPERTY DETAILS MODAL (SAME PAGE) --- */}
      {selectedProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-10">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Modal Scrollable Content */}
            <div className="overflow-y-auto flex-1">
              <div className="h-64 sm:h-80 w-full relative">
                <img src={selectedProperty.imageUrl} alt={selectedProperty.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                   <div className="flex gap-2 mb-2">
                     <span className="bg-red-600 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">{selectedProperty.tag}</span>
                     <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold">{selectedProperty.type}</span>
                   </div>
                   <h2 className="text-3xl sm:text-4xl font-black mb-1">{selectedProperty.title}</h2>
                   <p className="flex items-center text-slate-200"><MapPin className="w-4 h-4 mr-1"/> {selectedProperty.location}, {selectedProperty.city}</p>
                </div>
              </div>
              
              <div className="p-6 sm:p-10 flex flex-col md:flex-row gap-10">
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Description</h3>
                  <p className="text-slate-600 leading-relaxed text-lg mb-8">{selectedProperty.description}</p>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Property Features</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium">Built-up Area</p>
                      <p className="text-lg font-bold text-slate-900">{selectedProperty.area} sq.ft.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium">Status</p>
                      <p className="text-lg font-bold text-slate-900">Ready to Move</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium">Furnishing</p>
                      <p className="text-lg font-bold text-slate-900">Semi-Furnished</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium">Possession</p>
                      <p className="text-lg font-bold text-slate-900">Immediate</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3 space-y-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                    <p className="text-slate-500 font-medium mb-1">Total Price</p>
                    <p className="text-4xl font-black text-red-600 mb-6">
                      ₹{selectedProperty.price >= 10000000 ? (selectedProperty.price / 10000000).toFixed(2) + ' Cr' : (selectedProperty.price / 100000).toFixed(2) + ' Lac'}
                    </p>
                    <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl mb-3">Contact Builder/Agent</Button>
                    <Button variant="outline" className="w-full h-12 border-slate-300 text-slate-700 font-bold rounded-xl">Download Brochure</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                   <Building className="w-4 h-4 text-red-600"/>
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm border border-slate-100 text-slate-700">
                  Welcome to ANK Realty! I am your virtual assistant. Please choose a subject below so I can assist you better:
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-2 pl-10">
                {chatSubjects.map((subject, i) => (
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
