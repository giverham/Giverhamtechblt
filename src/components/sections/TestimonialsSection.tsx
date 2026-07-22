import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Testimonial { id: string; name: string; role: string; company: string; content: string; rating: number; }

const fallback: Testimonial[] = [
  { id: '1', name: 'Sarah Mitchell', role: 'CEO',             company: 'Evercrest Financial', content: 'Giverham Tech delivered our banking platform ahead of schedule. The quality of code, security architecture, and UI design are absolutely world-class. Our users love the experience.', rating: 5 },
  { id: '2', name: 'Marcus Johnson', role: 'Founder',         company: 'RR Rentals Ltd',       content: 'The real estate platform they built completely transformed our business. We went from a basic website to a full property management ecosystem in just 8 weeks. Unbelievable speed and quality.', rating: 5 },
  { id: '3', name: 'Amara Okafor',   role: 'Director',        company: 'MarWiz Fashion',        content: 'The e-commerce site they built has increased our conversions by 340%. The design is stunning, performance is incredible, and the backend is rock solid. Best investment we made.', rating: 5 },
  { id: '4', name: 'David Chen',     role: 'CTO',             company: 'TechFlow Solutions',    content: 'Working with Adelaja and his team was exceptional. They understood our technical requirements perfectly and delivered a SaaS platform that scales beautifully under load.', rating: 5 },
  { id: '5', name: 'Priya Sharma',   role: 'Product Manager', company: 'AI Ventures',           content: 'The AI sports analyst platform exceeded every expectation. Machine learning integration, the UI, and the API documentation are all outstanding. A genuine engineering masterpiece.', rating: 5 },
];

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
    enter:  (d: number) => ({ x: d > 0 ? '50%' : '-50%', opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:   (d: number) => ({ x: d > 0 ? '-50%' : '50%', opacity: 0, scale: 0.95 }),
  };

  const current = testimonials[active];

  return (
    <section id="testimonials" className="relative py-8 md:py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/96 to-black" />

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(ellipse, #00E5FF, transparent)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-label mb-2"
          >WHAT OUR CLIENTS SAY</motion.div>
        </div>

        {/* Testimonial Card Container */}
        <div className="relative max-w-3xl mx-auto min-h-[200px]">
          {/* Subtle background stack cards */}
          {[-1, 1].map(offset => {
            const idx = (active + offset + testimonials.length) % testimonials.length;
            return (
              <div key={idx} className="absolute inset-x-4 sm:inset-x-6 top-3 bottom-0 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  transform: `translateY(${offset > 0 ? 8 : 5}px) scale(${offset > 0 ? 0.96 : 0.98})`,
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
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="relative z-10 p-4 sm:p-6 md:p-8 rounded-2xl text-center flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))',
                border: '1px solid rgba(0,229,255,0.14)',
                boxShadow: '0 0 50px rgba(0,229,255,0.04), 0 16px 40px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Center-aligned Star Rating at top */}
              <div className="flex justify-center gap-1 mb-3 sm:mb-4">
                {Array.from({ length: current?.rating || 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400 sm:w-[15px] sm:h-[15px]" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm md:text-base font-normal text-gray-200 leading-relaxed max-w-xl mx-auto mb-4 sm:mb-5">
                "{current?.content}"
              </p>

              {/* Author Info Centered Underneath */}
              <div className="text-center">
                <div className="font-semibold text-white text-xs sm:text-sm md:text-base tracking-wide">
                  {current?.name}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                  {current?.role} · {current?.company}
                </div>
              </div>

              {/* Subtle Corner Accents */}
              <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5"
                style={{ borderTop: '1px solid rgba(0,229,255,0.25)', borderLeft: '1px solid rgba(0,229,255,0.25)' }} />
              <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5"
                style={{ borderBottom: '1px solid rgba(0,229,255,0.25)', borderRight: '1px solid rgba(0,229,255,0.25)' }} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls & Centered Dots */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5">
          <button onClick={prev}
            aria-label="Previous testimonial"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full glass border-glow flex items-center justify-center hover:border-cyan-400/40 transition-all duration-200 hover:scale-105">
            <ChevronLeft size={15} className="text-gray-400 sm:w-[16px] sm:h-[16px]" />
          </button>

          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => go(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="transition-all duration-300 rounded-full"
                style={{
                  width:  i === active ? 24 : 6,
                  height: 6,
                  background: i === active
                    ? 'linear-gradient(90deg, #00E5FF, #00FFD1)'
                    : 'rgba(255,255,255,0.15)',
                }} />
            ))}
          </div>

          <button onClick={next}
            aria-label="Next testimonial"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full glass border-glow flex items-center justify-center hover:border-cyan-400/40 transition-all duration-200 hover:scale-105">
            <ChevronRight size={15} className="text-gray-400 sm:w-[16px] sm:h-[16px]" />
          </button>
        </div>

      </div>
    </section>
  );
}
