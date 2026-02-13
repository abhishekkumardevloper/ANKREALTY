import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MapPin, Phone, Mail, Clock, Send, Home 
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send data to your backend
    alert('Thank you for contacting us! We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-900 text-white pt-32 pb-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Get in Touch</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Have a question about a property? Want to sell your home? We are here to help you every step of the way.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information & Map */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">Call Us</h3>
                <p className="text-gray-500 text-sm mb-2">Mon-Fri from 8am to 5pm</p>
                <p className="font-bold text-gray-900">+91 98765 43210</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">Email Us</h3>
                <p className="text-gray-500 text-sm mb-2">Our team is here to help.</p>
                <p className="font-bold text-gray-900">info@ankrealty.com</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg mb-1">Visit Our Office</h3>
              <p className="text-gray-500 text-sm mb-4">Come say hello at our headquarters.</p>
              <p className="font-bold text-gray-900 mb-6">123 Business Avenue, Tech Park, Mumbai, 400001</p>
              
              {/* Map Placeholder */}
              <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=800&q=80" 
                  alt="Map Location" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="secondary" className="shadow-lg">View on Google Maps</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-black mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your Name</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe" 
                    required 
                    className="bg-gray-50 border-gray-200 h-12 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com" 
                    required 
                    className="bg-gray-50 border-gray-200 h-12 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <Input 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="I'm interested in buying a property..." 
                  required 
                  className="bg-gray-50 border-gray-200 h-12 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your requirements..."
                  required
                  className="flex min-h-[150px] w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:bg-white transition-colors"
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 text-lg shadow-lg hover:shadow-red-600/30">
                <Send className="w-4 h-4 mr-2" /> Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0D0D0D] text-white pt-20 pb-10 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Red Carpet of Real Estate.
              </p>
              <div className="flex space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Mail className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><MapPin className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-200">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/properties" className="hover:text-red-500 transition-colors">All Properties</Link></li>
                <li><Link to="/post-property" className="hover:text-red-500 transition-colors">Post a Property</Link></li>
              </ul>
            </div>
            
            {/* ... other footer columns similar to Home ... */}
             <div>
              <h4 className="font-bold text-lg mb-6 text-gray-200">Categories</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/properties?category=buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/properties?category=sell" className="hover:text-red-500 transition-colors">Sell Property</Link></li>
              </ul>
            </div>

             <div>
              <h4 className="font-bold text-lg mb-6 text-gray-200">Contact</h4>
              <div className="space-y-4 text-sm text-gray-400">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-600 shrink-0"/> 123 Business Avenue, Mumbai</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-600 shrink-0"/> info@ankrealty.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2025 ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
