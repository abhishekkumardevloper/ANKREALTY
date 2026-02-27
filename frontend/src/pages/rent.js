import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Home, Search, MapPin, X, CheckCircle, Bed, Bath, Maximize, Calendar
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Updated to Indian Rupee (₹) context for realistic local data
const rentTrends = [
  { month: 'Jan', Studio: 12000, OneBed: 16000, TwoBed: 24000 },
  { month: 'Mar', Studio: 12500, OneBed: 16500, TwoBed: 24500 },
  { month: 'May', Studio: 13000, OneBed: 17500, TwoBed: 26000 },
  { month: 'Jul', Studio: 14000, OneBed: 19000, TwoBed: 28000 },
  { month: 'Sep', Studio: 13500, OneBed: 18000, TwoBed: 27000 },
  { month: 'Nov', Studio: 12500, OneBed: 17000, TwoBed: 25000 },
];

// Actual mock data so the "View Details" modal shows dynamic content
const RENTAL_LISTINGS = [
  {
    id: 1,
    title: "The Lofts at Downtown",
    price: 24000,
    location: "Kankarbagh, Patna",
    beds: 2,
    baths: 2,
    sqft: 950,
    available: "Available Now",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    description: "Beautiful modern loft featuring open-concept living, stainless steel appliances, and large windows bringing in plenty of natural light. Close to metro and shopping centers.",
    amenities: ["Pet Friendly", "In-Unit Laundry", "Covered Parking", "Gym Access"]
  },
  {
    id: 2,
    title: "Serene Garden Apartments",
    price: 18000,
    location: "Boring Road, Patna",
    beds: 1,
    baths: 1,
    sqft: 750,
    available: "Available Oct 1st",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5240980c?auto=format&fit=crop&w=800&q=80",
    description: "Quiet and peaceful 1BHK apartment with a garden view. Recently renovated with fresh paint and new flooring. Perfect for young professionals.",
    amenities: ["Balcony", "24/7 Security", "Power Backup", "Park View"]
  },
  {
    id: 3,
    title: "Luxury High-Rise Suite",
    price: 45000,
    location: "Bandra West, Mumbai",
    beds: 3,
    baths: 3,
    sqft: 1800,
    available: "Available Now",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    description: "Experience premium living with panoramic city views. This luxury suite offers top-tier finishes, a modular kitchen, and exclusive club access.",
    amenities: ["Swimming Pool", "Clubhouse", "Smart Home Tech", "Concierge"]
  },
  {
    id: 4,
    title: "Cozy Studio near Campus",
    price: 12000,
    location: "Delhi University North",
    beds: 1,
    baths: 1,
    sqft: 450,
    available: "Available Next Week",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    description: "Compact, fully furnished studio apartment ideal for students or solo professionals. Walking distance to major transit stops.",
    amenities: ["Furnished", "Wi-Fi Included", "Shared Laundry", "Bike Storage"]
  }
];

