import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Testimonial { id: string; name: string; role: string; company: string; content: string; rating: number; }

const fallback: Testimonial[] = [
  { id: '1', name: 'Sarah Mitchell', role: 'CEO',             company: 'Evercrest Financial', content: 'Giverham Tech delivered our banking platform ahead of schedule. The quality of code, security architecture, and UI design are absolutely world-class. Our users love the experience.', rating: 5 },
  { id: '2', name: 'Marcus Johnson', role: 'Founder',         company: 'RR Rentals Ltd',       content: 'The real estate platform they built completely transformed our business. We went from a basic website to a full property management ecosystem in just 8 weeks. Unbelievable speed and quality.', rating: 5 },
  { id: '3', name: 'Amara Okafor',   role: 'Director',        company: 'MarWiz Fashion',        content: 'The e-commerce site they built has increased our conversions by 340%. The design is stunning, performance is incredible, and the backend is rock solid. Best investment we made.', rating: 5 },
  { id: '4', name: 'David Chen',     role: 'CTO',             company: 'TechFlow Solutions',    content: 'Working with Adelaja and his team was exceptional. They understood our technical requirements perfectly and delivered a SaaS platform that scales beautifully under load.', rating: 5 },
  { id: '5', name: 'Priya Sharma',   role: 'Product Manager', company: 'AI Ventures',           content: 'The AI sports analyst platform exceeded every expectation. Machine learning integration, the UI, and the API documentation are all outstanding. A genuine engineering masterpiece.', rating: 5 },
];

const AVATAR_COLORS = ['#00E5FF', '#00FFD1', '#3B82F6', '#8B5CF6', '#F59E0B'];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallback);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    supabase.from('testimonials').select('*').eq('published', true).order('sort_order').then(({ data }) => {
      if (data && data.length > 0) setTestimonials(data);
    });
  }, []);

  const startTimer = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setDir(1);
      setActive(p => (p + 1) % testimonials.length);
    }, 6000);
  };

  useEffect(() => { startTimer(); return () => clearInterval(timer.current); }, [testimonials.length]);

  const go = (i: number) => {
    setDir(i > active ? 1 : -1);
    setActive(i);
    startTimer();
  };

  const prev = () => go((active - 1 + testimonials.length) % testimonials.length);
  const next = () => go((active + 1) % testimonials.length);

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:   (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0, scale: 0.92 }),
  };

  const current = testimonials[active];

  return (
    <section id="testimonials" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-sm opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/96 to-black" />

      {/* Large background quote mark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[32rem] font-serif text-white/[0.012] leading-none select-none pointer-events-none">
        "
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-label mb-6"
          >CLIENT VOICES</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-[clamp(2.2rem,5vw,4.5rem)] font-black tracking-tight"
          >
            <span className="text-white">What Our</span>{' '}
            <span className="text-gradient-cyan">Clients Say</span>
          </motion.h2>
        </div>

        {/* Main card */}
        <div className="relative" style={{ minHeight: 320 }}>
          {/* Background stack cards */}
          {[-1, 1].map(offset => {
            const idx = (active + offset + testimonials.length) % testimonials.length;
            return (
              <div key={idx} className="absolute inset-x-8 top-4 bottom-0 rounded-3xl"
                style={{
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  transform: `translateY(${offset > 0 ? 12 : 8}px) scale(${offset > 0 ? 0.95 : 0.97})`,
                  zIndex: 0,
                }} />
            );
          })}

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current?.id}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="relative z-10 p-10 md:p-14 rounded-3xl"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(0,229,255,0.12)',
                boxShadow: '0 0 80px rgba(0,229,255,0.04), 0 24px 80px rgba(0,0,0,0.5)',
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex gap-1">
                  {Array.from({ length: current?.rating || 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote size={32} className="text-cyan-400/15" />
              </div>

              {/* Quote */}
              <p className="text-[clamp(1rem,2.2vw,1.35rem)] text-gray-200 leading-relaxed font-light italic mb-10">
                "{current?.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${AVATAR_COLORS[active % 5]}30, ${AVATAR_COLORS[(active + 2) % 5]}20)`,
                    border: `1px solid ${AVATAR_COLORS[active % 5]}30`,
                    color: AVATAR_COLORS[active % 5],
                  }}>
                  {current?.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{current?.name}</div>
                  <div className="text-xs text-gray-500">{current?.role} · {current?.company}</div>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-4 h-4"
                style={{ borderTop: '1px solid rgba(0,229,255,0.25)', borderLeft: '1px solid rgba(0,229,255,0.25)' }} />
              <div className="absolute bottom-4 right-4 w-4 h-4"
                style={{ borderBottom: '1px solid rgba(0,229,255,0.25)', borderRight: '1px solid rgba(0,229,255,0.25)' }} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-5 mt-12">
          <button onClick={prev}
            className="w-11 h-11 rounded-full glass border-glow flex items-center justify-center hover:border-cyan-400/40 transition-all duration-200 hover:scale-105">
            <ChevronLeft size={17} className="text-gray-400" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => go(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width:  i === active ? 28 : 6,
                  height: 6,
                  background: i === active
                    ? 'linear-gradient(90deg, #00E5FF, #00FFD1)'
                    : 'rgba(255,255,255,0.12)',
                }} />
            ))}
          </div>

          <button onClick={next}
            className="w-11 h-11 rounded-full glass border-glow flex items-center justify-center hover:border-cyan-400/40 transition-all duration-200 hover:scale-105">
            <ChevronRight size={17} className="text-gray-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
