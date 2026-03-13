import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, Play, Clock, Eye, Youtube, MapPin, 
  X, MonitorPlay, ArrowRight, Mail, Phone, Home, Loader2
} from "lucide-react";

// API Configuration
const API_URL = 'http://127.0.0.1:8000/api/videos';

const CATEGORIES = ["All", "Property Tours", "Neighborhood Guides", "Expert Advice", "Testimonials"];

// Helper to provide premium fallback thumbnails if backend doesn't send one
const getFallbackThumbnail = (id) => {
  const defaultThumbnails = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
  ];
  const index = id ? String(id).charCodeAt(0) % defaultThumbnails.length : 0;
  return defaultThumbnails[index];
};

// Helper to convert standard YouTube links to embed links for the modal player
const getEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  if (url.includes("youtu.be/")) {
    return url.replace("youtu.be/", "youtube.com/embed/");
  }
  return url; // Return as-is if it's already an embed link or Vimeo
};

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // FETCH DATA
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(API_URL);
        // Assuming backend returns an array of video objects
        setVideos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Filtering Logic
  const filteredVideos = videos.filter(vid => {
     // If backend doesn't have categories yet, default to "Property Tours"
     const vidCategory = vid.category || "Property Tours";
     return activeCategory === "All" ? true : vidCategory === activeCategory;
  });

  // Automatically make the first video featured if no specific featured flag exists
  const featuredVideo = videos.find(vid => vid.featured) || (videos.length > 0 ? videos[0] : null);
  
  // Exclude the featured video from the grid if we are on the main view
  const regularVideos = filteredVideos.filter(vid => {
    if (activeCategory === "All" && featuredVideo) {
      return vid.id !== featuredVideo.id;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900/10 via-slate-900/80 to-slate-900 z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-bold tracking-widest uppercase mb-6">
             <MonitorPlay className="w-4 h-4" /> ANK TV Exclusive
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg">
            Experience Properties <br/><span className="text-red-500">Like Never Before.</span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Immersive 4K property tours, drone neighborhood guides, and expert real estate advice. Step inside your future home from anywhere in the world.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY FILTERS */}
      <section className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto hide-scrollbar py-4 gap-3">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                  activeCategory === category 
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30" 
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
            {/* 3. FEATURED VIDEO (Only show on 'All' category) */}
            {activeCategory === "All" && featuredVideo && (
              <div className="mb-24">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    <PlayCircle className="w-8 h-8 text-red-600"/> Featured Premiere
                  </h2>
                </div>
                
                <div 
                  className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer border border-slate-200"
                  onClick={() => setSelectedVideo(featuredVideo)}
                >
                  <div className="h-[400px] md:h-[600px] w-full relative">
                    <img 
                      src={featuredVideo.thumbnail || getFallbackThumbnail(featuredVideo.id)} 
                      alt={featuredVideo.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-24 h-24 bg-red-600/90 backdrop-blur-md rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-all duration-300 shadow-xl shadow-red-600/50">
                         <Play className="w-10 h-10 ml-2" fill="currentColor" />
                       </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest shadow-sm">
                          {featuredVideo.category || "Property Tours"}
                        </span>
                        <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3"/> {featuredVideo.duration || "10:00"}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-md">
                        {featuredVideo.title}
                      </h3>
                      <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                        <span className="flex items-center gap-1.5"><Eye className="w-4 h-4"/> {featuredVideo.views || "10K+"} Views</span>
                        <span>•</span>
                        <span>Shot in 4K HDR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. VIDEO GRID */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-8">
                {activeCategory === "All" ? "Latest Uploads" : `${activeCategory} Videos`}
              </h2>
              
              {regularVideos.length === 0 ? (
                 <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                   <MonitorPlay className="w-12 h-12 text-slate-300 mx-auto mb-4"/>
                   <h3 className="text-xl font-bold text-slate-700">No videos found</h3>
                   <p className="text-slate-500 mt-2">We are currently shooting more videos for this category.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularVideos.map((video) => (
                    <div 
                      key={video.id} 
                      className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
                      onClick={() => setSelectedVideo(video)}
                    >
                      {/* Thumbnail Area */}
                      <div className="h-60 overflow-hidden relative m-2 rounded-3xl">
                        <img 
                          src={video.thumbnail || getFallbackThumbnail(video.id)} 
                          alt={video.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors"></div>
                        
                        {/* Small Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <div className="w-14 h-14 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg">
                             <Play className="w-6 h-6 ml-1" fill="currentColor" />
                           </div>
                        </div>

                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-bold font-mono">
                          {video.duration || "05:30"}
                        </div>
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                          {video.category || "Video"}
                        </div>
                      </div>
                      
                      {/* Content Area */}
                      <div className="p-6 pt-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-black text-slate-900 mb-3 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                          {video.title}
                        </h3>
                        
                        <div className="mt-auto flex items-center justify-between text-sm text-slate-500 font-medium pt-4 border-t border-slate-50">
                          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-slate-400"/> {video.views || "1K+"}</span>
                          <span className="text-red-600 font-bold flex items-center group-hover:underline">Watch Now <ArrowRight className="w-4 h-4 ml-1"/></span>
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

      {/* 5. YOUTUBE CTA SECTION */}
      <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-red-700 to-red-600 rounded-[3rem] p-10 md:p-16 text-center shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row items-center gap-10">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           
           <div className="md:w-1/3 relative z-10 flex justify-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                 <Youtube className="w-16 h-16 text-red-600" />
              </div>
           </div>
           
           <div className="md:w-2/3 relative z-10 text-center md:text-left">
             <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Join Our Community</h2>
             <p className="text-red-100 text-lg mb-8 font-medium leading-relaxed">
               Subscribe to the ANK Realty YouTube channel. Get notified the second we drop a new luxury property tour or market update.
             </p>
             <Button className="bg-white text-red-600 hover:bg-slate-100 font-black h-14 px-10 rounded-2xl text-lg shadow-xl hover:-translate-y-1 transition-transform">
               Subscribe on YouTube
             </Button>
           </div>
        </div>
      </section>

      {/* --- CINEMATIC VIDEO MODAL --- */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSelectedVideo(null)}></div>
          
          <div className="relative w-full max-w-6xl bg-black rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-slate-800">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none">
               <h3 className="text-white font-bold text-lg drop-shadow-md truncate pr-10">{selectedVideo.title}</h3>
            </div>
            
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-red-600 p-2 rounded-full text-white backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Player (Iframe) */}
            <div className="relative pt-[56.25%] w-full bg-slate-900 flex items-center justify-center">
              {selectedVideo.videoUrl ? (
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={`${getEmbedUrl(selectedVideo.videoUrl)}?autoplay=1&mute=1`} 
                  title={selectedVideo.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <p className="text-slate-500 font-medium">No video URL provided for this listing.</p>
              )}
            </div>
          </div>
        </div>
      )}

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
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Youtube className="w-4 h-4"/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><Phone className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium text-sm">
                <li><Link to="/buy" className="hover:text-red-500 transition-colors">Buy Property</Link></li>
                <li><Link to="/videos" className="hover:text-red-500 transition-colors">Video Tours</Link></li>
                <li><Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
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