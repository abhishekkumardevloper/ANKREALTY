import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Bed, Bath, Maximize, Phone, Mail, Calendar, Home,
  Heart, ShieldCheck, Share2, CheckCircle, Info, ChevronRight, Image as ImageIcon
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
      setAppointmentData({ date: '', time: '', message: '' });
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
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <Navbar />
        <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto w-full animate-pulse">
          <div className="h-8 bg-slate-200 rounded-md w-1/4 mb-4"></div>
          <div className="h-12 bg-slate-200 rounded-md w-2/4 mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/3 h-[500px] bg-slate-200 rounded-3xl"></div>
            <div className="lg:w-1/3 h-[600px] bg-slate-200 rounded-3xl"></div>
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
          <Link to="/properties" className="hover:text-red-600 transition-colors">Properties</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
          <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{property.title}</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                For {property.category || property.type || 'Sale'}
              </span>
              {property.status === 'approved' && (
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5"/> Verified Listing
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight">
              {property.title}
            </h1>
            <p className="text-slate-500 text-lg flex items-center font-medium">
              <MapPin className="w-5 h-5 mr-2 text-slate-400"/> 
              {property.location || property.area}, {property.city}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
            <div className="text-4xl md:text-5xl font-extrabold text-red-600 flex items-center tracking-tight">
              ₹{Number(property.price).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button onClick={addToFavorites} variant="outline" className="flex-1 md:flex-none border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl h-12 px-6 transition-all">
                <Heart className="w-5 h-5 mr-2" /> Save
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl h-12 px-6 transition-all">
                <Share2 className="w-5 h-5 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT COLUMN: Gallery & Details */}
          <div className="lg:w-2/3">
            
            {/* Premium Image Gallery */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200 mb-10">
              <div className="relative h-[400px] md:h-[550px] rounded-2xl overflow-hidden group">
                <img
                  src={images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                
                {/* Image Counter Badge */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-slate-900 flex items-center shadow-lg">
                  <ImageIcon className="w-4 h-4 mr-2 text-slate-500" />
                  {selectedImage + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 mt-3 overflow-x-auto hide-scrollbar pb-2 px-1">
                  {images.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-28 h-20 md:w-36 md:h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer transition-all duration-300 ${
                        selectedImage === idx ? 'ring-2 ring-red-600 ring-offset-2 scale-[0.98]' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
                 <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                   <Bed className="w-6 h-6 text-red-600"/>
                 </div>
                 <span className="font-extrabold text-2xl text-slate-900">{property.bedrooms || property.bhk || '-'}</span>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Bedrooms</span>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
                 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                   <Bath className="w-6 h-6 text-blue-600"/>
                 </div>
                 <span className="font-extrabold text-2xl text-slate-900">{property.bathrooms || '-'}</span>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Bathrooms</span>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
                 <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                   <Maximize className="w-6 h-6 text-emerald-600"/>
                 </div>
                 <span className="font-extrabold text-2xl text-slate-900">{property.size || property.area || '-'}</span>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Sq Ft</span>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
                 <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                   <Home className="w-6 h-6 text-purple-600"/>
                 </div>
                 <span className="font-extrabold text-lg text-slate-900 capitalize truncate w-full px-2">{property.furnishing || 'N/A'}</span>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Furnishing</span>
               </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 mb-10">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center">
                Property Overview
              </h2>
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed">
                {property.description?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 mb-10">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Premium Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center text-slate-700 font-medium group cursor-default">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-red-50 transition-colors">
                        <CheckCircle className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors"/> 
                      </div>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 mb-10 lg:mb-0">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Neighborhood Map</h2>
                <div className="w-full h-[350px] bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-200 group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-10 transition-transform group-hover:scale-105 duration-500">
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-red-500"/>
                    </div>
                    <p className="font-bold text-slate-700">Interactive Map Integration</p>
                    <p className="text-sm">Available in production environment</p>
                  </div>
                </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Action Card */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 space-y-6">
              
              {/* Main Contact Card */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <h3 className="text-xl font-extrabold text-slate-900 mb-6">Ready to make a move?</h3>
                
                {/* Agent Info */}
                <div className="flex items-center gap-4 mb-8 p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
                   <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-md ring-4 ring-white">
                     {property.owner_name ? property.owner_name.charAt(0).toUpperCase() : 'A'}
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 text-lg">{property.owner_name || 'ANK Agent'}</p>
                     <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider flex items-center mt-1">
                       <ShieldCheck className="w-3 h-3 mr-1" /> Verified Seller
                     </p>
                   </div>
                </div>

                <div className="space-y-4">
                  {/* Dialog for Scheduling Visit */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5">
                        <Calendar className="w-5 h-5 mr-2" /> Schedule a Visit
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
                              className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-red-500 focus-visible:border-red-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</Label>
                            <Input 
                              type="time" required 
                              value={appointmentData.time} onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                              className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-red-500 focus-visible:border-red-500"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message (Optional)</Label>
                          <Textarea 
                            placeholder="Any specific requirements?" rows={3}
                            value={appointmentData.message} onChange={(e) => setAppointmentData({...appointmentData, message: e.target.value})}
                            className="bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-red-500 focus-visible:border-red-500 resize-none p-4"
                          />
                        </div>
                        <Button type="submit" className="w-full h-14 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-lg mt-2 transition-all">
                          Confirm Booking
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Quick Inquiry Form */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Quick Inquiry</Label>
                    <Textarea 
                      placeholder="Hi, I am interested in this property..." 
                      value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)}
                      rows={3} className="bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-red-500 focus-visible:border-red-500 resize-none mb-4 p-4 text-sm"
                    />
                    <Button onClick={handleSendInquiry} variant="outline" className="w-full h-12 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-all">
                      <Mail className="w-4 h-4 mr-2" /> Send Message
                    </Button>
                  </div>
                </div>
              </div>

              {/* Safety Banner */}
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-3xl p-6 flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                   <Info className="w-4 h-4 text-blue-600"/>
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-900 mb-1.5 text-sm">Buyer Protection Guarantee</h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">
                     Never pay any token amount before verifying the property physically. ANK Realty ensures preliminary checks, but independent verification is strongly advised.
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
