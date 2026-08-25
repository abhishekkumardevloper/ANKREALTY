import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import {
  ArrowRight, Banknote, Briefcase, Building2, Calculator, ChevronRight,
  Handshake, Instagram, Linkedin, Mail, MapPin, Search, Users, TrendingUp,
  Award, ShieldCheck, Home, Key, PieChart, Map as MapIcon, Sparkles,
  Building, RefreshCw, DollarSign, Phone, Loader2, Video, PlayCircle,
  CheckCircle, Twitter, Facebook, Heart, ArrowUpRight, Star, Clock,
  ThumbsUp, Shield, HelpCircle, Send, Plus, BookOpen, Store, Warehouse,
  LandPlot, FileCheck2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RegisterPopup from './RegisterPopup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as siteData from '@/lib/siteData';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

const SITE_URL = 'https://www.ankrealty.com';

// --- SEO CONSTANTS ---
const SEO_TITLE = 'ANK Realty | Buy Luxury Property in Noida, Greater Noida & Delhi NCR | Verified Real Estate';
const SEO_DESCRIPTION = 'Buy verified luxury apartments, villas, plots and commercial properties with ANK Realty. Zero brokerage on selected projects, expert property consultation and home loan assistance across Noida, Greater Noida, Gurugram and Delhi NCR.';
const SEO_KEYWORDS = [
  'Real Estate in Noida', 'Property in Noida', 'Buy Property in Noida', 'Real Estate Company in Noida',
  'Best Property Dealer in Noida', 'Luxury Apartments in Noida', 'Premium Property in Delhi NCR',
  'Real Estate Consultant', 'Commercial Property in Noida', 'Verified Property Listings',
  'Flats for Sale in Noida', 'Apartments in Noida', 'Villas in Noida', 'Property Consultant Noida',
  'Flats in Greater Noida', 'Buy Property in Greater Noida', 'Residential Plots Greater Noida',
  'Commercial Shops Greater Noida', 'Luxury Apartments Gurgaon', 'Property Dealer Gurgaon',
  'Buy Flats Gurgaon', 'Commercial Office Gurgaon', 'Buy Property in Delhi', 'Luxury Homes Delhi',
  'Real Estate Consultant Delhi', 'Best Property Investment in India', 'High ROI Property',
  'Rental Income Property', 'Pre Launch Projects', 'New Launch Projects', 'Ready to Move Flats',
  'RERA Approved Projects in Noida', 'Zero Brokerage Property in Noida'
].join(', ');

// --- STATIC DATA ---
const bankOffers = Array.isArray(siteData?.bankOffers) ? siteData.bankOffers : [
  { bank: 'HDFC Bank', rate: '8.35%', note: 'Zero Processing Fee' },
  { bank: 'SBI Home Loans', rate: '8.40%', note: 'Women Borrower Discount' },
  { bank: 'ICICI Bank', rate: '8.45%', note: 'Instant Approval' }
];
const socialLinks = siteData?.socialLinks || {};

const topRowLogos = [
  '/images (3).png', '/images__9_-removebg-preview.png', '/images (1).png',
  '/images (2).png', '/183f468e401f4220bce9e4f7b1e3ffd820251112162925170.png'
];
const bottomRowLogos = [
  '/images.png', '/4f3bb698972531.Y3JvcCw5NTAsNzQzLDIyMywyMQ-removebg-preview.png',
  '/Max_Estates_logo.svg.png', '/M3M-Jacob-and-Co-logo.png'
];

const FALLBACK_LOGO = 'https://via.placeholder.com/160x60/1e293b/94a3b8?text=Partner';

const categoryOptions = [
  { label: 'Buy Property', value: 'buy' },
  { label: 'Resale Deals', value: 'resale' },
  { label: 'Rent & Lease', value: 'rent' },
];

const exploreCategories = [
  {
    title: 'Luxury Villas', desc: 'Independent luxury villas in Noida and Delhi NCR', icon: Home,
    alt: 'Luxury villa for sale in Noida - independent house exterior',
    image: 'https://images.unsplash.com/photo-1613490908578-81cc3d17961b?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Premium Apartments', desc: '2 BHK, 3 BHK & 4 BHK luxury apartments in Noida', icon: Building,
    alt: '2 BHK 3 BHK premium apartment building in Noida Delhi NCR',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Commercial Spaces', desc: 'Office space, retail shops & commercial property in Noida', icon: Briefcase,
    alt: 'Commercial office space and retail shops for sale in Noida',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Residential Plots', desc: 'Freehold residential plots in Noida & Greater Noida', icon: MapIcon,
    alt: 'Residential plot for sale in Greater Noida',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'
  },
];

// Property types targeting residential + commercial long-tail keywords
const propertyTypes = [
  { title: '2 & 3 BHK Flats', desc: 'Ready to move and under-construction flats for sale in Noida & Greater Noida', icon: Home },
  { title: '4 BHK Luxury Apartments', desc: 'Premium 4 BHK luxury apartments with clubhouse and amenities', icon: Building },
  { title: 'Independent House', desc: 'Independent houses and builder floors across Delhi NCR', icon: Key },
  { title: 'Residential Plot', desc: 'RERA approved residential plots in Noida and Greater Noida', icon: LandPlot },
  { title: 'Office Space', desc: 'Grade-A office space for sale and lease in Noida & Gurugram', icon: Briefcase },
  { title: 'Commercial Shops & Retail', desc: 'High street retail space and commercial shops in Delhi NCR', icon: Store },
  { title: 'Warehouse & Industrial', desc: 'Warehouse and industrial property for business and logistics', icon: Warehouse },
  { title: 'Rental Income Property', desc: 'High ROI rental income property for long-term investment', icon: RefreshCw },
];

const processSteps = [
  { title: 'Discover', desc: 'Browse our curated collection of verified property listings in Noida, Greater Noida, Gurugram and Delhi matching your budget.', icon: Search },
  { title: 'Visit & Evaluate', desc: 'Schedule accompanied site visits with our local property consultants who provide deep Delhi NCR market insights.', icon: MapPin },
  { title: 'Negotiate & Finance', desc: 'Leverage our banking tie-ups and negotiation expertise to secure the absolute best deal with home loan assistance.', icon: Handshake },
  { title: 'Seamless Handover', desc: 'From legal paperwork and RERA verification to registry and possession, we manage the entire lifecycle.', icon: Key },
];

const testimonials = [
  { name: 'Rajesh Singhania', role: 'Tech Executive', text: 'ANK Realty made finding my luxury apartment in Noida completely effortless. Their transparency and knowledge are unmatched.', rating: 5 },
  { name: 'Meera Kapoor', role: 'Business Owner', text: 'Securing our new corporate office space in Gurugram was a breeze. The team handled negotiations brilliantly, saving us 15% on lease terms.', rating: 5 },
  { name: 'Amit Desai', role: 'NRI Investor', text: 'Managing investments from abroad is tough, but ANK Realty\'s video tours and legal assistance gave me absolute peace of mind.', rating: 5 },
];

// City-specific SEO content (targets local search intent per city)
const topCities = [
  {
    name: 'Noida', count: '1,200+ Properties',
    tag: 'Flats, Apartments & Commercial Property in Noida',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop',
    alt: 'Flats and apartments for sale in Noida skyline'
  },
  {
    name: 'Gurugram', count: '950+ Properties',
    tag: 'Luxury Apartments & Office Space in Gurgaon',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop',
    alt: 'Luxury apartments and commercial office space in Gurugram'
  },
  {
    name: 'Delhi', count: '800+ Properties',
    tag: 'Luxury Homes & Real Estate Consultant in Delhi',
    image: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?q=80&w=800&auto=format&fit=crop',
    alt: 'Luxury homes and property for sale in Delhi'
  },
  {
    name: 'Greater Noida', count: '1,500+ Properties',
    tag: 'Residential Plots & Commercial Shops in Greater Noida',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop',
    alt: 'Residential plots and commercial shops for sale in Greater Noida'
  },
];

const faqs = [
  { q: 'Are all properties listed on your platform verified?', a: 'Yes. Every property undergoes a rigorous 40-point physical and legal verification process before it is listed on ANK Realty, so you get verified property listings across Noida, Greater Noida, Gurugram and Delhi NCR.' },
  { q: 'Do you charge brokerage on new developer projects?', a: 'No, we charge zero brokerage property in Noida on new launch and pre launch developer projects across Delhi NCR.' },
  { q: 'Can you assist with home loan approvals?', a: 'Absolutely. We have exclusive tie-ups with HDFC, SBI, and ICICI to offer expedited approvals and the lowest interest rates as part of our home loan assistance for property buyers.' },
  { q: 'Do you manage NRI property investments?', a: 'Yes, we provide end-to-end portfolio management, virtual tours, and legal compliance specifically tailored for NRI investors buying property in Noida and Delhi NCR.' },
  { q: 'Are your listed projects RERA approved?', a: 'We prioritise RERA approved projects in Noida and Greater Noida, and our legal team verifies RERA registration before any project is listed.' },
  { q: 'What is the difference between leasehold and freehold property?', a: 'Freehold property gives you full ownership of land and building, while leasehold property is held on a long-term lease from a development authority. Read our detailed guide in the Insights section below.' },
];

// Blog / insights keyword targets for content marketing and internal linking
const blogInsights = [
  { title: 'Best Places to Invest in Noida', desc: 'A locality-by-locality breakdown of the best investment in Noida for 2026.', slug: 'best-places-to-invest-in-noida', icon: TrendingUp },
  { title: 'Top Residential Projects in Noida', desc: 'RERA approved residential projects ranked by connectivity, amenities and ROI.', slug: 'top-residential-projects-in-noida', icon: Building },
  { title: 'Property Buying Guide', desc: 'A step-by-step property buying guide for first-time buyers in Delhi NCR.', slug: 'property-buying-guide', icon: BookOpen },
  { title: 'Home Loan Guide', desc: 'Everything you need to know before applying for a home loan in India.', slug: 'home-loan-guide', icon: Banknote },
  { title: 'Stamp Duty Guide', desc: 'Current stamp duty and registration charges across Noida, Greater Noida and Delhi.', slug: 'stamp-duty-guide', icon: FileCheck2 },
  { title: 'Leasehold vs Freehold Property', desc: 'Understand the difference between leasehold and freehold before you buy.', slug: 'leasehold-vs-freehold-property', icon: Shield },
];

// --- ANIMATION VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: 'spring', bounce: 0.3 } }
};
const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, type: 'spring' } }
};
const textReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } }
};

