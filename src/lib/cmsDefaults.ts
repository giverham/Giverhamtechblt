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

export const DEFAULT_PRIVACY_TITLE = 'Privacy Policy';
export const DEFAULT_TERMS_TITLE = 'Terms of Service';
export const DEFAULT_LEGAL_UPDATED = '30 August 2026';

export const DEFAULT_PRIVACY_BODY = `{company} ("we", "us", or "our") respects your privacy. This policy explains what information we collect when you visit giverham.com or contact us, how we use it, and the choices you have.

## Information we collect

If you send a message through our contact form, we collect the details you choose to share, such as your name, email address, phone number, and project notes. If you email or message us directly, we also keep that correspondence so we can reply and manage your request.

## How we use it

We use your information only to respond to enquiries, discuss possible work, deliver services you ask for, and keep a record of our conversation. We do not sell your information and we do not use it for unrelated advertising.

## Sharing

We may share information with trusted operators who help us run email, hosting, or communication tools, and only as needed to provide those services. We may also disclose information if the law requires it.

## Retention

We keep enquiry records for as long as needed to complete your request and to maintain a reasonable business record. You may ask us to update or delete your details at any time.

## Your rights

You may request access to the personal information we hold about you, ask us to correct it, or ask us to delete it, subject to any legal duty to retain records.

## Contact

For privacy questions, email us at {email}.`;

export const DEFAULT_TERMS_BODY = `These terms govern your use of the {company} website and any enquiry you send through it. By using giverham.com, you agree to this notice.

## Our work

{company} designs and builds digital products for clients. Information on this website describes our capabilities and selected work. Sending an enquiry does not create a paid engagement. A project begins only when both sides agree in writing, including scope, timeline, and fees.

## Website use

You may browse this site for information about our studio. You may not copy the site, scrape it, or use it in a way that harms its security or availability. Project names and visuals remain the property of {company} or the relevant client.

## Enquiries

When you contact us, you confirm that the details you share are accurate and that you are allowed to send them. We will use that information to reply and, if we work together, to deliver the agreed service.

## Limitation

This website is provided as a public introduction to our studio. We do not warrant that it will always be uninterrupted. To the fullest extent allowed by law, {company} is not liable for losses that arise only from browsing or relying on general information on this site.

## Changes

We may update these terms as our studio grows. The date at the top of this page shows the latest version.

## Contact

Questions about these terms can be sent to {email}.`;

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
