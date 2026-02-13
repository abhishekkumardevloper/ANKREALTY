import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, CheckCircle, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function HomePage() {
  const navigate = useNavigate();

  const [category, setCategory] = useState('buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);

  /**
   * ✅ SAFE FETCH FUNCTION
   */
  const fetchFeaturedProperties = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/properties/featured`);
      setFeaturedProperties(response.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setFeaturedProperties([]);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties]);

  /**
   * ✅ SAFE NAVIGATION (NO FULL PAGE RELOAD)
   */
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (category) params.append('category', category);
    if (location) params.append('city', location);
    if (propertyType) params.append('property_type', propertyType);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1766603636562-531bb3e1dda8?crop=entropy&cs=srgb&fm=jpg&q=85')`
        }}
      >
        <div className="hero-overlay" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Find Your Dream Home
            </h1>

            <div className="bg-white rounded-sm shadow-2xl p-6 space-y-4">

              {/* CATEGORY */}
              <div className="flex justify-center mb-4">
                <div className="search-toggle">
                  {['buy','sell','rent'].map(type=>(
                    <button
                      key={type}
                      className={category===type?'active':''}
                      onClick={()=>setCategory(type)}
                    >
                      {type.charAt(0).toUpperCase()+type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Location (City)"
                  value={location}
                  onChange={(e)=>setLocation(e.target.value)}
                  className="h-12"
                />

                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleSearch}
                  className="md:col-span-2 h-12 btn-primary"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Featured Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(0,6).map((property)=>(
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="property-card bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?w=600'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#C8102E] text-white px-4 py-1 rounded-sm text-sm font-bold">
                    {property.category?.toUpperCase()}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}, {property.city}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#C8102E]">
                      ₹{((property.price||0)/100000).toFixed(1)}L
                    </span>
                    <span className="text-sm text-gray-600">
                      {property.area} sqft
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 rounded-lg">
            <Home className="h-12 w-12 text-[#C8102E] mb-4" />
            <h3 className="text-xl font-bold mb-3">Wide Selection</h3>
            <p className="text-gray-600">Thousands of verified properties.</p>
          </div>

          <div className="p-8 bg-gray-50 rounded-lg">
            <CheckCircle className="h-12 w-12 text-[#C8102E] mb-4" />
            <h3 className="text-xl font-bold mb-3">Verified Listings</h3>
            <p className="text-gray-600">Transparent and trusted deals.</p>
          </div>

          <div className="p-8 bg-gray-50 rounded-lg">
            <TrendingUp className="h-12 w-12 text-[#C8102E] mb-4" />
            <h3 className="text-xl font-bold mb-3">Expert Support</h3>
            <p className="text-gray-600">Guidance from start to finish.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
