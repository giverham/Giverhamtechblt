import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Film,
  FileText,
  Check,
  AlertTriangle,
  Loader2,
  X,
  HardDrive,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type FileType = 'image' | 'video' | 'document';
type FilterTab = 'all' | FileType;

interface MediaItem {
  id: string;
  name: string;
  file_path: string;
  file_url: string;
  file_type: FileType;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileType = (mime: string): FileType => {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  return 'document';
};

const FileTypeIcon = ({ type, className = '' }: { type: FileType; className?: string }) => {
  if (type === 'image') return <ImageIcon className={className} />;
  if (type === 'video') return <Film className={className} />;
  return <FileText className={className} />;
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

// ─── Upload Progress ──────────────────────────────────────────────────────────

interface UploadProgressProps {
  files: { name: string; progress: number; done: boolean; error?: string }[];
  onClose: () => void;
}

const UploadProgress = ({ files, onClose }: UploadProgressProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 40 }}
    className="fixed bottom-6 left-6 z-[99] w-72 rounded-2xl p-4 shadow-2xl"
    style={{ background: 'rgba(10,10,10,0.97)', border: '1px solid rgba(255,255,255,0.08)' }}
  >
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-medium text-white">Uploading files</p>
      {files.every((f) => f.done) && (
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all">
          <X size={14} />
        </button>
      )}
    </div>
    <div className="space-y-2">
      {files.map((f, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 truncate max-w-[180px]">{f.name}</span>
            {f.done ? (
              f.error
                ? <span className="text-xs text-red-400">Failed</span>
                : <Check size={12} className="text-emerald-400" />
            ) : (
              <span className="text-xs text-gray-500">{f.progress}%</span>
            )}
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${f.error ? 'bg-red-500' : 'bg-cyan-400'}`}
              style={{ width: `${f.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ─── Media Card ───────────────────────────────────────────────────────────────

interface MediaCardProps {
  item: MediaItem;
  onDelete: (item: MediaItem) => void;
  deleting: string | null;
  deleteConfirm: string | null;
  setDeleteConfirm: (id: string | null) => void;
}

const MediaCard = ({ item, onDelete, deleting, deleteConfirm, setDeleteConfirm }: MediaCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.92 }}
    className="group relative rounded-2xl overflow-hidden"
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
  >
    {/* Preview */}
    <div
      className="relative aspect-video flex items-center justify-center overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      {item.file_type === 'image' ? (
        <img
          src={item.file_url}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : item.file_type === 'video' ? (
        <div className="flex flex-col items-center gap-2">
          <Film size={36} className="text-purple-400" />
          <span className="text-xs text-gray-500">Video</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <FileText size={36} className="text-blue-400" />
          <span className="text-xs text-gray-500">Document</span>
        </div>
      )}

      {/* Delete overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {deleteConfirm === item.id ? (
          <div className="flex flex-col items-center gap-2 px-4">
            <p className="text-xs text-white font-medium text-center">Delete this file?</p>
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(item)}
                disabled={deleting === item.id}
                className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-xs font-medium hover:bg-red-500 transition-all"
              >
                {deleting === item.id ? <Loader2 size={12} className="animate-spin" /> : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setDeleteConfirm(item.id)}
            className="p-2.5 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-all"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Type badge */}
      <div className="absolute top-2 left-2">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            item.file_type === 'image'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : item.file_type === 'video'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}
        >
          <FileTypeIcon type={item.file_type} className="w-3 h-3" />
          {item.file_type}
        </span>
      </div>
    </div>

    {/* Info */}
    <div className="p-3">
      <p className="text-xs font-medium text-white truncate">{item.name}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-600">{formatBytes(item.size_bytes)}</span>
        <span className="text-xs text-gray-600">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [uploadQueue, setUploadQueue] = useState<
    { name: string; progress: number; done: boolean; error?: string }[]
  >([]);
  const [showProgress, setShowProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setMedia(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const queue = files.map((f) => ({ name: f.name, progress: 0, done: false }));
    setUploadQueue(queue);
    setShowProgress(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Simulate progress start
      setUploadQueue((q) => q.map((item, idx) => idx === i ? { ...item, progress: 30 } : item));

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        setUploadQueue((q) => q.map((item, idx) => idx === i ? { ...item, progress: 100, done: true, error: uploadError.message } : item));
        showToast(`Failed to upload ${file.name}`, 'error');
        continue;
      }

      setUploadQueue((q) => q.map((item, idx) => idx === i ? { ...item, progress: 70 } : item));

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
      const fileUrl = urlData.publicUrl;

      const { error: dbError } = await supabase.from('media_library').insert({
        name: file.name,
        file_path: path,
        file_url: fileUrl,
        file_type: getFileType(file.type),
        mime_type: file.type,
        size_bytes: file.size,
      });

      if (dbError) {
        setUploadQueue((q) => q.map((item, idx) => idx === i ? { ...item, progress: 100, done: true, error: dbError.message } : item));
        showToast(`Failed to save ${file.name} to database`, 'error');
      } else {
        setUploadQueue((q) => q.map((item, idx) => idx === i ? { ...item, progress: 100, done: true } : item));
      }
    }

    showToast('Upload complete!', 'success');
    fetchMedia();
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (item: MediaItem) => {
    setDeleting(item.id);

    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([item.file_path]);

    if (storageError) {
      showToast(`Storage delete failed: ${storageError.message}`, 'error');
      setDeleting(null);
      return;
    }

    const { error: dbError } = await supabase.from('media_library').delete().eq('id', item.id);

    if (dbError) {
      showToast(`DB delete failed: ${dbError.message}`, 'error');
    } else {
      showToast('File deleted.', 'success');
      setMedia((m) => m.filter((x) => x.id !== item.id));
    }

    setDeleting(null);
    setDeleteConfirm(null);
  };

  const filtered = filter === 'all' ? media : media.filter((m) => m.file_type === filter);

  const counts = {
    all: media.length,
    image: media.filter((m) => m.file_type === 'image').length,
    video: media.filter((m) => m.file_type === 'video').length,
    document: media.filter((m) => m.file_type === 'document').length,
  };

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'image', label: `Images (${counts.image})` },
    { key: 'video', label: `Videos (${counts.video})` },
    { key: 'document', label: `Documents (${counts.document})` },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Media Library</h1>
          <p className="text-gray-400 text-sm">Upload and manage your files and images.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
        >
          <Upload size={16} /> Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileSelect}
        />
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === key
                ? 'text-black'
                : 'text-gray-400 hover:text-white bg-white/5 border border-white/10'
            }`}
            style={filter === key ? { background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="animate-spin text-cyan-400" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.12)' }}
          >
            <HardDrive size={32} className="text-cyan-400/50" />
          </div>
          <p className="text-gray-400 font-medium mb-1">No files yet</p>
          <p className="text-gray-600 text-sm mb-6">Upload your first file to get started.</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
          >
            <Upload size={15} /> Upload Files
          </button>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <AnimatePresence>
            {filtered.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                deleting={deleting}
                deleteConfirm={deleteConfirm}
                setDeleteConfirm={setDeleteConfirm}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Upload Progress */}
      <AnimatePresence>
        {showProgress && uploadQueue.length > 0 && (
          <UploadProgress
            files={uploadQueue}
            onClose={() => { setShowProgress(false); setUploadQueue([]); }}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
    </div>
  );
}
