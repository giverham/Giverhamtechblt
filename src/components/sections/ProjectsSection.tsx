import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  tech_stack: string[];
  category: string;
  image_url: string;
  live_url: string;
  case_study_url: string;
}

const fallbackProjects: Project[] = [
  { id: '1', title: 'Evercrest Bank', subtitle: 'Digital Banking Infrastructure', description: 'Next-generation digital banking platform built with real-time transaction processing, automated KYC verification, and enterprise-grade AI fraud detection.', features: ['Real-time Transactions', 'KYC/AML Compliance', 'AI Fraud Detection', 'Multi-currency Wallet'], tech_stack: ['React', 'TypeScript', 'Node.js', 'Supabase', 'Stripe'], category: 'Banking', image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', live_url: '#', case_study_url: '#' },
  { id: '2', title: 'RR Rentals', subtitle: 'Luxury Vehicle & Property Platform', description: 'Premium real estate ecosystem featuring property listings, interactive 3D virtual tours, custom map filters, and automated tenant lease management.', features: ['Interactive Property Map', 'Virtual 3D Tours', 'Automated Leases', 'Tenant Portal'], tech_stack: ['React', 'TypeScript', 'Supabase', 'Mapbox', 'Vercel'], category: 'Real Estate', image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80', live_url: '#', case_study_url: '#' },
  { id: '3', title: 'MarWiz Storefront', subtitle: 'Luxury Brand Storefront', description: 'Luxury e-commerce experience for high-end fashion and horology with AR virtual try-on, AI sizing guides, and automated inventory sync.', features: ['AR Virtual Try-On', 'AI Sizing Assistant', 'Real-time Inventory', 'Multi-currency Checkout'], tech_stack: ['React', 'TypeScript', 'Supabase', 'Stripe', 'Three.js'], category: 'E-Commerce', image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80', live_url: '#', case_study_url: '#' },
  { id: '4', title: 'Giver Studio', subtitle: 'Media & Recording Ecosystem', description: 'State-of-the-art studio management software with interactive session scheduling, real-time artist collaboration, audio stem streaming, and automated invoicing.', features: ['Session Scheduling', 'Real-time Audio Previews', 'Artist Collaboration', 'Automated Billing'], tech_stack: ['React', 'TypeScript', 'Supabase', 'WebRTC', 'Stripe'], category: 'Entertainment', image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80', live_url: '#', case_study_url: '#' },
  { id: '5', title: 'AI Sport Analyst', subtitle: 'Machine Learning Analytics Engine', description: 'Intelligent sports analytics engine delivering predictive match algorithms, real-time player data telemetry, and fantasy draft recommendations.', features: ['Predictive Match AI', 'Player Performance Telemetry', 'Fantasy Draft AI', 'Live Game Stream'], tech_stack: ['React', 'TypeScript', 'OpenAI', 'Supabase', 'Python'], category: 'AI / ML', image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80', live_url: '#', case_study_url: '#' },
];

const CATEGORY_CONFIG: Record<string, { color: string; bg: string }> = {
  Banking:       { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  'Real Estate': { color: '#00FFD1', bg: 'rgba(0,255,209,0.1)' },
  'E-Commerce':  { color: '#00E5FF', bg: 'rgba(0,229,255,0.1)' },
  Entertainment: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  'AI / ML':     { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [active, setActive] = useState(0);

  useEffect(() => {
    const load = () => {
      supabase.from('projects').select('*').eq('published', true).order('sort_order').then(({ data }) => {
        if (data && data.length > 0) {
          setProjects(data.map(p => ({
            ...p,
            subtitle: p.subtitle || fallbackProjects.find(fb => fb.title === p.title)?.subtitle || 'Digital Enterprise Platform'
          })));
        }
      });
    };

    load();
    const channel = supabase
      .channel('projects-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => { load(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const CATEGORIES = ['All', 'Banking', 'Real Estate', 'E-Commerce', 'AI Platforms'];

  const filteredProjects = projects.filter(p => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Banking') return p.category === 'Banking';
    if (selectedCategory === 'Real Estate') return p.category === 'Real Estate';
    if (selectedCategory === 'E-Commerce') return p.category === 'E-Commerce';
    if (selectedCategory === 'AI Platforms') return p.category.includes('AI') || p.category === 'AI / ML' || p.category === 'AI/ML';
    return p.category === selectedCategory;
  });

  const displayProjects = filteredProjects.length > 0 ? filteredProjects : projects;
  const currentProject = displayProjects[active % displayProjects.length] || displayProjects[0] || fallbackProjects[0];
  const cfg = CATEGORY_CONFIG[currentProject.category] || { color: '#00E5FF', bg: 'rgba(0,229,255,0.1)' };

  return (
    <section id="projects" className="relative py-6 md:py-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

      {/* Radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(ellipse, #00E5FF, transparent)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs tracking-wider uppercase text-cyan-400 font-mono mb-2"
          >Projects That Set New Standards</motion.div>
        </div>

        {/* Short Filter Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 md:mb-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActive(0);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${
                  isSelected
                    ? 'text-black bg-gradient-to-r from-cyan-400 to-teal-400 border-transparent shadow-[0_0_20px_rgba(0,229,255,0.25)] scale-105'
                    : 'text-gray-400 hover:text-white glass border-cyan-500/20 hover:border-cyan-500/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Mobile Horizontal Swipe Slider (md:hidden) */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 py-2 px-1">
          {displayProjects.map((proj) => {
            const cardCfg = CATEGORY_CONFIG[proj.category] || { color: '#00E5FF', bg: 'rgba(0,229,255,0.1)' };
            return (
              <div
                key={proj.id}
                className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-center glass p-4 rounded-2xl border border-white/10 flex flex-col justify-between"
                style={{ background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(16px)' }}
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-3 border border-white/10">
                    <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono"
                        style={{ background: cardCfg.bg, color: cardCfg.color, border: `1px solid ${cardCfg.color}35` }}>
                        {proj.category}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base font-bold text-white leading-tight">{proj.title}</h3>
                  <p className="text-xs font-medium text-cyan-400/90 mb-2">{proj.subtitle}</p>
                  
                  {/* Description (1 sentence max / 2 lines) */}
                  <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-3">{proj.description}</p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {proj.tech_stack?.slice(0, 4).map((t, i) => (
                      <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded font-semibold"
                        style={{ background: `${cardCfg.color}15`, color: cardCfg.color, border: `1px solid ${cardCfg.color}30` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <a
                    href={proj.live_url || '#'}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${cardCfg.color}, ${cardCfg.color}bb)`, color: '#000' }}
                  >
                    <ExternalLink size={12} /> Live Preview
                  </a>
                  <a
                    href={proj.case_study_url || '#'}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                  >
                    Case Study <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Main Showcase Layout (hidden md:block) */}
        <div className="hidden md:grid lg:grid-cols-12 gap-6 lg:gap-8 items-center glass p-6 sm:p-8 rounded-3xl border border-white/10"
          style={{ background: 'rgba(5,5,8,0.75)', backdropFilter: 'blur(20px)' }}>

          {/* Left Column: Image Preview */}
          <div className="lg:col-span-7 relative group overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="relative aspect-[16/10] overflow-hidden"
              >
                <img
                  src={currentProject.image_url}
                  alt={currentProject.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category tag overlay */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold font-mono flex items-center gap-1.5"
                    style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}35`, backdropFilter: 'blur(10px)' }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.color }} />
                    {currentProject.category}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Project Details */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full py-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col h-full"
              >
                <div className="mb-4">
                  {/* Category Badge with Glowing/Blinking Live Status Dot */}
                  <div className="flex items-center text-[11px] font-mono font-semibold tracking-wider text-cyan-400 uppercase mb-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2 shadow-[0_0_8px_#00E5FF]" />
                    {currentProject.category} PORTFOLIO
                  </div>

                  {/* Project Main Title */}
                  <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200 leading-tight">
                    {currentProject.title}
                  </h3>

                  {/* Subtitle tag line directly below main title */}
                  <p className="text-sm font-medium text-cyan-400/90 mt-1 mb-3">
                    {currentProject.subtitle}
                  </p>

                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4">
                    {currentProject.description}
                  </p>
                </div>

                {/* Features List — Hidden on mobile, visible on sm+ screens */}
                <div className="hidden sm:block mb-4">
                  <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2">Key Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {currentProject.features?.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                        <CheckCircle2 size={13} className="text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="mb-5">
                  <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProject.tech_stack?.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] md:text-[11px] font-mono px-2.5 py-0.5 rounded-md font-semibold"
                        style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2 mt-auto">
                  <a
                    href={currentProject.live_url || '#'}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}bb)`,
                      color: '#000',
                      boxShadow: `0 0 20px ${cfg.color}35`,
                    }}
                  >
                    <ExternalLink size={13} /> Live Preview
                  </a>
                  <a
                    href={currentProject.case_study_url || '#'}
                    className="btn-secondary text-xs py-2.5 px-4 group"
                  >
                    Case Study
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}