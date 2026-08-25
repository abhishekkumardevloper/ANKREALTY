// src/pages/PostPropertyPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext'; // Ensure you have this or standard token retrieval
import { 
  Building, MapPin, IndianRupee, Layers, Bed, Bath, 
  ImagePlus, CheckCircle, ArrowRight, ArrowLeft, Loader2, X, Phone, Mail, Home, ChevronRight
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE;

export default function PostPropertyPage() {
  const navigate = useNavigate();
  // Using custom auth context if available, otherwise fallback to localStorage
  const { user } = useAuth ? useAuth() : { user: null }; 
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    city: '',
    property_type: 'apartment',
    category: 'sell',
    bhk: '',
    bathrooms: '',
    area: '',
    furnishing: 'unfurnished',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (imageFiles.length + selectedFiles.length > 5) {
      toast.error("You can only upload a maximum of 5 images.");
      return;
    }

    const newFiles = [...imageFiles, ...selectedFiles];
    setImageFiles(newFiles);

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); 
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check Authentication
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to post a property.");
      navigate('/auth');
      return;
    }

    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Append text fields (Matching Backend FastAPI Form fields exactly)
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("price", Number(formData.price));
      submitData.append("category", formData.category); 
      submitData.append("property_type", formData.property_type);
      submitData.append("city", formData.city);
      submitData.append("location", formData.location);
      submitData.append("area", Number(formData.area)); 
      submitData.append("bhk", Number(formData.bhk) || 0);
      submitData.append("furnishing", formData.furnishing);

      // Append new images
      imageFiles.forEach((file) => {
        submitData.append("new_images", file);
      });

      // Send to protected API route
      await axios.post(`${API_BASE}/properties`, submitData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Property submitted successfully! Pending admin approval.');
      navigate(`/dashboard`); // Or wherever you want them to go after posting
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to post property. Please check the fields.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.price || !formData.area)) {
      toast.error("Please fill all required fields marked with *");
      return;
    }
    if (step === 2 && (!formData.city || !formData.location)) {
      toast.error("Please provide complete location details.");
      return;
    }
    setStep(prev => Math.min(prev + 1, 3));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#D4AF37]/30">
      <Navbar />

      {/* 1. PREMIUM HERO SECTION */}
      <section className="bg-slate-900 text-white pt-32 pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-900 z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-sm font-bold tracking-wide mb-6 uppercase shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <CheckCircle className="w-4 h-4" /> Zero Brokerage Fees
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg">
            List Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">Property.</span>
          </h1>
          <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Connect with millions of genuine buyers and tenants instantly. Post your property on ANK Realty for free in under 3 minutes.
          </p>
        </div>
      </section>

      {/* 2. MAIN FORM SECTION */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20 pb-24">
        
        {/* Progress Steps */}
        <div className="bg-white rounded-t-[2rem] p-8 pb-4 border-b border-slate-100 shadow-xl flex items-center justify-between px-10">
           <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 1 ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/30' : 'bg-slate-100 text-slate-400'}`}>1</div>
              <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Basic</span>
           </div>
           <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${step >= 2 ? 'bg-[#8B0000]' : 'bg-slate-100'}`}></div>
           <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 2 ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/30' : 'bg-slate-100 text-slate-400'}`}>2</div>
              <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Location</span>
           </div>
           <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${step >= 3 ? 'bg-[#8B0000]' : 'bg-slate-100'}`}></div>
           <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 3 ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/30' : 'bg-slate-100 text-slate-400'}`}>3</div>
              <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Images</span>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-b-[2rem] shadow-xl p-8 md:p-12 border border-t-0 border-slate-200">
          
          {/* STEP 1: BASIC DETAILS */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">Property Details</h2>
                <p className="text-slate-500">Tell us what you are offering to the market.</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Property Title <span className="text-[#8B0000]">*</span></Label>
                  <Input
                    placeholder="e.g., Luxury 3BHK Apartment in Downtown"
                    value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required
                    className="w-full h-14 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 text-lg font-medium rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">I want to...</Label>
                    <select 
                      value={formData.category} onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 appearance-none font-medium text-slate-900"
                    >
                      <option value="sell">Sell this property</option>
                      <option value="resale">Resale this property</option>
                      <option value="rent">Rent this property out</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Property Type</Label>
                    <select 
                      value={formData.property_type} onChange={(e) => handleChange('property_type', e.target.value)}
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 appearance-none font-medium text-slate-900"
                    >
                      <option value="apartment">Apartment / Flat</option>
                      <option value="villa">Villa / House</option>
                      <option value="plot">Plot / Land</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Price (₹) <span className="text-[#8B0000]">*</span></Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-4 w-5 h-5 text-[#D4AF37]" />
                      <Input
                        type="number" placeholder="5000000" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} required
                        className="w-full h-14 pl-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-bold text-lg rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Area (Sq.Ft) <span className="text-[#8B0000]">*</span></Label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-4 w-5 h-5 text-[#D4AF37]" />
                      <Input
                        type="number" placeholder="1500" value={formData.area} onChange={(e) => handleChange('area', e.target.value)} required
                        className="w-full h-14 pl-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-bold text-lg rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Furnishing</Label>
                    <select 
                      value={formData.furnishing} onChange={(e) => handleChange('furnishing', e.target.value)}
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 appearance-none font-medium text-slate-900"
                    >
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="furnished">Fully Furnished</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   <div>
                     <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Bedrooms</Label>
                     <Input type="number" placeholder="0" value={formData.bhk} onChange={(e) => handleChange('bhk', e.target.value)} className="h-14 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-bold text-center text-lg" />
                   </div>
                   <div>
                     <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Bathrooms</Label>
                     <Input type="number" placeholder="0" value={formData.bathrooms} onChange={(e) => handleChange('bathrooms', e.target.value)} className="h-14 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl font-bold text-center text-lg" />
                   </div>
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Detailed Description</Label>
                  <Textarea
                    placeholder="Describe the key features, neighborhood perks, and why someone should buy/rent this property..."
                    value={formData.description} onChange={(e) => handleChange('description', e.target.value)} required rows={5}
                    className="w-full p-4 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl resize-none font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <Button type="button" onClick={nextStep} className="h-14 px-8 bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl text-lg shadow-xl shadow-[#8B0000]/30 group transition-all">
                  Next Step <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">Location Details</h2>
                <p className="text-slate-500">Help buyers find your property on the map.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">City <span className="text-[#8B0000]">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#D4AF37]" />
                      <Input
                        placeholder="e.g. Mumbai" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} required
                        className="w-full h-14 pl-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-bold rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Locality / Area <span className="text-[#8B0000]">*</span></Label>
                    <Input
                      placeholder="e.g. Andheri West" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} required
                      className="w-full h-14 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-bold rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-100">
                <Button type="button" onClick={prevStep} variant="outline" className="h-14 px-8 border-slate-200 text-slate-600 font-bold rounded-xl text-lg hover:bg-slate-50 hover:text-[#8B0000] transition-colors">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button type="button" onClick={nextStep} className="h-14 px-8 bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl text-lg shadow-xl shadow-[#8B0000]/30 group transition-all">
                  Next Step <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: IMAGES & SUBMIT */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">Visuals</h2>
                <p className="text-slate-500">Listings with high-quality photos get 5x more leads.</p>
              </div>

              <div className="space-y-6">
                
                {/* Image Upload Area */}
                {imageFiles.length < 5 && (
                  <div className="border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors cursor-pointer relative group">
                    <input 
                      type="file" multiple accept="image/*" onChange={handleImageChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 bg-slate-100 group-hover:bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4 transition-colors">
                        <ImagePlus className="w-8 h-8 text-slate-400 group-hover:text-[#D4AF37]" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Click or drag images here</h4>
                      <p className="text-slate-500 text-sm">Upload up to 5 clear photos (JPEG, PNG). First image will be the cover.</p>
                    </div>
                  </div>
                )}

                {/* Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Selected Photos ({imageFiles.length}/5)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {imagePreviews.map((src, index) => (
                        <div key={index} className="relative group rounded-2xl overflow-hidden aspect-square border border-slate-200 bg-slate-100 shadow-sm">
                          <img src={src} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-white/90 text-[#8B0000] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-[#D4AF37] text-slate-900 text-[10px] uppercase font-bold px-2 py-1 rounded-md backdrop-blur-sm">Cover</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Final Review Card */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-[#D4AF37]/20 mt-8 shadow-sm">
                  <h4 className="font-black text-slate-900 mb-4">Quick Review</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="block text-slate-500 mb-1 uppercase text-[10px] font-bold tracking-widest">Title</span><span className="font-bold text-slate-900 truncate block">{formData.title || '-'}</span></div>
                    <div><span className="block text-slate-500 mb-1 uppercase text-[10px] font-bold tracking-widest">Price</span><span className="font-bold text-[#8B0000]">₹{Number(formData.price || 0).toLocaleString('en-IN')}</span></div>
                    <div><span className="block text-slate-500 mb-1 uppercase text-[10px] font-bold tracking-widest">Location</span><span className="font-bold text-slate-900">{formData.city || '-'}</span></div>
                    <div><span className="block text-slate-500 mb-1 uppercase text-[10px] font-bold tracking-widest">Type</span><span className="font-bold text-slate-900 capitalize">{formData.category} / {formData.property_type}</span></div>
                  </div>
                </div>

              </div>

              <div className="flex justify-between pt-6 border-t border-slate-100">
                <Button type="button" onClick={prevStep} variant="outline" className="h-14 px-8 border-slate-200 text-slate-600 font-bold rounded-xl text-lg hover:bg-slate-50 hover:text-[#8B0000] transition-colors">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button type="submit" disabled={loading} className="h-14 px-8 bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl text-lg shadow-xl shadow-[#8B0000]/30 group transition-all">
                  {loading ? (
                    <><Loader2 className="animate-spin mr-2 w-5 h-5" /> Submitting...</>
                  ) : (
                    <>Publish Listing <CheckCircle className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#050505] text-white pt-20 pb-10 px-6 border-t-[6px] border-[#8B0000] mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 pr-4">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#D4AF37]">ANK <span className="text-white">REALTY</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service, transparency, and expertise in the Indian real estate market.
              </p>
              <div className="flex space-x-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer group"><Mail className="w-4 h-4 group-hover:scale-110 transition-transform"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#8B0000] hover:border-[#8B0000] text-[#D4AF37] hover:text-white transition-all cursor-pointer group"><Phone className="w-4 h-4 group-hover:scale-110 transition-transform"/></div>
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
                <li><Link to="/buy" className="hover:text-[#D4AF37] flex items-center transition-colors"><ChevronRight className="w-3.5 h-3.5 mr-2 text-[#8B0000]"/> Commercial Space</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base mb-6 text-white uppercase tracking-widest text-[11px]">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium text-sm">
                <div className="flex items-start bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <MapPin className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs"> 207, JS Arcade, Sec-18, Noida, Uttar Pradesh - 201301</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Mail className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs">info@ankrealty.com</p>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                  <Phone className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" /> 
                  <p className="text-xs">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
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
