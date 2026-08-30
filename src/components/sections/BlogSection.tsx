import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { BLOG_CATEGORIES } from '@/lib/cmsDefaults';

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

const categories = ['All', ...BLOG_CATEGORIES];

const categoryColors: Record<string, string> = {
  'Web Development': '#3B82F6',
  'AI Development': '#8B5CF6',
  'UI/UX': '#00E5FF',
  'Business Growth': '#10B981',
  'Technology': '#00FFD1',
  'Deployment': '#F59E0B',
};

export default function BlogSection() {
  const { settings } = useWebsiteSettings();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
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
    };
    load();
    const channel = supabase
      .channel('blog-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <section id="blog" className="relative py-10 md:py-14 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/98 to-black" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs tracking-wider uppercase text-cyan-400 font-mono mb-2"
          >{settings.blog_heading}</motion.div>
        </div>

        {/* Category Filter Pills (Single scrollable horizontal row) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="flex overflow-x-auto scrollbar-none gap-2 py-2 px-1 mb-5 md:mb-8 justify-start md:justify-center select-none whitespace-nowrap"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeCategory === cat
                  ? 'text-black font-semibold'
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-52 sm:h-72 rounded-2xl glass animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">No posts in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
            {filtered.map((post, i) => {
              const color = categoryColors[post.category] || '#00E5FF';
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.6 }}
                  whileHover={{ y: -5, transition: { duration: 0.25 } }}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div>
                    {/* Compact preview image (2-column friendly on mobile) */}
                    {post.cover_image_url && (
                      <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[110px] sm:max-h-[180px] w-full overflow-hidden">
                        <img src={post.cover_image_url} alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        {post.featured && (
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold"
                            style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
                            Featured
                          </div>
                        )}
                      </div>
                    )}

                    {/* Inner Card Content */}
                    <div className="p-2.5 sm:p-4 md:p-5">
                      <div className="flex items-center gap-1 mb-1 sm:mb-2">
                        <Tag size={10} style={{ color }} className="shrink-0 sm:w-[11px] sm:h-[11px]" />
                        <span className="text-[10px] sm:text-[11px] font-semibold truncate" style={{ color }}>{post.category}</span>
                      </div>

                      <h3 className="text-xs sm:text-base md:text-lg font-bold leading-snug line-clamp-2 text-white group-hover:text-cyan-400 transition-colors mb-1 sm:mb-2">
                        {post.title}
                      </h3>
                      
                      {/* Paragraph Excerpt — Hidden on small screens to maintain 2-col card height balance */}
                      <p className="text-xs md:text-sm text-gray-400 leading-relaxed line-clamp-2 mb-3 hidden sm:block">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Metadata */}
                  <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4 md:px-5 md:pb-5 pt-0 flex items-center justify-between border-t border-white/5 sm:border-t-0 pt-2 sm:pt-0">
                    <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-gray-500">
                      <Clock size={10} className="sm:w-[11px] sm:h-[11px]" />
                      <span>{post.reading_time} min</span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium transition-all duration-200 group-hover:gap-1.5"
                      style={{ color }}>
                      Read <ArrowRight size={11} className="sm:w-[12px] sm:h-[12px]" />
                    </div>
                  </div>

                  {/* Bottom Border Accent on Hover */}
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
