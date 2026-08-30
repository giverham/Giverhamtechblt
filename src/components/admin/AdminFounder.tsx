import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Save, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageUpload from './ImageUpload';

interface ToastProps { message: string; type: 'success' | 'error' }

const Toast = ({ message, type }: ToastProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 40 }}
    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl ${
      type === 'success'
        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
        : 'bg-red-500/20 border border-red-500/30 text-red-300'
    }`}
  >
    {type === 'success' ? <Check size={14} /> : <AlertTriangle size={14} />}
    {message}
  </motion.div>
);

const DEFAULTS = {
  founder_name: 'Adelaja Hassan M.',
  founder_title: 'Full Stack Developer & AI Engineer',
  founder_bio: 'I build premium digital products, AI-powered platforms, banking systems, e-commerce solutions, media platforms, and scalable business software designed for performance, reliability, and growth.',
  founder_photo_url: '',
};

export default function AdminFounder() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [form, setForm] = useState(DEFAULTS);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('website_settings').select('*');
    if (error) {
      showToast(error.message, 'error');
    } else if (data && data.length > 0) {
      const next = { ...DEFAULTS };
      data.forEach((row: { key: string; value: string }) => {
        if (row.key in next && row.value != null && row.value !== '') {
          (next as Record<string, string>)[row.key] = row.value;
        }
      });
      setForm(next);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    const errors: string[] = [];

    for (const key of Object.keys(form) as (keyof typeof form)[]) {
      const { error } = await supabase.from('website_settings').upsert({
        key,
        value: form[key],
        label: key.replace(/_/g, ' ').toUpperCase(),
        type: key === 'founder_photo_url' ? 'url' : 'text',
      }, { onConflict: 'key' });
      if (error) errors.push(error.message);
    }

    if (errors.length > 0) {
      showToast(errors[0], 'error');
    } else {
      showToast('Founder details saved. The website updates immediately.', 'success');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/60 transition-all';
  const labelCls = 'block text-xs font-medium text-gray-400 mb-1.5';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <User size={20} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Founder Profile</h1>
            <p className="text-gray-400 text-xs">Upload your photo and edit the About the Founder details shown on the website.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-cyan-400 to-teal-300 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save Changes
        </button>
      </div>

      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <User size={16} className="text-cyan-400" /> Founder Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Founder Name</label>
            <input
              type="text"
              className={inputCls}
              value={form.founder_name}
              onChange={(e) => setForm({ ...form, founder_name: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>Founder Title</label>
            <input
              type="text"
              className={inputCls}
              value={form.founder_title}
              onChange={(e) => setForm({ ...form, founder_title: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>About the Founder</label>
          <textarea
            rows={4}
            className={inputCls}
            value={form.founder_bio}
            onChange={(e) => setForm({ ...form, founder_bio: e.target.value })}
          />
        </div>

        <ImageUpload
          label="Founder Photo"
          value={form.founder_photo_url}
          onChange={(url) => setForm({ ...form, founder_photo_url: url })}
        />
        <p className="text-[11px] text-gray-500">Upload or remove the photo, then click Save Changes. The About section on the website updates right away.</p>
      </div>

      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
    </div>
  );
}
