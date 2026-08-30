import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export default function PrivacyPage() {
  const { settings } = useWebsiteSettings();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  const email = settings.email || 'contact@giverhamtech.com';
  const company = settings.site_name || 'Giverham Tech';

  return (
    <div className="relative min-h-screen bg-black text-white">
      <Navbar />
      <main className="relative z-[1] max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <p className="text-[10px] sm:text-xs tracking-wider uppercase text-cyan-400 font-mono mb-3">Legal</p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 30 August 2026</p>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <p>
            {company} (“we”, “us”, or “our”) respects your privacy. This policy explains what information we collect
            when you visit giverham.com or contact us, how we use it, and the choices you have.
          </p>

          <section>
            <h2 className="text-white font-semibold mb-2">Information we collect</h2>
            <p>
              If you send a message through our contact form, we collect the details you choose to share, such as your
              name, email address, phone number, and project notes. If you email or message us directly, we also keep
              that correspondence so we can reply and manage your request.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">How we use it</h2>
            <p>
              We use your information only to respond to enquiries, discuss possible work, deliver services you ask for,
              and keep a record of our conversation. We do not sell your information and we do not use it for unrelated
              advertising.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Sharing</h2>
            <p>
              We may share information with trusted operators who help us run email, hosting, or communication tools,
              and only as needed to provide those services. We may also disclose information if the law requires it.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Retention</h2>
            <p>
              We keep enquiry records for as long as needed to complete your request and to maintain a reasonable
              business record. You may ask us to update or delete your details at any time.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Your rights</h2>
            <p>
              You may request access to the personal information we hold about you, ask us to correct it, or ask us to
              delete it, subject to any legal duty to retain records.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Contact</h2>
            <p>
              For privacy questions, email us at{' '}
              <a href={`mailto:${email}`} className="text-cyan-400 hover:text-cyan-300">{email}</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