export default function RentPage() {
  // State to control the modal. Holds the selected property object, or null if closed.
  const [selectedProperty, setSelectedProperty] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-slate-900 text-white py-14 px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div>
            <h1 className="text-4xl font-black mb-2">Rental Listings</h1>
            <p className="text-slate-400">Find your next perfect home.</p>
          </div>
          <div className="flex bg-white rounded-xl overflow-hidden p-1.5 w-full md:w-auto shadow-xl shadow-black/20">
             <div className="flex items-center pl-3">
               <Search className="w-5 h-5 text-slate-400" />
             </div>
             <input className="px-3 py-3 text-slate-900 outline-none w-full md:w-80 font-medium" placeholder="City, Locality, or Project..." />
             <Button className="bg-red-600 hover:bg-red-700 h-full px-6 rounded-lg text-white font-bold transition-colors">
                Search
             </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Sidebar Filters & Data */}
        <div className="lg:col-span-1 space-y-8">
           {/* Rental Market Graph */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1 text-lg">Price Trends (Avg Rent)</h3>
              <p className="text-sm text-slate-500 mb-6">Historical rental data for this region.</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rentTrends}>
                    <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis width={40} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Line type="monotone" dataKey="TwoBed" stroke="#dc2626" dot={false} strokeWidth={3} />
                    <Line type="monotone" dataKey="OneBed" stroke="#64748b" dot={false} strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 text-sm mt-4 text-slate-600 font-medium">
                 <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-600"></div> 2 Bed</span>
                 <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-500"></div> 1 Bed</span>
              </div>
           </div>

           {/* Quick Filters */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4 text-slate-900">Popular Filters</h3>
              <div className="space-y-4">
                 {["Pet Friendly", "In-Unit Laundry", "Parking Available", "Furnished"].map((filter, i) => (
                    <label key={i} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center group-hover:border-red-500 transition-colors">
                        <input type="checkbox" className="hidden peer" />
                        <div className="w-3 h-3 bg-red-600 rounded-sm scale-0 peer-checked:scale-100 transition-transform"></div>
                      </div>
                      <span className="text-slate-700 font-medium">{filter}</span>
                    </label>
                 ))}
              </div>
           </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-2">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-slate-900">{RENTAL_LISTINGS.length} Properties Found</h2>
             <select className="bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg outline-none font-medium">
               <option>Sort by: Newest</option>
               <option>Price: Low to High</option>
               <option>Price: High to Low</option>
             </select>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {RENTAL_LISTINGS.map((property) => (
                 <div key={property.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                    <div className="h-56 bg-slate-200 relative overflow-hidden">
                       <img src={property.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={property.title}/>
                       <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                         {property.available}
                       </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-slate-900 line-clamp-1">{property.title}</h3>
                       </div>
                       
                       <p className="text-slate-500 text-sm flex items-center gap-1 mb-4 font-medium">
                         <MapPin className="w-4 h-4 text-red-500"/> {property.location}
                       </p>
                       
                       <div className="flex gap-4 text-sm text-slate-600 mb-6 font-medium">
                          <span className="flex items-center gap-1"><Bed className="w-4 h-4"/> {property.beds} Bed</span>
                          <span className="flex items-center gap-1"><Bath className="w-4 h-4"/> {property.baths} Bath</span>
                          <span className="flex items-center gap-1"><Maximize className="w-4 h-4"/> {property.sqft} sqft</span>
                       </div>
                       
                       <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-2xl font-black text-slate-900">₹{property.price.toLocaleString()}<span className="text-slate-500 text-sm font-medium">/mo</span></span>
                          {/* THIS BUTTON TRIGGERS THE MODAL */}
                          <Button 
                            onClick={() => setSelectedProperty(property)}
                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-colors"
                          >
                            View Details
                          </Button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* --- MODAL / POPUP COMPONENT --- */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Dark background overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedProperty(null)} // Click outside to close
          ></div>

          {/* Modal Content Box */}
          <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white text-slate-900 transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left side: Big Image */}
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img src={selectedProperty.image} alt={selectedProperty.title} className="w-full h-full object-cover" />
            </div>

            {/* Right side: Details */}
            <div className="p-8 md:w-1/2 flex flex-col">
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4 w-fit flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {selectedProperty.available}
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedProperty.title}</h2>
              <p className="text-slate-500 flex items-center gap-1 mb-6 font-medium">
                <MapPin className="w-4 h-4 text-red-500"/> {selectedProperty.location}
              </p>

              <div className="flex gap-6 pb-6 border-b border-slate-100 mb-6">
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">{selectedProperty.beds}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Beds</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">{selectedProperty.baths}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Baths</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">{selectedProperty.sqft}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Sqft</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-2">Description</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{selectedProperty.description}</p>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-slate-900 mb-3">Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProperty.amenities.map((amenity, idx) => (
                    <span key={idx} className="flex items-center text-sm text-slate-600 font-medium gap-1.5">
                      <CheckCircle className="w-4 h-4 text-red-500" /> {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Rent Price</span>
                  <span className="text-3xl font-black text-red-600">₹{selectedProperty.price.toLocaleString()}<span className="text-slate-500 text-lg font-medium">/mo</span></span>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl text-lg shadow-lg hover:shadow-red-600/30 transition-all">
                  Contact Agent
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
