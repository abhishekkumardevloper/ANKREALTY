import React from 'react';
import { 
  Building2, Briefcase, CheckCircle2, PhoneCall, 
  MapPin, Users, Store, Home, ArrowRight, Shield, 
  Clock, BarChart 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';

const advantages = [
  'Portfolio discovery for office, retail, and staff housing',
  'Dedicated account manager with site visit coordination',
  'Commercial lease comparison and documentation support',
  'Fast turnaround for relocation and satellite-office needs',
];

const services = [
  {
    icon: <Building2 className="w-8 h-8 text-blue-600" />,
    title: 'Premium Office Spaces',
    description: 'Grade-A office spaces, IT Parks, and corporate towers tailored for MNCs, startups, and expanding enterprises.'
  },
  {
    icon: <Store className="w-8 h-8 text-emerald-600" />,
    title: 'Retail & Commercial',
    description: 'High-visibility retail units, high-street shops, and mall spaces situated in prime footfall zones across NCR.'
  },
  {
    icon: <Home className="w-8 h-8 text-orange-600" />,
    title: 'Staff Housing & Relocation',
    description: 'Bulk residential leasing and relocation-ready inventory for executives and growing teams moving to the city.'
  },
  {
    icon: <Users className="w-8 h-8 text-purple-600" />,
    title: 'Managed & Co-working',
    description: 'Flexible, plug-and-play managed workspaces for agile teams looking for zero-CapEx office solutions.'
  }
];

const processSteps = [
  {
    step: '01',
    title: 'Requirement Discovery',
    description: 'We sit down with your HR or Admin team to understand your exact space, budget, and location requirements.'
  },
  {
    step: '02',
    title: 'Curated Shortlisting',
    description: 'Our experts filter through our extensive NCR inventory to present only the properties that match your criteria.'
  },
  {
    step: '03',
    title: 'Site Tours & Evaluation',
    description: 'We coordinate and accompany your team on site visits, providing unbiased evaluations of each property.'
  },
  {
    step: '04',
    title: 'Negotiation & Handover',
    description: 'We handle lease negotiations, legal documentation, and compliance to ensure a smooth, risk-free handover.'
  }
];

export default function CorporateLeasingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Subtle background pattern/gradient */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-red-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-red-400 text-sm font-bold uppercase tracking-wider mb-6">
              <Briefcase className="w-4 h-4" /> Corporate Leasing
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Workspace solutions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">growing teams.</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-8 max-w-2xl">
              ANK Realty helps businesses secure premium office spaces, retail units, and relocation-ready residential inventory across Noida, Greater Noida, and Delhi NCR.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/contact">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-14 px-8 text-lg rounded-xl shadow-lg shadow-red-600/20 transition-all">
                  Talk to an Advisor
                </Button>
              </Link>
              <a href="tel:+919732300007">
                <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/20 text-slate-800 bg-white hover:bg-slate-100 transition-all">
                  <PhoneCall className="w-5 h-5 mr-2" /> Call Now
                </Button>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 text-slate-900 shadow-2xl relative">
            <div className="absolute -top-6 -right-6 bg-slate-800 text-white p-4 rounded-2xl shadow-xl hidden md:block">
              <p className="font-bold text-2xl">500+</p>
              <p className="text-xs text-slate-300 uppercase tracking-wider">Leases Closed</p>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <p className="font-black text-2xl text-slate-900">Why choose ANK Realty</p>
                <p className="text-slate-500 font-medium">Built for HR, admin, and expansion teams.</p>
              </div>
            </div>
            <div className="space-y-4">
              {advantages.map((item) => (
                <div key={item} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 hover:bg-red-50/50 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-slate-700 font-medium leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS / TRUST BANNER */}
      <section className="bg-red-600 text-white py-12 border-b-8 border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-red-500">
          <div>
            <p className="text-4xl font-black mb-2">1M+</p>
            <p className="text-red-100 font-medium text-sm md:text-base">Sq. Ft. Leased</p>
          </div>
          <div>
            <p className="text-4xl font-black mb-2">50+</p>
            <p className="text-red-100 font-medium text-sm md:text-base">Corporate Clients</p>
          </div>
          <div>
            <p className="text-4xl font-black mb-2">15+</p>
            <p className="text-red-100 font-medium text-sm md:text-base">Years Experience</p>
          </div>
          <div>
            <p className="text-4xl font-black mb-2">100%</p>
            <p className="text-red-100 font-medium text-sm md:text-base">Transparent Deals</p>
          </div>
        </div>
      </section>

      {/* 3. OUR SERVICES SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Comprehensive Leasing Solutions</h2>
            <p className="text-slate-600 text-lg">Whether you are a startup looking for your first office or an MNC relocating your workforce, we have the inventory and expertise to help.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS / PROCESS SECTION */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/3">
              <h2 className="text-4xl font-black mb-6">How we make leasing effortless.</h2>
              <p className="text-slate-400 text-lg mb-8">We handle the heavy lifting of commercial real estate so your team can stay focused on growing your business.</p>
              <Link to="/contact">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-12 px-6 rounded-xl">
                  Start Your Search <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="md:w-2/3 grid sm:grid-cols-2 gap-6">
              {processSteps.map((step, index) => (
                <div key={index} className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 relative overflow-hidden group hover:bg-slate-800 transition-colors">
                  <div className="text-6xl font-black text-slate-700/30 absolute -top-4 -right-2 group-hover:text-slate-700/50 transition-colors">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3 relative z-10">{step.title}</h3>
                  <p className="text-slate-400 relative z-10 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA SECTION */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto bg-red-600 rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-700 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to find your next workspace?</h2>
            <p className="text-red-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Share your requirements with our corporate leasing experts today and get a curated list of properties within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 px-8 text-lg rounded-xl w-full sm:w-auto">
                  Schedule a Consultation
                </Button>
              </Link>
              <a href="mailto:info@ankrealty.com">
                <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/30 text-slate-900 bg-white hover:bg-slate-100 w-full sm:w-auto">
                  Email Requirements
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
