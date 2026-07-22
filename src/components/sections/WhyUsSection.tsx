import { motion } from 'framer-motion';
import { Palette, Shield, Zap, Brain, Smartphone, Server } from 'lucide-react';

const reasons = [
  { icon: Palette,    title: 'High-Impact UI/UX',     desc: 'Designs that captivate users immediately and drive conversions through clarity, speed, and modern aesthetics.', color: '#00E5FF', badge: 'STATUS: OPTIMIZED', delay: 0 },
  { icon: Brain,      title: 'AI-Powered Features',   desc: 'Intelligent automation, personalization, and LLM integrations that give your product a genuine edge.',        color: '#8B5CF6', badge: 'LLM READY',        delay: 0.05 },
  { icon: Server,     title: 'Scalable Architecture', desc: 'Systems built to handle millions of users with zero downtime and perfect reliability from day one.',           color: '#00FFD1', badge: '99.99% UPTIME',     delay: 0.1 },
  { icon: Zap,        title: 'Blazing Performance',   desc: 'Sub-second load times, 95+ Lighthouse scores, edge networks, and optimized Core Web Vitals.',                 color: '#F59E0B', badge: 'SUB-SECOND',       delay: 0.15 },
  { icon: Shield,     title: 'Enterprise Security',   desc: 'Encryption, RLS, authentication, and compliance baked in — not bolted on.',                                   color: '#3B82F6', badge: 'BANK-GRADE',       delay: 0.2 },
  { icon: Smartphone, title: 'Mobile-First Design',   desc: 'Pixel-perfect experiences across every device and viewport — phones, tablets, and ultra-wide displays.',      color: '#EC4899', badge: 'RESPONSIVE',       delay: 0.25 },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="relative py-10 md:py-14 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/97 to-black" />

      {/* Subtle center line */}
      <div className="absolute left-1/2 top-20 bottom-20 w-px opacity-5 -translate-x-1/2 hidden lg:block"
        style={{ background: 'linear-gradient(to bottom, transparent, #00E5FF 20%, #00E5FF 80%, transparent)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs tracking-wider uppercase text-cyan-400 font-mono mb-2"
          >WHY GIVERHAM TECH</motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold tracking-tight text-white"
          >
            Excellence Is <span className="text-gradient-cyan">Our Standard</span>
          </motion.h2>
        </div>

        {/* Compact Grid Layout (2-column sm: grid, 3-column lg: grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto px-4">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: r.delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="group relative p-3 sm:p-5 rounded-xl overflow-hidden cursor-default transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(0,229,255,0.12)] hover:-translate-y-1 flex flex-col justify-between min-h-[140px]"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* Radial glow fill on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 20% 20%, ${r.color}12 0%, transparent 70%)` }} />

                <div>
                  {/* Top Row: Icon Badge & Tech Status Tag */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Icon Badge Container */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${r.color}14`, border: `1px solid ${r.color}25` }}
                    >
                      <Icon size={16} style={{ color: r.color }} />
                    </div>

                    {/* Sleek HUD Tech Status Badge with Pulsing Dot */}
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/25 uppercase tracking-wider flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse mr-1" />
                      {r.badge}
                    </span>
                  </div>

                  {/* Feature Title & Description */}
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 leading-snug">
                    {r.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {r.desc}
                  </p>
                </div>

                {/* Bottom Border Accent Sweep on Hover */}
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${r.color}60, transparent)` }} />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}