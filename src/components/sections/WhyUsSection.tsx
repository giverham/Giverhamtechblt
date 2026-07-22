import { motion } from 'framer-motion';
import { Palette, Shield, Zap, Brain, Smartphone, Server } from 'lucide-react';

const reasons = [
  { icon: Palette, title: 'High-Impact UI/UX', desc: 'Captivating designs driving conversions through clarity and modern aesthetics.', color: '#00E5FF', badge: 'OPTIMIZED', delay: 0 },
  { icon: Brain, title: 'AI-Powered Features', desc: 'Intelligent automation, personalization, and LLM integrations for a genuine edge.', color: '#8B5CF6', badge: 'LLM READY', delay: 0.05 },
  { icon: Server, title: 'Scalable Architecture', desc: 'Built to handle high volume with zero downtime and total reliability.', color: '#00FFD1', badge: '99.99% UPTIME', delay: 0.1 },
  { icon: Zap, title: 'Blazing Performance', desc: 'Sub-second load times, 95+ Lighthouse scores, and edge network optimizations.', color: '#F59E0B', badge: 'SUB-SECOND', delay: 0.15 },
  { icon: Shield, title: 'Enterprise Security', desc: 'Encryption, RLS, authentication, and compliance baked in from day one.', color: '#3B82F6', badge: 'BANK-GRADE', delay: 0.2 },
  { icon: Smartphone, title: 'Mobile-First Design', desc: 'Pixel-perfect responsive experiences across phones, tablets, and wide displays.', color: '#EC4899', badge: 'RESPONSIVE', delay: 0.25 },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="relative py-8 md:py-14 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/97 to-black" />

      {/* Subtle center line */}
      <div className="absolute left-1/2 top-20 bottom-20 w-px opacity-5 -translate-x-1/2 hidden lg:block"
        style={{ background: 'linear-gradient(to bottom, transparent, #00E5FF 20%, #00E5FF 80%, transparent)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-6 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[10px] sm:text-xs tracking-wider uppercase text-cyan-400 font-mono mb-1.5"
          >
            WHY GIVERHAM TECH
          </motion.div>
        </div>

        {/* 2-Column Grid on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 max-w-6xl mx-auto">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: r.delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="group relative p-2.5 sm:p-4 rounded-lg sm:rounded-xl overflow-hidden cursor-default transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] flex flex-col justify-between min-h-[115px] sm:min-h-[135px]"
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* HUD Sci-Fi Corner Accents */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400/30 group-hover:border-cyan-400 transition-colors" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400/30 group-hover:border-cyan-400 transition-colors" />

                {/* Radial glow fill on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 20% 20%, ${r.color}15 0%, transparent 70%)` }} />

                <div>
                  {/* Top Header Row: Icon inline with Badge (Saves Vertical Space) */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shrink-0"
                      style={{ background: `${r.color}14`, border: `1px solid ${r.color}30` }}
                    >
                      <Icon size={13} className="sm:hidden" style={{ color: r.color }} />
                      <Icon size={15} className="hidden sm:block" style={{ color: r.color }} />
                    </div>

                    {/* HUD Status Tag */}
                    <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400 bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wider flex items-center truncate">
                      <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-400 animate-pulse mr-1 shrink-0" />
                      {r.badge}
                    </span>
                  </div>

                  {/* Title & Shortened Paragraph */}
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-white mb-1 leading-tight">
                    {r.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-300 leading-snug line-clamp-2">
                    {r.desc}
                  </p>
                </div>

                {/* Bottom Border Sweep */}
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${r.color}80, transparent)` }} />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}