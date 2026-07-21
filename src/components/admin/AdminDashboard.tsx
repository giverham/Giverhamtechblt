import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  MessageSquare,
  BookOpen,
  Star,
  TrendingUp,
  ArrowRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  projects: number;
  messages: number;
  blogPosts: number;
  testimonials: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  new: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  read: 'bg-white/10 text-gray-400 border border-white/10',
  replied: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  archived: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] ?? 'bg-white/10 text-gray-400'}`}>
    {status}
  </span>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  trend: string;
  gradient: string;
  delay: number;
}

const StatCard = ({ icon, label, value, trend, gradient, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative overflow-hidden rounded-2xl p-6"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    {/* Glow */}
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{ background: gradient }}
    />

    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-4xl font-bold text-white">
          {value.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
          <TrendingUp size={12} />
          <span>{trend}</span>
        </div>
      </div>
      <div
        className="p-3 rounded-xl"
        style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' }}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

// ─── Quick Action ─────────────────────────────────────────────────────────────

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  delay: number;
}

const QuickAction = ({ href, icon, label, description, delay }: QuickActionProps) => (
  <motion.a
    href={href}
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ x: 4 }}
    className="flex items-center justify-between p-4 rounded-xl group cursor-pointer"
    style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <div className="flex items-center gap-3">
      <div
        className="p-2 rounded-lg"
        style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.12)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <ArrowRight size={16} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
  </motion.a>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, messages: 0, blogPosts: 0, testimonials: 0 });
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { count: projectsCount },
          { count: messagesCount },
          { count: blogPostsCount },
          { count: testimonialsCount },
          { data: recentMessages, error: msgError },
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase
            .from('contact_messages')
            .select('id, name, email, subject, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

        if (msgError) throw msgError;

        setStats({
          projects: projectsCount ?? 0,
          messages: messagesCount ?? 0,
          blogPosts: blogPostsCount ?? 0,
          testimonials: testimonialsCount ?? 0,
        });
        setMessages(recentMessages ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      icon: <FolderKanban size={20} className="text-cyan-400" />,
      label: 'Total Projects',
      value: stats.projects,
      trend: 'Active portfolio',
      gradient: 'linear-gradient(135deg, #00E5FF, #00FFD1)',
      delay: 0,
    },
    {
      icon: <MessageSquare size={20} className="text-cyan-400" />,
      label: 'Messages',
      value: stats.messages,
      trend: 'Contact enquiries',
      gradient: 'linear-gradient(135deg, #818CF8, #C084FC)',
      delay: 0.08,
    },
    {
      icon: <BookOpen size={20} className="text-cyan-400" />,
      label: 'Blog Posts',
      value: stats.blogPosts,
      trend: 'Published content',
      gradient: 'linear-gradient(135deg, #34D399, #059669)',
      delay: 0.16,
    },
    {
      icon: <Star size={20} className="text-cyan-400" />,
      label: 'Testimonials',
      value: stats.testimonials,
      trend: 'Client reviews',
      gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
      delay: 0.24,
    },
  ];

  const quickActions = [
    {
      href: '/admin/projects',
      icon: <FolderKanban size={16} className="text-cyan-400" />,
      label: 'Manage Projects',
      description: 'Add, edit or remove portfolio projects',
      delay: 0.1,
    },
    {
      href: '/admin/blog',
      icon: <BookOpen size={16} className="text-cyan-400" />,
      label: 'Blog Posts',
      description: 'Create and publish blog articles',
      delay: 0.15,
    },
    {
      href: '/admin/messages',
      icon: <MessageSquare size={16} className="text-cyan-400" />,
      label: 'View Messages',
      description: 'Review contact form submissions',
      delay: 0.2,
    },
    {
      href: '/admin/media',
      icon: <ExternalLink size={16} className="text-cyan-400" />,
      label: 'Media Library',
      description: 'Upload and manage files',
      delay: 0.25,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">Welcome back — here's an overview of your CMS.</p>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl animate-pulse"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Recent Messages</h2>
            </div>
            <a href="/admin/messages" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </a>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No messages yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Name', 'Email', 'Subject', 'Status', 'Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-medium truncate max-w-[120px]">{msg.name}</td>
                      <td className="px-4 py-3 text-gray-400 truncate max-w-[160px]">{msg.email}</td>
                      <td className="px-4 py-3 text-gray-400 truncate max-w-[160px]">{msg.subject}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={msg.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
            <ExternalLink size={16} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action) => (
              <QuickAction key={action.label} {...action} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
