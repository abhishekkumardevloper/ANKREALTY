import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Clock, User, ArrowRight, BookOpen, 
  Search, Mail, MapPin, Phone, ChevronRight, TrendingUp, Loader2
} from "lucide-react";

// API Configuration
const API_URL = 'http://127.0.0.1:8000/api/blogs';

const CATEGORIES = ["All", "Market Trends", "Buying Guide", "Selling Tips", "Legal", "Lifestyle"];

// Helper to provide premium fallback images if backend doesn't send one
const getFallbackImage = (id) => {
  const defaultImages = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  ];
  const index = id ? String(id).charCodeAt(0) % defaultImages.length : 0;
  return defaultImages[index];
};

export default function BlogPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // FETCH DATA
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(API_URL);
        // Assuming backend returns an array of blog objects
        setBlogs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filtering Logic
  const filteredBlogs = blogs.filter(post => {
    const matchesCategory = activeCategory === "All" || (post.category && post.category.toLowerCase() === activeCategory.toLowerCase());
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = (post.title && post.title.toLowerCase().includes(searchTerm)) || 
                          (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm)) ||
                          (post.content && post.content.toLowerCase().includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  // Automatically make the first post featured if no specific featured flag exists
  const featuredPost = blogs.find(post => post.featured) || (blogs.length > 0 ? blogs[0] : null);
  
  // Exclude the featured post from the grid if we are on the main view
  const regularPosts = filteredBlogs.filter(post => {
    if (activeCategory === "All" && !searchQuery && featuredPost) {
      return post.id !== featuredPost.id;
    }
    return true;
  });

  // Helper to safely strip HTML tags if your backend sends raw rich-text content instead of an excerpt
  const stripHtml = (html) => {
    if (!html) return "";
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-bold tracking-widest uppercase mb-6">
               <BookOpen className="w-4 h-4" /> ANK Insights
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Real Estate Knowledge, <br/><span className="text-red-500">Simplified.</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg">
              Stay ahead of the market with expert analysis, buying guides, and the latest property trends across India.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search articles, guides, locations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-full h-12 pl-12 pr-4 outline-none focus:border-red-500 focus:bg-slate-800/80 transition-all"
              />
            </div>
          </div>
          
          <div className="md:w-1/2 hidden md:block">
             <div className="relative">
               <div className="absolute inset-0 bg-red-600 blur-[100px] opacity-20 rounded-full"></div>
               <img src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80" alt="Reading Blog" className="rounded-[2.5rem] shadow-2xl relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-slate-800" />
             </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTERS */}
      <section className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto hide-scrollbar py-4 gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                  activeCategory === category 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* 3. FEATURED POST (Only show on 'All' category and no search) */}
            {activeCategory === "All" && !searchQuery && featuredPost && (
              <div className="mb-20">
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-red-600"/> Featured Story
                </h2>
                <div 
                  onClick={() => navigate(`/blog/${featuredPost.id}`)}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col lg:flex-row group cursor-pointer hover:shadow-2xl transition-all duration-300"
                >
                  <div className="lg:w-7/12 h-80 lg:h-auto overflow-hidden relative">
                    <img 
                      src={featuredPost.imageUrl || featuredPost.image || getFallbackImage(featuredPost.id)} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center">
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest w-fit mb-4">
                      {featuredPost.category || "Market Trends"}
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 leading-tight group-hover:text-red-600 transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed line-clamp-3">
                      {featuredPost.excerpt || stripHtml(featuredPost.content).substring(0, 150) + "..."}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{featuredPost.author || "ANK Experts"}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3"/> 
                            {featuredPost.date || (featuredPost.created_at ? new Date(featuredPost.created_at).toLocaleDateString() : "Recently")}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3"/> {featuredPost.readTime || "5 min read"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ALL BLOGS GRID */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-8">
                {searchQuery ? "Search Results" : "Latest Articles"}
              </h2>
              
              {regularPosts.length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                   <Search className="w-12 h-12 text-slate-300 mx-auto mb-4"/>
                   <h3 className="text-xl font-bold text-slate-700">No articles found</h3>
                   <p className="text-slate-500 mt-2">Try a different search term or category.</p>
                   <Button onClick={() => {setSearchQuery(""); setActiveCategory("All");}} className="mt-4 bg-red-50 text-red-600 hover:bg-red-100 font-bold">
                     Clear Search
                   </Button>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <div 
                      key={post.id} 
                      onClick={() => navigate(`/blog/${post.id}`)}
                      className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
                    >
                      <div className="h-56 overflow-hidden relative m-2 rounded-3xl">
                        <img 
                          src={post.imageUrl || post.image || getFallbackImage(post.id)} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                          {post.category || "Article"}
                        </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-black text-slate-900 mb-3 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                          {post.excerpt || stripHtml(post.content).substring(0, 120) + "..."}
                        </p>
                        
                        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{post.author || "ANK Team"}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500">
                              {post.date || (post.created_at ? new Date(post.created_at).toLocaleDateString() : "New")}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-50 text-slate-400 group-hover:text-red-600 transition-colors">
                            <ArrowRight className="w-4 h-4"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* 5. NEWSLETTER CTA SECTION */}
      <section className="py-24 px-6 bg-red-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative z-10">
           <Mail className="w-12 h-12 text-red-500 mx-auto mb-6" />
           <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Never Miss a Market Update</h2>
           <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto">
             Join 50,000+ investors and homeowners. Get our weekly real estate insights and exclusive off-market deals straight to your inbox.
           </p>
           <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
             <input 
               type="email" 
               placeholder="Enter your email address" 
               required
               className="flex-1 h-14 px-6 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-slate-900 font-medium"
             />
             <Button type="submit" className="h-14 px-8 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-lg shadow-xl shrink-0">
               Subscribe Now
             </Button>
           </form>
           <p className="text-xs text-slate-400 mt-4">We respect your privacy. No spam, unsubscribe at any time.</p>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tight">ANK Realty<span className="text-red-600">.</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed pr-4">
                The Red Carpet of Real Estate. We are committed to providing the highest level of service, transparency, and expertise in the Indian real estate market.
              </p>
              <div className="flex space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Mail className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Phone className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/sell" className="hover:text-red-500 transition-colors">Sell Property</Link></li>
                <li><Link to="/rent" className="hover:text-red-500 transition-colors">Rent Property</Link></li>
                <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Categories</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Apartments</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Villas</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Plots / Land</Link></li>
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Commercial</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Contact Us</h4>
              <div className="space-y-4 text-slate-400 font-medium text-sm">
                <p className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-red-600 shrink-0"/> 123 Business Avenue, Tech Park, Mumbai, 400001</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-3 text-red-600 shrink-0"/> info@ankrealty.com</p>
                <p className="flex items-center"><Phone className="w-5 h-5 mr-3 text-red-600 shrink-0"/> +91 98765 43210</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ANK Realty. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}