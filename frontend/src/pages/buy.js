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

// --- EXPLICIT HARDCODED PROPERTY DATA WITH 4 IMAGES EACH ---
const propertyListings = [
  // FRESH PROPERTIES - NOIDA RESIDENTIAL
  { 
    id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sec 151', category: 'buy', type: 'apartment', bedrooms: 4, bathrooms: 4, price: 18500000, area: 2400, 
    description: 'Discover the epitome of luxury living at Experion Saatori, strategically located in the highly sought-after Sector 151, Noida.', 
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
    ]
  },
  { 
    id: 'f2', title: 'Smart World Elie Saab', city: 'Noida', location: 'Sec 98', category: 'buy', type: 'villa', bedrooms: 5, bathrooms: 5, price: 22000000, area: 3100, 
    description: 'Step into a realm of unmatched elegance at Smart World Elie Saab, an exclusive designer residential enclave.', 
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'
    ]
  },
  { 
    id: 'f3', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sec 97', category: 'buy', type: 'apartment', bedrooms: 4, bathrooms: 5, price: 35000000, area: 4500, 
    description: 'Experience the pinnacle of ultra-luxury real estate at M3M Jacob & Co in Sector 97.', 
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80'
    ]
  },
  { 
    id: 'f4', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 17500000, area: 2200, 
    description: 'Max Estate in Sector 105 represents the future of sustainable and tranquil residential living.', 
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80',
      'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80'
    ]
  },
  { 
    id: 'f5', title: 'RG Mirage', city: 'Noida', location: 'Sec 120', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 2, price: 11000000, area: 1600, 
    description: 'Welcome to RG Mirage, a premier residential destination in Sector 120 that promises a perfect blend of comfort.', 
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'
    ]
  },
  { 
    id: 'f6', title: 'Godrej Riverine', city: 'Noida', location: 'Sec 44', category: 'buy', type: 'apartment', bedrooms: 4, bathrooms: 4, price: 21000000, area: 2800, 
    description: 'Godrej Riverine in Sector 44 offers an extraordinary riverside luxury living experience.', 
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=1200&q=80'
    ]
  },
  { 
    id: 'f7', title: 'M3M Cullinan', city: 'Noida', location: 'Sec 94', category: 'buy', type: 'apartment', bedrooms: 5, bathrooms: 6, price: 40000000, area: 5500, 
    description: 'M3M Cullinan stands as a monumental landmark of bespoke mega-luxury in Sector 94.', 
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80'
    ]
  },
  { 
    id: 'f8', title: 'Great Value Ekanam', city: 'Noida', location: 'Sec 107', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 14000000, area: 1950, 
    description: 'Great Value Ekanam in Sector 107 is synonymous with spacious, well-ventilated, and premium family homes.', 
    images: [
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
      'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80'
    ]
  },

  // FRESH PROPERTIES - NOIDA COMMERCIAL (Plots/Commercial)
  { 
    id: 'c1', title: 'M3M Line', city: 'Noida', location: 'Sec 72', category: 'buy', type: 'plot', bedrooms: 0, bathrooms: 1, price: 8000000, area: 500, 
    description: 'M3M Line is poised to become the ultimate high-street commercial destination in Sector 72.', 
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=80',
      'https://images.unsplash.com/photo-1556800045-89b531dc1b76?w=1200&q=80'
    ]
  },
  { 
    id: 'c2', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', type: 'plot', bedrooms: 0, bathrooms: 2, price: 12000000, area: 1200, 
    description: 'Redefine your corporate identity at Max Estate, Sector 105, offering elite Grade A office spaces.', 
    images: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'
    ]
  },
  { 
    id: 'c3', title: 'Paras Avenue', city: 'Noida', location: 'Sec 129', category: 'buy', type: 'plot', bedrooms: 0, bathrooms: 1, price: 6500000, area: 450, 
    description: 'Paras Avenue in Sector 129 is a revolutionary premium high-street retail and lifestyle destination.', 
    images: [
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=80',
      'https://images.unsplash.com/photo-1556800045-89b531dc1b76?w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80'
    ]
  },

  // FRESH PROPERTIES - GREATER NOIDA WEST
  { 
    id: 'gw1', title: 'Fusion – The Brook', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', type: 'apartment', bedrooms: 2, bathrooms: 2, price: 8500000, area: 1300, 
    description: 'Embrace a serene, nature-inspired lifestyle at Fusion – The Brook, located in Sector 12.', 
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=1200&q=80'
    ]
  },
  { 
    id: 'gw2', title: 'Yatharth Eternia', city: 'Greater Noida West', location: 'Tech Zone 4', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 2, price: 9200000, area: 1450, 
    description: 'Yatharth Eternia brings modern, upscale living right to the heart of Tech Zone 4 in Greater Noida West.', 
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80'
    ]
  },
  { 
    id: 'gw3', title: 'VVIP Addresses', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 10500000, area: 1650, 
    description: 'Live like royalty at VVIP Addresses, a highly prestigious residential enclave in Sector 12.', 
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80',
      'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&q=80'
    ]
  },

  // RESALE PROPERTIES - NOIDA (Mapped explicitly to 4 images)
  ...['Lotus Panache – Sec 110', 'Lotus Boulevard – Sec 100', 'Great Value Sharnam – Sec 107', 'Prateek Stylome – Sec 45', 'Mahagun Moderne – Sec 78'].map((name, i) => {
    const title = name.split(' – ')[0];
    const location = name.split(' – ')[1];
    
    // Explicit array of 4 images for the resale maps to ensure they all get 4.
    const mappedImages = [
      [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
        'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80'
      ],
      [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'
      ],
      [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80',
        'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&q=80'
      ],
      [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=1200&q=80'
      ],
      [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
        'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80'
      ]
    ];

    return {
      id: `rs${i}`, title: title, city: 'Noida', location: location, category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 12000000 + (i * 1000000), area: 1500 + (i * 100), 
      description: `Presenting an exceptional resale opportunity at ${title}, prominently located in the highly desirable ${location} of Noida.`, 
      images: mappedImages[i % mappedImages.length]
    };
  })
];

