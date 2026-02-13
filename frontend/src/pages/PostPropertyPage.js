import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
    images: [
      'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?w=800',
      'https://images.unsplash.com/photo-1746458258536-b9ee5db20a73?w=800'
    ],
    latitude: null,
    longitude: null
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        bhk: formData.bhk ? parseInt(formData.bhk) : null
      };
      
      const response = await axios.post(`${API}/properties`, submitData);
      toast.success('Property posted successfully!');
      navigate(`/properties/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to post property');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4" data-testid="post-property-title">
            Post Your Property
          </h1>
          <p className="text-gray-600 mb-8">Fill in the details to list your property</p>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8" data-testid="form-steps">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-[#C8102E] text-white' : 'bg-gray-200 text-gray-600'
              } font-bold`}>
                1
              </div>
              <div className={`h-1 w-20 ${step >= 2 ? 'bg-[#C8102E]' : 'bg-gray-200'}`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-[#C8102E] text-white' : 'bg-gray-200 text-gray-600'
              } font-bold`}>
                2
              </div>
              <div className={`h-1 w-20 ${step >= 3 ? 'bg-[#C8102E]' : 'bg-gray-200'}`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? 'bg-[#C8102E] text-white' : 'bg-gray-200 text-gray-600'
              } font-bold`}>
                3
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8" data-testid="post-property-form">
            {/* Step 1: Basic Details */}
            {step === 1 && (
              <div className="space-y-6" data-testid="step-1">
                <h2 className="text-2xl font-bold mb-4">Basic Details</h2>
                
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Luxury 3BHK Apartment in Downtown"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    data-testid="property-title-input"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    required
                    data-testid="property-description-textarea"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                      <SelectTrigger id="category" data-testid="property-category-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">For Sale</SelectItem>
                        <SelectItem value="sell">For Sale (Owner)</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="property_type">Property Type *</Label>
                    <Select value={formData.property_type} onValueChange={(v) => handleChange('property_type', v)}>
                      <SelectTrigger id="property_type" data-testid="property-type-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bhk">BHK</Label>
                    <Input
                      id="bhk"
                      type="number"
                      placeholder="2"
                      value={formData.bhk}
                      onChange={(e) => handleChange('bhk', e.target.value)}
                      data-testid="property-bhk-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="area">Area (sqft) *</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="1500"
                      value={formData.area}
                      onChange={(e) => handleChange('area', e.target.value)}
                      required
                      data-testid="property-area-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="5000000"
                      value={formData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      required
                      data-testid="property-price-input"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="furnishing">Furnishing Status</Label>
                  <Select value={formData.furnishing} onValueChange={(v) => handleChange('furnishing', v)}>
                    <SelectTrigger id="furnishing" data-testid="property-furnishing-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furnished">Furnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep} className="btn-primary" data-testid="next-step-button">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Location & Amenities */}
            {step === 2 && (
              <div className="space-y-6" data-testid="step-2">
                <h2 className="text-2xl font-bold mb-4">Location & Amenities</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      required
                      data-testid="property-city-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      required
                      data-testid="property-state-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location/Area *</Label>
                    <Input
                      id="location"
                      placeholder="Bandra West"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      required
                      data-testid="property-location-input"
                    />
                  </div>
                </div>

                <div>
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {amenitiesList.map(amenity => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 text-[#C8102E] rounded focus:ring-[#C8102E]"
                          data-testid={`amenity-${amenity.toLowerCase().replace(/\s/g, '-')}`}
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={prevStep} variant="outline" data-testid="prev-step-button">
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep} className="btn-primary" data-testid="next-step-button">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-6" data-testid="step-3">
                <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{formData.title}</h3>
                    <p className="text-gray-600 text-sm">{formData.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-bold">₹{parseFloat(formData.price || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-bold capitalize">{formData.property_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Area</p>
                      <p className="font-bold">{formData.area} sqft</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-bold">{formData.city}</p>
                    </div>
                  </div>

                  {formData.amenities.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities.map(amenity => (
                          <span key={amenity} className="bg-white px-3 py-1 rounded-sm text-sm">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={prevStep} variant="outline" data-testid="prev-step-button">
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    data-testid="submit-property-button"
                  >
                    {loading ? 'Submitting...' : 'Submit Property'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}