import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Globe, Database, Cpu, Award, Code2, Layers } from 'lucide-react';

/* ── Data ─────────────────────────────────────── */
const skillGroups = [
  {
    category: 'Frontend',
    Icon: Globe,
    color: '#00E5FF',
    items: [
      { name: 'React',         level: 98 },
      { name: 'TypeScript',    level: 95 },
      { name: 'Tailwind CSS',  level: 98 },
      { name: 'Framer Motion', level: 90 },
      { name: 'Three.js',      level: 82 },
    ],
  },
  {
    category: 'Backend',
    Icon: Database,
    color: '#00FFD1',
    items: [
      { name: 'Node.js',    level: 95 },
      { name: 'Supabase',   level: 97 },
      { name: 'PostgreSQL', level: 90 },
      { name: 'Express',    level: 93 },
      { name: 'REST APIs',  level: 96 },
    ],
  },
  {
    category: 'AI & DevOps',
    Icon: Cpu,
    color: '#3B82F6',
    items: [
      { name: 'OpenAI APIs', level: 88 },
      { name: 'Vercel',      level: 97 },
      { name: 'GitHub',      level: 95 },
      { name: 'Figma',       level: 80 },
      { name: 'VS Code',     level: 98 },
    ],
  },
];

const timeline = [
  { year: '2019', event: 'Started full-stack development — vanilla JS & PHP' },
  { year: '2020', event: 'First production React apps shipped for paying clients' },
  { year: '2021', event: 'Mastered backend engineering with Node.js & PostgreSQL' },
  { year: '2022', event: 'Founded Giverham Tech — premium digital engineering studio' },
  { year: '2023', event: 'Integrated AI & LLMs into commercial web platforms' },
  { year: '2024', event: 'Delivered 120+ world-class projects across 12 industries' },
];

const techBadges = [
  { name: 'React',      color: '#61DAFB' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js',    color: '#339933' },
  { name: 'Supabase',   color: '#3ECF8E' },
  { name: 'OpenAI',     color: '#10A37F' },
  { name: 'Vercel',     color: '#aaaaaa' },
  { name: 'Three.js',   color: '#dddddd' },
  { name: 'Tailwind',   color: '#06B6D4' },
];

const highlights = [
  { icon: Code2,  value: '120+',  label: 'Projects',   color: '#00E5FF' },
  { icon: Layers, value: '30+',   label: 'Tech Skills', color: '#00FFD1' },
  { icon: Award,  value: '5+',    label: 'Years',       color: '#3B82F6' },
  { icon: Globe,  value: '80+',   label: 'Clients',     color: '#8B5CF6' },
];

/* ── Animated skill bar ───────────────────────── */
function SkillBar({ name, level, color, index }: { name: string; level: number; color: string; index: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[12px] text-gray-400 font-medium group-hover:text-white transition-colors duration-200">{name}</span>
        <span className="text-[11px] font-mono font-bold" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}70)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ delay: index * 0.07 + 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
    </div>
  );
}

