// src/admin/AddProperty.jsx
import React, { useEffect, useState } from "react";
import { 
  Building, MapPin, Info, IndianRupee, Layers, 
  BedDouble, Bath, CheckCircle, ArrowLeft, Save,
  ImagePlus, X
} from "lucide-react";
import { toast } from "sonner"; // Assuming you use Sonner for toasts

/**
 * Props:
 * - onSave(formData)
 * - editing (object | null)
 * - onCancel() (function to go back)
 */

export default function AddProperty({ onSave, editing, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "buy", // Maps to 'category' in backend
    property_type: "apartment",
    status: "pending", // Default to pending for brokers
    city: "",
    location: "", 
    area: "",
    bedrooms: "",
    bathrooms: "",
    size: "", // Changed from 'area' to avoid conflict with Locality/Area
    furnishing: "unfurnished",
  });

  const [errors, setErrors] = useState({});
  
  // States for handling multiple image uploads
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (editing) {
      setForm({
        ...editing,
        type: editing.category || editing.type || "buy", 
        size: editing.size || editing.area || "",
      });
      // Note: If you have existing images from the backend, 
      // you would set them here in a separate state to display them.
    }
  }, [editing]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  }

  // Handle Image Selection (Limiting to 5)
  function handleImageChange(e) {
    const selectedFiles = Array.from(e.target.files);
    
    // Check if adding these exceeds the 5 image limit
    if (imageFiles.length + selectedFiles.length > 5) {
      toast.error("You can only upload a maximum of 5 images.");
      return;
    }

    const newFiles = [...imageFiles, ...selectedFiles];
    setImageFiles(newFiles);

    // Create preview URLs for the newly selected files
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  }

  // Remove an image before uploading
  function removeImage(index) {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    // Release memory
    URL.revokeObjectURL(newPreviews[index]); 
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  }

  function validate() {
    let newErrors = {};
    if (!form.title) newErrors.title = "Property title is required.";
    if (!form.price) newErrors.price = "Listing price is required.";
    if (!form.city) newErrors.city = "City is required.";
    if (!form.area) newErrors.area = "Locality/Area is required.";
    if (imageFiles.length === 0 && !editing) newErrors.images = "At least one image is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0 && newErrors.images) {
      toast.error(newErrors.images);
    }
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Because we are uploading multiple files, we MUST use FormData
    const formData = new FormData();
    
    // Append all text/number fields
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", Number(form.price));
    formData.append("type", form.type);
    formData.append("property_type", form.property_type);
    formData.append("status", form.status);
    formData.append("city", form.city);
    formData.append("location", form.location || form.area);
    formData.append("area", form.area); 
    formData.append("bedrooms", Number(form.bedrooms) || 0);
    formData.append("bathrooms", Number(form.bathrooms) || 0);
    formData.append("size", Number(form.size) || 0);
    formData.append("furnishing", form.furnishing);

    // Append all selected images
    // Note: 'images[]' is the standard array naming convention for PHP/Laravel/Node backends
    imageFiles.forEach((file) => {
      formData.append("images[]", file);
    });

    onSave(formData);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-900 mb-2 flex items-center text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-black text-slate-900">
            {editing ? "Edit Property Listing" : "Create New Property Listing"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Ensure all details are accurate to attract high-quality leads.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={onCancel} type="button" className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} type="button" className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold flex items-center shadow-md transition-all">
            <Save className="w-4 h-4 mr-2" /> {editing ? "Save Changes" : "Publish Listing"}
          </button>
        </div>
      </div>

      <form className="space-y-8">
        
        {/* SECTION 1: BASIC INFO */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
             <Info className="w-5 h-5 text-blue-500" />
             <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Property Title <span className="text-red-500">*</span></label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Luxury 4BHK Sea-Facing Penthouse"
                className={`w-full p-4 bg-slate-50 rounded-xl border outline-none transition-all ${errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Listing Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  <input
                    name="price" type="number" value={form.price} onChange={handleChange}
                    placeholder="e.g. 50000000"
                    className={`w-full p-4 pl-12 bg-slate-50 rounded-xl border outline-none transition-all ${errors.price ? 'border-red-500' : 'border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'}`}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category (Intent)</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 appearance-none font-medium text-slate-700">
                  <option value="buy">For Sale (Buy)</option>
                  <option value="sell">Looking to Sell (Owner)</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 appearance-none font-medium text-slate-700">
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Active (Approved)</option>
                  <option value="sold">Sold / Rented Out</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Description</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                placeholder="Highlight the key features, neighborhood perks, and amenities..."
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 min-h-[120px] resize-y"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: IMAGES (NEW!) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
             <div className="flex items-center gap-2">
               <ImagePlus className="w-5 h-5 text-green-500" />
               <h2 className="text-lg font-bold text-slate-900">Property Images</h2>
             </div>
             <span className="text-sm font-bold text-slate-400">{imageFiles.length} / 5 Uploaded</span>
          </div>

          <div className="space-y-4">
            {/* Image Upload Box */}
            {imageFiles.length < 5 && (
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${errors.images ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50 bg-slate-50'}`}>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
                  <ImagePlus className="w-10 h-10 text-slate-400 mb-3" />
                  <p className="text-slate-700 font-bold">Click to upload images</p>
                  <p className="text-slate-500 text-sm mt-1">Select up to {5 - imageFiles.length} more images (JPEG, PNG).</p>
                </label>
              </div>
            )}

            {/* Image Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                    <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md backdrop-blur-sm">Cover</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: LOCATION & SPECS */}
        <div className="grid md:grid-cols-2 gap-8">
           
           {/* Location */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                 <MapPin className="w-5 h-5 text-red-500" />
                 <h2 className="text-lg font-bold text-slate-900">Location Details</h2>
              </div>
              <div className="space-y-5">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">City <span className="text-red-500">*</span></label>
                    <input
                      name="city" value={form.city} onChange={handleChange} placeholder="e.g. Mumbai"
                      className={`w-full p-3.5 bg-slate-50 rounded-xl border outline-none ${errors.city ? 'border-red-500' : 'border-slate-200 focus:border-blue-500 focus:bg-white'}`}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Locality / Area <span className="text-red-500">*</span></label>
                    <input
                      name="area" value={form.area} onChange={handleChange} placeholder="e.g. Andheri West"
                      className={`w-full p-3.5 bg-slate-50 rounded-xl border outline-none ${errors.area ? 'border-red-500' : 'border-slate-200 focus:border-blue-500 focus:bg-white'}`}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Address (Internal)</label>
                    <input
                      name="location" value={form.location} onChange={handleChange} placeholder="Specific building or street..."
                      className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white"
                    />
                 </div>
              </div>
           </div>

           {/* Specs */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                 <Building className="w-5 h-5 text-purple-500" />
                 <h2 className="text-lg font-bold text-slate-900">Property Specs</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                   <select name="property_type" value={form.property_type} onChange={handleChange} className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 appearance-none">
                     <option value="apartment">Apartment</option>
                     <option value="villa">Villa / House</option>
                     <option value="plot">Plot / Land</option>
                     <option value="commercial">Commercial</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Furnishing</label>
                   <select name="furnishing" value={form.furnishing} onChange={handleChange} className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 appearance-none">
                     <option value="unfurnished">Unfurnished</option>
                     <option value="semi-furnished">Semi-Furnished</option>
                     <option value="fully-furnished">Fully Furnished</option>
                   </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wide mb-2"><BedDouble className="w-3.5 h-3.5 mr-1"/> Beds</label>
                    <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} placeholder="0" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none text-center font-bold text-lg" />
                 </div>
                 <div>
                    <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wide mb-2"><Bath className="w-3.5 h-3.5 mr-1"/> Baths</label>
                    <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} placeholder="0" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none text-center font-bold text-lg" />
                 </div>
                 <div>
                    <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wide mb-2"><Layers className="w-3.5 h-3.5 mr-1"/> Sq.Ft</label>
                    <input name="size" type="number" value={form.size} onChange={handleChange} placeholder="Area" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none text-center font-bold" />
                 </div>
              </div>
           </div>

        </div>

      </form>
    </div>
  );
}