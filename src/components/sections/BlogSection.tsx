import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Tag, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import type { KnowledgeArticle } from '@/lib/knowledgeHub';

type BlogPost = KnowledgeArticle;

const categoryColors: Record<string, string> = {
  'Web Development': '#3B82F6',
  'AI Development': '#8B5CF6',
  'UI/UX': '#00E5FF',
  'Business Growth': '#10B981',
  Technology: '#00FFD1',
  Deployment: '#F59E0B',
  Design: '#EC4899',
  'AI/ML': '#A855F7',
};

export default function BlogSection() {
  const { settings } = useWebsiteSettings();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const load = () => {
      supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, content, category, cover_image_url, created_at, featured')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(8)
        .then(({ data }) => {
          setPosts(((data || []) as BlogPost[]).filter((post) => post.title && post.content).slice(0, 8));
        });
    };
    load();
    const channel = supabase
      .channel('blog-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : (i + 1) % posts.length));
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? i : (i - 1 + posts.length) % posts.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, posts.length]);

  const openPost = openIndex === null ? null : posts[openIndex];
  const color = openPost ? (categoryColors[openPost.category] || '#00E5FF') : '#00E5FF';

  const go = (dir: number) => {
    if (!posts.length || openIndex === null) return;
    setOpenIndex((openIndex + dir + posts.length) % posts.length);
  };

  const onTouchStart = (x: number) => { touchX.current = x; };
  const onTouchEnd = (x: number) => {
    if (touchX.current == null) return;
    const delta = x - touchX.current;
    touchX.current = null;
    if (delta < -50) go(1);
    if (delta > 50) go(-1);
  };

  return (
    <section id="blog" className="relative py-6 md:py-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/98 to-black" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs tracking-wider uppercase text-cyan-400 font-mono mb-2"
          >{settings.blog_heading}</motion.div>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 py-2 px-1">
          {posts.map((post, i) => {
            const cardColor = categoryColors[post.category] || '#00E5FF';
            return (
              <motion.article
                key={post.id || post.slug}
                role="button"
                tabIndex={0}
                onClick={() => setOpenIndex(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenIndex(i); } }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="min-w-[78%] sm:min-w-[320px] max-w-[340px] flex-shrink-0 snap-center group relative rounded-2xl overflow-hidden cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {post.cover_image_url && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <img src={post.cover_image_url} alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                  </div>
                )}
                <div className="p-3.5">
                  <div className="flex items-center gap-1 mb-1.5">
                    <Tag size={10} style={{ color: cardColor }} className="shrink-0" />
                    <span className="text-[10px] font-semibold truncate" style={{ color: cardColor }}>{post.category}</span>
                  </div>
                  <h3 className="text-sm font-bold leading-snug line-clamp-2 text-white group-hover:text-cyan-400 transition-colors mb-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-medium" style={{ color: cardColor }}>
                    Read <ArrowRight size={11} />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {openPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center px-3 sm:px-6 py-4"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpenIndex(null); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="w-full max-w-2xl max-h-[86vh] overflow-y-auto rounded-2xl border border-white/10 bg-black p-4 sm:p-6"
              onTouchStart={(e) => onTouchStart(e.changedTouches[0].clientX)}
              onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color }}>
                    {openPost.category}
                  </p>
                  <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug">{openPost.title}</h3>
                </div>
                <button
                  type="button"
                  aria-label="Close article"
                  onClick={() => setOpenIndex(null)}
                  className="shrink-0 w-9 h-9 rounded-xl border border-white/10 text-gray-400 hover:text-white"
                >
                  <X size={16} className="mx-auto" />
                </button>
              </div>
              {openPost.cover_image_url && (
                <img src={openPost.cover_image_url} alt={openPost.title} className="w-full max-h-56 object-cover rounded-xl mb-4" />
              )}
              {openPost.excerpt && (
                <p className="text-sm text-gray-300 leading-relaxed mb-4">{openPost.excerpt}</p>
              )}
              <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap mb-5">
                {openPost.content}
              </div>
              {posts.length > 1 && (
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <span className="text-[11px] text-gray-500">{(openIndex ?? 0) + 1} / {posts.length}</span>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
