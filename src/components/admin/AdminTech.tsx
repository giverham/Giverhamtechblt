import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Plus, Pencil, Trash2, Save, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_TECH_ROW1, DEFAULT_TECH_ROW2, parseJsonArray, type TechItem } from '@/lib/cmsDefaults';

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

export default function AdminTech() {
  const [heading, setHeading] = useState('We use industry leading technology stack');
  const [description, setDescription] = useState('Every project is built with the most powerful tools in the industry — delivering speed, security, and scalability from day one.');
  const [row1, setRow1] = useState<TechItem[]>(DEFAULT_TECH_ROW1);
  const [row2, setRow2] = useState<TechItem[]>(DEFAULT_TECH_ROW2);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<{ item: TechItem; row: 1 | 2; index: number } | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    supabase
      .from('website_settings')
      .select('key,value')
      .in('key', ['tech_heading', 'tech_description', 'tech_stack_row1', 'tech_stack_row2'])
      .then(({ data }) => {
        const map = Object.fromEntries((data ?? []).map((row: { key: string; value: string }) => [row.key, row.value]));
        if (map.tech_heading) setHeading(map.tech_heading);
        if (map.tech_description) setDescription(map.tech_description);
        setRow1(parseJsonArray<TechItem>(map.tech_stack_row1 || '', DEFAULT_TECH_ROW1));
        setRow2(parseJsonArray<TechItem>(map.tech_stack_row2 || '', DEFAULT_TECH_ROW2));
        setLoading(false);
      });
  }, []);

  const persist = async (next: { heading: string; description: string; row1: TechItem[]; row2: TechItem[] }) => {
    setSaving(true);
    const rows = [
      { key: 'tech_heading', value: next.heading, label: 'Tech Stack Heading', type: 'text' },
      { key: 'tech_description', value: next.description, label: 'Tech Stack Description', type: 'text' },
      { key: 'tech_stack_row1', value: JSON.stringify(next.row1), label: 'Tech Stack Row 1', type: 'text' },
      { key: 'tech_stack_row2', value: JSON.stringify(next.row2), label: 'Tech Stack Row 2', type: 'text' },
    ];
    const errors: string[] = [];
    for (const row of rows) {
      const { error } = await supabase.from('website_settings').upsert(row, { onConflict: 'key' });
      if (error) errors.push(error.message);
    }
    if (errors.length) showToast(errors[0], 'error');
    else showToast('Tech stack saved. The website will update immediately.', 'success');
    setSaving(false);
  };

  const saveDraft = async () => {
    if (!draft?.item.name.trim()) {
      showToast('Please add a technology name.', 'error');
      return;
    }
    const nextRow = draft.row === 1 ? [...row1] : [...row2];
    if (draft.index === -1) nextRow.push(draft.item);
    else nextRow[draft.index] = draft.item;
    const next = {
      heading,
      description,
      row1: draft.row === 1 ? nextRow : row1,
      row2: draft.row === 2 ? nextRow : row2,
    };
    if (draft.row === 1) setRow1(next.row1);
    else setRow2(next.row2);
    setDraft(null);
    await persist(next);
  };

  const removeItem = async (row: 1 | 2, index: number) => {
    const next = {
      heading,
      description,
      row1: row === 1 ? row1.filter((_, i) => i !== index) : row1,
      row2: row === 2 ? row2.filter((_, i) => i !== index) : row2,
    };
    setRow1(next.row1);
    setRow2(next.row2);
    await persist(next);
  };

  const renderRow = (items: TechItem[], row: 1 | 2, label: string) => (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">{label}</h2>
        <button
          onClick={() => setDraft({ item: { name: '', color: '#00E5FF', mono: '' }, row, index: -1 })}
          className="flex items-center gap-1.5 text-xs text-cyan-400"
        >
          <Plus size={13} /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black" style={{ color: item.color, border: `1px solid ${item.color}40` }}>
                {item.mono || item.name.slice(0, 2)}
              </span>
              <span className="text-sm text-white">{item.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDraft({ item: { ...item }, row, index })} className="text-gray-500 hover:text-white"><Pencil size={14} /></button>
              <button onClick={() => removeItem(row, index)} className="text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
          <Cpu size={20} className="text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-0.5">Technology Stack</h1>
          <p className="text-gray-400 text-sm">Edit the heading, description, and technologies shown on the website.</p>
        </div>
      </div>

      <div className="rounded-2xl p-6 mb-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <label className={labelCls}>Heading</label>
          <input className={inputCls} value={heading} onChange={(e) => setHeading(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea className={`${inputCls} min-h-[90px]`} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button
          onClick={() => persist({ heading, description, row1, row2 })}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-black disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          Save copy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderRow(row1, 1, 'First technology row')}
        {renderRow(row2, 2, 'Second technology row')}
      </div>

      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
            style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.75)' }}
            onClick={(e) => e.target === e.currentTarget && setDraft(null)}
          >
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl p-6 bg-black border border-white/10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">{draft.index === -1 ? 'Add technology' : 'Edit technology'}</h2>
                <button onClick={() => setDraft(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Name</label>
                  <input className={inputCls} value={draft.item.name} onChange={(e) => setDraft({ ...draft, item: { ...draft.item, name: e.target.value } })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Short label</label>
                    <input className={inputCls} value={draft.item.mono} onChange={(e) => setDraft({ ...draft, item: { ...draft.item, mono: e.target.value } })} />
                  </div>
                  <div>
                    <label className={labelCls}>Color</label>
                    <input className={inputCls} value={draft.item.color} onChange={(e) => setDraft({ ...draft, item: { ...draft.item, color: e.target.value } })} />
                  </div>
                </div>
                <button
                  onClick={saveDraft}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-black disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save technology
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
