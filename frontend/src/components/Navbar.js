// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, LogOut, Menu, X, ChevronDown, 
  Youtube, FileText, TrendingUp, HardHat 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourceOpen, setIsResourceOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Added Sell back and kept Construction
  const mainLinks = [
    { name: 'Buy', path: '/buy' },
    { name: 'Resale', path: '/resale' },
    { name: 'Sell', path: '/sell' },
    { name: 'Construction', path: '/construction' },
    { name: 'Corporate Leasing', path: '/corporate-leasing' },
    { name: 'Contact', path: '/contact' },
  ];

  const resourceLinks = [
    { name: 'Our Blog', path: '/blog', icon: FileText },
    { name: 'Video Tours', path: '/videos', icon: Youtube },
    { name: 'Market Data', path: '/insights', icon: TrendingUp },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-200'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img 
              src="/Untitled.png"
              alt="ANK Realty Logo"
              className={`h-10 md:h-12 lg:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105 ${isScrolled ? '' : 'brightness-0 invert'}`}
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden xl:flex items-center gap-6 lg:gap-8">
            {mainLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-[#8B0000]'
                    : isScrolled
                    ? 'text-slate-900 hover:text-[#8B0000]' // Scroll hone par Black text
                    : 'text-white hover:text-[#D4AF37]'    // Top par White text
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dropdown - Resources */}
            <div className="relative group">
              <button 
                className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                  isScrolled ? 'text-slate-900 hover:text-[#8B0000]' : 'text-white hover:text-[#D4AF37]'
                }`}
              >
                Resources <ChevronDown className="w-4 h-4 ml-1 opacity-70"/>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="bg-white shadow-2xl rounded-2xl p-3 w-56 border border-slate-100 flex flex-col gap-1">
                  {resourceLinks.map((item) => (
                    <Link 
                      key={item.name} 
                      to={item.path}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 group/item transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover/item:bg-[#8B0000] transition-colors">
                         <item.icon className="w-4 h-4 text-[#D4AF37] group-hover/item:text-white transition-colors"/>
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover/item:text-[#8B0000] transition-colors">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (Buttons & Auth) */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/post-property">
              <Button variant="outline" className={`border-2 transition-colors font-black uppercase text-xs tracking-widest ${
                isScrolled 
                  ? 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white' 
                  : 'border-white text-white hover:bg-white hover:text-slate-900 bg-transparent'
              }`}>
                Post Property
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200/30">
                <Link to="/dashboard" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-sm font-black border border-white/20 group-hover:scale-105 transition-transform">
                    {user.name.charAt(0)}
                  </div>
                  <span className={`text-sm font-bold transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 transition-colors group">
                  <LogOut className={`w-5 h-5 ${isScrolled ? 'text-slate-500 group-hover:text-[#8B0000]' : 'text-white/70 group-hover:text-[#D4AF37]'}`}/>
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className={`${isScrolled ? 'bg-slate-900' : 'bg-[#8B0000]'} text-white hover:opacity-90 font-black uppercase text-xs tracking-widest px-6 shadow-lg transition-all hover:-translate-y-0.5`}>
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="xl:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isScrolled || isMobileMenuOpen ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/20'}`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      <div 
        className={`xl:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-100 transition-all duration-300 origin-top overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          {mainLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-black uppercase tracking-wider py-2 border-b border-slate-50 ${isActive(link.path) ? 'text-[#8B0000]' : 'text-slate-900 hover:text-[#8B0000]'}`}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Resources */}
          <div className="py-2 border-b border-slate-50">
             <button 
                onClick={() => setIsResourceOpen(!isResourceOpen)}
                className="w-full flex items-center justify-between text-lg font-black uppercase tracking-wider text-slate-900"
             >
                Resources <ChevronDown className={`w-5 h-5 transition-transform ${isResourceOpen ? 'rotate-180' : ''}`}/>
             </button>
             {isResourceOpen && (
               <div className="flex flex-col gap-3 mt-4 pl-4 border-l-2 border-[#D4AF37]">
                 {resourceLinks.map((item) => (
                   <Link 
                      key={item.name} 
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-slate-600 font-bold"
                   >
                     <item.icon className="w-4 h-4 text-[#8B0000]"/> {item.name}
                   </Link>
                 ))}
               </div>
             )}
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <Link to="/post-property" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full h-12 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-sm">
                Post Property
              </Button>
            </Link>
            {!user ? (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full h-12 bg-slate-900 text-white font-black uppercase tracking-widest text-sm shadow-md">
                  Login / Register
                </Button>
              </Link>
            ) : (
              <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} variant="ghost" className="w-full h-12 text-slate-600 hover:text-red-600 font-bold">
                <LogOut className="w-4 h-4 mr-2"/> Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
