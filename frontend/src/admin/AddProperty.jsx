// src/admin/AddProperty.jsx
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save, UploadCloud, X, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const emptyForm = {
  title: '', description: '', price: '', category: 'buy', property_type: 'apartment',
  city: '', state: '', location: '', area: '', bhk: '', furnishing: 'unfurnished', 
  amenities: '', builder: '', rera: '', projectStatus: 'New Launch', possession: ''
};

export default function AddProperty({ onSave, editing, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  
  // States for handling actual file uploads
  const [media, setMedia] = useState({
    images: [], // File objects
    videos: [], // File objects
    pdf: null,  // File object
    existingImages: [] // Strings (URLs) from editing
  });

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || '',
        description: editing.description || '',
        price: editing.price || '',
        category: editing.category || 'buy',
        property_type: editing.property_type || 'apartment',
        city: editing.city || '',
        state: editing.state || '',
        location: editing.location || '',
        area: editing.area || '',
        bhk: editing.bhk || '',
        furnishing: editing.furnishing || 'unfurnished',
        amenities: Array.isArray(editing.amenities) ? editing.amenities.join(', ') : (editing.amenities || ''),
        builder: editing.builder || '',
        rera: editing.rera || '',
        projectStatus: editing.projectStatus || 'New Launch',
        possession: editing.possession || ''
      });
      setMedia(prev => ({
        ...prev,
        existingImages: Array.isArray(editing.images) ? editing.images : []
      }));
    } else {
      setForm(emptyForm);
      setMedia({ images: [], videos: [], pdf: null, existingImages: [] });
    }
  }, [editing]);

  // Handle Text/Select Inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  // Handle File Uploads (With Limits)
  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    
    if (type === 'images') {
      const totalImages = media.images.length + media.existingImages.length + files.length;
      if (totalImages > 5) {
        toast.error("Maximum 5 images allowed combined.");
        return;
      }
      setMedia({ ...media, images: [...media.images, ...files] });
    } else if (type === 'videos') {
      if (media.videos.length + files.length > 2) {
        toast.error("Maximum 2 videos allowed.");
        return;
      }
      setMedia({ ...media, videos: [...media.videos, ...files] });
    } else if (type === 'pdf') {
      setMedia({ ...media, pdf: files[0] });
    }
  };

  const removeMedia = (index, type) => {
    if (type === 'pdf') {
      setMedia({ ...media, pdf: null });
    } else if (type === 'existingImages') {
      const updated = [...media.existingImages];
      updated.splice(index, 1);
      setMedia({ ...media, existingImages: updated });
    } else {
      const updated = [...media[type]];
      updated.splice(index, 1);
      setMedia({ ...media, [type]: updated });
    }
  };

  const validate = () => {
    const next = {};
    if (form.title.trim().length < 5) next.title = 'Title must be at least 5 characters.';
    if (form.description.trim().length < 15) next.description = 'Description is too short.';
    if (!form.price) next.price = 'Price is required.';
    if (!form.city) next.city = 'City is required.';
    if (!form.location) next.location = 'Location is required.';
    
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the errors in the form.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // We use FormData because we are sending actual files now (images, videos, pdf)
    const formData = new FormData();
    
    // Append all text fields
    Object.keys(form).forEach(key => {
      if (key === 'amenities') {
        const amArray = form.amenities.split(',').map(i => i.trim()).filter(Boolean);
        formData.append('amenities', JSON.stringify(amArray));
      } else {
        formData.append(key, form[key]);
      }
    });

    // Append existing images (so backend knows which ones to keep)
    formData.append('existingImages', JSON.stringify(media.existingImages));

    // Append new files
    media.images.forEach(img => formData.append('new_images', img));
    media.videos.forEach(vid => formData.append('new_videos', vid));
    if (media.pdf) formData.append('brochure', media.pdf);

    // Pass FormData to parent (AdminPanel)
    // Note: AdminPanel's api.post should support multipart/form-data
    onSave(formData);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <button onClick={onCancel} className="text-slate-500 hover:text-[#003B30] mb-2 flex items-center text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-black text-slate-900">{editing ? 'Edit Property Listing' : 'Create New Property Listing'}</h1>
          <p className="text-slate-500 text-sm mt-1">Fill in the details and upload media files for the property.</p>
        </div>
        <Button onClick={handleSubmit} className="bg-[#003B30] hover:bg-[#00261c] text-white font-bold h-11 px-6 rounded-xl shadow-md">
          <Save className="w-4 h-4 mr-2" /> {editing ? 'Save Changes' : 'Publish Property'}
        </Button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Text Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Property Title *</label>
                <Input name="title" placeholder="e.g. Luxury 4BHK Villa" value={form.title} onChange={handleChange} className={`border-slate-200 ${errors.title ? 'border-red-500' : ''}`} />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm bg-white">
                    <option value="buy">Buy</option>
                    <option value="resale">Resale</option>
                    <option value="client-project">Client Project</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Property Type</label>
                  <select name="property_type" value={form.property_type} onChange={handleChange} className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm bg-white">
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="house">Independent House</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Price *</label>
                <Input name="price" type="number" placeholder="e.g. 15000000" value={form.price} onChange={handleChange} className={errors.price ? 'border-red-500' : ''} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Area (Sq.ft) / BHK</label>
                <div className="flex gap-3">
                  <Input name="area" type="number" placeholder="Area" value={form.area} onChange={handleChange} />
                  <Input name="bhk" type="number" placeholder="BHK" value={form.bhk} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Description *</label>
              <Textarea name="description" rows={5} placeholder="Detailed property description..." value={form.description} onChange={handleChange} className={errors.description ? 'border-red-500' : ''} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">Location & Extra Details</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div><label className="text-xs font-bold text-slate-700 mb-1 block">City *</label><Input name="city" value={form.city} onChange={handleChange} /></div>
              <div><label className="text-xs font-bold text-slate-700 mb-1 block">State</label><Input name="state" value={form.state} onChange={handleChange} /></div>
              <div className="md:col-span-2"><label className="text-xs font-bold text-slate-700 mb-1 block">Location / Sector *</label><Input name="location" value={form.location} onChange={handleChange} /></div>
              
              <div><label className="text-xs font-bold text-slate-700 mb-1 block">Builder Name</label><Input name="builder" value={form.builder} onChange={handleChange} placeholder="e.g. Yatharth Group" /></div>
              <div><label className="text-xs font-bold text-slate-700 mb-1 block">RERA Number</label><Input name="rera" value={form.rera} onChange={handleChange} placeholder="e.g. UPRERAPRJ12345" /></div>
              
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Project Status</label>
                <select name="projectStatus" value={form.projectStatus} onChange={handleChange} className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm bg-white">
                  <option value="New Launch">New Launch</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready to Move">Ready to Move</option>
                </select>
              </div>
              <div><label className="text-xs font-bold text-slate-700 mb-1 block">Possession Date</label><Input name="possession" value={form.possession} onChange={handleChange} placeholder="e.g. Dec 2026" /></div>
              
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1 block">Amenities (Comma Separated)</label>
                <Input name="amenities" value={form.amenities} onChange={handleChange} placeholder="e.g. Gym, Pool, Power Backup, Security" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media Uploads */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">Media Uploads</h2>
            
            {/* Images */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-700">Images</label>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
                  {media.images.length + media.existingImages.length} / 5 Max
                </span>
              </div>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <ImageIcon className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-xs text-slate-500 font-medium">Click to upload images</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'images')} />
              </label>
              
              {/* Image Previews */}
              <div className="flex flex-wrap gap-2 mt-3">
                {/* Existing Images from API */}
                {media.existingImages.map((img, idx) => (
                  <div key={`ext-${idx}`} className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img src={img} alt="existing" className="object-cover w-full h-full opacity-80" />
                    <button type="button" onClick={() => removeMedia(idx, 'existingImages')} className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-0.5 hover:bg-red-600 hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                {/* New Image Uploads */}
                {media.images.map((img, idx) => (
                  <div key={`new-${idx}`} className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]">
                    <img src={URL.createObjectURL(img)} alt="preview" className="object-cover w-full h-full" />
                    <button type="button" onClick={() => removeMedia(idx, 'images')} className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-0.5 hover:bg-red-600 hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Videos */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-700">Videos</label>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">{media.videos.length} / 2 Max</span>
              </div>
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <Video className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-500 font-medium">Upload promotional videos</span>
                <input type="file" multiple accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'videos')} />
              </label>
              <div className="space-y-2 mt-3">
                {media.videos.map((vid, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                    <span className="truncate max-w-[180px] font-medium text-slate-700">{vid.name}</span>
                    <button type="button" onClick={() => removeMedia(idx, 'videos')} className="text-red-500 hover:bg-red-50 p-1 rounded"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* PDF Brochure */}
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">Brochure (PDF)</label>
              <label className={`flex flex-col items-center justify-center w-full h-20 border-2 ${media.pdf ? 'border-emerald-500 bg-emerald-50' : 'border-dashed border-slate-300 hover:bg-slate-50'} rounded-xl cursor-pointer transition-colors`}>
                <FileText className={`w-5 h-5 mb-1 ${media.pdf ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className={`text-xs font-medium ${media.pdf ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {media.pdf ? 'Brochure Attached' : 'Upload PDF Document'}
                </span>
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} />
              </label>
              {media.pdf && (
                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-xs text-slate-600 truncate max-w-[200px]">{media.pdf.name}</span>
                  <button type="button" onClick={() => removeMedia(0, 'pdf')} className="text-xs text-red-600 font-bold hover:underline">Remove</button>
                </div>
              )}
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
