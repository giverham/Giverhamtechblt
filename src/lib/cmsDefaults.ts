export type WhyUsItem = {
  icon: string;
  title: string;
  desc: string;
  color: string;
  badge: string;
};

export type TechItem = {
  name: string;
  color: string;
  mono: string;
};

export const DEFAULT_WHY_US: WhyUsItem[] = [
  { icon: 'Palette', title: 'High-Impact UI/UX', desc: 'Captivating designs driving conversions through clarity and modern aesthetics.', color: '#00E5FF', badge: 'OPTIMIZED' },
  { icon: 'Brain', title: 'AI-Powered Features', desc: 'Intelligent automation, personalization, and LLM integrations for a genuine edge.', color: '#8B5CF6', badge: 'LLM READY' },
  { icon: 'Server', title: 'Scalable Architecture', desc: 'Built to handle high volume with zero downtime and total reliability.', color: '#00FFD1', badge: '99.99% UPTIME' },
  { icon: 'Zap', title: 'Blazing Performance', desc: 'Sub-second load times, 95+ Lighthouse scores, and edge network optimizations.', color: '#F59E0B', badge: 'SUB-SECOND' },
  { icon: 'Shield', title: 'Enterprise Security', desc: 'Encryption, access control, authentication, and compliance baked in from day one.', color: '#3B82F6', badge: 'BANK-GRADE' },
  { icon: 'Smartphone', title: 'Mobile-First Design', desc: 'Pixel-perfect responsive experiences across phones, tablets, and wide displays.', color: '#EC4899', badge: 'RESPONSIVE' },
];

export const DEFAULT_TECH_ROW1: TechItem[] = [
  { name: 'React', color: '#61DAFB', mono: 'R' },
  { name: 'TypeScript', color: '#3178C6', mono: 'TS' },
  { name: 'Node.js', color: '#339933', mono: 'N' },
  { name: 'Express', color: '#EEEEEE', mono: 'EX' },
  { name: 'PostgreSQL', color: '#336791', mono: 'PG' },
  { name: 'MongoDB', color: '#47A248', mono: 'MG' },
  { name: 'OpenAI', color: '#10A37F', mono: 'AI' },
  { name: 'Tailwind CSS', color: '#06B6D4', mono: 'TW' },
];

export const DEFAULT_TECH_ROW2: TechItem[] = [
  { name: 'Next.js', color: '#FFFFFF', mono: 'NX' },
  { name: 'AWS', color: '#FF9900', mono: 'AWS' },
  { name: 'GitHub', color: '#EEEEEE', mono: 'GH' },
  { name: 'Stripe', color: '#635BFF', mono: 'ST' },
  { name: 'Firebase', color: '#FFCA28', mono: 'FB' },
  { name: 'Docker', color: '#2496ED', mono: 'DK' },
  { name: 'REST APIs', color: '#00E5FF', mono: 'API' },
  { name: 'AI Agents', color: '#8B5CF6', mono: 'AG' },
];

export const DEFAULT_FOOTER_COMPANY = ['About Us', 'Blog', 'Projects', 'Testimonials', 'Contact'];

export const BLOG_CATEGORIES = ['Web Development', 'AI Development', 'UI/UX', 'Business Growth', 'Technology', 'Deployment', 'Design', 'Business', 'AI/ML', 'Case Study'];

export function parseJsonArray<T>(raw: string, fallback: T[]): T[] {
  if (!raw?.trim()) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function splitAccentTitle(title: string) {
  const trimmed = title.trim();
  const lastSpace = trimmed.lastIndexOf(' ');
  if (lastSpace <= 0) return { head: trimmed, tail: '' };
  return { head: trimmed.slice(0, lastSpace), tail: trimmed.slice(lastSpace + 1) };
}
