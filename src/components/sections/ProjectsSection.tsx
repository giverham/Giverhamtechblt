import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ExternalLink, ArrowRight, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Project { id: string; title: string; description: string; features: string[]; tech_stack: string[]; category: string; image_url: string; live_url: string; case_study_url: string; }

const fallbackProjects: Project[] = [
  { id: '1', title: 'Evercrest Bank', description: 'Next-generation digital banking with real-time transactions, KYC verification, and AI-powered fraud detection at enterprise scale.', features: ['Real-time Transactions', 'KYC/AML Compliance', 'AI Fraud Detection', 'Multi-currency'], tech_stack: ['React', 'TypeScript', 'Node.js', 'Supabase', 'Stripe'], category: 'Banking', image_url: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg', live_url: '#', case_study_url: '#' },
  { id: '2', title: 'RR Rentals', description: 'Premium real estate platform with property listings, virtual 3D tours, interactive maps, and automated lease management workflows.', features: ['Property Listings', 'Virtual Tours', 'Map Integration', 'Lease Management'], tech_stack: ['React', 'TypeScript', 'Supabase', 'Mapbox', 'Vercel'], category: 'Real Estate', image_url: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg', live_url: '#', case_study_url: '#' },
  { id: '3', title: 'MarWiz Wears & Watches', description: 'Luxury e-commerce for premium fashion and timepieces with AR try-on, AI size recommendations, and a seamless premium checkout experience.', features: ['AR Try-On', 'AI Recommendations', 'Inventory Management', 'Multi-payment'], tech_stack: ['React', 'TypeScript', 'Supabase', 'Stripe', 'Three.js'], category: 'E-Commerce', image_url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', live_url: '#', case_study_url: '#' },
  { id: '4', title: 'Giver Recording Studio', description: 'Professional recording studio management with session booking, real-time collaboration, audio previews, and integrated billing.', features: ['Session Booking', 'Real-time Chat', 'Audio Previews', 'Billing System'], tech_stack: ['React', 'TypeScript', 'Supabase', 'WebRTC', 'Stripe'], category: 'Entertainment', image_url: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg', live_url: '#', case_study_url: '#' },
  { id: '5', title: 'AI Sports Analyst', description: 'AI-powered sports analytics delivering real-time match predictions, player performance dashboards, and fantasy sports recommendations.', features: ['Match Predictions', 'Player Analytics', 'Fantasy Recommendations', 'Live Stats'], tech_stack: ['React', 'TypeScript', 'OpenAI', 'Supabase', 'Python'], category: 'AI / ML', image_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg', live_url: '#', case_study_url: '#' },
];

const CATEGORY_CONFIG: Record<string, { color: string; bg: string }> = {
  Banking:       { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  'Real Estate': { color: '#00FFD1', bg: 'rgba(0,255,209,0.1)' },
  'E-Commerce':  { color: '#00E5FF', bg: 'rgba(0,229,255,0.1)' },
  Entertainment: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  'AI / ML':     { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

function ProjectSlide({ project, isActive }: { project: Project; isActive: boolean }) {
  const cfg = CATEGORY_CONFIG[project.category] || { color: '#00E5FF', bg: 'rgba(0,229,255,0.1)' };

  return (
    <div className="relative w-full h-full">
      {/* Background image */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 8, ease: 'linear' }}
      >
        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.92) 45%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0.7) 100%)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold mb-6"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.color }} />
              {project.category}
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-[0.95] tracking-tight mb-4"
            >
              {project.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="text-gray-400 text-[15px] leading-relaxed mb-8"
            >
              {project.description}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {project.features?.slice(0, 4).map((f, i) => (
                <span key={i} className="text-[11px] px-3 py-1 rounded-full text-gray-400"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {f}
                </span>
              ))}
            </motion.div>

            {/* Tech stack */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
              transition={{ delay: 0.52, duration: 0.6 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {project.tech_stack?.map((t, i) => (
                <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded font-semibold"
                  style={{ background: `${cfg.color}14`, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
                  {t}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex gap-3"
            >
              <a href={project.live_url || '#'}
                className="flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}aa)`, color: '#000', boxShadow: `0 0 20px ${cfg.color}30` }}>
                <ExternalLink size={13} /> Live Demo
              </a>
              <a href={project.case_study_url || '#'} className="btn-secondary text-[13px] py-2.5 px-5 group">
                Case Study <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right side number */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isActive ? 0.12 : 0, scale: isActive ? 1 : 0.5 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-black text-white"
          style={{ fontSize: 'clamp(6rem, 15vw, 14rem)', lineHeight: 1 }}
        >
          0{project.id}
        </motion.div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval>>();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });

  useEffect(() => {
    supabase.from('projects').select('*').eq('published', true).order('sort_order').then(({ data }) => {
      if (data && data.length > 0) setProjects(data);
    });
  }, []);

  useEffect(() => {
    if (!inView || !autoplay) return;
    timer.current = setInterval(() => setActive(p => (p + 1) % projects.length), 5000);
    return () => clearInterval(timer.current);
  }, [inView, autoplay, projects.length]);

  const goTo = (i: number) => {
    setActive(i);
    setAutoplay(false);
    clearInterval(timer.current);
  };

  return (
    <section ref={sectionRef} id="projects" className="relative overflow-hidden">
      {/* Section header */}
      <div className="relative z-10 pt-20 pb-8 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative z-10 section-label mb-6"
        >FEATURED WORK</motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="relative z-10 text-[clamp(2.2rem,5vw,4.5rem)] font-black tracking-tight"
        >
          <span className="text-white">Projects That</span>{' '}
          <span className="text-gradient-cyan">Set New Standards</span>
        </motion.h2>
      </div>

      {/* Fullscreen showcase */}
      <div className="relative h-[80vh] min-h-[560px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={projects[active]?.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <ProjectSlide project={projects[active]} isActive={true} />
          </motion.div>
        </AnimatePresence>

        {/* Project selector — vertical on right */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-2">
          {projects.map((p, i) => (
            <button key={p.id} onClick={() => goTo(i)}
              className={`group relative flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-300 ${
                active === i ? 'glass-md' : 'hover:glass'
              }`}
              style={{ border: active === i ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent' }}
            >
              <div className={`w-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${active === i ? 'h-8 bg-gradient-to-b from-cyan-400 to-teal-400' : 'h-3 bg-gray-700 group-hover:bg-gray-500'}`} />
              <span className={`text-[11px] font-semibold whitespace-nowrap transition-colors duration-200 ${active === i ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                {p.title}
              </span>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px z-20"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            key={active}
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #00E5FF, #00FFD1)' }}
            initial={{ width: '0%' }}
            animate={{ width: autoplay ? '100%' : `${((active + 1) / projects.length) * 100}%` }}
            transition={{ duration: autoplay ? 5 : 0.4, ease: 'linear' }}
          />
        </div>

        {/* Mobile dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 xl:hidden">
          {projects.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? 'w-8 h-2 bg-cyan-400' : 'w-2 h-2 bg-gray-700 hover:bg-gray-500'}`} />
          ))}
        </div>
      </div>

      {/* Project grid teaser */}
      <div className="relative z-10 py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {projects.map((p, i) => {
            const cfg = CATEGORY_CONFIG[p.category] || { color: '#00E5FF', bg: 'rgba(0,229,255,0.1)' };
            return (
              <motion.button
                key={p.id}
                onClick={() => { goTo(i); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 ${
                  active === i ? 'ring-1' : ''
                }`}
                style={{
                  background: active === i ? cfg.bg : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${active === i ? cfg.color + '40' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="text-[10px] font-semibold mb-1" style={{ color: cfg.color }}>{p.category}</div>
                <div className={`text-xs font-bold leading-tight ${active === i ? 'text-white' : 'text-gray-400'}`}>{p.title}</div>
                {active === i && (
                  <div className="absolute top-0 right-0 w-10 h-10 rounded-bl-xl flex items-center justify-center"
                    style={{ background: cfg.bg }}>
                    <ArrowUpRight size={12} style={{ color: cfg.color }} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
