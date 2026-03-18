import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Bath, Bed, Building2, Calendar, CheckCircle, Heart, MapPin, Phone, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

const relatedFallback = [
  { id: 'f1', title: 'Experion Saatori', city: 'Noida', location: 'Sector 151', price: 18500000, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
  { id: 'c1', title: 'M3M Line', city: 'Noida', location: 'Sector 72', price: 8000000, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
  { id: 'p1', title: 'Bajrang Vatika', city: 'Noida Extension', location: 'Sector 10', price: 4500000, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
];

const formatPrice = (value) => {
  const price = Number(value || 0);
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} Lac`;
  return `₹ ${price.toLocaleString('en-IN')}`;
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await apiClient.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        const fallback = location.state?.property;
        if (fallback) {
          setProperty({
            ...fallback,
            images: fallback.images?.length ? fallback.images : [fallback.image || fallback.imageUrl || relatedFallback[0].image],
            description: fallback.description || 'Premium property listing with strong connectivity and investment appeal.',
            property_type: fallback.propertyType || fallback.property_type || 'apartment',
          });
        } else {
          toast.error('Property not found');
          navigate('/properties');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, location.state, navigate]);

  const images = useMemo(() => property?.images?.length ? property.images : [property?.image || property?.imageUrl || relatedFallback[0].image], [property]);
  const relatedProperties = useMemo(() => relatedFallback.filter((item) => item.id !== id), [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to send an inquiry.');
      navigate('/auth');
      return;
    }
    try {
      await apiClient.post('/inquiries', { property_id: property.id, message: `Interested buyer: ${leadForm.name || user.name}, phone: ${leadForm.phone}` });
      toast.success('Inquiry sent successfully. Our team will contact you shortly.');
      setLeadForm({ name: '', phone: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to send inquiry right now.');
    }
  };

  const addToFavorites = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/auth');
      return;
    }
    try {
      await apiClient.post('/favorites', { property_id: property.id });
      toast.success('Added to favorites');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to save favorite');
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;
  if (!property) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <Navbar />
      <div className="pt-28 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-red-500 font-bold mb-3">Property details</p>
            <h1 className="text-3xl md:text-5xl font-black mb-3">{property.title}</h1>
            <p className="text-slate-500 flex items-center gap-2 text-lg"><MapPin className="w-5 h-5" /> {property.location}, {property.city}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 min-w-[280px]">
            <p className="text-sm font-semibold text-slate-500 mb-1">Price</p>
            <div className="flex items-center gap-3 text-red-600"><TrendingUp className="w-7 h-7" /><span className="text-3xl md:text-4xl font-black">{property.priceText || formatPrice(property.price)}</span></div>
            <p className="text-xs text-slate-400 mt-2">Visible price is now shown clearly on the property details page.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr,0.8fr] gap-8 mb-14">
          <div>
            <div className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm"><img src={images[selectedImage]} alt={property.title} className="w-full h-[420px] object-cover" /></div>
            <div className="flex gap-3 mt-4 overflow-x-auto">{images.map((img, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`rounded-2xl overflow-hidden border ${selectedImage === index ? 'border-red-500' : 'border-slate-200'}`}><img src={img} alt={`Preview ${index + 1}`} className="w-24 h-20 object-cover" /></button>)}</div>
            <div className="mt-8 grid md:grid-cols-3 gap-4">{[{ label: 'Configuration', value: property.bhk ? `${property.bhk} BHK` : property.property_type }, { label: 'Area', value: `${property.area} sqft` }, { label: 'Status', value: property.status || 'approved' }].map((item) => <div key={item.label} className="p-5 rounded-2xl bg-slate-50 border border-slate-200"><p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold mb-2">{item.label}</p><p className="text-xl font-black text-slate-900">{item.value}</p></div>)}</div>
            <section className="mt-10"><h2 className="text-2xl font-black mb-4">Overview</h2><p className="text-slate-600 leading-8">{property.description}</p></section>
            <section className="mt-10"><h2 className="text-2xl font-black mb-4">Amenities</h2><div className="flex flex-wrap gap-3">{(property.amenities?.length ? property.amenities : ['24/7 Security', 'Power Backup', 'Club House']).map((item) => <span key={item} className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm font-semibold">{item}</span>)}</div></section>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 sticky top-28">
              <div className="flex items-center justify-between mb-5"><h3 className="text-2xl font-black">Contact for best offer</h3><Button variant="outline" onClick={addToFavorites}><Heart className="w-4 h-4 mr-2" /> Save</Button></div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-slate-600"><Bed className="w-5 h-5 text-red-500" /> {property.bhk ? `${property.bhk} BHK` : 'Premium configuration'}</div>
                <div className="flex items-center gap-3 text-slate-600"><Bath className="w-5 h-5 text-red-500" /> {property.furnishing || 'Unfurnished'}</div>
                <div className="flex items-center gap-3 text-slate-600"><Calendar className="w-5 h-5 text-red-500" /> {property.status || 'Available now'}</div>
              </div>
              <form onSubmit={handleInquiry} className="space-y-4">
                <Input placeholder="Your name" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} required />
                <Input placeholder="Phone number" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} required />
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Send inquiry <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </form>
              <a href="tel:+919732300007" className="mt-4 inline-flex items-center text-sm font-bold text-slate-600"><Phone className="w-4 h-4 mr-2 text-red-600" /> Call ANK Realty</a>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6"><h2 className="text-3xl font-black">View more properties</h2><Link to="/properties" className="text-red-600 font-bold">See all listings</Link></div>
          <div className="grid md:grid-cols-3 gap-6">{relatedProperties.map((item) => <Link key={item.id} to={`/property/${item.id}`} state={{ property: item }} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all"><img src={item.image} alt={item.title} className="h-52 w-full object-cover" /><div className="p-6"><h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3><p className="text-slate-500 mb-3">{item.location}, {item.city}</p><div className="flex items-center justify-between"><span className="font-black text-slate-900">{formatPrice(item.price)}</span><span className="text-red-600 font-bold flex items-center">Open <ArrowRight className="w-4 h-4 ml-2" /></span></div></div></Link>)}</div>
        </section>
      </div>

      <footer className="bg-slate-950 text-white pt-16 pb-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div><h3 className="text-3xl font-black mb-3">ANK Realty.</h3><p className="text-slate-400 text-sm">Verified property discovery, pricing help, and trusted support for buyers, sellers, tenants, and investors.</p></div>
          <div><h4 className="font-bold mb-4">Quick Links</h4><div className="space-y-3 text-slate-400 text-sm"><Link to="/buy">Buy</Link><br /><Link to="/sell">Sell</Link><br /><Link to="/rent">Rent</Link></div></div>
          <div><h4 className="font-bold mb-4">Resources</h4><div className="space-y-3 text-slate-400 text-sm"><Link to="/blog">Blog</Link><br /><Link to="/insights">Insights</Link><br /><Link to="/videos">Videos</Link></div></div>
          <div><h4 className="font-bold mb-4">Support</h4><div className="space-y-3 text-slate-400 text-sm"><Link to="/contact">Contact</Link><br /><Link to="/privacy">Privacy</Link><br /><Link to="/terms">Terms</Link></div></div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 text-sm text-slate-500">© {new Date().getFullYear()} ANK Realty. All rights reserved.</div>
      </footer>
    </div>
  );
}
