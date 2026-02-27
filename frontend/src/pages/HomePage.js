import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, Home, Heart, CheckCircle, TrendingUp, 
  ArrowRight, Star, Users, Building, Mail, FileText, Key
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

// Environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

// Enhanced mock data featuring realistic local and premium properties
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Bajrang Vatika",
    location: "Premium Sector",
    city: "Patna",
    price: 4500000,
    area: 1200,
    category: "buy",
    type: "plot",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: 2,
    title: "Elysium Heights Penthouse",
    location: "Bandra West",
    city: "Mumbai",
    price: 85000000,
    area: 3200,
    category: "buy",
    type: "apartment",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: 3,
    title: "Corporate Tech Park",
    location: "Cyber City",
    city: "Gurgaon",
    price: 150000000,
    area: 5200,
    category: "rent",
    type: "commercial",
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"]
  }
];

const REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Homebuyer",
    text: "ANK Realty made finding our dream plot effortless. The verification process gave us total peace of mind.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Property Investor",
    text: "I've sold three properties through ANK. Their market analysis is spot on and the process is incredibly transparent.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    name: "Anita Desai",
    role: "Commercial Tenant",
    text: "Found a beautiful office space in a prime neighborhood within 2 days. Highly recommended for rentals!",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  }
];

export default function HomePage() {
  const [category, setCategory] = useState('buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await axios.get(`${API}/properties/featured`);
      if (response.data && response.data.length > 0) {
        setFeaturedProperties(response.data);
      } else {
        setFeaturedProperties(MOCK_PROPERTIES);
      }
    } catch (error) {
      console.warn('Backend not connected, using mock data for display.');
      setFeaturedProperties(MOCK_PROPERTIES);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-100 selection:text-red-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 transform scale-105 transition-transform duration-[20s] hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/90 z-10" />

        <div className="relative z-20 w-full max-w-5xl px-4 md:px-6 text-center mt-16">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold tracking-wide">
            🏆 Premium Real Estate Destination
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
            Find a Place <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">You'll Love to Live</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-2xl mx-auto font-light drop-shadow-md">
            From exclusive premium plots to cozy family homes, we bring the red carpet experience to your property search.
          </p>

          {/* Search Widget - Glassmorphism */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto w-full transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-wrap justify-center gap-2 mb-6 border-b border-white/20 pb-4">
              {['buy', 'rent', 'sell'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2.5 text-sm font-bold uppercase tracking-wide rounded-full transition-all whitespace-nowrap ${
                    category === cat 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                      : 'bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 relative w-full group">
                 <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                 <Input
                  placeholder="City, Locality, or Project..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 pl-12 border-0 bg-white/90 focus:bg-white w-full text-slate-900 rounded-xl"
                />
              </div>
              <div className="md:col-span-4 relative w-full group">
                <Home className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 z-10 group-hover:text-red-500 transition-colors" />
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-12 pl-12 border-0 bg-white/90 focus:bg-white w-full text-slate-900 rounded-xl">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plot">Land / Plot</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="commercial">Commercial Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-4 w-full">
                <Button
                  onClick={handleSearch}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-red-600/40 transition-all"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-white py-12 border-b border-slate-100 hidden md:block relative z-20 -mt-8 mx-6 rounded-2xl shadow-xl max-w-7xl lg:mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
          <div className="group">
             <p className="text-4xl font-black text-slate-900 group-hover:text-red-600 transition-colors">12k+</p>
             <p className="text-slate-500 text-sm uppercase tracking-wider mt-2 font-semibold">Properties Listed</p>
          </div>
          <div className="group">
             <p className="text-4xl font-black text-slate-900 group-hover:text-red-600 transition-colors">8.5k+</p>
             <p className="text-slate-500 text-sm uppercase tracking-wider mt-2 font-semibold">Happy Customers</p>
          </div>
          <div className="group">
             <p className="text-4xl font-black text-slate-900 group-hover:text-red-600 transition-colors">100%</p>
             <p className="text-slate-500 text-sm uppercase tracking-wider mt-2 font-semibold">Verified Listings</p>
          </div>
          <div className="group">
             <p className="text-4xl font-black text-slate-900 group-hover:text-red-600 transition-colors">24/7</p>
             <p className="text-slate-500 text-sm uppercase tracking-wider mt-2 font-semibold">Expert Support</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (NEW SECTION) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto">Your journey to finding the perfect property, simplified into three easy steps.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-200 z-0"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mb-6 border-4 border-slate-50">
                <Search className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Search & Discover</h3>
              <p className="text-slate-600 text-center">Browse through our extensive list of verified plots, homes, and commercial spaces.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mb-6 border-4 border-slate-50">
                <FileText className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Visit & Verify</h3>
              <p className="text-slate-600 text-center">Schedule a site visit with our experts and review all legal documentation seamlessly.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-red-600 rounded-full shadow-xl shadow-red-600/30 flex items-center justify-center mb-6 border-4 border-red-50">
                <Key className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Close the Deal</h3>
              <p className="text-slate-600 text-center">Get the keys to your new property with our transparent and secure closing process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">Featured Properties</h2>
              <p className="text-lg text-slate-600">Handpicked luxury homes and premium plots exclusively for you</p>
            </div>
            <Link to="/properties" className="hidden md:flex items-center text-red-600 font-bold hover:text-red-700 transition-colors group">
              View All Properties <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(0, 6).map((property, index) => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={property.images[0] || 'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?w=600'}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                    Featured
                  </div>
                  <button className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all shadow-sm">
                    <Heart className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6 pt-16">
                    <p className="text-white font-bold text-lg flex items-center">
                       <MapPin className="h-4 w-4 mr-1 text-red-500" /> {property.city}
                    </p>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-2">
                    Premium {property.type} located in the heart of {property.location}.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Price</p>
                        <span className="text-2xl font-black text-slate-900">
                        ₹{(property.price / 100000).toFixed(1)}L
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Area</p>
                        <span className="text-lg font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg">{property.area} <span className="text-sm font-normal">sqft</span></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50 h-12 text-lg">View All Properties</Button>
          </div>
        </div>
      </section>

      {/* EXPLORE CITIES SECTION */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Explore Top Cities</h2>
              <p className="text-lg text-slate-600">Find properties in India's most sought-after locations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[450px]">
                {/* Mumbai */}
                <div className="md:col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer h-72 md:h-full shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80" 
                      alt="Mumbai" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent group-hover:from-slate-900/90 transition-all" />
                    <div className="absolute bottom-8 left-8 text-white">
                        <h3 className="text-3xl font-black mb-1">Mumbai</h3>
                        <p className="text-md opacity-90 font-medium">2,400+ Properties</p>
                    </div>
                </div>

                {/* Bangalore */}
                <div className="relative rounded-3xl overflow-hidden group cursor-pointer h-72 md:h-full shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80" 
                      alt="Bangalore" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent group-hover:from-slate-900/90 transition-all" />
                    <div className="absolute bottom-8 left-8 text-white">
                        <h3 className="text-2xl font-black mb-1">Bangalore</h3>
                        <p className="text-sm opacity-90 font-medium">1,800+ Properties</p>
                    </div>
                </div>

                {/* Delhi NCR */}
                <div className="relative rounded-3xl overflow-hidden group cursor-pointer h-72 md:h-full shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80" 
                      alt="Delhi" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent group-hover:from-slate-900/90 transition-all" />
                    <div className="absolute bottom-8 left-8 text-white">
                        <h3 className="text-2xl font-black mb-1">Delhi NCR</h3>
                        <p className="text-sm opacity-90 font-medium">1,200+ Properties</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Why Trust ANK Realty?</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">We don't just sell property; we sell the experience of finding your perfect space.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-slate-800/50 backdrop-blur-sm rounded-3xl hover:bg-slate-800 transition-all duration-300 border border-slate-700/50 hover:-translate-y-2">
              <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mb-8 border border-red-500/20">
                <Building className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium Inventory</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Access thousands of verified properties across India, from exclusive plots to modern city apartments.
              </p>
            </div>

            <div className="p-10 bg-slate-800/50 backdrop-blur-sm rounded-3xl hover:bg-slate-800 transition-all duration-300 border border-slate-700/50 hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20">
                 <CheckCircle className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">100% Verified Listings</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                No fake listings. Every property is physically verified by our ground team to ensure complete transparency.
              </p>
            </div>

            <div className="p-10 bg-slate-800/50 backdrop-blur-sm rounded-3xl hover:bg-slate-800 transition-all duration-300 border border-slate-700/50 hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mb-8 border border-green-500/20">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Agents</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Get a dedicated relationship manager who guides you through legal documentation, loans, and closing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-slate-900 mb-6">Client Stories</h2>
                <div className="flex justify-center space-x-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />)}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {REVIEWS.map((review) => (
                    <div key={review.id} className="bg-slate-50 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative mt-8 md:mt-0">
                        <div className="absolute -top-6 left-8 text-7xl text-red-200 font-serif leading-none">"</div>
                        <p className="text-slate-600 text-lg italic mb-8 relative z-10 pt-4 leading-relaxed">{review.text}</p>
                        <div className="flex items-center pt-6 border-t border-slate-200">
                            <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full object-cover mr-4 shadow-sm" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">{review.name}</h4>
                                <p className="text-sm text-red-600 font-semibold uppercase tracking-wide">{review.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="py-12 px-6 bg-white pb-24">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-red-600 to-red-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
            
            <div className="relative z-10 p-12 md:p-16 text-center md:text-left md:flex items-center justify-between">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h2 className="text-4xl font-black text-white mb-4 leading-tight">Get the Hottest Deals First</h2>
                    <p className="text-red-100 text-xl font-light">Subscribe to our newsletter and get exclusive access to premium plots and homes before they hit the market.</p>
                </div>
                <div className="md:w-5/12 flex flex-col sm:flex-row gap-3">
                    <Input placeholder="Enter your email address" className="bg-white/10 border-white/20 text-white placeholder:text-red-200 h-14 rounded-xl text-lg focus:bg-white/20 transition-colors" />
                    <Button className="bg-white text-red-700 hover:bg-slate-100 font-bold h-14 px-8 rounded-xl shadow-xl text-lg shrink-0">
                      Subscribe
                    </Button>
                </div>
            </div>
        </div>
      </section>

      {/* FOOTER - Remains largely the same but with tightened typography */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed pr-4">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service, transparency, and expertise in the Indian real estate market.
              </p>
              <div className="flex space-x-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer"><Mail className="w-5 h-5"/></div>
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer"><MapPin className="w-5 h-5"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link to="/properties" className="hover:text-red-500 transition-colors">All Properties</Link></li>
                <li><Link to="/post-property" className="hover:text-red-500 transition-colors">Post a Property</Link></li>
                <li><Link to="/agents" className="hover:text-red-500 transition-colors">Find an Agent</Link></li>
                <li><Link to="/blog" className="hover:text-red-500 transition-colors">Real Estate Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link to="/properties?category=buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/properties?type=plot" className="hover:text-red-500 transition-colors">Land / Plots</Link></li>
                <li><Link to="/properties?category=rent" className="hover:text-red-500 transition-colors">Rent Property</Link></li>
                <li><Link to="/commercial" className="hover:text-red-500 transition-colors">Commercial Space</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium">
                <p className="flex items-start"><MapPin className="w-6 h-6 mr-3 text-red-600 shrink-0"/> 123 Business Avenue, Tech Park, Mumbai, 400001</p>
                <p className="flex items-center"><Mail className="w-6 h-6 mr-3 text-red-600 shrink-0"/> info@ankrealty.com</p>
                <p className="flex items-center"><Home className="w-6 h-6 mr-3 text-red-600 shrink-0"/> +91 98765 43210</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
