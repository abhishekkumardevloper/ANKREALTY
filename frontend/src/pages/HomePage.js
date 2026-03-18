import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Home, Heart, ArrowRight, Star, 
  Building, CheckCircle, Key, FileText, Loader2, Mail, 
  TrendingUp, Calculator, Shield, BookOpen, Phone,
  ChevronRight, ChevronLeft, Map, Banknote, X, MessageSquare, Send,
  Building2, Briefcase, Ruler, Users, Award, ThumbsUp, Quote, Newspaper, Bell,
  Instagram, Youtube, Linkedin, Share2, Image as ImageIcon, Plus, Minus,
  ShieldCheck, Coffee, Zap, ArrowUpDown, Dumbbell, Droplets, Wind
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RegisterPopup from "./RegisterPopup"; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ==========================================
// 1. ASSETS & LOGOS
// ==========================================
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

const generateImages = (category, count = 4) => {
  const plotImages = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1629245199850-9f584e2a8c30?auto=format&fit=crop&w=1200&q=80'
  ];
  const residentialImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  ];
  const commercialImages = [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  ];

  const source = category === 'Plot' ? plotImages : category === 'Commercial' ? commercialImages : residentialImages;
  return Array.from({ length: count }, (_, i) => source[(i + Math.floor(Math.random() * source.length)) % source.length]);
};

// ==========================================
// 2. MASSIVE PROPERTY DATA (ENHANCED)
// ==========================================

const enrichProperty = (p) => ({
  ...p,
  builder: p.builder || p.title.split(' ')[0],
  bhk: p.type === 'Plot' ? 'Residential Land' : p.type === 'Commercial' ? 'Retail / Office' : (Math.floor(Math.random() * 3) + 2) + ' BHK',
  status: p.tag === 'Fresh' ? 'Under Construction' : 'Ready to Move',
  rera: p.rera !== undefined ? p.rera : `UPRERA-PRJ${Math.floor(1000 + Math.random() * 9000)}`,
  images: generateImages(p.type, 3),
  priceText: p.priceText || `₹ ${(p.price / 10000000).toFixed(2)} CR* Onwards`,
  highlights: p.highlights || ['Premium Location', '24/7 Security', 'High ROI Potential', 'Modern Amenities'],
  descriptionParagraphs: p.descriptionParagraphs || [
    p.description || "Premium real estate development offering unmatched lifestyle amenities and strategic connectivity.",
    "The project spans across lush green acres, offering a meticulously planned layout with world-class infrastructure. Residents will enjoy state-of-the-art facilities including underground electrical cabling, robust 24/7 municipal water supply systems, and an advanced, clog-free drainage network designed to handle heavy monsoons effortlessly.",
    "Security is paramount. The entire perimeter is secured with a high-walled gated enclosure, topped with modern fencing. 24/7 CCTV surveillance covers all crucial junctions, and strict, manned entry points ensure absolute peace of mind for your family. The community is thoughtfully curated to foster a high standard of living, featuring lifestyle amenities such as a modern community center, a fully equipped open-air gymnasium, and beautifully landscaped jogging tracks."
  ],
  amenities: p.amenities || ['24/7 Security', 'Club House', 'Gymnasium', 'Power Backup', 'Landscaped Gardens']
});

