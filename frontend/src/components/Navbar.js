import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, User, LogOut, Building2, Menu, X, Phone, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add shadow and background when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper to check active link
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Buy', path: '/properties?category=buy' },
    { name: 'Sell', path: '/properties?category=sell' },
    { name: 'Rent', path: '/properties?category=rent' },
    { name: 'About', path: '/Aboutpage' },
    { name: 'Contact', path: '/Contactpage' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-red-600 p-1.5 rounded-lg group-hover:bg-red-700 transition-colors">
                <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className={`text-2xl font-black tracking-tight ${isScrolled || isMobileMenuOpen ? 'text-gray-900' : 'text-gray-900 md:text-white'} transition-colors`}>
              ANK Realty
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold transition-colors ${
                  isActive(link.path) 
                    ? 'text-red-600' 
                    : isScrolled ? 'text-gray-600 hover:text-red-600' : 'text-gray-200 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/post-property">
                <Button variant={isScrolled ? "outline" : "secondary"} className="font-bold">
                    Post Property
                </Button>
            </Link>

            {user ? (
              <div className="flex items-center space-x-2 border-l pl-4 border-gray-300">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className={isScrolled ? 'text-gray-900' : 'text-white hover:text-gray-900'}>
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
                    Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md ${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-900" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-gray-700 hover:text-red-600"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
                 <Link to="/post-property" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                    <Button className="w-full bg-gray-900 text-white">Post Property</Button>
                 </Link>
                 {!user && (
                     <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                        <Button variant="outline" className="w-full border-red-600 text-red-600">Login / Register</Button>
                     </Link>
                 )}
                 {user && (
                    <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                 )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
