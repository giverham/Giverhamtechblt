import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_TECH_ROW1, DEFAULT_TECH_ROW2, DEFAULT_WHY_US } from '@/lib/cmsDefaults';

export const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  site_name: 'GIVERHAM TECH',
  tagline: 'We engineer digital experiences that transform businesses.',
  email: 'hello@giverhamtech.com',
  phone: '',
  phone_number: '',
  address: '',
  whatsapp: '+2348100000000',
  twitter: 'https://twitter.com/giverhamtech',
  instagram: 'https://instagram.com/giverhamtech',
  linkedin: 'https://linkedin.com/company/giverhamtech',
  github: 'https://github.com/giverham',
  tiktok: '',
  facebook: '',
  youtube: '',
  threads: '',
  footer_bio: 'We engineer digital experiences that transform businesses. Premium websites, AI platforms, and custom software for the modern world.',
  engineered_by: 'Giverham Tech',
  copyright_text: '',
  logo_url: '/logo.svg',
  founder_name: 'Adelaja Hassan M.',
  founder_title: 'Full Stack Developer & AI Engineer',
  founder_bio: 'I build premium digital products, AI-powered platforms, banking systems, e-commerce solutions, media platforms, and scalable business software designed for performance, reliability, and growth.',
  founder_photo_url: '',
  services_label: 'WHAT WE DO',
  services_title: 'Services Built for Modern Businesses',
  tech_heading: 'We use industry leading technology stack',
  tech_description: 'Every project is built with the most powerful tools in the industry — delivering speed, security, and scalability from day one.',
  why_us_heading: 'WHY GIVERHAM TECH',
  testimonials_heading: 'WHAT OUR CLIENTS SAY',
  blog_heading: 'The Knowledge Hub',
  contact_label: 'GET IN TOUCH',
  contact_title: "LET'S BUILD SOMETHING EXTRAORDINARY.",
  contact_description: "Ready to transform your digital presence? Let's create something world-class together.",
  why_us_items: JSON.stringify(DEFAULT_WHY_US),
  tech_stack_row1: JSON.stringify(DEFAULT_TECH_ROW1),
  tech_stack_row2: JSON.stringify(DEFAULT_TECH_ROW2),
  footer_company: 'About Us,Blog,Projects,Testimonials,Contact',
};

let cache = { ...DEFAULT_SITE_SETTINGS };
let loaded = false;
let inflight: Promise<Record<string, string>> | null = null;
const listeners = new Set<(settings: Record<string, string>) => void>();
let realtimeReady = false;

function publish(next: Record<string, string>) {
  cache = next;
  loaded = true;
  listeners.forEach((fn) => fn(next));
}

async function fetchSettings(): Promise<Record<string, string>> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const { data } = await supabase.from('website_settings').select('key,value');
      const next = { ...DEFAULT_SITE_SETTINGS };
      (data ?? []).forEach((row: { key: string; value: string }) => {
        if (row.key && row.value != null && row.value !== '') next[row.key] = row.value;
      });
      if (next.site_logo_url && !next.logo_url) next.logo_url = next.site_logo_url;
      if (next.logo_url && !next.site_logo_url) next.site_logo_url = next.logo_url;
      if (next.phone_number && !next.phone) next.phone = next.phone_number;
      if (next.phone && !next.phone_number) next.phone_number = next.phone;
      publish(next);
      return next;
    } catch {
      return cache;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

function ensureRealtime() {
  if (realtimeReady) return;
  realtimeReady = true;
  supabase
    .channel('website-settings-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'website_settings' }, () => {
      inflight = null;
      fetchSettings();
    })
    .subscribe();
}

export function useWebsiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(cache);
  const [loading, setLoading] = useState(!loaded);

  useEffect(() => {
    const onChange = (next: Record<string, string>) => {
      setSettings(next);
      setLoading(false);
    };
    listeners.add(onChange);
    ensureRealtime();
    fetchSettings().then(() => setLoading(false));
    return () => { listeners.delete(onChange); };
  }, []);

  const refetch = useCallback(() => {
    inflight = null;
    return fetchSettings();
  }, []);

  return { settings, loading, refetch };
}
