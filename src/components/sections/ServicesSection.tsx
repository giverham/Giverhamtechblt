import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Service { id: string; title: string; description: string; icon: string; features: string[]; }

const fallbackServices: Service[] = [
  { id: '1',  title: 'Website Development',   description: 'Stunning, high-performance websites built with cutting-edge technologies that convert visitors into customers.', icon: 'Globe',        features: ['Responsive Design', 'SEO Optimized', 'Fast Loading'] },
  { id: '2',  title: 'Full Stack Development', description: 'End-to-end application development from database architecture to pixel-perfect interfaces.',                    icon: 'Code2',        features: ['React & Node.js', 'Database Design', 'API Development'] },
  { id: '3',  title: 'AI Integration',         description: 'Supercharge your business with intelligent AI features — chatbots, recommendations, automation.',               icon: 'Brain',        features: ['OpenAI Integration', 'Automation', 'Chatbots'] },
  { id: '4',  title: 'Business Websites',      description: 'Professional websites that establish authority and drive real business results.',                               icon: 'Briefcase',    features: ['Brand Identity', 'Lead Generation', 'Analytics'] },
  { id: '5',  title: 'E-Commerce',             description: 'Powerful online stores with seamless checkout, inventory management, and payment gateways.',                   icon: 'ShoppingCart', features: ['Payment Integration', 'Inventory', 'Analytics'] },
  { id: '6',  title: 'Real Estate Platforms',  description: 'Feature-rich property listing platforms with advanced search, maps, and virtual tours.',                       icon: 'Building2',    features: ['Property Listings', 'Map Integration', 'Virtual Tours'] },
  { id: '7',  title: 'Banking Systems',        description: 'Secure, compliant fintech applications with real-time transactions and fraud detection.',                      icon: 'Landmark',     features: ['Secure Transactions', 'KYC/AML', 'Compliance'] },
  { id: '8',  title: 'SaaS Applications',      description: 'Scalable software-as-a-service products with multi-tenancy, billing, and analytics.',                          icon: 'Layers',       features: ['Multi-tenancy', 'Subscription Billing', 'Analytics'] },
  { id: '9',  title: 'Supabase Development',   description: 'Expert Supabase backends — auth, real-time, edge functions, and database design.',                             icon: 'Database',     features: ['Auth Systems', 'Real-time Data', 'Edge Functions'] },
  { id: '10', title: 'API Integration',        description: 'Seamlessly connect third-party services — payments, communications, data providers.',                          icon: 'Plug',         features: ['REST & GraphQL', 'Webhook Handling', 'Documentation'] },
  { id: '11', title: 'Vercel Deployment',      description: 'Lightning-fast deployments on Vercel with CI/CD pipelines and performance monitoring.',                        icon: 'Zap',          features: ['CI/CD Pipeline', 'Edge Network', 'Analytics'] },
  { id: '12', title: 'Website Maintenance',    description: 'Ongoing support, updates, security patches, and performance optimization for your platform.',                  icon: 'Wrench',       features: ['Security Updates', 'Performance Tuning', '24/7 Monitoring'] },
];

const CARD_GRADIENTS = [
  ['rgba(0,229,255,0.12)', 'rgba(0,255,209,0.06)'],
  ['rgba(59,130,246,0.12)', 'rgba(0,229,255,0.06)'],
  ['rgba(139,92,246,0.1)',  'rgba(59,130,246,0.06)'],
  ['rgba(0,255,209,0.1)',   'rgba(0,229,255,0.06)'],
];

function TiltCard({ service, index }: { service: Service; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>>)[service.icon] || LucideIcons.Code2;
  const [g1, g2] = CARD_GRADIENTS[index % 4];
  const accentColor = ['#00E5FF', '#3B82F6', '#8B5CF6', '#00FFD1'][index % 4];

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top)  / rect.height;
    setTilt({ x: (cy - 0.5) * -16, y: (cx - 0.5) * 16 });
    setShine({ x: cx * 100, y: cy * 100 });
  };

  const onLeave = () => {
    setTilt({ x: 0, y: 0 });
    setShine({ x: 50, y: 50 });
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: '800px' }}
    >
      <div
        ref={cardRef}
        className="relative p-6 rounded-2xl h-full overflow-hidden cursor-default holo-sheen"
        style={{
          background: `linear-gradient(145deg, ${g1}, ${g2}, rgba(0,0,0,0.4))`,
          border: `1px solid ${accentColor}20`,
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovered ? 'scale(1.02)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease, box-shadow 0.3s ease',
          boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${accentColor}18` : '0 4px 24px rgba(0,0,0,0.3)',
        }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
      >
        {/* Dynamic shine */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* HUD corners */}
        <div className="absolute top-2 left-2 w-3 h-3 pointer-events-none"
          style={{ borderTop: `1px solid ${accentColor}50`, borderLeft: `1px solid ${accentColor}50` }} />
        <div className="absolute top-2 right-2 w-3 h-3 pointer-events-none"
          style={{ borderTop: `1px solid ${accentColor}50`, borderRight: `1px solid ${accentColor}50` }} />
        <div className="absolute bottom-2 left-2 w-3 h-3 pointer-events-none"
          style={{ borderBottom: `1px solid ${accentColor}50`, borderLeft: `1px solid ${accentColor}50` }} />
        <div className="absolute bottom-2 right-2 w-3 h-3 pointer-events-none"
          style={{ borderBottom: `1px solid ${accentColor}50`, borderRight: `1px solid ${accentColor}50` }} />

        {/* Content */}
        <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
            style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>
            <Icon size={20} style={{ color: accentColor }} />
          </div>

          <h3 className="text-[15px] font-bold text-white mb-2 leading-snug">{service.title}</h3>
          <p className="text-gray-500 text-[13px] leading-relaxed mb-4">{service.description}</p>

          <ul className="space-y-1.5">
            {service.features?.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-[12px] text-gray-500">
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: accentColor }} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom sweep */}
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ delay: (index % 4) * 0.08 + 0.5, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(fallbackServices);

  useEffect(() => {
    supabase.from('services').select('*').eq('published', true).order('sort_order').then(({ data }) => {
      if (data && data.length > 0) setServices(data);
    });
  }, []);

  return (
    <section id="services" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/97 to-black" />

      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(ellipse, #00E5FF, transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-label mb-6"
          >WHAT WE DO</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-[clamp(2.2rem,5vw,4.5rem)] font-black tracking-tight leading-[0.95]"
          >
            <span className="text-white">Services Built for</span>
            <br />
            <span className="text-gradient-cyan">Modern Businesses</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="mt-5 text-gray-500 max-w-lg mx-auto text-[15px]"
          >
            Every service engineered with precision, performance, and purpose — built to scale.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((s, i) => <TiltCard key={s.id} service={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}
