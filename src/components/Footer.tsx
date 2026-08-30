import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Github, ArrowUpRight, Music, Facebook, Youtube } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { normalizeHttpUrl } from '@/lib/contactLinks';
import { DEFAULT_FOOTER_COMPANY, splitAccentTitle } from '@/lib/cmsDefaults';

const companyRouteMap: Record<string, { path: string; targetId: string }> = {
  'About Us': { path: '/about', targetId: 'about' },
  About: { path: '/about', targetId: 'about' },
  Blog: { path: '/blog', targetId: 'blog' },
  Projects: { path: '/projects', targetId: 'projects' },
  Testimonials: { path: '/testimonials', targetId: 'testimonials' },
  Contact: { path: '/contact', targetId: 'contact' },
};

export default function Footer() {
  const navigate = useNavigate();
  const { settings } = useWebsiteSettings();
  const [serviceTitles, setServiceTitles] = useState<string[]>([]);
  const { head: brandHead, tail: brandTail } = splitAccentTitle(settings.site_name || 'GIVERHAM TECH');
  const logoUrl = settings.logo_url || settings.site_logo_url || '/logo.svg';
  const companyLinks = (settings.footer_company || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const company = companyLinks.length ? companyLinks : DEFAULT_FOOTER_COMPANY;
  const year = new Date().getFullYear();
  const copyright = settings.copyright_text || `© ${year} ${settings.site_name || 'Giverham Tech'}. All rights reserved.`;

  const socials = [
    { icon: Twitter, href: normalizeHttpUrl(settings.twitter), label: 'Twitter' },
    { icon: Instagram, href: normalizeHttpUrl(settings.instagram), label: 'Instagram' },
    { icon: Linkedin, href: normalizeHttpUrl(settings.linkedin), label: 'LinkedIn' },
    { icon: Github, href: normalizeHttpUrl(settings.github), label: 'GitHub' },
    { icon: Music, href: normalizeHttpUrl(settings.tiktok), label: 'TikTok' },
    { icon: Facebook, href: normalizeHttpUrl(settings.facebook), label: 'Facebook' },
    { icon: Youtube, href: normalizeHttpUrl(settings.youtube), label: 'YouTube' },
  ].filter((item) => item.href);

  useEffect(() => {
    const load = () => {
      supabase.from('services').select('title').eq('published', true).order('sort_order').then(({ data }) => {
        if (data?.length) setServiceTitles(data.map((row: { title: string }) => row.title));
      });
    };
    load();
    const channel = supabase
      .channel('footer-services-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleCompanyClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    const route = companyRouteMap[link] || { path: '/', targetId: '' };
    navigate(route.path);
    if (route.targetId) document.getElementById(route.targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleServiceClick = (e: React.MouseEvent, _link?: string) => {
    e.preventDefault();
    navigate('/services');
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const footerColumns = [
    { title: 'Services', links: serviceTitles.length ? serviceTitles.slice(0, 6) : ['Website Development', 'Full Stack Development', 'AI Integration', 'E-Commerce', 'Banking Systems', 'SaaS Applications'], onClick: handleServiceClick },
    { title: 'Company', links: company, onClick: handleCompanyClick },
  ];

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.25) 30%, rgba(0,255,209,0.2) 70%, transparent 100%)' }} />

      <div className="absolute inset-0 bg-grid-sm opacity-15" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #000000, #030303)' }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 pointer-events-none opacity-8"
        style={{ background: 'radial-gradient(ellipse at top, rgba(0,229,255,0.15), transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10 lg:mb-12">

          <div className="col-span-2">
            <div className="-translate-y-8 sm:translate-y-0">
            <motion.a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 mb-5 group"
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden">
                <img src={logoUrl} alt={`${settings.site_name || 'Giverham Tech'} Logo`} className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-black text-white text-xl tracking-tight">{brandHead}</span>
                {brandTail && <span className="font-extralight text-cyan-400 text-xl ml-1">{brandTail}</span>}
              </div>
            </motion.a>

            <p className="text-gray-600 text-[13px] leading-relaxed max-w-xs mb-6">
              {settings.footer_bio || settings.tagline}
            </p>
            </div>
            <div className="h-8 sm:hidden" aria-hidden />

            <div className="flex gap-2.5">
              {socials.map(s => {
                const Icon = s.icon;
                return (
                  <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:text-cyan-400 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-white font-semibold text-[13px] mb-5 tracking-wide">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map(link => (
                  <li key={link}>
                    <a
                      href={column.title === 'Company' ? (companyRouteMap[link]?.path || '/') : '/services'}
                      onClick={(e) => column.onClick(e, link)}
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

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.055)' }}>
          <p className="text-[12px] text-gray-400">
            {copyright}
          </p>
          <div className="flex gap-5">
            <a href="/privacy" className="text-[12px] text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-[12px] text-gray-400 hover:text-white transition-colors">Terms of Service</a>
          </div>
          <p className="text-[12px] text-gray-400">
            Engineered by{' '}
            <span className="font-semibold" style={{ background: 'linear-gradient(90deg, #00E5FF, #00FFD1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {settings.engineered_by || 'Giverham Tech'}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
