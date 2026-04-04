import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Mail, Phone, MapPin, Clock, Send, MessageSquare, 
  Loader2, CheckCircle, Plus, Building, User, Target,
  ArrowRight, ChevronRight, Facebook, Twitter, Instagram, Linkedin
} from "lucide-react";

// API Configuration
const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

const LOCATIONS = [
  {
    id: "mumbai",
    name: "Mumbai (HQ)",
    address: "123 Business Avenue, Tech Park, Andheri East, Mumbai 400001",
    phone: "+91 92664 58945",
    email: "mumbai@ankrealty.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120638.06452274488!2d72.77443180415306!3d19.11364501235122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1709999999999!5m2!1sen!2sin"
  },
  {
    id: "delhi",
    name: "Delhi NCR",
    address: "Level 4, DLF Cyber City, Gurugram, Haryana 122002",
    phone: "+91 92664 58945",
    email: "delhi@ankrealty.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.5400499692!2d77.04417336214959!3d28.527218141381393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1709999999999!5m2!1sen!2sin"
  },
  {
    id: "bangalore",
    name: "Bangalore",
    address: "Prestige Trade Tower, Palace Road, Bangalore 560001",
    phone: "+91 92664 58945",
    email: "bangalore@ankrealty.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124411.45041793774!2d77.50284451000963!3d12.954280237731776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1709999999999!5m2!1sen!2sin"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "", interest: "buy" });
  const [status, setStatus] = useState("idle"); 
  const [error, setError] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      await axios.post(`${API_BASE}/contacts`, formData); 
      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "", interest: "buy" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error(err);
      // Fallback for UI demo
      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const FAQS = [
    { question: "Do you charge fees for property viewings?", answer: "No, all our initial property viewings and consultations with our agents are completely free of charge. We believe you should love the home before you pay a rupee." },
    { question: "How quickly can I sell my house with ANK Realty?", answer: "On average, properties listed with us sell 2.5x faster than the market average. It typically takes 18-30 days depending on the locality and price point." },
    { question: "Do you handle the legal paperwork?", answer: "Yes! We have an in-house legal team that manages all compliance, registration, and paperwork to ensure a seamless transaction." },
    { question: "Can I get a home loan through ANK Realty?", answer: "Absolutely. We are partnered with India's top banks (HDFC, SBI, ICICI) to provide our clients with expedited approvals and competitive interest rates." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#D4AF37]/30">
      <Navbar />

      {/* 1. PREMIUM HERO SECTION */}
      <section className="bg-[#050505] text-white pt-32 pb-40 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/90 to-[#050505] z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto mt-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <MessageSquare className="w-4 h-4" /> 24/7 Concierge Support
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg leading-tight">
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">Conversation.</span>
          </h1>
          <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Whether you are looking to buy your dream home, sell an asset, or just need market advice, our elite team is standing by.
          </p>
        </div>
      </section>

      {/* 2. MAIN INTERACTIVE CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-10 -mt-24 relative z-20 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 overflow-hidden border border-slate-200">
          
          {/* LEFT: Dynamic Contact Form (Spans 7 cols) */}
          <div className="lg:col-span-7 p-8 md:p-14 bg-white">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Send us a direct message</h2>
            <p className="text-slate-500 mb-10 font-medium">Select your interest and we'll route you to the right department.</p>
            
            {status === "success" ? (
              <div className="bg-slate-50 border border-[#D4AF37]/30 rounded-3xl p-10 text-center h-[450px] flex flex-col justify-center items-center animate-in fade-in zoom-in">
                <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-[#D4AF37]/20">
                  <CheckCircle className="w-12 h-12 text-[#D4AF37]" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3">Message Received!</h3>
                <p className="text-slate-600 text-lg">Thank you for reaching out. A dedicated property expert will contact you within the next 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
                
                {/* Interest Selector */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {['buy', 'sell', 'rent', 'other'].map((type) => (
                    <label key={type} className={`cursor-pointer px-5 py-2.5 rounded-xl border font-bold text-sm uppercase tracking-wider transition-all ${formData.interest === type ? 'bg-[#8B0000] border-[#8B0000] text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
                      <input type="radio" name="interest" value={type} checked={formData.interest === type} onChange={handleChange} className="hidden" />
                      I want to {type}
                    </label>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="e.g. Rahul" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="e.g. Verma" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all font-medium" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="rahul@example.com" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all font-medium" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">How can we help?</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" placeholder="Tell us a bit about your property requirements..." className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all resize-none font-medium" />
                </div>

                {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center"><span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span> {error}</p>}

                <Button type="submit" disabled={status === "submitting"} className="w-full bg-[#8B0000] hover:bg-[#600000] text-white h-16 rounded-xl text-lg font-bold shadow-xl shadow-[#8B0000]/20 transition-all flex items-center justify-center mt-4 group">
                  {status === "submitting" ? (
                    <><Loader2 className="animate-spin mr-2 w-5 h-5" /> Sending Request...</>
                  ) : (
                    <>Send Message <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
              </form>
            )}

            {/* What happens next? */}
            <div className="mt-12 pt-8 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-[#D4AF37]"/> What happens next?</p>
              <div className="flex flex-col sm:flex-row gap-6 text-sm text-slate-500">
                <div className="flex-1"><span className="font-bold text-slate-900 block mb-1">1. We receive your request</span> Our system immediately routes your query to the specialized agent.</div>
                <div className="flex-1"><span className="font-bold text-slate-900 block mb-1">2. Quick Consultation</span> An expert will call you within 2 hours to understand your needs.</div>
                <div className="flex-1"><span className="font-bold text-slate-900 block mb-1">3. Tailored Solutions</span> We present you with off-market deals or premium marketing plans.</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Dynamic Locations & Map (Spans 5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>

            <div className="p-8 md:p-12 relative z-10 flex-1">
              <h2 className="text-3xl font-black mb-2 text-white">Our Offices</h2>
              <p className="text-slate-400 mb-8 text-sm">Select a location to view details.</p>
              
              {/* Location Selector Tabs */}
              <div className="flex flex-col gap-3 mb-8">
                {LOCATIONS.map((loc) => (
                  <button 
                    key={loc.id}
                    onClick={() => setActiveLocation(loc)}
                    className={`text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between group ${activeLocation.id === loc.id ? 'bg-[#8B0000] border-[#8B0000] shadow-lg shadow-[#8B0000]/30' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Building className={`w-5 h-5 ${activeLocation.id === loc.id ? 'text-[#D4AF37]' : 'text-slate-400 group-hover:text-[#D4AF37]'}`} />
                      <span className="font-bold text-lg text-white">{loc.name}</span>
                    </div>
                    {activeLocation.id === loc.id && <CheckCircle className="w-5 h-5 text-[#D4AF37]/50" />}
                  </button>
                ))}
              </div>
              
              {/* Active Location Details */}
              <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#D4AF37] w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm leading-relaxed">{activeLocation.address}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="text-[#D4AF37] w-5 h-5 shrink-0" />
                    <p className="text-slate-300 font-bold tracking-wide">{activeLocation.phone}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="text-[#D4AF37] w-5 h-5 shrink-0" />
                    <p className="text-slate-300 font-medium">{activeLocation.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Dynamic Map */}
            <div className="h-64 w-full relative z-10 mt-auto border-t-[6px] border-[#8B0000]">
              <iframe 
                src={activeLocation.mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(0.3) contrast(1.2)' }} 
                allowFullScreen="" 
                loading="lazy" 
                title={`Map for ${activeLocation.name}`}
              ></iframe>
            </div>
          </div>

        </div>
      </section>

      {/* 3. PREMIUM FAQ SECTION */}
      <section className="bg-white py-24 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-lg">Quick answers to help you get started on your real estate journey.</p>
          </div>

          <div className="grid gap-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-slate-50 border rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 ${activeFaq === index ? 'shadow-xl border-[#D4AF37]/50 bg-white' : 'border-slate-200 hover:border-[#D4AF37]/30 hover:shadow-md'}`}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className={`font-black text-lg md:text-xl ${activeFaq === index ? 'text-[#8B0000]' : 'text-slate-900'}`}>{faq.question}</h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${activeFaq === index ? 'bg-[#8B0000]/10' : 'bg-white border border-slate-200'}`}>
                    <Plus className={`w-5 h-5 transition-transform duration-300 ${activeFaq === index ? 'rotate-45 text-[#8B0000]' : 'text-slate-400'}`} />
                  </div>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-600 text-lg leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
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
                  <a href="tel:+919732300007" className="text-xs hover:text-[#D4AF37] transition-colors">+91 97323 00007</a>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Mail className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" />
                  <a href="mailto:info@ankrealty.com" className="text-xs hover:text-[#D4AF37] transition-colors">info@ankrealty.com</a>
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
