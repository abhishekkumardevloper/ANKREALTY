import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, BarChart3, PieChart, Download, FileText, 
  ArrowRight, MapPin, Mail, Phone, LineChart as LineChartIcon,
  ChevronRight, Building, Activity, Zap
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

// --- MOCK DATA ---
const cityTrendData = [
  { month: 'Jul 25', Mumbai: 24500, Bangalore: 12200, NCR: 10500 },
  { month: 'Aug 25', Mumbai: 24800, Bangalore: 12500, NCR: 10600 },
  { month: 'Sep 25', Mumbai: 25100, Bangalore: 12800, NCR: 10800 },
  { month: 'Oct 25', Mumbai: 25500, Bangalore: 13200, NCR: 11100 },
  { month: 'Nov 25', Mumbai: 26000, Bangalore: 13500, NCR: 11500 },
  { month: 'Dec 25', Mumbai: 26500, Bangalore: 14000, NCR: 11800 },
  { month: 'Jan 26', Mumbai: 27200, Bangalore: 14500, NCR: 12200 },
  { month: 'Feb 26', Mumbai: 28000, Bangalore: 15100, NCR: 12600 },
];

const downloadableReports = [
  {
    id: 1,
    title: "Q1 2026 Indian Real Estate Market Outlook",
    category: "Quarterly Report",
    pages: 42,
    size: "4.2 MB",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "The Rise of Luxury Villas: Post-Pandemic Shifts",
    category: "Whitepaper",
    pages: 28,
    size: "2.8 MB",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Commercial Real Estate: Tech Parks vs Co-Working",
    category: "Sector Analysis",
    pages: 35,
    size: "3.5 MB",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
  }
];

const expertAnalysis = [
  {
    id: 1,
    title: "Interest Rates Hold Steady: What It Means for Homebuyers",
    author: "Vikram Sharma, CEO",
    date: "March 2, 2026",
    excerpt: "With the RBI maintaining the repo rate, the window of opportunity for affordable home loans remains open. Here is our breakdown of how this impacts premium property segments."
  },
  {
    id: 2,
    title: "Why Bangalore's North Corridor is Seeing a 15% Price Surge",
    author: "Market Research Team",
    date: "Feb 24, 2026",
    excerpt: "Upcoming infrastructure projects and new SEZ approvals have triggered a massive influx of investments in North Bangalore. Read our detailed geographical breakdown."
  },
  {
    id: 3,
    title: "Renting vs Buying in 2026: A Financial Perspective",
    author: "Anita Desai, Head of Sales",
    date: "Feb 18, 2026",
    excerpt: "As rental yields slowly climb in metro cities, the age-old debate of renting versus buying takes a new turn. We crunch the numbers for you."
  }
];

