// src/pages/BlogPage.jsx
import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, TrendingUp, ArrowRight, Loader2, FileText, Calendar, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State to handle the currently opened blog in the modal
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch blogs from your real backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_BASE}/blogs`);
        setBlogs(response.data || []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filter based on search query
  const filteredBlogs = useMemo(() => {
    return blogs.filter((post) => {
      const searchTerm = searchQuery.toLowerCase();
      const titleMatch = post.title?.toLowerCase().includes(searchTerm);
      const excerptMatch = post.excerpt?.toLowerCase().includes(searchTerm);
      return titleMatch || excerptMatch;
    });
  }, [blogs, searchQuery]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPost]);

  // Automatically feature the newest post
  const featuredPost = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const regularPosts = filteredBlogs.filter((post) => post.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#D4AF37]/30 relative">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="bg-[#050505] text-white pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505] z-0" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#8B0000]/20 border border-[#8B0000]/40 text-red-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_30px_rgba(139,0,0,0.2)]">
              <BookOpen className="w-4 h-4" /> Resource Center
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight">
              News, insights, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">buying guidance.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed font-light">
              A dynamic editorial feed for investors, owners, and end users. Search and explore the latest real estate trends instantly.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" />
              <input 
                type="text" 
                placeholder="Search articles, keywords..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full h-14 pl-14 pr-6 outline-none focus:border-[#D4AF37] focus:bg-white/20 transition-all font-medium placeholder:text-slate-400 shadow-xl" 
              />
            </div>
          </div>

          {/* Hero Image (Pulls from Featured Post) */}
          <div className="hidden md:block">
            {featuredPost && (
              <div className="relative rounded-[2rem] shadow-2xl shadow-[#8B0000]/20 overflow-hidden group">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={featuredPost.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'} 
                  alt={featuredPost.title} 
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
             <h3 className="text-lg font-bold text-slate-600">Loading Articles...</h3>
           </div>
        ) : (
          <>
            {/* FEATURED POST BAR */}
            {featuredPost && (
              <div 
                onClick={() => setSelectedPost(featuredPost)}
                className="block mb-16 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/50 transition-all group cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <p className="text-[#8B0000] font-bold uppercase tracking-[0.25em] text-xs mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Featured Story
                </p>
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                  <div className="max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 group-hover:text-[#8B0000] transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                      <span className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Calendar className="w-4 h-4 mr-2 text-[#D4AF37]" />
                        {new Date(featuredPost.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="text-[#8B0000] flex items-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                        Read Article <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                  {/* Mobile only image */}
                  <img src={featuredPost.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'} className="w-full h-48 object-cover rounded-xl md:hidden" alt="Featured" />
                </div>
              </div>
            )}

            {/* BLOG GRID */}
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-slate-800 mb-2">No articles found</h3>
                <p className="text-slate-500 mb-6">We couldn't find any news matching your search criteria.</p>
                <Button onClick={() => setSearchQuery('')} className="bg-[#8B0000] hover:bg-[#600000] text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <div 
                    key={post.id} 
                    onClick={() => setSelectedPost(post)}
                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#D4AF37]/40 transition-all duration-300 group flex flex-col cursor-pointer"
                    role="button"
                    tabIndex={0}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                      <img 
                        src={post.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-3">
                        {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>

                      <h3 className="text-xl font-black text-slate-900 mb-3 leading-snug group-hover:text-[#8B0000] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-[#8B0000] transition-colors">Read Full Story</span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#8B0000] flex items-center justify-center transition-colors">
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* --- BLOG READING MODAL --- */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-slate-900/70 backdrop-blur-sm transition-opacity">
          
          {/* Modal Background Click to Close */}
          <div className="absolute inset-0" onClick={() => setSelectedPost(null)}></div>
          
          {/* Modal Content Box */}
          <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Cross Button */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/70 text-white backdrop-blur-md p-2.5 rounded-full transition-all duration-200 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Area */}
            <div className="overflow-y-auto w-full h-full custom-scrollbar pb-12">
              <div className="w-full h-64 sm:h-80 md:h-[400px] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                <img 
                  src={selectedPost.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="px-6 sm:px-12 md:px-16 pt-10">
                <div className="flex items-center gap-3 text-sm font-bold text-[#D4AF37] mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedPost.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                  {selectedPost.title}
                </h2>

                <div className="prose prose-lg prose-slate max-w-none">
                  {/* If your backend returns full content as HTML, it renders here. 
                      Otherwise, it falls back to showing the excerpt */}
                  {selectedPost.content ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                  ) : (
                    <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {selectedPost.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
