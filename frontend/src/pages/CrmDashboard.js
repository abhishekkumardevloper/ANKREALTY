import React, { useState } from 'react';
import { 
  Users, Home, Calendar, PieChart, Settings, Bell, 
  Search, Plus, MoreVertical, Phone, Mail, MapPin, 
  TrendingUp, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// --- MOCK DATA FOR THE CRM ---
const initialLeads = [
  { id: 1, name: 'Aarav Patel', phone: '+91 98765 43210', property: 'Experion Saatori', status: 'Hot', date: '2026-03-15', source: 'Website' },
  { id: 2, name: 'Priya Sharma', phone: '+91 99887 76655', property: 'M3M Line', status: 'Follow Up', date: '2026-03-14', source: 'Instagram' },
  { id: 3, name: 'Vikram Singh', phone: '+91 91234 56789', property: 'Max Estate', status: 'New', date: '2026-03-15', source: 'Referral' },
  { id: 4, name: 'Neha Gupta', phone: '+91 99988 87776', property: 'Smart World Elie Saab', status: 'Closed', date: '2026-03-10', source: 'Website' },
];

const stats = [
  { title: 'Total Leads', value: '1,284', trend: '+12%', icon: Users, color: 'bg-blue-50 text-blue-600' },
  { title: 'Active Properties', value: '342', trend: '+5%', icon: Home, color: 'bg-indigo-50 text-indigo-600' },
  { title: 'Scheduled Visits', value: '48', trend: '+18%', icon: Calendar, color: 'bg-emerald-50 text-emerald-600' },
  { title: 'Conversion Rate', value: '14.2%', trend: '+2.4%', icon: TrendingUp, color: 'bg-red-50 text-red-600' },
];

export default function CrmDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');

  // Status Badge Color Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Hot': return 'bg-red-100 text-red-700 border-red-200';
      case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Follow Up': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Closed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <h1 className="text-2xl font-black text-white tracking-tight">ANK Realty<span className="text-red-500">.</span><span className="text-sm font-medium text-slate-500 ml-2">CRM</span></h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: PieChart },
            { id: 'leads', label: 'Lead Management', icon: Users },
            { id: 'properties', label: 'Properties', icon: Home },
            { id: 'appointments', label: 'Site Visits', icon: Calendar },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium hover:bg-slate-800 hover:text-white transition-all">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <div className="mt-4 flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="text-sm font-bold text-white">Admin User</p>
              <p className="text-xs text-slate-500">Sales Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-slate-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg text-sm transition-all outline-none w-64"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-8 flex-1 overflow-y-auto">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* STATS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">{stat.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RECENT ACTIVITY & QUICK TASKS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Recent Leads Overview</h3>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('leads')}>View All</Button>
                  </div>
                  <div className="space-y-4">
                    {leads.slice(0, 3).map(lead => (
                      <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{lead.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center"><Home className="w-3 h-3 mr-1"/> {lead.property}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Today's Site Visits</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start relative pb-4 border-b border-slate-100">
                      <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">10:30 AM - Experion Saatori</p>
                        <p className="text-xs text-slate-500 mt-1">Client: Aarav Patel</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start relative pb-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 shrink-0"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">02:00 PM - M3M Line</p>
                        <p className="text-xs text-slate-500 mt-1">Client: Priya Sharma</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input 
                    placeholder="Search leads by name or property..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80 bg-slate-50 border-slate-200"
                  />
                </div>
                <Button className="bg-slate-900 hover:bg-black text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" /> Add New Lead
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="p-4 pl-6">Client Name</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Interested Property</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4 pl-6 font-bold text-slate-900">{lead.name}</td>
                        <td className="p-4 text-slate-500 font-medium flex items-center gap-2">
                           <Phone className="w-3 h-3 text-slate-400" /> {lead.phone}
                        </td>
                        <td className="p-4 font-medium">{lead.property}</td>
                        <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold">{lead.source}</span></td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"><Phone className="w-3.5 h-3.5"/></Button>
                             <Button variant="outline" size="icon" className="h-8 w-8 text-slate-600 border-slate-200 hover:bg-slate-100"><Mail className="w-3.5 h-3.5"/></Button>
                             <Button variant="outline" size="icon" className="h-8 w-8 text-slate-400 border-transparent hover:bg-slate-100"><MoreVertical className="w-4 h-4"/></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">No leads found matching your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Placeholders for other tabs */}
          {(activeTab === 'properties' || activeTab === 'appointments') && (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400 animate-in fade-in">
               <Settings className="w-16 h-16 mb-4 opacity-20" />
               <h3 className="text-xl font-bold text-slate-600 mb-2">Module Coming Soon</h3>
               <p>The {activeTab} management interface is currently under construction.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
