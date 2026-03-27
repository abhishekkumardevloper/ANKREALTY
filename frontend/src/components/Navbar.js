// Updated Navbar (Optimized Logo + Header Size)

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
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img 
              src="/Untitled.png"
              alt="Logo"
              className="h-10 md:h-12 lg:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {mainLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'text-red-600'
                    : isScrolled
                    ? 'text-slate-600 hover:text-red-600'
                    : 'text-white hover:text-gray-200'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold">
                Resources <ChevronDown className="w-4 h-4"/>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="bg-white shadow-lg rounded-xl p-2 w-52">
                  {resourceLinks.map((item) => (
                    <Link key={item.name} to={item.path}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                    >
                      <item.icon className="w-4 h-4 text-red-600"/>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/post-property">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 text-sm px-4 py-2">
                Post Property
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout}>
                  <LogOut className="w-4 h-4 text-gray-500 hover:text-red-600"/>
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 text-sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white p-5 space-y-4 shadow-lg">
          {mainLinks.map((link) => (
            <Link key={link.name} to={link.path} className="block text-lg font-semibold">
              {link.name}
            </Link>
          ))}

          <Link to="/post-property">
            <Button className="w-full bg-black text-white">
              Post Property
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
