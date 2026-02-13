import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Heart, Filter } from 'lucide-react';
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
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function PropertyListingPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    property_type: searchParams.get('property_type') || '',
    city: searchParams.get('city') || '',
    min_price: '',
    max_price: '',
    bhk: '',
    furnishing: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const response = await axios.get(`${API}/properties?${params.toString()}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchProperties();
  };

  const addToFavorites = async (propertyId) => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    try {
      await axios.post(`${API}/favorites`, { property_id: propertyId });
      toast.success('Added to favorites');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to favorites');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-8" data-testid="listing-page-title">
            Browse Properties
          </h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8" data-testid="filter-panel">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-bold">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
                <SelectTrigger data-testid="filter-category-select">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.property_type} onValueChange={(v) => handleFilterChange('property_type', v)}>
                <SelectTrigger data-testid="filter-property-type-select">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="City"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                data-testid="filter-city-input"
              />

              <Input
                type="number"
                placeholder="Min Price"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                data-testid="filter-min-price-input"
              />

              <Input
                type="number"
                placeholder="Max Price"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                data-testid="filter-max-price-input"
              />
            </div>
            <div className="mt-4">
              <Button onClick={applyFilters} className="btn-primary" data-testid="apply-filters-button">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-600">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No properties found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="properties-grid">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="property-card bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                  data-testid={`property-card-${property.id}`}
                >
                  <Link to={`/properties/${property.id}`}>
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
                  </Link>
                  <div className="p-6">
                    <Link to={`/properties/${property.id}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-[#C8102E] transition-colors" data-testid={`property-title-${property.id}`}>
                        {property.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}, {property.city}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-[#C8102E]" data-testid={`property-price-${property.id}`}>
                        ₹{(property.price / 100000).toFixed(1)}L
                      </span>
                      <span className="text-sm text-gray-600">
                        {property.bhk ? `${property.bhk} BHK • ` : ''}{property.area} sqft
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => addToFavorites(property.id)}
                      data-testid={`favorite-button-${property.id}`}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}