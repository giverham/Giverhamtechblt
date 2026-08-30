const HIDDEN_BUILD_MARKERS = /supabase|vercel|lovable|bolt\.new|\bbolt\b/i;

export function mentionsHiddenBuildTool(value: string | undefined | null) {
  return Boolean(value && HIDDEN_BUILD_MARKERS.test(value));
}

export function hideBuildToolLabels<T extends string>(labels: T[]) {
  return labels.filter((label) => !mentionsHiddenBuildTool(label));
}

export function hideBuildToolItems<T extends { name?: string; title?: string; description?: string }>(items: T[]) {
  return items.filter((item) => (
    !mentionsHiddenBuildTool(item.name)
    && !mentionsHiddenBuildTool(item.title)
    && !mentionsHiddenBuildTool(item.description)
  ));
}

export type LegalBlock = { type: 'heading' | 'paragraph'; text: string };

export function fillLegalVars(text: string, vars: { company: string; email: string }) {
  return text
    .split('{company}').join(vars.company)
    .split('{email}').join(vars.email);
}

export function parseLegalBody(body: string, vars: { company: string; email: string }): LegalBlock[] {
  return fillLegalVars(body, vars)
    .split(/\n{2,}/)
    .map((chunk: string) => chunk.trim())
    .filter(Boolean)
    .map((chunk: string) => {
      if (chunk.startsWith('## ')) {
        return { type: 'heading' as const, text: chunk.replace(/^##\s+/, '') };
      }
      return { type: 'paragraph' as const, text: chunk };
    });
}
