import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { X } from 'lucide-react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { DEFAULT_WHY_US, parseJsonArray, type WhyUsItem } from '@/lib/cmsDefaults';

export default function WhyUsSection() {
  const { settings } = useWebsiteSettings();
  const reasons = parseJsonArray<WhyUsItem>(settings.why_us_items, DEFAULT_WHY_US);
  const [open, setOpen] = useState<WhyUsItem | null>(null);

  return (
    <section id="why-us" className="relative py-6 md:py-8 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/97 to-black" />

      <div className="absolute left-1/2 top-20 bottom-20 w-px opacity-5 -translate-x-1/2 hidden lg:block"
        style={{ background: 'linear-gradient(to bottom, transparent, #00E5FF 20%, #00E5FF 80%, transparent)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[10px] sm:text-xs tracking-wider uppercase text-cyan-400 font-mono mb-1.5"
          >
            {settings.why_us_heading}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 max-w-6xl mx-auto">
          {reasons.map((r, index) => {
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>>)[r.icon] || LucideIcons.Zap;
            const delay = index * 0.05;
            return (
              <motion.button
                type="button"
                key={r.title}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => setOpen(r)}
                className="group relative p-2.5 sm:p-4 rounded-lg sm:rounded-xl overflow-hidden text-left transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] flex flex-col justify-between min-h-[115px] sm:min-h-[135px]"
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400/30 group-hover:border-cyan-400 transition-colors" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400/30 group-hover:border-cyan-400 transition-colors" />

                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 20% 20%, ${r.color}15 0%, transparent 70%)` }} />

                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shrink-0"
                      style={{ background: `${r.color}14`, border: `1px solid ${r.color}30` }}
                    >
                      <Icon size={13} className="sm:hidden" style={{ color: r.color }} />
                      <Icon size={15} className="hidden sm:block" style={{ color: r.color }} />
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400 bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wider flex items-center truncate">
                      <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-400 animate-pulse mr-1 shrink-0" />
                      {r.badge}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-white mb-1 leading-tight">
                    {r.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-300 leading-snug line-clamp-2">
                    {r.desc}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${r.color}80, transparent)` }} />
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center px-4 py-6"
            style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-black p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-bold text-white leading-snug">{open.title}</h3>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(null)}
                  className="shrink-0 w-9 h-9 rounded-xl border border-white/10 text-gray-400 hover:text-white"
                >
                  <X size={16} className="mx-auto" />
                </button>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{open.desc}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
