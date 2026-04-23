import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save, X, Image as ImageIcon, Video, FileText, Plus, Trash2, LayoutTemplate, Building2, IndianRupee, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const emptyForm = {
  title: '', description: '', price: '', category: 'buy', property_type: 'apartment',
  city: '', state: '', location: '', area: '', bhk: '', bathrooms: '', furnishing: 'unfurnished', 
  amenities: '', builder: '', rera: '', projectStatus: 'New Launch', possession: '',
  youtube_link: '', 
  // NEW FIELDS added for the two new sections
  bookingAmount: '', maintenance: '',
  metaTitle: '', metaDescription: ''
};

export default function AddProperty({ onSave, editing, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  
  const [media, setMedia] = useState({
    images: [], videos: [], pdf: null, 
    existingImages: [], existingVideos: [], existingPdf: null   
  });

  const [floorPlans, setFloorPlans] = useState([]);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(form.youtube_link);

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
        bhk: editing.bhk || editing.bedrooms || '',
        bathrooms: editing.bathrooms || '',
        furnishing: editing.furnishing || 'unfurnished',
        amenities: Array.isArray(editing.amenities) ? editing.amenities.join(', ') : (editing.amenities || ''),
        builder: editing.builder || '',
        rera: editing.rera || '',
        projectStatus: editing.projectStatus || 'New Launch',
        possession: editing.possession || '',
        youtube_link: editing.youtube_link || '',
        bookingAmount: editing.bookingAmount || '',
        maintenance: editing.maintenance || '',
        metaTitle: editing.metaTitle || '',
        metaDescription: editing.metaDescription || ''
      });
      setMedia({
        images: [], videos: [], pdf: null,
        existingImages: Array.isArray(editing.images) ? editing.images : (editing.imageUrl ? [editing.imageUrl] : []),
        existingVideos: Array.isArray(editing.videos) ? editing.videos : [],
        existingPdf: editing.brochure || null
      });
      if (editing.floorPlans && Array.isArray(editing.floorPlans)) {
        setFloorPlans(editing.floorPlans.map(fp => ({ ...fp, id: Math.random().toString(), newImage: null })));
      }
    } else {
      setForm(emptyForm);
      setMedia({ images: [], videos: [], pdf: null, existingImages: [], existingVideos: [], existingPdf: null });
      setFloorPlans([]); 
    }
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'images') {
      if (media.images.length + media.existingImages.length + files.length > 10) {
        return toast.error("Maximum 10 property images allowed combined.");
      }
      setMedia({ ...media, images: [...media.images, ...files] });
    } else if (type === 'videos') {
      if (media.videos.length + media.existingVideos.length + files.length > 2) {
        return toast.error("Maximum 2 videos allowed.");
      }
      setMedia({ ...media, videos: [...media.videos, ...files] });
    } else if (type === 'pdf') {
      setMedia({ ...media, pdf: files[0], existingPdf: null }); 
    }
  };

  const removeMedia = (index, type) => {
    if (type === 'pdf') setMedia({ ...media, pdf: null });
    else if (type === 'existingPdf') setMedia({ ...media, existingPdf: null });
    else {
      const updated = [...media[type]];
      updated.splice(index, 1);
      setMedia({ ...media, [type]: updated });
    }
  };

  const addFloorPlan = () => setFloorPlans([...floorPlans, { id: Math.random().toString(), type: '', size: '', price: '', newImage: null, existingImage: null }]);
  const updateFloorPlan = (id, field, value) => setFloorPlans(floorPlans.map(fp => fp.id === id ? { ...fp, [field]: value } : fp));
  const handleFloorPlanImage = (id, file) => setFloorPlans(floorPlans.map(fp => fp.id === id ? { ...fp, newImage: file } : fp));
  const removeFloorPlan = (id) => setFloorPlans(floorPlans.filter(fp => fp.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Property Title is required.");
    if (!form.price) return toast.error("Price is required.");
    if (!form.city) return toast.error("City is required.");
    if (!form.location) return toast.error("Location/Sector is required.");

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'amenities') {
        const amArray = form.amenities.split(',').map(i => i.trim()).filter(Boolean);
        formData.append('amenities', JSON.stringify(amArray)); 
      } else {
        formData.append(key, form[key]);
      }
    });

    if (editing) formData.append('existing_images', JSON.stringify(media.existingImages));

    media.images.forEach(img => formData.append('new_images', img));
    media.videos.forEach(vid => formData.append('new_videos', vid));
    if (media.pdf) formData.append('brochure', media.pdf);

    const cleanFloorPlans = floorPlans.map((fp, index) => {
      if (fp.newImage) formData.append(`floor_plan_image_${index}`, fp.newImage);
      return {
        type: fp.type, size: fp.size, price: fp.price,
        existingImage: fp.existingImage,
        imageIndex: fp.newImage ? index : null 
      };
    });
    formData.append('floorPlans', JSON.stringify(cleanFloorPlans));
    onSave(formData);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
        <div>
          <button type="button" onClick={onCancel} className="text-slate-500 hover:text-[#8B0000] mb-2 flex items-center text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-black text-slate-900">{editing ? 'Edit Property Listing' : 'Create New Property'}</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Fill in the details, add configurations, and upload media.</p>
        </div>
        <Button onClick={handleSubmit} className="bg-[#8B0000] hover:bg-[#600000] text-white font-black h-12 px-8 rounded-xl shadow-lg shadow-[#8B0000]/20 transition-all hover:-translate-y-0.5">
          <Save className="w-4 h-4 mr-2" /> {editing ? 'Save Changes' : 'Publish Property'}
        </Button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6" onSubmit={handleSubmit}>
        
        {/* LEFT COLUMN: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* BASIC INFO */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5 transition-all hover:shadow-md">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#D4AF37]"/> Basic Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-5 pt-2">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Property Title *</label>
                <Input name="title" placeholder="e.g. Luxury 4BHK Villa in Sector 150" value={form.title} onChange={handleChange} required className="h-12 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-medium" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 md:col-span-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm font-medium bg-white focus:border-[#D4AF37] outline-none">
                    <option value="buy">Buy</option>
                    <option value="resale">Resale</option>
                    <option value="construction">Construction</option>
                    <option value="corporate-lease">Corporate Lease</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Property Type</label>
                  <select name="property_type" value={form.property_type} onChange={handleChange} className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm font-medium bg-white focus:border-[#D4AF37] outline-none">
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa / House</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 md:col-span-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Base Area</label>
                  <Input name="area" type="number" placeholder="Sq.ft" value={form.area} onChange={handleChange} className="h-12 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-medium"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">BHK</label>
                  <Input name="bhk" type="number" placeholder="BHK" value={form.bhk} onChange={handleChange} className="h-12 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-medium"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Bathrooms</label>
                  <Input name="bathrooms" type="number" placeholder="Baths" value={form.bathrooms} onChange={handleChange} className="h-12 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-medium"/>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Description</label>
              <Textarea name="description" rows={5} placeholder="Detailed property description..." value={form.description} onChange={handleChange} className="rounded-xl resize-none focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-medium p-4" />
            </div>
          </div>

          {/* NEW SECTION 1: PRICING & FINANCIALS */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5 transition-all hover:shadow-md">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
              <IndianRupee className="w-5 h-5 mr-2 text-[#8B0000]"/> Pricing & Financial Details
            </h2>
            <div className="grid md:grid-cols-3 gap-5 pt-2">
              <div>
                <label className="text-xs font-bold text-[#8B0000] uppercase tracking-widest mb-1 block">Base Price (₹) *</label>
                <Input name="price" type="number" placeholder="e.g. 15000000" value={form.price} onChange={handleChange} required className="h-12 rounded-xl focus:border-[#8B0000] focus:ring-[#8B0000]/20 font-medium border-[#8B0000]/20 bg-red-50/30" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Booking Amount (₹)</label>
                <Input name="bookingAmount" type="number" placeholder="e.g. 500000" value={form.bookingAmount} onChange={handleChange} className="h-12 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-medium" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Maintenance (Monthly)</label>
                <Input name="maintenance" type="number" placeholder="e.g. 5000" value={form.maintenance} onChange={handleChange} className="h-12 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 font-medium" />
              </div>
            </div>
          </div>

          {/* CONFIGURATIONS & FLOOR PLANS */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center">
                <LayoutTemplate className="w-5 h-5 mr-2 text-[#D4AF37]"/> Configurations & Floor Plans
              </h2>
              <Button type="button" onClick={addFloorPlan} variant="outline" className="h-8 text-xs font-bold border-[#8B0000]/20 text-[#8B0000] hover:bg-red-50">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Plan
              </Button>
            </div>
            
            <p className="text-sm text-slate-500 font-medium">Add different unit types (e.g., 3 BHK, 4 BHK + Study) with their specific sizes, prices, and floor plan images.</p>

            <div className="space-y-4 pt-2">
              {floorPlans.length === 0 && (
                 <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-sm text-slate-500 font-medium">No configurations added yet.</p>
                 </div>
              )}
              {floorPlans.map((fp, index) => (
                <div key={fp.id} className="relative bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-[#D4AF37]/50 transition-colors group">
                  <button type="button" onClick={() => removeFloorPlan(fp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4 pr-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Unit Type</label>
                      <Input placeholder="e.g. 3 BHK + Study" value={fp.type} onChange={(e) => updateFloorPlan(fp.id, 'type', e.target.value)} className="h-10 rounded-lg text-sm bg-white" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Super Area</label>
                      <Input placeholder="e.g. 1932 Sq.ft" value={fp.size} onChange={(e) => updateFloorPlan(fp.id, 'size', e.target.value)} className="h-10 rounded-lg text-sm bg-white" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Price</label>
                      <Input placeholder="e.g. 1.72 Cr Onwards" value={fp.price} onChange={(e) => updateFloorPlan(fp.id, 'price', e.target.value)} className="h-10 rounded-lg text-sm bg-white" />
                    </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Floor Plan Image</label>
                     <div className="flex items-center gap-4">
                        {(fp.newImage || fp.existingImage) ? (
                           <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white">
                             <img src={fp.newImage ? URL.createObjectURL(fp.newImage) : fp.existingImage} alt="Floor plan" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                               <label className="cursor-pointer text-white text-xs font-bold hover:underline">Change
                                 <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFloorPlanImage(fp.id, e.target.files[0])} />
                               </label>
                             </div>
                           </div>
                        ) : (
                          <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-white hover:border-[#D4AF37] transition-colors bg-slate-100/50">
                            <ImageIcon className="w-4 h-4 text-slate-400 mr-2" />
                            <span className="text-xs text-slate-500 font-medium">Upload Plan Image</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFloorPlanImage(fp.id, e.target.files[0])} />
                          </label>
                        )}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOCATION & STATUS */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5 transition-all hover:shadow-md">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-[#D4AF37]"/> Location & Status
            </h2>
            <div className="grid md:grid-cols-2 gap-5 pt-2">
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">City *</label><Input name="city" value={form.city} onChange={handleChange} required className="h-12 rounded-xl focus:border-[#D4AF37] font-medium"/></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">State</label><Input name="state" value={form.state} onChange={handleChange} className="h-12 rounded-xl focus:border-[#D4AF37] font-medium"/></div>
              <div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Location / Sector *</label><Input name="location" value={form.location} onChange={handleChange} required className="h-12 rounded-xl focus:border-[#D4AF37] font-medium"/></div>
              
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Builder Name</label><Input name="builder" value={form.builder} onChange={handleChange} placeholder="e.g. Yatharth Group" className="h-12 rounded-xl focus:border-[#D4AF37] font-medium"/></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">RERA Number</label><Input name="rera" value={form.rera} onChange={handleChange} placeholder="e.g. UPRERAPRJ12345" className="h-12 rounded-xl focus:border-[#D4AF37] font-medium"/></div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Project Status</label>
                <select name="projectStatus" value={form.projectStatus} onChange={handleChange} className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm font-medium bg-white focus:border-[#D4AF37] outline-none">
                  <option value="New Launch">New Launch</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready to Move">Ready to Move</option>
                </select>
              </div>
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Possession Date</label><Input name="possession" value={form.possession} onChange={handleChange} placeholder="e.g. Dec 2026" className="h-12 rounded-xl focus:border-[#D4AF37] font-medium"/></div>
              
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Amenities (Comma Separated)</label>
                <div className="relative">
                  <Input name="amenities" value={form.amenities} onChange={handleChange} placeholder="e.g. Swimming Pool, Gym, Club House, 24x7 Security" className="h-12 rounded-xl focus:border-[#D4AF37] font-medium pl-4 pr-10" />
                </div>
              </div>

              {/* YOUTUBE LINK */}
              <div className="md:col-span-2 mt-2 pt-6 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">YouTube Video Link</label>
                <Input name="youtube_link" value={form.youtube_link} onChange={handleChange} placeholder="e.g. https://www.youtube.com/watch?v=..." className="h-12 rounded-xl focus:border-[#D4AF37] font-medium" />

                {form.youtube_link && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">Video Preview</h4>
                    {embedUrl ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border-[4px] border-slate-100 shadow-md">
                        <iframe className="absolute top-0 left-0 w-full h-full opacity-90 hover:opacity-100 transition-opacity" src={embedUrl} title="YouTube Preview" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                      </div>
                    ) : (
                      <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg">Invalid YouTube URL. Please provide a valid link to preview.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NEW SECTION 2: SEO & MARKETING */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5 transition-all hover:shadow-md">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-[#D4AF37]"/> SEO & Marketing Discoverability
            </h2>
            <div className="grid md:grid-cols-2 gap-5 pt-2">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center"><Search className="w-3 h-3 mr-1" /> Meta Title</label>
                <Input name="metaTitle" placeholder="SEO Title (Recommended: 50-60 chars)" value={form.metaTitle} onChange={handleChange} className="h-12 rounded-xl focus:border-[#D4AF37] font-medium" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Meta Description</label>
                <Textarea name="metaDescription" rows={3} placeholder="Brief summary for Google search results..." value={form.metaDescription} onChange={handleChange} className="rounded-xl resize-none focus:border-[#D4AF37] font-medium p-4" />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Media Uploads */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-[#D4AF37]" /> Global Media
            </h2>
            
            {/* Images */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Gallery Images</label>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
                  {media.images.length + media.existingImages.length} / 10
                </span>
              </div>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-[#D4AF37] transition-colors bg-slate-50/50">
                <ImageIcon className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-xs text-slate-500 font-bold">Click to upload property images</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'images')} />
              </label>
              
              <div className="flex flex-wrap gap-3 mt-4">
                {media.existingImages.map((img, idx) => (
                  <div key={`ext-${idx}`} className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                    <img src={img} alt="existing" className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
                    <button type="button" onClick={() => removeMedia(idx, 'existingImages')} className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white rounded-full p-1 transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                {media.images.map((img, idx) => (
                  <div key={`new-${idx}`} className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-sm">
                    <img src={URL.createObjectURL(img)} alt="preview" className="object-cover w-full h-full" />
                    <button type="button" onClick={() => removeMedia(idx, 'images')} className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white rounded-full p-1 transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Videos */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Video Files</label>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">{media.videos.length + media.existingVideos.length} / 2</span>
              </div>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-[#D4AF37] transition-colors bg-slate-50/50">
                <Video className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-500 font-bold">Upload MP4/WebM</span>
                <input type="file" multiple accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'videos')} />
              </label>
              
              <div className="space-y-2 mt-3">
                {media.existingVideos.map((vid, idx) => (
                  <div key={`ev-${idx}`} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-medium">
                    <span className="truncate max-w-[180px] text-slate-700">Existing Video {idx + 1}</span>
                    <button type="button" onClick={() => removeMedia(idx, 'existingVideos')} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                {media.videos.map((vid, idx) => (
                  <div key={`nv-${idx}`} className="flex items-center justify-between bg-[#D4AF37]/5 p-3 rounded-xl border border-[#D4AF37]/30 text-xs font-bold">
                    <span className="truncate max-w-[180px] text-[#8B0000]">{vid.name}</span>
                    <button type="button" onClick={() => removeMedia(idx, 'videos')} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* PDF Brochure */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Project Brochure (PDF)</label>
              <label className={`flex flex-col items-center justify-center w-full h-24 border-2 ${(media.pdf || media.existingPdf) ? 'border-emerald-500 bg-emerald-50' : 'border-dashed border-slate-300 hover:bg-slate-50 hover:border-[#D4AF37] bg-slate-50/50'} rounded-2xl cursor-pointer transition-colors`}>
                <FileText className={`w-6 h-6 mb-1 ${(media.pdf || media.existingPdf) ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold ${(media.pdf || media.existingPdf) ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {(media.pdf || media.existingPdf) ? 'Brochure Attached Successfully' : 'Upload PDF Document'}
                </span>
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} />
              </label>
              
              {media.existingPdf && !media.pdf && (
                <div className="flex items-center justify-between mt-3 px-2 bg-slate-50 py-2 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-600 font-medium truncate max-w-[200px]">Existing_Brochure.pdf</span>
                  <button type="button" onClick={() => removeMedia(0, 'existingPdf')} className="text-[10px] text-red-600 font-black uppercase tracking-widest hover:underline">Remove</button>
                </div>
              )}
              {media.pdf && (
                <div className="flex items-center justify-between mt-3 px-2 bg-emerald-50 py-2 rounded-lg border border-emerald-100">
                  <span className="text-xs text-emerald-700 font-medium truncate max-w-[200px]">{media.pdf.name}</span>
                  <button type="button" onClick={() => removeMedia(0, 'pdf')} className="text-[10px] text-red-600 font-black uppercase tracking-widest hover:underline">Remove</button>
                </div>
              )}
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
