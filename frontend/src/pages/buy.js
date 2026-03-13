import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Search, MapPin, Filter, X, Bed, Bath, 
  Maximize, CheckCircle, ArrowRight, Calculator,
  Home, DollarSign, Calendar, Mail, Loader2,
  SlidersHorizontal, ChevronDown, Phone, ShieldCheck,
  MessageSquare, Send
} from "lucide-react";

// --- HARDCODED PROPERTY DATA WITH UNIQUE IMAGES ---
const generateImage = (name) => `https://picsum.photos/seed/${encodeURIComponent(name)}/800/600`;

const propertyListings = [
  // FRESH PROPERTIES - NOIDA RESIDENTIAL
  { id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sec 151', category: 'buy', type: 'apartment', bedrooms: 4, bathrooms: 4, price: 18500000, area: 2400, description: 'Premium fresh residential living spaces in Sector 151 with world-class amenities.', imageUrl: generateImage('Experion Saatori') },
  { id: 'f2', title: 'Smart World Elie Saab', city: 'Noida', location: 'Sec 98', category: 'buy', type: 'villa', bedrooms: 5, bathrooms: 5, price: 22000000, area: 3100, description: 'Exclusive designer residences in Sector 98.', imageUrl: generateImage('Smart World Elie Saab') },
  { id: 'f3', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sec 97', category: 'buy', type: 'apartment', bedrooms: 4, bathrooms: 5, price: 35000000, area: 4500, description: 'Ultra-luxury living conceptualized by Jacob & Co.', imageUrl: generateImage('M3M Jacob & Co') },
  { id: 'f4', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 17500000, area: 2200, description: 'Tranquil and sustainable residential spaces.', imageUrl: generateImage('Max Estate Res') },
  { id: 'f5', title: 'RG Mirage', city: 'Noida', location: 'Sec 120', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 2, price: 11000000, area: 1600, description: 'Modern apartments with seamless connectivity.', imageUrl: generateImage('RG Mirage') },
  { id: 'f6', title: 'Godrej Riverine', city: 'Noida', location: 'Sec 44', category: 'buy', type: 'apartment', bedrooms: 4, bathrooms: 4, price: 21000000, area: 2800, description: 'Riverside luxury living by Godrej Properties.', imageUrl: generateImage('Godrej Riverine') },
  { id: 'f7', title: 'M3M Cullinan', city: 'Noida', location: 'Sec 94', category: 'buy', type: 'apartment', bedrooms: 5, bathrooms: 6, price: 40000000, area: 5500, description: 'Bespoke mega-luxury apartments in Sector 94.', imageUrl: generateImage('M3M Cullinan') },
  { id: 'f8', title: 'Great Value Ekanam', city: 'Noida', location: 'Sec 107', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 14000000, area: 1950, description: 'Spacious and well-ventilated premium homes.', imageUrl: generateImage('Great Value Ekanam') },

  // FRESH PROPERTIES - NOIDA COMMERCIAL (Treated as plots/commercial)
  { id: 'c1', title: 'M3M Line', city: 'Noida', location: 'Sec 72', category: 'buy', type: 'plot', bedrooms: 0, bathrooms: 1, price: 8000000, area: 500, description: 'High-footfall retail and office spaces.', imageUrl: generateImage('M3M Line') },
  { id: 'c2', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', type: 'plot', bedrooms: 0, bathrooms: 2, price: 12000000, area: 1200, description: 'Grade A corporate office spaces.', imageUrl: generateImage('Max Estate Com') },
  { id: 'c3', title: 'Paras Avenue', city: 'Noida', location: 'Sec 129', category: 'buy', type: 'plot', bedrooms: 0, bathrooms: 1, price: 6500000, area: 450, description: 'Premium high-street retail destination.', imageUrl: generateImage('Paras Avenue') },

  // FRESH PROPERTIES - GREATER NOIDA WEST
  { id: 'gw1', title: 'Fusion – The Brook', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', type: 'apartment', bedrooms: 2, bathrooms: 2, price: 8500000, area: 1300, description: 'Nature-inspired living in Greater Noida West.', imageUrl: generateImage('Fusion The Brook') },
  { id: 'gw2', title: 'Yatharth Eternia', city: 'Greater Noida West', location: 'Tech Zone 4', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 2, price: 9200000, area: 1450, description: 'Modern amenities right in Tech Zone 4.', imageUrl: generateImage('Yatharth Eternia') },
  { id: 'gw3', title: 'VVIP Addresses', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 10500000, area: 1650, description: 'Prestigious residential address for modern families.', imageUrl: generateImage('VVIP Addresses') },

  // RESALE PROPERTIES - NOIDA
  ...['Lotus Panache – Sec 110', 'Lotus Boulevard – Sec 100', 'Great Value Sharnam – Sec 107', 'Prateek Stylome – Sec 45', 'Mahagun Moderne – Sec 78'].map((name, i) => ({
    id: `rs${i}`, title: name.split(' – ')[0], city: 'Noida', location: name.split(' – ')[1], category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 12000000 + (i * 1000000), area: 1500 + (i * 100), description: `Excellent resale opportunity in ${name.split(' – ')[0]}. Ready to move in immediately.`, imageUrl: generateImage(name + ' Resale')
  }))
];

export default function BuyPage() {
  const navigate = useNavigate();
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

  // Advanced Filter States
  const [searchCity, setSearchCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // EMI Calculator States
  const [loanAmt, setLoanAmt] = useState(5000000);
  const [intRate, setIntRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProperty) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedProperty]);

  // FETCH DATA
  useEffect(() => {
    // Simulating API fetch but prioritizing our extensive hardcoded listings
    setTimeout(() => {
      setProperties(propertyListings);
      setLoading(false);
    }, 800);
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedProperties = useMemo(() => {
    let result = properties.filter(p => {
      const matchesCity = p.city?.toLowerCase().includes(searchCity.toLowerCase()) || p.title?.toLowerCase().includes(searchCity.toLowerCase());
      const matchesPrice = maxPrice ? Number(p.price) <= Number(maxPrice) : true;
      const matchesType = propertyType ? p.category?.toLowerCase() === propertyType.toLowerCase() || p.type?.toLowerCase() === propertyType.toLowerCase() : true;
      const matchesBeds = bedrooms ? String(p.bedrooms) === String(bedrooms) : true;
      return matchesCity && matchesPrice && matchesType && matchesBeds;
    });

    // Sorting
    if (sortBy === "price_low") result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "price_high") result.sort((a, b) => Number(b.price) - Number(a.price));
    
    return result;
  }, [properties, searchCity, maxPrice, propertyType, bedrooms, sortBy]);

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
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <Navbar />

      {/* HERO & ADVANCED SEARCH SECTION */}
      <section className="bg-slate-900 text-white pt-32 pb-24 px-6 relative overflow-hidden">
         <div className="absolute inset-0 opacity-30" 
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2000&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
         
         <div className="relative z-10 max-w-5xl mx-auto text-center">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block">
              Properties for Sale
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
              Find Your <span className="text-red-500">Dream Home</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-light">
              Explore India's most premium apartments, villas, and plots. Verified listings, direct seller contact, zero hassle.
            </p>

            {/* ADVANCED SEARCH WIDGET */}
            <div className="bg-white p-3 rounded-2xl md:rounded-full mx-auto flex flex-col md:flex-row shadow-2xl items-center border border-slate-200">
               <div className="w-full md:flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100">
                  <MapPin className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
                  <input 
                    type="text" placeholder="City or Locality..." 
                    value={searchCity} onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 font-medium"
                  />
               </div>
               
               <div className="w-full md:w-48 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 relative group">
                  <Home className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
                  <select 
                    value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot</option>
                  </select>
                  <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none"/>
               </div>

               <div className="w-full md:w-48 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 relative">
                  <DollarSign className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
                  <select 
                    value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">Max Budget</option>
                    <option value="5000000">₹ 50 Lacs</option>
                    <option value="10000000">₹ 1 Crore</option>
                    <option value="50000000">₹ 5 Crore</option>
                  </select>
                  <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none"/>
               </div>

               <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 rounded-xl md:rounded-full w-full md:w-auto mt-2 md:mt-0 shadow-lg md:ml-2">
                  <Search className="w-5 h-5 md:mr-2" /> <span className="md:inline hidden">Search</span>
               </Button>
            </div>
         </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
           <div>
              <h2 className="text-2xl font-black text-slate-900">Properties for Sale</h2>
              <p className="text-slate-500 font-medium mt-1">Found {filteredAndSortedProperties.length} verified listings</p>
           </div>
           <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-2"/>
                <select 
                  value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent outline-none text-sm font-bold text-slate-700 cursor-pointer appearance-none pr-4"
                >
                  <option value="newest">Sort By: Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-red-600 animate-spin" /></div>
        ) : filteredAndSortedProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <Search className="w-8 h-8 text-slate-300"/>
             </div>
             <h3 className="text-xl font-bold text-slate-700">No properties found</h3>
             <p className="text-slate-500 mt-2">Try removing some filters to see more results.</p>
             <Button onClick={() => {setSearchCity(""); setMaxPrice(""); setPropertyType("");}} className="mt-4 bg-red-50 text-red-600 hover:bg-red-100 font-bold">
               Clear All Filters
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProperties.map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all duration-300 group cursor-pointer flex flex-col"
                  onClick={() => setSelectedProperty(property)} // OPENS MODAL
                >
                  {/* Image Area */}
                  <div className="h-60 relative overflow-hidden p-2">
                     <div className="w-full h-full rounded-3xl overflow-hidden relative">
                       <img 
                         src={property.imageUrl} 
                         alt={property.title}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                       <div className="absolute top-3 left-3 flex flex-col gap-2">
                         <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-lg text-xs font-black uppercase shadow-sm flex items-center gap-1">
                           <ShieldCheck className="w-3 h-3 text-green-600"/> Verified
                         </span>
                       </div>
                     </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 pt-4 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
                          {property.category || property.type || 'Property'}
                        </p>
                     </div>
                     <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                       {property.title}
                     </h3>
                     <p className="text-slate-500 text-sm flex items-center mb-4">
                       <MapPin className="w-4 h-4 mr-1 text-slate-400"/> {property.location}, {property.city}
                     </p>

                     {/* Features */}
                     <div className="grid grid-cols-3 gap-2 mb-6 text-slate-600 text-sm font-bold">
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Bed className="w-4 h-4 text-slate-400 mb-1"/> {property.bedrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Bath className="w-4 h-4 text-slate-400 mb-1"/> {property.bathrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Maximize className="w-4 h-4 text-slate-400 mb-1"/> {property.area || property.size || '-'} <span className="text-[10px] font-normal">sqft</span>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Price</p>
                          <span className="text-2xl font-black text-slate-900">
                             ₹{property.price >= 10000000 ? (property.price / 10000000).toFixed(2) + ' Cr' : (property.price / 100000).toFixed(2) + ' Lac'}
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
        )}
      </section>

      {/* COMPACT INTERACTIVE EMI CALCULATOR */}
      <section className="py-16 px-6 bg-white border-t border-slate-200">
         <div className="max-w-7xl mx-auto bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
            
            <div className="md:w-1/2 relative z-10 text-white">
               <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-600/30">
                 <Calculator className="w-6 h-6 text-white"/>
               </div>
               <h2 className="text-3xl font-black mb-4">Plan Your Purchase</h2>
               <p className="text-slate-400 mb-8 leading-relaxed">
                 Use our interactive mortgage calculator to estimate your monthly payments. Adjust the sliders to see how loan amount and tenure affect your EMI.
               </p>
               
               <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                 <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Estimated EMI</p>
                 <p className="text-5xl font-black text-red-500 font-mono">₹{calculateEMI().toLocaleString('en-IN')}<span className="text-lg text-slate-400 font-sans"> /mo</span></p>
               </div>
            </div>

            <div className="md:w-1/2 w-full relative z-10 space-y-6 bg-white p-8 rounded-3xl shadow-xl text-slate-900">
               <div>
                 <div className="flex justify-between text-sm mb-2 font-bold">
                   <span className="text-slate-500">Loan Amount</span>
                   <span className="text-slate-900 text-lg">₹{loanAmt.toLocaleString('en-IN')}</span>
                 </div>
                 <input type="range" min="1000000" max="100000000" step="500000" value={loanAmt} onChange={(e)=>setLoanAmt(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
               </div>
               
               <div>
                 <div className="flex justify-between text-sm mb-2 font-bold">
                   <span className="text-slate-500">Interest Rate</span>
                   <span className="text-slate-900 text-lg">{intRate}% p.a.</span>
                 </div>
                 <input type="range" min="6" max="12" step="0.1" value={intRate} onChange={(e)=>setIntRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
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
      </section>
      
      {/* FOOTER */}
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
                     <span className="bg-red-600 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">{selectedProperty.category}</span>
                     <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold capitalize">{selectedProperty.type}</span>
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
                      <p className="text-sm text-slate-500 font-medium">Bedrooms / Bathrooms</p>
                      <p className="text-lg font-bold text-slate-900">{selectedProperty.bedrooms} Bed, {selectedProperty.bathrooms} Bath</p>
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
                   <Home className="w-4 h-4 text-red-600"/>
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
