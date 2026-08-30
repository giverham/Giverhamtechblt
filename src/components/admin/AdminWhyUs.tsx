import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, Pencil, Trash2, Save, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_WHY_US, parseJsonArray, type WhyUsItem } from '@/lib/cmsDefaults';

const ICON_OPTIONS = ['Palette', 'Brain', 'Server', 'Zap', 'Shield', 'Smartphone', 'Globe', 'Code2', 'Layers', 'Sparkles'];

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

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all';
const labelCls = 'block text-xs font-medium text-gray-400 mb-1.5';

export default function AdminWhyUs() {
  const [heading, setHeading] = useState('WHY GIVERHAM TECH');
  const [items, setItems] = useState<WhyUsItem[]>(DEFAULT_WHY_US);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<WhyUsItem | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    supabase
      .from('website_settings')
      .select('key,value')
      .in('key', ['why_us_heading', 'why_us_items'])
      .then(({ data }) => {
        const map = Object.fromEntries((data ?? []).map((row: { key: string; value: string }) => [row.key, row.value]));
        if (map.why_us_heading) setHeading(map.why_us_heading);
        setItems(parseJsonArray<WhyUsItem>(map.why_us_items || '', DEFAULT_WHY_US));
        setLoading(false);
      });
  }, []);

  const persist = async (nextHeading: string, nextItems: WhyUsItem[]) => {
    setSaving(true);
    const rows = [
      { key: 'why_us_heading', value: nextHeading, label: 'Why Us Heading', type: 'text' },
      { key: 'why_us_items', value: JSON.stringify(nextItems), label: 'Why Us Cards', type: 'text' },
    ];
    const errors: string[] = [];
    for (const row of rows) {
      const { error } = await supabase.from('website_settings').upsert(row, { onConflict: 'key' });
      if (error) errors.push(error.message);
    }
    if (errors.length) showToast(errors[0], 'error');
    else showToast('Why Us section saved. The website will update immediately.', 'success');
    setSaving(false);
  };

  const openEdit = (index: number | null) => {
    if (index === null) {
      setDraft({ icon: 'Zap', title: '', desc: '', color: '#00E5FF', badge: 'FEATURE' });
      setEditingIndex(-1);
      return;
    }
    setDraft({ ...items[index] });
    setEditingIndex(index);
  };

  const saveDraft = async () => {
    if (!draft?.title.trim() || !draft.desc.trim()) {
      showToast('Please add a title and description.', 'error');
      return;
    }
    const next = [...items];
    if (editingIndex === -1) next.push(draft);
    else if (editingIndex !== null) next[editingIndex] = draft;
    setItems(next);
    setEditingIndex(null);
    setDraft(null);
    await persist(heading, next);
  };

  const removeItem = async (index: number) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    await persist(heading, next);
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl" style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' }}>
          <Shield size={20} className="text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-0.5">Why Giverham Tech</h1>
          <p className="text-gray-400 text-sm">Edit the heading and cards shown on the public website.</p>
        </div>
      </div>

      <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <label className={labelCls}>Section heading</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input className={inputCls} value={heading} onChange={(e) => setHeading(e.target.value)} />
          <button
            onClick={() => persist(heading, items)}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-black disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save heading
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => openEdit(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-black"
          style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
        >
          <Plus size={14} /> Add card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.badge} · {item.icon}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(index)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white">
                  <Pencil size={14} />
                </button>
                <button onClick={() => removeItem(index)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 overflow-y-auto"
            style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.75)' }}
            onClick={(e) => e.target === e.currentTarget && setDraft(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg rounded-2xl p-6 bg-black border border-white/10"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">{editingIndex === -1 ? 'Add card' : 'Edit card'}</h2>
                <button onClick={() => setDraft(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Title</label>
                  <input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea className={`${inputCls} min-h-[90px]`} value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Badge</label>
                    <input className={inputCls} value={draft.badge} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Color</label>
                    <input className={inputCls} value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Icon</label>
                  <select className={inputCls} value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })}>
                    {ICON_OPTIONS.map((icon) => <option key={icon} value={icon} className="bg-slate-900">{icon}</option>)}
                  </select>
                </div>
                <button
                  onClick={saveDraft}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-black disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
    </div>
  );
}
