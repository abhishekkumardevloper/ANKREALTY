import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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

export const propertiesData = [
  // FRESH PROPERTIES - NOIDA RESIDENTIAL
  { 
    id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sec 151', category: 'buy', tag: 'Fresh', type: 'Residential', price: 18500000, area: 2400, 
    description: 'Discover the epitome of luxury living at Experion Saatori, strategically located in the highly sought-after Sector 151, Noida. This premium residential development offers a harmonious blend of contemporary architecture and lush green landscapes, providing residents with a serene retreat from the bustling city. The meticulously designed apartments feature expansive layouts, floor-to-ceiling windows, and top-tier finishes that redefine modern elegance. Residents can indulge in a plethora of world-class amenities, including a state-of-the-art clubhouse, infinity swimming pool, fully equipped gymnasium, and dedicated sports facilities. With seamless connectivity to major expressways, corporate hubs, and premier educational institutions, Experion Saatori is not just a home, but a lifestyle statement for those who seek the very best in urban living and unparalleled comfort.', 
    imageUrl: generateImage('Residential', 0) 
  },
  { 
    id: 'f2', title: 'Smart World Elie Saab', city: 'Noida', location: 'Sec 98', category: 'buy', tag: 'Fresh', type: 'Residential', price: 22000000, area: 3100, 
    description: 'Step into a realm of unmatched elegance at Smart World Elie Saab, an exclusive designer residential enclave situated in the heart of Sector 98. Conceptualized by globally renowned designers, this iconic property brings haute couture to real estate. Every inch of these majestic residences exudes sophistication, featuring bespoke interiors, imported marble flooring, and panoramic views of the city skyline. The development boasts an exclusive residents-only lounge, a temperature-controlled indoor pool, private cabanas, and a wellness spa that rivals five-star resorts. Designed for the elite few, the property ensures absolute privacy with dedicated elevators and multi-tier security. Its prime location guarantees that high-end shopping avenues, fine dining restaurants, and top corporate centers are merely a stone’s throw away.', 
    imageUrl: generateImage('Residential', 1) 
  },
  { 
    id: 'f3', title: 'M3M Jacob & Co', city: 'Noida', location: 'Sec 97', category: 'buy', tag: 'Fresh', type: 'Residential', price: 35000000, area: 4500, 
    description: 'Experience the pinnacle of ultra-luxury real estate at M3M Jacob & Co in Sector 97. This architectural masterpiece is inspired by the meticulous craftsmanship of luxury horology and fine jewelry. The magnificent towers pierce the skyline, offering opulent, sweeping residences that redefine grand living. Each apartment is a sprawling canvas of luxury, featuring double-height ceilings, private plunge pools, and expansive terraces that invite natural light and fresh air. The extravagant clubhouse is an architectural marvel in itself, offering a private cinema, a cigar lounge, a gourmet restaurant, and a cascading infinity pool. Living here means embracing a lifestyle reserved for global citizens, surrounded by impeccable aesthetics and the very highest standards of personalized concierge services.', 
    imageUrl: generateImage('Residential', 2) 
  },
  { 
    id: 'f4', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', tag: 'Fresh', type: 'Residential', price: 17500000, area: 2200, 
    description: 'Max Estate in Sector 105 represents the future of sustainable and tranquil residential living. Built on the philosophy of holistic well-being, this property seamlessly integrates nature with modern urban conveniences. The meticulously planned apartments are designed to maximize cross-ventilation and natural sunlight, significantly reducing the carbon footprint. Surrounded by acres of beautifully curated botanical gardens, therapeutic walkways, and pristine water bodies, it offers a peaceful sanctuary for families. The property includes a specialized wellness center, organic cafes, co-working spaces, and dedicated zones for yoga and meditation. With a strong focus on community living and eco-friendly infrastructure, Max Estate provides a unique opportunity to live a balanced, healthy, and elevated lifestyle right in the center of Noida.', 
    imageUrl: generateImage('Residential', 3) 
  },
  { 
    id: 'f5', title: 'RG Mirage', city: 'Noida', location: 'Sec 120', category: 'buy', tag: 'Fresh', type: 'Residential', price: 11000000, area: 1600, 
    description: 'Welcome to RG Mirage, a premier residential destination in Sector 120 that promises a perfect blend of comfort, style, and exceptional value. These thoughtfully designed modern apartments cater specifically to the dynamic needs of contemporary urban families. Featuring smart space utilization, modular kitchens, and premium bath fittings, the interiors are both highly functional and aesthetically pleasing. The vibrant community features a sprawling central courtyard, safe kids’ play zones, a multi-purpose banquet hall, and a well-maintained swimming pool. Its strategic location provides residents with immediate access to reputed schools, mega commercial markets, and advanced healthcare facilities. RG Mirage is designed to foster a warm community atmosphere while offering the privacy and luxury you deserve.', 
    imageUrl: generateImage('Residential', 4) 
  },
  { 
    id: 'f6', title: 'Godrej Riverine', city: 'Noida', location: 'Sec 44', category: 'buy', tag: 'Fresh', type: 'Residential', price: 21000000, area: 2800, 
    description: 'Godrej Riverine in Sector 44 offers an extraordinary riverside luxury living experience crafted by one of India’s most trusted developers. Wake up to the soothing sights of gentle waters and lush green belts that surround this magnificent property. The residences are a masterclass in elegant design, offering expansive living areas, wrap-around balconies, and smart-home automation features. The project is heavily focused on creating an active and healthy lifestyle, featuring miles of jogging and cycling tracks, outdoor sports courts, a grand clubhouse, and dedicated pet parks. Situated in a highly developed and pristine neighborhood, it provides a quiet, pollution-free environment while keeping you seamlessly connected to South Delhi and major business hubs across the NCR.', 
    imageUrl: generateImage('Residential', 5) 
  },
  { 
    id: 'f7', title: 'M3M Cullinan', city: 'Noida', location: 'Sec 94', category: 'buy', tag: 'Fresh', type: 'Residential', price: 40000000, area: 5500, 
    description: 'M3M Cullinan stands as a monumental landmark of bespoke mega-luxury in Sector 94. Named after the world’s largest diamond, this property is the crown jewel of Noida’s real estate. It features palatial apartments that offer a sweeping, uninterrupted 360-degree view of the city and the river. Every residence is meticulously crafted with the finest global materials, offering features like private elevators, massive walk-in closets, and personal bar areas. The ultra-exclusive community amenities include a rooftop helipad, a high-end luxury retail boulevard at the podium level, a world-class spa, and fine dining establishments. This is an address of absolute prestige and power, designed for industry leaders and those who compromise on nothing.', 
    imageUrl: generateImage('Residential', 6) 
  },
  { 
    id: 'f8', title: 'Great Value Ekanam', city: 'Noida', location: 'Sec 107', category: 'buy', tag: 'Fresh', type: 'Residential', price: 14000000, area: 1950, 
    description: 'Great Value Ekanam in Sector 107 is synonymous with spacious, well-ventilated, and premium family homes. The architectural design places a heavy emphasis on Vastu compliance, ensuring positive energy and harmony within every apartment. The residences feature large bay windows, imported wooden flooring in master bedrooms, and highly efficient floor plans that eliminate dead spaces. The community is enveloped in lush greenery, featuring thematic gardens, a state-of-the-art fitness center, a sparkling swimming pool, and an exclusive residents’ club. Sector 107 is renowned for its tranquil environment and rapid infrastructural growth, making Great Value Ekanam an incredibly smart investment for those seeking a peaceful yet highly connected urban lifestyle.', 
    imageUrl: generateImage('Residential', 7) 
  },

  // FRESH PROPERTIES - NOIDA COMMERCIAL
  { 
    id: 'c1', title: 'M3M Line', city: 'Noida', location: 'Sec 72', category: 'buy', tag: 'Commercial', type: 'Commercial', price: 8000000, area: 500, 
    description: 'M3M Line is poised to become the ultimate high-street commercial destination in Sector 72. Designed to attract massive daily footfall, this state-of-the-art commercial hub offers a brilliant mix of premium retail spaces, gourmet food courts, and modern office suites. The architecture features an open-to-sky courtyard, striking glass facades, and high-speed escalators, ensuring maximum visibility for every brand. With multi-level basement parking and round-the-clock security, it provides a seamless experience for both business owners and consumers. Its location in a densely populated upscale residential catchment area guarantees high returns on investment and unmatched business growth opportunities for retail brands, cafes, and boutique businesses.', 
    imageUrl: generateImage('Commercial', 0) 
  },
  { 
    id: 'c2', title: 'Max Estate', city: 'Noida', location: 'Sec 105', category: 'buy', tag: 'Commercial', type: 'Commercial', price: 12000000, area: 1200, 
    description: 'Redefine your corporate identity at Max Estate, Sector 105, offering elite Grade A office spaces. This architectural marvel is designed to foster productivity, innovation, and employee well-being. The building is LEED-certified, featuring smart climate control, energy-efficient lighting, and advanced air filtration systems. Tenants will enjoy grand double-height lobbies, high-speed destination-controlled elevators, and beautifully landscaped breakout zones. The property also houses premium cafeterias, conference facilities, and an executive lounge. Perfect for multinational corporations and fast-growing startups, Max Estate provides an unparalleled professional environment that leaves a lasting impression on clients and ensures a thriving workplace culture.', 
    imageUrl: generateImage('Commercial', 1) 
  },
  { 
    id: 'c3', title: 'Paras Avenue', city: 'Noida', location: 'Sec 129', category: 'buy', tag: 'Commercial', type: 'Commercial', price: 6500000, area: 450, 
    description: 'Paras Avenue in Sector 129 is a revolutionary premium high-street retail and lifestyle destination. This brilliantly conceptualized commercial project combines the luxury of a mall with the vibrancy of an open-air market. The development features double-height retail shops, creating grand storefronts that demand attention. Alongside premium retail, it offers dedicated floors for entertainment, wellness centers, and fine dining restaurants with open-air terrace seating. Situated right on the Noida-Greater Noida Expressway, Paras Avenue boasts unparalleled visibility and accessibility. It is surrounded by affluent residential sectors and massive IT parks, ensuring a continuous stream of premium customers and guaranteeing highly lucrative rental yields for investors.', 
    imageUrl: generateImage('Commercial', 2) 
  },

  // FRESH PROPERTIES - GREATER NOIDA WEST
  { 
    id: 'gw1', title: 'Fusion – The Brook', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', tag: 'Fresh', type: 'Residential', price: 8500000, area: 1300, 
    description: 'Embrace a serene, nature-inspired lifestyle at Fusion – The Brook, located in the rapidly developing Sector 12 of Greater Noida West. This property is designed around central water features and lush landscaping, offering a tranquil escape from city noise. The apartments are meticulously crafted to provide maximum natural light, featuring spacious balconies that overlook the beautiful central courtyard. Residents can enjoy an array of premium amenities, including a lavish clubhouse, a modern gymnasium, a swimming pool, and dedicated jogging tracks. With close proximity to upcoming metro stations, reputed schools, and shopping arcades, it offers an ideal environment for families looking for a balanced and vibrant lifestyle.', 
    imageUrl: generateImage('Residential', 0) 
  },
  { 
    id: 'gw2', title: 'Yatharth Eternia', city: 'Greater Noida West', location: 'Tech Zone 4', category: 'buy', tag: 'Fresh', type: 'Residential', price: 9200000, area: 1450, 
    description: 'Yatharth Eternia brings modern, upscale living right to the heart of Tech Zone 4 in Greater Noida West. This highly sought-after residential project is defined by its robust construction quality and elegant architectural design. The spacious apartments are tailored for modern families, featuring open-plan living areas, designer fittings, and smart security systems. The project is packed with world-class facilities, including an Olympic-sized swimming pool, indoor sports arenas, a massive community hall, and beautifully manicured gardens. Its strategic location right next to major IT hubs and commercial parks makes it incredibly convenient for working professionals, offering a minimal commute and maximum time for family and recreation.', 
    imageUrl: generateImage('Residential', 1) 
  },
  { 
    id: 'gw3', title: 'VVIP Addresses', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', tag: 'Fresh', type: 'Residential', price: 10500000, area: 1650, 
    description: 'Live like royalty at VVIP Addresses, a highly prestigious residential enclave in Sector 12, Greater Noida West. This development sets a new benchmark for luxury in the region, offering grand, well-appointed homes with sophisticated interiors. The property features a majestic entrance gate, sweeping driveways, and magnificent towers that offer panoramic views of the city. The clubhouse is a masterpiece of leisure, offering everything from a lavish spa and salon to a private bowling alley and an elegant restaurant. Designed for modern families who desire a status-driven lifestyle, the project ensures top-tier security, immaculate maintenance, and a vibrant community atmosphere of like-minded individuals.', 
    imageUrl: generateImage('Residential', 2) 
  },
  { 
    id: 'gw4', title: 'Eldeco La Vida Bella', city: 'Greater Noida West', location: 'Sec 12', category: 'buy', tag: 'Fresh', type: 'Residential', price: 11500000, area: 1800, 
    description: 'Transport yourself to the charm of Europe with Eldeco La Vida Bella, a beautifully crafted Spanish-themed residential development in Sector 12. From the stunning terracotta-tiled roofs to the ornate ironwork balconies and vibrant central plazas, every detail of this property exudes Mediterranean elegance. The spacious homes are bathed in natural light and feature premium, classic finishes. The community is built around social interaction, featuring beautiful courtyards, cobblestone pathways, al-fresco cafes, and a stunning resort-style pool. It offers a unique, holiday-like lifestyle every single day, while still providing rapid connectivity to the core commercial sectors of Noida and Greater Noida.', 
    imageUrl: generateImage('Residential', 3) 
  },
  { 
    id: 'gw5', title: 'Elite X', city: 'Greater Noida West', location: 'Sec 10', category: 'buy', tag: 'Fresh', type: 'Residential', price: 7800000, area: 1250, 
    description: 'Welcome to Elite X in Sector 10, a futuristic residential project designed specifically for the smart, tech-savvy generation. These homes seamlessly integrate advanced home automation, allowing residents to control lighting, climate, and security with a touch of a button. The architecture is ultra-modern, featuring sleek lines and large glass facades. The development focuses heavily on co-living and networking, offering high-speed Wi-Fi zones, modern co-working spaces, a fully equipped fitness center, and a vibrant rooftop lounge. Perfect for young professionals and small families, Elite X offers an energetic, modern lifestyle at a highly competitive price point, right in the heart of Greater Noida West’s growth corridor.', 
    imageUrl: generateImage('Residential', 4) 
  },

  // FRESH PROPERTIES - YAMUNA
  { 
    id: 'y1', title: 'Ace Hive', city: 'Yamuna', location: 'Sec 22A', category: 'buy', tag: 'Fresh', type: 'Residential', price: 6000000, area: 1100, 
    description: 'Ace Hive is a rapidly emerging luxury destination strategically located in Sector 22A, near the Yamuna Expressway. This vibrant residential complex is designed to offer a premium lifestyle at an excellent value. The masterfully planned apartments offer highly efficient layouts, elegant flooring, and scenic views of the vast, open surroundings. Residents have access to a massive central park, an interactive children’s play area, a modern gym, and a multi-cuisine cafeteria. With the upcoming Noida International Airport and Film City just a short drive away, Ace Hive represents not just a beautiful home, but a golden investment opportunity in one of India’s fastest-growing real estate corridors.', 
    imageUrl: generateImage('Residential', 5) 
  },
  { 
    id: 'y2', title: 'Eldeco Whispers of Wow', city: 'Yamuna', location: 'Sec 22D', category: 'buy', tag: 'Fresh', type: 'Residential', price: 7200000, area: 1350, 
    description: 'Discover serene and majestic living at Eldeco Whispers of Wow in Sector 22D, Yamuna Expressway. This property is a sanctuary of peace, offering low-density living spaces surrounded by vast, pristine green landscapes. The residences are exceptionally spacious, featuring large windows that invite the outdoors in. The property is equipped with top-class amenities, including a luxury club, a grand swimming pool, extensive sporting facilities, and dedicated yoga pavilions. Situated right next to the upcoming mega infrastructural developments, it offers the perfect balance of living in a quiet, pollution-free oasis while being poised to benefit from massive future capital appreciation.', 
    imageUrl: generateImage('Residential', 6) 
  },
  { 
    id: 'y3', title: 'Gaur Chrysalis', city: 'Yamuna', location: 'Sec 22D', category: 'buy', tag: 'Fresh', type: 'Residential', price: 6500000, area: 1200, 
    description: 'Gaur Chrysalis in Sector 22D is a magnificent mixed-use development offering a blend of premium high-rise apartments and plotted developments. Crafted by the renowned Gaur Group, this township is a city within a city. The apartments are built to rigorous standards, offering plush interiors and modern conveniences. The sprawling township features its own commercial complex, an international standard school, a hospital, and acres of beautifully landscaped parks. Whether you are taking an evening stroll by the water bodies or enjoying a game at the sports complex, Gaur Chrysalis provides a comprehensive, self-sustained luxury lifestyle just minutes away from the upcoming aviation hub.', 
    imageUrl: generateImage('Residential', 7) 
  },
  { 
    id: 'y4', title: 'Ace Verde', city: 'Yamuna', location: 'Sec 22', category: 'buy', tag: 'Fresh', type: 'Residential', price: 8000000, area: 1500, 
    description: 'Experience living amidst lush green surroundings and ultimate modern comfort at Ace Verde in Sector 22, Yamuna Expressway. This eco-friendly residential project is designed for those who appreciate nature without compromising on urban luxury. The expansive homes feature large wrap-around balconies, premium fixtures, and a layout that guarantees complete privacy. The community boasts an enormous forested central park, organic farming zones, an elite clubhouse, and a crystal-clear swimming pool. Positioned right on the expressway, it provides high-speed connectivity to Greater Noida and Agra, making it a perfect retreat for families looking for a pristine environment combined with cutting-edge amenities.', 
    imageUrl: generateImage('Residential', 0) 
  },

  // RESALE PROPERTIES - NOIDA
  ...[
    'Lotus Panache – Sec 110', 'Lotus Boulevard – Sec 100', 'Great Value Sharnam – Sec 107', 
    'Prateek Stylome – Sec 45', 'Mahagun Moderne – Sec 78', 'Ajnara Grand – Sec 74', 
    'Godrej Woods – Sec 43', 'ABA Cleo County – Sec 121', 'Amrapali Heartbeat City – Sec 107', 
    'Gulshan Dynasty – Sec 144', 'Ivy County – Sec 75', 'County 107 – Sec 107', 'Prateek Edifice – Sec 107'
  ].map((name, i) => {
    const title = name.split(' – ')[0];
    const location = name.split(' – ')[1];
    return {
      id: `rs${i}`, 
      title: title, 
      city: 'Noida', 
      location: location, 
      category: 'buy', 
      tag: 'Resale', 
      type: 'Residential', 
      price: 12000000 + (i * 1000000), 
      area: 1500 + (i * 100), 
      description: `Presenting an exceptional resale opportunity at ${title}, prominently located in the highly desirable ${location} of Noida. This magnificent ready-to-move-in residential property offers an unparalleled lifestyle, seamlessly combining modern architectural brilliance with everyday functional comfort. Spanning a generous ${1500 + (i * 100)} square feet, the apartment features meticulously crafted interiors, premium imported flooring, modular wardrobes, and expansive balconies that offer breathtaking, unobstructed views of the surrounding skyline. The living spaces are bathed in natural light and highly ventilated, ensuring a warm, inviting, and healthy atmosphere for your family. Residents will have exclusive, immediate access to a wide array of premium, fully operational amenities, including a resort-style swimming pool, a state-of-the-art fitness center, landscaped podium gardens, indoor sports courts, and 24/7 multi-tier security. Its strategic location ensures effortless connectivity to key commercial IT hubs, top-tier international schools, and world-class healthcare facilities, making it a spectacular choice for discerning homebuyers seeking immediate possession of luxury and convenience.`, 
      imageUrl: generateImage('Residential', i + 2)
    };
  }),

  // RENT PROPERTIES - NOIDA
  ...[
    'Lotus Panache – Sec 110', 'Lotus Boulevard – Sec 100', 'Great Value Sharnam – Sec 107', 
    'Prateek Stylome – Sec 45', 'Mahagun Moderne – Sec 78', 'Ajnara Grand – Sec 74', 
    'Godrej Woods – Sec 43', 'ABA Cleo County – Sec 121', 'Amrapali Heartbeat City – Sec 107', 
    'Gulshan Dynasty – Sec 144', 'Ivy County – Sec 75', 'County 107 – Sec 107', 'Prateek Edifice – Sec 107'
  ].map((name, i) => {
    const title = name.split(' – ')[0];
    const location = name.split(' – ')[1];
    return {
      id: `rt${i}`, 
      title: title, 
      city: 'Noida', 
      location: location, 
      category: 'rent', 
      tag: 'Rent', 
      type: 'Residential', 
      price: 35000 + (i * 5000), 
      area: 1500 + (i * 100), 
      description: `Experience elevated urban living by renting this stunning, highly sought-after apartment at ${title}, located in the prime neighborhood of ${location}, Noida. This incredibly spacious property is designed to cater to all your modern lifestyle needs, offering a massive ${1500 + (i * 100)} square feet of beautifully designed living space. The apartment comes equipped with top-of-the-line fixtures, a highly functional modular kitchen, spacious bedrooms with ample storage, and large sun-drenched balconies that provide a serene view of the beautifully landscaped community. By choosing to reside here, you gain unlimited access to the society's world-class amenities, which include an opulent clubhouse, a massive sparkling swimming pool, a fully-equipped modern gymnasium, dedicated children's play areas, and beautifully maintained walking tracks. The property features comprehensive CCTV surveillance and power backup for absolute peace of mind. Perfectly situated near major expressways, premium shopping malls, and highly reputed corporate offices, this rental home offers the ultimate blend of luxury, prestige, and unmatched everyday convenience for professionals and families alike.`, 
      imageUrl: generateImage('Residential', i + 4)
    };
  })
];

export default function HomePage() {
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
    // FIX: Replaced `propertyListings` with the correct exported variable `propertiesData`
    setTimeout(() => {
      setProperties(propertiesData);
      setLoading(false);
    }, 800);
  }, []);

  const featuredProperties = properties.filter(p => p.tag === 'Fresh').slice(0, 8);
  const buyProperties = properties.filter(p => p.tag === 'Resale' || p.tag === 'Commercial').slice(0, 8);
  const rentProperties = properties.filter(p => p.category === 'rent').slice(0, 8);

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
                onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
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
                    <Button
                      variant="outline"
                      className="h-9 px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600 text-xs font-bold rounded-lg"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/property/${property.id}`, { state: { property } });
                      }}
                    >
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

      {/* --- FOOTER (Upgraded to match detail page) --- */}
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
