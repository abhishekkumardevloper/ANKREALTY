import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  Building2, Briefcase, Landmark, Monitor, FileText, 
  DownloadCloud, Mail, Phone, MapPin, ChevronRight, 
  ShieldCheck, Globe, Handshake, ArrowRight, Building,
  CheckCircle, Facebook, Twitter, Instagram, Linkedin, Loader2,
  Maximize, ArrowUpRight
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

// --- CLIENT LOGOS ---
const clients = [
  { name: "Tech Mahindra", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Tech_Mahindra_New_Logo.svg/512px-Tech_Mahindra_New_Logo.svg.png" },
  { name: "HDFC Bank", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/512px-HDFC_Bank_Logo.svg.png" },
  { name: "TCS", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/512px-Tata_Consultancy_Services_Logo.svg.png" },
  { name: "Infosys", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/512px-Infosys_logo.svg.png" },
  { name: "Wipro", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/512px-Wipro_Primary_Logo_Color_RGB.svg.png" },
  { name: "Accenture", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/512px-Accenture.svg.png" },
  { name: "KPMG", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/KPMG_logo.svg/512px-KPMG_logo.svg.png" },
  { name: "Deloitte", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deloitte.svg/512px-Deloitte.svg.png" }
];

const industries = [
  { name: "IT & Technology", icon: Monitor, desc: "Tech parks and smart offices for software giants and fast-growing startups." },
  { name: "Banking & Finance", icon: Landmark, desc: "Secure, premium spaces in prime business districts with high compliance." },
  { name: "Consulting Firms", icon: Briefcase, desc: "Grade-A corporate towers built for global advisory networks and partners." },
  { name: "Retail & E-commerce", icon: Building2, desc: "High-visibility retail hubs and strategic warehousing logistics spaces." },
  { name: "MNCs & Foreign Ops", icon: Globe, desc: "Compliance-ready spaces perfectly tailored for multinational expansions." },
  { name: "Advertising & Media", icon: FileText, desc: "Creative, open-plan environments designed for dynamic publishing houses." }
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function CorporateLeasingPage() {
  const navigate = useNavigate();
  const contactFormRef = useRef(null);
  
  const [leadForm, setLeadForm] = useState({ name: '', company: '', phone: '', email: '', requirements: '' });
  const [status, setStatus] = useState('idle'); 
  
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  // Fetch Corporate Properties
  useEffect(() => {
    const fetchCorporateProperties = async () => {
      try {
        const res = await axios.get(`${API_BASE}/properties`);
        // Safely filter for corporate leases, client projects, or general commercial spaces
        const corporateSpaces = res.data.filter(p => 
          p.category === 'corporate-lease' || 
          p.category === 'client-project' || 
          p.property_type === 'commercial' || 
          p.property_type === 'office'
        );
        setProperties(corporateSpaces);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoadingProps(false);
      }
    };
    fetchCorporateProperties();
  }, []);

  const handleInquireClick = (propertyTitle) => {
    setLeadForm(prev => ({ 
      ...prev, 
      requirements: `I am interested in leasing: ${propertyTitle}. Please provide more details regarding availability and pricing.` 
    }));
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) return toast.error("Name and Phone are required.");

    setStatus('submitting');
    
    try {
      await axios.post(`${API_BASE}/contacts`, {
        name: leadForm.name,
        company: leadForm.company,
        phone: leadForm.phone,
        email: leadForm.email || 'N/A',
        requirements: leadForm.requirements,
        interest: 'Corporate Leasing'
      });
      
      setStatus('success');
      setLeadForm({ name: '', company: '', phone: '', email: '', requirements: '' });

      setTimeout(() => setStatus('idle'), 4000);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to send inquiry. Please try again or call us directly.");
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
      <section className="bg-[#050505] text-white pt-32 pb-40 px-6 text-center relative overflow-hidden flex items-center min-h-[85vh]">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }} 
          animate={{ scale: 1, opacity: 0.3 }} 
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 mix-blend-overlay" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/80 to-[#050505] z-0" />
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-5xl mx-auto mt-8 w-full">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-black tracking-[0.25em] uppercase mb-8 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
            <Handshake className="w-4 h-4" /> Premium Commercial Real Estate
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-black mb-8 tracking-tight drop-shadow-lg leading-[1.1]">
            Corporate Leasing <br/>& <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA8000]">Workspaces</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-2xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto mb-12">
            We represent top Indian enterprises, MNCs, and Fortune 500 companies, providing bespoke commercial leasing, retail spaces, and real estate consulting solutions.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button onClick={() => contactFormRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-[#8B0000] to-[#600000] hover:from-[#600000] hover:to-[#400000] text-white font-black h-16 px-10 rounded-full shadow-xl shadow-[#8B0000]/30 text-lg transition-transform hover:-translate-y-1">
              Consult Our Experts <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="relative z-20 -mt-20 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-slate-100 p-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200">
          {[
            { label: 'Corporate Clients', value: '500+' },
            { label: 'Million Sq.Ft Leased', value: '5.2' },
            { label: 'MNCs Represented', value: '120+' },
            { label: 'Years of Trust', value: '15+' },
          ].map((stat, i) => (
            <div key={i} className="text-center px-4 group">
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 group-hover:text-[#8B0000] transition-colors duration-300">{stat.value}</h3>
              <p className="text-xs md:text-sm font-black text-[#D4AF37] mt-3 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* --- FEATURED CORPORATE PROPERTIES --- */}
      <section className="py-32 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-2"><Building2 className="w-4 h-4" /> Available Inventory</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Featured Corporate Spaces</h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="h-14 px-8 rounded-full font-bold border-slate-300 text-slate-700 hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] transition-colors">
                View All Commercial <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
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
                     <div className="h-12 bg-slate-200 rounded-xl w-full mt-6" />
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
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:-translate-y-2 hover:border-[#D4AF37]/50 transition-all duration-500 group flex flex-col"
                >
                  
                  {/* Image Section */}
                  <div className="relative h-72 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                    <div className="absolute top-5 left-5 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black text-[#D4AF37] shadow-xl z-10 tracking-widest uppercase border border-white/10">
                      {property.property_type || 'Commercial Space'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    <img 
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'} 
                      alt={property.title} 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute bottom-6 left-6 z-20 pr-6">
                      <h3 className="text-2xl font-black text-white mb-2 line-clamp-1 drop-shadow-lg">{property.title}</h3>
                      <p className="text-slate-300 text-sm flex items-center font-medium drop-shadow-md">
                        <MapPin className="w-4 h-4 mr-1.5 text-[#D4AF37]"/> {property.location}, {property.city}
                      </p>
                    </div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-widest">Leasable Area</p>
                        <p className="font-black text-slate-800 flex items-center text-sm md:text-base"><Maximize className="w-4 h-4 mr-2 text-[#8B0000]" /> {property.area ? `${property.area} Sq.Ft` : 'On Request'}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-widest">Handover Status</p>
                        <p className="font-black text-slate-800 flex items-center text-sm md:text-base"><Building className="w-4 h-4 mr-2 text-[#8B0000]" /> {property.furnishing || 'Bare Shell'}</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Lease Price</p>
                        <span className="font-black text-slate-900 text-xl">{formatCurrency(property.price)}</span>
                      </div>
                      <Button onClick={() => handleInquireClick(property.title)} className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-12 rounded-xl shadow-md transition-all hover:-translate-y-1">
                        Inquire Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-300 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-3">No Corporate Spaces Listed</h3>
              <p className="text-slate-500 font-medium text-lg">Contact our advisory team directly for off-market premium inventory.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- CLIENT LOGO GRID --- */}
      <section className="py-32 px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center max-w-3xl mx-auto mb-20">
            <motion.p variants={fadeUp} className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4">Who We Work With</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Trusted by Global Leaders</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 mt-6 text-lg font-medium">We have successfully delivered commercial real estate solutions for the world's most demanding corporate teams.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {clients.map((client, index) => (
              <motion.div key={index} variants={fadeUp} className="bg-white h-36 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center p-8 hover:border-[#D4AF37]/50 hover:shadow-xl transition-all duration-300 group grayscale hover:grayscale-0 hover:-translate-y-2">
                <img 
                  src={client.src} 
                  alt={`${client.name} Logo`} 
                  className="max-w-full max-h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- INDUSTRIES WE SERVE --- */}
      <section className="py-32 px-6 bg-[#050505] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8B0000]/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/2 -translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-2xl">
              <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-xs mb-4">Client Segments</p>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Industries We Specialize In</h2>
            </motion.div>
            <motion.p initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-slate-400 max-w-md text-lg leading-relaxed md:text-right font-medium">
              Every industry has unique workspace requirements. Our deep market knowledge ensures we find the perfect fit for your sector.
            </motion.p>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 hover:border-[#D4AF37]/50 hover:-translate-y-2 shadow-2xl shadow-black/50 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#8B0000] group-hover:shadow-[0_0_30px_rgba(139,0,0,0.4)] transition-all duration-500 border border-[#D4AF37]/30">
                  <ind.icon className="w-8 h-8 text-[#D4AF37] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{ind.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{ind.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- BUSINESS PROFILE & INQUIRY FORM --- */}
      <section ref={contactFormRef} className="py-32 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Info */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> Corporate Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Comprehensive Real Estate Solutions</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium">
              ANK Realty is an integrated services company specializing in commercial real estate consulting. We offer end-to-end solutions including Corporate Leasing, Transitory Leasing, Retail Spaces, and Investment Advisory.
            </p>
            
            <ul className="space-y-6 mb-12">
              {['Grade-A Office Spaces', 'Turnkey Interior Solutions', 'Legal & Compliance Assistance', 'Pan-India Portfolio Management'].map((item, idx) => (
                <li key={idx} className="flex items-center text-slate-900 font-bold bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-lg">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mr-4 shrink-0">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37]" /> 
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-[#D4AF37]/50 hover:shadow-xl transition-all duration-300">
               <div>
                 <h4 className="font-black text-slate-900 text-xl mb-1">Our Business Profile</h4>
                 <p className="text-sm text-slate-500 font-medium">Download our comprehensive company presentation.</p>
               </div>
               <Button className="shrink-0 bg-[#8B0000] hover:bg-[#600000] text-white font-black h-14 px-8 rounded-xl shadow-xl shadow-[#8B0000]/30 transition-all hover:-translate-y-1">
                  <DownloadCloud className="w-5 h-5 mr-3" /> Download PDF
               </Button>
            </div>
          </motion.div>

          {/* Right Column: Enquiry Form */}
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="h-[550px] flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 border border-emerald-100">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-4">Request Received!</h3>
                  <p className="text-slate-500 text-lg max-w-sm font-medium">
                    Thank you. Our corporate leasing director will contact you shortly to discuss your workspace needs.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h3 className="text-3xl font-black text-slate-900 mb-3">Corporate Enquiry</h3>
                  <p className="text-slate-500 text-base mb-10 font-medium">Fill out the form below and our corporate leasing team will get back to you promptly.</p>

                  <form onSubmit={handleLeadSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 mb-2 block">Full Name *</label>
                        <Input 
                          required placeholder="e.g. John Doe"
                          value={leadForm.name} onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                          className="h-14 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-2xl font-medium text-base transition-all outline-none px-5"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 mb-2 block">Company Name</label>
                        <Input 
                          placeholder="e.g. Tech Corp"
                          value={leadForm.company} onChange={(e) => setLeadForm({...leadForm, company: e.target.value})}
                          className="h-14 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-2xl font-medium text-base transition-all outline-none px-5"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 mb-2 block">Phone Number *</label>
                        <Input 
                          required type="tel" placeholder="+91 92664 58945"
                          value={leadForm.phone} onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                          className="h-14 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-2xl font-medium text-base transition-all outline-none px-5"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 mb-2 block">Email Address *</label>
                        <Input 
                          required type="email" placeholder="john@company.com"
                          value={leadForm.email} onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                          className="h-14 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-2xl font-medium text-base transition-all outline-none px-5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 mb-2 block">Space Requirements *</label>
                      <Textarea 
                        required placeholder="Briefly describe your workspace requirements, preferred locations, and expected headcount..." rows={4}
                        value={leadForm.requirements} onChange={(e) => setLeadForm({...leadForm, requirements: e.target.value})}
                        className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-2xl font-medium resize-none p-5 text-base transition-all outline-none"
                      />
                    </div>

                    <Button type="submit" disabled={status === 'submitting'} className="w-full h-16 bg-[#8B0000] hover:bg-[#600000] text-white font-black rounded-2xl text-lg shadow-xl shadow-[#8B0000]/30 transition-all hover:-translate-y-1 mt-6 group">
                      {status === 'submitting' ? (
                        <span className="flex items-center"><Loader2 className="w-6 h-6 mr-3 animate-spin" /> Submitting Request...</span>
                      ) : (
                        <span className="flex items-center tracking-wide">Request Leasing Consultation <ArrowRight className="w-6 h-6 ml-3 transform group-hover:translate-x-1.5 transition-transform" /></span>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* --- CONTACT STRIP --- */}
      <section className="bg-gradient-to-r from-[#8B0000] to-[#500000] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-white text-center md:text-left">
           <div>
              <h3 className="text-3xl font-black mb-2">Looking for immediate assistance?</h3>
              <p className="text-white/80 text-base font-medium">Our corporate advisory team is available to assist you 24/7.</p>
           </div>
           <div className="flex flex-col sm:flex-row gap-5 w-full md:w-auto">
              <a href="tel:+919266458945" className="flex-1 md:flex-none flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-bold transition-all hover:-translate-y-1">
                 <Phone className="w-5 h-5 mr-3 text-[#D4AF37]" /> +91 92664 58945
              </a>
              <a href="mailto:info@ankrealty.com" className="flex-1 md:flex-none flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-bold transition-all hover:-translate-y-1">
                 <Mail className="w-5 h-5 mr-3 text-[#D4AF37]" /> info@ankrealty.com
              </a>
           </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-24 pb-10 px-6 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
            <div className="lg:col-span-4 pr-4">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#D4AF37] mb-6">
                ANK <span className="text-white">REALTY</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                Your trusted partner for premium commercial real estate, corporate leasing, and workspace solutions across Noida, Greater Noida, and Delhi NCR.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all duration-300 group"><Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all duration-300 group"><Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all duration-300 group"><Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all duration-300 group"><Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" /></a>
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
                <li><Link to="/retail" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#8B0000]" /> Retail Spaces</Link></li>
                <li><Link to="/residential" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#8B0000]" /> Residential Leasing</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="font-black text-base mb-8 text-white uppercase tracking-widest text-[11px]">Contact Us</h4>
              <div className="space-y-5 text-slate-400 font-medium text-sm">
                <div className="flex items-start bg-slate-900/50 p-4 rounded-2xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <MapPin className="w-5 h-5 mr-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">Sector 62, Noida,<br />Uttar Pradesh 201309</p>
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
