// src/admin/PropertyList.jsx
import React, { useState, useMemo } from "react";
import { 
  Search, Filter, Plus, Edit2, Trash2, 
  CheckCircle, Clock, XCircle, MapPin, Loader2,
  BedDouble, Bath, Layers, Image as ImageIcon
} from "lucide-react";

/**
 * Props:
 * - title (string)
 * - listings (array)
 * - loading (boolean)
 * - onEdit (function)
 * - onDelete (function)
 */

export default function PropertyList({
  title = "Property Management",
  listings = [],
  loading = false,
  onEdit = () => {},
  onDelete = () => {},
}) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Memoized Filtering Logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) =>
        typeFilter === "all" ? true : (item.category === typeFilter || item.type === typeFilter)
      )
      .filter((item) =>
        statusFilter === "all" ? true : item.status === statusFilter
      )
      .filter((item) => {
         const searchTerm = search.toLowerCase();
         return (
           item.title?.toLowerCase().includes(searchTerm) ||
           item.city?.toLowerCase().includes(searchTerm) ||
           item.area?.toLowerCase().includes(searchTerm) || // Added area to search
           item.id?.toString().toLowerCase().includes(searchTerm)
         );
      });
  }, [listings, typeFilter, statusFilter, search]);

  // Dynamic Status Badge
  const StatusBadge = ({ status }) => {
    let badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
    let Icon = Clock;

    if (status === "active" || status === "approved") {
      badgeClass = "bg-green-50 text-green-700 border-green-200";
      Icon = CheckCircle;
    } else if (status === "pending") {
      badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
      Icon = Clock;
    } else if (status === "sold" || status === "inactive") {
      badgeClass = "bg-red-50 text-red-700 border-red-200";
      Icon = XCircle;
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize tracking-wider ${badgeClass}`}>
        <Icon className="w-3 h-3 mr-1.5" />
        {status === "approved" ? "active" : status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Manage, edit, and monitor your property inventory.
          </p>
        </div>
        <button 
          onClick={() => onEdit(null)} // Trigger Add New
          className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" /> Add New Property
        </button>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title, city, area or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative w-full lg:w-auto flex items-center">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 appearance-none font-bold text-sm text-slate-700 w-full cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="buy">For Sale (Buy)</option>
              <option value="sell">Owner Selling</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <div className="relative w-full lg:w-auto flex items-center">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 appearance-none font-bold text-sm text-slate-700 w-full cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold / Rented</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="p-5 w-16">#</th>
                <th className="p-5">Property Details</th>
                <th className="p-5">Category</th>
                <th className="p-5">Price / Rent</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                    <p className="text-slate-500">Loading inventory data...</p>
                  </td>
                </tr>
              ) : filteredListings.length > 0 ? (
                filteredListings.map((item, index) => {
                  
                  // Extract cover image safely (assumes backend returns an array of images or a single imageUrl)
                  const coverImage = item.images && item.images.length > 0 ? item.images[0] : item.imageUrl;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-5 text-slate-400 font-mono text-xs align-top pt-6">
                        {index + 1}
                      </td>
                      
                      <td className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Thumbnail */}
                          <div className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                            {coverImage ? (
                              <img src={coverImage} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-slate-300" />
                            )}
                          </div>
                          
                          {/* Info */}
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1 mb-1 text-base">{item.title}</p>
                            <p className="text-xs text-slate-500 flex items-center mb-2">
                              <MapPin className="w-3 h-3 mr-1 text-slate-400"/> {item.city} {item.area ? `, ${item.area}` : ''}
                            </p>
                            
                            {/* Specs row */}
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold bg-slate-50 w-fit px-2 py-1 rounded-md border border-slate-100">
                              {(item.bedrooms || item.bedrooms === 0) && (
                                <span className="flex items-center"><BedDouble className="w-3 h-3 mr-1 text-slate-400"/> {item.bedrooms}</span>
                              )}
                              {(item.bathrooms || item.bathrooms === 0) && (
                                <span className="flex items-center"><Bath className="w-3 h-3 mr-1 text-slate-400"/> {item.bathrooms}</span>
                              )}
                              {item.size && (
                                <span className="flex items-center"><Layers className="w-3 h-3 mr-1 text-slate-400"/> {item.size} sq.ft</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-5 align-top pt-6">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider">
                          {item.category || item.type || "N/A"}
                        </span>
                      </td>

                      <td className="p-5 font-black text-slate-900 align-top pt-6 text-base">
                        ₹ {Number(item.price).toLocaleString('en-IN')}
                      </td>

                      <td className="p-5 align-top pt-6">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="p-5 text-right align-top pt-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                            title="Edit Property"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(item.id)}
                            className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-900 font-bold text-lg">No properties found</p>
                    <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
           <span>Showing {filteredListings.length} entries</span>
        </div>
      </div>
    </div>
  );
}