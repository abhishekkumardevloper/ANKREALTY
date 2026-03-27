import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, LogOut, Building2, Menu, X, ChevronDown, 
  Youtube, FileText, Briefcase, PlayCircle, TrendingUp 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourceOpen, setIsResourceOpen] = useState(false); // For mobile dropdown toggle

  // Scroll Effect for Glassmorphism
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

  // Main Transaction Links
  const mainLinks = [
    { name: 'Buy', path: '/buy' },
    { name: 'Resale', path: '/resale' },
    { name: 'Sell', path: '/sell' },
    { name: 'Corporate Leasing', path: '/corporate-leasing' },
    { name: 'Contact', path: '/contact' },
  ];

  // Resource / Media Links (Blog, YouTube, Data)
  const resourceLinks = [
    { name: 'Our Blog', path: '/blog', icon: FileText, desc: 'Latest property news & tips' },
    { name: 'Video Tours', path: '/videos', icon: Youtube, desc: 'Watch property walkthroughs' },
    { name: 'Market Data', path: '/insights', icon: TrendingUp, desc: 'Price trends & analysis' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">

          {/* LOGO AREA */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-red-600 p-2 rounded-xl group-hover:shadow-lg group-hover:shadow-red-600/30 transition-all duration-300">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-black leading-none ${isScrolled || isMobileMenuOpen ? 'text-slate-900' : 'text-slate-900 md:text-white'}`}>
                ANK Realty
              </span>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${isScrolled || isMobileMenuOpen ? 'text-red-600' : 'text-slate-600 md:text-slate-300'}`}>
                Premium Living
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-8">
            {mainLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold transition-all hover:-translate-y-0.5 ${
                  isActive(link.path)
                    ? 'text-red-600'
                    : isScrolled
                    ? 'text-slate-600 hover:text-red-600'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Resources Dropdown (Hover) */}
            <div className="relative group">
              <button 
                className={`flex items-center gap-1 text-sm font-bold transition-colors ${
                  isScrolled ? 'text-slate-600 hover:text-red-600' : 'text-slate-200 hover:text-white'
                }`}
              >
                Resources <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180"/>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-64">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden">
                  {resourceLinks.map((item) => (
                    <Link 
                      key={item.name} 
                      to={item.path}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                    >
                      <div className="bg-red-50 p-2 rounded-lg text-red-600 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Hiring / Careers Link */}
            <Link 
              to="/careers" 
              className={`flex items-center gap-2 text-sm font-bold ${
                isScrolled ? 'text-slate-600 hover:text-red-600' : 'text-slate-200 hover:text-white'
              }`}
            >
              Careers
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">Hiring</span>
            </Link>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/post-property">
              <Button 
                variant="outline" 
                className={`font-bold border-2 ${
                  isScrolled 
                    ? 'border-red-600 text-red-600 hover:bg-red-50' 
                    : 'border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white'
                }`}
              >
                Post Property
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-4 border-l border-slate-300/30">
                <Link to="/dashboard">
                  <div className={`flex items-center gap-2 font-bold cursor-pointer ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm">{user.name.split(' ')[0]}</span>
                  </div>
                </Link>
                <button onClick={handleLogout} className={`p-2 hover:bg-white/10 rounded-full transition-colors ${isScrolled ? 'text-slate-400 hover:text-red-600' : 'text-slate-300 hover:text-white'}`}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl h-screen overflow-y-auto pb-20 animate-in slide-in-from-top-5 duration-200">
          <div className="p-6 space-y-6">
            
            {/* Main Links */}
            <div className="space-y-4">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-2xl font-black text-slate-900 hover:text-red-600"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Resources Accordion */}
            <div className="border-t border-slate-100 pt-4">
              <button 
                onClick={() => setIsResourceOpen(!isResourceOpen)}
                className="flex items-center justify-between w-full text-lg font-bold text-slate-700 mb-4"
              >
                Resources <ChevronDown className={`w-5 h-5 transition-transform ${isResourceOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isResourceOpen && (
                <div className="space-y-3 pl-4 mb-6">
                  {resourceLinks.map((item) => (
                    <Link 
                      key={item.name} 
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-slate-600"
                    >
                      <item.icon className="w-4 h-4 text-red-600" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              <Link 
                to="/careers" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between w-full text-lg font-bold text-slate-700"
              >
                Careers <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full uppercase">Hiring</span>
              </Link>
            </div>

            {/* Mobile Auth Actions */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <Link to="/post-property" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full h-12 text-lg bg-slate-900 text-white hover:bg-slate-800">
                  Post Property Free
                </Button>
              </Link>

              {!user ? (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-12 text-lg border-red-600 text-red-600 hover:bg-red-50">
                    Login / Register
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">View Dashboard</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="text-red-600 p-2">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}