import React from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900">Get in Touch</h1>
          <p className="text-gray-600 mt-4">We are here to answer your questions about buying, selling, or renting.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Contact Form */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" className="w-full p-3 bg-gray-50 rounded border border-gray-200 focus:border-red-600 outline-none" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" className="w-full p-3 bg-gray-50 rounded border border-gray-200 focus:border-red-600 outline-none" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="w-full p-3 bg-gray-50 rounded border border-gray-200 focus:border-red-600 outline-none" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea rows="4" className="w-full p-3 bg-gray-50 rounded border border-gray-200 focus:border-red-600 outline-none" placeholder="I'm interested in..." />
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-6">Send Message</Button>
            </form>
          </div>

          {/* Info Side */}
          <div className="bg-gray-900 text-white p-8 md:p-12 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-red-500 w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-bold">Head Office</h3>
                    <p className="text-gray-400">123 Real Estate Blvd,<br/>Beverly Hills, CA 90210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="text-red-500 w-6 h-6" />
                  <div>
                    <h3 className="font-bold">Phone</h3>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="text-red-500 w-6 h-6" />
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-gray-400">hello@realestate.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="text-red-500 w-6 h-6" />
                  <div>
                    <h3 className="font-bold">Hours</h3>
                    <p className="text-gray-400">Mon-Fri: 9am - 6pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-10 h-48 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
               <span className="text-gray-500 italic">Interactive Map Component</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
