import { motion } from 'framer-motion';
import { Palette, Shield, Zap, Brain, Smartphone, Search, HeadphonesIcon, Server } from 'lucide-react';

const reasons = [
  { icon: Palette,          title: 'Award-Winning UI/UX',     desc: 'Designs that captivate users in the first second and drive conversions through beauty and clarity.',           color: '#00E5FF', delay: 0 },
  { icon: Server,           title: 'Scalable Architecture',   desc: 'Systems built to handle millions of users with zero downtime and perfect reliability from day one.',           color: '#00FFD1', delay: 0.05 },
  { icon: Shield,           title: 'Enterprise Security',     desc: 'Encryption, RLS, authentication, and compliance baked in — not bolted on.',                                   color: '#3B82F6', delay: 0.1 },
  { icon: Zap,              title: 'Blazing Performance',     desc: 'Sub-second load times, 95+ Lighthouse scores, edge networks, and optimized Core Web Vitals.',                 color: '#F59E0B', delay: 0.15 },
  { icon: Brain,            title: 'AI-Powered Features',     desc: 'Intelligent automation, personalization, and LLM integrations that give your product a genuine edge.',        color: '#8B5CF6', delay: 0.2 },
  { icon: Smartphone,       title: 'Mobile-First Design',     desc: 'Pixel-perfect experiences across every device and viewport — phones, tablets, and ultra-wide displays.',      color: '#EC4899', delay: 0.25 },
  { icon: Search,           title: 'SEO Optimized',           desc: 'Semantic HTML, structured data, Core Web Vitals, and technical SEO built into every page from the start.',   color: '#10B981', delay: 0.3 },
  { icon: HeadphonesIcon,   title: 'Premium Support',         desc: 'Dedicated team, SLA guarantees, proactive monitoring, and fast response times around the clock.',            color: '#00E5FF', delay: 0.35 },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/97 to-black" />

      {/* Center line */}
      <div className="absolute left-1/2 top-20 bottom-20 w-px opacity-5 -translate-x-1/2 hidden lg:block"
        style={{ background: 'linear-gradient(to bottom, transparent, #00E5FF 20%, #00E5FF 80%, transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-label mb-6"
          >WHY GIVERHAM TECH</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-[clamp(2.2rem,5vw,4.5rem)] font-black tracking-tight"
          >
            <span className="text-white">Excellence Is</span>
            <br />
            <span className="text-gradient-cyan">Our Standard</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: r.delay, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } }}
                className="group relative p-6 rounded-2xl overflow-hidden cursor-default"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.055)' }}
              >
                {/* Hover fill */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 30% 30%, ${r.color}08 0%, transparent 65%)` }} />

                {/* Icon */}
                <div className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${r.color}14`, border: `1px solid ${r.color}25` }}>
                  <Icon size={19} style={{ color: r.color }} />
                </div>

                {/* Text */}
                <div className="relative">
                  <h3 className="font-bold text-[14px] text-white mb-2 leading-snug">{r.title}</h3>
                  <p className="text-gray-500 text-[12px] leading-relaxed">{r.desc}</p>
                </div>

                {/* Bottom sweep */}
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${r.color}50, transparent)` }} />

                {/* Top-right accent dot */}
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: r.color }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
