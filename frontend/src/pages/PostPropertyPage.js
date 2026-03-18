import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MapPin, IndianRupee, Layers, CheckCircle, ArrowRight, ArrowLeft, UploadCloud, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const amenityOptions = ['Parking', 'Gym', 'Swimming Pool', 'Garden', 'Security', 'Power Backup', 'Elevator', 'Club House', 'Kids Play Area'];

const emptyForm = {
  title: '', description: '', price: '', location: '', city: '', state: '',
  property_type: 'apartment', category: 'sell', bhk: '', area: '', furnishing: 'unfurnished',
  amenities: [], images: [], latitude: null, longitude: null,
};

export default function PostPropertyPage() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(emptyForm);

  const canSubmit = useMemo(() => user && !loading, [user, loading]);

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));
  const toggleAmenity = (amenity) => setFormData((prev) => ({ ...prev, amenities: prev.amenities.includes(amenity) ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity] }));

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    if (selectedFiles.length + formData.images.length > 5) {
      toast.error('You can upload a maximum of 5 images.');
      return;
    }
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    updateField('images', [...formData.images, ...urls]);
  };

  const validateStep = (targetStep = step) => {
    const nextErrors = {};
    if (targetStep >= 1) {
      if (formData.title.trim().length < 8) nextErrors.title = 'Add a descriptive title with at least 8 characters.';
      if (formData.description.trim().length < 40) nextErrors.description = 'Description should explain the property in at least 40 characters.';
      if (!Number(formData.price) || Number(formData.price) <= 0) nextErrors.price = 'Enter a valid price.';
      if (!Number(formData.area) || Number(formData.area) <= 0) nextErrors.area = 'Enter a valid super area in sqft.';
    }
    if (targetStep >= 2) {
      if (formData.city.trim().length < 2) nextErrors.city = 'City is required.';
      if (formData.location.trim().length < 3) nextErrors.location = 'Add sector, locality, or landmark.';
      if (formData.state.trim().length < 2) nextErrors.state = 'State is required.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in before posting a property.');
      navigate('/auth');
      return;
    }
    if (!validateStep(2)) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      location: formData.location.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      property_type: formData.property_type,
      category: formData.category,
      bhk: formData.bhk ? Number(formData.bhk) : null,
      area: Number(formData.area),
      furnishing: formData.furnishing,
      amenities: formData.amenities,
      images: formData.images,
      latitude: null,
      longitude: null,
    };

    setLoading(true);
    try {
      await api.post('/properties', payload);
      toast.success('Property submitted successfully. Our team will review it shortly.');
      setFormData(emptyForm);
      setStep(1);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to submit property right now.');
    } finally {
      setLoading(false);
    }
  };

  const ErrorText = ({ message }) => message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <section className="bg-slate-900 text-white pt-32 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-900 z-0" />
        <div className="relative z-10 max-w-4xl mx-auto mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-green-400 text-sm font-bold tracking-wide mb-6 uppercase shadow-xl">
            <CheckCircle className="w-4 h-4" /> Owner-first listing flow
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Post your property with <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">complete details</span></h1>
          <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">A faster, trust-focused flow inspired by leading portals: clear steps, strong validation, and instant submission feedback.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-14 relative z-20 pb-24">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-3 gap-0 border-b border-slate-100">
            {['Basic', 'Location', 'Media'].map((label, index) => (
              <div key={label} className={`p-5 text-center font-bold ${step === index + 1 ? 'bg-red-50 text-red-600' : 'text-slate-500'}`}>{index + 1}. {label}</div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {!user && (
              <div className="flex flex-col md:flex-row md:items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-3 text-amber-700 font-medium"><ShieldCheck className="w-5 h-5" /> Login is required so the listing is saved against your account.</div>
                <Button type="button" onClick={() => navigate('/auth')} className="md:ml-auto bg-slate-900 hover:bg-black">Login to continue</Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label>Property Title</Label>
                  <Input value={formData.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. 3BHK corner apartment near Noida Expressway" className="h-14 mt-2" />
                  <ErrorText message={errors.title} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Category</Label>
                    <select value={formData.category} onChange={(e) => updateField('category', e.target.value)} className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl mt-2">
                      <option value="sell">Sell</option>
                      <option value="buy">Resale / Buy</option>
                      <option value="rent">Rent</option>
                    </select>
                  </div>
                  <div>
                    <Label>Property Type</Label>
                    <select value={formData.property_type} onChange={(e) => updateField('property_type', e.target.value)} className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl mt-2">
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="house">House</option>
                      <option value="commercial">Commercial</option>
                      <option value="plot">Plot</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label>Price</Label>
                    <div className="relative mt-2"><IndianRupee className="absolute left-4 top-4 w-5 h-5 text-slate-400" /><Input type="number" value={formData.price} onChange={(e) => updateField('price', e.target.value)} className="h-14 pl-12" /></div>
                    <ErrorText message={errors.price} />
                  </div>
                  <div>
                    <Label>Area (sqft)</Label>
                    <div className="relative mt-2"><Layers className="absolute left-4 top-4 w-5 h-5 text-slate-400" /><Input type="number" value={formData.area} onChange={(e) => updateField('area', e.target.value)} className="h-14 pl-12" /></div>
                    <ErrorText message={errors.area} />
                  </div>
                  <div>
                    <Label>BHK</Label>
                    <Input type="number" value={formData.bhk} onChange={(e) => updateField('bhk', e.target.value)} className="h-14 mt-2" placeholder="Optional" />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={5} value={formData.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Mention floor, facing, nearby landmarks, furnishing, amenities, and possession details." className="mt-2" />
                  <ErrorText message={errors.description} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div><Label>City</Label><div className="relative mt-2"><MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" /><Input value={formData.city} onChange={(e) => updateField('city', e.target.value)} className="h-14 pl-12" /></div><ErrorText message={errors.city} /></div>
                  <div><Label>State</Label><Input value={formData.state} onChange={(e) => updateField('state', e.target.value)} className="h-14 mt-2" /><ErrorText message={errors.state} /></div>
                  <div><Label>Furnishing</Label><select value={formData.furnishing} onChange={(e) => updateField('furnishing', e.target.value)} className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl mt-2"><option value="unfurnished">Unfurnished</option><option value="semi-furnished">Semi-furnished</option><option value="furnished">Fully furnished</option></select></div>
                </div>
                <div>
                  <Label>Locality / Sector / Landmark</Label>
                  <Input value={formData.location} onChange={(e) => updateField('location', e.target.value)} className="h-14 mt-2" placeholder="e.g. Sector 150, Near metro station" />
                  <ErrorText message={errors.location} />
                </div>
                <div>
                  <Label>Amenities</Label>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {amenityOptions.map((amenity) => (
                      <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} className={`px-4 py-2 rounded-full border text-sm font-bold ${formData.amenities.includes(amenity) ? 'bg-red-50 border-red-500 text-red-600' : 'bg-white border-slate-200 text-slate-600'}`}>{amenity}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center bg-slate-50">
                  <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="font-bold text-slate-900">Add property photos</p>
                  <p className="text-sm text-slate-500 mt-2">Upload up to 5 images. Images are previewed now and sent as URLs until media storage is connected.</p>
                  <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="mt-4 bg-white" />
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {formData.images.map((image, index) => <img key={index} src={image} alt={`Preview ${index + 1}`} className="rounded-2xl h-24 w-full object-cover border border-slate-200" />)}
                  </div>
                )}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-700">After submission, users see a success toast and the listing is stored through the authenticated backend property API.</div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <Button type="button" onClick={prevStep} variant="outline" className="h-12 px-6" disabled={step === 1}><ArrowLeft className="w-4 h-4 mr-2" /> Previous</Button>
              {step < 3 ? <Button type="button" onClick={nextStep} className="h-12 px-6 bg-slate-900 hover:bg-black">Next step <ArrowRight className="w-4 h-4 ml-2" /></Button> : <Button type="submit" disabled={!canSubmit} className="h-12 px-6 bg-red-600 hover:bg-red-700">{loading ? 'Submitting...' : 'Submit property'}</Button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
