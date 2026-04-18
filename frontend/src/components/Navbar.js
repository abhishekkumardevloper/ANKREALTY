// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User, LogOut, Menu, X, ChevronDown,
  Youtube, FileText, TrendingUp
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen
        ? 'bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-200'
        : 'bg-transparent py-4'
    }`}>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src="/Untitled.png"
              alt="ANK Realty Logo"
              className={`h-10 md:h-12 lg:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105 ${
                isScrolled ? '' : 'brightness-0 invert'
              }`}
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
                    ? 'text-slate-900 hover:text-[#8B0000]'
                    : 'text-white hover:text-[#D4AF37]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${
                isScrolled ? 'text-slate-900' : 'text-white'
              }`}>
                Resources <ChevronDown className="w-4 h-4 ml-1"/>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white shadow-2xl rounded-2xl p-3 w-56 border">
                  {resourceLinks.map((item) => (
                    <Link key={item.name} to={item.path} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50">
                      <item.icon className="w-4 h-4 text-[#8B0000]" />
                      <span className="text-sm font-bold">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200/30">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#8B0000] text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className={`${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                <button onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className={`${isScrolled ? 'bg-slate-900' : 'bg-[#8B0000]'} text-white`}>
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <div className="xl:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`xl:hidden absolute top-full left-0 w-full bg-white transition-all ${
        isMobileMenuOpen ? 'max-h-[600px]' : 'max-h-0 overflow-hidden'
      }`}>
        <div className="p-6 flex flex-col gap-4">
          {mainLinks.map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)}>
              {link.name}
            </Link>
          ))}

          {!user ? (
            <Link to="/auth">
              <Button className="w-full">Login</Button>
            </Link>
          ) : (
            <Button onClick={handleLogout}>Logout</Button>
          )}
        </div>
      </div>

    </nav>
  );
}
