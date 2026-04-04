// src/pages/CorporateLeasingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Maximize
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

export default function CorporateLeasingPage() {
  const navigate = useNavigate();
  const contactFormRef = useRef(null);
  
  const [leadForm, setLeadForm] = useState({ name: '', company: '', phone: '', email: '', requirements: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  // Fetch Corporate Properties
  useEffect(() => {
    const fetchCorporateProperties = async () => {
      try {
        const res = await axios.get(`${API_BASE}/properties`);
        // Filter properties that are specifically categorized as Client Project or Commercial
        const corporateSpaces = res.data.filter(p => 
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

  // Handle clicking "Inquire Now" on a specific property
  const handleInquireClick = (propertyTitle) => {
    setLeadForm(prev => ({ 
      ...prev, 
      requirements: `I am interested in leasing: ${propertyTitle}. Please provide more details.` 
    }));
    // Smooth scroll to the contact form
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Connected to Real Backend CRM
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${API_BASE}/contacts`, {
        name: leadForm.name,
        company: leadForm.company,
        phone: leadForm.phone,
        email: leadForm.email,
        requirements: leadForm.requirements,
        interest: 'Corporate Leasing' // Tag for CRM
      });
      
      toast.success("Corporate inquiry sent successfully! Our leasing expert will contact you shortly.");
      setLeadForm({ name: '', company: '', phone: '', email: '', requirements: '' });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to send inquiry. Please try again or call us directly.");
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
      <section className="bg-[#050505] text-white pt-32 pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505] z-0" />
        
        <div className="relative z-10 max-w-5xl mx-auto mt-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <Handshake className="w-4 h-4" /> Premium Commercial Real Estate
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight drop-shadow-lg leading-tight">
            Corporate Leasing & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">Workspaces</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto mb-10">
            We represent top Indian enterprises, MNCs, and Fortune 500 companies, providing bespoke commercial leasing, retail spaces, and real estate consulting solutions.
          </p>
          <Button onClick={() => contactFormRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-14 px-8 rounded-full shadow-lg shadow-[#8B0000]/30 text-lg transition-transform hover:-translate-y-1">
            Consult Our Experts <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {[
            { label: 'Corporate Clients', value: '500+' },
            { label: 'Million Sq.Ft Leased', value: '5.2' },
            { label: 'MNCs Represented', value: '120+' },
            { label: 'Years of Trust', value: '15+' },
          ].map((stat, i) => (
            <div key={i} className="text-center px-4 group">
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 group-hover:text-[#8B0000] transition-colors duration-300">{stat.value}</h3>
              <p className="text-xs md:text-sm font-bold text-[#D4AF37] mt-2 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURED CORPORATE PROPERTIES (NEW SECTION) --- */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2"><Building2 className="w-4 h-4" /> Available Inventory</p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Featured Corporate Spaces</h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                View All Commercial <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loadingProps ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
              <p className="text-slate-500 font-bold">Loading premium spaces...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 6).map((property) => (
                <div key={property.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-[#D4AF37]/50 transition-all duration-300 group flex flex-col">
                  
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                    <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-white shadow-lg z-10 tracking-widest uppercase">
                      {property.property_type || 'Commercial'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                    <img 
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'} 
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
                  
                  {/* Details Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Area</p>
                        <p className="font-black text-slate-800 flex items-center"><Maximize className="w-3.5 h-3.5 mr-1.5 text-[#8B0000]" /> {property.area ? `${property.area} Sq.Ft` : 'On Request'}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Status</p>
                        <p className="font-black text-slate-800 flex items-center"><Building className="w-3.5 h-3.5 mr-1.5 text-[#8B0000]" /> {property.furnishing || 'Bare Shell'}</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Lease Price</p>
                        <span className="font-black text-[#003B30] text-lg">{formatCurrency(property.price)}</span>
                      </div>
                      <Button onClick={() => handleInquireClick(property.title)} className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl shadow-md">
                        Inquire Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No Corporate Spaces Listed</h3>
              <p className="text-slate-500">Contact our advisory team directly for off-market premium inventory.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- CLIENT LOGO GRID --- */}
      <section className="py-24 px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3">Who We Work With</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Trusted by Global Leaders</h2>
            <p className="text-slate-500 mt-4 text-lg">We have successfully delivered commercial real estate solutions for the world's most demanding corporate teams.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {clients.map((client, index) => (
              <div key={index} className="bg-white h-32 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center p-6 hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300 group grayscale hover:grayscale-0 hover:-translate-y-1">
                <img 
                  src={client.src} 
                  alt={`${client.name} Logo`} 
                  className="max-w-full max-h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INDUSTRIES WE SERVE --- */}
      <section className="py-24 px-6 bg-[#050505] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B0000]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <p className="text-[#D4AF37] font-bold uppercase tracking-[0.25em] text-xs mb-3">Client Segments</p>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Industries We Specialize In</h2>
            </div>
            <p className="text-slate-400 max-w-md text-base leading-relaxed md:text-right">
              Every industry has unique workspace requirements. Our deep market knowledge ensures we find the perfect fit for your sector.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-[#D4AF37]/50 hover:-translate-y-2 shadow-xl shadow-black/20 transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8B0000] group-hover:shadow-[0_0_20px_rgba(139,0,0,0.4)] transition-all duration-300 border border-[#D4AF37]/30">
                  <ind.icon className="w-7 h-7 text-[#D4AF37] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">{ind.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BUSINESS PROFILE & INQUIRY FORM --- */}
      <section ref={contactFormRef} className="py-24 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Info */}
          <div>
            <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Corporate Portfolio</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Comprehensive Real Estate Solutions</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              ANK Realty is an integrated services company specializing in commercial real estate consulting. We offer end-to-end solutions including Corporate Leasing, Transitory Leasing, Retail Spaces, and Investment Advisory.
            </p>
            
            <ul className="space-y-5 mb-12">
              {['Grade-A Office Spaces', 'Turnkey Interior Solutions', 'Legal & Compliance Assistance', 'Pan-India Portfolio Management'].map((item, idx) => (
                <li key={idx} className="flex items-center text-slate-800 font-bold bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  <CheckCircle className="w-5 h-5 text-[#D4AF37] mr-3" /> {item}
                </li>
              ))}
            </ul>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-[#D4AF37]/50 hover:shadow-md transition-all">
               <div>
                 <h4 className="font-black text-slate-900 text-lg mb-1">Our Business Profile</h4>
                 <p className="text-sm text-slate-500 font-medium">Download our comprehensive company presentation.</p>
               </div>
               <Button className="shrink-0 bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#8B0000]/30 transition-all hover:-translate-y-0.5">
                  <DownloadCloud className="w-5 h-5 mr-2" /> Download PDF
               </Button>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Corporate Enquiry</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Fill out the form below and our corporate leasing team will get back to you promptly.</p>

            <form onSubmit={handleLeadSubmit} className="space-y-5 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Full Name *</label>
                  <Input 
                    required placeholder="e.g. John Doe"
                    value={leadForm.name} onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Company Name</label>
                  <Input 
                    placeholder="e.g. Tech Corp"
                    value={leadForm.company} onChange={(e) => setLeadForm({...leadForm, company: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-medium transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Phone Number *</label>
                  <Input 
                    required type="tel" placeholder="+91 92664 58945"
                    value={leadForm.phone} onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Email Address *</label>
                  <Input 
                    required type="email" placeholder="john@company.com"
                    value={leadForm.email} onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Requirements / Space Details *</label>
                <Textarea 
                  required placeholder="Briefly describe your workspace requirements..." rows={4}
                  value={leadForm.requirements} onChange={(e) => setLeadForm({...leadForm, requirements: e.target.value})}
                  className="bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-medium resize-none p-4 transition-all"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 font-black rounded-xl text-base shadow-lg shadow-[#D4AF37]/30 transition-all hover:-translate-y-0.5 mt-4">
                {isSubmitting ? (
                  <span className="flex items-center"><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting Request...</span>
                ) : (
                  <span className="flex items-center">Request Leasing Consultation <ArrowRight className="w-5 h-5 ml-2" /></span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* --- CONTACT STRIP --- */}
      <section className="bg-[#8B0000] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-white text-center md:text-left">
           <div>
              <h3 className="text-2xl font-black mb-1">Looking for immediate assistance?</h3>
              <p className="text-white/80 text-sm font-medium">Our corporate advisory team is available 24/7.</p>
           </div>
           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <a href="tel:+919732300007" className="flex-1 md:flex-none flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 rounded-xl font-bold transition-colors">
                 <Phone className="w-5 h-5 mr-3 text-[#D4AF37]" /> +91 92664 58945
              </a>
              <a href="mailto:contact@ankrealty.com" className="flex-1 md:flex-none flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 rounded-xl font-bold transition-colors">
                 <Mail className="w-5 h-5 mr-3 text-[#D4AF37]" /> contact@ankrealty.com
              </a>
           </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-20 pb-10 px-6 border-t-[6px] border-[#8B0000] font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-4 pr-4">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#D4AF37] mb-6">
                ANK <span className="text-white">REALTY</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                Your trusted partner for premium commercial real estate, corporate leasing, and workspace solutions across Noida, Greater Noida, and Delhi NCR.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all group"><Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all group"><Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all group"><Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all group"><Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" /></a>
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
                <li><Link to="/retail" className="hover:text-[#D4AF37] transition-colors flex items-center"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]" /> Retail Spaces</Link></li>
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
                  <a href="tel: 92664 58945" className="text-xs hover:text-[#D4AF37] transition-colors">+91 97323 00007</a>
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
