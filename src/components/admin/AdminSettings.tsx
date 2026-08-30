import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, Check, AlertTriangle, Loader2, Globe, Share2, Type, FileText, Scale } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageUpload from '@/components/admin/ImageUpload';
import { applySettingsPatch, DEFAULT_SITE_SETTINGS } from '@/hooks/useWebsiteSettings';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Setting {
  key: string;
  value: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'number' | 'textarea' | 'image';
}

interface SettingsGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  keys: string[];
}

// ─── Groups Config ────────────────────────────────────────────────────────────

const GROUPS: SettingsGroup[] = [
  {
    id: 'site',
    title: 'Site & Contact',
    icon: <Globe size={16} className="text-cyan-400" />,
    description: 'These values appear on the live website immediately after save.',
    keys: ['site_name', 'tagline', 'email', 'phone', 'whatsapp', 'logo_url', 'favicon_url', 'address'],
  },
  {
    id: 'social',
    title: 'Social Links',
    icon: <Share2 size={16} className="text-purple-400" />,
    description: 'Full profile URLs used in the footer and contact areas.',
    keys: ['twitter', 'instagram', 'linkedin', 'github', 'tiktok', 'facebook', 'youtube', 'threads'],
  },
  {
    id: 'footer',
    title: 'Footer',
    icon: <FileText size={16} className="text-amber-400" />,
    description: 'Footer bio, company links, and engineered-by credit.',
    keys: ['footer_bio', 'footer_company', 'engineered_by', 'copyright_text'],
  },
  {
    id: 'headings',
    title: 'Section Headings',
    icon: <Type size={16} className="text-blue-400" />,
    description: 'Headings shown on Services, Knowledge Hub, testimonials, and contact.',
    keys: [
      'services_label',
      'services_title',
      'testimonials_heading',
      'blog_heading',
      'contact_label',
      'contact_title',
      'contact_description',
    ],
  },
  {
    id: 'legal',
    title: 'Privacy & Terms',
    icon: <Scale size={16} className="text-emerald-400" />,
    description: 'These pages update on the live website immediately after save. Use ## for a section title.',
    keys: [
      'privacy_title',
      'privacy_updated',
      'privacy_body',
      'terms_title',
      'terms_updated',
      'terms_body',
    ],
  },
];

// ─── Default fallback labels ──────────────────────────────────────────────────