export const propertiesData = [
  // --- PLOTS ---
  { 
    id: 'p1', title: 'Bajrang Vatika', city: 'Noida Extension', location: 'Sector 10', category: 'buy', tag: 'Fresh', type: 'Plot', price: 4500000, priceText: '₹ 45 L* Onwards', area: 1200, builder: 'ANK Realty Exclusive', rera: '', // Removed RERA
    descriptionParagraphs: [
      "Welcome to Bajrang Vatika, the most sought-after premium residential plotted development located in the rapidly expanding corridors of Noida Extension. Bajrang Vatika offers an unparalleled opportunity to build your dream home on a piece of premium earth. Situated strategically with seamless connectivity to major highways, this plotted development is designed for those who seek tranquility without compromising on urban conveniences.",
      "The project spans across lush green acres, offering a meticulously planned layout with wide internal roads measuring up to 40 feet, beautiful avenue plantations, and dedicated eco-friendly green zones. Residents will enjoy state-of-the-art infrastructure including underground electrical cabling, robust municipal water supply systems, and an advanced drainage network.",
      "Security is paramount, with a high-walled gated perimeter, 24/7 CCTV surveillance at all junctions, and strict manned entry points ensuring absolute peace of mind. Investing in Bajrang Vatika is not merely buying a plot of land; it is securing a lasting legacy for future generations in a community that inherently values harmony, nature, and modern living."
    ],
    highlights: ['40ft Wide Roads', 'Gated Society', 'Immediate Registry', 'Freehold Land'],
    amenities: ['24/7 Security', 'Underground Wiring', 'Community Parks', 'Wide Roads']
  },

  // --- RESIDENTIAL (FROM PROVIDED LIST) ---
  { 
    id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sec 151', category: 'buy', tag: 'Fresh', type: 'Residential', price: 18500000, area: 2400, 
    descriptionParagraphs: [
      "Experion Saatori is a premium residential development offering a harmonious blend of contemporary architecture and holistic living. Located in the highly accessible Sector 151 of Noida, this project redefines the skyline with its majestic towers and vast, open green spaces. Designed for the discerning few, it offers ultra-spacious residences with panoramic views of the surrounding landscapes.",
      "The interiors are meticulously crafted to provide maximum natural light and cross-ventilation, ensuring a healthy living environment. The project features a sprawling, multi-level clubhouse equipped with an Olympic-length swimming pool, a fully-loaded fitness center, dedicated squash and tennis courts, and private cinema rooms for residents. Every detail, from the imported marble flooring to the smart home automation, exudes luxury.",
      "With proximity to the upcoming Jewar International Airport and direct access to the Noida-Greater Noida Expressway, Experion Saatori is not just a dream home but a highly lucrative investment. The development incorporates sustainable green building practices, including rainwater harvesting and solar energy integration, ensuring a carbon-neutral footprint while delivering an opulent lifestyle."
    ]
  },
  { 
    id: 'f2', title: 'Smart World Elie Saab', city: 'Noida', location: 'Sec 98', category: 'buy', tag: 'Fresh', type: 'Residential', price: 22000000, area: 3100,
    descriptionParagraphs: [
      "Smart World Elie Saab presents an exclusive designer residential enclave conceptualized by globally renowned haute couture designers. Located in the affluent Sector 98 of Noida, this architectural masterpiece brings international fashion and real estate together. Every residence is a bespoke creation, featuring interiors styled and curated by the legendary Elie Saab, guaranteeing a living experience that is nothing short of spectacular.",
      "The floor-to-ceiling glass facades offer uninterrupted, breathtaking views of the adjacent golf course and the city skyline. Residents enjoy unparalleled privacy with exclusive elevator access directly opening into their private foyers. The lifestyle here is elevated by a 5-star concierge service, a private chef-on-demand, and a fully serviced luxury spa managed by international wellness brands.",
      "Strategically situated with seamless, signal-free connectivity to South Delhi and major corporate hubs, this project is designed for the global citizen. The central clubhouse acts as a sanctuary of indulgence, featuring infinity-edge pools, fine dining suites, and a business center. Investing here means acquiring a globally recognized trophy asset."
    ]
  },
  { 
    id: 'f3', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sec 97', category: 'buy', tag: 'Fresh', type: 'Residential', price: 35000000, area: 4500,
    descriptionParagraphs: [
      "M3M Jacob & Co stands as the absolute pinnacle of ultra-luxury real estate, inspired by the meticulous craftsmanship of high-end horology and jewelry. Located in Sector 97, this iconic skyscraper is destined to be the most coveted address in the National Capital Region. The residences are exceptionally expansive, offering palatial living spaces with ceiling heights that rival grand mansions.",
      "The building's architecture is a marvel, featuring a diamond-faceted glass exterior that glistens in the sunlight. Inside, the amenities are unmatched: a private helipad for residents, a multi-story sky club with a glass-bottom pool suspended in the air, and an exclusive residents-only luxury retail boutique. The security is military-grade, featuring biometric access and private security details.",
      "Every apartment comes with a private plunge pool and a massive wrap-around terrace. The collaboration with Jacob & Co ensures that the aesthetic detailing—from the lobby chandeliers to the elevator buttons—is crafted with precious materials. This is a limited-edition residential offering meant strictly for the ultra-high-net-worth individual seeking absolute exclusivity."
    ]
  },
  { 
    id: 'f4', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', tag: 'Fresh', type: 'Residential', price: 17500000, area: 2200,
    descriptionParagraphs: [
      "Max Estate in Sector 105 represents the future of sustainable and tranquil residential living. Built on the core philosophy of 'Wellbeing,' this boutique development integrates biophilic design elements throughout its architecture to foster physical, mental, and emotional health. With extremely low-density planning, it offers a peaceful oasis away from the urban chaos while keeping you connected to the city's heartbeat.",
      "The project boasts massive, wrap-around balconies that serve as private sky gardens, bringing nature directly into your living space. The construction utilizes sustainable, non-toxic materials, advanced central air filtration systems, and specialized water purification grids. The amenity ecosystem is focused on holistic wellness, featuring a state-of-the-art restorative spa, reflexology paths, and extensive organic community farming patches.",
      "Max Estates is renowned for its impeccable construction quality, timely delivery, and a post-handover facility management team that operates like a premium hospitality service. Located near top IT parks and premier educational institutions, this is the perfect sanctuary for modern families prioritizing health and luxury."
    ]
  },

  // --- COMMERCIAL (FROM PROVIDED LIST) ---
  { 
    id: 'c1', title: 'M3M Line', city: 'Noida', location: 'Sec 72', category: 'buy', tag: 'Commercial', type: 'Commercial', price: 8000000, area: 500,
    descriptionParagraphs: [
      "M3M Line is the ultimate high-street commercial destination offering a brilliant mix of premium retail spaces, multiplexes, and highly efficient corporate suites. Located strategically in Sector 72, Noida, this mega-project guarantees massive daily footfalls due to its position amidst a highly affluent and dense residential catchment area. The architecture is striking, designed to maximize brand visibility and consumer engagement.",
      "The retail zones feature triple-height storefronts, expansive boulevards, and a spectacular central plaza meant for high-energy promotional events and cultural festivals. The office spaces are fully equipped with intelligent building management systems, high-speed elevators, and automated multi-level parking to cater to modern corporate needs.",
      "Investing in M3M Line ensures aggressive capital appreciation and a high, stable rental yield backed by globally renowned brands looking for premium anchor spaces. With assured return plans and flexible payment options, this is a secure and highly lucrative commercial asset for visionary investors."
    ]
  },
  { 
    id: 'c2', title: 'Max Estate Commercial', city: 'Noida', location: 'Sec 105', category: 'buy', tag: 'Commercial', type: 'Commercial', price: 12000000, area: 1200,
    descriptionParagraphs: [
      "Redefine your corporate identity at Max Estate Commercial, an elite Grade A office space development in Sector 105, Noida. This futuristic business hub is designed for multinational corporations, leading IT firms, and dynamic startups that demand a world-class working environment. The architecture focuses on maximizing natural light and offering expansive, column-free floor plates for flexible interior layouts.",
      "The building is LEED-certified, featuring high-efficiency HVAC systems, solar power integration, and smart glass facades that reduce heat loads while maintaining stunning aesthetics. The ground level offers a curated selection of premium F&B outlets, cafes, and wellness centers, ensuring employees have access to lifestyle amenities without leaving the campus.",
      "Situated right on the main arterial roads with seamless access to the Noida Expressway and metro networks, Max Estate Commercial ensures your business is always connected. The professional facility management and high-tier security systems provide a zero-friction operational environment, making it a highly sought-after destination for corporate leasing."
    ]
  },

  // --- RESALE PROPERTIES MAP ---
  ...[
    'Lotus Panache – Sec 110', 'Lotus Boulevard – Sec 100', 'Great Value Sharnam – Sec 107', 
    'Prateek Stylome – Sec 45', 'Mahagun Moderne – Sec 78'
  ].map((name, i) => {
    const title = name.split(' – ')[0];
    const location = name.split(' – ')[1];
    return {
      id: `rs${i}`, title: title, city: 'Noida', location: location, category: 'buy', tag: 'Resale', type: 'Residential', price: 12000000 + (i * 1000000), area: 1500 + (i * 100), 
      descriptionParagraphs: [
        `Exceptional resale opportunity at ${title}. Located in the highly established and vibrant neighborhood of ${location}, this property offers the perfect blend of luxury, convenience, and immediate possession. Avoid the uncertainty of under-construction projects and move right into a fully functional, premium gated community.`,
        `The community is fully occupied and thriving, featuring active resident welfare associations, well-maintained clubhouses, operational swimming pools, and manicured green spaces. The apartment itself boasts a spacious, well-lit layout with premium fixtures, modular kitchen setups, and expansive balconies offering serene views of the central courtyard.`,
        `Strategically located near major expressways, metro stations, top-tier schools, and multi-specialty hospitals, ${title} ensures that all urban necessities are just a short walk away. With clear titles, updated registry documents, and a motivated seller, this property represents an excellent value proposition for both end-users and investors seeking immediate rental income.`
      ]
    };
  })
].map(enrichProperty);

