import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Heart, Filter, Search, CheckCircle, 
  BedDouble, Bath, Layers, Phone, Mail, Loader2, ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';
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
import { useAuth } from '../contexts/AuthContext'; // Ensure this path is correct
import { toast } from 'sonner';

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api";

export default function PropertyListingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // FIX: Directly call the hook at the top level
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

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
      params.append('limit', '100'); 

      const response = await axios.get(`${API_BASE}/properties?${params.toString()}`);
      const apiProps = Array.isArray(response.data) 
        ? response.data.filter(p => p.status?.toLowerCase() === 'approved' || p.status?.toLowerCase() === 'active') 
        : [];
      
      setProperties(apiProps);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchProperties();
  };

  const addToFavorites = async (propertyId, e) => {
    e.stopPropagation(); 
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/auth');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/favorites`, { property_id: propertyId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Added to favorites');
    } catch (error) {
      toast.error('Failed to add to favorites');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'On Request';
    const num = Number(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const getMainImage = (property) => {
    if (property.images && property.images.length > 0) return property.images[0];
    return "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      {/* ... Rest of your component UI code ... */}
      <section className="bg-slate-900 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center md:text-left">
           <h1 className="text-4xl md:text-5xl font-black text-white">Find Your <span className="text-[#D4AF37]">Perfect Property</span></h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8 flex-1">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
               <h2 className="font-bold mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h2>
               <div className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase font-bold text-slate-400">City</Label>
                    <Input value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} placeholder="Search city..." />
                  </div>
                  <Button onClick={applyFilters} className="w-full bg-[#8B0000] text-white">Apply</Button>
               </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="lg:w-3/4">
            {loading ? <Loader2 className="animate-spin mx-auto mt-20" /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map(property => (
                   <div key={property.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200" onClick={() => navigate(`/property/${property.id}`, { state: { property } })}>
                      <img src={getMainImage(property)} alt={property.title} className="h-48 w-full object-cover" />
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{property.title}</h3>
                        <p className="text-slate-500 text-sm">{property.city}</p>
                        <div className="mt-4 flex justify-between items-center">
                           <span className="font-black text-xl">{formatCurrency(property.price)}</span>
                           <Button size="sm" variant="outline" onClick={(e) => addToFavorites(property.id, e)}>Save</Button>
                        </div>
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
