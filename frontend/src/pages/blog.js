import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, TrendingUp } from 'lucide-react';
import { newsArticles } from '@/lib/siteData';

const categories = ['All', ...new Set(newsArticles.map((item) => item.category))];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs = useMemo(() => newsArticles.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(searchTerm) || post.excerpt.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  }), [activeCategory, searchQuery]);

  const featuredPost = filteredBlogs.find((post) => post.featured) || filteredBlogs[0];
  const regularPosts = filteredBlogs.filter((post) => post.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <section className="bg-slate-900 text-white pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-bold tracking-widest uppercase mb-6"><BookOpen className="w-4 h-4" /> Resource Center</div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">News, insights, and buying guidance.</h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg">A dynamic editorial feed for investors, owners, and end users. Search and filter instantly.</p>
            <div className="relative max-w-md"><Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" /><input type="text" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-full h-12 pl-12 pr-4 outline-none focus:border-red-500" /></div>
          </div>
          {featuredPost && <img src={featuredPost.image} alt={featuredPost.title} className="rounded-[2rem] shadow-2xl w-full h-[320px] object-cover" />}
        </div>
      </section>
      <section className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto hide-scrollbar py-4 gap-2">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold ${activeCategory === category ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{category}</button>)}</div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-16">
        {featuredPost && <div className="mb-12 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm"><p className="text-red-600 font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Featured</p><h2 className="text-3xl font-black mb-3">{featuredPost.title}</h2><p className="text-slate-600 mb-4 max-w-3xl">{featuredPost.excerpt}</p><div className="text-sm text-slate-400">{featuredPost.date} • {featuredPost.readTime}</div></div>}
        {filteredBlogs.length === 0 ? <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300"><h3 className="text-xl font-bold text-slate-700">No articles found</h3><Button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="mt-4 bg-red-50 text-red-600 hover:bg-red-100">Clear Search</Button></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{regularPosts.map((post) => <Link key={post.id} to="/insights" className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"><img src={post.image} alt={post.title} className="h-56 w-full object-cover" /><div className="p-6"><div className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 mb-3">{post.category}</div><h3 className="text-xl font-black text-slate-900 mb-3">{post.title}</h3><p className="text-slate-500 text-sm leading-7">{post.excerpt}</p></div></Link>)}</div>}
      </section>
    </div>
  );
}
