import React from 'react';
import { Building2, Briefcase, CheckCircle2, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';

const advantages = [
  'Portfolio discovery for office, retail, and staff housing requirements',
  'Dedicated account manager with site visit coordination',
  'Commercial lease comparison and documentation support',
  'Fast turnaround for relocation, expansion, and satellite-office needs',
];

export default function CorporateLeasingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="bg-slate-900 text-white pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-red-400 text-sm font-bold uppercase tracking-wider mb-6">
              <Briefcase className="w-4 h-4" /> Corporate Leasing
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">Workspace and staff housing solutions for growing teams.</h1>
            <p className="text-slate-300 text-lg leading-8 max-w-2xl">ANK Realty helps businesses secure premium office spaces, retail units, and relocation-ready residential inventory across Noida, Greater Noida, and Delhi NCR.</p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/contact"><Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-6">Talk to a leasing advisor</Button></Link>
              <a href="tel:+919732300007"><Button variant="outline" className="h-12 px-6 border-white/20 text-white hover:bg-white/10"><PhoneCall className="w-4 h-4 mr-2" /> Call now</Button></a>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 text-slate-900 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center"><Building2 className="w-6 h-6 text-red-600" /></div>
              <div>
                <p className="font-black text-xl">Why teams use ANK Realty</p>
                <p className="text-slate-500 text-sm">Built for HR, admin, founders, and expansion teams.</p>
              </div>
            </div>
            <div className="space-y-4">
              {advantages.map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
