import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover_image_url: string;
  reading_time: number;
  created_at: string;
  featured: boolean;
}

const categories = ['All', 'Web Development', 'AI Development', 'UI/UX', 'Business Growth', 'Technology', 'Deployment'];

const categoryColors: Record<string, string> = {
  'Web Development': '#3B82F6',
  'AI Development': '#8B5CF6',
  'UI/UX': '#00E5FF',
  'Business Growth': '#10B981',
  'Technology': '#00FFD1',
  'Deployment': '#F59E0B',
};

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, cover_image_url, reading_time, created_at, featured')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setPosts(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <section id="blog" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/98 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-label mb-5"
          >INSIGHTS & IDEAS</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight"
          >
            <span className="text-white">The</span>{' '}
            <span className="text-gradient-cyan">Knowledge Hub</span>
          </motion.h2>
        </div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-16"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'text-black'
                  : 'text-gray-400 hover:text-white glass border border-white/10 hover:border-white/20'
              }`}
              style={activeCategory === cat ? {
                background: 'linear-gradient(135deg, #00E5FF, #00FFD1)',
              } : {}}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-2xl glass animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No posts in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => {
              const color = categoryColors[post.category] || '#00E5FF';
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.7 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {post.cover_image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img src={post.cover_image_url} alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      {post.featured && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
                          Featured
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={12} style={{ color }} />
                      <span className="text-xs font-medium" style={{ color }}>{post.category}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={11} />
                        <span>{post.reading_time} min read</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium transition-all duration-200 group-hover:gap-2"
                        style={{ color }}>
                        Read more <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
