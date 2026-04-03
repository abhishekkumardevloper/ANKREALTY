// src/admin/AdminLayout.jsx
import React, { useState } from "react";
import { LayoutDashboard, Building, Home, Key, PlusSquare, Users, FileText, Youtube, LogOut, Menu } from 'lucide-react';

const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all font-medium mb-1
      ${active ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm">{label}</span>
  </button>
);

export default function AdminLayout({ children, page = "dashboard", setPage = () => {}, role = "broker" }) {
  const [open, setOpen] = useState(true); 
  const [mobileOpen, setMobileOpen] = useState(false); 
  const isAdmin = role === "admin";

  const allNavItems = [
    { key: "dashboard", label: "Dashboard", adminOnly: false, icon: LayoutDashboard },
    { key: "crm", label: "Lead CRM", adminOnly: false, icon: Users }, // NEW CRM TAB
    { key: "buy", label: "Buy Properties", adminOnly: false, icon: Home },
    { key: "resale", label: "Resale Properties", adminOnly: false, icon: Key },
    { key: "client-project", label: "Corporate Leases", adminOnly: false, icon: Building }, // CORPORATE TAB
    { key: "add-property", label: "Add Property", adminOnly: false, icon: PlusSquare },
    { key: "blogs", label: "Manage Blogs", adminOnly: true, icon: FileText },
    { key: "youtube", label: "YouTube Promos", adminOnly: true, icon: Youtube },
  ];

  const nav = allNavItems.filter(item => !item.adminOnly || isAdmin);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/auth";
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex md:flex-col bg-white border-r border-slate-200 p-5 transition-all duration-300 ${open ? "w-72" : "w-0 overflow-hidden opacity-0 p-0"}`}>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-[#8B0000] text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-md">A</div>
          <div>
            <div className="text-lg font-black text-slate-900 tracking-tight">ANK Realty</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isAdmin ? "Admin Portal" : "Broker Portal"}</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">Menu</div>
          {nav.filter(n => !n.adminOnly).map((n) => (
            <NavButton key={n.key} icon={n.icon} label={n.label} active={page === n.key} onClick={() => setPage(n.key)} />
          ))}

          {isAdmin && (
            <>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-8 mb-3 px-4">Marketing & Tools</div>
              {nav.filter(n => n.adminOnly).map((n) => (
                <NavButton key={n.key} icon={n.icon} label={n.label} active={page === n.key} onClick={() => setPage(n.key)} />
              ))}
            </>
          )}
        </nav>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 lg:p-10 lg:pl-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
