import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/* ── Particles (Memoized Geometry) ───────────── */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = useMemo(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 1600 : 3200), []);

  const { geo } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 10 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      if (t > 0.6) { colors[i * 3] = 0.17; colors[i * 3 + 1] = 0.83; colors[i * 3 + 2] = 0.75; }
      else if (t > 0.3) { colors[i * 3] = 0.02; colors[i * 3 + 1] = 0.71; colors[i * 3 + 2] = 0.83; }
      else { colors[i * 3] = 0.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 0.82; }
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return { geo: g };
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.035;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.08;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function WireframeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.12;
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.06;
    }
  });
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[3.8, 4]} />
      <meshBasicMaterial color={0x14b8a6} wireframe transparent opacity={0.4} />
    </mesh>
  );
}

function OrbitalRing({ radius, speed, tilt, color }: { radius: number; speed: number; tilt: number; color: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed; });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.014, 8, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.28} />
    </mesh>
  );
}

function CameraParallax() {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
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

/* ── Floating metric cards ─ */
const FLOAT_CARDS = [
  { label: 'Latency', value: '< 50ms', icon: '🚀', pos: 'bottom-4 sm:bottom-6 left-4 sm:left-8', delay: 0.6, floatDelay: 0 },
  { label: 'Uptime SLA', value: '99.99%', icon: '⚡', pos: 'bottom-4 sm:bottom-6 right-4 sm:right-8', delay: 1.0, floatDelay: 1.8 },
];

function FloatCard({ card }: { card: typeof FLOAT_CARDS[0] }) {
  return (
    <motion.div
      className={`absolute ${card.pos} z-[20] block pointer-events-auto`}
      initial={{ opacity: 0, scale: 0.75, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: card.delay, duration: 1, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: card.floatDelay }}
        className="group relative cursor-default transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
        style={{
          background: 'rgba(5,5,8,0.85)',
          border: '1px solid rgba(0,229,255,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: 12,
          padding: '8px 12px',
          minWidth: 110,
        }}
      >
        <div className="absolute top-2 left-2 w-1.5 h-1.5" style={{ borderTop: '1px solid rgba(0,229,255,0.4)', borderLeft: '1px solid rgba(0,229,255,0.4)' }} />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5" style={{ borderBottom: '1px solid rgba(0,229,255,0.4)', borderRight: '1px solid rgba(0,229,255,0.4)' }} />
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs">{card.icon}</span>
          <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider">{card.label}</span>
        </div>
        <div className="text-xs sm:text-base font-bold font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">{card.value}</div>
        <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full bg-gradient-to-r from-cyan-400 to-teal-300" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ delay: card.delay + 0.4, duration: 1.2, ease: 'easeOut' }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Animated headline — Wide Spaced for breathing room ─── */
function AnimatedHeadline() {
  const line1 = ["WE", "DON'T", "JUST", "BUILD", "WEBSITES"];
  const line2 = ["WE", "ENGINEER", "DIGITAL", "EXPERIENCES"];

  return (
    <div className="flex flex-col items-center justify-center max-w-5xl mx-auto text-center w-full">
      {/* Line 1 — Pushed high up with large bottom margin (mb-8 to mb-12) */}
      <div className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-slate-300/90 mb-8 sm:mb-10 md:mb-12 flex flex-wrap justify-center gap-x-[0.3em]">
        {line1.map((w, i) => (
          <motion.span key={i} className="inline-block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.07, duration: 0.75, ease: [0.23, 1, 0.32, 1] }}>
            {w}
          </motion.span>
        ))}
      </div>

      {/* Line 2 — Centered alone */}
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wider flex flex-wrap justify-center gap-x-[0.22em] leading-tight w-full">
        {line2.map((w, i) => (
          <motion.span
            key={i}
            className={`inline-block ${i === 0 ? 'text-white' : 'shimmer-text'}`}
            style={i > 0 ? { filter: 'drop-shadow(0 0 28px rgba(0,229,255,0.45))' } : {}}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
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

/* ── Main Hero Section ────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "100px 0px 100px 0px" });

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black scanlines py-12">

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <Canvas
          frameloop={isInView ? 'always' : 'demand'}
          camera={{ position: [0, 0, typeof window !== 'undefined' && window.innerWidth < 768 ? 22 : 12], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
        >
          <CameraParallax />
          <Particles />
          <WireframeSphere />
          <OrbitalRing radius={5} speed={0.30} tilt={0.3} color={0x00e5ff} />
          <OrbitalRing radius={6.5} speed={-0.20} tilt={1.1} color={0x00ffd1} />
          <OrbitalRing radius={8} speed={0.15} tilt={0.7} color={0x3b82f6} />
          <GridFloor />
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 18%, rgba(0,0,0,0.6) 100%)' }} />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-transparent to-black pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

      {/* Data streams */}
      <div className="absolute inset-0 z-[2]"><DataStreams /></div>

      {/* Float cards */}
      {FLOAT_CARDS.map((c, i) => <FloatCard key={i} card={c} />)}

      {/* Main content — z-10 */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

        <AnimatedHeadline />

        {/* Subtitle Paragraph — Pushed way down with large top margin (mt-10 to mt-14) */}
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 0.75 }}
          className="mt-10 sm:mt-12 md:mt-14 max-w-lg md:max-w-2xl mx-auto px-4 text-sm md:text-base font-semibold text-slate-100 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Premium websites · AI-powered platforms · Banking systems ·
          E-commerce solutions · Real estate platforms · Custom software
          that transforms businesses
        </motion.p>

      </div>

      {/* SCROLL Indicator — Pinned to bottom, dead-center fixed with pl-[0.3em] to counteract letter-spacing bug */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.75, duration: 0.6 }}
        className="absolute bottom-6 sm:bottom-8 left-0 w-full flex justify-center cursor-pointer opacity-80 hover:opacity-100 transition-opacity z-20 pointer-events-auto"
      >
        <a href="#services" aria-label="Scroll down to services" className="flex flex-col items-center gap-1 group">
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={16} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
          </motion.div>
          <span className="text-[9px] font-mono tracking-[0.3em] pl-[0.3em] text-gray-400 group-hover:text-gray-300 uppercase transition-colors">
            SCROLL
          </span>
        </a>
      </motion.div>

    </section>
  );
}