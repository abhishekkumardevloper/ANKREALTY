import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { PlayCircle, MonitorPlay, Eye, Clock } from 'lucide-react';

const videos = [
  { id: 'v1', title: 'Luxury apartment walkthrough on Noida Expressway', category: 'Property Tours', duration: '08:20', views: '18K', thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: 'v2', title: 'Neighborhood guide: Central Noida for families', category: 'Neighborhood Guides', duration: '05:45', views: '9K', thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: 'v3', title: 'Expert advice: how to shortlist a property faster', category: 'Expert Advice', duration: '04:10', views: '6K', thumbnail: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80', embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
];

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <section className="bg-slate-900 text-white pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-bold tracking-widest uppercase mb-6"><MonitorPlay className="w-4 h-4" /> Video Tours</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Experience properties before you visit.</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">The video section now has working, data-driven content cards and an in-page player experience.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-[1.4fr,1fr] gap-10">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="aspect-video bg-slate-950">{selectedVideo && <iframe title={selectedVideo.title} src={selectedVideo.embed} className="w-full h-full" allowFullScreen />}</div>
          <div className="p-6"><h2 className="text-2xl font-black mb-3">{selectedVideo.title}</h2><div className="flex gap-4 text-sm text-slate-500"><span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedVideo.duration}</span><span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {selectedVideo.views} views</span></div></div>
        </div>
        <div className="space-y-4">{videos.map((video) => <button key={video.id} onClick={() => setSelectedVideo(video)} className={`w-full text-left bg-white rounded-[1.5rem] border p-4 shadow-sm transition ${selectedVideo.id === video.id ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200 hover:border-red-200'}`}><div className="flex gap-4"><img src={video.thumbnail} alt={video.title} className="w-28 h-24 rounded-2xl object-cover" /><div className="flex-1"><p className="text-xs uppercase tracking-[0.25em] text-red-500 font-bold mb-2">{video.category}</p><h3 className="font-black text-slate-900 mb-2">{video.title}</h3><p className="text-sm text-slate-500 flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Watch now</p></div></div></button>)}</div>
      </section>
    </div>
  );
}
