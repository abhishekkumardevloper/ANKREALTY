import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { 
  Users, Award, Building, Target, Shield, Heart, 
  Linkedin, Mail, Twitter, MapPin, ArrowRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis,
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Button } from "@/components/ui/button";

// Updated growth data extending to recent years
const growthData = [
  { year: '2019', sales: 120 },
  { year: '2020', sales: 250 },
  { year: '2021', sales: 400 },
  { year: '2022', sales: 680 },
  { year: '2023', sales: 950 },
  { year: '2024', sales: 1400 },
  { year: '2025', sales: 2100 },
];

// Rich team data for the interactive tab section
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Vikram Sharma",
    role: "Founder & CEO",
    department: "Leadership",
    bio: "With 15+ years in Indian real estate, Vikram founded ANK Realty to bring transparency to the property market.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Anita Desai",
    role: "Head of Sales",
    department: "Leadership",
    bio: "Anita leads our nationwide sales team, ensuring every client gets the red-carpet treatment they deserve.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "Senior Broker - Commercial",
    department: "Agents",
    bio: "Specializing in high-yield commercial spaces and tech parks across Mumbai and Bangalore.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Priya Singh",
    role: "Luxury Property Specialist",
    department: "Agents",
    bio: "Priya connects high-net-worth individuals with India's most exclusive penthouses and villas.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
  }
];

export default function AboutPage() {
  // State for the interactive Team section tabs
  const [activeTab, setActiveTab] = useState("All");

  const filteredTeam = activeTab === "All" 
    ? TEAM_MEMBERS 
    : TEAM_MEMBERS.filter(member => member.department === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-slate-900 text-center">
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900 z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto mt-8">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            More Than Real Estate.<br/>We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Communities.</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed font-light max-w-2xl mx-auto mb-10">
            Founded in 2018, ANK Realty started with a simple mission: to make the process of buying, selling, and renting as transparent and stress-free as possible. Today, we are India's fastest-growing premium agency.
          </p>
        </div>
      </section>

      {/* CORE VALUES (NEW CONTENT SECTION) */}
      <section className="py-20 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Absolute Trust</h3>
            <p className="text-slate-600 leading-relaxed">We believe in 100% verified listings and total transparency. No hidden fees, no fake photos, just honest real estate.</p>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Data-Driven</h3>
            <p className="text-slate-600 leading-relaxed">Our market analysis isn't based on guesswork. We use advanced algorithms to ensure you buy smart and sell high.</p>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Client First</h3>
            <p className="text-slate-600 leading-relaxed">From the first site visit to handing over the keys, your dedicated relationship manager is with you every step of the way.</p>
          </div>
        </div>
      </section>

      {/* GROWTH CHART SECTION */}
      <section className="bg-white py-24 px-6 border-y border-slate-100">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
               <div className="inline-block px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-bold tracking-wide mb-4 uppercase">
                  Our Milestone
               </div>
               <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">A Legacy of Consistent Growth</h2>
               <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                  We've successfully matched over 3,000 families and businesses with their perfect properties. Our exponential growth is a direct reflection of the trust our clients place in our hands.
               </p>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                     <Users className="w-8 h-8 text-red-600 mb-4" />
                     <div className="font-black text-4xl text-slate-900 mb-1">3k+</div>
                     <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Happy Clients</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                     <Building className="w-8 h-8 text-red-600 mb-4" />
                     <div className="font-black text-4xl text-slate-900 mb-1">500+</div>
                     <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Active Listings</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 md:col-span-1">
                     <Award className="w-8 h-8 text-red-600 mb-4" />
                     <div className="font-black text-4xl text-slate-900 mb-1">15</div>
                     <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Industry Awards</div>
                  </div>
               </div>
            </div>

            {/* UPGRADED CHART */}
            <div className="flex-1 w-full h-[450px] bg-slate-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
               <h3 className="text-sm font-bold text-slate-400 mb-6 tracking-widest uppercase">Properties Sold (Cumulative)</h3>
               <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="year" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#ef4444" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </section>

      {/* INTERACTIVE TEAM SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-12">
           <h2 className="text-4xl font-black text-slate-900 mb-4">Meet The Experts</h2>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
             The dedicated professionals working tirelessly to find your perfect property.
           </p>

           {/* Tabs */}
           <div className="inline-flex bg-slate-100 p-1 rounded-xl mb-12">
             {["All", "Leadership", "Agents"].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                   activeTab === tab 
                    ? "bg-white text-red-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                 }`}
               >
                 {tab}
               </button>
             ))}
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredTeam.map((member) => (
               <div key={member.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="h-64 overflow-hidden relative">
                     <img 
                       src={member.image} 
                       alt={member.name} 
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-600 transition-colors"><Linkedin className="w-4 h-4" /></button>
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-600 transition-colors"><Twitter className="w-4 h-4" /></button>
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-600 transition-colors"><Mail className="w-4 h-4" /></button>
                     </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col text-center">
                     <h3 className="font-black text-xl text-slate-900 mb-1">{member.name}</h3>
                     <p className="text-red-600 text-sm font-bold uppercase tracking-wide mb-4">{member.role}</p>
                     <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{member.bio}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-slate-900 py-20 px-6 mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Want to Join the ANK Realty Team?</h2>
          <p className="text-slate-400 text-lg mb-10">We are always looking for driven, ethical, and ambitious real estate professionals to join our growing family.</p>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-14 px-8 rounded-xl text-lg shadow-lg hover:shadow-red-600/30 transition-all">
            View Open Positions <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

    </div>
  );
}
