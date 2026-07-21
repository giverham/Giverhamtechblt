import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Cpu, Users, Clock } from 'lucide-react';

interface Stat { key: string; label: string; value: string; desc: string; }

const defaultStats: Stat[] = [
  { key: 'stats_projects',     label: 'Projects Delivered', value: '120+', desc: 'Across 12+ industries',    },
  { key: 'stats_technologies', label: 'Technologies Used',  value: '30+',  desc: 'Modern stack expertise',   },
  { key: 'stats_clients',      label: 'Happy Clients',      value: '80+',  desc: 'Worldwide, satisfied',     },
  { key: 'stats_years',        label: 'Years of Excellence', value: '5+',  desc: 'Proven track record',      },
];

const ICONS = [TrendingUp, Cpu, Users, Clock];
const ACCENT_COLORS = ['#00E5FF', '#00FFD1', '#3B82F6', '#8B5CF6'];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur   = 2000;
    const tick  = (now: number) => {
      const p    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function TrustSection() {
  const [stats, setStats] = useState<Stat[]>(defaultStats);

  useEffect(() => {
    supabase
      .from('website_settings')
      .select('key, value')
      .in('key', defaultStats.map(s => s.key))
      .then(({ data }) => {
        if (data && data.length > 0)
          setStats(prev => prev.map(s => {
            const found = data.find((d: { key: string; value: string }) => d.key === s.key);
            return found ? { ...s, value: found.value || s.value } : s;
          }));
      });
  }, []);

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/96 to-black" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const num    = parseInt(stat.value.replace(/\D/g, ''), 10);
            const suffix = stat.value.replace(/\d/g, '');
            const Icon   = ICONS[i];
            const color  = ACCENT_COLORS[i];

            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
                className="group relative rounded-2xl p-6 overflow-hidden cursor-default"
                style={{
                  background: `linear-gradient(145deg, ${color}08, rgba(0,0,0,0.5))`,
                  border: `1px solid ${color}18`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Hover glow fill */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 30% 30%, ${color}10 0%, transparent 70%)` }} />

                {/* Icon badge */}
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
                  <Icon size={17} style={{ color }} />
                </div>

                {/* Number */}
                <div className="relative text-[clamp(2rem,4vw,2.8rem)] font-black font-mono leading-none mb-2 stat-number"
                  style={{ color }}>
                  <CountUp target={num} suffix={suffix} />
                </div>

                {/* Label */}
                <div className="relative text-[13px] font-semibold text-white mb-1">{stat.label}</div>
                <div className="relative text-[11px] text-gray-600 uppercase tracking-wider">{stat.desc}</div>

                {/* Bottom border sweep on hover */}
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />

                {/* Corner accent */}
                <div className="absolute top-3 right-3 w-3 h-3"
                  style={{ borderTop: `1px solid ${color}35`, borderRight: `1px solid ${color}35` }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
