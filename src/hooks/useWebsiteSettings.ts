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
  logo_url: '',
  site_logo_url: '',
  favicon_url: '',
  site_favicon_url: '',
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

const SETTINGS_CACHE_KEY = 'giverham_website_settings';

function readLocalCache(): Record<string, string> {
  if (typeof window === 'undefined') return { ...DEFAULT_SITE_SETTINGS };
  try {
    const raw = window.localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!raw) return { ...DEFAULT_SITE_SETTINGS };
    const parsed = JSON.parse(raw) as Record<string, string>;
    return normalizeBrandKeys({ ...DEFAULT_SITE_SETTINGS, ...parsed });
  } catch {
    return { ...DEFAULT_SITE_SETTINGS };
  }
}

function writeLocalCache(next: Record<string, string>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
}

function normalizeBrandKeys(next: Record<string, string>) {
  if (next.site_logo_url && !next.logo_url) next.logo_url = next.site_logo_url;
  if (next.logo_url && !next.site_logo_url) next.site_logo_url = next.logo_url;
  if (next.site_favicon_url && !next.favicon_url) next.favicon_url = next.site_favicon_url;
  if (next.favicon_url && !next.site_favicon_url) next.site_favicon_url = next.favicon_url;
  if (next.phone_number && !next.phone) next.phone = next.phone_number;
  if (next.phone && !next.phone_number) next.phone_number = next.phone;
  return next;
}

function applyBrandAssets(next: Record<string, string>) {
  if (typeof document === 'undefined') return;
  const favicon = next.favicon_url || next.site_favicon_url;
  if (!favicon) return;
  const setHref = (rel: string) => {
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    if (link.href !== favicon) link.href = favicon;
  };
  setHref('icon');
  setHref('shortcut icon');
  setHref('apple-touch-icon');
}

let cache = readLocalCache();
let loaded = false;
let inflight: Promise<Record<string, string>> | null = null;
const listeners = new Set<(settings: Record<string, string>) => void>();
let realtimeReady = false;

function publish(next: Record<string, string>) {
  const normalized = normalizeBrandKeys(next);
  if (loaded && JSON.stringify(normalized) === JSON.stringify(cache)) return;
  cache = normalized;
  loaded = true;
  writeLocalCache(cache);
  applyBrandAssets(cache);
  listeners.forEach((fn) => fn(cache));
}

export function applySettingsPatch(partial: Record<string, string>) {
  publish(normalizeBrandKeys({ ...cache, ...partial }));
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
      publish(normalizeBrandKeys(next));
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

if (typeof window !== 'undefined') {
  applyBrandAssets(cache);
  fetchSettings();
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
    if (loaded) setLoading(false);
    else fetchSettings().then(() => setLoading(false));
    return () => { listeners.delete(onChange); };
  }, []);

  const refetch = useCallback(() => {
    inflight = null;
    return fetchSettings();
  }, []);

  return { settings, loading, refetch };
}
