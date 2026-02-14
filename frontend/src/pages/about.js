import React from "react";
import Navbar from "../components/Navbar";
import { Users, Award, Building } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const growthData = [
  { year: '2019', sales: 120 },
  { year: '2020', sales: 250 },
  { year: '2021', sales: 400 },
  { year: '2022', sales: 580 },
  { year: '2023', sales: 850 },
  { year: '2024', sales: 1200 },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Intro */}
      <section className="pt-20 pb-16 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-6">More Than Just Real Estate.<br/>We Build Communities.</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Founded in 2018, we started with a simple mission: to make the process of buying and selling homes as transparent and stress-free as possible. Today, we are the fastest-growing agency in the region.
        </p>
      </section>

      {/* Growth Chart Section */}
      <section className="bg-gray-50 py-16 px-6">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
               <h2 className="text-2xl font-bold mb-4">Our Growth Story</h2>
               <p className="text-gray-600 mb-6">
                  We've helped over 3,000 families find their homes. Our consistent growth is a testament to the trust our clients place in us.
               </p>
               <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                     <Users className="w-6 h-6 mx-auto text-red-600 mb-2" />
                     <div className="font-bold text-2xl">3k+</div>
                     <div className="text-xs text-gray-500">Happy Clients</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                     <Building className="w-6 h-6 mx-auto text-red-600 mb-2" />
                     <div className="font-bold text-2xl">500+</div>
                     <div className="text-xs text-gray-500">Listings Active</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                     <Award className="w-6 h-6 mx-auto text-red-600 mb-2" />
                     <div className="font-bold text-2xl">15</div>
                     <div className="text-xs text-gray-500">Industry Awards</div>
                  </div>
               </div>
            </div>

            {/* The Plot */}
            <div className="flex-1 w-full h-64 bg-white p-4 rounded-xl shadow-md">
               <h3 className="text-sm font-bold text-gray-400 mb-4">Properties Sold (Cumulative)</h3>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip />
                    <XAxis dataKey="year" hide />
                    <Area type="monotone" dataKey="sales" stroke="#dc2626" fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
         <h2 className="text-3xl font-bold text-center mb-12">Meet The Leadership</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
               <div key={i} className="text-center group">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-gray-100 mb-4 group-hover:border-red-600 transition duration-300">
                     <img src={`https://images.unsplash.com/photo-${i === 1 ? '1560250097-0b93528c311a' : i === 2 ? '1573496359142-b8d87734a5a2' : '1580489944761-15a19d654956'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`} alt="Team Member" className="w-full h-full object-cover"/>
                  </div>
                  <h3 className="font-bold text-lg">Alex Johnson</h3>
                  <p className="text-red-600 text-sm">Senior Broker</p>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
