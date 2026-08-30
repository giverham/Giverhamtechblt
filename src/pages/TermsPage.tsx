import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { parseLegalBody } from '@/lib/publicCopy';
import { DEFAULT_LEGAL_UPDATED, DEFAULT_TERMS_BODY, DEFAULT_TERMS_TITLE } from '@/lib/cmsDefaults';

export default function TermsPage() {
  const { settings } = useWebsiteSettings();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  const email = settings.email || 'contact@giverhamtech.com';
  const company = settings.site_name || 'Giverham Tech';
  const blocks = parseLegalBody(settings.terms_body || DEFAULT_TERMS_BODY, { company, email });

  return (
    <div className="relative min-h-screen bg-black text-white">
      <Navbar />
      <main className="relative z-[1] max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <p className="text-[10px] sm:text-xs tracking-wider uppercase text-cyan-400 font-mono mb-3">Legal</p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{settings.terms_title || DEFAULT_TERMS_TITLE}</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {settings.terms_updated || DEFAULT_LEGAL_UPDATED}</p>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          {blocks.map((block, index) => (
            block.type === 'heading' ? (
              <h2 key={`${block.text}-${index}`} className="text-white font-semibold mb-2">{block.text}</h2>
            ) : (
              <p key={`${block.text.slice(0, 24)}-${index}`}>
                {email && block.text.includes(email)
                  ? block.text.split(email).flatMap((part, i, parts) => (
                      i < parts.length - 1
                        ? [part, <a key={`mail-${index}-${i}`} href={`mailto:${email}`} className="text-cyan-400 hover:text-cyan-300">{email}</a>]
                        : [part]
                    ))
                  : block.text}
              </p>
            )
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
