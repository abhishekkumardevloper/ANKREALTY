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

// --- PREMIUM IMAGE GENERATOR ---
const generateImage = (category, index) => {
  const residentialImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'  
  ];

  const commercialImages = [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=1200&q=80'  
  ];

  if (category === 'Commercial') {
    return commercialImages[index % commercialImages.length];
  }
  
  const safeIndex = (typeof index === 'number' ? index : index?.length || 0) % residentialImages.length;
  return residentialImages[safeIndex];
};

// --- RICH HARDCODED PROPERTY DATA ---
const propertyListings = [
  // FRESH PROPERTIES - NOIDA RESIDENTIAL
  { 
    id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sec 151', category: 'buy', type: 'apartment', bedrooms: 4, bathrooms: 4, price: 18500000, area: 2400, 
    description: 'Discover the epitome of luxury living at Experion Saatori, strategically located in the highly sought-after Sector 151, Noida. This premium residential development offers a harmonious blend of contemporary architecture and lush green landscapes, providing residents with a serene retreat from the bustling city. The meticulously designed apartments feature expansive layouts, floor-to-ceiling windows, and top-tier finishes that redefine modern elegance. Residents can indulge in a plethora of world-class amenities, including a state-of-the-art clubhouse, infinity swimming pool, fully equipped gymnasium, and dedicated sports facilities. With seamless connectivity to major expressways, corporate hubs, and premier educational institutions, Experion Saatori is not just a home, but a lifestyle statement for those who seek the very best in urban living and unparalleled comfort.', 
    imageUrl: generateImage('Residential', 0) 
  },
  { 
    id: 'f2', title: 'Smart World Elie Saab', city: 'Noida', location: 'Sec 98', category: 'buy', type: 'villa', bedrooms: 5, bathrooms: 5, price: 22000000, area: 3100, 
    description: 'Step into a realm of unmatched elegance at Smart World Elie Saab, an exclusive designer residential enclave situated in the heart of Sector 98. Conceptualized by globally renowned designers, this iconic property brings haute couture to real estate. Every inch of these majestic residences exudes sophistication, featuring bespoke interiors, imported marble flooring, and panoramic views of the city skyline. The development boasts an exclusive residents-only lounge, a temperature-controlled indoor pool, private cabanas, and a wellness spa that rivals five-star resorts. Designed for the elite few, the property ensures absolute privacy with dedicated elevators and multi-tier security. Its prime location guarantees that high-end shopping avenues, fine dining restaurants, and top corporate centers are merely a stone’s throw away.', 
    imageUrl: generateImage('Residential', 1) 
  },
  { 
    id: 'f3', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sec 97', category: 'buy', type: 'apartment', bedrooms: 4, bathrooms: 5, price: 35000000, area: 4500, 
    description: 'Experience the pinnacle of ultra-luxury real estate at M3M Jacob & Co in Sector 97. This architectural masterpiece is inspired by the meticulous craftsmanship of luxury horology and fine jewelry. The magnificent towers pierce the skyline, offering opulent, sweeping residences that redefine grand living. Each apartment is a sprawling canvas of luxury, featuring double-height ceilings, private plunge pools, and expansive terraces that invite natural light and fresh air. The extravagant clubhouse is an architectural marvel in itself, offering a private cinema, a cigar lounge, a gourmet restaurant, and a cascading infinity pool. Living here means embracing a lifestyle reserved for global citizens, surrounded by impeccable aesthetics and the very highest standards of personalized concierge services.', 
    imageUrl: generateImage('Residential', 2) 
  },
  { 
    id: 'f4', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 17500000, area: 2200, 
    description: 'Max Estate in Sector 105 represents the future of sustainable and tranquil residential living. Built on the philosophy of holistic well-being, this property seamlessly integrates nature with modern urban conveniences. The meticulously planned apartments are designed to maximize cross-ventilation and natural sunlight, significantly reducing the carbon footprint. Surrounded by acres of beautifully curated botanical gardens, therapeutic walkways, and pristine water bodies, it offers a peaceful sanctuary for families. The property includes a specialized wellness center, organic cafes, co-working spaces, and dedicated zones for yoga and meditation. With a strong focus on community living and eco-friendly infrastructure, Max Estate provides a unique opportunity to live a balanced, healthy, and elevated lifestyle right in the center of Noida.', 
    imageUrl: generateImage('Residential', 3) 
  },
  { 
    id: 'f5', title: 'RG Mirage', city: 'Noida', location: 'Sec 120', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 2, price: 11000000, area: 1600, 
    description: 'Welcome to RG Mirage, a premier residential destination in Sector 120 that promises a perfect blend of comfort, style, and exceptional value. These thoughtfully designed modern apartments cater specifically to the dynamic needs of contemporary urban families. Featuring smart space utilization, modular kitchens, and premium bath fittings, the interiors are both highly functional and aesthetically pleasing. The vibrant community features a sprawling central courtyard, safe kids’ play zones, a multi-purpose banquet hall, and a well-maintained swimming pool. Its strategic location provides residents with immediate access to reputed schools, mega commercial markets, and advanced healthcare facilities. RG Mirage is designed to foster a warm community atmosphere while offering the privacy and luxury you deserve.', 
    imageUrl: generateImage('Residential', 4) 
  },
  { 
    id: 'f6', title: 'Godrej Riverine', city: 'Noida', location: 'Sec 44', category: 'buy', type: 'apartment', bedrooms: 4, bathrooms: 4, price: 21000000, area: 2800, 
    description: 'Godrej Riverine in Sector 44 offers an extraordinary riverside luxury living experience crafted by one of India’s most trusted developers. Wake up to the soothing sights of gentle waters and lush green belts that surround this magnificent property. The residences are a masterclass in elegant design, offering expansive living areas, wrap-around balconies, and smart-home automation features. The project is heavily focused on creating an active and healthy lifestyle, featuring miles of jogging and cycling tracks, outdoor sports courts, a grand clubhouse, and dedicated pet parks. Situated in a highly developed and pristine neighborhood, it provides a quiet, pollution-free environment while keeping you seamlessly connected to South Delhi and major business hubs across the NCR.', 
    imageUrl: generateImage('Residential', 5) 
  },
  { 
    id: 'f7', title: 'M3M Cullinan', city: 'Noida', location: 'Sec 94', category: 'buy', type: 'apartment', bedrooms: 5, bathrooms: 6, price: 40000000, area: 5500, 
    description: 'M3M Cullinan stands as a monumental landmark of bespoke mega-luxury in Sector 94. Named after the world’s largest diamond, this property is the crown jewel of Noida’s real estate. It features palatial apartments that offer a sweeping, uninterrupted 360-degree view of the city and the river. Every residence is meticulously crafted with the finest global materials, offering features like private elevators, massive walk-in closets, and personal bar areas. The ultra-exclusive community amenities include a rooftop helipad, a high-end luxury retail boulevard at the podium level, a world-class spa, and fine dining establishments. This is an address of absolute prestige and power, designed for industry leaders and those who compromise on nothing.', 
    imageUrl: generateImage('Residential', 6) 
  },
  { 
    id: 'f8', title: 'Great Value Ekanam', city: 'Noida', location: 'Sec 107', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 14000000, area: 1950, 
    description: 'Great Value Ekanam in Sector 107 is synonymous with spacious, well-ventilated, and premium family homes. The architectural design places a heavy emphasis on Vastu compliance, ensuring positive energy and harmony within every apartment. The residences feature large bay windows, imported wooden flooring in master bedrooms, and highly efficient floor plans that eliminate dead spaces. The community is enveloped in lush greenery, featuring thematic gardens, a state-of-the-art fitness center, a sparkling swimming pool, and an exclusive residents’ club. Sector 107 is renowned for its tranquil environment and rapid infrastructural growth, making Great Value Ekanam an incredibly smart investment for those seeking a peaceful yet highly connected urban lifestyle.', 
    imageUrl: generateImage('Residential', 7) 
  },

  // FRESH PROPERTIES - NOIDA COMMERCIAL (Treated as plots/commercial)
  { 
    id: 'c1', title: 'M3M Line', city: 'Noida', location: 'Sec 72', category: 'buy', type: 'plot', bedrooms: 0, bathrooms: 1, price: 8000000, area: 500, 
    description: 'M3M Line is poised to become the ultimate high-street commercial destination in Sector 72. Designed to attract massive daily footfall, this state-of-the-art commercial hub offers a brilliant mix of premium retail spaces, gourmet food courts, and modern office suites. The architecture features an open-to-sky courtyard, striking glass facades, and high-speed escalators, ensuring maximum visibility for every brand. With multi-level basement parking and round-the-clock security, it provides a seamless experience for both business owners and consumers. Its location in a densely populated upscale residential catchment area guarantees high returns on investment and unmatched business growth opportunities for retail brands, cafes, and boutique businesses.', 
    imageUrl: generateImage('Commercial', 0) 
  },
  { 
    id: 'c2', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', type: 'plot', bedrooms: 0, bathrooms: 2, price: 12000000, area: 1200, 
    description: 'Redefine your corporate identity at Max Estate, Sector 105, offering elite Grade A office spaces. This architectural marvel is designed to foster productivity, innovation, and employee well-being. The building is LEED-certified, featuring smart climate control, energy-efficient lighting, and advanced air filtration systems. Tenants will enjoy grand double-height lobbies, high-speed destination-controlled elevators, and beautifully landscaped breakout zones. The property also houses premium cafeterias, conference facilities, and an executive lounge. Perfect for multinational corporations and fast-growing startups, Max Estate provides an unparalleled professional environment that leaves a lasting impression on clients and ensures a thriving workplace culture.', 
    imageUrl: generateImage('Commercial', 1) 
  },
  { 
    id: 'c3', title: 'Paras Avenue', city: 'Noida', location: 'Sec 129', category: 'buy', type: 'plot', bedrooms: 0, bathrooms: 1, price: 6500000, area: 450, 
    description: 'Paras Avenue in Sector 129 is a revolutionary premium high-street retail and lifestyle destination. This brilliantly conceptualized commercial project combines the luxury of a mall with the vibrancy of an open-air market. The development features double-height retail shops, creating grand storefronts that demand attention. Alongside premium retail, it offers dedicated floors for entertainment, wellness centers, and fine dining restaurants with open-air terrace seating. Situated right on the Noida-Greater Noida Expressway, Paras Avenue boasts unparalleled visibility and accessibility. It is surrounded by affluent residential sectors and massive IT parks, ensuring a continuous stream of premium customers and guaranteeing highly lucrative rental yields for investors.', 
    imageUrl: generateImage('Commercial', 2) 
  },

  // FRESH PROPERTIES - GREATER NOIDA WEST
  { 
    id: 'gw1', title: 'Fusion – The Brook', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', type: 'apartment', bedrooms: 2, bathrooms: 2, price: 8500000, area: 1300, 
    description: 'Embrace a serene, nature-inspired lifestyle at Fusion – The Brook, located in the rapidly developing Sector 12 of Greater Noida West. This property is designed around central water features and lush landscaping, offering a tranquil escape from city noise. The apartments are meticulously crafted to provide maximum natural light, featuring spacious balconies that overlook the beautiful central courtyard. Residents can enjoy an array of premium amenities, including a lavish clubhouse, a modern gymnasium, a swimming pool, and dedicated jogging tracks. With close proximity to upcoming metro stations, reputed schools, and shopping arcades, it offers an ideal environment for families looking for a balanced and vibrant lifestyle.', 
    imageUrl: generateImage('Residential', 0) 
  },
  { 
    id: 'gw2', title: 'Yatharth Eternia', city: 'Greater Noida West', location: 'Tech Zone 4', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 2, price: 9200000, area: 1450, 
    description: 'Yatharth Eternia brings modern, upscale living right to the heart of Tech Zone 4 in Greater Noida West. This highly sought-after residential project is defined by its robust construction quality and elegant architectural design. The spacious apartments are tailored for modern families, featuring open-plan living areas, designer fittings, and smart security systems. The project is packed with world-class facilities, including an Olympic-sized swimming pool, indoor sports arenas, a massive community hall, and beautifully manicured gardens. Its strategic location right next to major IT hubs and commercial parks makes it incredibly convenient for working professionals, offering a minimal commute and maximum time for family and recreation.', 
    imageUrl: generateImage('Residential', 1) 
  },
  { 
    id: 'gw3', title: 'VVIP Addresses', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 10500000, area: 1650, 
    description: 'Live like royalty at VVIP Addresses, a highly prestigious residential enclave in Sector 12, Greater Noida West. This development sets a new benchmark for luxury in the region, offering grand, well-appointed homes with sophisticated interiors. The property features a majestic entrance gate, sweeping driveways, and magnificent towers that offer panoramic views of the city. The clubhouse is a masterpiece of leisure, offering everything from a lavish spa and salon to a private bowling alley and an elegant restaurant. Designed for modern families who desire a status-driven lifestyle, the project ensures top-tier security, immaculate maintenance, and a vibrant community atmosphere of like-minded individuals.', 
    imageUrl: generateImage('Residential', 2) 
  },

  // RESALE PROPERTIES - NOIDA
  ...['Lotus Panache – Sec 110', 'Lotus Boulevard – Sec 100', 'Great Value Sharnam – Sec 107', 'Prateek Stylome – Sec 45', 'Mahagun Moderne – Sec 78'].map((name, i) => {
    const title = name.split(' – ')[0];
    const location = name.split(' – ')[1];
    return {
      id: `rs${i}`, title: title, city: 'Noida', location: location, category: 'buy', type: 'apartment', bedrooms: 3, bathrooms: 3, price: 12000000 + (i * 1000000), area: 1500 + (i * 100), 
      description: `Presenting an exceptional resale opportunity at ${title}, prominently located in the highly desirable ${location} of Noida. This magnificent ready-to-move-in residential property offers an unparalleled lifestyle, seamlessly combining modern architectural brilliance with everyday functional comfort. Spanning a generous ${1500 + (i * 100)} square feet, the apartment features meticulously crafted interiors, premium imported flooring, modular wardrobes, and expansive balconies that offer breathtaking, unobstructed views of the surrounding skyline. The living spaces are bathed in natural light and highly ventilated, ensuring a warm, inviting, and healthy atmosphere for your family. Residents will have exclusive, immediate access to a wide array of premium, fully operational amenities, including a resort-style swimming pool, a state-of-the-art fitness center, landscaped podium gardens, indoor sports courts, and 24/7 multi-tier security. Its strategic location ensures effortless connectivity to key commercial IT hubs, top-tier international schools, and world-class healthcare facilities, making it a spectacular choice for discerning homebuyers seeking immediate possession of luxury and convenience.`, 
      imageUrl: generateImage('Residential', i + 3)
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
                  onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
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
      
      {/* FOOTER - Matched to HomePage & DetailPage layout */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800">
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
                <li><Link to="/buy" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Apartments</Link></li>
                <li><Link to="/buy" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Villas</Link></li>
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
