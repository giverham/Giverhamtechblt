import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const roles = [
  { label: 'Giverham Tech', color: '#00E5FF' },
  { label: 'Giver Recording Studio', color: '#00FFD1' },
  { label: 'Giver Store NG', color: '#3B82F6' },
];

const FALLBACK = {
  founder_name: 'Adelaja Hassan M.',
  founder_title: 'Full Stack Developer & AI Engineer',
  founder_bio: 'I build premium digital products, AI-powered platforms, banking systems, e-commerce solutions, media platforms, and scalable business software designed for performance, reliability, and growth.',
  founder_photo_url: '',
};

export default function FounderSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  const [imgError, setImgError] = useState(false);
  const [founder, setFounder] = useState(FALLBACK);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('website_settings').select('key,value').in('key', Object.keys(FALLBACK));
      if (!data?.length) return;
      const next = { ...FALLBACK };
      data.forEach((row: { key: string; value: string }) => {
        if (row.key in next && row.value) {
          (next as Record<string, string>)[row.key] = row.value;
        }
      });
      setFounder(next);
      setImgError(false);
    };

    load();
    const channel = supabase
      .channel('founder-settings-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'website_settings' }, () => { load(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const founderPhotoUrl = founder.founder_photo_url; 

  return (
    <section ref={sectionRef} id="about" className="relative py-6 sm:py-10 md:py-14 overflow-hidden">
      {/* Background Grid & Aurora Glow */}
      <motion.div className="absolute inset-0 bg-grid opacity-[0.12]" style={{ y: bgY }} />
      <div className="absolute inset-0 aurora-bg opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Section Label */}
        <div className="text-center mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 mb-1"
          >
            — THE FOUNDER —
          </motion.div>
        </div>

        {/* Main Founder Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full rounded-xl overflow-hidden p-3.5 sm:p-6"
          style={{
            background: 'linear-gradient(145deg, rgba(0,229,255,0.06), rgba(5,8,16,0.75))',
            border: '1px solid rgba(0,229,255,0.2)',
            boxShadow: '0 0 30px rgba(0,229,255,0.05)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Side-by-Side: Image on Left, Details & Bio on Right */}
          <div className="flex items-start gap-3.5 sm:gap-6">
            
            {/* Portrait Image Frame (Left) */}
            <div className="relative w-24 sm:w-36 shrink-0 aspect-[3/4] rounded-lg overflow-hidden border border-cyan-400/30 bg-black/60 shadow-inner">
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400 z-10" />
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400 z-10" />
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400 z-10" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400 z-10" />

              {founderPhotoUrl && !imgError ? (
                <img
                  src={founderPhotoUrl}
                  alt={founder.founder_name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-cyan-950/40 via-black/60 to-black/90 relative p-1 text-center">
                  <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-950/70 border border-cyan-400/40 flex items-center justify-center mb-1 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                    <span className="text-xs sm:text-sm font-black font-mono text-cyan-300">
                      {founder.founder_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[7px] sm:text-[8px] font-mono text-cyan-400/90 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                    Node
                  </span>
                </div>
              )}
            </div>

            {/* Name, Title, and Bio Quote (Right) */}
            <div className="flex-1 text-left space-y-2 sm:space-y-3 pt-0.5">
              <div>
                <h3 className="text-sm sm:text-2xl font-bold text-white tracking-tight leading-tight">
                  {founder.founder_name}
                </h3>
                <p className="text-[9px] sm:text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider mt-0.5 sm:mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  {founder.founder_title}
                </p>
              </div>

              {/* Bio Quote */}
              <p className="text-slate-200 text-[11px] sm:text-sm leading-relaxed font-normal italic border-l-2 border-cyan-400/50 pl-2.5 sm:pl-3 py-0.5">
                "{founder.founder_bio.replace(/^"|"$/g, '')}"
              </p>
            </div>

          </div>

          {/* Unified Founder Ventures Sub-Bar (Inline Flow on Mobile & PC) */}
          <div className="mt-4 pt-3 border-t border-cyan-400/15 flex flex-wrap items-center gap-2">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-cyan-400/80 font-semibold shrink-0">
              FOUNDER :
            </span>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {roles.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md border border-cyan-400/20 hover:border-cyan-400/50 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: r.color }} />
                  <span className="text-[10px] sm:text-xs font-medium text-slate-200 tracking-wide">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* HUD Accents */}
          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-cyan-400/40" />
          <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-cyan-400/40" />
        </motion.div>

      </div>
    </section>
  );
}