// src/pages/VideosPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { PlayCircle, MonitorPlay, Eye, Clock, Video, Loader2, Building } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_URL || "https://ankrealty.onrender.com/api";

// Helper to extract YouTube ID
const getYouTubeID = (url) => {
  if (!url) return null;
  let videoId = '';
  if (url.includes('youtube.com/watch')) {
    videoId = new URLSearchParams(new URL(url).search).get('v');
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1]?.split('?')[0];
  }
  return videoId;
};

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllVideos = async () => {
      setLoading(true);
      try {
        // Fetch YouTube Promos and Properties simultaneously
        const [ytRes, propRes] = await Promise.all([
          axios.get(`${API_BASE}/youtube-videos`),
          axios.get(`${API_BASE}/properties?limit=50`)
        ]);

        const formattedVideos = [];

        // 1. Process YouTube Videos
        if (ytRes.data) {
          ytRes.data.forEach(yt => {
            const ytId = getYouTubeID(yt.videoUrl);
            if (ytId) {
              formattedVideos.push({
                id: yt.id,
                title: yt.title || 'Promotional Video',
                category: 'Promotional Tour',
                type: 'youtube',
                embed: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`,
                thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
                duration: 'Promo',
                views: 'New',
                description: yt.description
              });
            }
          });
        }

        // 2. Process Native Property Videos (from Admin Add Property)
        if (propRes.data) {
          propRes.data.forEach(prop => {
            if (prop.videos && prop.videos.length > 0) {
              // Take the first video of the property
              formattedVideos.push({
                id: `prop-${prop.id}`,
                title: `${prop.title} - Virtual Tour`,
                category: 'Property Tour',
                type: 'native',
                url: prop.videos[0], // Supabase video URL
                thumbnail: prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', // Use first image as thumbnail
                duration: 'Tour',
                views: prop.views || 0,
                description: prop.description || `${prop.bhk} BHK ${prop.property_type} in ${prop.location}, ${prop.city}.`
              });
            }
          });
        }

        setVideos(formattedVideos);
        if (formattedVideos.length > 0) {
          setSelectedVideo(formattedVideos[0]); // Auto-select the first video
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllVideos();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#D4AF37]/30">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <section className="bg-[#050505] text-white pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505] z-0" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 animate-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#8B0000]/20 border border-[#8B0000]/40 text-red-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_30px_rgba(139,0,0,0.2)]">
            <MonitorPlay className="w-4 h-4" /> Video Tours & Promos
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Experience properties <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8000]">before you visit.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Take virtual walkthroughs of our premium real estate inventory and catch up on the latest market insights.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-600">Loading Videos...</h3>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
            <Video className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-slate-800 mb-2">No Videos Available</h3>
            <p className="text-slate-500">Check back soon for new property tours and promotional content.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.6fr,1fr] gap-8 lg:gap-10">
            
            {/* PLAYER SECTION */}
            <div className="flex flex-col space-y-6">
              <div className="bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden relative">
                <div className="aspect-video bg-black relative">
                  {selectedVideo?.type === 'youtube' ? (
                    <iframe 
                      key={selectedVideo.id} // Forces iframe reload when video changes
                      title={selectedVideo.title} 
                      src={selectedVideo.embed} 
                      className="w-full h-full absolute inset-0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen 
                    />
                  ) : selectedVideo?.type === 'native' ? (
                    <video 
                      key={selectedVideo.id}
                      controls 
                      autoPlay
                      poster={selectedVideo.thumbnail}
                      className="w-full h-full absolute inset-0 object-contain bg-black"
                    >
                      <source src={selectedVideo.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                </div>
              </div>

              {/* VIDEO DETAILS */}
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-[#8B0000] text-[10px] font-black uppercase tracking-widest mb-4">
                  {selectedVideo?.type === 'native' ? <Building className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                  {selectedVideo?.category}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">{selectedVideo?.title}</h2>
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500 mb-6 pb-6 border-b border-slate-100">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Clock className="w-4 h-4 text-[#D4AF37]" /> {selectedVideo?.duration}</span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Eye className="w-4 h-4 text-emerald-500" /> {selectedVideo?.views} views</span>
                </div>
                {selectedVideo?.description && (
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {selectedVideo.description}
                  </p>
                )}
              </div>
            </div>

            {/* VIDEO PLAYLIST (RIGHT SIDEBAR) */}
            <div className="bg-white rounded-[2.5rem] p-4 sm:p-6 shadow-sm border border-slate-200 h-fit max-h-[850px] flex flex-col">
              <h3 className="text-xl font-black text-slate-900 mb-6 px-2 flex items-center justify-between">
                Up Next 
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{videos.length} Videos</span>
              </h3>
              
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                {videos.map((video) => (
                  <button 
                    key={video.id} 
                    onClick={() => {
                      setSelectedVideo(video);
                      window.scrollTo({ top: 300, behavior: 'smooth' }); // Scrolls up on mobile when video is tapped
                    }} 
                    className={`w-full text-left bg-white rounded-2xl border p-3 transition-all duration-300 group
                      ${selectedVideo?.id === video.id 
                        ? 'border-[#8B0000] shadow-[0_0_15px_rgba(139,0,0,0.1)] ring-1 ring-[#8B0000]/20 bg-red-50/30' 
                        : 'border-slate-100 hover:border-[#D4AF37]/50 hover:shadow-md'
                      }`}
                  >
                    <div className="flex gap-4">
                      <div className="relative w-28 h-20 sm:w-32 sm:h-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                           <PlayCircle className={`w-8 h-8 ${selectedVideo?.id === video.id ? 'text-white' : 'text-white/80 group-hover:text-white'}`} />
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center overflow-hidden">
                        <p className={`text-[10px] uppercase tracking-widest font-black mb-1.5 
                          ${video.type === 'native' ? 'text-[#D4AF37]' : 'text-[#8B0000]'}`}
                        >
                          {video.category}
                        </p>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-[#8B0000] transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 flex items-center mt-auto">
                          {selectedVideo?.id === video.id ? (
                            <span className="text-[#8B0000] flex items-center">Playing Now <div className="w-1.5 h-1.5 bg-[#8B0000] rounded-full ml-2 animate-pulse" /></span>
                          ) : (
                            <span>{video.views} views</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </section>
    </div>
  );
}
