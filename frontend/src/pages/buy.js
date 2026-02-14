import React, { useState } from "react";
import Navbar from "../components/Navbar"; // Assuming this exists based on your snippet
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  TrendingUp, 
  Filter, 
  ArrowRight 
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// --- Mock Data ---

const marketTrendData = [
  { month: 'Jan', avgPrice: 400000, demand: 65 },
  { month: 'Feb', avgPrice: 410000, demand: 70 },
  { month: 'Mar', avgPrice: 405000, demand: 75 },
  { month: 'Apr', avgPrice: 425000, demand: 85 },
  { month: 'May', avgPrice: 440000, demand: 80 },
  { month: 'Jun', avgPrice: 455000, demand: 95 },
];

const properties = [
  {
    id: 1,
    title: "Modern Sunset Villa",
    type: "House",
    price: "$1,250,000",
    location: "Beverly Hills, CA",
    beds: 4,
    baths: 3,
    sqft: 2800,
    image: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    tag: "Featured"
  },
  {
    id: 2,
    title: "Downtown Penthouse",
    type: "Apartment",
    price: "$850,000",
    location: "New York, NY",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "New"
  },
  {
    id: 3,
    title: "Prime Residential Plot",
    type: "Land Plot",
    price: "$350,000",
    location: "Austin, TX",
    beds: 0,
    baths: 0,
    sqft: 5000,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Best Value"
  }
];

export default function BuyPage() {
  const [activeTab, setActiveTab] = useState('trends');

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[550px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Luxury Home" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-red-600/90 text-sm font-semibold mb-4 tracking-wide">
            REAL ESTATE MARKETPLACE
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Find Your Place <br /> within the World
          </h1>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Explore a curated selection of premium homes, investment plots, and luxury apartments tailored to your lifestyle.
          </p>

          {/* Search Bar */}
          <div className="bg-white p-2 rounded-lg shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200">
              <MapPin className="text-gray-400 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="City, Neighborhood, or Zip" 
                className="w-full py-3 outline-none text-gray-700"
              />
            </div>
            <div className="flex-1 flex items-center px-4">
              <Filter className="text-gray-400 w-5 h-5 mr-3" />
              <select className="w-full py-3 outline-none text-gray-700 bg-transparent">
                <option>All Property Types</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Land Plot</option>
              </select>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-md font-semibold text-lg">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* --- MARKET ANALYTICS (PLOTS) --- */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-red-600" /> Market Insights
            </h2>
            <p className="text-gray-600 mt-2">Real-time data on property value appreciation.</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
             <button 
                onClick={() => setActiveTab('trends')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'trends' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border'}`}
             >
               Price Trends
             </button>
             <button 
                onClick={() => setActiveTab('demand')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'demand' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border'}`}
             >
               Demand Index
             </button>
          </div>
        </div>

        {/* The Plot Container */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'trends' ? (
              <AreaChart data={marketTrendData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [`$${value.toLocaleString()}`, "Avg Price"]}
                />
                <Area type="monotone" dataKey="avgPrice" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            ) : (
              <BarChart data={marketTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="demand" fill="#1f2937" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </section>

      {/* --- FEATURED PROPERTIES --- */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
            <Link to="/properties" className="text-red-600 font-semibold flex items-center hover:underline">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Image Area */}
                <div className="relative h-64 overflow-hidden">
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm z-10">
                    {property.tag}
                  </span>
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-bold text-xl">{property.price}</p>
                  </div>
                </div>

                {/* Details Area */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" /> {property.location}
                      </p>
                    </div>
                  </div>

                  <hr className="my-4 border-gray-100" />

                  <div className="flex justify-between text-gray-600 text-sm">
                    {property.beds > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" /> {property.beds} Beds
                      </span>
                    )}
                    {property.baths > 0 && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" /> {property.baths} Baths
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Square className="w-4 h-4" /> {property.sqft} sqft
                    </span>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-red-100 text-lg mb-8">
            Whether you are looking for a modern apartment, a suburban house, or a land plot for investment, we have the listings for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg">Browse Listings</Button>
             <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">Contact Agent</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