// ==========================================
// 3. AUXILIARY DATA (TESTIMONIALS, BLOGS, FAQS)
// ==========================================
const testimonialsData = [
  { name: "Rahul Sharma", role: "IT Professional", review: "ANK Realty made finding our dream home in Noida a breeze. Their transparency and legal verification checks gave us complete peace of mind. Highly recommended!", rating: 5 },
  { name: "Priya Desai", role: "Business Owner", review: "I invested in a commercial space through ANK Realty. Their market insights were spot on, and the ROI has already exceeded my expectations within a year.", rating: 5 },
  { name: "Amit Verma", role: "NRI Investor", review: "Managing property investments from abroad is tough, but the team at ANK Realty handled everything perfectly—from virtual tours to the final registry.", rating: 5 },
  { name: "Sneha Kapoor", role: "Architect", review: "As an architect, I am very picky about layouts. The team understood exactly what I was looking for and found me the perfect plot to build my custom home.", rating: 5 },
];

const blogsData = [
  { title: "Top 5 Emerging Localities in NCR for 2026", date: "March 10, 2026", category: "Market Trends", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  { title: "A Complete Guide to Applying for Home Loans", date: "February 28, 2026", category: "Finance", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" },
  { title: "RERA Guidelines Every Homebuyer Must Know", date: "February 15, 2026", category: "Legal", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80" }
];

const faqs = [
  { question: "Why should I invest in a Plot over an Apartment?", answer: "Plots generally offer higher appreciation rates compared to apartments as land is a depreciating asset while the built structure depreciates. Furthermore, plots offer the flexibility to build a custom home according to your timeline and budget, and there are zero maintenance charges until you build." },
  { question: "What is RERA and why is it important?", answer: "RERA (Real Estate Regulatory Authority) is an act passed to protect homebuyers and boost investments in the real estate sector. A RERA-approved project ensures that the developer has submitted all legal titles, approvals, and construction timelines to the government, minimizing the risk of fraud or delays." },
  { question: "Does ANK Realty help with Home and Plot Loans?", answer: "Yes! ANK Realty has tie-ups with all leading nationalized and private banks (SBI, HDFC, ICICI, etc.). Our dedicated finance team assists you with the entire documentation process, ensuring quick approvals and the lowest possible interest rates." },
  { question: "Can NRIs buy property in India?", answer: "Yes, Non-Resident Indians (NRIs) and Persons of Indian Origin (PIOs) can legally purchase residential and commercial properties (including plots) in India under the general permission granted by the RBI. However, they cannot purchase agricultural land or plantation property." },
  { question: "What is the process of property registry?", answer: "The registry involves paying stamp duty and registration charges to the state government. ANK Realty's legal team handles the complete process—from drafting the sale deed to booking the appointment at the sub-registrar's office, ensuring a completely hassle-free experience for you." }
];

// ==========================================
// 4. REUSABLE UI COMPONENTS
// ==========================================

const SocialSidebar = () => (
  <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 pl-2">
    {[
      { icon: Heart, color: 'bg-slate-900 hover:bg-red-600' },
      { icon: Instagram, color: 'bg-gradient-to-tr from-yellow-500 to-pink-600 hover:scale-110' },
      { icon: Youtube, color: 'bg-red-600 hover:bg-red-700 hover:scale-110' },
      { icon: Linkedin, color: 'bg-blue-600 hover:bg-blue-700 hover:scale-110' },
      { icon: Phone, color: 'bg-emerald-500 hover:bg-emerald-600 hover:scale-110' } 
    ].map((social, idx) => (
      <button key={idx} className={`${social.color} w-10 h-10 flex items-center justify-center rounded-xl text-white shadow-lg transition-all border border-white/10`}>
        <social.icon className="w-5 h-5" />
      </button>
    ))}
  </div>
);

// STANDARD PROPERTY CARD (For Residential & Commercial)
const StandardPropertyCard = ({ property, navigate }) => {
  const [currentImg, setCurrentImg] = useState(0);

  const nextImg = (e) => { e.stopPropagation(); setCurrentImg((prev) => (prev + 1) % property.images.length); };
  const prevImg = (e) => { e.stopPropagation(); setCurrentImg((prev) => (prev - 1 + property.images.length) % property.images.length); };

  return (
    <div 
      onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
        <img src={property.images[currentImg]} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <span className="bg-red-600 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-md text-right">
            {property.tag}
          </span>
          {property.rera && (
            <span className="bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-md text-right flex items-center justify-end">
              <CheckCircle className="w-3 h-3 mr-1"/> {property.rera.split('-')[0]}
            </span>
          )}
        </div>

        <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-800 shadow-md transition-all z-10 opacity-0 group-hover:opacity-100"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-800 shadow-md transition-all z-10 opacity-0 group-hover:opacity-100"><ChevronRight className="w-5 h-5" /></button>
      </div>
      
      <div className="p-6 flex-1 flex flex-col bg-white">
        <div className="mb-3">
          <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold mb-3 border border-slate-200 uppercase tracking-wider">
            {property.type}
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 line-clamp-1 mb-1 group-hover:text-red-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-sm text-slate-500 font-medium flex items-center">
            <Building2 className="w-4 h-4 mr-1.5 text-slate-400" /> By {property.builder}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-center border-r border-slate-200 last:border-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Typology</p>
            <p className="text-sm font-bold text-slate-800 truncate">{property.bhk}</p>
          </div>
          <div className="text-center border-r border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Area</p>
            <p className="text-sm font-bold text-slate-800 flex items-center justify-center"><Ruler className="w-3 h-3 mr-1"/>{property.area}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Status</p>
            <p className="text-xs font-bold text-slate-800 truncate px-1 mt-0.5">{property.status}</p>
          </div>
        </div>

        <div className="mb-4 mt-auto">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Starting Price</p>
          <p className="text-2xl font-black text-slate-900 mb-1">
            {property.priceText}
          </p>
          <p className="text-sm text-slate-600 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-red-500" /> {property.location}, {property.city}
          </p>
        </div>
        
        <div className="pt-4 flex items-center gap-3 border-t border-slate-100">
          <Button className="flex-1 bg-slate-900 hover:bg-black text-white rounded-xl h-11 font-bold text-sm shadow-md transition-all">
            View Details <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <button className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// SPECIAL DETAILED PLOT CARD (For the massive plots section)
const DetailedPlotCard = ({ property, navigate }) => {
  return (
    <div 
      onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row cursor-pointer"
    >
      <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="bg-red-600 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-md mb-2 inline-block">
            Premium Land
          </span>
          <p className="text-white text-sm font-bold flex items-center"><MapPin className="w-4 h-4 mr-1 text-red-400"/> {property.location}, {property.city}</p>
        </div>
      </div>
      
      <div className="md:w-3/5 p-6 md:p-8 flex flex-col bg-white">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">
            {property.title}
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center shrink-0 ml-4 hidden sm:block">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Plot Sizes From</p>
            <p className="text-sm font-black text-slate-900">{property.area} Sq.Yd.</p>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 font-bold mb-4 flex items-center">
          {property.rera && <><ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-500"/> {property.rera} |</>} By {property.builder}
        </p>

        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {property.descriptionParagraphs[0]}
        </p>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {property.highlights.map((highlight, idx) => (
            <div key={idx} className="flex items-center text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <CheckCircle className="w-3.5 h-3.5 text-red-500 mr-2 shrink-0"/> {highlight}
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 gap-4">
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Investment Starts At</p>
            <p className="text-3xl font-black text-slate-900">{property.priceText}</p>
          </div>
          <Button className="w-full sm:w-auto px-8 bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 font-bold text-base shadow-lg shadow-red-600/20 transition-all">
            Explore Project
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. MAIN HOMEPAGE COMPONENT
// ==========================================

export default function HomePage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('buy');
  const [openFaq, setOpenFaq] = useState(null);
  
  // EMI CALCULATOR STATE
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
      setEmiResult({
        emi: Math.round(emi),
        totalInterest: Math.round((emi * n) - p),
        totalPayment: Math.round(emi * n)
      });
    }
  }, [loanAmount, interestRate, loanTenure]);

  useEffect(() => {
    // Simulate API Load
    setTimeout(() => {
      setProperties(propertiesData);
      setLoading(false);
    }, 800);
  }, []);

  const plotProperties = properties.filter(p => p.type === 'Plot');
  const residentialProperties = properties.filter(p => p.type === 'Residential').slice(0, 6); // Max 6 for grid
  const commercialProperties = properties.filter(p => p.type === 'Commercial');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-200 relative">
      <Navbar />
      <RegisterPopup /> 
      <SocialSidebar /> 

      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 pb-40 px-4 md:px-6 flex items-center justify-center overflow-hidden min-h-[85vh]">
        <div 
          className="absolute inset-0 z-0 scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-slate-900/90 z-10" /> 

        <div className="relative z-20 w-full max-w-6xl mx-auto text-center mt-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-bold tracking-widest uppercase backdrop-blur-sm">
            India's Most Trusted Real Estate Partner
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl uppercase">
            BEST REAL ESTATE CONSULTANT <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">in Delhi NCR</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            ANK Realty offers expert guidance for premium property investments, ultra-luxury apartments, and high-ROI plotted developments across Noida, Gurugram, and beyond.
          </p>
          
          {/* Advanced Search Portal Style */}
          <div className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-6 max-w-5xl mx-auto w-full border border-slate-100/20">
            <div className="flex justify-center md:justify-start gap-6 mb-6 px-2 border-b border-slate-100 pb-4">
              {['New Projects', 'Premium Plots', 'Commercial', 'Resale'].map((cat) => (
                <button
                  key={cat} onClick={() => setSearchCategory(cat)}
                  className={`text-sm md:text-base font-bold capitalize transition-all pb-4 -mb-[17px] border-b-[3px] ${
                    searchCategory === cat ? 'text-red-600 border-red-600' : 'text-slate-400 border-transparent hover:text-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative border-r border-slate-200">
                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                 <Input placeholder="City or Micro-market" className="h-14 pl-12 bg-transparent border-0 focus-visible:ring-0 text-slate-900 text-base shadow-none font-medium" />
              </div>
              <div className="relative border-r border-slate-200">
                 <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                 <select className="h-14 pl-12 pr-4 bg-transparent border-0 focus:ring-0 w-full text-slate-700 text-base appearance-none outline-none shadow-none cursor-pointer font-medium">
                   <option value="">Property Type</option>
                   <option value="plot">Premium Land / Plot</option>
                   <option value="apartment">Luxury Apartment</option>
                   <option value="office">Commercial Office</option>
                 </select>
              </div>
              <div className="relative">
                 <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                 <select className="h-14 pl-12 pr-4 bg-transparent border-0 focus:ring-0 w-full text-slate-700 text-base appearance-none outline-none shadow-none cursor-pointer font-medium">
                   <option value="">Budget</option>
                   <option value="50l">₹20 Lac - ₹50 Lac</option>
                   <option value="1cr">₹50 Lac - ₹1 Cr</option>
                   <option value="3cr">₹1 Cr - ₹3 Cr</option>
                   <option value="5cr+">₹3 Cr +</option>
                 </select>
              </div>
              <div>
                <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-xl shadow-lg transition-all">
                  <Search className="mr-2 h-5 w-5 stroke-[2.5]" /> Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. TRUSTED BRANDS MARQUEE --- */}
      <section className="py-12 sm:py-16 relative w-full overflow-hidden bg-white -mt-8 z-20 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 sm:mb-12 text-center">
            Trusted by leading developers across India
          </h2>
          <div className="relative flex flex-col gap-8 sm:gap-12 overflow-hidden w-full">
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex gap-8 sm:gap-16 w-max">
              {[...topRowLogos, ...topRowLogos, ...topRowLogos, ...topRowLogos].map((src, i) => (
                <div key={`top-${i}`} className="flex-shrink-0 w-32 sm:w-40 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100">
                  <img src={src} alt="Developer Logo" className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </motion.div>
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* --- 3. QUICK CATEGORIES --- */}
      <section className="py-12 bg-white border-b border-slate-100 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {[
              { title: "Premium Plots", icon: Map },
              { title: "Luxury Apartments", icon: Building2 },
              { title: "Villas & Estates", icon: Home },
              { title: "Commercial", icon: Briefcase },
              { title: "New Launches", icon: Star },
              { title: "Ready to Move", icon: Key }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-red-200 hover:bg-red-50 hover:-translate-y-1 transition-all cursor-pointer group shadow-sm">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-all">
                  <item.icon className="w-7 h-7 text-slate-600 group-hover:text-red-600" />
                </div>
                <p className="font-bold text-slate-800 text-sm text-center">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. DEDICATED PLOTS SECTION (MASSIVE DETAIL) --- */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider mb-4 border border-red-200">
                <Map className="w-4 h-4" /> Highly Demanded
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Premium Plotted Developments</h2>
              <p className="text-lg text-slate-500 font-medium">Build your legacy on your own terms. Explore high-ROI, gated communities with world-class infrastructure.</p>
            </div>
            <Button variant="outline" className="text-slate-700 border-slate-300 font-bold hover:bg-slate-900 hover:text-white transition-colors h-12 px-6 rounded-xl hidden md:flex">
              View All Plots <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-red-600" /></div>
          ) : (
            <div className="flex flex-col gap-10">
              {plotProperties.map((property) => (
                <DetailedPlotCard key={property.id} property={property} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- 5. RESIDENTIAL APARTMENTS SECTION --- */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Luxury Residences</h2>
            <p className="text-lg text-slate-500 font-medium">Discover exclusive apartments and penthouses from A-grade developers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {residentialProperties.map((property) => (
              <StandardPropertyCard key={property.id} property={property} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. WHY CHOOSE US (STATS BANNER) --- */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Why Investors Trust <span className="text-red-500">ANK Realty.</span></h2>
           <p className="text-slate-300 mb-20 max-w-3xl mx-auto text-lg font-light">We bring unparalleled transparency, exclusive insider deals, and zero-hassle paperwork to your premium property buying journey.</p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
             {[
               { icon: Users, num: "15,000+", label: "Happy Families" },
               { icon: Building2, num: "500+", label: "Projects Delivered" },
               { icon: Award, num: "15+ Years", label: "Industry Experience" },
               { icon: ThumbsUp, num: "100%", label: "Transparency" }
             ].map((stat, idx) => (
               <div key={idx} className="flex flex-col items-center group">
                 <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/10 group-hover:bg-red-600/20 transition-colors">
                   <stat.icon className="w-10 h-10 text-red-500" />
                 </div>
                 <h3 className="text-5xl font-black text-white mb-2 tracking-tight">{stat.num}</h3>
                 <p className="text-red-400 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* --- 7. COMMERCIAL SECTION --- */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Commercial Spaces</h2>
            <p className="text-lg text-slate-500 font-medium">High-footfall retail shops, food courts, and corporate office spaces.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commercialProperties.map((property) => (
              <StandardPropertyCard key={property.id} property={property} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>

      {/* --- 8. EMI CALCULATOR & EXPERT ADVISORY --- */}
      <section className="py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Advisory Content */}
          <div className="lg:w-1/2 w-full">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-sm font-bold tracking-wide border border-slate-200">🌟 360° Realty Services</div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">End-to-End <br/><span className="text-red-600">Property Solutions.</span></h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">From finding the perfect plot to getting the keys, ANK Realty provides premium, hassle-free real estate services tailored for you.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: ShieldCheck, title: "Legal Verification", desc: "Rigorous 30-point title check." },
                { icon: Banknote, title: "Home Loan Assistance", desc: "Lowest rates & quick approvals." },
                { icon: FileText, title: "Property Registration", desc: "Doorstep registry assistance." },
                { icon: TrendingUp, title: "Investment Advisory", desc: "Data-driven ROI & market insights." }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm hover:border-red-200 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
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
          
          {/* EMI CALCULATOR */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative shadow-2xl border border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="bg-red-600 p-3 rounded-xl shadow-lg"><Calculator className="w-7 h-7 text-white" /></div>
                <div>
                  <h3 className="text-3xl font-black">EMI Calculator</h3>
                  <p className="text-slate-400 text-sm mt-1">Plan your finances instantly</p>
                </div>
              </div>

              <div className="space-y-8 mb-8 relative z-10">
                <div>
                  <div className="flex justify-between text-sm mb-3"><span className="text-slate-300 font-medium">Loan Amount</span><span className="font-bold text-lg text-white font-mono">₹{loanAmount.toLocaleString('en-IN')}</span></div>
                  <input type="range" min="500000" max="50000000" step="100000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3"><span className="text-slate-300 font-medium">Interest Rate</span><span className="font-bold text-lg text-white font-mono">{interestRate}%</span></div>
                  <input type="range" min="5" max="15" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3"><span className="text-slate-300 font-medium">Loan Tenure</span><span className="font-bold text-lg text-white font-mono">{loanTenure} Years</span></div>
                  <input type="range" min="1" max="30" step="1" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                </div>
              </div>

              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-slate-800 relative z-10 text-center flex flex-col items-center shadow-inner">
                <p className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-widest">Your Monthly EMI</p>
                <p className="text-4xl font-black text-red-500 mb-6 font-mono tracking-tight">₹{emiResult.emi.toLocaleString('en-IN')}</p>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-black rounded-xl h-14 text-lg shadow-lg shadow-red-600/20 transition-all">
                  Apply for Home Loan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 9. CLIENT TESTIMONIALS --- */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Hear From Our Clients</h2>
            <p className="text-slate-500 text-lg">Real stories from families and investors who trusted ANK Realty.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonialsData.map((test, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative flex flex-col hover:shadow-xl transition-shadow">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-100" />
                <div className="flex text-yellow-400 mb-5">
                  {[...Array(test.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1 relative z-10 italic">"{test.review}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{test.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 10. COMPREHENSIVE FAQ SECTION --- */}
      <section className="py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-lg">Everything you need to know about buying property and plots with us.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-bold text-slate-900 pr-4">{faq.question}</span>
                  {openFaq === idx ? <Minus className="w-5 h-5 text-red-600 shrink-0" /> : <Plus className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 pt-2 text-slate-600 text-sm leading-relaxed bg-white"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 11. NEWSLETTER CTA --- */}
      <section className="py-20 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Bell className="w-14 h-14 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Never Miss a Property Deal</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Subscribe to our VIP newsletter and get early access to pre-launches, exclusive plot allotments, and market reports.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
             <input type="email" placeholder="Enter your email address" className="flex-1 h-14 rounded-xl px-5 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
             <Button className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-colors text-lg">
               Subscribe Now
             </Button>
          </div>
        </div>
      </section>

      {/* --- 12. FOOTER --- */}
      <footer className="bg-[#0A0A0A] text-white pt-24 pb-10 px-6 border-t-[8px] border-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-3xl font-extrabold tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                The Gold Standard of Real Estate. We are committed to providing the highest level of service, transparency, and expertise in the Indian real estate market.
              </p>
              <div className="flex space-x-4 pt-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer"><Instagram className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer"><Youtube className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer"><Linkedin className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/projects" className="hover:text-red-500 transition-colors">All Projects</Link></li>
                <li><Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-red-500 transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/plots" className="hover:text-red-500 transition-colors">Premium Plots</Link></li>
                <li><Link to="/residential" className="hover:text-red-500 transition-colors">Residential Properties</Link></li>
                <li><Link to="/commercial" className="hover:text-red-500 transition-colors">Commercial Spaces</Link></li>
                <li><Link to="/resale" className="hover:text-red-500 transition-colors">Resale Opportunities</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-5 text-slate-400 font-medium text-sm">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-500 shrink-0"/> Tapasya Corp Heights, Noida, UP 201301</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-500 shrink-0"/> info@ankrealty.com</p>
                <p className="flex items-center"><Phone className="w-5 h-5 mr-3 text-red-500 shrink-0"/> +91 97323 00007</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* --- 13. FLOATING CHATBOT --- */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
            <div className="bg-slate-900 text-white p-4 font-bold flex justify-between items-center shadow-md relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Real Estate Assistant
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-slate-700 p-1 rounded-md transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="p-4 flex-1 bg-slate-50 flex flex-col gap-3 h-[380px] overflow-y-auto">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                   <MessageSquare className="w-4 h-4 text-red-600"/>
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm border border-slate-100 text-slate-700 leading-relaxed">
                  Hi! I'm your virtual assistant from ANK Realty. Looking for a high-ROI plot or luxury apartment today?
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-2 pl-10">
                {[
                  "Show me Premium Plots", "Schedule a Site Visit", "Connect with an Expert"
                ].map((subject, i) => (
                  <button key={i} className="text-left bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 p-2.5 rounded-xl text-sm font-medium transition-all border border-slate-200 hover:border-red-200 shadow-sm">
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
              <button className="bg-slate-900 text-white p-2.5 rounded-full hover:bg-black transition-colors">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsChatOpen(true)} 
            className="bg-slate-900 hover:bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group border border-slate-700"
          >
            <MessageSquare className="w-7 h-7 text-red-500" />
            <span className="absolute right-full mr-4 bg-white text-slate-800 text-sm font-bold py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-slate-100">
              Hi, I'm your real estate assistant
            </span>
          </button>
        )}
      </div>

    </div>
  );
}
