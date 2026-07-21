import { motion } from 'framer-motion';
import { Zap, Twitter, Instagram, Linkedin, Github, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  Services: ['Website Development', 'Full Stack Development', 'AI Integration', 'E-Commerce', 'Banking Systems', 'SaaS Applications'],
  Company:  ['About Us', 'Blog', 'Projects', 'Testimonials', 'Contact'],
  Stack:    ['React & TypeScript', 'Node.js & Express', 'Supabase', 'Vercel', 'OpenAI'],
};

const socials = [
  { icon: Twitter,   href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin,  href: '#', label: 'LinkedIn' },
  { icon: Github,    href: '#', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.25) 30%, rgba(0,255,209,0.2) 70%, transparent 100%)' }} />

      <div className="absolute inset-0 bg-grid-sm opacity-15" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #000000, #030303)' }} />

      {/* Ambient glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 pointer-events-none opacity-8"
        style={{ background: 'radial-gradient(ellipse at top, rgba(0,229,255,0.15), transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">

          {/* Brand */}
          <div className="col-span-2">
            <motion.a
              href="/"
              className="flex items-center gap-2.5 mb-5 group"
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}>
                <Zap size={17} className="text-black" fill="currentColor" />
              </div>
              <div>
                <span className="font-black text-white text-xl tracking-tight">GIVERHAM</span>
                <span className="font-extralight text-cyan-400 text-xl ml-1">TECH</span>
              </div>
            </motion.a>

            <p className="text-gray-600 text-[13px] leading-relaxed max-w-xs mb-6">
              We engineer digital experiences that transform businesses.
              Premium websites, AI platforms, and custom software for the modern world.
            </p>

            <div className="flex gap-2.5">
              {socials.map(s => {
                const Icon = s.icon;
                return (
                  <a key={s.label} href={s.href} aria-label={s.label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:text-cyan-400 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="text-white font-semibold text-[13px] mb-5 tracking-wide">{cat}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a href="#"
                      className="text-gray-600 text-[13px] hover:text-gray-300 transition-colors duration-200 flex items-center gap-1 group">
                      {link}
                      <ArrowUpRight size={9} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="flex flex-wrap gap-5 mb-12 pb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
          <a href="mailto:hello@giverhamtech.com"
            className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-cyan-400 transition-colors group">
            <Mail size={13} className="group-hover:scale-110 transition-transform" />
            hello@giverhamtech.com
          </a>
          <a href="https://wa.me/2348100000000" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-green-400 transition-colors group">
            <MessageCircle size={13} className="group-hover:scale-110 transition-transform" />
            WhatsApp
          </a>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-700">
            © {new Date().getFullYear()} Giverham Tech. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service'].map(t => (
              <a key={t} href="#" className="text-[12px] text-gray-700 hover:text-gray-500 transition-colors">{t}</a>
            ))}
          </div>
          <p className="text-[12px] text-gray-700">
            Engineered by{' '}
            <span className="font-semibold" style={{ background: 'linear-gradient(90deg, #00E5FF, #00FFD1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Giverham Tech
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
