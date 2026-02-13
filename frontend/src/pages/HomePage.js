import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, Home, Heart, CheckCircle, TrendingUp, 
  ArrowRight, Star, Users, Building, Mail 
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

// Environment variables (Safe fallback if undefined)
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

// Mock data to ensure page looks full even without backend connection
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Elysium Heights Penthouse",
    location: "Bandra West",
    city: "Mumbai",
    price: 85000000,
    area: 3200,
    category: "buy",
    type: "apartment",
    images: ["https://images.unsplash.com/photo-1600596542815-e32c215dd86b?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: 2,
    title: "Serene Palms Villa",
    location: "Whitefield",
    city: "Bangalore",
    price: 42000000,
    area: 4500,
    category: "sell",
    type: "villa",
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: 3,
    title: "Corporate Tech Park",
    location: "Cyber City",
    city: "Gurgaon",
    price: 150000000,
    area: 1200,
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
    text: "ANK Realty made finding our dream villa effortless. The verification process gave us total peace of mind.",
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
    role: "Tenant",
    text: "Found a beautiful apartment in a safe neighborhood within 2 days. Highly recommended for rentals!",
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
      // Attempt to fetch from API
      const response = await axios.get(`${API}/properties/featured`);
      if (response.data && response.data.length > 0) {
        setFeaturedProperties(response.data);
      } else {
        // Fallback to mock data if API is empty or fails
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-red-100 selection:text-red-900">
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="relative h-[650px] flex items-center justify-center overflow-hidden"
        data-testid="hero-section"
      >
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 z-0 transform scale-105 transition-transform duration-[20s] hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />

        <div className="relative z-20 w-full max-w-5xl px-6 text-center mt-10">
          <span className="inline-block py-1 px-3 rounded-full bg-red-600/90 text-white text-xs font-bold tracking-wider mb-6 animate-fade-in-up">
            #1 REAL ESTATE PLATFORM
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-lg" data-testid="hero-title">
            Find a Place <br/> You'll Love to Live
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto font-light" data-testid="hero-subtitle">
            From luxury penthouses to cozy family homes, we bring the red carpet experience to your property search.
          </p>

          {/* Search Widget */}
         <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 md:p-6 max-w-4xl mx-auto w-full transform hover:-translate-y-1 transition-all duration-300" data-testid="search-widget">
  {/* Tabs - Fixed Overflow with flex-wrap */}
  <div className="flex flex-wrap justify-center gap-2 mb-6 border-b border-gray-200 pb-2">
    {['buy', 'rent', 'sell'].map((cat) => (
      <button
        key={cat}
        onClick={() => setCategory(cat)}
        className={`px-4 md:px-6 py-2 text-sm font-bold uppercase tracking-wide transition-all border-b-2 whitespace-nowrap ${
          category === cat 
            ? 'border-red-600 text-red-600' 
            : 'border-transparent text-gray-500 hover:text-gray-800'
        }`}
        data-testid={`category-${cat}-button`}
      >
        {cat}
      </button>
    ))}
  </div>

  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
    <div className="md:col-span-4 relative w-full">
        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <Input
        placeholder="Enter City, Locality..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="h-12 pl-10 border-gray-200 bg-gray-50 focus:bg-white w-full"
        data-testid="search-location-input"
      />
    </div>
    <div className="md:col-span-4 relative w-full">
      <Home className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 z-10" />
      <Select value={propertyType} onValueChange={setPropertyType}>
        <SelectTrigger className="h-12 pl-10 border-gray-200 bg-gray-50 focus:bg-white w-full" data-testid="search-property-type-select">
          <SelectValue placeholder="Property Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apartment">Apartment</SelectItem>
          <SelectItem value="villa">Villa</SelectItem>
          <SelectItem value="house">Independent House</SelectItem>
          <SelectItem value="commercial">Commercial Space</SelectItem>
          <SelectItem value="plot">Land / Plot</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="md:col-span-4 w-full">
      <Button
        onClick={handleSearch}
        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg hover:shadow-red-600/30 transition-all"
        data-testid="search-submit-button"
      >
        <Search className="mr-2 h-5 w-5" />
        Search
      </Button>
    </div>
  </div>
</div>
</div>
</section>

      {/* FEATURED PROPERTIES */}
      <section className="py-20 px-6 bg-gray-50" data-testid="featured-properties-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2" data-testid="featured-properties-title">
                Featured Properties
              </h2>
              <p className="text-lg text-gray-600">Handpicked luxury homes exclusively for you</p>
            </div>
            <Link to="/properties" className="hidden md:flex items-center text-red-600 font-bold hover:text-red-700 transition-colors">
              View All Properties <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(0, 6).map((property) => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                data-testid={`property-card-${property.id}`}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={property.images[0] || 'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?w=600'}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                    {property.category}
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all">
                    <Heart className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                    <p className="text-white font-bold text-lg flex items-center">
                       <MapPin className="h-4 w-4 mr-1 text-red-500" /> {property.city}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1" data-testid={`property-title-${property.id}`}>
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-1">
                    {property.location}, {property.city}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">Price</p>
                        <span className="text-2xl font-black text-gray-900" data-testid={`property-price-${property.id}`}>
                        ₹{(property.price / 100000).toFixed(1)}L
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-medium uppercase">Area</p>
                        <span className="text-lg font-bold text-gray-700">{property.area} <span className="text-sm font-normal">sqft</span></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="w-full border-red-600 text-red-600">View All Properties</Button>
          </div>
        </div>
      </section>

      {/* EXPLORE CITIES SECTION (New Content) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Explore Top Cities</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[500px] md:h-[400px]">
                {/* Mumbai */}
                <div className="md:col-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80" alt="Mumbai" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl font-bold">Mumbai</h3>
                        <p className="text-sm opacity-90">2,400+ Properties</p>
                    </div>
                </div>
                {/* Bangalore */}
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80" alt="Bangalore" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl font-bold">Bangalore</h3>
                        <p className="text-sm opacity-90">1,800+ Properties</p>
                    </div>
                </div>
                {/* Delhi */}
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1587474265402-2e63a4e96843?auto=format&fit=crop&w=800&q=80" alt="Delhi" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl font-bold">Delhi NCR</h3>
                        <p className="text-sm opacity-90">1,200+ Properties</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 px-6 bg-gray-900 text-white" data-testid="why-choose-us-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Why Trust ANK Realty?</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">We don't just sell houses; we sell the experience of finding your home.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-all duration-300 border border-gray-700">
              <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center mb-6">
                <Building className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Inventory</h3>
              <p className="text-gray-400 leading-relaxed">
                Access thousands of verified properties across India, from exclusive luxury villas to modern city apartments.
              </p>
            </div>

            <div className="p-8 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-all duration-300 border border-gray-700">
              <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                 <CheckCircle className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Verified Listings</h3>
              <p className="text-gray-400 leading-relaxed">
                No fake listings. Every property is physically verified by our ground team to ensure complete transparency.
              </p>
            </div>

            <div className="p-8 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-all duration-300 border border-gray-700">
              <div className="w-14 h-14 bg-green-600/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dedicated Relationship Managers</h3>
              <p className="text-gray-400 leading-relaxed">
                Get a dedicated expert who guides you through legal documentation, loans, and closing the deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (New Content) */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-gray-900 mb-4">Client Stories</h2>
                <div className="flex justify-center space-x-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {REVIEWS.map((review) => (
                    <div key={review.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
                        <div className="absolute -top-4 -left-4 text-6xl text-red-100 font-serif">"</div>
                        <p className="text-gray-600 italic mb-6 relative z-10">{review.text}</p>
                        <div className="flex items-center">
                            <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                            <div>
                                <h4 className="font-bold text-gray-900">{review.name}</h4>
                                <p className="text-xs text-gray-500 uppercase">{review.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* NEWSLETTER CTA (New Content) */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-red-600 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 p-12 text-center md:text-left md:flex items-center justify-between">
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <h2 className="text-3xl font-black text-white mb-4">Get the Hottest Deals First</h2>
                    <p className="text-red-100 text-lg">Subscribe to our newsletter and get exclusive access to new listings before they hit the market.</p>
                </div>
                <div className="md:w-1/2 flex flex-col sm:flex-row gap-3">
                    <Input placeholder="Enter your email address" className="bg-white/10 border-red-400 text-white placeholder:text-red-200 h-12" />
                    <Button className="bg-white text-red-600 hover:bg-gray-100 font-bold h-12 px-8">Subscribe</Button>
                </div>
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D0D0D] text-white pt-20 pb-10 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service and expertise in the real estate market.
              </p>
              <div className="flex space-x-4">
                  {/* Social Icons Placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Mail className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><MapPin className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-200">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/properties" className="hover:text-red-500 transition-colors">All Properties</Link></li>
                <li><Link to="/post-property" className="hover:text-red-500 transition-colors">Post a Property</Link></li>
                <li><Link to="/agents" className="hover:text-red-500 transition-colors">Find an Agent</Link></li>
                <li><Link to="/blog" className="hover:text-red-500 transition-colors">Real Estate Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-200">Categories</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/properties?category=buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/properties?category=sell" className="hover:text-red-500 transition-colors">Sell Property</Link></li>
                <li><Link to="/properties?category=rent" className="hover:text-red-500 transition-colors">Rent Property</Link></li>
                <li><Link to="/commercial" className="hover:text-red-500 transition-colors">Commercial</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-200">Contact Us</h4>
              <div className="space-y-4 text-sm text-gray-400">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-600 shrink-0"/> 123 Business Avenue, Tech Park, Mumbai, 400001</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-600 shrink-0"/> info@ankrealty.com</p>
                <p className="flex items-center"><Home className="w-5 h-5 mr-3 text-red-600 shrink-0"/> +91 98765 43210</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2025 ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
