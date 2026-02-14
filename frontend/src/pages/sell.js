import React from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const comparisonData = [
  { name: 'Avg. Days on Market', Us: 24, Market: 45 },
  { name: 'Sale vs List Price %', Us: 102, Market: 96 },
];

export default function SellPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Sell for More, Sell Faster</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          We use data-driven strategies to position your property for the maximum return.
        </p>
        <div className="bg-white p-2 rounded-lg max-w-xl mx-auto flex">
          <input 
            type="text" 
            placeholder="Enter your property address for a free estimate" 
            className="flex-1 p-3 text-gray-900 outline-none"
          />
          <Button className="bg-red-600 hover:bg-red-700 text-white">Get Estimate</Button>
        </div>
      </section>

      {/* Performance Stats (The Plot) */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why List With Us?</h2>
            <p className="text-gray-600 mb-6">
              Numbers don't lie. Our marketing reach and negotiation experts consistently outperform the local market averages.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full"><DollarSign className="w-5 h-5 text-red-600"/></div>
                <span className="font-medium">Get 6% more than market average</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full"><Clock className="w-5 h-5 text-red-600"/></div>
                <span className="font-medium">Sell 2x faster than competitors</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full"><CheckCircle className="w-5 h-5 text-red-600"/></div>
                <span className="font-medium">Verified buyer network ready to offer</span>
              </li>
            </ul>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-[350px]">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Performance Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="Us" fill="#dc2626" name="Our Agency" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="Market" fill="#9ca3af" name="Market Avg" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      
      {/* Process Steps */}
      <section className="bg-white py-16 px-6 border-t border-gray-100">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Your Selling Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: "1. Valuation", desc: "We analyze thousands of data points to price your home perfectly." },
                 { title: "2. Marketing", desc: "Pro photography, 3D tours, and premium placement on all major sites." },
                 { title: "3. Closing", desc: "We handle the paperwork and negotiation to get you to the finish line." }
               ].map((step, idx) => (
                 <div key={idx} className="p-6 bg-gray-50 rounded-lg text-center hover:bg-red-50 transition duration-300">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">{idx + 1}</div>
                    <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
