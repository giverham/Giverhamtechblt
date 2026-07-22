import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const marqueeRow1 = [
  { name: 'React',        color: '#61DAFB', mono: 'R' },
  { name: 'TypeScript',   color: '#3178C6', mono: 'TS' },
  { name: 'Node.js',      color: '#339933', mono: 'N' },
  { name: 'Express',      color: '#EEEEEE', mono: 'EX' },
  { name: 'Supabase',     color: '#3ECF8E', mono: 'SB' },
  { name: 'PostgreSQL',   color: '#336791', mono: 'PG' },
  { name: 'OpenAI',       color: '#10A37F', mono: 'AI' },
  { name: 'Tailwind CSS', color: '#06B6D4', mono: 'TW' },
];

const marqueeRow2 = [
  { name: 'Next.js',      color: '#FFFFFF', mono: 'NX' },
  { name: 'Vercel',       color: '#EEEEEE', mono: 'VC' },
  { name: 'GitHub',       color: '#EEEEEE', mono: 'GH' },
  { name: 'Stripe',       color: '#635BFF', mono: 'ST' },
  { name: 'Firebase',     color: '#FFCA28', mono: 'FB' },
  { name: 'Docker',       color: '#2496ED', mono: 'DK' },
  { name: 'REST APIs',    color: '#00E5FF', mono: 'API' },
  { name: 'AI Agents',    color: '#8B5CF6', mono: 'AG' },
];

const allOrbital = [...marqueeRow1, ...marqueeRow2];

/* Orbital ring — 3D rotating technology sphere */
function OrbitalRing({
  items, radius, duration, reverse, offsetAngle = 0
}: {
  items: typeof marqueeRow1;
  radius: number;
  duration: number;
  reverse?: boolean;
  offsetAngle?: number;
}) {
  const count = items.length;

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '1px solid rgba(0,229,255,0.08)',
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
                animation: `${reverse ? 'rotateSlow' : 'rotateReverse'} ${duration}s linear infinite`,
              }}
            >
              <div className="group relative flex flex-col items-center gap-1 cursor-default">
                <div
                  className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-[9px] font-black font-mono transition-all duration-300 group-hover:scale-125"
                  style={{
                    background: `${tech.color}18`,
                    border: `1px solid ${tech.color}30`,
                    color: tech.color,
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
      <div className="absolute w-32 h-32 rounded-full animate-orb-pulse opacity-20"
        style={{ background: 'radial-gradient(circle, #00E5FF, transparent)' }} />
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(0,255,209,0.05))', border: '1px solid rgba(0,229,255,0.25)' }}>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest">GT</div>
          <div className="text-[7px] text-gray-400 tracking-wider mt-0.5">STACK</div>
        </div>
        <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/20 animate-rotate-slow" />
      </div>
    </div>
  );
}

/* Infinite Scrolling Technology Marquee */
function MarqueeRow({ items, reverse = false, speed = 28 }: { items: typeof marqueeRow1; reverse?: boolean; speed?: number }) {
  const duplicated = [...items, ...items, ...items, ...items];

  return (
    <div className="relative flex overflow-hidden select-none py-1.5">
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent" />

      <motion.div
        className="flex gap-3 md:gap-4 flex-nowrap"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ ease: 'linear', duration: speed, repeat: Infinity }}
      >
        {duplicated.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="group flex items-center gap-2.5 px-4 py-2 rounded-xl cursor-default flex-shrink-0 transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${tech.color}25`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-black font-mono text-[9px] transition-all duration-300"
              style={{ background: `${tech.color}18`, color: tech.color, border: `1px solid ${tech.color}30` }}
            >
              {tech.mono}
            </div>
            <span className="text-[12px] font-semibold text-gray-300 group-hover:text-white transition-colors whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function TechStackSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const inner = allOrbital.slice(0, 8);
  const outer = allOrbital.slice(8);

  return (
    <section ref={sectionRef} id="tech" className="relative py-10 md:py-14 overflow-hidden">
      <div className="absolute inset-0 aurora-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(circle, #00E5FF, transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
            className="text-xs tracking-wider uppercase text-cyan-400 font-mono mb-2"
          >We use industry leading technology stack</motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.7 }}
            className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed"
          >
            Every project is built with the most powerful tools in the industry —
            delivering speed, security, and scalability from day one.
          </motion.p>
        </div>

        {/* 3-Column Orbital Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center max-w-7xl mx-auto my-6">

          {/* LEFT COLUMN: System Status & Telemetry Glass Card (Hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block lg:col-span-4 w-full max-w-sm mx-auto bg-slate-900/50 border border-cyan-500/20 backdrop-blur-md rounded-xl p-5 md:p-6 space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                SYSTEM TELEMETRY
              </span>
              <span className="text-[9px] font-mono text-gray-500">LIVE V2.4</span>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                  <span className="text-xs text-gray-300 font-medium">Core Uptime</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">99.9%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF]" />
                  <span className="text-xs text-gray-300 font-medium">Edge Speed</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">&lt;20ms</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#3B82F6]" />
                  <span className="text-xs text-gray-300 font-medium">Pipeline</span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-400">ZERO DOWNTIME</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#8B5CF6]" />
                  <span className="text-xs text-gray-300 font-medium">Encryption</span>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400">BANK-GRADE</span>
              </div>
            </div>
          </motion.div>

          {/* CENTER COLUMN: Animated Rotating Technology Sphere */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-4 relative mx-auto h-[320px] sm:h-[350px] w-full flex justify-center items-center overflow-hidden"
          >
            <OrbitalRing items={inner} radius={110} duration={26} />
            <OrbitalRing items={outer} radius={155} duration={38} reverse offsetAngle={22} />
            <CentralCore />
          </motion.div>

          {/* RIGHT COLUMN: Terminal Code Feed Glass Card (Hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block lg:col-span-4 w-full max-w-sm mx-auto bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md rounded-xl p-5 md:p-6 pb-8 flex flex-col justify-between font-mono shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] text-gray-500 font-mono tracking-wider">engine.config.js</span>
            </div>

            <div className="flex-1 flex items-center py-2">
              <pre className="text-cyan-400 leading-relaxed overflow-x-auto font-mono text-xs sm:text-sm w-full">
                <code>{`// Giverham Tech Engine
const system = {
  status: 'OPTIMIZED',
  security: 'BANK_GRADE',
  ai_nodes: 'ACTIVE'
};`}</code>
              </pre>
            </div>
          </motion.div>

        </div>

        {/* Supporting Technology Marquee Showcase */}
        <div className="space-y-3 pt-4">
          <MarqueeRow items={marqueeRow1} speed={32} />
          <MarqueeRow items={marqueeRow2} reverse speed={36} />
        </div>

      </div>
    </section>
  );
}