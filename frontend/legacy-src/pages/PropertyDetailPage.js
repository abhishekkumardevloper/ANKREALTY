import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Bed, Bath, Maximize, Phone, Mail, Calendar, 
  Heart, IndianRupee, ShieldCheck, Share2, CheckCircle, Clock, Info
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

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      console.error('Error fetching property:', error);
      toast.error('Property not found');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center mt-20">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold tracking-widest uppercase">Loading Property...</p>
        </div>
      </div>
    );
  }

  if (!property) return null;

  // Image Fallback Logic
  const images = property.images && property.images.length > 0 
    ? property.images 
    : [
        property.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-200 pb-20">
      <Navbar />

      <div className="pt-28 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Header Section (Title & Actions) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider shadow-sm">
                For {property.category || property.type || 'Sale'}
              </span>
              {property.status === 'approved' && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3"/> Verified
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 leading-tight tracking-tight">
              {property.title}
            </h1>
            <p className="text-slate-500 text-lg flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-500"/> 
              {property.location || property.area}, {property.city}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
            <div className="text-3xl md:text-4xl font-black text-slate-900 flex items-center">
              ₹{Number(property.price).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button onClick={addToFavorites} variant="outline" className="flex-1 md:flex-none border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl h-12">
                <Heart className="w-5 h-5 mr-2" /> Save
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl h-12">
                <Share2 className="w-5 h-5 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN: Gallery & Details */}
          <div className="lg:w-2/3">
            
            {/* Main Image Gallery */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-200 mb-10">
              <div className="relative h-[300px] md:h-[500px] bg-slate-100">
                <img
                  src={images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 p-4 overflow-x-auto hide-scrollbar bg-white border-t border-slate-100">
                  {images.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-24 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer transition-all ${
                        selectedImage === idx ? 'ring-4 ring-red-600 scale-95' : 'hover:opacity-80'
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
               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                 <Bed className="w-8 h-8 text-red-500 mb-2"/>
                 <span className="font-black text-2xl text-slate-900">{property.bedrooms || property.bhk || '-'}</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Bedrooms</span>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                 <Bath className="w-8 h-8 text-blue-500 mb-2"/>
                 <span className="font-black text-2xl text-slate-900">{property.bathrooms || '-'}</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Bathrooms</span>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                 <Maximize className="w-8 h-8 text-green-500 mb-2"/>
                 <span className="font-black text-2xl text-slate-900">{property.size || property.area || '-'}</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sq Ft</span>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                 <Home className="w-8 h-8 text-purple-500 mb-2"/>
                 <span className="font-black text-lg text-slate-900 capitalize truncate w-full px-2">{property.furnishing || 'N/A'}</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Furnishing</span>
               </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-200 mb-10">
              <h2 className="text-2xl font-black text-slate-900 mb-6">About this Property</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
                {property.description?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-200 mb-10">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Premium Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center text-slate-700 font-bold">
                      <CheckCircle className="w-5 h-5 text-red-500 mr-3 shrink-0"/> {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Neighborhood</h2>
                <div className="w-full h-[300px] bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <MapPin className="w-10 h-10 mb-2 text-slate-300"/>
                    <p className="font-medium">Map view available in production</p>
                  </div>
                </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Action Card */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              
              {/* Contact Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <h3 className="text-xl font-black text-slate-900 mb-6">Interested in this property?</h3>
                
                {/* Agent Info */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xl shadow-md">
                     {property.owner_name ? property.owner_name.charAt(0).toUpperCase() : 'A'}
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 text-lg">{property.owner_name || 'ANK Agent'}</p>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Verified Seller</p>
                   </div>
                </div>

                <div className="space-y-4">
                  {/* Dialog for Scheduling Visit */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-red-600/20 transition-all">
                        <Calendar className="w-5 h-5 mr-2" /> Schedule a Visit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Book a Site Visit</DialogTitle>
                        <DialogDescription className="text-slate-500">
                          Choose a preferred date and time to view {property.title}.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleScheduleVisit} className="space-y-5 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</Label>
                            <Input 
                              type="date" required 
                              value={appointmentData.date} onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                              className="h-12 bg-slate-50 rounded-xl focus:border-red-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time</Label>
                            <Input 
                              type="time" required 
                              value={appointmentData.time} onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                              className="h-12 bg-slate-50 rounded-xl focus:border-red-500"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Message (Optional)</Label>
                          <Textarea 
                            placeholder="Any specific requests?" rows={3}
                            value={appointmentData.message} onChange={(e) => setAppointmentData({...appointmentData, message: e.target.value})}
                            className="bg-slate-50 rounded-xl focus:border-red-500 resize-none"
                          />
                        </div>
                        <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold rounded-xl">
                          Confirm Booking
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Quick Inquiry Form */}
                  <div className="pt-6 border-t border-slate-100">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Quick Inquiry</Label>
                    <Textarea 
                      placeholder="I am interested in this property..." 
                      value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)}
                      rows={3} className="bg-slate-50 rounded-xl focus:border-red-500 resize-none mb-3"
                    />
                    <Button onClick={handleSendInquiry} variant="outline" className="w-full h-12 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl">
                      <Mail className="w-4 h-4 mr-2" /> Send Message
                    </Button>
                  </div>
                </div>
              </div>

              {/* Safety Banner */}
              <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 flex items-start gap-4">
                 <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1"/>
                 <div>
                   <h4 className="font-bold text-slate-900 mb-1">Buyer Protection</h4>
                   <p className="text-xs text-slate-600 leading-relaxed">
                     Do not pay any token amount before verifying the property physically. ANK Realty ensures preliminary checks, but independent verification is advised.
                   </p>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed pr-4">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service, transparency, and expertise in the Indian real estate market.
              </p>
              <div className="flex space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Mail className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Phone className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/sell" className="hover:text-red-500 transition-colors">Sell Property</Link></li>
                <li><Link to="/rent" className="hover:text-red-500 transition-colors">Rent Property</Link></li>
                <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Apartments</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Villas</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Plots / Land</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Commercial</Link></li>
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