import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const techs = [
  { name: 'React',        color: '#61DAFB', mono: 'R' },
  { name: 'TypeScript',   color: '#3178C6', mono: 'TS' },
  { name: 'JavaScript',   color: '#F7DF1E', mono: 'JS' },
  { name: 'Node.js',      color: '#339933', mono: 'N' },
  { name: 'Express',      color: '#EEEEEE', mono: 'EX' },
  { name: 'Supabase',     color: '#3ECF8E', mono: 'SB' },
  { name: 'PostgreSQL',   color: '#336791', mono: 'PG' },
  { name: 'GitHub',       color: '#EEEEEE', mono: 'GH' },
  { name: 'Vercel',       color: '#EEEEEE', mono: 'VC' },
  { name: 'OpenAI',       color: '#10A37F', mono: 'AI' },
  { name: 'Tailwind CSS', color: '#06B6D4', mono: 'TW' },
  { name: 'Three.js',     color: '#EEEEEE', mono: '3D' },
  { name: 'Framer',       color: '#0055FF', mono: 'FM' },
  { name: 'Vite',         color: '#646CFF', mono: 'VT' },
];

/* Orbital ring — one row of evenly-spaced tech badges that rotate */
function OrbitalRing({
  items, radius, duration, reverse, offsetAngle = 0
}: {
  items: typeof techs;
  radius: number;
  duration: number;
  reverse?: boolean;
  offsetAngle?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const count = items.length;

  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      {/* The ring track */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '1px solid rgba(0,229,255,0.06)',
          animation: `${reverse ? 'rotateReverse' : 'rotateSlow'} ${duration}s linear infinite`,
        }}
      >
        {items.map((tech, i) => {
          const angle = (i / count) * 360 + offsetAngle;
          const rad   = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          return (
            <div
              key={tech.name}
              className="absolute"
              style={{
                left:  `calc(50% + ${x}px)`,
                top:   `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                /* counter-rotate so badge text stays upright */
                animation: `${reverse ? 'rotateSlow' : 'rotateReverse'} ${duration}s linear infinite`,
              }}
            >
              <div
                className="group relative flex flex-col items-center gap-1.5 cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black font-mono transition-all duration-300 group-hover:scale-125"
                  style={{
                    background: `${tech.color}18`,
                    border: `1px solid ${tech.color}30`,
                    color: tech.color,
                    boxShadow: `0 0 0 0 ${tech.color}00`,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 16px ${tech.color}60`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                  }}
                >
                  {tech.mono}
                </div>
                <span
                  className="text-[8px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-full mt-1 pointer-events-none"
                  style={{ color: tech.color }}
                >
                  {tech.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CentralCore() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
      {/* Pulsing glow */}
      <div className="absolute w-40 h-40 rounded-full animate-orb-pulse opacity-20"
        style={{ background: 'radial-gradient(circle, #00E5FF, transparent)' }} />
      {/* Core ring */}
      <div className="relative w-28 h-28 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(0,255,209,0.05))', border: '1px solid rgba(0,229,255,0.25)' }}>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest">GT</div>
          <div className="text-[7px] text-gray-600 tracking-wider mt-0.5">STACK</div>
        </div>
        {/* Spinning decorative ring */}
        <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/20 animate-rotate-slow" />
      </div>
    </div>
  );
}

export default function TechStackSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  const inner = techs.slice(0, 7);
  const outer = techs.slice(7);

  return (
    <section ref={sectionRef} id="tech" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 aurora-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

      {/* Radial glow behind orbital */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(circle, #00E5FF, transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left: orbital system */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative hidden lg:block"
            style={{ height: 520 }}
          >
            <OrbitalRing items={inner} radius={160} duration={28} />
            <OrbitalRing items={outer} radius={230} duration={40} reverse offsetAngle={20} />
            <CentralCore />
          </motion.div>

          {/* Right: content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
              className="section-label mb-6"
            >OUR ARSENAL</motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-[clamp(2.2rem,4.5vw,4rem)] font-black tracking-tight leading-[0.95] mb-6"
            >
              <span className="text-white">Industry-Leading</span>
              <br />
              <span className="text-gradient-cyan">Technology Stack</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.7 }}
              className="text-gray-500 text-[15px] leading-relaxed mb-10"
            >
              Every project is built with the most powerful tools in the industry —
              delivering speed, security, and scalability from day one.
            </motion.p>

            {/* Grid of badges (mobile / supplementary) */}
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-3">
              {techs.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.5 }}
                  whileHover={{ scale: 1.08, y: -3, transition: { duration: 0.2 } }}
                  className="group flex flex-col items-center gap-2 p-3 rounded-xl cursor-default"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.055)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black font-mono text-[10px] transition-all duration-300"
                    style={{ background: `${tech.color}14`, color: tech.color, border: `1px solid ${tech.color}22` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 14px ${tech.color}50`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}>
                    {tech.mono}
                  </div>
                  <span className="text-[9px] text-gray-600 group-hover:text-gray-400 transition-colors text-center leading-tight">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
