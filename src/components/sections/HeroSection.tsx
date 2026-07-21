import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

/* ── Particles ───────────────────────────────── */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 3000;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 10 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    const t = Math.random();
    if (t > 0.6)      { colors[i*3]=0;    colors[i*3+1]=0.9;  colors[i*3+2]=1.0; }
    else if (t > 0.3) { colors[i*3]=0.23; colors[i*3+1]=1.0;  colors[i*3+2]=0.82; }
    else              { colors[i*3]=0.23; colors[i*3+1]=0.51; colors[i*3+2]=0.96; }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.025;
    ref.current.rotation.x = Math.sin(t * 0.015) * 0.1;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.7}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function WireframeSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.07;
    ref.current.rotation.x = t * 0.04;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[3, 2]} />
      <meshBasicMaterial color={0x00e5ff} wireframe transparent opacity={0.09} />
    </mesh>
  );
}

function OrbitalRing({ radius, speed, tilt, color }: { radius: number; speed: number; tilt: number; color: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed; });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.01, 6, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
}

function CameraParallax() {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  useFrame(({ camera }) => {
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function GridFloor() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current)
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.025 + Math.sin(clock.getElapsedTime() * 0.4) * 0.01;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[50, 50, 30, 30]} />
      <meshBasicMaterial color={0x00e5ff} wireframe transparent opacity={0.025} />
    </mesh>
  );
}

/* ── Floating metric cards — behind text (z-[5]) ─ */
const FLOAT_CARDS = [
  { label: 'Revenue Growth',    value: '+340%', icon: '📈', pos: 'top-[16%] right-[6%]',    delay: 0.4 },
  { label: 'AI Requests / sec', value: '12.4k', icon: '🤖', pos: 'top-[22%] left-[3%]',     delay: 0.9 },
  { label: 'Uptime SLA',        value: '99.99%', icon: '⚡', pos: 'bottom-[24%] right-[4%]', delay: 1.3 },
  { label: 'Latency',           value: '< 50ms', icon: '🚀', pos: 'bottom-[28%] left-[5%]',  delay: 1.7 },
];

