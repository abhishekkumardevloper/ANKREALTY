import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Heart, User, LogOut, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2" data-testid="nav-home-link">
            <Building2 className="h-8 w-8 text-[#C8102E]" />
            <span className="text-2xl font-black tracking-tight">ANK Realty</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/properties?category=buy"
              className="text-sm font-medium text-gray-600 hover:text-[#C8102E] transition-colors"
              data-testid="nav-buy-link"
            >
              Buy
            </Link>
            <Link
              to="/properties?category=sell"
              className="text-sm font-medium text-gray-600 hover:text-[#C8102E] transition-colors"
              data-testid="nav-sell-link"
            >
              Sell
            </Link>
            <Link
              to="/properties?category=rent"
              className="text-sm font-medium text-gray-600 hover:text-[#C8102E] transition-colors"
              data-testid="nav-rent-link"
            >
              Rent
            </Link>
            <Link
              to="/post-property"
              className="text-sm font-medium text-gray-600 hover:text-[#C8102E] transition-colors"
              data-testid="nav-post-property-link"
            >
              Post Property
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" data-testid="nav-dashboard-link">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                </Link>
                {(user.role === 'agent' || user.role === 'admin') && (
                  <Link to="/agent-dashboard" data-testid="nav-agent-dashboard-link">
                    <Button variant="ghost" size="sm">
                      <Building2 className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Agent</span>
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  data-testid="nav-logout-button"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth" data-testid="nav-login-link">
                <button className="btn-primary">Login / Register</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}