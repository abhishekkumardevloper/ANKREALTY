// src/admin/Dashboard.jsx
import React from "react";
import { 
  Home, FileText, MonitorPlay, BarChart3, 
  TrendingUp, IndianRupee, Activity, CheckCircle, Clock,
  MessageSquare, UserCircle
} from "lucide-react";

export default function Dashboard({ 
  properties = [], 
  blogs = [], 
  videos = [], 
  reports = [],
  queries = [], 
  role = "broker", // Receives role from AdminPanel
  loading = false 
}) {
  const isAdmin = role === "admin";

  // --- PROPERTY CALCULATIONS ---
  const totalProps = properties.length;
  const buy = properties.filter(l => l.category === "buy" || l.type === "buy").length;
  const sell = properties.filter(l => l.category === "sell" || l.type === "sell").length;
  const rent = properties.filter(l => l.category === "rent" || l.type === "rent").length;
  
  const active = properties.filter(l => l.status === "active" || l.status === "approved").length;
  const pending = properties.filter(l => l.status === "pending").length;
  const sold = properties.filter(l => l.status === "sold").length;

  const totalValue = properties.reduce((sum, l) => sum + (Number(l.price) || 0), 0);
  const recent = [...properties].slice(0, 6); // Assuming data is already sorted by newest

  // --- REUSABLE STAT CARD ---
  const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-5 hover:shadow-md transition-all">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${bgColorClass}`}>
        <Icon className={`w-7 h-7 ${colorClass}`} />
      </div>
      <div>
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 mt-1">{loading ? "-" : value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {isAdmin ? "Platform Overview" : "Broker Workspace"}
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            {isAdmin 
              ? "Monitor site-wide properties, content, and user queries." 
              : "Manage your personal real estate portfolio."}
          </p>
        </div>
        {loading && (
           <span className="flex items-center text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-full w-fit">
             <Activity className="w-4 h-4 mr-2 animate-pulse" /> Syncing Data...
           </span>
        )}
      </div>

      {/* 1. DYNAMIC STATS (Changes based on Admin vs Broker) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <StatCard title="Total Properties" value={totalProps} icon={Home} colorClass="text-blue-600" bgColorClass="bg-blue-50" />
            <StatCard title="User Queries" value={queries.length} icon={MessageSquare} colorClass="text-orange-600" bgColorClass="bg-orange-50" />
            <StatCard title="Published Blogs" value={blogs.length} icon={FileText} colorClass="text-purple-600" bgColorClass="bg-purple-50" />
            <StatCard title="Video Tours" value={videos.length} icon={MonitorPlay} colorClass="text-red-600" bgColorClass="bg-red-50" />
          </>
        ) : (
          <>
            <StatCard title="My Properties" value={totalProps} icon={Home} colorClass="text-blue-600" bgColorClass="bg-blue-50" />
            <StatCard title="Active Listings" value={active} icon={CheckCircle} colorClass="text-green-600" bgColorClass="bg-green-50" />
            <StatCard title="Pending Review" value={pending} icon={Clock} colorClass="text-amber-600" bgColorClass="bg-amber-50" />
            <StatCard title="Successfully Sold" value={sold} icon={UserCircle} colorClass="text-purple-600" bgColorClass="bg-purple-50" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. REVENUE / PORTFOLIO VALUE BANNER (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden text-white flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                <IndianRupee className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-300 uppercase tracking-widest">
                {isAdmin ? "Total Platform Portfolio Value" : "Your Portfolio Value"}
              </h2>
            </div>
            <div className="text-5xl md:text-6xl font-black text-white mb-2 font-mono">
              ₹ {loading ? "..." : totalValue.toLocaleString('en-IN')}
            </div>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" /> Based on {totalProps} listed properties
            </p>
          </div>
        </div>

        {/* 3. PROPERTY BREAKDOWN STATS */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col justify-center">
          <h3 className="font-bold text-slate-900 mb-6 text-lg">Listing Breakdown</h3>
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">For Sale (Buy/Sell)</span>
              <span className="font-black text-lg text-slate-900">{buy + sell}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{width: `${totalProps ? ((buy+sell)/totalProps)*100 : 0}%`}}></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-slate-500 font-medium">For Rent</span>
              <span className="font-black text-lg text-slate-900">{rent}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full" style={{width: `${totalProps ? (rent/totalProps)*100 : 0}%`}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT PROPERTIES TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">
            {isAdmin ? "Recent Platform Listings" : "Your Recent Listings"}
          </h2>
          <div className="flex gap-4 text-sm font-bold">
            <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1"/> Active: {active}</span>
            <span className="flex items-center text-amber-500"><Clock className="w-4 h-4 mr-1"/> Pending: {pending}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="p-5 border-b border-slate-100">Property Title</th>
                <th className="p-5 border-b border-slate-100">Category</th>
                <th className="p-5 border-b border-slate-100">Price (₹)</th>
                <th className="p-5 border-b border-slate-100">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">Loading recent properties...</td>
                </tr>
              ) : recent.length > 0 ? (
                recent.map((item) => {
                  let badgeColor = "bg-slate-100 text-slate-600";
                  if (item.status === "active" || item.status === "approved") badgeColor = "bg-green-100 text-green-700 border-green-200";
                  if (item.status === "pending") badgeColor = "bg-amber-100 text-amber-700 border-amber-200";
                  if (item.status === "sold") badgeColor = "bg-blue-100 text-blue-700 border-blue-200";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-5 border-b border-slate-50 font-bold text-slate-900 truncate max-w-xs">
                        {item.title}
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{item.city}</div>
                      </td>
                      <td className="p-5 border-b border-slate-50 capitalize">
                        <span className="bg-slate-100 px-3 py-1 rounded-md text-xs font-bold text-slate-600">
                          {item.category || item.type || "N/A"}
                        </span>
                      </td>
                      <td className="p-5 border-b border-slate-50 font-mono text-base text-slate-900">
                        {Number(item.price).toLocaleString('en-IN')}
                      </td>
                      <td className="p-5 border-b border-slate-50">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${badgeColor} uppercase tracking-wider`}>
                          {item.status === "approved" ? "active" : item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No properties listed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}