export default function InsightsPage() {
  const [activeCity, setActiveCity] = useState("Mumbai");

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* 1. HERO SECTION (DATA FOCUSED) */}
      <section className="bg-slate-900 text-white pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-xl">
             <BarChart3 className="w-4 h-4" /> ANK Intelligence
          </div>
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg leading-[1.1]">
                Data That Drives <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Smart Decisions.</span>
              </h1>
              <p className="text-xl text-slate-300 mb-10 font-light leading-relaxed">
                Welcome to India's most comprehensive real estate research hub. Access institutional-grade market reports, price indexes, and expert forecasts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 rounded-xl font-bold text-lg shadow-lg shadow-red-600/30 transition-all">
                  Download Latest Q1 Report
                </Button>
                <Button variant="outline" className="h-14 px-8 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-bold text-lg transition-all">
                  View Market Index
                </Button>
              </div>
            </div>

            {/* Hero Quick Stats */}
            <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
              <div className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><TrendingUp className="w-5 h-5"/></div>
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">YoY Growth</span>
                 </div>
                 <div className="text-4xl font-black text-white mb-1">+14.2%</div>
                 <p className="text-xs text-slate-500">Avg. Property Appreciation</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Activity className="w-5 h-5"/></div>
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Market Demand</span>
                 </div>
                 <div className="text-4xl font-black text-white mb-1">High</div>
                 <p className="text-xs text-slate-500">Based on active buyer intent</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700 col-span-2 flex justify-between items-center group cursor-pointer hover:bg-slate-800 transition-colors">
                 <div>
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-2">Total Transacted Value (2025)</span>
                   <div className="text-3xl font-black text-white">₹ 4,250 Crores</div>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <ArrowRight className="w-5 h-5 text-white"/>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE MARKET INDEX (CHART) */}
      <section className="py-24 px-6 bg-white border-b border-slate-200 relative -mt-6 z-20 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">ANK Price Index™</h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                Track the average price per square foot across India's top metropolitan areas. Data is updated dynamically based on actual registered transactions.
              </p>
            </div>
            {/* Legend / Toggles */}
            <div className="flex gap-4 mt-6 md:mt-0 bg-slate-50 p-2 rounded-xl border border-slate-100">
               {['Mumbai', 'Bangalore', 'NCR'].map(city => (
                 <button 
                   key={city}
                   onClick={() => setActiveCity(city)}
                   className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCity === city ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                 >
                   {city}
                 </button>
               ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-6 md:p-10 shadow-lg">
            <div className="flex items-center justify-between mb-8">
               <div>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Price / Sq.Ft</p>
                 <h3 className="text-4xl font-black text-slate-900">
                   ₹{cityTrendData[cityTrendData.length - 1][activeCity].toLocaleString('en-IN')}
                 </h3>
                 <p className="text-green-600 text-sm font-bold mt-2 flex items-center bg-green-100 w-fit px-3 py-1 rounded-full">
                   <TrendingUp className="w-4 h-4 mr-1"/> 
                   Up {((cityTrendData[cityTrendData.length - 1][activeCity] - cityTrendData[0][activeCity]) / cityTrendData[0][activeCity] * 100).toFixed(1)}% since Jul '25
                 </p>
               </div>
               <div className="hidden md:block">
                 <Zap className="w-12 h-12 text-slate-300" />
               </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cityTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeCity === 'Mumbai' ? '#dc2626' : activeCity === 'Bangalore' ? '#2563eb' : '#16a34a'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={activeCity === 'Mumbai' ? '#dc2626' : activeCity === 'Bangalore' ? '#2563eb' : '#16a34a'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Price/SqFt']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={activeCity} 
                    stroke={activeCity === 'Mumbai' ? '#dc2626' : activeCity === 'Bangalore' ? '#2563eb' : '#16a34a'} 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorIndex)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DOWNLOADABLE RESEARCH REPORTS */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Research & Whitepapers</h2>
              <p className="text-slate-500 text-lg">In-depth studies authored by our elite research division.</p>
            </div>
            <Button variant="link" className="text-red-600 font-bold hidden md:flex hover:no-underline hover:text-red-700">View All Reports <ChevronRight className="w-5 h-5 ml-1"/></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {downloadableReports.map((report) => (
              <div key={report.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="h-48 relative overflow-hidden">
                  <img src={report.image} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors"></div>
                  <div className="absolute top-4 left-4 bg-white/95 text-slate-900 px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest shadow-sm">
                    {report.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                    {report.title}
                  </h3>
                  <div className="flex gap-4 text-sm text-slate-500 font-medium mb-6">
                    <span className="flex items-center gap-1.5"><FileText className="w-4 h-4"/> {report.pages} Pages</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600 font-bold rounded-xl h-12 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <Download className="w-4 h-4 mr-2"/> Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXPERT ANALYSIS (ARTICLES) */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Expert Market Analysis</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Stay updated with weekly op-eds and analyses from ANK Realty's leadership and industry veterans. We decode complex market shifts into actionable advice.
              </p>
              <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-50"></div>
                 <h3 className="font-bold text-xl mb-3 relative z-10">Subscribe to Insights</h3>
                 <p className="text-slate-400 text-sm mb-6 relative z-10">Get the latest reports and analyses delivered to your inbox every Monday.</p>
                 <div className="flex relative z-10 bg-white/10 p-1 rounded-xl">
                   <input type="email" placeholder="Your Email" className="bg-transparent w-full px-4 text-sm outline-none text-white placeholder:text-slate-400" />
                   <Button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 font-bold shadow-md">Join</Button>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/3 flex flex-col gap-6">
             {expertAnalysis.map((article) => (
               <div key={article.id} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                     <span className="text-red-600 text-sm font-bold uppercase tracking-widest">{article.author}</span>
                     <span className="text-slate-400 text-sm font-medium">{article.date}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center text-slate-900 font-bold group-hover:text-red-600 transition-colors">
                    Read Full Analysis <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"/>
                  </span>
               </div>
             ))}
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
              <h4 className="font-bold text-lg mb-6 text-slate-100">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/sell" className="hover:text-red-500 transition-colors">Sell Property</Link></li>
                <li><Link to="/rent" className="hover:text-red-500 transition-colors">Rent Property</Link></li>
                <li><Link to="/insights" className="hover:text-red-500 transition-colors">Market Insights</Link></li>
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