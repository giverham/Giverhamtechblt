import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Services',  href: '#services' },
  { label: 'Projects',  href: '#projects' },
  { label: 'Tech',      href: '#tech' },
  { label: 'About',     href: '#about' },
  { label: 'Blog',      href: '#blog' },
  { label: 'Contact',   href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(4,4,4,0.94)']);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    return scrollY.onChange(v => setScrolled(v > 40));
  }, [scrollY]);

  return (
    <>
      <motion.header
        style={{ backgroundColor: navBg }}
        className="fixed top-0 inset-x-0 z-50"
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #00E5FF 30%, #00FFD1 70%, transparent 100%)', opacity: borderOpacity }}
        />

        <div
          className="transition-all duration-500"
          style={{
            backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.055)' : '1px solid transparent',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 h-[62px] flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Zap size={15} className="text-black" fill="currentColor" />
              </motion.div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-black text-white tracking-tight text-[17px]">GIVERHAM</span>
                <span className="font-extralight text-cyan-400 text-[17px] ml-1">TECH</span>
              </div>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                  className="relative px-4 py-2 text-[13px] text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-4 right-4 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                    style={{ background: 'linear-gradient(90deg, #00E5FF, #00FFD1)' }} />
                </motion.a>
              ))}
            </nav>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <motion.a
                href="#contact"
                className="hidden md:flex btn-primary text-[11.5px] py-1.5 px-3.5 group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                Start a Project
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <button
                onClick={() => setOpen(o => !o)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl glass border border-white/10 hover:border-cyan-400/30 transition-all"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={open ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {open ? <X size={17} /> : <Menu size={17} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, y: 0, backdropFilter: 'blur(32px)' }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-0 top-[62px] z-40 md:hidden"
            style={{ background: 'rgba(3,3,3,0.96)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-3.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400/40 group-hover:bg-cyan-400 transition-colors" />
                  {link.label}
                </motion.a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="btn-primary mt-3 justify-center">
                Start a Project
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
