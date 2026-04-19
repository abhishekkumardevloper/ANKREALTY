// src/pages/PropertyDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Bed, Bath, Maximize, Phone, Mail, Calendar, Home,
  Heart, ShieldCheck, Share2, CheckCircle, Info, ChevronRight, 
  Image as ImageIcon, Download, FileText, Building,
  TrendingUp, Coffee, Zap, ArrowUpDown, Shield, Dumbbell, Droplets, Wind,
  Star, MessageSquare, Map as MapIcon, DollarSign, Sparkles, PlayCircle, Loader2,
  Facebook, Twitter, Instagram, Linkedin, User, Lock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

const socialLinks = {
  facebook: "#",
  twitter: "#",
  instagram: "#",
  linkedin: "#"
};

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
  const api = auth?.api;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [savedProperties, setSavedProperties] = useState(new Set());

  // SINGLE Form State
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  // Fetch User Favorites for Red Heart
  useEffect(() => {
    if (user && api) {
      api.get('/favorites').then(res => {
        const favIds = new Set(res.data.map(f => f.property_id));
        setSavedProperties(favIds);
      }).catch(console.error);
    }
  }, [user, api]);

  // --- CRM INTEGRATION FOR INQUIRY ---
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      return toast.error("Please provide your name and phone number.");
    }

    setIsSubmitting(true);
    try {
      if (user && api) {
        await api.post('/inquiries', {
          property_id: property.id,
          message: `I am interested in ${property.title}. Please contact me.`
        });
      } else {
        await axios.post(`${API_BASE}/contacts`, {
          name: leadForm.name,
          phone: leadForm.phone,
          email: leadForm.email || 'N/A',
          interest: `Property Inquiry: ${property.title} (${property.id})`,
          message: `Guest inquiry for property: ${property.title}.`
        });
      }
      
      setSubmitSuccess(true);
      setLeadForm({ name: '', email: '', phone: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
      
    } catch (error) {
      console.error("Inquiry Error:", error);
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProperty = async () => {
    if (!user || !api) {
      toast.error('Please login to save properties.');
      navigate('/auth');
      return;
    }
    try {
      if (savedProperties.has(property.id)) {
        await api.delete(`/favorites/${property.id}`);
        setSavedProperties(prev => { const n = new Set(prev); n.delete(property.id); return n; });
        toast.success('Removed from collection.');
      } else {
        await api.post('/favorites', { property_id: property.id });
        setSavedProperties(prev => { const n = new Set(prev); n.add(property.id); return n; });
        toast.success('Property saved!');
      }
    } catch (error) {
      toast.error('Failed to update favorites.');
    }
  };

  const scrollToLeadForm = () => {
    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('lead-name-input')?.focus();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
        <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Loading details...</p>
      </div>
    );
  }

  if (!property) return null;

  const isSaved = savedProperties.has(property.id);

  // --- Helper to extract YouTube Embed URL ---
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };
  const embedUrl = getYoutubeEmbedUrl(property.youtube_link);

  const mapQuery = encodeURIComponent(`${property.title}, ${property.location || property.area || ''}, ${property.city || ''}`);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&output=embed`;
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [
        property.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      ];

  const formattedPrice = property.price 
    ? property.price >= 10000000 
      ? `₹ ${(property.price / 10000000).toFixed(2)} Cr` 
      : `₹ ${(property.price / 100000).toFixed(2)} Lac`
    : 'Price on Request';

  // Dynamic Floor Plans Array
  const displayFloorPlans = property.floorPlans && property.floorPlans.length > 0 
    ? property.floorPlans 
    : [
        { type: property.bhk ? `${property.bhk} BHK` : "Premium Unit", size: property.area ? `${property.area} Sq.ft.` : "Size on Request", price: formattedPrice, imageUrl: null }
      ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#D4AF37]/30 text-slate-800 pb-0">
      <Navbar />

      <div className="pt-24 px-4 md:px-6 max-w-[1400px] mx-auto pb-24">
        
        {/* --- MAIN HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[#8B0000] text-[10px] font-black uppercase tracking-widest mb-4">
               <Building className="w-3.5 h-3.5" /> {property.property_type || 'Property'} • {property.category || 'Sale'}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
              {property.title}
            </h1>
            <p className="text-slate-500 font-medium flex items-center text-sm md:text-base">
              <MapPin className="w-4 h-4 mr-1.5 text-[#D4AF37]"/> 
              {property.location}, {property.city}
            </p>
          </div>
          
          <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
             <div className="text-left lg:text-right">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Starting Price</p>
               <p className="text-3xl md:text-4xl font-black text-[#8B0000] flex items-center">
                 {formattedPrice} <span className="text-sm font-medium text-slate-500 ml-2">Onwards</span>
               </p>
             </div>
             <div className="flex gap-3 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-none h-12 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl shadow-sm">
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSaveProperty} 
                  className={`flex-1 sm:flex-none h-12 rounded-xl font-bold shadow-sm transition-all ${isSaved ? 'border-red-200 bg-red-50 text-[#8B0000]' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-[#8B0000] text-[#8B0000]' : ''}`} /> 
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Gallery & Details */}
          <div className="lg:w-[68%] space-y-8">
            
            {/* Gallery Section */}
            <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden group bg-slate-100">
                <img
                  src={images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-slate-900 shadow-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Verified Property
                </div>
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto hide-scrollbar pb-2">
                  {images.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer transition-all duration-300 ${
                        selectedImage === idx ? 'ring-2 ring-[#D4AF37] opacity-100 shadow-sm' : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Info Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                 <Building className="w-6 h-6 text-[#D4AF37] mb-2"/>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Configuration</p>
                 <p className="font-black text-slate-900 text-sm">{property.bhk ? `${property.bhk} BHK` : property.configurations || 'Various'}</p>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                 <Maximize className="w-6 h-6 text-[#D4AF37] mb-2"/>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Super Area</p>
                 <p className="font-black text-slate-900 text-sm">{property.area ? `${property.area} sq.ft` : 'On Request'}</p>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                 <Calendar className="w-6 h-6 text-[#D4AF37] mb-2"/>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Possession</p>
                 <p className="font-black text-slate-900 text-sm">{property.possession || 'Ready to Move'}</p>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                 <ShieldCheck className="w-6 h-6 text-[#D4AF37] mb-2"/>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">RERA Status</p>
                 <p className="font-black text-slate-900 text-sm">{property.rera ? 'Registered' : 'Check Docs'}</p>
               </div>
            </div>

            {/* Overview Section */}
            <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                 <FileText className="w-6 h-6 text-[#D4AF37]" />
                 <h2 className="text-2xl font-black text-slate-900">Project Overview</h2>
              </div>
              <p className="text-slate-600 leading-loose text-justify whitespace-pre-line text-base font-medium">
                {property.description || `${property.title} is a premium ${property.property_type || 'property'} located in the prime area of ${property.location}, ${property.city}. \n\nDesigned with modern architecture and exceptional space planning, it offers an unparalleled lifestyle. Enjoy seamless connectivity to major commercial hubs, renowned schools, and top-tier hospitals.`}
              </p>
              
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                 <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm border border-slate-200"><Building className="w-4 h-4 text-slate-600"/></div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Developer</p>
                     <p className="font-bold text-slate-900 text-sm">{property.builder || 'Premium Builder'}</p>
                   </div>
                 </div>
                 <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm border border-slate-200"><Home className="w-4 h-4 text-slate-600"/></div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Furnishing</p>
                     <p className="font-bold text-slate-900 text-sm capitalize">{property.furnishing || 'Unfurnished'}</p>
                   </div>
                 </div>
              </div>
            </section>

            {/* Dynamic Floor Plans Section */}
            <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                 <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                 <h2 className="text-2xl font-black text-slate-900">Price List & Floor Plans</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayFloorPlans.map((plan, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#D4AF37] hover:shadow-xl transition-all flex flex-col group cursor-pointer">
                    {/* Blurred Floor Plan Image Area */}
                    <div className="h-40 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                       <img 
                         src={plan.imageUrl || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80'} 
                         alt={`${plan.type} Floor Plan`} 
                         className="w-full h-full object-cover blur-[6px] opacity-70 group-hover:scale-105 transition-transform duration-700"
                       />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Button onClick={scrollToLeadForm} variant="outline" className="bg-white/90 backdrop-blur-md border-white text-slate-900 font-bold shadow-lg hover:bg-white hover:text-[#8B0000]">
                            View Full Plan <Download className="w-4 h-4 ml-2"/>
                          </Button>
                       </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Unit</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mb-4">{plan.type}</h3>
                      
                      <div className="space-y-1 mb-6">
                        <span className="bg-slate-50 text-slate-400 border border-slate-100 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md block w-max mb-1">Size</span>
                        <p className="font-bold text-slate-700 text-sm">{plan.size}</p>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
                         <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Price</span>
                         <p className="text-lg font-black text-[#003B30]">{plan.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Video Tour */}
            {embedUrl && (
              <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                   <PlayCircle className="w-6 h-6 text-[#D4AF37]" />
                   <h2 className="text-2xl font-black text-slate-900">Virtual Tour</h2>
                </div>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border-[4px] border-slate-50 bg-slate-900">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                    src={embedUrl}
                    title="Property Video Tour"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </section>
            )}

            {/* Amenities Section */}
            <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                 <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                 <h2 className="text-2xl font-black text-slate-900">Project Amenities</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                {mockAmenities.map((amenity, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:bg-white hover:border-[#D4AF37]/40 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:bg-[#D4AF37]/10 transition-colors">
                      <amenity.icon className="w-5 h-5 text-slate-400 group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location Map */}
            <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                 <MapIcon className="w-6 h-6 text-[#D4AF37]" />
                 <h2 className="text-2xl font-black text-slate-900">Neighborhood Map</h2>
              </div>
              <div className="w-full h-[400px] bg-slate-100 rounded-2xl overflow-hidden relative border-4 border-slate-50 shadow-inner">
                <a href={mapOpenUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="absolute top-4 left-4 z-10 bg-white text-slate-900 font-bold border-slate-200 hover:bg-slate-50 shadow-md rounded-xl text-xs h-10">
                    Open in Maps <Share2 className="w-3.5 h-3.5 ml-2" />
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

          {/* RIGHT COLUMN: Sticky Minimal Lead Form */}
          <div className="lg:w-[32%]">
            <div className="sticky top-28 space-y-6" id="inquiry-form">
              
              {/* PRIMARY INQUIRY FORM */}
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                
                {submitSuccess ? (
                   <div className="h-[300px] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 relative z-10">
                     <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100">
                       <CheckCircle className="w-8 h-8 text-green-500" />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 mb-2">Request Sent!</h3>
                     <p className="text-slate-500 text-sm font-medium">
                       Our property expert will contact you shortly regarding {property.title}.
                     </p>
                   </div>
                ) : (
                  <div className="relative z-10">
                    <div className="mb-6">
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Interested?</h3>
                      <p className="text-sm text-slate-500 font-medium">Fill the form below to get exact pricing, floor plans, and schedule a site visit.</p>
                    </div>

                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</Label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-4 w-4 text-slate-400"/></div>
                           <Input id="lead-name-input" placeholder="e.g. John Doe" className="h-12 pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#D4AF37] rounded-xl text-sm font-medium" value={leadForm.name} onChange={(e)=>setLeadForm({...leadForm, name: e.target.value})} required/>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</Label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-slate-400"/></div>
                           <Input placeholder="john@example.com" type="email" className="h-12 pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#D4AF37] rounded-xl text-sm font-medium" value={leadForm.email} onChange={(e)=>setLeadForm({...leadForm, email: e.target.value})} required/>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Number</Label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-slate-400"/></div>
                           <Input placeholder="+91 98765 43210" type="tel" className="h-12 pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#D4AF37] rounded-xl text-sm font-medium" value={leadForm.phone} onChange={(e)=>setLeadForm({...leadForm, phone: e.target.value})} required/>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-[#8B0000] hover:bg-[#600000] text-white font-black rounded-xl text-sm shadow-lg shadow-[#8B0000]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center">
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Callback Now"}
                        </Button>
                      </div>
                    </form>

                    <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-5 border-t border-slate-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-500"/> Privacy Protected
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Box */}
              <div className="bg-slate-900 rounded-[2rem] p-6 shadow-xl relative overflow-hidden text-white">
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#D4AF37]/20 blur-xl rounded-full pointer-events-none" />
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]"/> Why Choose Us
                </h3>
                <div className="space-y-4 text-sm font-medium text-slate-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5"/>
                    <p>100% Verified & authentic property listings.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5"/>
                    <p>Zero brokerage on select premium projects.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5"/>
                    <p>End-to-end legal and home loan assistance.</p>
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
                  <a href={socialLinks.facebook} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer"><Facebook className="w-4 h-4"/></a>
                  <a href={socialLinks.twitter} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer"><Twitter className="w-4 h-4"/></a>
                  <a href={socialLinks.instagram} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer"><Instagram className="w-4 h-4"/></a>
                  <a href={socialLinks.linkedin} className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer"><Linkedin className="w-4 h-4"/></a>
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
