// src/pages/ConstructionPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  HardHat, Hammer, Ruler, ShieldCheck, Clock, CheckCircle, 
  ArrowRight, MapPin, Building, Phone, Mail, Loader2, Maximize,
  ChevronRight, Instagram, Linkedin, Twitter, Facebook
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

const services = [
  { title: "Turnkey Construction", desc: "End-to-end building solutions from foundation to final handover with strict quality control.", icon: Hammer },
  { title: "Architectural Design", desc: "Modern, sustainable, and space-efficient blueprints crafted by top-tier architects.", icon: Ruler },
  { title: "Project Management", desc: "Dedicated supervisors ensuring your project is delivered exactly on time and within budget.", icon: Clock },
  { title: "Legal & Compliance", desc: "Hassle-free approvals, RERA compliance, and environmental clearances handled by experts.", icon: ShieldCheck }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function ConstructionPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  
  const [form, setForm] = useState({ name: '', phone: '', email: '', projectType: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch 'Under Construction' Properties from your backend
  useEffect(() => {
    const fetchConstructionProps = async () => {
      try {
        const res = await axios.get(`${API_BASE}/properties`);
        const underConstruction = res.data.filter(p => 
          p.project_status === 'Under Construction' || 
          p.project_status === 'New Launch'
        );
        setProperties(underConstruction);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoadingProps(false);
      }
    };
    fetchConstructionProps();
  }, []);

  // Handle CRM Lead Submission
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error("Name and Phone are required.");
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE}/contacts`, {
        name: form.name,
        phone: form.phone,
        email: form.email || 'N/A',
        interest: `Construction Services: ${form.projectType || 'General'}`,
        message: form.message
      });
      toast.success("Inquiry submitted! Our construction team will contact you shortly.");
      setForm({ name: '', phone: '', email: '', projectType: '', message: '' });
    } catch (error) {
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
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
      <section className="bg-[#050505] text-white pt-32 pb-24 px-6 relative overflow-hidden flex items-center min-h-[85vh]">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/80 to-[#050505] z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <HardHat className="w-4 h-4" /> Development & Construction
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              Building the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">Real Estate.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-xl">
              From premium residential towers to state-of-the-art commercial hubs, ANK Realty delivers excellence in construction with zero compromises on quality and timelines.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-4">
              <Button onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })} className="bg-[#8B0000] hover:bg-[#600000] text-white font-black h-14 px-8 rounded-full shadow-lg shadow-[#8B0000]/30 text-base transition-transform hover:-translate-y-1">
                Consult Our Engineers
              </Button>
              <Button onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })} variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold h-14 px-8 rounded-full text-base transition-transform hover:-translate-y-1">
                View Ongoing Projects
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:grid grid-cols-2 gap-4">
             {[
               { value: '2.5M+', label: 'Sq.Ft Developed' },
               { value: '45+', label: 'Projects Delivered' },
               { value: '100%', label: 'RERA Compliant' },
               { value: '15+', label: 'Years Experience' }
             ].map((stat, i) => (
               <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-colors">
                 <h3 className="text-4xl font-black text-[#D4AF37] mb-2">{stat.value}</h3>
                 <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">{stat.label}</p>
               </div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-24 px-6 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3">Our Expertise</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">Comprehensive Development Services</h2>
            <p className="text-slate-500 text-lg">We handle every phase of the construction lifecycle, ensuring your vision becomes a reality flawlessly.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((srv, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-[#D4AF37]/50 hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center hover:-translate-y-2">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 group-hover:bg-[#8B0000] transition-colors duration-300">
                  <srv.icon className="w-8 h-8 text-[#D4AF37] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{srv.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ONGOING PROJECTS (FROM BACKEND) --- */}
      <section id="projects" className="py-24 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2"><Building className="w-4 h-4" /> Active Sites</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Under Construction Projects</h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="border-slate-300 font-bold hover:bg-[#8B0000] hover:text-white transition-colors h-12 px-6 rounded-xl text-base">View All Projects <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>

          {loadingProps ? (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
               <p className="text-slate-500 font-bold">Loading active projects...</p>
             </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 6).map((property) => (
                <div key={property.id} onClick={() => navigate(`/property/${property.id}`)} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer relative group flex flex-col">
                  
                  <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-white shadow-lg z-10 flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5"/> {property.project_status || 'Under Construction'}
                  </div>
                  
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                     <img 
                       src={property.images?.[0] || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'} 
                       alt={property.title} 
                       className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                     />
                     <div className="absolute bottom-4 left-4 z-20">
                        <h3 className="text-xl font-black text-white mb-1 line-clamp-1 drop-shadow-md">{property.title}</h3>
                        <p className="text-slate-300 text-sm flex items-center font-medium drop-shadow-md">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]"/> {property.location}, {property.city}
                        </p>
                     </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Expected Delivery</p>
                        <p className="font-black text-slate-800 flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> {property.possession || 'Q4 2026'}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Area Range</p>
                        <p className="font-black text-slate-800 flex items-center"><Maximize className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> {property.area ? `${property.area} Sq.Ft` : 'Multiple'}</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Starting Price</p>
                        <span className="font-black text-[#003B30] text-lg">{formatCurrency(property.price)}</span>
                      </div>
                      <Button className="bg-slate-900 hover:bg-[#8B0000] text-white font-bold rounded-xl shadow-md transition-colors">
                        Project Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <HardHat className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-slate-800 mb-2">No Active Sites Found</h3>
              <p className="text-slate-500">Check back later for pre-launch and under-construction inventory.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- CONTACT FORM (CRM INTEGRATED) --- */}
      <section id="contact-form" className="py-24 px-6 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B0000]/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-16 items-center relative z-10">
          
          <div className="lg:col-span-2 text-white">
            <p className="text-[#D4AF37] font-bold uppercase tracking-[0.25em] text-xs mb-3">Partner With Us</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Start Your Next Big Project.</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Whether you are looking to invest in a pre-launch property, need a reliable contractor for a commercial build, or require architectural consulting, our experts are ready.
            </p>
            
            <ul className="space-y-6">
              {[
                { title: 'Transparent Pricing', desc: 'No hidden costs, complete bill of quantities provided.' },
                { title: 'On-Time Delivery', desc: 'Penalty-backed timeline commitments.' },
                { title: 'Premium Materials', desc: 'Sourced directly from top-tier manufacturers.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-[#D4AF37] mr-4 shrink-0 mt-1" /> 
                  <div>
                    <h4 className="font-bold text-lg text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B0000]/5 rounded-bl-full pointer-events-none" />
              
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Inquire About Construction</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">Send us your details and requirements to get a custom quote.</p>

              <form onSubmit={handleLeadSubmit} className="space-y-5 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Full Name *</label>
                    <Input 
                      required placeholder="e.g. Rahul Sharma"
                      value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                      className="h-14 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-medium text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Phone Number *</label>
                    <Input 
                      required type="tel" placeholder="+91 92664 58945"
                      value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                      className="h-14 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-medium text-base"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                    <Input 
                      type="email" placeholder="rahul@example.com"
                      value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                      className="h-14 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-medium text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Service Type</label>
                    <select 
                      value={form.projectType} onChange={(e) => setForm({...form, projectType: e.target.value})}
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 appearance-none font-medium text-slate-700 text-base"
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Project Details / Message *</label>
                  <Textarea 
                    required placeholder="Briefly describe your requirements, land area, or the project you are interested in..." rows={4}
                    value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                    className="bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-medium resize-none p-4 text-base"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-[#8B0000] hover:bg-[#600000] text-white font-black rounded-xl text-base shadow-lg shadow-[#8B0000]/30 transition-all hover:-translate-y-0.5 mt-4">
                  {isSubmitting ? (
                    <span className="flex items-center"><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</span>
                  ) : (
                    <span className="flex items-center">Submit Inquiry <ArrowRight className="w-5 h-5 ml-2" /></span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-20 pb-10 px-6 border-t border-slate-800 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-4 pr-4">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#D4AF37] mb-6">
                ANK <span className="text-white">REALTY</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                Your trusted partner for premium commercial real estate, corporate leasing, and development solutions across Delhi NCR.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all group"><Linkedin className="w-4 h-4 group-hover:scale-110" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all group"><Twitter className="w-4 h-4 group-hover:scale-110" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all group"><Facebook className="w-4 h-4 group-hover:scale-110" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all group"><Instagram className="w-4 h-4 group-hover:scale-110" /></a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Company</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> About Us</Link></li>
                <li><Link to="/properties" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Properties</Link></li>
                <li><Link to="/careers" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Careers</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Our Services</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/corporate-leasing" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Corporate Leasing</Link></li>
                <li><Link to="/construction" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Construction & Dev</Link></li>
                <li><Link to="/residential" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Residential Leasing</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium text-sm">
                <div className="flex items-start bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <MapPin className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" />
                  <p className="text-xs">Sector 62, Noida,<br />Uttar Pradesh 201309</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Phone className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" />
                  <a href="tel:+919732300007" className="text-xs hover:text-[#D4AF37] transition-colors">+91 92664 58945</a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
