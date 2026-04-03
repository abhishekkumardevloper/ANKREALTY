// src/admin/AdminLayout.jsx
import React, { useState } from "react";

/**
 * AdminLayout
 * Props:
 * - children: main content (React nodes)
 * - page: current page key (string)
 * - setPage: function to change page
 * - role: "admin" or "broker" (string)
 */

const NavButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all font-medium mb-1
      ${active 
        ? "bg-slate-900 text-white shadow-md" 
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
  >
    <span className="w-5 h-5 flex items-center justify-center" aria-hidden>
      {icon}
    </span>
    <span className="text-sm">{label}</span>
  </button>
);

export default function AdminLayout({ children, page = "dashboard", setPage = () => {}, role = "broker" }) {
  const [open, setOpen] = useState(true); 
  const [mobileOpen, setMobileOpen] = useState(false); 

  const isAdmin = role === "admin";

  // Master Navigation Config with Role-Based Access Control
  const allNavItems = [
    { key: "dashboard", label: "Dashboard", adminOnly: false, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    // NEW: Lead CRM Tab
    { key: "crm", label: "Lead CRM", adminOnly: false, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    { key: "buy", label: "Buy Properties", adminOnly: false, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-6 9 6v10a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1V9z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    { key: "resale", label: "Resale Properties", adminOnly: false, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    // Corporate Leasing (Client Projects)
    { key: "client-project", label: "Corporate Leases", adminOnly: false, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="9" y1="22" x2="15" y2="22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="9" y1="6" x2="9.01" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="15" y1="6" x2="15.01" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="9" y1="10" x2="9.01" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="15" y1="10" x2="15.01" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="9" y1="14" x2="9.01" y2="14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="15" y1="14" x2="15.01" y2="14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    { key: "add-property", label: "Add Property", adminOnly: false, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    { key: "blogs", label: "Manage Blogs", adminOnly: true, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="13" x2="8" y2="13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="17" x2="8" y2="17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="10 9 9 9 8 9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    { key: "youtube", label: "YouTube Promos", adminOnly: true, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
  ];

  const nav = allNavItems.filter(item => !item.adminOnly || isAdmin);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/auth";
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* Sidebar (desktop) */}
      <aside className={`hidden md:flex md:flex-col bg-white border-r border-slate-200 p-5 transition-all duration-300 ${open ? "w-72" : "w-0 overflow-hidden opacity-0 p-0"}`}>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-md">A</div>
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden w-full bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="font-black text-lg text-slate-900 tracking-tight">ANK Realty</div>
        </div>
      </div>

      {/* Mobile sidebar (slide over) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="bg-white w-[280px] h-full p-6 relative flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg">A</div>
              <div>
                <div className="text-lg font-black text-slate-900">ANK Realty</div>
                <div className="text-xs font-bold text-slate-500 uppercase">{isAdmin ? "Admin Portal" : "Broker Portal"}</div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Menu</div>
              {nav.filter(n => !n.adminOnly).map((n) => (
                <NavButton key={n.key} icon={n.icon} label={n.label} active={page === n.key} onClick={() => { setPage(n.key); setMobileOpen(false); }} />
              ))}

              {isAdmin && (
                <>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-8 mb-3 pl-2">Marketing & Tools</div>
                  {nav.filter(n => n.adminOnly).map((n) => (
                    <NavButton key={n.key} icon={n.icon} label={n.label} active={page === n.key} onClick={() => { setPage(n.key); setMobileOpen(false); }} />
                  ))}
                </>
              )}
            </nav>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-red-50 text-red-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Secure Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 p-6 lg:p-10 lg:pl-12 overflow-x-hidden">
        
        {/* Topbar inside main (desktop) */}
        <div className="hidden md:flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <button onClick={() => setOpen(!open)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div>
              <div className="text-2xl font-black capitalize text-slate-900 tracking-tight">
                {page.replace("-", " ")}
              </div>
              <div className="text-sm font-medium text-slate-500 mt-0.5">
                {isAdmin ? "Oversee your platform operations." : "Manage your real estate listings."}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-inner">
                {isAdmin ? "AD" : "BR"}
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  {isAdmin ? "Main Admin" : "Broker Agent"}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {isAdmin ? "Full Access" : "Restricted"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
