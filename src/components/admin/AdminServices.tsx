import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Loader2, AlertTriangle, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  published: boolean;
  sort_order: number;
}

type ServiceForm = Omit<Service, 'id'> & { id?: string };

const EMPTY_FORM: ServiceForm = {
  title: '',
  slug: '',
  description: '',
  icon: '',
  features: [],
  published: false,
  sort_order: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ─── Toast ────────────────────────────────────────────────────────────────────

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

// ─── Shared Input Styles ──────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all';

const labelCls = 'block text-xs font-medium text-gray-400 mb-1.5';

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-6 px-4 overflow-y-auto"
        style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.75)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-xl rounded-2xl p-6"
          style={{ background: 'rgba(10,10,10,0.97)', border: '1px solid rgba(255,255,255,0.08)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
              <X size={18} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────

interface ToggleProps { value: boolean; onChange: () => void; label: string; color?: string }

const Toggle = ({ value, onChange, label, color = 'bg-cyan-500' }: ToggleProps) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <div onClick={onChange} className={`w-10 h-5 rounded-full transition-all relative ${value ? color : 'bg-white/10'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-5' : 'left-0.5'}`} />
    </div>
    <span className="text-sm text-gray-300">{label}</span>
  </label>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [featuresInput, setFeaturesInput] = useState('');
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) showToast(error.message, 'error');
    else setServices(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFeaturesInput('');
    setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setForm({ ...s });
    setFeaturesInput(s.features?.join(', ') ?? '');
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setForm(EMPTY_FORM); };

  const handleTitleChange = (val: string) => {
    setForm((f) => ({
      ...f,
      title: val,
      slug: f.id ? f.slug : slugify(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      features: featuresInput.split(',').map((s) => s.trim()).filter(Boolean),
    };

    let error;
    if (form.id) {
      const { id, ...rest } = payload;
      ({ error } = await supabase.from('services').update(rest).eq('id', id));
    } else {
      const { id, ...rest } = payload;
      void id;
      ({ error } = await supabase.from('services').insert(rest));
    }

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast(form.id ? 'Service updated!' : 'Service created!', 'success');
      closeModal();
      fetchServices();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Service deleted.', 'success'); fetchServices(); }
    setDeleting(null);
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Services</h1>
          <p className="text-gray-400 text-sm">Manage the services you offer.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
        >
          <Plus size={16} /> Add Service
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-cyan-400" />
          </div>
        ) : services.length === 0 ? (
          <div className="py-20 text-center">
            <Wrench size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No services yet. Add your first service.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Title', 'Icon', 'Published', 'Order', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white">{s.title}</td>
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{s.icon || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.published ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                        {s.published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">{s.sort_order}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
                        >
                          <Pencil size={15} />
                        </button>
                        {deleteConfirm === s.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(s.id)}
                              disabled={deleting === s.id}
                              className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition-all"
                            >
                              {deleting === s.id ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(s.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={form.id ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Service name"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input
                className={inputCls}
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto-generated"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={`${inputCls} resize-none h-24`}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe this service..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Icon (Lucide name)</label>
              <input
                className={inputCls}
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="e.g. Code, Globe, Shield"
              />
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input
                type="number"
                className={inputCls}
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Features (comma-separated)</label>
            <input
              className={inputCls}
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              placeholder="Feature 1, Feature 2, Feature 3"
            />
          </div>

          <div className="flex items-center gap-6">
            <Toggle
              value={form.published}
              onChange={() => setForm((f) => ({ ...f, published: !f.published }))}
              label="Published"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {form.id ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
    </div>
  );
}
