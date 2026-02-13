import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, Home, Heart, CheckCircle, TrendingUp } from 'lucide-react';
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
  const [category, setCategory] = useState('buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await axios.get(`${API}/properties/featured`);
      setFeaturedProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (location) params.append('city', location);
    if (propertyType) params.append('property_type', propertyType);
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1766603636562-531bb3e1dda8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc3MDk4ODk0NHww&ixlib=rb-4.1.0&q=85')`
        }}
        data-testid="hero-section"
      >
        <div className="hero-overlay" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6" data-testid="hero-title">
              Find Your Dream Home
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12" data-testid="hero-subtitle">
              The Red Carpet of Real Estate
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-sm shadow-2xl p-6 space-y-4" data-testid="search-widget">
              {/* Category Toggle */}
              <div className="flex justify-center mb-4">
                <div className="search-toggle">
                  <button
                    className={category === 'buy' ? 'active' : ''}
                    onClick={() => setCategory('buy')}
                    data-testid="category-buy-button"
                  >
                    Buy
                  </button>
                  <button
                    className={category === 'sell' ? 'active' : ''}
                    onClick={() => setCategory('sell')}
                    data-testid="category-sell-button"
                  >
                    Sell
                  </button>
                  <button
                    className={category === 'rent' ? 'active' : ''}
                    onClick={() => setCategory('rent')}
                    data-testid="category-rent-button"
                  >
                    Rent
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Location (City)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12"
                  data-testid="search-location-input"
                />
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-12" data-testid="search-property-type-select">
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
                  data-testid="search-submit-button"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-6 bg-gray-50" data-testid="featured-properties-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4" data-testid="featured-properties-title">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600">Handpicked luxury homes for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(0, 6).map((property) => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="property-card bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                data-testid={`property-card-${property.id}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.images[0] || 'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?w=600'}
                    alt={property.title}
                    className="property-card-image w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#C8102E] text-white px-4 py-1 rounded-sm text-sm font-bold">
                    {property.category.toUpperCase()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" data-testid={`property-title-${property.id}`}>
                    {property.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}, {property.city}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#C8102E]" data-testid={`property-price-${property.id}`}>
                      ₹{(property.price / 100000).toFixed(1)}L
                    </span>
                    <span className="text-sm text-gray-600">{property.area} sqft</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/properties">
              <button className="btn-primary" data-testid="view-all-properties-button">
                View All Properties
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6" data-testid="why-choose-us-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Why Choose ANK Realty</h2>
            <p className="text-lg text-gray-600">Your trusted partner in real estate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 transition-all rounded-lg">
              <Home className="h-12 w-12 text-[#C8102E] mb-4" />
              <h3 className="text-xl font-bold mb-3">Wide Selection</h3>
              <p className="text-gray-600">
                Access thousands of verified properties across India. From luxury villas to affordable apartments.
              </p>
            </div>

            <div className="p-8 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 transition-all rounded-lg">
              <CheckCircle className="h-12 w-12 text-[#C8102E] mb-4" />
              <h3 className="text-xl font-bold mb-3">Verified Listings</h3>
              <p className="text-gray-600">
                Every property is verified by our team. Buy, sell, or rent with complete confidence and transparency.
              </p>
            </div>

            <div className="p-8 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 transition-all rounded-lg">
              <TrendingUp className="h-12 w-12 text-[#C8102E] mb-4" />
              <h3 className="text-xl font-bold mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Our experienced agents guide you through every step. From search to closing the deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ANK Realty</h3>
              <p className="text-gray-400 text-sm">The Red Carpet of Real Estate</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/properties" className="block text-gray-400 hover:text-white transition-colors">
                  Properties
                </Link>
                <Link to="/post-property" className="block text-gray-400 hover:text-white transition-colors">
                  Post Property
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <div className="space-y-2 text-sm">
                <Link to="/properties?category=buy" className="block text-gray-400 hover:text-white transition-colors">
                  Buy
                </Link>
                <Link to="/properties?category=sell" className="block text-gray-400 hover:text-white transition-colors">
                  Sell
                </Link>
                <Link to="/properties?category=rent" className="block text-gray-400 hover:text-white transition-colors">
                  Rent
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">Email: info@ankrealty.com</p>
              <p className="text-gray-400 text-sm">Phone: +91 1234567890</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 ANK Realty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}