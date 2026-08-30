export type KnowledgeArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover_image_url: string;
  content: string;
  created_at: string;
  featured: boolean;
  tags: string[];
  author: string;
  reading_time: number;
  published: boolean;
};

export const OLD_KNOWLEDGE_SLUGS = [
  'building-saas-react-supabase',
  'future-ai-web-experiences',
  'premium-ui-framer-tailwind',
  'deploy-vercel-edge-network',
];

export const KNOWLEDGE_HUB_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'guide-web-2026',
    title: 'Web Development in 2026: What Still Matters',
    slug: 'web-development-2026-what-still-matters',
    excerpt: 'A short guide to building sites that stay fast, clear, and easy to maintain this year.',
    category: 'Web Development',
    cover_image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80',
    featured: true,
    tags: ['Web', 'Performance', '2026'],
    author: 'Giverham Tech',
    reading_time: 4,
    published: true,
    created_at: '2026-08-01T10:00:00.000Z',
    content: `The best websites in 2026 are not the ones with the most features. They are the ones that load quickly, explain the offer clearly, and work on a phone without effort.

Start with the page people land on. One message. One action. Then add the rest.

Keep the stack simple. A fast front end, a reliable database, and a form that actually reaches you will outperform a crowded build.

Measure real visits on a mid-range phone. If the first screen is slow there, it is slow for most customers.

Ship in small pieces. Launch the core page, watch how people use it, then add booking, payments, or accounts only when the need is clear.`,
  },
  {
    id: 'guide-ai-2026',
    title: 'A Practical Guide to AI on Your Website',
    slug: 'practical-guide-ai-on-your-website',
    excerpt: 'How businesses are using AI in 2026 without turning the site into a gimmick.',
    category: 'AI Development',
    cover_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    tags: ['AI', 'Automation', 'Product'],
    author: 'Giverham Tech',
    reading_time: 4,
    published: true,
    created_at: '2026-08-04T10:00:00.000Z',
    content: `AI is useful when it saves time or answers a real question. It is noise when it chats just to look modern.

Good uses this year: draft replies, summarise enquiries, recommend the right service, and help staff find information faster.

Keep a person in the loop for money, legal, and medical topics. The model can draft. You approve.

Feed it your own content: services, prices, process, and FAQs. Generic answers make people leave.

If a simple form or a WhatsApp button solves the job, use that. Add AI only where it reduces waiting or confusion.`,
  },
  {
    id: 'guide-ui-2026',
    title: 'UI That Converts: A 2026 Checklist',
    slug: 'ui-that-converts-2026-checklist',
    excerpt: 'Short rules for interfaces that feel premium and still get the click.',
    category: 'UI/UX',
    cover_image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    tags: ['UI', 'UX', 'Conversion'],
    author: 'Giverham Tech',
    reading_time: 3,
    published: true,
    created_at: '2026-08-07T10:00:00.000Z',
    content: `People decide in seconds. If they cannot see what you do and what to do next, the design has failed.

Put the promise above the fold. Keep the main button visible. Use fewer fonts and a clear contrast.

Motion should guide the eye, not delay the page. A short fade is enough.

Design the tap targets for thumbs. Tiny links on mobile cost leads.

Test with someone outside your team. If they hesitate, rewrite the label before you add another animation.`,
  },
  {
    id: 'guide-growth-2026',
    title: 'Business Growth From a Website That Works',
    slug: 'business-growth-from-a-website-that-works',
    excerpt: 'How a focused site helps a studio or company win better clients in 2026.',
    category: 'Business Growth',
    cover_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    tags: ['Growth', 'Leads', 'Trust'],
    author: 'Giverham Tech',
    reading_time: 4,
    published: true,
    created_at: '2026-08-10T10:00:00.000Z',
    content: `A website grows a business when it makes the next step obvious: call, message, or book.

Show proof near the offer. A project, a result, or a clear process reduces doubt.

Answer the three questions buyers already have: what you do, who it is for, and how to start.

Speed and trust signals matter. Broken links, old dates, and missing contact details send people away.

Treat the site as a salesperson that never sleeps. Update it when your offer changes. A quiet, accurate page beats a loud, outdated one.`,
  },
  {
    id: 'guide-tech-2026',
    title: 'Choosing Technology Without the Noise',
    slug: 'choosing-technology-without-the-noise',
    excerpt: 'A calm way to pick tools in 2026 so the product stays yours.',
    category: 'Technology',
    cover_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    tags: ['Technology', 'Architecture', 'Decisions'],
    author: 'Giverham Tech',
    reading_time: 4,
    published: true,
    created_at: '2026-08-13T10:00:00.000Z',
    content: `New tools appear every month. Most projects do not need all of them.

Ask three questions: will this help a customer, can we support it, and can we leave it later?

Prefer boring, proven pieces for payments, login, and data. Experiment at the edges, not at the core.

Write down why you chose each part. Future you, or a new developer, will thank you.

The winning stack is the one your team can ship and fix. Fashion is a poor architect.`,
  },
  {
    id: 'guide-deploy-2026',
    title: 'Safer Launches: Deployment in 2026',
    slug: 'safer-launches-deployment-2026',
    excerpt: 'How to put updates live without breaking what already works.',
    category: 'Deployment',
    cover_image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    tags: ['Deployment', 'Reliability', 'Launch'],
    author: 'Giverham Tech',
    reading_time: 3,
    published: true,
    created_at: '2026-08-16T10:00:00.000Z',
    content: `A launch should feel quiet. Preview the change, check the main paths, then publish.

Keep a way to roll back. If a page fails, you want the last good version back in minutes.

Protect secrets. Never put keys in the public repo. Rotate anything that has been shared.

Watch the live site after a release: contact form, login, and checkout first.

Small, frequent updates beat one large drop. You see problems sooner and customers stay calm.`,
  },
  {
    id: 'guide-design-2026',
    title: 'Design Systems That Stay Consistent',
    slug: 'design-systems-that-stay-consistent',
    excerpt: 'Why a small set of shared rules makes a brand look expensive.',
    category: 'Design',
    cover_image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    tags: ['Design', 'Brand', 'Systems'],
    author: 'Giverham Tech',
    reading_time: 3,
    published: true,
    created_at: '2026-08-19T10:00:00.000Z',
    content: `Consistency is what people call “premium”. Same spacing, same buttons, same voice.

You do not need a huge library. Start with colour, type, cards, and one primary button.

Reuse those pieces on every page. The about page should feel like the contact page.

Leave room. Crowded layouts look cheap even with expensive photos.

Review the site on a phone every time you add a section. If it stacks badly, fix the system, not just that page.`,
  },
  {
    id: 'guide-aiml-2026',
    title: 'AI and Machine Learning for Real Products',
    slug: 'ai-and-machine-learning-for-real-products',
    excerpt: 'Where ML helps in 2026, and where a simple rule is still better.',
    category: 'AI/ML',
    cover_image_url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    tags: ['AI', 'ML', 'Products'],
    author: 'Giverham Tech',
    reading_time: 4,
    published: true,
    created_at: '2026-08-22T10:00:00.000Z',
    content: `Machine learning earns its place when you have a pattern: demand, fraud, ranking, or support volume.

If the rule is “if the cart is over X, offer Y”, write the rule. Do not train a model for that.

When you do use ML, start with clean data and a clear success number: fewer tickets, faster replies, better matches.

Tell users when a suggestion is automated. Trust drops when a system pretends to be a person.

Review outputs. Models drift. A monthly check of real examples keeps the product honest.`,
  },
];
