import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Mail, Phone, MapPin, Clock, Send, 
  MessageSquare, Loader2, CheckCircle, Plus
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call delay
    setTimeout(() => {
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      
      // Reset back to idle after a few seconds
      setTimeout(() => setStatus('idle'), 4000);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const FAQS = [
    { question: "Do you charge fees for property viewings?", answer: "No, all our initial property viewings and consultations with our agents are completely free of charge." },
    { question: "How quickly can I sell my house with ANK Realty?", answer: "On average, properties listed with us sell 2.5x faster than the market average. It typically takes 18-30 days depending on the locality." },
    { question: "Do you handle the legal paperwork?", answer: "Yes! We have an in-house legal team that manages all compliance, registration, and paperwork to ensure a seamless transaction." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-red-400 text-sm font-bold tracking-wide mb-6 uppercase">
            <MessageSquare className="w-4 h-4" /> 24/7 Support
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Get in Touch</h1>
          <p className="text-xl text-slate-300 font-light leading-relaxed">
            Whether you are looking to buy, sell, or just want to understand the current market trends, our expert team is here to help.
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          
          {/* LEFT: Contact Form (Spans 3 cols) */}
          <div className="lg:col-span-3 p-8 md:p-14">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Send us a message</h2>
            <p className="text-slate-500 mb-10">We typically reply within 2 hours during business days.</p>
            
            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in h-[400px] flex flex-col justify-center items-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-600">Thank you for reaching out. One of our property experts will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative group">
                    <label className="text-sm font-bold text-slate-700">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none transition-all" 
                      placeholder="e.g. Rahul" 
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-sm font-bold text-slate-700">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none transition-all" 
                      placeholder="e.g. Verma" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none transition-all" 
                    placeholder="rahul@example.com" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">How can we help?</label>
                  <textarea 
                    rows="5" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none transition-all resize-none" 
                    placeholder="I am looking to buy a 3BHK in..." 
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-14 rounded-xl text-lg font-bold shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center"
                >
                  {status === 'submitting' ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-5 h-5 mr-2" /> Send Message</>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* RIGHT: Info Side (Spans 2 cols) */}
          <div className="lg:col-span-2 bg-slate-900 text-white p-8 md:p-12 flex flex-col relative overflow-hidden">
            {/* Decorative background shape */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <div className="relative z-10 flex-1">
              <h2 className="text-3xl font-black mb-8">Contact Info</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                    <MapPin className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Corporate Office</h3>
                    <p className="text-slate-400 leading-relaxed">
                      123 Business Avenue,<br/>Tech Park Area, Mumbai 400001
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                    <Phone className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone & WhatsApp</h3>
                    <p className="text-slate-400">+91 98765 43210</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                    <Mail className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                    <p className="text-slate-400">info@ankrealty.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                    <Clock className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Business Hours</h3>
                    <p className="text-slate-400">Mon-Sat: 10:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Embedded Map */}
            <div className="mt-12 h-56 w-full rounded-2xl overflow-hidden border-2 border-slate-700 relative z-10 shadow-xl shadow-black/30">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1709140000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="ANK Realty Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-16 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-600">Quick answers to questions you may have before reaching out.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-slate-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${activeFaq === index ? 'bg-white shadow-lg border-red-200' : 'bg-white hover:bg-slate-50'}`}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className={`font-bold text-lg ${activeFaq === index ? 'text-red-600' : 'text-slate-900'}`}>{faq.question}</h3>
                <Plus className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeFaq === index ? 'rotate-45 text-red-600' : ''}`} />
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
