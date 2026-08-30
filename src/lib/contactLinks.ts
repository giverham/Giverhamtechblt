export function normalizeWhatsAppUrl(raw: string): string {
  if (!raw) return '';
  const value = raw.trim();
  if (/^https?:\/\//i.test(value)) return value;
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length >= 10) {
    digits = `234${digits.slice(1)}`;
  }
  return digits ? `https://wa.me/${digits}` : '';
}

export function normalizeTelHref(raw: string): string {
  if (!raw) return '';
  const value = raw.trim();
  if (value.startsWith('tel:')) return value;
  const cleaned = value.replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : '';
}

export function normalizeHttpUrl(raw: string): string {
  if (!raw) return '';
  const value = raw.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('www.')) return `https://${value}`;
  return `https://${value}`;
}

export function isUsablePhone(raw: string): boolean {
  if (!raw?.trim()) return false;
  return !/810\s*000\s*0000/.test(raw);
}

export function formatWhatsAppLabel(raw: string): string {
  if (!raw) return 'WhatsApp';
  if (/^https?:\/\//i.test(raw.trim())) return 'WhatsApp';
  return `WhatsApp: ${raw.trim()}`;
}
