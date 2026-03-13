import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, MapPin, ArrowRight, Heart, TrendingUp, 
  Award, Zap, Users, CheckCircle, ChevronRight, Phone, Mail
} from "lucide-react";

// --- MOCK DATA FOR JOBS & CONTENT ---
const JOB_OPENINGS = [
  {
    id: 1,
    title: "Senior Luxury Real Estate Agent",
    department: "Sales",
    location: "Mumbai, Maharashtra",
    type: "Full-Time",
    experience: "5+ Years",
  },
  {
    id: 2,
    title: "Regional Sales Manager",
    department: "Sales",
    location: "Bangalore, Karnataka",
    type: "Full-Time",
    experience: "8+ Years",
  },
  {
    id: 3,
    title: "Digital Marketing Strategist",
    department: "Marketing",
    location: "Delhi NCR",
    type: "Full-Time",
    experience: "3+ Years",
  },
  {
    id: 4,
    title: "Frontend React Developer",
    department: "Technology",
    location: "Remote / Pune",
    type: "Full-Time",
    experience: "2-4 Years",
  },
  {
    id: 5,
    title: "Real Estate Legal Advisor",
    department: "Legal",
    location: "Mumbai, Maharashtra",
    type: "Full-Time",
    experience: "6+ Years",
  },
  {
    id: 6,
    title: "Property Media Photographer / Drone Pilot",
    department: "Marketing",
    location: "Goa",
    type: "Contract",
    experience: "Portfolio Required",
  }
];

const DEPARTMENTS = ["All Roles", "Sales", "Marketing", "Technology", "Legal"];

const PERKS = [
  {
    icon: <TrendingUp className="w-8 h-8 text-red-500" />,
    title: "Uncapped Earning Potential",
    desc: "Our commission structures are the best in the industry. Your hard work directly translates to your financial growth."
  },
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "Premium Health Coverage",
    desc: "Comprehensive health, dental, and vision insurance for you and your family from day one."
  },
  {
    icon: <Zap className="w-8 h-8 text-red-500" />,
    title: "Tech-Driven Workflow",
    desc: "Say goodbye to manual paperwork. We equip our team with cutting-edge AI tools and proprietary CRMs."
  },
  {
    icon: <Award className="w-8 h-8 text-red-500" />,
    title: "Fast-Track Growth",
    desc: "We promote from within. Continuous mentorship programs and leadership training to accelerate your career."
  }
];