export default function BuyPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

  // FETCH DATA
  useEffect(() => {
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
            <span className="bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              Properties for Sale
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">Dream Home</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-light">
              Explore India's most premium apartments, villas, and plots. Verified listings, direct seller contact, zero hassle.
            </p>

            {/* ADVANCED SEARCH WIDGET */}
            <div className="bg-white p-3 rounded-2xl md:rounded-full mx-auto flex flex-col md:flex-row shadow-2xl items-center border border-[#D4AF37]/20">
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

               <Button className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-12 px-8 rounded-xl md:rounded-full w-full md:w-auto mt-2 md:mt-0 shadow-lg shadow-[#8B0000]/30 md:ml-2 transition-all">
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
              <div className="flex items-center bg-white border border-slate-200 hover:border-[#D4AF37]/50 transition-colors rounded-lg px-3 py-2 shadow-sm">
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
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#8B0000] animate-spin" /></div>
        ) : filteredAndSortedProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <Search className="w-8 h-8 text-slate-300"/>
             </div>
             <h3 className="text-xl font-bold text-slate-700">No properties found</h3>
             <p className="text-slate-500 mt-2">Try removing some filters to see more results.</p>
             <Button onClick={() => {setSearchCity(""); setMaxPrice(""); setPropertyType("");}} className="mt-4 bg-[#D4AF37]/10 text-[#8B0000] hover:bg-[#D4AF37]/20 font-bold">
               Clear All Filters
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProperties.map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-300 group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                >
                  {/* Image Area - PULLS THE FIRST IMAGE FROM THE ARRAY OF 4 */}
                  <div className="h-60 relative overflow-hidden p-2">
                     <div className="w-full h-full rounded-3xl overflow-hidden relative">
                       <img 
                         src={property.images[0]} 
                         alt={property.title}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                       <div className="absolute top-3 left-3 flex flex-col gap-2">
                         <span className="bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-lg text-xs font-black uppercase shadow-sm flex items-center gap-1">
                           <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]"/> Verified
                         </span>
                       </div>
                     </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 pt-4 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-2">
                        <p className="text-[#8B0000] text-xs font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                          {property.category || property.type || 'Property'}
                        </p>
                     </div>
                     <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1 group-hover:text-[#8B0000] transition-colors">
                       {property.title}
                     </h3>
                     <p className="text-slate-500 text-sm flex items-center mb-4">
                       <MapPin className="w-4 h-4 mr-1 text-slate-400"/> {property.location}, {property.city}
                     </p>

                     {/* Features */}
                     <div className="grid grid-cols-3 gap-2 mb-6 text-slate-600 text-sm font-bold">
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Bed className="w-4 h-4 text-[#D4AF37] mb-1"/> {property.bedrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Bath className="w-4 h-4 text-[#D4AF37] mb-1"/> {property.bathrooms || '-'}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-50 py-2 rounded-xl border border-slate-100">
                          <Maximize className="w-4 h-4 text-[#D4AF37] mb-1"/> {property.area || property.size || '-'} <span className="text-[10px] font-normal">sqft</span>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Price</p>
                          <span className="text-2xl font-black text-slate-900">
                             ₹{property.price >= 10000000 ? (property.price / 10000000).toFixed(2) + ' Cr' : (property.price / 100000).toFixed(2) + ' Lac'}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#8B0000] group-hover:text-[#D4AF37] transition-colors">
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
         <div className="max-w-7xl mx-auto bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group hover:border-[#D4AF37]/50 border border-transparent transition-colors">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
            
            <div className="md:w-1/2 relative z-10 text-white">
               <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6 shadow-inner border border-[#D4AF37]/30">
                 <Calculator className="w-6 h-6 text-[#D4AF37]"/>
               </div>
               <h2 className="text-3xl font-black mb-4">Plan Your Purchase</h2>
               <p className="text-slate-400 mb-8 leading-relaxed">
                 Use our interactive mortgage calculator to estimate your monthly payments. Adjust the sliders to see how loan amount and tenure affect your EMI.
               </p>
               
               <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                 <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Estimated EMI</p>
                 <p className="text-5xl font-black text-[#8B0000] font-mono">₹{calculateEMI().toLocaleString('en-IN')}<span className="text-lg text-slate-400 font-sans"> /mo</span></p>
               </div>
            </div>

            <div className="md:w-1/2 w-full relative z-10 space-y-6 bg-white p-8 rounded-3xl shadow-xl text-slate-900">
               <div>
                 <div className="flex justify-between text-sm mb-2 font-bold">
                   <span className="text-slate-500">Loan Amount</span>
                   <span className="text-[#8B0000] text-lg font-black">₹{loanAmt.toLocaleString('en-IN')}</span>
                 </div>
                 <input type="range" min="1000000" max="100000000" step="500000" value={loanAmt} onChange={(e)=>setLoanAmt(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]" />
               </div>
               
               <div>
                 <div className="flex justify-between text-sm mb-2 font-bold">
                   <span className="text-slate-500">Interest Rate</span>
                   <span className="text-[#8B0000] text-lg font-black">{intRate}% p.a.</span>
                 </div>
                 <input type="range" min="6" max="12" step="0.1" value={intRate} onChange={(e)=>setIntRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]" />
               </div>

               <div>
                 <div className="flex justify-between text-sm mb-2 font-bold">
                   <span className="text-slate-500">Loan Tenure</span>
                   <span className="text-[#8B0000] text-lg font-black">{tenure} Years</span>
                 </div>
                 <input type="range" min="5" max="30" step="1" value={tenure} onChange={(e)=>setTenure(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]" />
               </div>
            </div>
         </div>
      </section>
      
      {/* FOOTER */}
      <footer className="bg-[#050505] text-white pt-20 pb-10 px-6 border-t-[6px] border-[#8B0000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#D4AF37]">ANK <span className="text-white">REALTY</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service, transparency, and expertise in the Indian real estate market.
              </p>
              <div className="flex space-x-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer group"><Mail className="w-4 h-4 group-hover:scale-110 transition-transform"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer group"><Phone className="w-4 h-4 group-hover:scale-110 transition-transform"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Buy Property</Link></li>
                <li><Link to="/sell" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Sell Property</Link></li>
                <li><Link to="/rent" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Rent Property</Link></li>
                <li><Link to="/contact" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Apartments</Link></li>
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Villas</Link></li>
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Plots / Land</Link></li>
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Commercial Space</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium text-sm">
                <div className="flex items-start bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <MapPin className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs">123 Business Avenue, Tech Park, Mumbai, 400001</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Mail className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs">info@ankrealty.com</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Phone className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* --- FLOATING CHATBOT --- */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 border border-[#D4AF37]/30 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
            <div className="bg-[#050505] text-[#D4AF37] border-b border-[#D4AF37]/30 p-4 font-bold flex justify-between items-center shadow-md relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                ANK AI Assistant
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-slate-800 text-slate-300 hover:text-white p-1 rounded-md transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="p-4 flex-1 bg-slate-50 flex flex-col gap-3 h-[380px] overflow-y-auto">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-sm">
                   <Home className="w-4 h-4 text-[#8B0000]"/>
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm border border-slate-100 text-slate-700">
                  Welcome to ANK Realty! I am your virtual assistant. Please choose a subject below so I can assist you better:
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-2 pl-10">
                {chatSubjects.map((subject, i) => (
                  <button key={i} className="text-left bg-white hover:bg-[#8B0000]/5 text-slate-700 hover:text-[#8B0000] p-2.5 rounded-xl text-sm font-medium transition-all border border-slate-200 hover:border-[#D4AF37]/50 shadow-sm">
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[#D4AF37]" />
              <button className="bg-[#8B0000] text-white p-2 rounded-full hover:bg-[#600000] shadow-md shadow-[#8B0000]/30 transition-colors">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsChatOpen(true)} 
            className="bg-[#8B0000] hover:bg-[#600000] border-2 border-white/10 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(139,0,0,0.4)] hover:scale-110 transition-transform flex items-center justify-center group"
          >
            <MessageSquare className="w-7 h-7" />
            <span className="absolute right-full mr-4 bg-[#050505] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              Chat with us!
            </span>
          </button>
        )}
      </div>

    </div>
  );
}