const getYouTubeID = (url) => {
  if (!url) return null;
  try {
    if (url.includes('youtube.com/watch')) return new URLSearchParams(new URL(url).search).get('v');
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
    if (url.includes('youtube.com/embed/')) return url.split('youtube.com/embed/')[1]?.split('?')[0];
  } catch { return null; }
  return null;
};

// --- 3D BUILDING SVG ---
const Building3D = () => (
  <svg viewBox="0 0 420 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0 40px 60px rgba(212,175,55,0.25))' }} role="img" aria-label="3D illustration of premium residential towers in Noida">
    <defs>
      <linearGradient id="bFace" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1a1a2e" />
        <stop offset="100%" stopColor="#16213e" />
      </linearGradient>
      <linearGradient id="bSide" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0f3460" />
        <stop offset="100%" stopColor="#0a2447" />
      </linearGradient>
      <linearGradient id="bTop" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#AA8000" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="winLit" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE47A" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="winDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a2a5e" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0a1535" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="glow" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
      </linearGradient>
      <filter id="gf">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Ground glow */}
    <ellipse cx="210" cy="500" rx="130" ry="18" fill="url(#glow)" />

    {/* === TOWER 1 (main, center) === */}
    {/* Front face */}
    <polygon points="105,460 245,460 245,60 105,60" fill="url(#bFace)" />
    {/* Side face */}
    <polygon points="245,460 310,420 310,20 245,60" fill="url(#bSide)" />
    {/* Top face */}
    <polygon points="105,60 245,60 310,20 170,20" fill="url(#bTop)" />

    {/* Windows - front */}
    {[...Array(12)].map((_, row) =>
      [0, 1, 2].map((col) => {
        const lit = Math.random() > 0.35;
        return (
          <rect
            key={`fw-${row}-${col}`}
            x={120 + col * 38}
            y={75 + row * 32}
            width={22} height={20}
            rx={2}
            fill={lit ? 'url(#winLit)' : 'url(#winDark)'}
            opacity={lit ? 0.95 : 0.7}
          />
        );
      })
    )}

    {/* Windows - side */}
    {[...Array(12)].map((_, row) =>
      [0, 1].map((col) => {
        const lit = Math.random() > 0.4;
        return (
          <polygon
            key={`sw-${row}-${col}`}
            points={`
              ${252 + col * 24},${78 + row * 32}
              ${270 + col * 24},${75 + row * 32}
              ${270 + col * 24},${92 + row * 32}
              ${252 + col * 24},${95 + row * 32}
            `}
            fill={lit ? 'url(#winLit)' : 'url(#winDark)'}
            opacity={lit ? 0.9 : 0.6}
          />
        );
      })
    )}

    {/* Antenna / spire */}
    <line x1="175" y1="20" x2="175" y2="-10" stroke="#D4AF37" strokeWidth="2.5" />
    <circle cx="175" cy="-12" r="4" fill="#D4AF37" opacity="0.9" />
    <circle cx="175" cy="-12" r="8" fill="#D4AF37" opacity="0.2" filter="url(#gf)" />

    {/* === TOWER 2 (left, shorter) === */}
    <polygon points="30,460 105,460 105,160 30,160" fill="#111827" />
    <polygon points="105,460 140,435 140,135 105,160" fill="#0d1e40" />
    <polygon points="30,160 105,160 140,135 65,135" fill="#D4AF37" opacity="0.5" />
    {[...Array(7)].map((_, row) =>
      [0, 1].map((col) => (
        <rect key={`lw-${row}-${col}`} x={40 + col * 30} y={172 + row * 38} width={18} height={16} rx={2}
          fill={Math.random() > 0.4 ? 'url(#winLit)' : 'url(#winDark)'} opacity={0.8} />
      ))
    )}

    {/* === TOWER 3 (right, shorter) === */}
    <polygon points="310,460 380,460 380,190 310,190" fill="#0f172a" />
    <polygon points="380,460 410,445 410,175 380,190" fill="#0a1f40" />
    <polygon points="310,190 380,190 410,175 340,175" fill="#D4AF37" opacity="0.45" />
    {[...Array(7)].map((_, row) =>
      [0, 1].map((col) => (
        <rect key={`rw-${row}-${col}`} x={318 + col * 30} y={202 + row * 35} width={18} height={16} rx={2}
          fill={Math.random() > 0.4 ? 'url(#winLit)' : 'url(#winDark)'} opacity={0.8} />
      ))
    )}

    {/* Ground base */}
    <rect x="20" y="458" width="390" height="12" fill="#0a0a0a" rx="2" />
    <rect x="30" y="468" width="370" height="6" fill="#D4AF37" opacity="0.3" rx="1" />

    {/* Entrance */}
    <rect x="152" y="420" width="42" height="40" rx="4" fill="#D4AF37" opacity="0.15" />
    <rect x="165" y="420" width="5" height="40" rx="1" fill="#D4AF37" opacity="0.3" />
    <rect x="180" y="420" width="5" height="40" rx="1" fill="#D4AF37" opacity="0.3" />

    {/* Gold accent lines */}
    <line x1="105" y1="60" x2="105" y2="460" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
    <line x1="245" y1="60" x2="245" y2="460" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
    <line x1="105" y1="260" x2="245" y2="260" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />

    {/* Floating particles */}
    {[
      { cx: 80, cy: 100, r: 2.5 }, { cx: 340, cy: 140, r: 2 },
      { cx: 60, cy: 300, r: 1.5 }, { cx: 360, cy: 250, r: 2 },
      { cx: 200, cy: 15, r: 3 }, { cx: 155, cy: 40, r: 1.5 },
    ].map((p, i) => (
      <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#D4AF37" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
        <animate attributeName="cy" values={`${p.cy};${p.cy - 8};${p.cy}`} dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </svg>
);

// --- SAFE IMAGE ---
const SafeImg = ({ src, alt, className, fallback }) => {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={errored ? (fallback || FALLBACK_LOGO) : src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setErrored(true)}
    />
  );
};

// =============================================
//  SEO HEAD MANAGER
//  Sets document title, meta tags, canonical link
//  and JSON-LD structured data (RealEstateAgent + FAQPage)
// =============================================
function useSEO() {
  useEffect(() => {
    document.title = SEO_TITLE;

    const setMeta = (attr, key, content) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('name', 'description', SEO_DESCRIPTION);
    setMeta('name', 'keywords', SEO_KEYWORDS);
    setMeta('name', 'robots', 'index, follow');
    setMeta('property', 'og:title', SEO_TITLE);
    setMeta('property', 'og:description', SEO_DESCRIPTION);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', SITE_URL);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', SEO_TITLE);
    setMeta('name', 'twitter:description', SEO_DESCRIPTION);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', SITE_URL);

    // JSON-LD: RealEstateAgent
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: 'ANK Realty',
      description: SEO_DESCRIPTION,
      url: SITE_URL,
      areaServed: [
        { '@type': 'City', name: 'Noida' },
        { '@type': 'City', name: 'Greater Noida' },
        { '@type': 'City', name: 'Gurugram' },
        { '@type': 'City', name: 'Delhi' }
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Sector 62',
        addressLocality: 'Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201309',
        addressCountry: 'IN'
      },
      telephone: '+91-92664-58945',
      email: 'info@ankrealty.com'
    };

    // JSON-LD: FAQPage (drives FAQ rich snippets)
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    };

    const injectSchema = (id, data) => {
      let script = document.getElementById(id);
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    injectSchema('schema-real-estate-agent', orgSchema);
    injectSchema('schema-faq-page', faqSchema);

    return () => {
      // Leave tags in place across route changes within an SPA;
      // they get overwritten by the next page's useSEO call.
    };
  }, []);
}