export default function CareersPage() {
  const [activeFilter, setActiveFilter] = useState("All Roles");

  const filteredJobs = activeFilter === "All Roles" 
    ? JOB_OPENINGS 
    : JOB_OPENINGS.filter(job => job.department === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white pt-32 pb-32 px-6 relative overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
             style={{ 
               backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80')`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-2/3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-xl">
               <Briefcase className="w-4 h-4 text-red-500" /> Join The Revolution
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg leading-[1.1]">
              Do the Best Work of <br/><span className="text-red-500">Your Career.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 font-light leading-relaxed max-w-xl">
              We are a team of ambitious innovators redefining Indian real estate. If you are hungry for growth, impact, and a dynamic culture, you belong here.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => document.getElementById('open-positions').scrollIntoView({ behavior: 'smooth' })} className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 rounded-xl font-bold text-lg shadow-lg shadow-red-600/30 transition-all">
                View Open Positions
              </Button>
            </div>
          </div>
          
          {/* Quick Stats Grid */}
          <div className="md:w-1/3 grid grid-cols-2 gap-4 w-full mt-8 md:mt-0">
             <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 text-center">
               <div className="text-4xl font-black text-white mb-1">150+</div>
               <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Team Members</p>
             </div>
             <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 text-center">
               <div className="text-4xl font-black text-white mb-1">4</div>
               <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Major Cities</p>
             </div>
             <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 text-center col-span-2">
               <div className="text-4xl font-black text-white mb-1">4.8/5</div>
               <p className="text-xs text-slate-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                 <Users className="w-4 h-4"/> Glassdoor Rating
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. WHY JOIN US / PERKS SECTION */}
      <section className="py-24 px-6 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Why Work at ANK Realty?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We demand the best from our team, which is why we provide the best in return. We invest heavily in your personal and professional well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PERKS.map((perk, idx) => (
              <div key={idx} className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-red-100 transition-all duration-500 group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {perk.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{perk.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OPEN POSITIONS (JOB BOARD) */}
      <section id="open-positions" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Open Positions</h2>
              <p className="text-lg text-slate-600">Find your perfect role and help us shape the future of real estate.</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 mt-6 md:mt-0 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept}
                  onClick={() => setActiveFilter(dept)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                    activeFilter === dept 
                      ? "bg-slate-900 text-white shadow-md" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4"/>
                <h3 className="text-xl font-bold text-slate-700">No open positions in this department</h3>
                <p className="text-slate-500 mt-2">Check back later or explore other roles.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer">
                  
                  <div className="flex-1">
                    <div className="flex gap-2 mb-3">
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
                        {job.department}
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-slate-400"/> {job.location}</span>
                      <span className="hidden sm:block">•</span>
                      <span className="flex items-center"><Award className="w-4 h-4 mr-1 text-slate-400"/> Exp: {job.experience}</span>
                    </div>
                  </div>

                  <div>
                    <Button className="w-full md:w-auto h-12 px-8 bg-slate-900 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all group-hover:-translate-y-1">
                      Apply Now <ChevronRight className="w-5 h-5 ml-1"/>
                    </Button>
                  </div>

                </div>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center">
             <p className="text-slate-500 font-medium">
               Don't see a perfect fit? Send your resume to <a href="mailto:careers@ankrealty.com" className="text-red-600 font-bold hover:underline">careers@ankrealty.com</a> and we'll keep you in mind.
             </p>
          </div>
        </div>
      </section>

      {/* 4. EMPLOYEE TESTIMONIAL / CULTURE */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 rounded-l-[5rem] -z-10 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
           <div className="lg:w-1/2">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
               alt="Team Collaboration" 
               className="rounded-[2.5rem] shadow-2xl object-cover w-full h-[500px]"
             />
             <div className="bg-red-600 text-white p-6 rounded-2xl absolute bottom-10 left-10 md:-left-10 shadow-xl max-w-xs transform rotate-2">
               <p className="font-bold text-lg mb-2">"The culture here is electric."</p>
               <p className="text-sm text-red-100">"I've grown more in my first year at ANK than I did in 5 years at my previous agency. The leadership truly cares."</p>
               <p className="text-xs font-bold uppercase tracking-widest mt-4">— Riya M., Senior Sales</p>
             </div>
           </div>

           <div className="lg:w-1/2">
             <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">A Culture of Excellence & Empathy</h2>
             <p className="text-lg text-slate-600 mb-8 leading-relaxed">
               At ANK Realty, we operate like a high-performance sports team. We push each other to break records, but we also celebrate wins together and support each other during tough market cycles. 
             </p>
             <ul className="space-y-4">
               {[
                 "Monthly team offsites and learning workshops.",
                 "Flat hierarchy – your ideas are heard, from day one.",
                 "Diversity & Inclusion focused workplace.",
                 "State-of-the-art offices with wellness zones."
               ].map((item, idx) => (
                 <li key={idx} className="flex items-start gap-3">
                   <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                   <span className="text-slate-700 font-medium text-lg">{item}</span>
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed pr-4">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service, transparency, and expertise in the Indian real estate market.
              </p>
              <div className="flex space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Mail className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Phone className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Company</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-red-500 transition-colors text-red-500">Careers</Link></li>
                <li><Link to="/insights" className="hover:text-red-500 transition-colors">Market Insights</Link></li>
                <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Properties</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/sell" className="hover:text-red-500 transition-colors">Sell Property</Link></li>
                <li><Link to="/rent" className="hover:text-red-500 transition-colors">Rent Property</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium text-sm">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-600 shrink-0"/> 123 Business Avenue, Tech Park, Mumbai</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-600 shrink-0"/> careers@ankrealty.com</p>
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