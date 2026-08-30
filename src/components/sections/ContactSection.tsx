import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, MessageCircle, Mail, ArrowRight, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { formatWhatsAppLabel, normalizeTelHref, normalizeWhatsAppUrl } from '@/lib/contactLinks';
import { splitAccentTitle } from '@/lib/cmsDefaults';

interface FormData { name: string; email: string; phone: string; subject: string; message: string; }

export default function ContactSection() {
  const { settings } = useWebsiteSettings();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const email = settings.email;
  const emailHref = email ? `mailto:${email}` : '#';
  const whatsappHref = normalizeWhatsAppUrl(settings.whatsapp);
  const phoneHref = normalizeTelHref(settings.phone || settings.whatsapp);
  const { head: contactHead, tail: contactTail } = splitAccentTitle(settings.contact_title);
  const contactLinks = [
    { Icon: Mail, label: email, href: emailHref, color: '#00E5FF' },
    { Icon: MessageCircle, label: formatWhatsAppLabel(settings.whatsapp), href: whatsappHref || '#', color: '#10B981' },
    { Icon: Phone, label: settings.phone || settings.whatsapp, href: phoneHref || '#', color: '#3B82F6' },
  ];

  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name, email: form.email,
      phone: form.phone || null, subject: form.subject || null, message: form.message,
    });
    if (error) { setStatus('error'); }
    else { setStatus('success'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }
    setTimeout(() => setStatus('idle'), 6000);
  };

  const inputCls = "w-full py-2 px-3 text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-400/50 rounded-lg text-white placeholder-gray-600 outline-none transition-all";

  return (
    <section ref={sectionRef} id="contact" className="relative py-10 md:py-14 overflow-hidden">
      {/* Parallax grid bg */}
      <motion.div className="absolute inset-0 bg-grid opacity-20" style={{ y: bgY }} />
      <div className="absolute inset-0 aurora-bg opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/93 to-black" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs tracking-wider uppercase text-cyan-400 font-mono mb-2"
          >{settings.contact_label}</motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight leading-tight text-white mb-2 lg:whitespace-nowrap"
          >
            {contactHead}{contactTail ? ' ' : ''}
            {contactTail && (
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(to right, #FDE68A, #F59E0B, #D97706, #FDE68A)', backgroundSize: '200% auto' }}
            >
              {contactTail}
            </motion.span>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="mt-2 text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed mb-3.5"
          >
            {settings.contact_description}
          </motion.p>

          {/* Mobile Direct Contact Pills Row (lg:hidden) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="flex lg:hidden items-center justify-center gap-2 max-w-sm mx-auto flex-wrap"
          >
            <a
              href={emailHref}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:border-cyan-400 transition-all shadow-sm"
            >
              <Mail size={12} /> Email Us
            </a>
            <a
              href={whatsappHref || '#'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400 transition-all shadow-sm"
            >
              <MessageCircle size={12} /> WhatsApp
            </a>
            <a
              href={phoneHref || '#'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 border border-blue-500/30 text-blue-400 hover:border-blue-400 transition-all shadow-sm"
            >
              <Phone size={12} /> Call Us
            </a>
          </motion.div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch max-w-5xl mx-auto">

          {/* Left Column: Direct Contact & Process (Hidden on Mobile, Visible on Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-4 h-full"
          >
            {/* Direct contact (Desktop only) */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-cyan-500/15 backdrop-blur-md flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-xs md:text-sm mb-1 uppercase tracking-wider">Direct Contact</h3>
                <p className="text-gray-400 text-[11px] mb-3.5">Reach us directly — we respond fast.</p>
                <div className="space-y-2.5">
                  {contactLinks.map(item => {
                    const Ic = item.Icon;
                    return (
                      <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2.5 text-xs text-gray-300 hover:text-white transition-colors group">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                          style={{ background: `${item.color}14`, border: `1px solid ${item.color}25` }}>
                          <Ic size={13} style={{ color: item.color }} />
                        </div>
                        <span className="truncate">{item.label}</span>
                        <ArrowRight size={11} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Our Process (Desktop only) */}
            <div className="p-5 rounded-2xl bg-slate-900/30 border border-white/5 backdrop-blur-md flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-white text-xs md:text-sm mb-3 uppercase tracking-wider">Our Process</h4>
                <div className="space-y-2.5">
                  {[
                    { step: '01', title: 'Discovery Call', desc: 'We clarify vision & goals' },
                    { step: '02', title: 'Proposal & Roadmap', desc: 'Detailed milestone plan' },
                    { step: '03', title: 'Engineering', desc: 'Build & iterative testing' },
                    { step: '04', title: 'Launch & Scale', desc: 'Deployment + ongoing SLA' },
                  ].map(p => (
                    <div key={p.step} className="flex items-center gap-3 group">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)', color: '#000' }}>
                        {p.step}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white leading-tight">{p.title}</div>
                        <div className="text-[10px] text-gray-400">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Streamlined Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="col-span-1 lg:col-span-7 flex flex-col justify-between h-full"
          >
            <form onSubmit={submit}
              className="relative p-3.5 sm:p-6 rounded-2xl overflow-hidden flex flex-col justify-between h-full bg-slate-900/50 border border-cyan-500/20 backdrop-blur-md shadow-xl"
            >
              {/* Top gradient border sweep */}
              <div className="absolute top-0 left-6 right-6 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #00E5FF, #00FFD1, transparent)' }} />

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-2.5 sm:mb-4">Send a Message</h3>

                {/* 2-Column Side-by-Side Input Grid on Mobile & Desktop */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2.5">
                  {/* Row 1: Name & Email */}
                  <div>
                    <label className="text-[9px] sm:text-[10px] font-mono text-gray-400 font-semibold mb-0.5 sm:mb-1 block uppercase tracking-wider">Name *</label>
                    <input name="name" value={form.name} onChange={handle} required placeholder="John Doe" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[9px] sm:text-[10px] font-mono text-gray-400 font-semibold mb-0.5 sm:mb-1 block uppercase tracking-wider">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} required placeholder="john@company.com" className={inputCls} />
                  </div>

                  {/* Row 2: Phone & Service Dropdown */}
                  <div>
                    <label className="text-[9px] sm:text-[10px] font-mono text-gray-400 font-semibold mb-0.5 sm:mb-1 block uppercase tracking-wider">Phone</label>
                    <input name="phone" value={form.phone} onChange={handle} placeholder="+1 234 567 890" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[9px] sm:text-[10px] font-mono text-gray-400 font-semibold mb-0.5 sm:mb-1 block uppercase tracking-wider">Service</label>
                    <select name="subject" value={form.subject} onChange={handle} className={inputCls}>
                      <option value="">Select service</option>
                      {['Web Development','Full Stack','AI Integration','E-Commerce','Banking System','SaaS','Other'].map(o => (
                        <option key={o} value={o} className="bg-slate-900 text-white">{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* Row 3: Message Textarea */}
                  <div className="col-span-2">
                    <label className="text-[9px] sm:text-[10px] font-mono text-gray-400 font-semibold mb-0.5 sm:mb-1 block uppercase tracking-wider">Message *</label>
                    <textarea name="message" rows={3} value={form.message} onChange={handle} required placeholder="Tell us about your project..." className={`${inputCls} h-20 sm:h-28 resize-none`} />
                  </div>
                </div>

                {status === 'success' && (
                  <div className="flex items-center gap-2 p-2 rounded-lg mb-2 text-green-400 text-xs bg-emerald-950/40 border border-emerald-500/20">
                    <CheckCircle size={13} /> Message sent successfully!
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex items-center gap-2 p-2 rounded-lg mb-2 text-red-400 text-xs bg-red-950/40 border border-red-500/20">
                    <AlertCircle size={13} /> Something went wrong. Please try again.
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-black shadow-lg hover:scale-[1.01] transition-all w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5"><Send size={13} /> Send Message</span>
                )}
              </button>

              {/* Corner accents */}
              <div className="absolute top-3 right-3 w-3 h-3 pointer-events-none"
                style={{ borderTop: '1px solid rgba(0,229,255,0.25)', borderRight: '1px solid rgba(0,229,255,0.25)' }} />
              <div className="absolute bottom-3 left-3 w-3 h-3 pointer-events-none"
                style={{ borderBottom: '1px solid rgba(0,229,255,0.25)', borderLeft: '1px solid rgba(0,229,255,0.25)' }} />
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
