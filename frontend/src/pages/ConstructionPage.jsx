import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  HardHat, Hammer, Ruler, ShieldCheck, Clock, CheckCircle,
  ArrowRight, MapPin, Building, Phone, Mail, Loader2, Maximize,
  ChevronRight, Instagram, Linkedin, Twitter, Facebook, ArrowUpRight,
  Plus, Layers, HomeIcon, Warehouse, FileCheck2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

const SITE_URL = 'https://www.ankrealty.com';
const PAGE_PATH = '/construction';

// --- SEO CONSTANTS ---
const SEO_TITLE = 'Construction Company in Noida | Turnkey Building & Development Services | ANK Realty';
const SEO_DESCRIPTION = 'ANK Realty is a leading construction company in Noida offering turnkey construction, architectural design, RERA-compliant project management, and commercial & residential construction services across Noida, Greater Noida, Gurugram and Delhi NCR.';
const SEO_KEYWORDS = [
  'Construction Company in Noida', 'Building Construction Noida', 'Turnkey Construction Services',
  'Commercial Construction Noida', 'Residential Construction Delhi NCR', 'RERA Approved Construction',
  'Architectural Design Services', 'Best Construction Company in Delhi NCR', 'Under Construction Projects Noida',
  'New Launch Projects Noida', 'Pre Launch Property Noida', 'Project Management Construction',
  'Construction Company Greater Noida', 'Construction Company Gurugram', 'Civil Contractor Noida',
  'Commercial Property in Noida', 'Real Estate Consultant', 'Verified Property Listings',
  'Best Property Investment in India', 'High ROI Property'
].join(', ');

const services = [
  { title: "Turnkey Construction", desc: "End-to-end building solutions from foundation to final handover with strict quality control, delivered by a trusted construction company in Noida.", icon: Hammer },
  { title: "Architectural Design", desc: "Modern, sustainable, and space-efficient blueprints crafted by top-tier architects for residential and commercial projects.", icon: Ruler },
  { title: "Project Management", desc: "Dedicated supervisors ensuring your construction project is delivered exactly on time and within budget.", icon: Clock },
  { title: "Legal & Compliance", desc: "Hassle-free approvals, RERA compliance, and environmental clearances handled by our in-house legal experts.", icon: ShieldCheck }
];

// Construction categories targeting long-tail residential + commercial keywords
const constructionTypes = [
  { title: 'Residential Construction', desc: 'Independent houses, builder floors and residential towers built to last.', icon: HomeIcon },
  { title: 'Commercial Construction', desc: 'Office space, retail complexes and commercial property construction in Noida.', icon: Building },
  { title: 'Industrial & Warehousing', desc: 'Warehouse and industrial construction engineered for logistics and manufacturing.', icon: Warehouse },
  { title: 'Renovation & Interiors', desc: 'Structural renovation and interior fit-outs for existing residential and commercial spaces.', icon: Layers },
];

const areasServed = [
  { name: 'Noida', desc: 'Construction company in Noida for residential and commercial builds' },
  { name: 'Greater Noida', desc: 'Turnkey construction services in Greater Noida' },
  { name: 'Gurugram', desc: 'Commercial construction and office build-outs in Gurugram' },
  { name: 'Delhi', desc: 'Residential construction and renovation across Delhi' },
];

