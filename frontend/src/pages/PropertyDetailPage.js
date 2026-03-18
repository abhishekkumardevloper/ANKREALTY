import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Bed, Bath, Maximize, Phone, Mail, Calendar, Home,
  Heart, ShieldCheck, Share2, CheckCircle, Info, ChevronRight, 
  Image as ImageIcon, Download, FileText, Check, Building,
  TrendingUp, Coffee, Zap, ArrowUpDown, Shield, Dumbbell, Droplets, Wind,
  Star, Lock, Zap as ZapIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api";

// --- MOCK DATA FOR NEW SECTIONS ---
const mockPriceList = [
  { type: "3 BHK", size: "1932 Sq.ft. sq.ft.", price: "₹ 1.72 CR*" },
  { type: "3 BHK + Study", size: "2239 Sq.ft. sq.ft.", price: "₹ 1.99 CR*" },
  { type: "4 BHK + Study", size: "2625 Sq.ft. sq.ft.", price: "₹ 2.33 CR*" },
];

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
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Form States
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [quickForm, setQuickForm] = useState({ name: '', email: '', phone: '' });

  const fetchProperty = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      const fallbackProperty = location.state?.property;
      if (fallbackProperty) {
        setProperty({
          ...fallbackProperty,
          // Hydrate fallback with extra data to match new UI
          builder: fallbackProperty.builder || "Yatharth Group and Great Value Realty",
          possession: "June 2030",
          configurations: "3 BHK Flats, 4 BHK Flats",
          projectStatus: fallbackProperty.tag || "New Launch",
          rera: fallbackProperty.rera || "Governed by the ASPIRE framework"
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
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003B30]"></div>
      </div>
    );
  }

  if (!property) return null;

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
      const yOffset = -120; // Adjust for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#003B30]/20 text-slate-800 pb-20 relative">
      <Navbar />

      {/* SUB NAVIGATION - STICKY */}
      <div className="sticky top-16 md:top-20 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <ul className="flex overflow-x-auto hide-scrollbar space-x-8 text-sm font-bold text-slate-600">
            {['Overview', 'Price List', 'Floor Plans', 'Amenities', 'Location', 'About', 'FAQ'].map((item) => (
              <li key={item} className="whitespace-nowrap pt-4 pb-3 cursor-pointer hover:text-[#003B30] border-b-2 border-transparent hover:border-[#003B30] transition-colors"
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-8 px-4 md:px-8 max-w-[1400px] mx-auto">
        
        {/* TITLE & LOCATION */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
            {property.title}: Ultra-Spacious, Low-Density Living
          </h1>
          <p className="text-slate-500 font-medium flex items-center text-sm md:text-base">
            <MapPin className="w-4 h-4 mr-1.5 text-slate-400"/> 
            {property.location || property.area}, {property.city}
          </p>
        </div>

        {/* --- TOP SECTION: IMAGE + QUICK STATS --- */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12" id="overview">
          
          {/* Left: Image Gallery */}
          <div className="lg:w-[65%]">
            <div className="relative h-[350px] md:h-[500px] rounded-2xl overflow-hidden group border border-slate-100 shadow-sm">
              <img
                src={images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                {selectedImage + 1} / {images.length}
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
                      selectedImage === idx ? 'ring-2 ring-[#003B30] opacity-100' : 'opacity-60 hover:opacity-100'
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
            <div className="border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
              
              <div className="mb-6">
                <p className="text-slate-500 text-sm font-semibold mb-1">Starting Price</p>
                <div className="flex items-center text-[#003B30]">
                  <TrendingUp className="w-7 h-7 mr-3" />
                  <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {property.priceText || `₹ ${(property.price / 10000000).toFixed(2)} CR* Onwards*`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 mb-8">
                <div className="col-span-1 md:col-span-2 flex items-start">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 mr-3 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">RERA Approved</p>
                    <p className="text-xs text-slate-500 font-medium">{property.rera}</p>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider"><Building className="w-4 h-4 mr-1.5"/> Configurations</div>
                  <p className="font-bold text-slate-900 text-sm">{property.configurations}</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider"><Star className="w-4 h-4 mr-1.5"/> Project Status</div>
                  <p className="font-bold text-slate-900 text-sm">{property.projectStatus}</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider"><Calendar className="w-4 h-4 mr-1.5"/> Possession</div>
                  <p className="font-bold text-slate-900 text-sm">{property.possession}</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider"><Building className="w-4 h-4 mr-1.5"/> Builder</div>
                  <p className="font-bold text-slate-900 text-sm line-clamp-1">{property.builder}</p>
                </div>
              </div>

              {/* Inline Help Form */}
              <div className="mt-auto border-2 border-[#003B30]/10 rounded-xl p-4 bg-slate-50">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Need Help with Anything?</p>
                    <p className="text-xs text-slate-600 font-medium">Get Free Expert Consult Now!!!</p>
                  </div>
                </div>
                <form onSubmit={(e) => handleLeadSubmit(e, 'Quick Form')} className="flex flex-col sm:flex-row gap-2">
                  <Input placeholder="Name" className="bg-white border-slate-200 h-10 text-sm" value={quickForm.name} onChange={(e)=>setQuickForm({...quickForm, name: e.target.value})} required/>
                  <Input placeholder="Phone" type="tel" className="bg-white border-slate-200 h-10 text-sm" value={quickForm.phone} onChange={(e)=>setQuickForm({...quickForm, phone: e.target.value})} required/>
                  <Button type="submit" className="bg-[#003B30] hover:bg-[#00261c] text-white h-10 shrink-0">Submit <Share2 className="w-3 h-3 ml-2"/></Button>
                </form>
              </div>

            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN: Main Details */}
          <div className="lg:w-[65%] space-y-12">
            
            {/* Price List Section */}
            <section id="price-list">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Price List</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {mockPriceList.map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl p-5 hover:border-[#003B30]/30 hover:shadow-md transition-all flex flex-col">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded w-fit mb-3">Unit</span>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{item.type}</h3>
                    
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded w-fit mb-1">Size</span>
                    <p className="text-slate-600 font-medium text-sm mb-4 border-b border-slate-100 pb-4">{item.size}</p>
                    
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Price / sq.ft.</p>
                    <p className="text-xl font-extrabold text-[#003B30] mb-6">{item.price} <span className="text-sm">Onwards</span></p>
                    
                    <Button className="w-full mt-auto bg-[#003B30] hover:bg-[#00261c] text-white font-bold rounded-xl h-11">
                      Get Breakdown <FileText className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="font-bold text-slate-900">Want the exact pricing breakdown?</h4>
                  <p className="text-sm text-slate-500">Get detailed unit-wise pricing & available offers</p>
                </div>
                <Button className="bg-[#003B30] hover:bg-[#00261c] text-white font-bold rounded-xl h-11 px-6">
                  Get Price List <Download className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">*All prices are indicative and subject to change without prior notice.</p>
            </section>

            {/* Amenities Section */}
            <section id="amenities">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">{property.title} Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockAmenities.map((amenity, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-sm hover:border-[#003B30]/20 transition-all">
                    <amenity.icon className="w-8 h-8 text-slate-700 mb-3 stroke-[1.5]" />
                    <span className="text-sm font-semibold text-slate-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 h-12 border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                View all 16 amenities
              </Button>
            </section>

            {/* Overview / About Section */}
            <section id="about">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Overview of {property.title}</h2>
              <div className="prose prose-slate max-w-none text-slate-600 mb-8 leading-relaxed">
                <p>
                  {property.title} is a high quality, low-density residential project spread across 6 acres of land, located in Techzone 4, Greater Noida West. The project has 6 towers with G+30 floors. It has 3 BHK and 4 BHK apartments with Vastu-compliant layout, 80% open green space. It was developed under the supervision of the Supreme Court and NBCC, thus providing high accountability, elite features such as 25,000 sq. ft. clubhouse, and uninterrupted connectivity.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="font-extrabold text-slate-900">Type of Property: </span>
                  <span className="text-slate-600">{property.type || 'Residential'}</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">Property Units: </span>
                  <span className="text-slate-600">108 units per acer (4 units on each floor)</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 mb-4 mt-2">Location Highlights:</h4>
                  <ul className="space-y-3">
                    {['Centrally located in a non-congested area.', '100-meter completely developed green belt view.', 'Smooth access to major expressways.', 'Proximity to basic amenities like a top-class hospital, an international school and a marketplace.'].map((item, i) => (
                      <li key={i} className="flex items-start text-slate-600">
                        <ChevronRight className="w-5 h-5 text-[#003B30] mr-2 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-extrabold text-slate-900">Real Estate Developer: </span>
                  <span className="text-slate-600">{property.builder}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 mb-4 mt-2">Property Highlights:</h4>
                  <ul className="space-y-3">
                    {['Double-height designer entrance lobbies in every tower.', 'Spacious balconies with panoramic views.'].map((item, i) => (
                      <li key={i} className="flex items-start text-slate-600">
                        <ChevronRight className="w-5 h-5 text-[#003B30] mr-2 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Location Map Section */}
            <section id="location">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">{property.title} Location</h2>
              <div className="w-full h-[400px] bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200">
                <Button variant="outline" className="absolute top-4 left-4 z-10 bg-white text-blue-600 font-bold border-slate-200 hover:bg-slate-50 shadow-sm">
                  Open in Maps <Share2 className="w-4 h-4 ml-2" />
                </Button>
                {/* Simulated Map Background */}
                <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] bg-slate-200 flex flex-col items-center justify-center opacity-70">
                   <MapPin className="w-12 h-12 text-[#003B30] drop-shadow-md mb-2" />
                   <p className="font-bold text-slate-700">Map Integration View</p>
                </div>
              </div>
              <p className="flex items-center text-slate-500 font-medium mt-4">
                <MapPin className="w-5 h-5 mr-2 text-slate-400" /> {property.location}, {property.city}
              </p>
            </section>

          </div>

          {/* RIGHT COLUMN: Sticky Lead Form & Why Invest */}
          <div className="lg:w-[35%]">
            <div className="sticky top-28 space-y-6">
              
              {/* Primary Sticky Form Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#003B30]"></div>
                
                <div className="mb-6">
                  <span className="inline-block bg-[#003B30] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-sm">Exclusive</span>
                  <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-md">
                      <Star className="w-5 h-5 text-white fill-current" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Get Offers You Won't Find Anywhere Else</h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Only from ANK Realty - Top Channel Partner</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={(e) => handleLeadSubmit(e, 'Exclusive Offers Form')} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Name</Label>
                    <Input placeholder="Full name" className="h-12 bg-white border-slate-200 rounded-xl focus-visible:ring-[#003B30]" value={leadForm.name} onChange={(e)=>setLeadForm({...leadForm, name: e.target.value})} required/>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Email</Label>
                    <Input placeholder="you@example.com" type="email" className="h-12 bg-white border-slate-200 rounded-xl focus-visible:ring-[#003B30]" value={leadForm.email} onChange={(e)=>setLeadForm({...leadForm, email: e.target.value})} required/>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Phone</Label>
                    <Input placeholder="+91 98765 43210" type="tel" className="h-12 bg-white border-slate-200 rounded-xl focus-visible:ring-[#003B30]" value={leadForm.phone} onChange={(e)=>setLeadForm({...leadForm, phone: e.target.value})} required/>
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full h-14 bg-[#003B30] hover:bg-[#00261c] text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-[#003B30]/20">
                      Get Best Price <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                  </div>
                </form>

                <div className="mt-5 flex items-center justify-center gap-4 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg py-3 border border-emerald-100">
                  <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1.5"/> 100% Secure</span>
                  <span className="flex items-center"><ZapIcon className="w-4 h-4 mr-1.5"/> Quick Response</span>
                </div>
              </div>

              {/* Why Invest Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="font-extrabold text-slate-900 mb-5">Why Invest?</h3>
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600"><ShieldCheck className="w-5 h-5"/></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">RERA Approved</h4>
                      <p className="text-xs text-slate-500 font-medium">RERA No. {property.rera}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600"><Building className="w-5 h-5"/></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Trusted Developer</h4>
                      <p className="text-xs text-slate-500 font-medium">{property.builder}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600"><TrendingUp className="w-5 h-5"/></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">High ROI Potential</h4>
                      <p className="text-xs text-slate-500 font-medium">Prime location with strong appreciation</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {/* FLOATING CHATBOT ICON (Matched to theme) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-[#003B30] hover:bg-[#00261c] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group border border-white/10 relative">
          <MessageSquare className="w-7 h-7" />
          <div className="absolute right-full mr-4 bottom-1/2 translate-y-1/2 bg-white text-slate-800 text-sm font-bold py-2 px-4 rounded-2xl rounded-br-sm shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Hi, I'm your real estate assistant
          </div>
        </button>
      </div>

    </div>
  );
}

// Temporary icon to satisfy import requirement for Chatbot
const MessageSquare = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
