// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User, LogOut, Menu, X, ChevronDown,
  Youtube, FileText, TrendingUp, Home, Key, 
  Building2, Briefcase, Phone, HardHat
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Define routes that have a DARK hero section at the top.
  const transparentRoutes = ['/', '/contact', '/dashboard', '/construction', '/corporate-leasing', '/buy', '/resale', '/sell', '/rent'];
  const isTransparentRoute = transparentRoutes.includes(location.pathname);
  
  // The Navbar should be solid if: we scrolled down, the mobile menu is open, OR we are on a light page.
  const shouldBeSolid = isScrolled || isMobileMenuOpen || !isTransparentRoute;

  const mainLinks = [
    { name: 'Buy', path: '/buy', icon: Home },
    { name: 'Resale', path: '/resale', icon: Key },
    { name: 'Sell', path: '/sell', icon: Building2 },
    { name: 'Construction', path: '/construction', icon: HardHat },
    { name: 'Corporate', path: '/corporate-leasing', icon: Briefcase },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const resourceLinks = [
    { name: 'Our Blog', path: '/blog', icon: FileText },
    { name: 'Video Tours', path: '/videos', icon: Youtube },
    { name: 'Market Data', path: '/insights', icon: TrendingUp },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      shouldBeSolid
        ? 'bg-[#0A192F]/95 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.3)] py-3 border-b border-white/10'
        : 'bg-gradient-to-b from-black/60 to-transparent py-5'
    }`}>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">

          {/* LOGO - Golden Color Pops on Dark Blue */}
          <Link to="/" className="flex items-center group relative z-50">
            <img
              src="/Untitled.png"
              alt="ANK Realty Logo"
              className={`h-10 md:h-12 lg:h-14 w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                shouldBeSolid ? '' : 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]'
              }`}
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden xl:flex items-center gap-5 lg:gap-7">
            {mainLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] lg:text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 relative py-2 ${
                  isActive(link.path)
                    ? 'text-[#D4AF37]' // Changed to Gold for dark background visibility
                    : 'text-white/90 hover:text-[#D4AF37] drop-shadow-md'
                }`}
              >
                {link.name}
                {/* Active Indicator Dot */}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"></span>
                )}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 text-[11px] lg:text-xs font-black uppercase tracking-[0.15em] transition-colors text-white/90 group-hover:text-[#D4AF37] drop-shadow-md">
                Resources <ChevronDown className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:rotate-180"/>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top group-hover:translate-y-0 translate-y-2">
                <div className="bg-[#0A192F] shadow-2xl rounded-2xl p-2 w-56 border border-white/10">
                  {resourceLinks.map((item) => (
                    <Link key={item.name} to={item.path} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group/item">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/item:bg-[#D4AF37]/20 transition-colors">
                        <item.icon className="w-4 h-4 text-slate-300 group-hover/item:text-[#D4AF37]" />
                      </div>
                      <span className="text-sm font-bold text-white/90 group-hover/item:text-[#D4AF37]">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="hidden xl:flex items-center gap-5">
            {user ? (
              <div className="flex items-center gap-2 pl-5 border-l border-white/20">
                <Link to="/dashboard" className="flex items-center gap-3 px-2 py-1.5 rounded-full transition-colors hover:bg-white/10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B0000] to-[#D4AF37] text-white flex items-center justify-center font-black shadow-md border-2 border-white/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold tracking-wide text-white">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  title="Logout"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors text-white/80 hover:text-red-400 hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="h-11 px-8 rounded-full font-bold tracking-wide transition-all duration-300 bg-[#8B0000] hover:bg-[#600000] text-white shadow-lg shadow-[#8B0000]/20">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <div className="xl:hidden flex items-center relative z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-colors bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* --- PROFESSIONAL MOBILE FULL-SCREEN MENU (DARK THEME) --- */}
      <div className={`xl:hidden fixed inset-0 top-[72px] md:top-[80px] bg-[#0A192F] transition-all duration-500 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
      }`}>
        <div className="h-full overflow-y-auto pb-32">
          <div className="p-6 space-y-2">
            
            {/* Mobile Links */}
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 pl-2">Navigation</p>
            {mainLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  isActive(link.path) ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/20' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive(link.path) ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 text-slate-300'}`}>
                     <link.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-base font-black tracking-wide ${isActive(link.path) ? 'text-[#D4AF37]' : 'text-white/90'}`}>
                    {link.name}
                  </span>
                </div>
                {isActive(link.path) && <ChevronDown className="w-4 h-4 text-[#D4AF37] -rotate-90" />}
              </Link>
            ))}

            {/* Mobile Resources */}
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-8 mb-4 pl-2 border-t border-white/10 pt-8">Resources</p>
            <div className="grid grid-cols-3 gap-3">
              {resourceLinks.map((item) => (
                <Link key={item.name} to={item.path} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform hover:border-[#D4AF37]/50 hover:bg-white/10">
                  <item.icon className="w-6 h-6 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-white/90 text-center">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Auth Actions */}
            <div className="mt-10 pt-8 border-t border-white/10">
              {!user ? (
                <Link to="/auth">
                  <Button className="w-full h-14 bg-[#8B0000] hover:bg-[#600000] text-white rounded-2xl text-lg font-black shadow-lg shadow-[#8B0000]/20">
                    Sign In / Register
                  </Button>
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full h-14 border-white/20 text-white rounded-2xl text-base font-black flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/50">
                      <User className="w-5 h-5 text-[#D4AF37]" /> Go to Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" className="w-full h-14 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-2xl text-base font-bold flex items-center justify-center gap-2">
                    <LogOut className="w-5 h-5" /> Logout
                  </Button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}