function FloatCard({ card, index }: { card: typeof FLOAT_CARDS[0]; index: number }) {
  return (
    /* z-[5] keeps cards BEHIND the z-10 content layer */
    <motion.div
      className={`absolute ${card.pos} z-[5] hidden lg:block`}
      initial={{ opacity: 0, scale: 0.75, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: card.delay + 0.6, duration: 1, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5 + index * 0.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'rgba(5,5,8,0.72)',
          border: '1px solid rgba(0,229,255,0.16)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          padding: '12px 16px',
          minWidth: 148,
        }}
      >
        <div className="absolute top-2 left-2 w-2.5 h-2.5"
          style={{ borderTop: '1px solid rgba(0,229,255,0.35)', borderLeft: '1px solid rgba(0,229,255,0.35)' }} />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5"
          style={{ borderBottom: '1px solid rgba(0,229,255,0.35)', borderRight: '1px solid rgba(0,229,255,0.35)' }} />
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">{card.icon}</span>
          <span className="text-[10px] font-mono font-semibold text-gray-500 uppercase tracking-wider">{card.label}</span>
        </div>
        <div className="text-lg font-black font-mono text-gradient-cyan">{card.value}</div>
        <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${52 + index * 10}%` }}
            transition={{ delay: card.delay + 1.5, duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00E5FF, #00FFD1)' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Animated headline — dominant second line ─── */
function AnimatedHeadline() {
  const line1 = ["WE", "DON'T", "JUST", "BUILD", "WEBSITES."];
  const line2 = ["WE", "ENGINEER", "DIGITAL", "EXPERIENCES."];

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Line 1 — smaller, subdued */}
      <div
        className="flex flex-wrap justify-center gap-x-[0.2em]"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 4rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.55)' }}
      >
        {line1.map((w, i) => (
          <motion.span key={i} className="inline-block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.07, duration: 0.75, ease: [0.23, 1, 0.32, 1] }}>
            {w}
          </motion.span>
        ))}
      </div>

      {/* Line 2 — larger, dominant, glow */}
      <div
        className="flex flex-wrap justify-center gap-x-[0.18em]"
        style={{ fontSize: 'clamp(2.4rem, 7.5vw, 7.5rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.03em' }}
      >
        {line2.map((w, i) => (
          <motion.span
            key={i}
            className={`inline-block ${i === 0 ? 'text-white' : 'shimmer-text'}`}
            style={i > 0 ? { filter: 'drop-shadow(0 0 32px rgba(0,229,255,0.45))' } : {}}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.75 + i * 0.09, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            {w}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ── Subtle data streams ─────────────────────── */
function DataStreams() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[11, 28, 50, 72, 88].map((x, i) => (
        <motion.div key={i} className="absolute top-0 w-px"
          style={{ left: `${x}%`, background: 'linear-gradient(to bottom, transparent, rgba(0,229,255,0.4), transparent)', height: '22%', opacity: 0.03 + (i % 3) * 0.015 }}
          animate={{ y: ['-22%', '130%'] }}
          transition={{ delay: i * 0.7, duration: 3.5 + i * 0.3, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }} />
      ))}
    </div>
  );
}

/* ── Main ────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black scanlines">

      {/* 3D Canvas — bottom layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 55 }} gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}>
          <CameraParallax />
          <Particles />
          <WireframeSphere />
          <OrbitalRing radius={5}   speed={0.30}  tilt={0.3} color={0x00e5ff} />
          <OrbitalRing radius={6.5} speed={-0.20} tilt={1.1} color={0x00ffd1} />
          <OrbitalRing radius={8}   speed={0.15}  tilt={0.7} color={0x3b82f6} />
          <GridFloor />
        </Canvas>
      </div>

      {/* Gradient overlays — z-[1] */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 18%, rgba(0,0,0,0.6) 100%)' }} />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-transparent to-black pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(0,229,255,0.11) 0%, transparent 70%)' }} />

      {/* Data streams — z-[2] */}
      <div className="absolute inset-0 z-[2]"><DataStreams /></div>

      {/* Float cards — z-[5], BEHIND main content z-10 */}
      {FLOAT_CARDS.map((c, i) => <FloatCard key={i} card={c} index={i} />)}

      {/* Main content — z-10 (above cards) */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">

        {/* Status badge */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
          className="flex items-center gap-3 mb-8">
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2.5"
            style={{ border: '1px solid rgba(0,229,255,0.18)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono font-semibold tracking-[0.2em] text-gray-400 uppercase">
              Giverham Tech — Digital Engineering Studio
            </span>
          </div>
        </motion.div>

        <AnimatedHeadline />

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 0.75 }}
          className="mt-7 max-w-xl text-[clamp(0.875rem,1.6vw,1.05rem)] text-gray-500 leading-relaxed">
          Premium websites · AI-powered platforms · Banking systems ·
          E-commerce solutions · Real estate platforms · Custom software
          that transforms businesses.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.55, duration: 0.7 }}
          className="mt-9 flex flex-wrap gap-3.5 justify-center">
          <a href="#projects" className="btn-primary group">
            View Portfolio
            <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </a>
          <a href="#contact" className="btn-secondary group">
            Start Your Project
            <ArrowRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 1 }}
          className="mt-14 flex flex-wrap gap-8 justify-center">
          {[{ n: '120+', l: 'Projects' }, { n: '80+', l: 'Clients' }, { n: '5+', l: 'Years' }, { n: '99.9%', l: 'Uptime' }].map(m => (
            <div key={m.l} className="text-center">
              <div className="text-[1.2rem] font-black font-mono text-gradient-cyan">{m.n}</div>
              <div className="text-[10px] text-gray-600 tracking-widest uppercase mt-0.5">{m.l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={17} className="text-gray-700" />
        </motion.div>
        <span className="text-[9px] tracking-[0.3em] text-gray-700 uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
