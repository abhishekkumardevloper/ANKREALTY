import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Users, Award, Building, Target, Shield, Heart, 
  Linkedin, Mail, Twitter, MapPin, ArrowRight, Phone, 
  Quote, Globe, Briefcase, ChevronRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// Data
const growthData = [
  { year: '2019', sales: 120 }, { year: '2020', sales: 250 },
  { year: '2021', sales: 400 }, { year: '2022', sales: 680 },
  { year: '2023', sales: 950 }, { year: '2024', sales: 1400 },
  { year: '2025', sales: 2100 },
];

const milestones = [
  { year: "2018", title: "The Beginning", desc: "ANK Realty was founded in Mumbai with a team of just 4 visionaries." },
  { year: "2021", title: "National Expansion", desc: "Opened regional offices in Delhi NCR, Bangalore, and Pune." },
  { year: "2023", title: "Digital Revolution", desc: "Launched our proprietary AI-driven property valuation tech." },
  { year: "2025", title: "Market Leaders", desc: "Crossed 3,000+ happy families and ₹5,000 Cr in gross sales." }
];

const TEAM_MEMBERS = [
  { id: 1, name: "Vikram Sharma", role: "Founder & CEO", department: "Leadership", bio: "With 15+ years in Indian real estate, Vikram founded ANK Realty to bring absolute transparency to the property market.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Anita Desai", role: "Head of Sales", department: "Leadership", bio: "Anita leads our nationwide sales team, ensuring every client gets the red-carpet treatment they deserve.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Rahul Verma", role: "Senior Broker", department: "Agents", bio: "Specializing in high-yield commercial spaces and tech parks across Mumbai and Bangalore.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Priya Singh", role: "Luxury Specialist", department: "Agents", bio: "Priya connects high-net-worth individuals with India's most exclusive penthouses and villas.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" }
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredTeam = activeTab === "All" 
    ? TEAM_MEMBERS 
    : TEAM_MEMBERS.filter(member => member.department === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-32 px-6 overflow-hidden bg-slate-900 text-center">
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-900 z-0" />
        
        <div className="relative z-10 max-w-5xl mx-auto mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-xl">
             <Globe className="w-4 h-4 text-red-500" /> India's Premium Real Estate Agency
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
            More Than Real Estate.<br/>We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Communities.</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed font-light max-w-3xl mx-auto mb-10">
            Founded in 2018, ANK Realty started with a simple mission: to make the process of buying, selling, and renting as transparent and stress-free as possible.
          </p>
        </div>
      </section>

      {/* 2. OUR STORY & FOUNDER QUOTE */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute -top-6 -left-6 w-24 h-24 bg-red-100 rounded-full blur-2xl opacity-60"></div>
             <h2 className="text-4xl font-black text-slate-900 mb-6 relative z-10">Rewriting the rules of <br/><span className="text-red-600">Indian Real Estate.</span></h2>
             <p className="text-lg text-slate-600 leading-relaxed mb-6">
               For decades, finding a home or an office space meant dealing with hidden fees, unverified listings, and endless paperwork. We stepped in to change that narrative.
             </p>
             <p className="text-lg text-slate-600 leading-relaxed mb-8">
               At ANK Realty, we combine cutting-edge technology with deep human empathy. We don't just sell square footage; we match lifestyles to addresses.
             </p>
             <div className="bg-slate-900 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
               <Quote className="absolute top-4 right-4 w-24 h-24 text-white/5 transform -scale-x-100" />
               <p className="text-white text-lg font-medium italic relative z-10 mb-6">
                 "Our metric for success isn't the number of transactions closed, but the number of clients who refer us to their families."
               </p>
               <div className="flex items-center gap-4 relative z-10">
                 <img src={TEAM_MEMBERS[0].image} alt="Founder" className="w-12 h-12 rounded-full object-cover border-2 border-red-500" />
                 <div>
                   <p className="text-white font-bold">Vikram Sharma</p>
                   <p className="text-red-400 text-sm">Founder & CEO</p>
                 </div>
               </div>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" alt="Luxury Home" className="w-full h-64 object-cover rounded-3xl shadow-lg mt-8" />
             <img src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&q=80" alt="Office Meeting" className="w-full h-80 object-cover rounded-3xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="bg-slate-900 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">The Pillars of ANK</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">The unshakeable principles that guide every handshake, every contract, and every key handover.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-md p-10 rounded-[2rem] border border-slate-700 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                <Shield className="w-8 h-8 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Absolute Trust</h3>
              <p className="text-slate-400 leading-relaxed">We believe in 100% verified listings and total transparency. No hidden fees, no fake photos, just honest real estate.</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md p-10 rounded-[2rem] border border-slate-700 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Target className="w-8 h-8 text-blue-500 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Data-Driven</h3>
              <p className="text-slate-400 leading-relaxed">Our market analysis isn't based on guesswork. We use advanced algorithms to ensure you buy smart and sell high.</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md p-10 rounded-[2rem] border border-slate-700 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Heart className="w-8 h-8 text-green-500 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Client First</h3>
              <p className="text-slate-400 leading-relaxed">From the first site visit to handing over the keys, your dedicated relationship manager is with you every step of the way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GROWTH CHART & STATS */}
      <section className="bg-white py-24 px-6 border-b border-slate-100">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
               <div className="inline-block px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-bold tracking-wide mb-4 uppercase">
                  Growth & Impact
               </div>
               <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">A Legacy of Consistent Growth</h2>
               <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                  We've successfully matched over 3,000 families and businesses with their perfect properties. Our exponential growth is a direct reflection of the trust our clients place in our hands.
               </p>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-xl hover:shadow-red-900/5 transition-all">
                     <Users className="w-8 h-8 text-red-600 mb-4 mx-auto" />
                     <div className="font-black text-4xl text-slate-900 mb-1">3k+</div>
                     <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Happy Clients</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-xl hover:shadow-red-900/5 transition-all">
                     <Building className="w-8 h-8 text-red-600 mb-4 mx-auto" />
                     <div className="font-black text-4xl text-slate-900 mb-1">500+</div>
                     <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Listings</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 md:col-span-1 text-center hover:bg-white hover:shadow-xl hover:shadow-red-900/5 transition-all">
                     <Award className="w-8 h-8 text-red-600 mb-4 mx-auto" />
                     <div className="font-black text-4xl text-slate-900 mb-1">15</div>
                     <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Industry Awards</div>
                  </div>
               </div>
            </div>

            {/* CHART */}
            <div className="flex-1 w-full h-[450px] bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
               <h3 className="text-sm font-bold text-slate-500 mb-8 tracking-widest uppercase flex items-center gap-2">
                 <Target className="w-4 h-4 text-red-500"/> Annual Sales Velocity
               </h3>
               <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#94a3b8" tick={{fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
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

      {/* 5. TIMELINE / MILESTONES */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-black text-slate-900 mb-4">Our Journey</h2>
             <p className="text-lg text-slate-600">How we grew from a small startup to an industry leader.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((ms, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:border-red-100 transition-all">
                <div className="text-5xl font-black text-slate-100 absolute -top-2 -right-2 group-hover:text-red-50 transition-colors z-0">{ms.year}</div>
                <div className="relative z-10">
                  <div className="text-red-600 font-bold text-xl mb-2">{ms.year}</div>
                  <h3 className="font-black text-xl text-slate-900 mb-3">{ms.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TEAM SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200">
         <div className="text-center mb-12">
           <h2 className="text-4xl font-black text-slate-900 mb-4">Meet The Experts</h2>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
             The dedicated professionals working tirelessly to find your perfect property.
           </p>

           {/* Tabs */}
           <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl mb-12 shadow-inner border border-slate-200/50">
             {["All", "Leadership", "Agents"].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                   activeTab === tab 
                    ? "bg-white text-red-600 shadow-md transform scale-105" 
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
               <div key={member.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl hover:border-red-100 transition-all duration-500 group flex flex-col hover:-translate-y-2">
                  <div className="h-80 overflow-hidden relative p-2">
                     <div className="w-full h-full rounded-3xl overflow-hidden relative">
                       <img 
                         src={member.image} 
                         alt={member.name} 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-3">
                          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-600 transition-colors shadow-lg"><Linkedin className="w-4 h-4" /></button>
                          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-600 transition-colors shadow-lg"><Twitter className="w-4 h-4" /></button>
                          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-600 transition-colors shadow-lg"><Mail className="w-4 h-4" /></button>
                       </div>
                     </div>
                  </div>
                  <div className="p-6 pt-4 flex-1 flex flex-col text-center">
                     <h3 className="font-black text-2xl text-slate-900 mb-1 group-hover:text-red-600 transition-colors">{member.name}</h3>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">{member.role}</p>
                     <p className="text-slate-600 text-sm leading-relaxed flex-1">{member.bio}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* 7. PAN-INDIA PRESENCE */}
      <section className="bg-slate-900 py-24 px-6 text-white text-center">
        <div className="max-w-5xl mx-auto">
          <Globe className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-black mb-10">Our National Footprint</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {['Mumbai (HQ)', 'Delhi NCR', 'Bangalore', 'Pune'].map((city, idx) => (
               <div key={idx} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-red-500 transition-colors">
                 <MapPin className="w-6 h-6 text-red-500 mx-auto mb-3" />
                 <p className="font-bold text-lg">{city}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="bg-red-600 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
          <Briefcase className="w-16 h-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black mb-6">Want to Build a Career in Real Estate?</h2>
          <p className="text-red-100 text-lg mb-10 max-w-2xl mx-auto font-medium">
            We are always looking for driven, ethical, and ambitious professionals to join our growing family. Let's build the future together.
          </p>
          <Button className="bg-white text-red-600 hover:bg-slate-100 font-black h-16 px-12 rounded-2xl text-lg shadow-2xl hover:-translate-y-1 transition-all">
            Explore Open Positions <ChevronRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed pr-4">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service, transparency, and expertise.
              </p>
              <div className="flex space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Mail className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Phone className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/sell" className="hover:text-red-500 transition-colors">Sell Property</Link></li>
                <li><Link to="/rent" className="hover:text-red-500 transition-colors">Rent Property</Link></li>
                <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Apartments</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Villas</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Plots / Land</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Commercial</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium text-sm">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-600 shrink-0"/> 123 Business Avenue, Tech Park, Mumbai</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-600 shrink-0"/> info@ankrealty.com</p>
                <p className="flex items-center"><Phone className="w-5 h-5 mr-3 text-red-600 shrink-0"/> +91 98765 43210</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}