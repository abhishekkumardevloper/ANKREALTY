import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const emptyForm = {
  title: '', description: '', price: '', category: 'sell', property_type: 'apartment', city: '', state: '', location: '', area: '', bhk: '', furnishing: 'unfurnished', amenities: '', images: '',
};

export default function AddProperty({ onSave, editing, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || '',
        description: editing.description || '',
        price: editing.price || '',
        category: editing.category || 'sell',
        property_type: editing.property_type || 'apartment',
        city: editing.city || '',
        state: editing.state || '',
        location: editing.location || '',
        area: editing.area || '',
        bhk: editing.bhk || '',
        furnishing: editing.furnishing || 'unfurnished',
        amenities: (editing.amenities || []).join(', '),
        images: (editing.images || []).join('\n'),
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  const payload = useMemo(() => ({
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    location: form.location.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    property_type: form.property_type,
    category: form.category,
    bhk: form.bhk ? Number(form.bhk) : null,
    area: Number(form.area),
    furnishing: form.furnishing,
    amenities: form.amenities.split(',').map((item) => item.trim()).filter(Boolean),
    images: form.images.split('\n').map((item) => item.trim()).filter(Boolean),
    latitude: null,
    longitude: null,
  }), [form]);

  const validate = () => {
    const next = {};
    if (payload.title.length < 8) next.title = 'Title is required.';
    if (payload.description.length < 20) next.description = 'Description is required.';
    if (!payload.price) next.price = 'Price is required.';
    if (!payload.city) next.city = 'City is required.';
    if (!payload.state) next.state = 'State is required.';
    if (!payload.location) next.location = 'Location is required.';
    if (!payload.area) next.area = 'Area is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(payload);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-900 mb-2 flex items-center text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard</button>
          <h1 className="text-2xl font-black text-slate-900">{editing ? 'Edit Property Listing' : 'Create New Property Listing'}</h1>
          <p className="text-slate-500 text-sm mt-1">This form uses the same JSON contract as the public sell/post-property flow.</p>
        </div>
        <Button onClick={handleSubmit} className="bg-slate-900 hover:bg-black"><Save className="w-4 h-4 mr-2" /> {editing ? 'Save Changes' : 'Create Listing'}</Button>
      </div>
      <form className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4"><Input placeholder="Property title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><p className="text-sm text-red-600">{errors.title}</p><Textarea rows={6} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><p className="text-sm text-red-600">{errors.description}</p><Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /><p className="text-sm text-red-600">{errors.price}</p><Input type="number" placeholder="Area (sqft)" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} /><p className="text-sm text-red-600">{errors.area}</p><Input type="number" placeholder="BHK" value={form.bhk} onChange={(e) => setForm({ ...form, bhk: e.target.value })} /></div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 border rounded-md"><option value="buy">Buy</option><option value="sell">Sell</option><option value="rent">Rent</option></select><select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="w-full h-10 px-3 border rounded-md"><option value="apartment">Apartment</option><option value="villa">Villa</option><option value="house">House</option><option value="commercial">Commercial</option><option value="plot">Plot</option></select><Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /><p className="text-sm text-red-600">{errors.city}</p><Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /><p className="text-sm text-red-600">{errors.state}</p><Input placeholder="Location / Sector" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /><p className="text-sm text-red-600">{errors.location}</p><Input placeholder="Amenities (comma separated)" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} /><Textarea rows={5} placeholder="Image URLs (one per line)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} /></div>
      </form>
    </div>
  );
}
