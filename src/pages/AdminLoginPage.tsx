import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 bg-white/[0.03] border border-white/[0.08]";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 aurora-bg opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}>
              <Zap size={20} className="text-black" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">Giverham Tech CMS</p>
        </div>

        <form onSubmit={submit} className="p-8 rounded-3xl glass-strong glow-cyan">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-red-400 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@giverhamtech.com" className={`${inputClass} pl-10`} />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs text-gray-500 font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••••" className={`${inputClass} pl-10 pr-10`} />
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : 'Access Dashboard'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">
          <a href="/" className="hover:text-gray-400 transition-colors">← Back to website</a>
        </p>
      </motion.div>
    </div>
  );
}