// =============================================
//  MAIN COMPONENT
// =============================================
export default function HomePage() {
  const navigate = useNavigate();
  const { user, api } = useAuth();

  useSEO();

  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.5], [0, 120]);

  const [search, setSearch] = useState({ category: 'buy', location: '', property_type: '', max_price: '' });
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [resaleProperties, setResaleProperties] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [savedProperties, setSavedProperties] = useState(new Set());

  const [loanLead, setLoanLead] = useState({ name: '', phone: '' });
  const [isLoanSubmitting, setIsLoanSubmitting] = useState(false);
  const [loanAmount, setLoanAmount] = useState(7500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  const [openFaq, setOpenFaq] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      try {
        const [featuredRes, resaleRes, videoRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/properties`),
          axios.get(`${API_BASE}/properties?category=resale&limit=4`),
          axios.get(`${API_BASE}/youtube-videos`),
        ]);
        if (featuredRes.status === 'fulfilled' && featuredRes.value.data) {
          const allProps = featuredRes.value.data;
          setFeaturedProperties(allProps.slice(0, 4));
          const uniqueLocs = [...new Set(allProps.map(p => p.location).filter(Boolean))].sort();
          setAvailableLocations(uniqueLocs);
        }
        if (resaleRes.status === 'fulfilled' && resaleRes.value.data) {
          setResaleProperties(Array.isArray(resaleRes.value.data) ? resaleRes.value.data.slice(0, 4) : []);
        }
        if (videoRes.status === 'fulfilled' && videoRes.value.data) {
          setVideos(Array.isArray(videoRes.value.data) ? videoRes.value.data.slice(0, 3) : []);
        }
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomePageData();
  }, []);

  useEffect(() => {
    if (user && api) {
      api.get('/favorites').then(res => setSavedProperties(new Set(res.data.map(f => f.property_id)))).catch(console.error);
    } else {
      setSavedProperties(new Set());
    }
  }, [user, api]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.category) params.append('category', search.category);
    if (search.property_type) params.append('property_type', search.property_type);
    if (search.location) params.append('location', search.location);
    if (search.max_price) params.append('max_price', search.max_price);
    navigate(`/properties?${params.toString()}`);
  };

  const handleSaveProperty = async (e, propertyId) => {
    e.stopPropagation();
    if (!user) { toast.error('Please login to save properties.'); return navigate('/auth'); }
    try {
      if (savedProperties.has(propertyId)) {
        await api.delete(`/favorites/${propertyId}`);
        setSavedProperties(prev => { const s = new Set(prev); s.delete(propertyId); return s; });
        toast.success('Removed from your collection.');
      } else {
        await api.post('/favorites', { property_id: propertyId });
        setSavedProperties(prev => new Set([...prev, propertyId]));
        toast.success('Property saved to your dashboard.');
      }
    } catch { toast.error('Failed to update favorites. Please try again.'); }
  };

  const handleLoanLead = async () => {
    if (!loanLead.name || loanLead.phone.replace(/\D/g, '').length < 10)
      return toast.error('Please enter a valid name and 10-digit phone number.');
    setIsLoanSubmitting(true);
    try {
      await axios.post(`${API_BASE}/contacts`, {
        name: loanLead.name, phone: loanLead.phone, email: 'N/A',
        interest: 'Home Loan Inquiry',
        message: 'Client requested a callback regarding home loan and EMI consultation from the homepage.',
      });
      toast.success('Request received! Our loan expert will call you shortly.');
      setLoanLead({ name: '', phone: '' });
    } catch { toast.error('Failed to submit. Please try again.'); }
    finally { setIsLoanSubmitting(false); }
  };

  const calculateEMI = () => {
    const p = loanAmount, r = interestRate / 12 / 100, n = loanTenure * 12;
    return (p && r && n) ? Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Price on Request';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getMainImage = (property) =>
    property?.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop';

  const mapLocation = search.location || 'Noida, Uttar Pradesh';
  const dynamicMapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-[#f8f6f1] font-sans text-slate-900 selection:bg-[#D4AF37]/30 relative overflow-x-hidden">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        :root {
          --gold: #D4AF37;
          --gold-light: #F3E5AB;
          --gold-dark: #AA8000;
          --crimson: #8B0000;
          --crimson-dark: #5a0000;
          --ink: #020202;
          --ink-soft: #0f0f0f;
          --cream: #f8f6f1;
          --slate-muted: #94a3b8;
        }
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes pulse-gold { 0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); } 50% { box-shadow: 0 0 0 12px rgba(212,175,55,0); } }
        .shimmer-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); transform: translateX(-100%); }
        .shimmer-btn:hover::after { animation: shimmer 1.2s ease; }
        .float-anim { animation: float 5s ease-in-out infinite; }
        .accent-line { position: relative; }
        .accent-line::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 48px; height: 3px; background: var(--gold); border-radius: 2px; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 4px; background: #1e293b; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--gold); cursor: pointer; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(212,175,55,0.5); }
        select option { background: #1e293b; color: #fff; }
        .card-3d { transform-style: preserve-3d; }
        .card-3d:hover { transform: translateY(-8px) rotateX(2deg); }
        /* Mobile-first scrollbars */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
      `}</style>

      <Navbar />
      <RegisterPopup />

      {/* ===================================================
          1. HERO
      =================================================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--ink)]">
        {/* Background texture */}
        <motion.div style={{ y: heroParallax }} className="absolute inset-0 z-0">
          <div className="absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop')`,
              backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#020202] via-[#0d0d0d]/90 to-[#0a0a12]" />
          {/* Radial accent */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }} />
        </motion.div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: text + search */}
            <div>
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
                <motion.div variants={textReveal}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--gold)]/25 bg-[var(--gold)]/8 text-[var(--gold)] text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
                  <Award className="w-3.5 h-3.5" /> Best Property Dealer in Noida &amp; Delhi NCR
                </motion.div>

                {/* H1 carries the primary keyword cluster for on-page SEO */}
                <motion.h1 variants={textReveal}
                  className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
                  Real Estate in Noida &amp; <br />
                  <span className="italic text-[var(--gold)]">Premium Property</span>{' '}
                  <span className="text-white">in Delhi NCR</span>
                </motion.h1>

                <motion.p variants={textReveal}
                  className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed font-light">
                  ANK Realty is a trusted real estate company in Noida helping you buy verified luxury apartments, residential plots and commercial property across Noida, Greater Noida, Gurugram and Delhi — with zero brokerage and expert home loan assistance.
                </motion.p>

                {/* Stats inline */}
                <motion.div variants={textReveal} className="flex flex-wrap gap-6 pt-2">
                  {[
                    { v: '10K+', l: 'Verified Listings' }, { v: '5K+', l: 'Families' }, { v: '25+', l: 'Cities' }
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="text-2xl font-bold text-[var(--gold)]">{s.v}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{s.l}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Search Panel */}
              <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7, type: 'spring' }}
                className="mt-10 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-5 border border-white/60"
              >
                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 mb-5 pb-4 border-b border-slate-100">
                  {categoryOptions.map(cat => (
                    <button key={cat.value} onClick={() => setSearch(p => ({ ...p, category: cat.value }))}
                      className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        search.category === cat.value
                          ? 'bg-[var(--crimson)] text-white shadow-lg'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}>
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  {[
                    { icon: MapPin, key: 'location', label: 'Location', options: availableLocations.map(l => ({ label: l, value: l })) },
                    { icon: Building2, key: 'property_type', label: 'Type', options: [{ label: 'Apartment', value: 'apartment' }, { label: 'Villa', value: 'villa' }, { label: 'Commercial', value: 'commercial' }, { label: 'Plot', value: 'plot' }] },
                    { icon: DollarSign, key: 'max_price', label: 'Budget', options: [{ label: 'Up to ₹50 Lac', value: '5000000' }, { label: 'Up to ₹1 Cr', value: '10000000' }, { label: 'Up to ₹3 Cr', value: '30000000' }, { label: 'Above ₹3 Cr', value: '50000000' }] },
                  ].map((s, i) => (
                    <div key={i} className="relative bg-slate-50 rounded-xl border border-slate-200 hover:border-[var(--gold)]/50 transition-colors group">
                      <s.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-[var(--gold)] transition-colors" />
                      <select value={search[s.key]} onChange={e => setSearch(p => ({ ...p, [s.key]: e.target.value }))}
                        className="h-12 pl-10 pr-4 bg-transparent border-0 w-full text-slate-700 appearance-none outline-none text-sm font-medium cursor-pointer">
                        <option value="">{s.label}</option>
                        {s.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="shimmer-btn relative overflow-hidden w-full h-12 bg-[var(--crimson)] text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:bg-[var(--crimson-dark)]">
                  <Search className="h-4 w-4" /> Search Properties
                </motion.button>
              </motion.div>
            </div>

            {/* Right: 3D Building */}
            <motion.div
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1, type: 'spring' }}
              className="hidden lg:flex items-end justify-center float-anim"
              style={{ height: '560px' }}
            >
              <Building3D />
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--cream)] to-transparent z-10 pointer-events-none" />
      </section>

      {/* ===================================================
          2. STATS BAR
      =================================================== */}
      <section className="relative z-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
            {[
              { label: 'Verified Property Listings', value: '10,000+', icon: ShieldCheck },
              { label: 'Happy Families', value: '5,000+', icon: Users },
              { label: 'Cities Covered', value: '25+', icon: MapPin },
              { label: 'Years of Legacy', value: '15+', icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -3 }} className="flex flex-col items-center py-8 px-4 text-center group">
                <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-3 group-hover:bg-[var(--gold)]/20 transition-colors">
                  <stat.icon className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          2B. SEO INTRO CONTENT
          Crawlable keyword-rich paragraph introducing the brand
      =================================================== */}
      <section className="py-14 px-4 sm:px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-slate-900 mb-4">
            Your Trusted Real Estate Consultant in Delhi NCR
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Looking to <strong>buy property in Noida</strong> or explore <strong>commercial property in Noida</strong>?
            ANK Realty is a full-service <strong>real estate company in Noida</strong> offering verified property listings
            across <strong>Noida</strong>, <strong>Greater Noida</strong>, <strong>Gurugram</strong> and <strong>Delhi</strong>.
            As a <strong>best property dealer in Noida</strong>, we help you find <strong>luxury apartments in Noida</strong>,
            residential plots, independent houses and Grade-A office space — backed by RERA verification, zero
            brokerage on select projects, and dedicated home loan assistance for property buyers.
          </p>
        </div>
      </section>

      {/* ===================================================
          3. EXPLORE CATEGORIES
      =================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Portfolio</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-tight">
              Explore Our <em>Asset Classes</em>
            </h2>
            <p className="text-slate-500 mt-4 max-w-2xl text-sm sm:text-base">
              From luxury villas to commercial property in Noida — browse premium property in Delhi NCR by category.
            </p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {exploreCategories.map((cat, i) => (
              <motion.div key={i} variants={scaleUp}
                onClick={() => navigate(`/properties?property_type=${cat.title.split(' ')[1]?.toLowerCase() || cat.title.toLowerCase()}`)}
                className="relative h-80 sm:h-96 rounded-2xl overflow-hidden group cursor-pointer"
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <img src={cat.image} alt={cat.alt || cat.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/90 via-[#020202]/30 to-transparent" />
                <div className="absolute inset-0 bg-[var(--gold)]/0 group-hover:bg-[var(--gold)]/5 transition-colors duration-500" />
                <div className="absolute bottom-6 left-6 right-6">
                  <cat.icon className="w-8 h-8 text-[var(--gold)] mb-3" />
                  <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                  <p className="text-slate-300 text-sm mt-1">{cat.desc}</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          3B. PROPERTY TYPES (Residential + Commercial keywords)
      =================================================== */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Property Types</p>
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900 leading-tight">
              Residential &amp; <em>Commercial Property</em>
            </h2>
            <p className="text-slate-500 mt-4 text-sm sm:text-base">
              Whether you need a 2 BHK flat, a 4 BHK luxury apartment, or warehouse and industrial space — we cover every property type in Delhi NCR.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {propertyTypes.map((pt, i) => (
              <motion.div key={i} whileHover={{ y: -4 }}
                onClick={() => navigate('/properties')}
                className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-[var(--gold)]/40 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-[var(--crimson)] transition-colors">
                  <pt.icon className="w-5 h-5 text-[var(--crimson)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">{pt.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{pt.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          4. HOW IT WORKS
      =================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Process</p>
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900 leading-tight">Your Journey to the <em>Perfect Property</em></h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-16 right-16 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            {processSteps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="text-center relative group"
              >
                <div className="w-20 h-20 mx-auto bg-white border-2 border-slate-100 rounded-full shadow-lg flex items-center justify-center relative z-10 group-hover:border-[var(--gold)]/40 transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-[var(--crimson)]" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[var(--gold)] text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white shadow">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          5. FEATURED PROPERTIES
      =================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--ink)] text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <p className="text-[var(--gold)] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Signature Collection
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-white">Exclusive <em>Primary Listings</em></h2>
              <p className="text-slate-400 mt-3 text-sm sm:text-base max-w-xl">Verified property listings, new launch projects and pre launch projects across Noida and Delhi NCR.</p>
            </div>
            <Link to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-sm font-semibold text-white hover:bg-white hover:text-slate-900 transition-all whitespace-nowrap">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" /></div>
          ) : featuredProperties.length > 0 ? (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map(property => {
                const isSaved = savedProperties.has(property.id);
                return (
                  <motion.div variants={fadeUp} key={property.id}
                    className="card-3d bg-[#111] rounded-2xl overflow-hidden border border-white/10 cursor-pointer group flex flex-col transition-all duration-300 hover:border-[var(--gold)]/30"
                    onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                  >
                    <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-900 z-20 flex items-center gap-1.5 uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-[var(--gold)]" /> {property.projectStatus || 'Featured'}
                    </div>
                    <button onClick={e => handleSaveProperty(e, property.id)}
                      aria-label={isSaved ? 'Remove from saved properties' : 'Save property'}
                      className={`absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center z-20 border transition-colors ${isSaved ? 'border-[var(--crimson)] text-[var(--crimson)]' : 'border-white/20 text-white hover:text-[var(--crimson)]'}`}>
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-[var(--crimson)]' : ''}`} />
                    </button>
                    <div className="relative h-56 overflow-hidden bg-slate-800">
                      <img src={getMainImage(property)} alt={`${property.title} - ${property.property_type || 'property'} for sale in ${property.location || 'Noida'}`}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] mb-1">{property.category} · {property.property_type}</p>
                        <h3 className="text-lg font-bold text-white line-clamp-1">{property.title}</h3>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-slate-400 text-sm mb-4 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" /> {property.location}, {property.city}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="font-bold text-white text-xl">{formatCurrency(property.price)}</span>
                        <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-[var(--crimson)] flex items-center justify-center transition-colors border border-white/10">
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <p className="text-center py-10 text-slate-500">No premium properties currently available.</p>
          )}
        </div>
      </section>

      {/* ===================================================
          6. PARTNER LOGOS
      =================================================== */}
      <section className="py-16 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-10 text-center">Network &amp; Developer Partners</p>
          <div className="relative flex flex-col gap-8"
            style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            {[
              { logos: topRowLogos, dir: -1 },
              { logos: bottomRowLogos, dir: 1 },
            ].map((row, ri) => (
              <motion.div key={ri}
                animate={{ x: row.dir === -1 ? ['0%', '-50%'] : ['-50%', '0%'] }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                className="flex gap-12 sm:gap-20 w-max items-center">
                {[...row.logos, ...row.logos, ...row.logos, ...row.logos].map((src, i) => (
                  <div key={i} className="shrink-0 w-28 sm:w-36 h-14 flex items-center justify-center">
                    <SafeImg src={src} alt="ANK Realty developer partner logo" fallback={FALLBACK_LOGO}
                      className="max-w-full max-h-full object-contain grayscale opacity-35 hover:grayscale-0 hover:opacity-90 transition-all duration-400" />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          7. RESALE PROPERTIES
      =================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Secondary Market
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-slate-900">Ready to <em>Move-In Homes</em></h2>
              <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl">Ready to move flats in Noida, Greater Noida and Gurugram with immediate possession.</p>
            </div>
            <Link to="/properties?category=resale"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--crimson)] text-sm font-semibold text-white hover:bg-[var(--crimson-dark)] transition-colors whitespace-nowrap">
              View All Resale <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--crimson)]" /></div>
          ) : resaleProperties.length > 0 ? (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {resaleProperties.map(property => {
                const isSaved = savedProperties.has(property.id);
                return (
                  <motion.div variants={fadeUp} key={property.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group flex flex-col hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                    onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                  >
                    <div className="absolute top-4 left-4 bg-emerald-500 px-3 py-1.5 rounded-full text-[10px] font-bold text-white z-20 flex items-center gap-1.5 uppercase tracking-widest">
                      <Key className="w-3 h-3" /> {property.projectStatus || 'Ready'}
                    </div>
                    <button onClick={e => handleSaveProperty(e, property.id)}
                      aria-label={isSaved ? 'Remove from saved properties' : 'Save property'}
                      className={`absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center z-20 shadow-sm transition-colors ${isSaved ? 'text-[var(--crimson)]' : 'text-slate-400 hover:text-[var(--crimson)]'}`}>
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-[var(--crimson)]' : ''}`} />
                    </button>
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      <img src={getMainImage(property)} alt={`${property.title} - resale property in ${property.location || 'Noida'}`}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'; }}
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-[var(--crimson)] transition-colors line-clamp-1">{property.title}</h3>
                      <p className="text-slate-400 text-sm flex items-center gap-1.5 mb-4">
                        <MapPin className="w-3.5 h-3.5 shrink-0" /> {property.location}, {property.city}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="font-bold text-slate-900 text-lg">{formatCurrency(property.price)}</span>
                        <div className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-[var(--crimson)] flex items-center justify-center transition-colors">
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <p className="text-center py-10 text-slate-500">No resale properties currently available.</p>
          )}
        </div>
      </section>

      {/* ===================================================
          8. TOP CITIES (local SEO)
      =================================================== */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Locations</p>
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900">Property in Noida, Greater Noida, <em>Gurugram &amp; Delhi</em></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topCities.map((city, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/properties?location=${city.name}`)}
                className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-md"
              >
                <img src={city.image} alt={city.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-xl font-bold text-white">{city.name}</h3>
                  <p className="text-slate-300 text-sm mt-0.5">{city.count}</p>
                  <p className="text-slate-400 text-xs mt-1.5 leading-snug">{city.tag}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          9. VIDEO TOURS
      =================================================== */}
      {videos.length > 0 && (
        <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--ink)] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--crimson)]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <p className="text-[var(--gold)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Virtual Tours</p>
              <h2 className="font-display text-4xl sm:text-5xl text-white">Immersive <em>Property Tours</em></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map(vid => {
                const ytId = getYouTubeID(vid.videoUrl);
                return (
                  <motion.div key={vid.id} whileHover={{ y: -6 }}
                    className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 flex flex-col backdrop-blur-sm hover:border-[var(--gold)]/30 transition-colors">
                    <div className="relative aspect-video bg-black">
                      {ytId
                        ? <iframe src={`https://www.youtube.com/embed/${ytId}?rel=0`} title={vid.title} className="w-full h-full absolute inset-0" allowFullScreen />
                        : <div className="w-full h-full flex items-center justify-center text-slate-600"><Video className="w-8 h-8" /></div>
                      }
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)] mb-2 flex items-center gap-1.5">
                        <PlayCircle className="w-3.5 h-3.5" /> Watch Now
                      </p>
                      <h3 className="font-bold text-white text-base mb-2 line-clamp-2">{vid.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{vid.description || 'Exclusive insights and walkthroughs from our real estate experts.'}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Link to="/videos">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[var(--gold)] text-[var(--gold)] font-semibold text-sm hover:bg-[var(--gold)] hover:text-slate-900 transition-all">
                  Explore Video Gallery <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================
          10. WHY ANK REALTY (investment keywords)
      =================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3">The ANK Advantage</p>
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900">Best Property Investment <em>in India</em></h2>
            <p className="text-slate-500 mt-4 text-sm sm:text-base">High ROI property, RERA approved projects and rental income property — chosen by serious investors.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { t: 'Zero Brokerage Property', d: 'Zero brokerage property in Noida on new launch and pre launch developer projects. Every rupee stays with you.', i: DollarSign },
              { t: 'RERA Approved & Verified', d: '40-point legal and physical verification with a focus on RERA approved projects in Noida before any listing goes live.', i: Shield },
              { t: 'High ROI Rental Income', d: 'Curated high ROI property and rental income property options for long-term wealth creation.', i: ThumbsUp },
            ].map((usp, i) => (
              <motion.div key={i} whileHover={{ y: -6 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 group hover:border-[var(--gold)]/40 transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[var(--crimson)] transition-colors">
                  <usp.i className="w-7 h-7 text-[var(--gold)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{usp.t}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{usp.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          11. TESTIMONIALS
      =================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900">Voices of <em>Trust</em></h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }}
                className="bg-slate-50 p-8 rounded-2xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--gold)]" />
                <div className="flex gap-1 mb-5 pl-2">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 text-sm italic pl-2">"{t.text}"</p>
                <div className="pl-2">
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs font-semibold text-[var(--crimson)] uppercase tracking-widest mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          12. EMI CALCULATOR
      =================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--ink)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--crimson)]/15 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--gold)]/8 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="text-[var(--gold)] font-bold uppercase tracking-[0.25em] text-xs mb-3">Financial Planning</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white">Smart <em>EMI Calculator</em></h2>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/10 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-8">
              {[
                { label: 'Loan Amount', value: formatCurrency(loanAmount), state: loanAmount, set: setLoanAmount, min: 500000, max: 100000000, step: 100000 },
                { label: 'Interest Rate (p.a.)', value: `${interestRate.toFixed(1)}%`, state: interestRate, set: setInterestRate, min: 5, max: 15, step: 0.1 },
                { label: 'Loan Tenure', value: `${loanTenure} Years`, state: loanTenure, set: setLoanTenure, min: 1, max: 30, step: 1 }
              ].map((inp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{inp.label}</label>
                    <span className="text-lg font-bold text-[var(--gold)]">{inp.value}</span>
                  </div>
                  <input type="range" min={inp.min} max={inp.max} step={inp.step} value={inp.state}
                    onChange={e => inp.set(Number(e.target.value))} className="w-full" aria-label={inp.label} />
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-[var(--crimson)] to-[#3a0000] p-8 rounded-2xl text-center border border-[var(--crimson)]/30 shadow-2xl">
              <Calculator className="w-10 h-10 text-[var(--gold)] mb-4 mx-auto opacity-80" />
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Monthly EMI</p>
              <h3 className="text-4xl sm:text-5xl font-black text-white mb-8">{formatCurrency(calculateEMI())}</h3>
              <div className="space-y-3 pt-6 border-t border-white/15 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Principal</span><span className="font-bold text-white">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Total Interest</span><span className="font-bold text-white">{formatCurrency((calculateEMI() * loanTenure * 12) - loanAmount)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/15">
                  <span className="text-white font-semibold text-xs uppercase tracking-wider">Total Payable</span>
                  <span className="font-black text-[var(--gold)] text-lg">{formatCurrency(calculateEMI() * loanTenure * 12)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          13. LOAN ADVISORY
      =================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-4">Financial Advisory</p>
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900 leading-tight mb-6">
              Home Loan Assistance for <em>Property Buyers</em>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Skip the bank queues. Our financial experts guide you to the lowest interest rates and highest loan eligibility instantly — part of our end-to-end real estate consultant service.
            </p>
            <div className="space-y-3">
              {bankOffers.map((offer, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base text-slate-900">{offer.bank}</p>
                    <p className="text-[var(--crimson)] text-xs font-semibold uppercase tracking-wider mt-0.5">{offer.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--gold)] font-black text-xl">{offer.rate}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Indicative ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-[var(--gold)]/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="bg-[var(--gold)]/15 p-3.5 rounded-xl border border-[var(--gold)]/20">
                <Banknote className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Request Loan Call</h3>
                <p className="text-slate-400 text-sm">Get a free consultation today</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6 relative z-10">
              <Input value={loanLead.name} onChange={e => setLoanLead(p => ({ ...p, name: e.target.value }))}
                placeholder="Full name" className="bg-white/8 border-white/15 text-white h-13 rounded-xl px-4 placeholder:text-slate-500 focus:border-[var(--gold)]" />
              <Input value={loanLead.phone} onChange={e => setLoanLead(p => ({ ...p, phone: e.target.value }))}
                placeholder="Phone number" type="tel" className="bg-white/8 border-white/15 text-white h-13 rounded-xl px-4 placeholder:text-slate-500 focus:border-[var(--gold)]" />
            </div>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={handleLoanLead} disabled={isLoanSubmitting}
              className="w-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] text-slate-900 h-13 rounded-xl text-sm font-bold shadow-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity relative z-10">
              {isLoanSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get Free Consultation <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          13B. INSIGHTS / BLOG (content marketing keywords)
      =================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--cream)] border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" /> Insights
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900">Real Estate <em>Market Trends</em> &amp; Guides</h2>
            <p className="text-slate-500 mt-4 text-sm sm:text-base">Property buying guides, home loan guides, and stamp duty guides to help you invest with confidence.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogInsights.map((post, i) => (
              <motion.div key={i} whileHover={{ y: -5 }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="bg-white p-7 rounded-2xl border border-slate-200 hover:border-[var(--gold)]/40 hover:shadow-lg transition-all cursor-pointer group">
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center mb-5 group-hover:bg-[var(--crimson)] transition-colors">
                  <post.icon className="w-5 h-5 text-[var(--crimson)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-[var(--crimson)] transition-colors">{post.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          14. FAQ
      =================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900 mb-3">Frequently Asked <em>Questions</em></h2>
            <p className="text-slate-500 text-sm">Everything you need to know about buying and leasing property in Noida, Greater Noida, Gurugram and Delhi NCR.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full p-5 sm:p-6 text-left flex justify-between items-center text-slate-900 font-semibold text-sm sm:text-base hover:text-[var(--crimson)] transition-colors gap-4">
                  <span>{faq.q}</span>
                  <Plus className={`w-5 h-5 text-[var(--gold)] shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="px-5 sm:px-6 pb-5 text-slate-600 text-sm leading-relaxed">
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          15. MAP & NEWSLETTER
      =================================================== */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[var(--crimson)] font-bold uppercase tracking-[0.25em] text-xs mb-4 flex items-center gap-2">
              <MapIcon className="w-4 h-4" /> Location Intelligence
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-slate-900 mb-5 leading-tight">
              Explore {search.location || 'Noida & Delhi NCR'} <em>Visually</em>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8 text-sm sm:text-base">
              Use our interactive map to discover connectivity hubs, upcoming metro lines, and social infrastructure driving real estate appreciation in Noida, Greater Noida, Gurugram and Delhi.
            </p>
            <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[var(--gold)] opacity-10 blur-3xl rounded-full pointer-events-none" />
              <h4 className="text-xl font-bold mb-1.5 relative z-10">Join our VIP list</h4>
              <p className="text-slate-400 text-sm mb-5 relative z-10">Get exclusive access to pre launch projects, new launch projects and market reports.</p>
              <div className="flex gap-3 relative z-10">
                <Input value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email" className="bg-white/10 border-white/20 text-white h-12 rounded-xl placeholder:text-slate-500 focus:border-[var(--gold)] flex-1" />
                <Button onClick={() => { toast.success('Welcome to the VIP list!'); setNewsletterEmail(''); }}
                  className="h-12 px-5 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-slate-900 font-bold rounded-xl">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
            <iframe src={dynamicMapSrc} width="100%" height="100%" title="ANK Realty property location map"
              style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[20%] hover:grayscale-0 transition-all duration-700" />
          </div>
        </div>
      </section>

      {/* ===================================================
          16. FOOTER
      =================================================== */}
      <footer className="bg-[var(--ink)] text-white pt-16 sm:pt-20 pb-10 px-4 sm:px-6 border-t-4 border-[var(--crimson)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            <div className="space-y-6">
              <h3 className="font-display text-3xl text-[var(--gold)]">ANK <span className="text-white not-italic">REALTY</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A trusted real estate company in Noida offering premium property discovery, verified advisory,
                corporate leasing, and owner-first listing support across Noida, Greater Noida, Gurugram and Delhi NCR.
              </p>
              <div className="flex gap-3">
                {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Follow ANK Realty on social media"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--gold)] hover:bg-[var(--crimson)] hover:border-[var(--crimson)] hover:text-white transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs mb-6 text-white uppercase tracking-[0.2em]">Quick Links</h4>
              <ul className="space-y-3.5 text-slate-400 text-sm">
                {['All Properties', 'About Us', 'Careers', 'Contact Support', 'Submit Property'].map((item, i) => (
                  <li key={i}><Link to="#" className="hover:text-[var(--gold)] transition-colors flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--crimson)]" /> {item}
                  </Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs mb-6 text-white uppercase tracking-[0.2em]">Categories</h4>
              <ul className="space-y-3.5 text-slate-400 text-sm">
                {['Premium Plots', 'Residential Homes', 'Corporate Leasing', 'Rental Homes', 'New Launch Projects'].map((item, i) => (
                  <li key={i}><Link to="#" className="hover:text-[var(--gold)] transition-colors flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--crimson)]" /> {item}
                  </Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs mb-6 text-white uppercase tracking-[0.2em]">Headquarters</h4>
              <div className="space-y-3.5">
                {[
                  { icon: MapPin, text: ' 207, JS Arcade, Sec-18, Noida, Uttar Pradesh - 201301' },
                  { icon: Mail, text: 'info@ankrealty.com' },
                  { icon: Phone, text: '+91 92664 58945' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5 hover:border-[var(--gold)]/30 transition-colors group">
                    <item.icon className="w-4.5 h-4.5 text-[var(--gold)] shrink-0 mt-0.5" />
                    <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row justify-between items-center gap-5 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((t, i) => (
                <Link key={i} to={`/${t.toLowerCase().replace(/ /g, '-')}`}
                  className="hover:text-[var(--gold)] transition-colors">{t}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
