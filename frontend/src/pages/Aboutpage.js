import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, Users, Trophy, Target, 
  MapPin, Mail, Home, ArrowRight, Linkedin, Twitter 
} from 'lucide-react';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Vikram Malhotra",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    bio: "20+ years of experience transforming the Indian real estate landscape."
  },
  {
    id: 2,
    name: "Sanya Kapoor",
    role: "Head of Sales",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Expert in luxury property acquisitions and client relationships."
  },
  {
    id: 3,
    name: "Rohan Das",
    role: "Senior Legal Advisor",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bio: "Ensuring 100% compliance and safety for every transaction."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative py-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">Reimagining Real Estate</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We are not just agents; we are architects of your new life. Discover the story behind ANK Realty.
          </p>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-100 rounded-full z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80" 
              alt="Team Meeting" 
              className="relative z-10 rounded-2xl shadow-2xl border-4 border-white"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl z-20 hidden md:block">
              <p className="text-4xl font-black text-red-600">15+</p>
              <p className="text-sm font-bold text-gray-600 uppercase">Years of Excellence</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2">Our Journey</h2>
            <h3 className="text-4xl font-black mb-6 leading-tight">From a Small Office to <br/>India's Most Trusted Brand</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Founded in 2010, ANK Realty started with a simple mission: to bring transparency to an opaque industry. We realized that buying a home is not just a transaction; it's the biggest emotional and financial investment of a person's life.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Today, we combine cutting-edge technology with good old-fashioned human connection to deliver a seamless experience. We don't just find houses; we find homes.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-red-600 mr-3 mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Transparency</h4>
                  <p className="text-sm text-gray-500">No hidden costs, ever.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-6 w-6 text-red-600 mr-3 mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Customer First</h4>
                  <p className="text-sm text-gray-500">24/7 dedicated support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Our Core Values</h2>
            <p className="text-gray-600">The pillars that stand behind every deal we close.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors">
                <Target className="h-8 w-8 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Integrity</h3>
              <p className="text-gray-500">We do the right thing, even when no one is watching.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors">
                <Trophy className="h-8 w-8 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-gray-500">We aim for the highest standards in every property listing.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors">
                <Users className="h-8 w-8 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-gray-500">We build communities, not just housing complexes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-12">Meet The Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="group relative overflow-hidden rounded-2xl">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-96 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 text-left transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-red-500 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    {member.bio}
                  </p>
                  <div className="flex space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                    <Linkedin className="h-5 w-5 text-white hover:text-red-500 cursor-pointer" />
                    <Twitter className="h-5 w-5 text-white hover:text-red-500 cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER (Consistent with Home Page) */}
      <footer className="bg-[#0D0D0D] text-white pt-20 pb-10 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-200">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/properties" className="hover:text-red-500 transition-colors">All Properties</Link></li>
                <li><Link to="/post-property" className="hover:text-red-500 transition-colors">Post a Property</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-200">Categories</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/properties?category=buy" className="hover:text-red-500 transition-colors">Buy</Link></li>
                <li><Link to="/properties?category=rent" className="hover:text-red-500 transition-colors">Rent</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-200">Contact Us</h4>
              <div className="space-y-4 text-sm text-gray-400">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-600 shrink-0"/> 123 Business Avenue, Tech Park, Mumbai, 400001</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-600 shrink-0"/> info@ankrealty.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2025 ANK Realty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
