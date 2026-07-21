import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, MessageCircle, Mail, ArrowRight, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FormData { name: string; email: string; phone: string; subject: string; message: string; }

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

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

  const inputCls = "w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-700 outline-none transition-all duration-200 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/08";

  return (
    <section ref={sectionRef} id="contact" className="relative py-20 overflow-hidden">
      {/* Parallax grid bg */}
      <motion.div className="absolute inset-0 bg-grid opacity-20" style={{ y: bgY }} />
      <div className="absolute inset-0 aurora-bg opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/93 to-black" />

      {/* Massive glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Cinematic CTA headline */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-label mb-6"
          >GET IN TOUCH</motion.div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-[0.9]"
            >
              <span className="text-white">LET'S BUILD</span>
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-[0.9]"
            >
              <span className="shimmer-text">SOMETHING</span>
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-[0.9]"
            >
              <span className="text-white">EXTRAORDINARY</span><span className="text-gradient-cyan">.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="mt-8 text-gray-500 max-w-lg mx-auto text-[16px] leading-relaxed"
          >
            Ready to transform your digital presence? Let's create something world-class together.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-5"
          >
            {/* Direct contact */}
            <div className="p-6 rounded-2xl"
              style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.12)' }}>
              <h3 className="font-bold text-white text-sm mb-1">Direct Contact</h3>
              <p className="text-gray-500 text-[13px] mb-5">Reach us through any of these channels — we respond fast.</p>
              <div className="space-y-3">
                {[
                  { Icon: Mail, label: 'hello@giverhamtech.com', href: 'mailto:hello@giverhamtech.com', color: '#00E5FF' },
                  { Icon: MessageCircle, label: 'WhatsApp: +234 810 000 0000', href: 'https://wa.me/2348100000000', color: '#10B981' },
                  { Icon: Phone, label: '+234 810 000 0000', href: 'tel:+2348100000000', color: '#3B82F6' },
                ].map(item => {
                  const Ic = item.Icon;
                  return (
                    <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 text-[13px] text-gray-400 hover:text-white transition-colors group">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                        style={{ background: `${item.color}12`, border: `1px solid ${item.color}22` }}>
                        <Ic size={15} style={{ color: item.color }} />
                      </div>
                      {item.label}
                      <ArrowRight size={11} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Process */}
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.055)' }}>
              <h4 className="font-semibold text-white text-sm mb-4">Our Process</h4>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Discovery Call', desc: 'We understand your vision and goals' },
                  { step: '02', title: 'Proposal & Timeline', desc: 'Detailed roadmap with milestones' },
                  { step: '03', title: 'Design & Development', desc: 'Premium engineering & iteration' },
                  { step: '04', title: 'Launch & Support', desc: 'Deployment + ongoing maintenance' },
                ].map(p => (
                  <div key={p.step} className="flex items-start gap-4 group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                      style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)', color: '#000' }}>
                      {p.step}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-white">{p.title}</div>
                      <div className="text-[11px] text-gray-600">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          >
            <form onSubmit={submit}
              className="relative p-8 rounded-3xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,229,255,0.12)', boxShadow: '0 0 60px rgba(0,229,255,0.04)' }}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-8 right-8 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #00E5FF, #00FFD1, transparent)' }} />

              <h3 className="text-lg font-bold text-white mb-6">Send a Message</h3>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[11px] text-gray-600 font-semibold mb-1.5 block uppercase tracking-wider">Name *</label>
                  <input name="name" value={form.name} onChange={handle} required placeholder="John Doe" className={inputCls} />
                </div>
                <div>
                  <label className="text-[11px] text-gray-600 font-semibold mb-1.5 block uppercase tracking-wider">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handle} required placeholder="john@company.com" className={inputCls} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[11px] text-gray-600 font-semibold mb-1.5 block uppercase tracking-wider">Phone</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="+1 234 567 890" className={inputCls} />
                </div>
                <div>
                  <label className="text-[11px] text-gray-600 font-semibold mb-1.5 block uppercase tracking-wider">Service</label>
                  <select name="subject" value={form.subject} onChange={handle} className={inputCls}>
                    <option value="">Select a service</option>
                    {['Website Development','Full Stack','AI Integration','E-Commerce','Banking System','SaaS','Other'].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="text-[11px] text-gray-600 font-semibold mb-1.5 block uppercase tracking-wider">Message *</label>
                <textarea name="message" value={form.message} onChange={handle} required rows={5} placeholder="Tell us about your project..." className={`${inputCls} resize-none`} />
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-green-400 text-sm"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
                  <CheckCircle size={15} /> Message sent successfully! We'll respond within 24 hours.
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-red-400 text-sm"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                  <AlertCircle size={15} /> Something went wrong. Please try again.
                </div>
              )}

              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center disabled:opacity-50">
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><Send size={15} /> Send Message</span>
                )}
              </button>

              {/* Corner accents */}
              <div className="absolute top-4 right-4 w-4 h-4"
                style={{ borderTop: '1px solid rgba(0,229,255,0.2)', borderRight: '1px solid rgba(0,229,255,0.2)' }} />
              <div className="absolute bottom-4 left-4 w-4 h-4"
                style={{ borderBottom: '1px solid rgba(0,229,255,0.2)', borderLeft: '1px solid rgba(0,229,255,0.2)' }} />
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