const DEFAULT_LABELS: Record<string, { label: string; type: Setting['type']; hint?: string }> = {
  site_name: { label: 'Site Name', type: 'text' },
  tagline: { label: 'Tagline', type: 'text' },
  email: { label: 'Contact Email', type: 'email' },
  phone: { label: 'Call Us Number', type: 'tel', hint: 'This is the Get in Touch “Call Us” number. Use a full international number, e.g. +2348075388856.' },
  address: { label: 'Address', type: 'text' },
  whatsapp: { label: 'WhatsApp Number', type: 'tel', hint: 'Full number with country code, e.g. +2348012345678. Do not paste only the digits without the country code unless it already includes 234.' },
  logo_url: { label: 'Site Logo', type: 'image' },
  favicon_url: { label: 'Favicon', type: 'image', hint: 'Browser tab icon. Upload PNG, SVG, or ICO. It updates on the live site immediately after save.' },
  twitter: { label: 'Twitter / X URL', type: 'url' },
  instagram: { label: 'Instagram URL', type: 'url' },
  linkedin: { label: 'LinkedIn URL', type: 'url' },
  github: { label: 'GitHub URL', type: 'url' },
  tiktok: { label: 'TikTok URL', type: 'url' },
  facebook: { label: 'Facebook URL', type: 'url' },
  youtube: { label: 'YouTube URL', type: 'url' },
  threads: { label: 'Threads URL', type: 'url' },
  footer_bio: { label: 'Footer Bio', type: 'textarea' },
  footer_company: { label: 'Footer Company Links', type: 'text', hint: 'Comma-separated: About Us, Blog, Projects, Testimonials, Contact' },
  engineered_by: { label: 'Engineered By', type: 'text' },
  copyright_text: { label: 'Copyright Text', type: 'text', hint: 'Leave blank to use “© YEAR Giverham Tech. All rights reserved.”' },
  services_label: { label: 'Services Label', type: 'text' },
  services_title: { label: 'Services Heading', type: 'text' },
  testimonials_heading: { label: 'Clients Say Heading', type: 'text' },
  blog_heading: { label: 'Knowledge Hub Heading', type: 'text' },
  contact_label: { label: 'Contact Label', type: 'text' },
  contact_title: { label: 'Contact Heading', type: 'textarea' },
  contact_description: { label: 'Contact Description', type: 'textarea' },
  privacy_title: { label: 'Privacy Policy Title', type: 'text' },
  privacy_updated: { label: 'Privacy Last Updated', type: 'text' },
  privacy_body: { label: 'Privacy Policy', type: 'textarea', hint: 'Use ## for section titles. {company} and {email} are filled from Site & Contact.' },
  terms_title: { label: 'Terms of Service Title', type: 'text' },
  terms_updated: { label: 'Terms Last Updated', type: 'text' },
  terms_body: { label: 'Terms of Service', type: 'textarea', hint: 'Use ## for section titles. {company} and {email} are filled from Site & Contact.' },
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('website_settings').select('*');
    if (error) {
      showToast(error.message, 'error');
    } else {
      const map: Record<string, Setting> = {};
      const values: Record<string, string> = {};

      (data ?? []).forEach((row: { key: string; value: string; label: string; type: string }) => {
        map[row.key] = {
          key: row.key,
          value: row.value,
          label: row.label || DEFAULT_LABELS[row.key]?.label || row.key,
          type: (row.type as Setting['type']) || DEFAULT_LABELS[row.key]?.type || 'text',
        };
        values[row.key] = row.value || DEFAULT_SITE_SETTINGS[row.key] || '';
      });

      // Ensure all default keys exist even if not in DB
      Object.entries(DEFAULT_LABELS).forEach(([key, meta]) => {
        if (!map[key]) {
          map[key] = { key, value: DEFAULT_SITE_SETTINGS[key] || '', label: meta.label, type: meta.type };
          values[key] = DEFAULT_SITE_SETTINGS[key] || '';
        }
      });

      if (!values.phone && values.phone_number) values.phone = values.phone_number;
      if (!values.logo_url && values.site_logo_url) values.logo_url = values.site_logo_url;
      if (!values.favicon_url && values.site_favicon_url) values.favicon_url = values.site_favicon_url;

      const legalKeys = ['privacy_title', 'privacy_updated', 'privacy_body', 'terms_title', 'terms_updated', 'terms_body'];
      const missingLegal = legalKeys.filter((key) => !((data ?? []).some((row: { key: string; value: string }) => row.key === key && row.value)));
      if (missingLegal.length) {
        const seeded: Record<string, string> = {};
        for (const key of missingLegal) {
          const value = DEFAULT_SITE_SETTINGS[key] || '';
          await supabase.from('website_settings').upsert({
            key,
            value,
            label: DEFAULT_LABELS[key]?.label || key,
            type: DEFAULT_LABELS[key]?.type || 'textarea',
          }, { onConflict: 'key' });
          values[key] = value;
          seeded[key] = value;
        }
        applySettingsPatch(seeded);
      }

      setSettings(map);
      setLocalValues(values);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setLocalValues((v) => ({ ...v, [key]: value }));
  };

  const handleSaveGroup = async (groupId: string) => {
    const group = GROUPS.find((g) => g.id === groupId);
    if (!group) return;

    setSaving(groupId);
    const errors: string[] = [];

    const aliasKeys: Record<string, string> = {
      phone: 'phone_number',
      logo_url: 'site_logo_url',
      favicon_url: 'site_favicon_url',
    };

    for (const key of group.keys) {
      const value = localValues[key] ?? '';
      const rows = [
        {
          key,
          value,
          label: settings[key]?.label || DEFAULT_LABELS[key]?.label || key,
          type: settings[key]?.type || DEFAULT_LABELS[key]?.type || 'text',
        },
      ];
      if (aliasKeys[key]) {
        rows.push({
          key: aliasKeys[key],
          value,
          label: DEFAULT_LABELS[key]?.label || aliasKeys[key],
          type: DEFAULT_LABELS[key]?.type || 'text',
        });
      }

      for (const row of rows) {
        const { error } = await supabase
          .from('website_settings')
          .upsert(row, { onConflict: 'key' });
        if (error) errors.push(`${row.key}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      showToast(`Some settings failed to save.`, 'error');
    } else {
      showToast(`${group.title} saved successfully!`, 'success');
      const patch: Record<string, string> = {};
      group.keys.forEach((key) => { patch[key] = localValues[key] ?? ''; });
      if (patch.logo_url) patch.site_logo_url = patch.logo_url;
      if (patch.favicon_url) patch.site_favicon_url = patch.favicon_url;
      applySettingsPatch(patch);
      fetchSettings();
    }

    setSaving(null);
  };

  const inputCls =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all';

  const labelCls = 'block text-xs font-medium text-gray-400 mb-1.5';

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div
          className="p-3 rounded-xl"
          style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' }}
        >
          <Settings size={20} className="text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-0.5">Settings</h1>
          <p className="text-gray-400 text-sm">Configure your website content and information.</p>
        </div>
      </motion.div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {GROUPS.map((group, idx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Group Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {group.icon}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">{group.title}</h2>
                  <p className="text-xs text-gray-500">{group.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleSaveGroup(group.id)}
                disabled={saving === group.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-black transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
              >
                {saving === group.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                Save
              </button>
            </div>

            {/* Group Fields */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.keys.map((key) => {
                  const meta = settings[key];
                  if (!meta) return null;
                  const hint = DEFAULT_LABELS[key]?.hint;
                  const wide = meta.type === 'textarea' || meta.type === 'image' || key === 'footer_bio' || key === 'footer_company';
                  const tallLegal = key === 'privacy_body' || key === 'terms_body';
                  return (
                    <div key={key} className={wide ? 'sm:col-span-2' : ''}>
                      <label className={labelCls}>{meta.label}</label>
                      {meta.type === 'image' ? (
                        <ImageUpload
                          value={localValues[key] ?? ''}
                          onChange={(url) => handleChange(key, url)}
                          label={key === 'favicon_url' ? 'Upload favicon' : 'Upload logo'}
                          accept={key === 'favicon_url' ? 'image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/x-icon,.ico' : undefined}
                        />
                      ) : meta.type === 'textarea' ? (
                        <textarea
                          className={`${inputCls} ${tallLegal ? 'min-h-[260px]' : 'min-h-[88px]'}`}
                          value={localValues[key] ?? ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder={`Enter ${meta.label.toLowerCase()}...`}
                        />
                      ) : (
                        <input
                          type={meta.type === 'number' ? 'text' : meta.type}
                          className={inputCls}
                          value={localValues[key] ?? ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder={`Enter ${meta.label.toLowerCase()}...`}
                        />
                      )}
                      {hint && <p className="mt-1.5 text-[11px] text-gray-500 leading-relaxed">{hint}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Save All */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex justify-end"
      >
        <button
          onClick={async () => {
            setSaving('all');
            for (const group of GROUPS) {
              await handleSaveGroup(group.id);
            }
            setSaving(null);
          }}
          disabled={saving !== null}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #00E5FF, #00FFD1)' }}
        >
          {saving === 'all' ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save All Settings
        </button>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
    </div>
  );
}
