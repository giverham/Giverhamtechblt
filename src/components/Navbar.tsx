import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, ArrowRight } from 'lucide-react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { splitAccentTitle } from '@/lib/cmsDefaults';

const navLinks = [
  { label: 'Services',  path: '/services', targetId: 'services' },
  { label: 'Projects',  path: '/projects', targetId: 'projects' },
  { label: 'Tech',      path: '/tech',     targetId: 'tech' },
  { label: 'About',     path: '/about',    targetId: 'about' },
  { label: 'Blog',      path: '/blog',     targetId: 'blog' },
  { label: 'Contact',   path: '/contact',  targetId: 'contact' },
];

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const { settings } = useWebsiteSettings();
  const siteLogoUrl = settings.logo_url || settings.site_logo_url || '/logo.svg';
  const { head: brandHead, tail: brandTail } = splitAccentTitle(settings.site_name || 'GIVERHAM TECH');
  const navigate                = useNavigate();
  const location                = useLocation();

  const handleNavClick = (e: React.MouseEvent, path: string, targetId: string) => {
    e.preventDefault();
    navigate(path);
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[56px] sm:h-[62px] flex items-center justify-between">
            
            {/* Compact Dynamic Brand Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group"
              aria-label="Giverham Tech Homepage"
            >
              <motion.div
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                style={!siteLogoUrl ? { background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' } : {}}
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {siteLogoUrl ? (
                  <img src={siteLogoUrl} alt="Giverham Tech Logo" className="w-full h-full object-contain" />
                ) : (
                  <Zap size={14} className="text-black sm:w-[16px] sm:h-[16px]" fill="currentColor" />
                )}
              </motion.div>

              <div className="flex items-baseline gap-0.5">
                <span className="font-black text-white tracking-wider text-xs sm:text-base md:text-lg">{brandHead}</span>
                {brandTail && <span className="font-extralight text-cyan-400 tracking-wider text-xs sm:text-base md:text-lg ml-0.5 sm:ml-1">{brandTail}</span>}
              </div>
            </a>

            {/* Desktop nav — centered & evenly spaced */}
            <nav className="hidden md:flex items-center justify-center space-x-2 lg:space-x-4">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.a
                    key={link.label}
                    href={link.path}
                    onClick={(e) => handleNavClick(e, link.path, link.targetId)}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                    className={`relative px-4 lg:px-5 py-2 text-[13px] transition-colors duration-200 group font-medium ${
                      isActive ? 'text-cyan-400' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-1 left-4 right-4 h-px origin-left transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                      style={{ background: 'linear-gradient(90deg, #00E5FF, #00FFD1)' }}
                    />
                  </motion.a>
                );
              })}
            </nav>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <motion.a
                href="/contact"
                onClick={(e) => handleNavClick(e, '/contact', 'contact')}
                className="hidden sm:flex bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-400 hover:text-black text-xs px-4 py-2 rounded-full font-semibold transition-all items-center gap-1.5 group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                aria-label="Start a project with Giverham Tech"
              >
                Start a Project
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <button
                onClick={() => setOpen(o => !o)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl glass border border-white/10 hover:border-cyan-400/30 transition-all"
                aria-label="Toggle navigation menu"
                aria-expanded={open}
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
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path, link.targetId)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-3.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400/40 group-hover:bg-cyan-400 transition-colors" />
                  {link.label}
                </motion.a>
              ))}
              <a href="/contact" onClick={(e) => handleNavClick(e, '/contact', 'contact')} className="btn-primary mt-3 justify-center">
                Start a Project
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
