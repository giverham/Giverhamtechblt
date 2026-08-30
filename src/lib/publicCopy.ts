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
