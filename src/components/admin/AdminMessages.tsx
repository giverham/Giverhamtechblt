import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  X,
  Check,
  Loader2,
  AlertTriangle,
  Trash2,
  ChevronDown,
  Archive,
  MailOpen,
  Reply,
  Clock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageStatus = 'new' | 'read' | 'replied' | 'archived';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<MessageStatus, { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
  read: { label: 'Read', cls: 'bg-white/10 text-gray-400 border border-white/10' },
  replied: { label: 'Replied', cls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  archived: { label: 'Archived', cls: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
};

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

// ─── Message Detail Slide-Over ────────────────────────────────────────────────

interface SlideOverProps {
  message: ContactMessage | null;
  onClose: () => void;
  onStatusChange: (id: string, status: MessageStatus) => void;
  onDelete: (id: string) => void;
  updating: boolean;
  deleting: string | null;
}

const SlideOver = ({ message, onClose, onStatusChange, onDelete, updating, deleting }: SlideOverProps) => (
  <AnimatePresence>
    {message && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          style={{ backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.65)' }}
          onClick={onClose}
        />
        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          className="fixed top-0 right-0 h-full z-50 w-full max-w-lg flex flex-col"
          style={{ background: 'rgba(8,8,8,0.98)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Message Detail</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Meta */}
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">{message.name}</p>
                  <a href={`mailto:${message.email}`} className="text-sm text-cyan-400 hover:underline">{message.email}</a>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[message.status]?.cls ?? ''}`}>
                  {STATUS_CONFIG[message.status]?.label}
                </span>
              </div>
              <div className="text-sm text-gray-300 font-medium">{message.subject}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={11} />
                {new Date(message.created_at).toLocaleString()}
              </div>
            </div>

            {/* Message body */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Message</p>
              <div
                className="rounded-xl p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {message.message}
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onStatusChange(message.id, 'read')}
                  disabled={updating || message.status === 'read'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 disabled:opacity-40 transition-all"
                >
                  <MailOpen size={13} /> Mark Read
                </button>
                <button
                  onClick={() => onStatusChange(message.id, 'replied')}
                  disabled={updating || message.status === 'replied'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-40 transition-all"
                >
                  <Reply size={13} /> Mark Replied
                </button>
                <button
                  onClick={() => onStatusChange(message.id, 'archived')}
                  disabled={updating || message.status === 'archived'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-40 transition-all"
                >
                  <Archive size={13} /> Archive
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => { onDelete(message.id); }}
              disabled={deleting === message.id}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
            >
              {deleting === message.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={13} />}
              Delete Message
            </button>
            <a
              href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-black transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
            >
              <Reply size={13} /> Reply via Email
            </a>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [filterStatus, setFilterStatus] = useState<MessageStatus | 'all'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) showToast(error.message, 'error');
    else setMessages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleStatusChange = async (id: string, status: MessageStatus) => {
    setUpdating(true);
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast(`Status updated to "${status}"`, 'success');
      setMessages((msgs) => msgs.map((m) => m.id === id ? { ...m, status } : m));
      if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null);
    }
    setUpdating(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Message deleted.', 'success');
      setMessages((msgs) => msgs.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    }
    setDeleting(null);
    setDeleteConfirm(null);
  };

  const filtered = filterStatus === 'all'
    ? messages
    : messages.filter((m) => m.status === filterStatus);

  const counts = {
    all: messages.length,
    new: messages.filter((m) => m.status === 'new').length,
    read: messages.filter((m) => m.status === 'read').length,
    replied: messages.filter((m) => m.status === 'replied').length,
    archived: messages.filter((m) => m.status === 'archived').length,
  };

  const FILTER_TABS: { key: MessageStatus | 'all'; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'new', label: `New (${counts.new})` },
    { key: 'read', label: `Read (${counts.read})` },
    { key: 'replied', label: `Replied (${counts.replied})` },
    { key: 'archived', label: `Archived (${counts.archived})` },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Messages</h1>
        <p className="text-gray-400 text-sm">View and manage contact form submissions.</p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === key
                ? 'text-black'
                : 'text-gray-400 hover:text-white bg-white/5 border border-white/10'
            }`}
            style={filterStatus === key ? { background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' } : {}}
          >
            {label}
          </button>
        ))}
      </div>

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
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Mail size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No messages in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Name', 'Email', 'Subject', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`border-b border-white/5 transition-colors cursor-pointer ${
                      msg.status === 'new' ? 'hover:bg-cyan-500/[0.04]' : 'hover:bg-white/[0.02]'
                    }`}
                    onClick={() => setSelected(msg)}
                  >
                    <td className="px-5 py-3.5">
                      <span className={`font-medium ${msg.status === 'new' ? 'text-white' : 'text-gray-300'}`}>
                        {msg.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 max-w-[160px] truncate">{msg.email}</td>
                    <td className="px-5 py-3.5 text-gray-400 max-w-[200px] truncate">{msg.subject}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[msg.status]?.cls ?? ''}`}>
                        {STATUS_CONFIG[msg.status]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(msg)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
                          title="View message"
                        >
                          <ChevronDown size={15} className="-rotate-90" />
                        </button>
                        {deleteConfirm === msg.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(msg.id)}
                              disabled={deleting === msg.id}
                              className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition-all"
                            >
                              {deleting === msg.id ? <Loader2 size={12} className="animate-spin" /> : 'Delete'}
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 transition-all">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(msg.id)}
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

      {/* Slide-Over */}
      <SlideOver
        message={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        updating={updating}
        deleting={deleting}
      />

      {/* Toast */}
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
    </div>
  );
}
