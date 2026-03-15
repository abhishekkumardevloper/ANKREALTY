import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Bed, Bath, Maximize, Phone, Mail, Calendar, Home,
  Heart, ShieldCheck, Share2, CheckCircle, Info, ChevronRight, 
  Image as ImageIcon, Download, FileText, Check, Building
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const [appointmentData, setAppointmentData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });

  const [inquiryMessage, setInquiryMessage] = useState('');

  const fetchProperty = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      const fallbackProperty = location.state?.property;
      if (fallbackProperty) {
        setProperty(fallbackProperty);
      } else {
        console.error('Error fetching property:', error);
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

  const handleScheduleVisit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to schedule a visit');
      navigate('/auth');
      return;
    }

    try {
      await axios.post(`${API_BASE}/appointments`, {
        property_id: id,
        ...appointmentData
      });

      toast.success('Visit scheduled successfully!');
      setAppointmentData({ name: '', phone: '', date: '', time: '', message: '' });
    } catch (error) {
      toast.error('Failed to schedule visit');
    }
  };

  const handleSendInquiry = async () => {
    if (!user) {
      toast.error('Please login to send inquiry');
      navigate('/auth');
      return;
    }

    if (!inquiryMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await axios.post(`${API_BASE}/inquiries`, {
        property_id: id,
        message: inquiryMessage
      });

      toast.success('Inquiry sent successfully!');
      setInquiryMessage('');
    } catch (error) {
      toast.error('Failed to send inquiry');
    }
  };

  const addToFavorites = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/auth');
      return;
    }

    try {
      await axios.post(`${API_BASE}/favorites`, { property_id: id });
      toast.success('Added to favorites');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto w-full animate-pulse">
          <div className="h-8 bg-slate-200 rounded-md w-1/4 mb-4"></div>
          <div className="h-64 bg-slate-200 rounded-2xl w-full mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/3 h-[500px] bg-slate-200 rounded-2xl"></div>
            <div className="lg:w-1/3 h-[600px] bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-red-200 pb-20">
      <Navbar />

      <div className="pt-28 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-slate-500 font-medium mb-6">
          <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
          <Link to="/properties" className="hover:text-red-600 transition-colors">Projects</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
          <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{property.title}</span>
        </nav>

        {/* Hero Image Section (Full Width Style) */}
        <div className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-8 group shadow-md">
          <img
            src={images[selectedImage]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
          
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 pr-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                {property.status || 'Under Construction'}
              </span>
              {property.status === 'approved' && (
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5"/> RERA Registered
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight drop-shadow-lg">
              {property.title}
            </h1>
            <p className="text-white/90 text-lg flex items-center font-medium drop-shadow-md">
              <MapPin className="w-5 h-5 mr-2 text-red-400"/> 
              {property.location || property.area}, {property.city}
            </p>
          </div>

          <div className="absolute bottom-6 right-6 flex gap-2">
            <Button onClick={addToFavorites} variant="secondary" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-slate-900 rounded-full w-12 h-12 p-0">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="secondary" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-slate-900 rounded-full w-12 h-12 p-0">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 mb-10 overflow-x-auto hide-scrollbar pb-2 px-1">
            {images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-32 h-20 md:w-40 md:h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer transition-all duration-300 shadow-sm ${
                  selectedImage === idx ? 'ring-4 ring-red-600 ring-offset-2' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Gallery view ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN: Project Details */}
          <div className="lg:w-[65%] space-y-8">
            
            {/* Quick Specs / Overview */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-1">Price Starts From</p>
                  <p className="text-2xl font-extrabold text-red-600">₹{Number(property.price).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-1">Typology</p>
                  <p className="text-xl font-bold text-slate-900">{property.bedrooms || property.bhk || '2, 3 & 4'} BHK</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-1">Project Status</p>
                  <p className="text-xl font-bold text-slate-900">{property.project_status || 'New Launch'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-1">RERA Number</p>
                  <p className="text-md font-bold text-slate-900 truncate">{property.rera_number || 'UPRERA-XXXXX'}</p>
                </div>
              </div>
            </div>

            {/* About the Project */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                About {property.title}
              </h2>
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed">
                {property.description?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
                {!property.description && (
                  <p>Discover the epitome of luxury living at {property.title}. Designed by world-renowned architects, this project offers an unparalleled lifestyle with state-of-the-art amenities and breathtaking views. Experience the perfect blend of comfort, elegance, and convenience in the heart of {property.city}.</p>
                )}
              </div>
            </div>

            {/* Project Highlights */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">Project Highlights</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {['Strategic location with seamless connectivity', 'Vastu compliant architecture', 'Premium clubhouse and recreation zone', '24/7 Multi-tier security system', 'Lush green landscapes & water bodies', 'High-speed elevators and power backup'].map((highlight, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 shrink-0" />
                    <span className="text-slate-700 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">World Class Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {(property.amenities && property.amenities.length > 0 ? property.amenities : ['Swimming Pool', 'Gymnasium', 'Club House', 'Kids Play Area', 'Jogging Track', 'Tennis Court']).map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-slate-700 font-medium group cursor-default bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-colors">
                    <CheckCircle className="w-5 h-5 text-red-500 mr-3 shrink-0"/> 
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Plans & Pricing (Placeholder) */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">Floor Plans & Pricing</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-4 rounded-tl-lg">Configuration</th>
                      <th className="p-4">Super Area</th>
                      <th className="p-4">Price Range</th>
                      <th className="p-4 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">2 BHK Luxury</td>
                      <td className="p-4 text-slate-600">1,250 Sq.Ft.</td>
                      <td className="p-4 font-bold text-slate-900">On Request</td>
                      <td className="p-4"><Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Price Breakup</Button></td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">3 BHK Premium</td>
                      <td className="p-4 text-slate-600">1,850 Sq.Ft.</td>
                      <td className="p-4 font-bold text-slate-900">On Request</td>
                      <td className="p-4"><Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Price Breakup</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">Location Advantages</h2>
                <div className="w-full h-[400px] bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-slate-300 absolute" />
                  <p className="text-slate-500 font-semibold z-10 mt-16">Interactive Map integration here</p>
                </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Lead Form & Actions */}
          <div className="lg:w-[35%]">
            <div className="sticky top-32 space-y-6">
              
              {/* Brochure Download Card */}
              <div className="bg-gradient-to-br from-slate-900 to-black rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h3 className="text-xl font-bold mb-2">Detailed Project Brochure</h3>
                <p className="text-slate-400 text-sm mb-6">Download the official brochure to explore floor plans, master plans, and detailed specifications.</p>
                <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" /> Download Brochure
                </Button>
              </div>

              {/* Main Inquiry Form Card */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Interested in Property?</h3>
                <p className="text-slate-500 text-sm mb-6">Register here to get best offers and exclusive updates.</p>

                <form className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Your Name *</Label>
                    <Input placeholder="Enter your full name" className="h-12 bg-slate-50" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Phone Number *</Label>
                    <Input placeholder="+91" type="tel" className="h-12 bg-slate-50" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Email Address</Label>
                    <Input placeholder="Enter email id" type="email" className="h-12 bg-slate-50" />
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <Button onClick={(e) => { e.preventDefault(); handleSendInquiry(); }} className="w-full h-14 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-lg transition-all shadow-md">
                      Get Callback
                    </Button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-4">
                   <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full h-12 border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold">
                        <Calendar className="w-4 h-4 mr-2" /> Book Visit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-3xl p-8">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold">Book a Site Visit</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium mt-2">
                          Choose a preferred date and time to view {property.title}.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleScheduleVisit} className="space-y-5 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</Label>
                            <Input 
                              type="date" required 
                              value={appointmentData.date} onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                              className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-red-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</Label>
                            <Input 
                              type="time" required 
                              value={appointmentData.time} onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                              className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-red-500"
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg mt-2 transition-all">
                          Confirm Booking
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Developer Profile Snippet */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-start gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                   <Building className="w-6 h-6 text-slate-400"/>
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-900 text-sm">Marketed by ANK Realty</h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
                     Authorized Sales Partner. ANK Realty ensures complete transparency and assists you at every step of your home buying journey.
                   </p>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800 mt-24">
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
    </div>
  );
}
