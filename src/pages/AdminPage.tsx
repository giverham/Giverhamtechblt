import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, Wrench, Quote, FileText,
  MessageSquare, Image, Settings, LogOut, Menu, X, Zap,
  ChevronRight, User, Globe
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Admin sub-views
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminServices from '@/components/admin/AdminServices';
import AdminTestimonials from '@/components/admin/AdminTestimonials';
import AdminBlog from '@/components/admin/AdminBlog';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminMedia from '@/components/admin/AdminMedia';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminFounder from '@/components/admin/AdminFounder';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '' },
  { icon: User, label: 'Founder', path: 'founder' },
  { icon: FolderOpen, label: 'Projects', path: 'projects' },
  { icon: Wrench, label: 'Services', path: 'services' },
  { icon: Quote, label: 'Testimonials', path: 'testimonials' },
  { icon: FileText, label: 'Blog Posts', path: 'blog' },
  { icon: MessageSquare, label: 'Messages', path: 'messages' },
  { icon: Image, label: 'Media Library', path: 'media' },
  { icon: Settings, label: 'Settings', path: 'settings' },
];

function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ${open ? 'w-64' : 'w-0 lg:w-64'} overflow-hidden`}
        style={{ background: '#050505', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 p-6 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}>
            <Zap size={16} className="text-black" fill="currentColor" />
          </div>
          <div className="whitespace-nowrap">
            <span className="font-black text-white text-sm tracking-tight">GIVERHAM</span>
            <span className="font-light text-cyan-400 text-sm ml-1">ADMIN</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === `/admin${item.path ? `/${item.path}` : ''}` ||
                (item.path === '' && location.pathname === '/admin');
              return (
                <Link key={item.path} to={`/admin/${item.path}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                    isActive
                      ? 'text-black font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' } : {}}>
                  <Icon size={17} />
                  <span className="flex-1 whitespace-nowrap">{item.label}</span>
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <Link to="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <Globe size={17} /> View Website
          </Link>
          <button onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/admin/login');
      } else {
        setUser(data.session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') navigate('/admin/login');
      else if (session) setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 flex items-center gap-4 px-6"
          style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle admin sidebar navigation"
            aria-expanded={sidebarOpen}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg glass border border-white/10">
            {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-300 font-medium">{user.email}</span>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/founder" element={<AdminFounder />} />
            <Route path="/projects" element={<AdminProjects />} />
            <Route path="/services" element={<AdminServices />} />
            <Route path="/testimonials" element={<AdminTestimonials />} />
            <Route path="/blog" element={<AdminBlog />} />
            <Route path="/messages" element={<AdminMessages />} />
            <Route path="/media" element={<AdminMedia />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
