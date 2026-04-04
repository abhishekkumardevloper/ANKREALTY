// src/pages/PropertyDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Bed, Bath, Maximize, Phone, Mail, Calendar, Home,
  Heart, ShieldCheck, Share2, CheckCircle, Info, ChevronRight, 
  Image as ImageIcon, Download, FileText, Check, Building,
  TrendingUp, Coffee, Zap, ArrowUpDown, Shield, Dumbbell, Droplets, Wind,
  Star, Lock, Zap as ZapIcon, MessageSquare, Map, DollarSign, Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

const mockAmenities = [
  { name: "Cafeteria/Food Court", icon: Coffee },
  { name: "Power Backup", icon: Zap },
  { name: "Lift", icon: ArrowUpDown },
  { name: "Security", icon: Shield },
  { name: "Service/Good Lift", icon: ArrowUpDown },
  { name: "Visitor Parking", icon: Home },
  { name: "Gymnasium", icon: Dumbbell },
  { name: "Rain Water Harvesting", icon: Droplets },
  { name: "Air Conditioned", icon: Wind },
];

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const user = auth?.user;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Form States
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [quickForm, setQuickForm] = useState({ name: '', phone: '' });

  const fetchProperty = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      const fallbackProperty = location.state?.property;
      if (fallbackProperty) {
        setProperty({
          ...fallbackProperty,
          builder: fallbackProperty.builder || "Premium Developer",
          possession: fallbackProperty.possession || "Ready to Move",
          configurations: fallbackProperty.bhk ? `${fallbackProperty.bhk} BHK` : "Various",
          projectStatus: fallbackProperty.projectStatus || fallbackProperty.tag || "New Launch",
          rera: fallbackProperty.rera || "Approved"
        });
      } else {
        toast.error('Property not found');
        navigate('/properties');
      }
    } finally {
      setLoading(false);
    }
  }, [id, location.state, navigate]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const handleLeadSubmit = (e, formName) => {
    e.preventDefault();
    if(formName === 'Quick Form') setQuickForm({ name: '', phone: '' });
    else setLeadForm({ name: '', email: '', phone: '' });
    
    toast.success(`Thank you! Our expert will contact you shortly. (${formName})`);
  };

  const addToFavorites = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/auth');
      return;
    }
    toast.success('Added to favorites');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#8B0000]"></div>
        <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase text-sm">Loading details...</p>
      </div>
    );
  }

  if (!property) return null;

  const mapQuery = encodeURIComponent(`${property.title}, ${property.location || property.area || ''}, ${property.city || ''}`);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&output=embed`;
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [
        property.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
      ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const formattedPrice = property.price 
    ? property.price >= 10000000 
      ? `₹ ${(property.price / 10000000).toFixed(2)} Cr` 
      : `₹ ${(property.price / 100000).toFixed(2)} Lac`
    : 'Price on Request';

  // Generate dynamic floor plans based on real property data
  const dynamicFloorPlans = property.floorPlans && property.floorPlans.length > 0 
    ? property.floorPlans 
    : [
        {
          type: property.bhk ? `${property.bhk} BHK` : property.configurations || property.property_type || "Premium Unit",
          size: property.area ? `${property.area} Sq.ft.` : "Size on Request",
          price: formattedPrice,
          // Calculate Per Sq Ft if both price and area are available
          perSqFt: (property.price && property.area && !isNaN(property.price) && !isNaN(property.area)) 
            ? `₹ ${Math.round(property.price / property.area).toLocaleString('en-IN')}/sq.ft.` 
            : null
        }
      ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#D4AF37]/30 text-slate-800 pb-0 relative">
      <Navbar />

      {/* SUB NAVIGATION - STICKY */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex overflow-x-auto hide-scrollbar space-x-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
            {['Overview', 'Price List', 'Amenities', 'Location', 'About'].map((item) => (
              <li key={item} className="whitespace-nowrap pt-5 pb-4 cursor-pointer hover:text-[#8B0000] border-b-[3px] border-transparent hover:border-[#8B0000] transition-all"
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-10 px-6 max-w-7xl mx-auto pb-24">
        
        {/* TITLE & LOCATION */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#D4AF37]/10 text-[#8B0000] text-[10px] font-black uppercase tracking-widest mb-3 border border-[#D4AF37]/20">
               {property.property_type || 'Property'} • {property.category || 'Sale'}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
              {property.title}
            </h1>
            <p className="text-slate-500 font-medium flex items-center text-base">
              <MapPin className="w-5 h-5 mr-2 text-slate-400"/> 
              {property.location}, {property.city} {property.state ? `, ${property.state}` : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="shrink-0 h-12 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-xl shadow-sm">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="outline" onClick={addToFavorites} className="shrink-0 h-12 border-slate-200 text-[#8B0000] hover:bg-red-50 hover:border-red-200 font-bold rounded-xl shadow-sm">
              <Heart className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </div>

        {/* --- TOP SECTION: IMAGE + QUICK STATS --- */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16" id="overview">
          
          {/* Left: Image Gallery */}
          <div className="lg:w-[65%]">
            <div className="relative h-[400px] md:h-[550px] rounded-3xl overflow-hidden group border border-slate-200 shadow-lg bg-slate-900">
              <img
                src={images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
              <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-lg">
                <ImageIcon className="w-3.5 h-3.5 inline mr-1.5" /> {selectedImage + 1} / {images.length}
              </div>
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 mt-6 overflow-x-auto hide-scrollbar pb-2 px-1">
                {images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-28 h-20 md:w-36 md:h-24 rounded-2xl overflow-hidden shrink-0 cursor-pointer transition-all duration-300 ${
                      selectedImage === idx ? 'ring-[3px] ring-[#D4AF37] opacity-100 shadow-md' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Gallery view ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Quick Stats & Inline Form */}
          <div className="lg:w-[35%] flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
              
              <div className="mb-8 relative z-10">
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-2">Starting Price</p>
                <div className="flex items-center text-[#8B0000]">
                  <TrendingUp className="w-8 h-8 mr-3 text-[#D4AF37]" />
                  <span className="text-4xl md:text-5xl font-black tracking-tight">
                    {formattedPrice}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-10 relative z-10">
                <div className="col-span-2 flex items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <ShieldCheck className="w-6 h-6 text-[#D4AF37] mr-3 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">RERA Approved Project</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{property.rera || 'Check builder documents'}</p>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center text-slate-400 text-[10px] font-bold mb-1.5 uppercase tracking-widest"><Building className="w-3.5 h-3.5 mr-1.5"/> Configuration</div>
                  <p className="font-bold text-slate-900 text-sm md:text-base">{property.bhk ? `${property.bhk} BHK` : property.configurations || 'Various'}</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-slate-400 text-[10px] font-bold mb-1.5 uppercase tracking-widest"><Star className="w-3.5 h-3.5 mr-1.5"/> Status</div>
                  <p className="font-bold text-slate-900 text-sm md:text-base">{property.status === 'approved' ? 'Active Listing' : (property.projectStatus || 'Ready')}</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-slate-400 text-[10px] font-bold mb-1.5 uppercase tracking-widest"><Calendar className="w-3.5 h-3.5 mr-1.5"/> Possession</div>
                  <p className="font-bold text-slate-900 text-sm md:text-base">{property.possession || 'Immediate'}</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-slate-400 text-[10px] font-bold mb-1.5 uppercase tracking-widest"><Maximize className="w-3.5 h-3.5 mr-1.5"/> Area</div>
                  <p className="font-bold text-slate-900 text-sm md:text-base">{property.area || '-'} <span className="text-xs">sqft</span></p>
                </div>
              </div>

              {/* Inline Help Form */}
              <div className="mt-auto border border-[#D4AF37]/30 rounded-2xl p-5 bg-[#D4AF37]/5 relative z-10">
                <div className="flex items-center mb-5">
                  <div className="w-10 h-10 bg-[#8B0000] rounded-full flex items-center justify-center mr-3 shrink-0 shadow-md">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Interested in this property?</p>
                    <p className="text-xs text-slate-600 font-medium">Get a call back from our experts.</p>
                  </div>
                </div>
                <form onSubmit={(e) => handleLeadSubmit(e, 'Quick Form')} className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Input placeholder="Name" className="bg-white border-slate-200 h-11 text-sm focus:border-[#D4AF37]" value={quickForm.name} onChange={(e)=>setQuickForm({...quickForm, name: e.target.value})} required/>
                    <Input placeholder="Phone" type="tel" className="bg-white border-slate-200 h-11 text-sm focus:border-[#D4AF37]" value={quickForm.phone} onChange={(e)=>setQuickForm({...quickForm, phone: e.target.value})} required/>
                  </div>
                  <Button type="submit" className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-11 w-full shadow-md shadow-[#8B0000]/20">Request Details</Button>
                </form>
              </div>

            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT COLUMN: Main Details */}
          <div className="lg:w-[65%] space-y-16">
            
            {/* Overview / About Section */}
            <section id="about">
              <div className="flex items-center gap-3 mb-8">
                 <FileText className="w-6 h-6 text-[#D4AF37]" />
                 <h2 className="text-2xl md:text-3xl font-black text-slate-900">Property Overview</h2>
              </div>
              
              {/* FIXED ALIGNMENT FOR DESCRIPTION */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#D4AF37]"></div>
                <p className="text-slate-700 leading-relaxed md:leading-loose text-justify whitespace-pre-line text-base md:text-lg font-medium">
                  {property.description || `${property.title} is a premium ${property.property_type || 'property'} located in the prime area of ${property.location}, ${property.city}. \n\nDesigned with modern architecture and exceptional space planning, it offers an unparalleled lifestyle. Enjoy seamless connectivity to major commercial hubs, renowned schools, and top-tier hospitals. The property is equipped with top-of-the-line amenities ensuring absolute comfort, security, and convenience for you and your family.`}
                </p>
              </div>

              <div className="mt-10 grid sm:grid-cols-2 gap-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Developer</h4>
                  <p className="font-bold text-slate-900">{property.builder || 'Verified Owner/Builder'}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Furnishing</h4>
                  <p className="font-bold text-slate-900 capitalize">{property.furnishing || 'Unfurnished'}</p>
                </div>
                
                <div className="sm:col-span-2">
                  <h4 className="font-extrabold text-slate-900 mb-4 mt-2">Property Highlights:</h4>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {['Spacious Layout & Natural Light', 'Premium Fittings & Fixtures', 'Excellent Neighborhood Connectivity', '24/7 Water & Power Supply'].map((item, i) => (
                      <li key={i} className="flex items-start text-slate-600 font-medium text-sm">
                        <CheckCircle className="w-4 h-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Pricing & Floor Plans Section */}
            <section id="price-list">
              <div className="flex items-center gap-3 mb-8">
                 <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                 <h2 className="text-2xl md:text-3xl font-black text-slate-900">Pricing & Floor Plans</h2>
              </div>
              
              {/* DYNAMIC REAL DATA RENDERING */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {dynamicFloorPlans.map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-[#D4AF37] hover:shadow-xl transition-all flex flex-col group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -mr-8 -mt-8 group-hover:bg-[#D4AF37]/10 transition-colors"></div>
                    <span className="text-[#8B0000] text-[10px] font-black uppercase tracking-widest mb-4">Configuration</span>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 truncate">{item.type}</h3>
                    
                    <div className="mb-6 space-y-2">
                      <p className="text-slate-500 font-medium text-sm">Super Area: <span className="font-bold text-slate-900">{item.size}</span></p>
                      {item.perSqFt && (
                         <p className="text-slate-500 font-medium text-sm">Avg. Price: <span className="font-bold text-slate-900">{item.perSqFt}</span></p>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Starting From</p>
                      <p className="text-xl font-black text-[#003B30] group-hover:text-[#8B0000] transition-colors">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                <div className="relative z-10 text-white">
                  <h4 className="text-xl font-black mb-1">Download Detailed Brochure</h4>
                  <p className="text-sm text-slate-400 font-medium">Get floor plans, site map, and exact unit pricing.</p>
                </div>
                <Button className="relative z-10 bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 font-black rounded-xl h-12 px-8 shadow-lg shadow-[#D4AF37]/20">
                  Download PDF <Download className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </section>

            {/* Amenities Section */}
            <section id="amenities">
              <div className="flex items-center gap-3 mb-8">
                 <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                 <h2 className="text-2xl md:text-3xl font-black text-slate-900">Project Amenities</h2>
              </div>
              
              {property.amenities && property.amenities.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {property.amenities.map((item, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-center text-center shadow-sm">
                        <span className="text-sm font-bold text-slate-700">{item}</span>
                      </div>
                   ))}
                 </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {mockAmenities.map((amenity, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:shadow-lg hover:border-[#D4AF37]/50 transition-all group">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/10 transition-colors">
                        <amenity.icon className="w-6 h-6 text-slate-500 group-hover:text-[#D4AF37] transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Location Map Section */}
            <section id="location">
              <div className="flex items-center gap-3 mb-8">
                 <Map className="w-6 h-6 text-[#D4AF37]" />
                 <h2 className="text-2xl md:text-3xl font-black text-slate-900">Neighborhood Map</h2>
              </div>
              <div className="w-full h-[450px] bg-slate-200 rounded-[2rem] overflow-hidden relative border-4 border-white shadow-xl">
                <a href={mapOpenUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="absolute top-6 left-6 z-10 bg-white text-slate-900 font-bold border-slate-200 hover:bg-slate-50 shadow-lg shadow-black/10 rounded-xl">
                    Open in Google Maps <Share2 className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <iframe
                  title={`Map for ${property.title}`}
                  src={mapEmbedUrl}
                  className="w-full h-full border-0 grayscale-[20%] opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Sticky Lead Form & Why Invest */}
          <div className="lg:w-[35%]">
            <div className="sticky top-28 space-y-8">
              
              {/* Primary Sticky Form Card */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                
                <div className="mb-8 relative z-10">
                  <span className="inline-block bg-[#8B0000] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md mb-4 shadow-sm">
                    Connect with Seller
                  </span>
                  <h3 className="text-2xl font-black leading-tight mb-2">Interested in {property.title}?</h3>
                  <p className="text-sm text-slate-400 font-medium">Leave your details and we will arrange a direct meeting.</p>
                </div>

                <form onSubmit={(e) => handleLeadSubmit(e, 'Main Lead Form')} className="space-y-4 relative z-10">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Full Name</Label>
                    <Input placeholder="John Doe" className="h-14 bg-white/10 border-white/20 text-white placeholder:text-slate-500 rounded-xl focus:border-[#D4AF37]" value={leadForm.name} onChange={(e)=>setLeadForm({...leadForm, name: e.target.value})} required/>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Email Address</Label>
                    <Input placeholder="john@example.com" type="email" className="h-14 bg-white/10 border-white/20 text-white placeholder:text-slate-500 rounded-xl focus:border-[#D4AF37]" value={leadForm.email} onChange={(e)=>setLeadForm({...leadForm, email: e.target.value})} required/>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Phone Number</Label>
                    <Input placeholder="+91 92664 58945" type="tel" className="h-14 bg-white/10 border-white/20 text-white placeholder:text-slate-500 rounded-xl focus:border-[#D4AF37]" value={leadForm.phone} onChange={(e)=>setLeadForm({...leadForm, phone: e.target.value})} required/>
                  </div>
                  <div className="pt-4">
                    <Button type="submit" className="w-full h-14 bg-[#D4AF37] hover:bg-[#c09b2e] text-slate-900 font-black rounded-xl text-lg transition-all shadow-lg shadow-[#D4AF37]/20 hover:-translate-y-0.5">
                      Get Callback Now
                    </Button>
                  </div>
                </form>

                <div className="mt-6 flex items-center justify-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-t border-white/10 pt-6">
                  <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1.5 text-green-500"/> Privacy Protected</span>
                </div>
              </div>

              {/* Why Invest Box */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="font-black text-slate-900 mb-6 text-xl">Investment Highlights</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100"><ShieldCheck className="w-5 h-5 text-emerald-600"/></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">RERA Approved & Verified</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">Property documents and builder history have been cross-checked.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100"><MapPin className="w-5 h-5 text-blue-600"/></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Prime Accessibility</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">Located near upcoming transit hubs ensuring long-term value.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100"><TrendingUp className="w-5 h-5 text-amber-600"/></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">High ROI Potential</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">Historical data shows strong appreciation in this specific sector.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

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
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer"><Mail className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer"><Phone className="w-4 h-4"/></div>
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
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Commercial</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium text-sm">
                <div className="flex items-start bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <MapPin className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs leading-relaxed">Tapasya Corp Heights, Sector 126, Noida, UP</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <Mail className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs">info@ankrealty.com</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <Phone className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs">+91 92664 58945</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
