import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  MapPin, IndianRupee, Layers, ImagePlus, CheckCircle, 
  ArrowRight, ArrowLeft, Loader2, X, Phone, Mail, Home
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

export default function PostPropertyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    city: '',
    state: '',
    property_type: 'apartment',
    category: 'sell',
    bhk: '',
    area: '',
    furnishing: 'unfurnished',
    amenities: [],
    latitude: null,
    longitude: null,
    status: 'pending'
  });

  // Image Upload States
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const amenitiesList = [
    'Parking', 'Gym', 'Swimming Pool', 'Garden', 'Security', 
    'Power Backup', 'Elevator', 'Club House', 'Kids Play Area'
  ];

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
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
    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Append text fields
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("price", parseFloat(formData.price));
      submitData.append("type", formData.category); 
      submitData.append("property_type", formData.property_type);
      submitData.append("status", formData.status);
      submitData.append("city", formData.city);
      submitData.append("state", formData.state);
      submitData.append("location", formData.location);
      submitData.append("area", formData.location); // Sending location as area for backend fallback
      submitData.append("size", parseFloat(formData.area)); 
      submitData.append("bedrooms", formData.bhk ? parseInt(formData.bhk) : 0);
      submitData.append("furnishing", formData.furnishing);

      // Append arrays
      formData.amenities.forEach(amenity => submitData.append("amenities", amenity));
      imageFiles.forEach(file => submitData.append("images[]", file));

      const response = await axios.post(`${API_BASE}/properties`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Property posted successfully! Pending admin approval.');
      navigate(`/`); 
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to post property');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.price || !formData.area)) {
      toast.error("Please fill all required fields marked with *");
      return;
    }
    if (step === 2 && (!formData.city || !formData.location || !formData.state)) {
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* 1. PREMIUM HERO SECTION */}
      <section className="bg-slate-900 text-white pt-32 pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-900 z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-400 text-sm font-bold tracking-wide mb-6 uppercase shadow-xl">
            <CheckCircle className="w-4 h-4" /> Zero Brokerage Fees
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg" data-testid="post-property-title">
            List Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Property.</span>
          </h1>
          <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Connect with millions of genuine buyers and tenants instantly. Post your property on ANK Realty for free in under 3 minutes.
          </p>
        </div>
      </section>

      {/* 2. MAIN FORM SECTION */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20 pb-24">
        
        {/* Progress Steps */}
        <div className="bg-white rounded-t-[2rem] p-8 pb-4 border-b border-slate-100 shadow-xl flex items-center justify-between px-10" data-testid="form-steps">
           <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 1 ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-slate-100 text-slate-400'}`}>1</div>
              <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Basic</span>
           </div>
           <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${step >= 2 ? 'bg-red-600' : 'bg-slate-100'}`}></div>
           <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 2 ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-slate-100 text-slate-400'}`}>2</div>
              <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Location</span>
           </div>
           <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${step >= 3 ? 'bg-red-600' : 'bg-slate-100'}`}></div>
           <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 3 ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-slate-100 text-slate-400'}`}>3</div>
              <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Images</span>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-b-[2rem] shadow-xl p-8 md:p-12 border border-t-0 border-slate-200" data-testid="post-property-form">
          
          {/* STEP 1: BASIC DETAILS */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4" data-testid="step-1">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">Basic Details</h2>
                <p className="text-slate-500">Tell us what you are offering to the market.</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Property Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="e.g., Luxury 3BHK Apartment in Downtown"
                    value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required
                    data-testid="property-title-input"
                    className="w-full h-14 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-lg font-medium rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Category *</Label>
                    <select 
                      id="category"
                      value={formData.category} onChange={(e) => handleChange('category', e.target.value)}
                      data-testid="property-category-select"
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 appearance-none font-medium text-slate-900 cursor-pointer"
                    >
                      <option value="buy">For Sale</option>
                      <option value="sell">For Sale (Owner)</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="property_type" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Property Type *</Label>
                    <select 
                      id="property_type"
                      value={formData.property_type} onChange={(e) => handleChange('property_type', e.target.value)}
                      data-testid="property-type-select"
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 appearance-none font-medium text-slate-900 cursor-pointer"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="house">House</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="price" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Price (₹) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <Input
                        id="price" type="number" placeholder="5000000" 
                        value={formData.price} onChange={(e) => handleChange('price', e.target.value)} required
                        data-testid="property-price-input"
                        className="w-full h-14 pl-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 font-bold text-lg rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="area" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Area (sqft) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <Input
                        id="area" type="number" placeholder="1500" 
                        value={formData.area} onChange={(e) => handleChange('area', e.target.value)} required
                        data-testid="property-area-input"
                        className="w-full h-14 pl-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 font-bold text-lg rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bhk" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">BHK</Label>
                    <Input 
                      id="bhk" type="number" placeholder="e.g. 2" 
                      value={formData.bhk} onChange={(e) => handleChange('bhk', e.target.value)} 
                      data-testid="property-bhk-input"
                      className="h-14 bg-slate-50 border-slate-200 focus:border-red-500 rounded-xl font-bold text-lg" 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the key features, neighborhood perks, and why someone should buy/rent this property..."
                    value={formData.description} onChange={(e) => handleChange('description', e.target.value)} required rows={5}
                    data-testid="property-description-textarea"
                    className="w-full p-4 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 rounded-xl resize-none font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <Button type="button" onClick={nextStep} className="h-14 px-8 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-lg shadow-xl group" data-testid="next-step-button">
                  Next Step <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & AMENITIES */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4" data-testid="step-2">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">Location & Amenities</h2>
                <p className="text-slate-500">Help buyers find and fall in love with your property.</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="city" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">City *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <Input
                        id="city" placeholder="e.g. Mumbai" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} required
                        data-testid="property-city-input"
                        className="w-full h-14 pl-12 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 font-bold rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">State *</Label>
                    <Input
                      id="state" placeholder="e.g. Maharashtra" value={formData.state} onChange={(e) => handleChange('state', e.target.value)} required
                      data-testid="property-state-input"
                      className="w-full h-14 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 font-bold rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Locality / Area *</Label>
                    <Input
                      id="location" placeholder="e.g. Andheri West" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} required
                      data-testid="property-location-input"
                      className="w-full h-14 bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-red-500/20 font-bold rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-4 block">Premium Amenities</Label>
                  <div className="flex flex-wrap gap-3">
                    {amenitiesList.map(amenity => {
                      const isSelected = formData.amenities.includes(amenity);
                      return (
                        <label
                          key={amenity}
                          className={`cursor-pointer px-4 py-2.5 rounded-xl border text-sm font-bold transition-all flex items-center ${
                            isSelected ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() => toggleAmenity(amenity)}
                            data-testid={`amenity-${amenity.toLowerCase().replace(/\s/g, '-')}`}
                          />
                          {isSelected && <CheckCircle className="w-4 h-4 mr-2" />}
                          {amenity}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-100">
                <Button type="button" onClick={prevStep} variant="outline" className="h-14 px-8 border-slate-200 text-slate-600 font-bold rounded-xl text-lg hover:bg-slate-50" data-testid="prev-step-button">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button type="button" onClick={nextStep} className="h-14 px-8 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-lg shadow-xl group" data-testid="next-step-button">
                  Next Step <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: IMAGES & SUBMIT */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4" data-testid="step-3">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">Visuals & Review</h2>
                <p className="text-slate-500">Listings with high-quality photos get 5x more leads.</p>
              </div>

              <div className="space-y-8">
                
                {/* Image Upload Area */}
                {imageFiles.length < 5 && (
                  <div className="border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center hover:border-red-500 hover:bg-red-50 transition-colors cursor-pointer relative group">
                    <input 
                      type="file" multiple accept="image/*" onChange={handleImageChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 bg-slate-100 group-hover:bg-red-100 rounded-full flex items-center justify-center mb-4 transition-colors">
                        <ImagePlus className="w-8 h-8 text-slate-400 group-hover:text-red-500" />
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
                            className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50 z-20"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md backdrop-blur-sm z-10">Cover</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Final Review Card */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 mt-8">
                  <h4 className="font-black text-xl text-slate-900 mb-6">Quick Review</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div>
                      <span className="block text-slate-500 mb-1 uppercase text-[10px] font-bold tracking-widest">Title</span>
                      <span className="font-bold text-slate-900 truncate block">{formData.title || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1 uppercase text-[10px] font-bold tracking-widest">Price</span>
                      <span className="font-bold text-slate-900 text-lg text-red-600">₹{parseFloat(formData.price || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1 uppercase text-[10px] font-bold tracking-widest">Location</span>
                      <span className="font-bold text-slate-900">{formData.city || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1 uppercase text-[10px] font-bold tracking-widest">Area</span>
                      <span className="font-bold text-slate-900">{formData.area || '-'} sqft</span>
                    </div>
                  </div>
                  
                  {formData.amenities.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <span className="block text-slate-500 mb-3 uppercase text-[10px] font-bold tracking-widest">Included Amenities</span>
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities.map(amenity => (
                          <span key={amenity} className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-md text-xs font-bold">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex justify-between pt-6 border-t border-slate-100">
                <Button type="button" onClick={prevStep} variant="outline" className="h-14 px-8 border-slate-200 text-slate-600 font-bold rounded-xl text-lg hover:bg-slate-50" data-testid="prev-step-button">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button type="submit" disabled={loading} className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg shadow-xl shadow-red-600/20 group" data-testid="submit-property-button">
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
                <li><Link to="/videos" className="hover:text-red-500 transition-colors">Video Tours</Link></li>
                <li><Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
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