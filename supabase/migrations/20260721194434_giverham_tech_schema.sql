/*
# Giverham Tech — Full CMS Schema

## Summary
Creates all tables needed for the Giverham Tech website CMS and public frontend.
Tables: projects, services, testimonials, blog_posts, contact_messages, media_library,
seo_settings, analytics_events, website_settings.
All tables use RLS with anon+authenticated policies so the public frontend (anon key)
can read published content, and the admin (authenticated) can perform full CRUD.
*/

-- ───────────── PROJECTS ─────────────
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  features text[],
  tech_stack text[],
  category text,
  image_url text,
  video_url text,
  live_url text,
  case_study_url text,
  featured boolean DEFAULT false,
  published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projects_select" ON projects;
CREATE POLICY "projects_select" ON projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "projects_insert" ON projects;
CREATE POLICY "projects_insert" ON projects FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "projects_update" ON projects;
CREATE POLICY "projects_update" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "projects_delete" ON projects;
CREATE POLICY "projects_delete" ON projects FOR DELETE TO authenticated USING (true);

-- ───────────── SERVICES ─────────────
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  features text[],
  published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "services_select" ON services;
CREATE POLICY "services_select" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "services_insert" ON services;
CREATE POLICY "services_insert" ON services FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "services_update" ON services;
CREATE POLICY "services_update" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "services_delete" ON services;
CREATE POLICY "services_delete" ON services FOR DELETE TO authenticated USING (true);

-- ───────────── TESTIMONIALS ─────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  company text,
  avatar_url text,
  content text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "testimonials_select" ON testimonials;
CREATE POLICY "testimonials_select" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "testimonials_insert" ON testimonials;
CREATE POLICY "testimonials_insert" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_update" ON testimonials;
CREATE POLICY "testimonials_update" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_delete" ON testimonials;
CREATE POLICY "testimonials_delete" ON testimonials FOR DELETE TO authenticated USING (true);

-- ───────────── BLOG POSTS ─────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  cover_image_url text,
  category text,
  tags text[],
  author text DEFAULT 'Adelaja Hassan',
  reading_time integer DEFAULT 5,
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blog_posts_select" ON blog_posts;
CREATE POLICY "blog_posts_select" ON blog_posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "blog_posts_insert" ON blog_posts;
CREATE POLICY "blog_posts_insert" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "blog_posts_update" ON blog_posts;
CREATE POLICY "blog_posts_update" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "blog_posts_delete" ON blog_posts;
CREATE POLICY "blog_posts_delete" ON blog_posts FOR DELETE TO authenticated USING (true);

-- ───────────── CONTACT MESSAGES ─────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact_messages_select" ON contact_messages;
CREATE POLICY "contact_messages_select" ON contact_messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "contact_messages_insert" ON contact_messages;
CREATE POLICY "contact_messages_insert" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "contact_messages_update" ON contact_messages;
CREATE POLICY "contact_messages_update" ON contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "contact_messages_delete" ON contact_messages;
CREATE POLICY "contact_messages_delete" ON contact_messages FOR DELETE TO authenticated USING (true);

-- ───────────── MEDIA LIBRARY ─────────────
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_path text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('image', 'video', 'document')),
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  alt_text text,
  tags text[],
  created_at timestamptz DEFAULT now()
);
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "media_select" ON media_library;
CREATE POLICY "media_select" ON media_library FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "media_insert" ON media_library;
CREATE POLICY "media_insert" ON media_library FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "media_update" ON media_library;
CREATE POLICY "media_update" ON media_library FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "media_delete" ON media_library;
CREATE POLICY "media_delete" ON media_library FOR DELETE TO authenticated USING (true);

-- ───────────── SEO SETTINGS ─────────────
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text UNIQUE NOT NULL,
  title text,
  description text,
  keywords text[],
  og_image_url text,
  canonical_url text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "seo_select" ON seo_settings;
CREATE POLICY "seo_select" ON seo_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "seo_insert" ON seo_settings;
CREATE POLICY "seo_insert" ON seo_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "seo_update" ON seo_settings;
CREATE POLICY "seo_update" ON seo_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "seo_delete" ON seo_settings;
CREATE POLICY "seo_delete" ON seo_settings FOR DELETE TO authenticated USING (true);

-- ───────────── ANALYTICS EVENTS ─────────────
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  page text,
  referrer text,
  user_agent text,
  ip_hash text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "analytics_select" ON analytics_events;
CREATE POLICY "analytics_select" ON analytics_events FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "analytics_insert" ON analytics_events;
CREATE POLICY "analytics_insert" ON analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ───────────── WEBSITE SETTINGS ─────────────
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  value_json jsonb,
  label text,
  type text DEFAULT 'text',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_select" ON website_settings;