/* ── Main section ─────────────────────────────── */
export default function FounderSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section ref={sectionRef} id="about" className="relative py-24 overflow-hidden">
      {/* Subtle parallax grid — no vertical accent lines */}
      <motion.div className="absolute inset-0 bg-grid opacity-[0.12]" style={{ y: bgY }} />
      <div className="absolute inset-0 aurora-bg opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/93 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-label mb-5">THE MIND BEHIND IT</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-[clamp(2rem,4.5vw,4rem)] font-black tracking-tight">
            <span className="text-white">Meet the </span>
            <span className="text-gradient-cyan">Founder</span>
          </motion.h2>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 items-start">

          {/* ── LEFT COLUMN ──────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-5">

            {/* Profile card */}
            <div className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(0,229,255,0.07), rgba(0,0,0,0.55))',
                border: '1px solid rgba(0,229,255,0.14)',
                boxShadow: '0 0 50px rgba(0,229,255,0.05)',
              }}>
              {/* Ambient glow orb (no vertical lines, stays inside card) */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 animate-orb-pulse pointer-events-none"
                style={{ background: 'radial-gradient(circle, #00E5FF, transparent)', transform: 'translate(35%,-35%)', filter: 'blur(32px)' }} />

              <div className="relative p-7">
                {/* Avatar + name row */}
                <div className="flex items-start gap-5 mb-5">
                  <div className="relative flex-shrink-0">
                    <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}>
                      <span className="text-xl font-black text-black tracking-tight">AH</span>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-black flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                    </div>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-[1.35rem] font-black text-white tracking-tight leading-tight">Adelaja Hassan</h3>
                    <p className="text-cyan-400 font-semibold text-[13px] mt-0.5">Full Stack Developer & AI Engineer</p>
                    <p className="text-gray-500 text-[12px]">Founder — Giverham Tech</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-400 text-[13.5px] leading-relaxed mb-5">
                  Passionate full-stack developer with 5+ years crafting world-class digital experiences.
                  I specialize in React, Node.js, Supabase, and AI integration — building products that
                  are fast, beautiful, and built to scale. I founded Giverham Tech to bring
                  enterprise-grade engineering to businesses worldwide.
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2">
                  {techBadges.map(b => (
                    <span key={b.name}
                      className="text-[10px] px-2.5 py-1 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                      style={{ background: `${b.color}12`, color: b.color, border: `1px solid ${b.color}25` }}>
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Corner accents inside the card */}
              <div className="absolute top-3 left-3 w-3.5 h-3.5"
                style={{ borderTop: '1px solid rgba(0,229,255,0.28)', borderLeft: '1px solid rgba(0,229,255,0.28)' }} />
              <div className="absolute bottom-3 right-3 w-3.5 h-3.5"
                style={{ borderBottom: '1px solid rgba(0,229,255,0.28)', borderRight: '1px solid rgba(0,229,255,0.28)' }} />
            </div>

            {/* Experience highlights (4 mini stat cards) */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <motion.div key={h.label}
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="group relative rounded-xl p-4 overflow-hidden cursor-default"
                    style={{ background: `${h.color}07`, border: `1px solid ${h.color}16` }}>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${h.color}10, transparent)` }} />
                    <Icon size={15} style={{ color: h.color }} className="mb-2" />
                    <div className="text-xl font-black font-mono" style={{ color: h.color }}>{h.value}</div>
                    <div className="text-[11px] text-gray-500 font-medium">{h.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Timeline */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.055)' }}>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Journey</div>
              <div className="space-y-3.5">
                {timeline.map((item, i) => (
                  <motion.div key={item.year}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 group">
                    <span className="font-mono text-[11px] font-bold text-cyan-400/60 flex-shrink-0 w-8 pt-0.5">{item.year}</span>
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 transition-colors duration-200 group-hover:bg-cyan-400"
                      style={{ background: i === timeline.length - 1 ? '#00E5FF' : 'rgba(255,255,255,0.12)' }} />
                    <span className="text-[12px] text-gray-500 group-hover:text-gray-300 transition-colors duration-200 leading-snug">
                      {item.event}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN — Skill groups ──────── */}
          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-4">

            {skillGroups.map((group, gi) => {
              const Icon = group.Icon;
              return (
                <motion.div key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.08 }}
                  className="rounded-2xl p-6"
                  style={{
                    background: `linear-gradient(145deg, ${group.color}05, rgba(0,0,0,0.4))`,
                    border: `1px solid ${group.color}12`,
                  }}>
                  {/* Group header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${group.color}14`, border: `1px solid ${group.color}22` }}>
                      <Icon size={14} style={{ color: group.color }} />
                    </div>
                    <span className="font-bold text-white text-[13px]">{group.category}</span>
                    {/* Proficiency dots */}
                    <div className="ml-auto flex gap-1">
                      {[0.3, 0.5, 0.7, 0.85, 1].map((op, idx) => (
                        <div key={idx} className="w-3.5 h-1 rounded-full"
                          style={{ background: group.color, opacity: op }} />
                      ))}
                    </div>
                  </div>
                  {/* Skill bars */}
                  <div className="space-y-3">
                    {group.items.map((skill, si) => (
                      <SkillBar key={skill.name} name={skill.name} level={skill.level} color={group.color} index={si} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
