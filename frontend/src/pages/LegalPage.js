import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CONTENT = {
  '/privacy': {
    title: 'Privacy Policy',
    intro: 'We respect your privacy and only use customer data to deliver property discovery, advisory, and support services.',
    sections: [
      ['Information we collect', 'We collect contact details, account data, property preferences, and lead forms submitted through the website.'],
      ['How we use information', 'We use submitted details to respond to enquiries, manage property listings, improve search relevance, and provide requested loan or leasing assistance.'],
      ['Security and retention', 'Sensitive account and listing data is retained only as needed for service delivery, compliance, and fraud prevention.'],
    ],
  },
  '/terms': {
    title: 'Terms of Service',
    intro: 'By using ANK Realty, you agree to provide accurate information, comply with local laws, and use the platform only for genuine real estate purposes.',
    sections: [
      ['Listings and leads', 'Property information submitted must be accurate, lawful, and owned or authorized by the person posting it.'],
      ['Platform usage', 'Users must not attempt unauthorized access, abuse forms, scrape data, or impersonate another person or company.'],
      ['Service scope', 'ANK Realty may review, moderate, or remove misleading content and may update product features to improve quality and safety.'],
    ],
  },
};

export default function LegalPage() {
  const { pathname } = useLocation();
  const content = CONTENT[pathname] || CONTENT['/privacy'];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="bg-slate-900 text-white pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-400 font-bold uppercase tracking-[0.3em] text-xs mb-4">ANK Realty</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{content.title}</h1>
          <p className="text-slate-300 max-w-3xl">{content.intro}</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10 space-y-8">
          {content.sections.map(([heading, body]) => (
            <div key={heading}>
              <h2 className="text-2xl font-black text-slate-900 mb-2">{heading}</h2>
              <p className="text-slate-600 leading-7">{body}</p>
            </div>
          ))}
          <div className="pt-6 border-t border-slate-100 text-sm text-slate-500">
            Need help? <Link to="/contact" className="text-red-600 font-bold">Contact our team</Link>.
          </div>
        </div>
      </section>
    </div>
  );
}
