import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 px-6 border-t border-slate-900 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & About (Takes up 4 columns on large screens) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6 text-white">
              <Building2 className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-black tracking-tight">ANK Realty</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-8 pr-4">
              Your trusted partner for premium commercial real estate, corporate leasing, and workspace solutions across Noida, Greater Noida, and Delhi NCR.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links (Takes up 2 columns) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> About Us</Link></li>
              <li><Link to="/properties" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Properties</Link></li>
              <li><Link to="/careers" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Careers</Link></li>
              <li><Link to="/blog" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Insights & Blog</Link></li>
            </ul>
          </div>

          {/* Services (Takes up 3 columns) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Our Services</h4>
            <ul className="space-y-4">
              <li><Link to="/corporate-leasing" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Corporate Leasing</Link></li>
              <li><Link to="/retail" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Retail Spaces</Link></li>
              <li><Link to="/coworking" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Managed Workspaces</Link></li>
              <li><Link to="/residential" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Staff Housing</Link></li>
            </ul>
          </div>

          {/* Contact Info (Takes up 3 columns) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">Sector 62, Noida,<br />Uttar Pradesh 201309</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-500 shrink-0" />
                <a href="tel:+919732300007" className="hover:text-white transition-colors">+91 97323 00007</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <a href="mailto:info@ankrealty.com" className="hover:text-white transition-colors">info@ankrealty.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {currentYear} ANK Realty. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