CREATE POLICY "settings_select" ON website_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "settings_insert" ON website_settings;
CREATE POLICY "settings_insert" ON website_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "settings_update" ON website_settings;
CREATE POLICY "settings_update" ON website_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "settings_delete" ON website_settings;
CREATE POLICY "settings_delete" ON website_settings FOR DELETE TO authenticated USING (true);

-- ───────────── SEED DEFAULT DATA ─────────────

-- Website Settings
INSERT INTO website_settings (key, value, label, type) VALUES
('site_name', 'Giverham Tech', 'Site Name', 'text'),
('tagline', 'We Engineer Digital Experiences', 'Tagline', 'text'),
('whatsapp', '+2348100000000', 'WhatsApp Number', 'text'),
('email', 'hello@giverhamtech.com', 'Contact Email', 'text'),
('twitter', 'https://twitter.com/giverhamtech', 'Twitter URL', 'url'),
('instagram', 'https://instagram.com/giverhamtech', 'Instagram URL', 'url'),
('linkedin', 'https://linkedin.com/company/giverhamtech', 'LinkedIn URL', 'url'),
('github', 'https://github.com/giverhamtech', 'GitHub URL', 'url'),
('stats_projects', '120+', 'Projects Delivered', 'text'),
('stats_technologies', '30+', 'Technologies Used', 'text'),
('stats_clients', '80+', 'Happy Clients', 'text'),
('stats_years', '5+', 'Years of Experience', 'text')
ON CONFLICT (key) DO NOTHING;

-- Services
INSERT INTO services (title, slug, description, icon, features, sort_order) VALUES
('Website Development', 'website-development', 'Stunning, high-performance websites built with cutting-edge technologies that convert visitors into customers.', 'Globe', ARRAY['Responsive Design', 'SEO Optimized', 'Fast Loading', 'CMS Integration'], 1),
('Full Stack Development', 'full-stack', 'End-to-end application development from database architecture to pixel-perfect interfaces.', 'Code2', ARRAY['React & Node.js', 'Database Design', 'API Development', 'Cloud Deployment'], 2),
('AI Integration', 'ai-integration', 'Supercharge your business with intelligent AI features — chatbots, recommendations, automation.', 'Brain', ARRAY['OpenAI Integration', 'Custom AI Models', 'Automation', 'Chatbots'], 3),
('Business Websites', 'business-websites', 'Professional websites that establish authority and drive real business results.', 'Briefcase', ARRAY['Brand Identity', 'Lead Generation', 'Analytics', 'Maintenance'], 4),
('E-Commerce Development', 'ecommerce', 'Powerful online stores with seamless checkout, inventory management, and payment gateways.', 'ShoppingCart', ARRAY['Payment Integration', 'Inventory Management', 'Order Tracking', 'Analytics'], 5),
('Real Estate Platforms', 'real-estate', 'Feature-rich property listing platforms with advanced search, maps, and virtual tours.', 'Building2', ARRAY['Property Listings', 'Map Integration', 'Virtual Tours', 'Lead Management'], 6),
('Banking Systems', 'banking-systems', 'Secure, compliant fintech applications with real-time transactions and fraud detection.', 'Landmark', ARRAY['Secure Transactions', 'KYC/AML', 'Real-time Updates', 'Compliance'], 7),
('SaaS Applications', 'saas', 'Scalable software-as-a-service products with multi-tenancy, billing, and analytics.', 'Layers', ARRAY['Multi-tenancy', 'Subscription Billing', 'Analytics Dashboard', 'API Access'], 8),
('Supabase Development', 'supabase-dev', 'Expert Supabase backends — auth, real-time, edge functions, and database design.', 'Database', ARRAY['Auth Systems', 'Real-time Data', 'Edge Functions', 'Row Level Security'], 9),
('API Integration', 'api-integration', 'Seamlessly connect third-party services — payments, communications, data providers.', 'Plug', ARRAY['REST & GraphQL', 'Webhook Handling', 'Rate Limiting', 'Documentation'], 10),
('Vercel Deployment', 'vercel-deployment', 'Lightning-fast deployments on Vercel with CI/CD pipelines and performance monitoring.', 'Zap', ARRAY['CI/CD Pipeline', 'Edge Network', 'Analytics', 'Previews'], 11),
('Website Maintenance', 'maintenance', 'Ongoing support, updates, security patches, and performance optimization for your platform.', 'Wrench', ARRAY['Security Updates', 'Performance Tuning', 'Content Updates', '24/7 Monitoring'], 12)
ON CONFLICT (slug) DO NOTHING;

