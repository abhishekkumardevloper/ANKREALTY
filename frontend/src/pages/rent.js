import React from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Home, Search, Map } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const rentTrends = [
  { month: 'Jan', Studio: 1200, OneBed: 1600, TwoBed: 2400 },
  { month: 'Mar', Studio: 1250, OneBed: 1650, TwoBed: 2450 },
  { month: 'May', Studio: 1300, OneBed: 1750, TwoBed: 2600 },
  { month: 'Jul', Studio: 1400, OneBed: 1900, TwoBed: 2800 }, // Summer peak
  { month: 'Sep', Studio: 1350, OneBed: 1800, TwoBed: 2700 },
  { month: 'Nov', Studio: 1250, OneBed: 1700, TwoBed: 2500 },
];

export default function RentPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-3xl font-bold">Rental Listings</h1>
          <div className="flex bg-white rounded-md overflow-hidden p-1 w-full md:w-auto">
             <input className="px-4 py-2 text-gray-900 outline-none w-full md:w-80" placeholder="City, Zip, or School District..." />
             <Button className="bg-red-600 hover:bg-red-700 h-full rounded-sm"><Search className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar Filters & Data */}
        <div className="lg:col-span-1 space-y-8">
           {/* Rental Market Graph */}
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Price Trends (Avg Rent)</h3>
              <p className="text-xs text-gray-500 mb-4">Historical rental data for this region.</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rentTrends}>
                    <XAxis dataKey="month" tick={{fontSize: 10}} />
                    <YAxis width={30} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="TwoBed" stroke="#dc2626" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="OneBed" stroke="#4b5563" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-xs mt-2 text-gray-500">
                 <span className="text-red-600 font-bold">● 2 Bed</span>
                 <span className="text-gray-600 font-bold">● 1 Bed</span>
              </div>
           </div>

           {/* Quick Filters */}
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold mb-4">Filter By</h3>
              <div className="space-y-3">
                 <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-red-600" /> <span>Pet Friendly</span>
                 </label>
                 <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-red-600" /> <span>In-Unit Laundry</span>
                 </label>
                 <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-red-600" /> <span>Parking Available</span>
                 </label>
              </div>
           </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-2">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                 <div key={item} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
                    <div className="h-48 bg-gray-200 relative">
                       <img src={`https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} className="w-full h-full object-cover" alt="Apartment"/>
                       <span className="absolute bottom-2 right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">Available Now</span>
                    </div>
                    <div className="p-4">
                       <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-lg">The Lofts at Downtown</h3>
                          <span className="text-red-600 font-bold">$2,400<span className="text-gray-400 text-sm font-normal">/mo</span></span>
                       </div>
                       <p className="text-gray-500 text-sm flex items-center gap-1 mb-4"><Map className="w-3 h-3"/> 123 Main St, Metro City</p>
                       <div className="flex gap-4 text-sm text-gray-600">
                          <span>2 Bed</span>
                          <span>2 Bath</span>
                          <span>950 sqft</span>
                       </div>
                       <Button variant="outline" className="w-full mt-4 border-red-200 text-red-600 hover:bg-red-50">Schedule Tour</Button>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
