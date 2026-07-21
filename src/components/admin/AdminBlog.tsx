import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Loader2, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  tags: string[];
  author: string;
  reading_time: number;
  published: boolean;
  featured: boolean;
}

type BlogForm = Omit<BlogPost, 'id'> & { id?: string };

const EMPTY_FORM: BlogForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  category: 'Technology',
  tags: [],
  author: '',
  reading_time: 5,
  published: false,
  featured: false,
};

const CATEGORIES = ['Technology', 'Design', 'Business', 'Finance', 'Real Estate', 'AI/ML', 'Case Study', 'Other'];

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
          className="w-full max-w-3xl rounded-2xl p-6"
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState('');
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setPosts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setTagsInput('');
    setModalOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setForm({ ...p });
    setTagsInput(p.tags?.join(', ') ?? '');
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
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    };

    let error;
    if (form.id) {
      const { id, ...rest } = payload;
      ({ error } = await supabase.from('blog_posts').update(rest).eq('id', id));
    } else {
      const { id, ...rest } = payload;
      void id;
      ({ error } = await supabase.from('blog_posts').insert(rest));
    }

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast(form.id ? 'Post updated!' : 'Post created!', 'success');
      closeModal();
      fetchPosts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Post deleted.', 'success'); fetchPosts(); }
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
          <h1 className="text-3xl font-bold text-white mb-1">Blog</h1>
          <p className="text-gray-400 text-sm">Create and manage your blog articles.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
        >
          <Plus size={16} /> New Post
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
        ) : posts.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No blog posts yet. Start writing!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Title', 'Category', 'Author', 'Read Time', 'Published', 'Featured', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white max-w-[200px] truncate">{p.title}</td>
                    <td className="px-5 py-3.5 text-gray-400">{p.category}</td>
                    <td className="px-5 py-3.5 text-gray-400">{p.author || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {p.reading_time}m
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.published ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                        {p.published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.featured ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                        {p.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all">
                          <Pencil size={15} />
                        </button>
                        {deleteConfirm === p.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition-all">
                              {deleting === p.id ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 transition-all">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
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
      <Modal isOpen={modalOpen} onClose={closeModal} title={form.id ? 'Edit Post' : 'New Blog Post'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Post title"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Author</label>
              <input
                className={inputCls}
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Author name"
              />
            </div>
            <div>
              <label className={labelCls}>Reading Time (min)</label>
              <input
                type="number"
                min={1}
                className={inputCls}
                value={form.reading_time}
                onChange={(e) => setForm((f) => ({ ...f, reading_time: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Excerpt</label>
            <textarea
              className={`${inputCls} resize-none h-20`}
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short summary of the post..."
            />
          </div>

          <div>
            <label className={labelCls}>Content</label>
            <textarea
              className={`${inputCls} resize-none h-40`}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Full post content (Markdown supported)..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Cover Image URL</label>
              <input
                className={inputCls}
                value={form.cover_image_url}
                onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input
                className={inputCls}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, TypeScript, Supabase"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {[
              { key: 'published' as const, label: 'Published', color: 'bg-cyan-500' },
              { key: 'featured' as const, label: 'Featured', color: 'bg-amber-500' },
            ].map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                  className={`w-10 h-5 rounded-full transition-all relative ${form[key] ? color : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form[key] ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-gray-300">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {form.id ? 'Save Changes' : 'Publish Post'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
    </div>
  );
}