-- Projects
INSERT INTO projects (title, slug, description, features, tech_stack, category, image_url, live_url, featured, sort_order) VALUES
('Evercrest Bank', 'evercrest-bank', 'A next-generation digital banking platform with real-time transactions, KYC verification, and AI-powered fraud detection.', ARRAY['Real-time Transactions', 'KYC/AML Compliance', 'AI Fraud Detection', 'Multi-currency Support', 'Mobile Banking', 'Secure Authentication'], ARRAY['React', 'TypeScript', 'Node.js', 'Supabase', 'PostgreSQL', 'Stripe'], 'Banking', 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg', '#', true, 1),
('RR Rentals', 'rr-rentals', 'Premium real estate rental platform featuring property listings, virtual tours, 3D floor plans, and automated lease management.', ARRAY['Property Listings', 'Virtual Tours', 'Map Integration', 'Lease Management', 'Tenant Portal', 'Analytics'], ARRAY['React', 'TypeScript', 'Supabase', 'Mapbox', 'Framer Motion', 'Vercel'], 'Real Estate', 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg', '#', true, 2),
('MarWiz Wears & Watches', 'marwiz', 'Luxury e-commerce experience for premium fashion and timepieces with AR try-on, AI size recommendations, and seamless checkout.', ARRAY['AR Try-On', 'AI Recommendations', 'Inventory Management', 'Order Tracking', 'Multi-payment', 'Loyalty Program'], ARRAY['React', 'TypeScript', 'Supabase', 'Stripe', 'Three.js', 'Tailwind CSS'], 'E-Commerce', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', '#', true, 3),
('Giver Recording Studio', 'giver-studio', 'Professional recording studio management system with session booking, real-time collaboration, audio previews, and billing.', ARRAY['Session Booking', 'Real-time Chat', 'Audio Previews', 'Billing System', 'Artist Portal', 'Track Management'], ARRAY['React', 'TypeScript', 'Supabase', 'WebRTC', 'Web Audio API', 'Stripe'], 'Entertainment', 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg', '#', false, 4),
('AI Sports Analyst', 'ai-sports-analyst', 'AI-powered sports analytics platform providing real-time match predictions, player performance insights, and fantasy sports recommendations.', ARRAY['Match Predictions', 'Player Analytics', 'Fantasy Recommendations', 'Live Stats', 'Historical Data', 'API Access'], ARRAY['React', 'TypeScript', 'OpenAI', 'Supabase', 'Python', 'FastAPI'], 'AI/ML', 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg', '#', false, 5)
ON CONFLICT (slug) DO NOTHING;

-- Testimonials
INSERT INTO testimonials (name, role, company, content, rating, sort_order) VALUES
('Sarah Mitchell', 'CEO', 'Evercrest Financial', 'Giverham Tech delivered our banking platform ahead of schedule. The quality of code, security architecture, and UI design are absolutely world-class. Our users love the experience.', 5, 1),
('Marcus Johnson', 'Founder', 'RR Rentals Ltd', 'The real estate platform they built for us completely transformed our business. We went from a basic website to a full property management ecosystem in just 8 weeks.', 5, 2),
('Amara Okafor', 'Director', 'MarWiz Fashion', 'The e-commerce site they built has increased our conversions by 340%. The design is stunning, the performance is incredible, and the backend is rock solid.', 5, 3),
('David Chen', 'CTO', 'TechFlow Solutions', 'Working with Adelaja and his team was exceptional. They understood our technical requirements perfectly and delivered a SaaS platform that scales beautifully.', 5, 4),
('Priya Sharma', 'Product Manager', 'AI Ventures', 'The AI sports analyst platform exceeded every expectation. The machine learning integration, the UI, and the API documentation are all outstanding.', 5, 5)
ON CONFLICT DO NOTHING;

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, category, tags, cover_image_url, published, featured, reading_time) VALUES
('Building Scalable SaaS Applications with React and Supabase', 'building-saas-react-supabase', 'Learn how to architect and build production-ready SaaS applications using React, TypeScript, and Supabase with proper multi-tenancy and billing integration.', 'Web Development', ARRAY['React', 'Supabase', 'SaaS', 'TypeScript'], 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg', true, true, 8),
('The Future of AI-Powered Web Experiences', 'future-ai-web-experiences', 'Explore how AI is transforming web development — from intelligent chatbots to personalized user experiences and automated code generation.', 'AI Development', ARRAY['AI', 'OpenAI', 'Web Development', 'Future'], 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg', true, false, 6),
('Designing Premium UI with Framer Motion and Tailwind CSS', 'premium-ui-framer-tailwind', 'A deep dive into creating award-winning UI animations and micro-interactions that elevate user experience to the next level.', 'UI/UX', ARRAY['Framer Motion', 'Tailwind CSS', 'Animation', 'UI/UX'], 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg', true, false, 7),
('How to Deploy Next-Gen Apps on Vercel Edge Network', 'deploy-vercel-edge-network', 'Master Vercel deployments — edge functions, preview environments, analytics, and performance optimization techniques.', 'Deployment', ARRAY['Vercel', 'Edge Functions', 'Deployment', 'Performance'], 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', true, false, 5)
ON CONFLICT (slug) DO NOTHING;
