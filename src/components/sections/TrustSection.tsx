import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Stat { key: string; label: string; value: string; desc: string; }

const defaultStats: Stat[] = [
  { key: 'stats_projects',     label: 'Projects Delivered', value: '120+', desc: 'Across 12+ industries' },
  { key: 'stats_technologies', label: 'Technologies Used',  value: '30+',  desc: 'Modern stack expertise' },
  { key: 'stats_clients',      label: 'Happy Clients',      value: '80+',  desc: 'Worldwide satisfied' },
  { key: 'stats_years',        label: 'Years Excellence',  value: '5+',   desc: 'Proven track record' },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur   = 1800;
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
    <section className="relative py-3 md:py-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/96 to-black" />

      <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* Sleek Horizontal Strip (No heavy outer background on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none justify-between sm:justify-around items-center gap-4 sm:gap-6 py-3 px-3 sm:px-6 my-2 sm:my-8 sm:bg-slate-900/40 sm:border sm:border-slate-800/80 sm:backdrop-blur-md sm:rounded-2xl"
        >
          {stats.map((stat, i) => {
            const num    = parseInt(stat.value.replace(/\D/g, ''), 10);
            const suffix = stat.value.replace(/\d/g, '');

            return (
              <div key={stat.key} className="flex items-center gap-4 sm:gap-6 flex-shrink-0 snap-center">
                {i > 0 && (
                  <div className="h-6 w-[1px] bg-slate-800/80 hidden sm:block" />
                )}

                <div className="flex flex-col items-center text-center min-w-[95px] sm:min-w-[130px]">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 drop-shadow-[0_0_12px_rgba(0,229,255,0.4)] leading-none">
                    <CountUp target={num} suffix={suffix} />
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase font-semibold text-slate-300 tracking-wider whitespace-nowrap mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}