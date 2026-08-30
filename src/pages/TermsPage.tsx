import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export default function TermsPage() {
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 30 August 2026</p>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <p>
            These terms govern your use of the {company} website and any enquiry you send through it. By using
            giverham.com, you agree to this notice.
          </p>

          <section>
            <h2 className="text-white font-semibold mb-2">Our work</h2>
            <p>
              {company} designs and builds digital products for clients. Information on this website describes our
              capabilities and selected work. Sending an enquiry does not create a paid engagement. A project begins
              only when both sides agree in writing, including scope, timeline, and fees.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Website use</h2>
            <p>
              You may browse this site for information about our studio. You may not copy the site, scrape it, or use
              it in a way that harms its security or availability. Project names and visuals remain the property of
              {company} or the relevant client.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Enquiries</h2>
            <p>
              When you contact us, you confirm that the details you share are accurate and that you are allowed to send
              them. We will use that information to reply and, if we work together, to deliver the agreed service.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Limitation</h2>
            <p>
              This website is provided as a public introduction to our studio. We do not warrant that it will always be
              uninterrupted. To the fullest extent allowed by law, {company} is not liable for losses that arise only
              from browsing or relying on general information on this site.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Changes</h2>
            <p>
              We may update these terms as our studio grows. The date at the top of this page shows the latest version.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Contact</h2>
            <p>
              Questions about these terms can be sent to{' '}
              <a href={`mailto:${email}`} className="text-cyan-400 hover:text-cyan-300">{email}</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