const faqs = [
  { q: 'What construction services does ANK Realty offer in Noida?', a: 'We offer turnkey construction, architectural design, project management, and legal & RERA compliance services for residential and commercial construction across Noida, Greater Noida, Gurugram and Delhi NCR.' },
  { q: 'Are your construction projects RERA compliant?', a: 'Yes. Every project we undertake follows RERA compliance guidelines, with our legal team managing approvals and environmental clearances from start to finish.' },
  { q: 'Do you handle both residential and commercial construction?', a: 'Yes, ANK Realty handles residential construction (independent houses, apartments, builder floors) as well as commercial construction (office space, retail, warehouses) across Delhi NCR.' },
  { q: 'How do I get a construction quote?', a: 'Fill out the inquiry form below with your project details, or call us directly — our team typically responds within one business day with a custom quote.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// =============================================
//  SEO HEAD MANAGER
//  Sets document title, meta tags, canonical link
//  and JSON-LD structured data (GeneralContractor + FAQPage)
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
    setMeta('property', 'og:url', `${SITE_URL}${PAGE_PATH}`);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', SEO_TITLE);
    setMeta('name', 'twitter:description', SEO_DESCRIPTION);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${SITE_URL}${PAGE_PATH}`);

    // JSON-LD: GeneralContractor / Service provider
    const contractorSchema = {
      '@context': 'https://schema.org',
      '@type': 'GeneralContractor',
      name: 'ANK Realty Construction',
      description: SEO_DESCRIPTION,
      url: `${SITE_URL}${PAGE_PATH}`,
      areaServed: areasServed.map(a => ({ '@type': 'City', name: a.name })),
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Sector 62',
        addressLocality: 'Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201309',
        addressCountry: 'IN'
      },
      telephone: '+91-92664-58945',
      email: 'info@ankrealty.com',
      makesOffer: services.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.desc }
      }))
    };

    // JSON-LD: FAQPage
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

    injectSchema('schema-general-contractor', contractorSchema);
    injectSchema('schema-construction-faq', faqSchema);
  }, []);
}

export default function ConstructionPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  const [form, setForm] = useState({ name: '', phone: '', email: '', projectType: '', message: '' });
  const [status, setStatus] = useState('idle');

  useSEO();

  // CRITICAL FIX: Fetch directly by category to ensure construction properties show here
  useEffect(() => {
    const fetchConstructionProps = async () => {
      try {
        const res = await axios.get(`${API_BASE}/properties?category=construction`);

        // Fallback filter just in case any older properties use 'Under Construction' status but 'buy' category
        const combinedProps = res.data.filter(p =>
          p.category === 'construction' ||
          p.project_status === 'Under Construction' ||
          p.project_status === 'New Launch'
        );

        setProperties(combinedProps);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoadingProps(false);
      }
    };
    fetchConstructionProps();
  }, []);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error("Name and Phone are required.");

    setStatus('submitting');
    try {
      await axios.post(`${API_BASE}/contacts`, {
        name: form.name,
        phone: form.phone,
        email: form.email || 'N/A',
        interest: `Construction Services: ${form.projectType || 'General'}`,
        message: form.message
      });

      setStatus('success');
      setForm({ name: '', phone: '', email: '', projectType: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (error) {
      console.error("Form Submission Error:", error);
      toast.error("Failed to submit your request. Please try again.");
      setStatus('idle');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Price on Request';
    if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} Lac`;
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#D4AF37]/30">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="bg-[#050505] text-white pt-32 pb-24 px-6 relative overflow-hidden flex items-center min-h-[90vh]">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/60 to-[#050505] z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent z-0" />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-black tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              <HardHat className="w-4 h-4" /> Premium Construction Company in Noida
            </motion.div>

            {/* H1 carries the primary construction keyword cluster */}
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[5rem] font-black leading-[1.1] tracking-tight">
              Building the <br/>Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA8000]">Real Estate.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-xl">
              ANK Realty is a trusted construction company in Noida delivering turnkey construction services,
              RERA-compliant residential construction and commercial construction across Noida, Greater Noida,
              Gurugram and Delhi NCR — with zero compromises on quality.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-5 pt-2">
              <Button onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-[#8B0000] to-[#600000] hover:from-[#600000] hover:to-[#400000] text-white font-black h-14 px-8 rounded-full shadow-xl shadow-[#8B0000]/30 text-base transition-all hover:-translate-y-1">
                Consult Our Engineers
              </Button>
              <Button onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })} variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/40 font-bold h-14 px-8 rounded-full text-base transition-all hover:-translate-y-1">
                View Active Sites
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Stats Glassmorphism */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="hidden lg:grid grid-cols-2 gap-5">
             {[
               { value: '2.5M+', label: 'Sq.Ft Developed', border: 'border-t-[#D4AF37]' },
               { value: '45+', label: 'Projects Delivered', border: 'border-r-[#D4AF37]' },
               { value: '100%', label: 'RERA Compliant', border: 'border-l-[#D4AF37]' },
               { value: '15+', label: 'Years Experience', border: 'border-b-[#D4AF37]' }
             ].map((stat, i) => (
               <div key={i} className={`bg-white/5 backdrop-blur-xl border border-white/10 ${stat.border} border-t-2 p-8 rounded-[2rem] text-center hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-2xl`}>
                 <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2">{stat.value}</h3>
                 <p className="text-[11px] font-black text-[#D4AF37] uppercase tracking-widest">{stat.label}</p>
               </div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* --- SEO INTRO CONTENT --- */}
      <section className="py-14 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
            A Trusted Construction Company in Noida &amp; Delhi NCR
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
            Looking for a reliable <strong>construction company in Noida</strong> for your next residential or commercial
            build? ANK Realty provides <strong>turnkey construction services</strong>, <strong>architectural design services</strong>,
            and end-to-end <strong>project management</strong> with full <strong>RERA compliance</strong>. We specialise in{' '}
            <strong>residential construction in Delhi NCR</strong>, <strong>commercial construction in Noida</strong>, and
            industrial &amp; warehousing projects — backed by transparent pricing and on-time delivery commitments across
            Noida, Greater Noida, Gurugram and Delhi.
          </p>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-32 px-6 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center max-w-3xl mx-auto mb-20">
            <motion.p variants={fadeUp} className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4">Our Expertise</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">Comprehensive Development Solutions</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg font-medium">We handle every phase of the construction lifecycle, ensuring your vision becomes a reality flawlessly.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((srv, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-500 group flex flex-col text-left hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-8 group-hover:bg-[#8B0000] group-hover:border-[#8B0000] group-hover:scale-110 transition-all duration-500">
                  <srv.icon className="w-8 h-8 text-[#D4AF37] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{srv.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{srv.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CONSTRUCTION TYPES (long-tail keyword coverage) --- */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4">What We Build</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Residential &amp; Commercial Construction</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {constructionTypes.map((ct, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-7 rounded-[2rem] border border-slate-200 hover:border-[#D4AF37]/50 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8B0000] transition-colors duration-300">
                  <ct.icon className="w-7 h-7 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{ct.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{ct.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ONGOING PROJECTS (API FETCHED) --- */}
      <section id="projects" className="py-32 px-6 bg-slate-50 border-t border-slate-200 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-2"><Building className="w-4 h-4" /> Active Developments</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Under Construction Projects in Noida</h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="border-slate-300 font-bold hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] transition-colors h-14 px-8 rounded-full text-base">Explore All <ArrowUpRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>

          {loadingProps ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3].map(n => (
                 <div key={n} className="bg-white h-[450px] rounded-[2.5rem] border border-slate-200 animate-pulse flex flex-col overflow-hidden">
                   <div className="h-64 bg-slate-200 w-full" />
                   <div className="p-8 space-y-4">
                     <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                     <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                     <div className="h-10 bg-slate-200 rounded-xl w-full mt-6" />
                   </div>
                 </div>
               ))}
             </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 6).map((property) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  key={property.id}
                  onClick={() => navigate(`/property/${property.id}`)}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:-translate-y-2 hover:border-[#D4AF37]/50 transition-all duration-500 cursor-pointer relative group flex flex-col"
                >

                  {/* Status Badge */}
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black text-[#8B0000] shadow-xl z-20 flex items-center gap-2 uppercase tracking-widest border border-white/50">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    {property.project_status || 'Under Construction'}
                  </div>

                  <div className="relative h-72 overflow-hidden bg-slate-100">
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                     <img
                       src={property.images?.[0] || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'}
                       alt={`${property.title} - under construction project in ${property.location || 'Noida'}`}
                       loading="lazy"
                       className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                     <div className="absolute bottom-6 left-6 z-20 pr-6">
                        <h3 className="text-2xl font-black text-white mb-2 line-clamp-1 drop-shadow-lg">{property.title}</h3>
                        <p className="text-slate-300 text-sm flex items-center font-medium drop-shadow-md">
                          <MapPin className="w-4 h-4 mr-1.5 text-[#D4AF37]"/> {property.location}, {property.city}
                        </p>
                     </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col bg-white">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-widest">Expected Delivery</p>
                        <p className="font-black text-slate-800 flex items-center"><Clock className="w-4 h-4 mr-2 text-amber-600" /> {property.possession || 'Q4 2026'}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-widest">Base Area</p>
                        <p className="font-black text-slate-800 flex items-center"><Maximize className="w-4 h-4 mr-2 text-blue-600" /> {property.area ? `${property.area} Sq.Ft` : 'Multiple'}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Starting Price</p>
                        <span className="font-black text-slate-900 text-xl">{formatCurrency(property.price)}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-[#8B0000] group-hover:border-[#8B0000] transition-colors duration-300">
                        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-300 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <HardHat className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-3">No Active Sites Found</h3>
              <p className="text-slate-500 font-medium text-lg">Check back later for pre-launch and under-construction inventory.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- AREAS WE SERVE (local SEO) --- */}
      <section className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center justify-center gap-2"><MapPin className="w-4 h-4" /> Service Area</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Construction Services Across Delhi NCR</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {areasServed.map((area, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/properties?location=${area.name}`)}
                className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 hover:border-[#D4AF37]/50 hover:shadow-lg transition-all duration-300 cursor-pointer text-center group">
                <div className="w-12 h-12 mx-auto bg-white rounded-full border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-[#8B0000] group-hover:border-[#8B0000] transition-colors duration-300">
                  <Building className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-black text-slate-900 mb-1.5">{area.name}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT FORM (CRM INTEGRATED) --- */}
      <section id="contact-form" className="py-32 px-6 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8B0000]/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-16 items-center relative z-10">

          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2 text-white">
            <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-xs mb-4">Partner With Us</p>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Start Your Next Big Project.</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-12 font-medium">
              Whether you are looking to invest in a pre-launch property, need a reliable contractor for a commercial build, or require architectural consulting, our experts are ready.
            </p>

            <ul className="space-y-8">
              {[
                { title: 'Transparent Pricing', desc: 'No hidden costs, complete bill of quantities provided.' },
                { title: 'On-Time Delivery', desc: 'Penalty-backed timeline commitments.' },
                { title: 'Premium Materials', desc: 'Sourced directly from top-tier manufacturers.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-5">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-3">
            <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden border border-slate-100">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#8B0000]/5 rounded-bl-full pointer-events-none" />

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="h-[500px] flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 border border-emerald-100">
                      <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-4">Request Received!</h3>
                    <p className="text-slate-500 text-lg max-w-sm font-medium">
                      Thank you. Our lead engineer will contact you shortly to discuss your project requirements.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="text-3xl font-black text-slate-900 mb-3">Inquire About Construction</h3>
                    <p className="text-slate-500 text-base mb-10 font-medium">Send us your details and requirements to get a custom quote.</p>

                    <form onSubmit={handleLeadSubmit} className="space-y-6 relative z-10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 mb-2 block">Full Name *</label>
                          <Input
                            required placeholder="e.g. Rahul Sharma"
                            value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                            className="h-14 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-2xl font-medium text-base transition-all outline-none px-5"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 mb-2 block">Phone Number *</label>
                          <Input
                            required type="tel" placeholder="+91 92664 58945"
                            value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                            className="h-14 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-2xl font-medium text-base transition-all outline-none px-5"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                          <Input
                            type="email" placeholder="rahul@example.com"
                            value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                            className="h-14 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-2xl font-medium text-base transition-all outline-none px-5"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 mb-2 block">Service Type</label>
                          <select
                            value={form.projectType} onChange={(e) => setForm({...form, projectType: e.target.value})}
                            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-2xl outline-none appearance-none font-medium text-slate-700 text-base transition-all cursor-pointer"
                          >
                            <option value="">Select Service...</option>
                            <option value="Pre-Launch Investment">Pre-Launch Investment</option>
                            <option value="Turnkey Construction">Turnkey Construction</option>
                            <option value="Architectural Design">Architectural Design</option>
                            <option value="Commercial Build">Commercial Build</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 mb-2 block">Project Details *</label>
                        <Textarea
                          required placeholder="Briefly describe your requirements, land area, or the project you are interested in..." rows={5}
                          value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                          className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-2xl font-medium resize-none p-5 text-base transition-all outline-none"
                        />
                      </div>

                      <Button type="submit" disabled={status === 'submitting'} className="w-full h-16 bg-[#8B0000] hover:bg-[#600000] text-white font-black rounded-2xl text-lg shadow-xl shadow-[#8B0000]/20 transition-all hover:-translate-y-1 mt-6 group">
                        {status === 'submitting' ? (
                          <span className="flex items-center"><Loader2 className="w-6 h-6 mr-3 animate-spin" /> Submitting...</span>
                        ) : (
                          <span className="flex items-center tracking-wide">Submit Inquiry <ArrowRight className="w-6 h-6 ml-3 transform group-hover:translate-x-1.5 transition-transform" /></span>
                        )}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FAQ SECTION (drives FAQPage rich snippets) --- */}
      <section className="py-28 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center justify-center gap-2"><FileCheck2 className="w-4 h-4" /> FAQs</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">Construction Services <span className="text-[#D4AF37]">FAQs</span></h2>
            <p className="text-slate-500 text-sm font-medium">Common questions about our construction company in Noida and Delhi NCR.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full p-5 sm:p-6 text-left flex justify-between items-center text-slate-900 font-bold text-sm sm:text-base hover:text-[#8B0000] transition-colors gap-4">
                  <span>{faq.q}</span>
                  <Plus className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="px-5 sm:px-6 pb-5 text-slate-600 text-sm leading-relaxed font-medium">
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-24 pb-10 px-6 border-t border-slate-800 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
            <div className="lg:col-span-4 pr-4">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#D4AF37] mb-6">
                ANK <span className="text-white">REALTY</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                A trusted construction company in Noida offering premium commercial real estate, corporate leasing,
                and turnkey construction & development solutions across Delhi NCR.
              </p>
              <div className="flex gap-4">
                <a href="#" aria-label="Follow ANK Realty on LinkedIn" className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all duration-300 group"><Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
                <a href="#" aria-label="Follow ANK Realty on Twitter" className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all duration-300 group"><Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
                <a href="#" aria-label="Follow ANK Realty on Facebook" className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all duration-300 group"><Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
                <a href="#" aria-label="Follow ANK Realty on Instagram" className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all duration-300 group"><Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-black text-base mb-8 text-white uppercase tracking-widest text-[11px]">Company</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-sm">
                <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#8B0000]" /> About Us</Link></li>
                <li><Link to="/properties" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#8B0000]" /> Properties</Link></li>
                <li><Link to="/careers" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#8B0000]" /> Careers</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="font-black text-base mb-8 text-white uppercase tracking-widest text-[11px]">Our Services</h4>
              <ul className="space-y-5 text-slate-400 font-medium text-sm">
                <li><Link to="/corporate-leasing" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#8B0000]" /> Corporate Leasing</Link></li>
                <li><Link to="/construction" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#8B0000]" /> Construction & Dev</Link></li>
                <li><Link to="/residential" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#8B0000]" /> Residential Leasing</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="font-black text-base mb-8 text-white uppercase tracking-widest text-[11px]">Contact Us</h4>
              <div className="space-y-5 text-slate-400 font-medium text-sm">
                <div className="flex items-start bg-slate-900/50 p-4 rounded-2xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <MapPin className="w-5 h-5 mr-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed"> 207, JS Arcade, Sec-18, Noida, Uttar Pradesh - 201301</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Phone className="w-5 h-5 mr-4 text-[#D4AF37] shrink-0" />
                  <a href="tel:+919266458945" className="text-sm hover:text-[#D4AF37] transition-colors">+91 92664 58945</a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex gap-8">
              <Link to="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
