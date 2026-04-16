/** Deep-merge plain objects; arrays and primitives are replaced (not merged). */
export function mergeDeep<T>(base: T, patch: unknown): T {
  if (patch === undefined || patch === null) return base;
  if (typeof patch !== 'object' || patch === null) {
    return patch as T;
  }
  if (typeof base !== 'object' || base === null || Array.isArray(base)) {
    return patch as T;
  }
  if (Array.isArray(patch)) {
    return patch as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    const cur = out[k];
    if (v !== undefined && typeof v === 'object' && v !== null && !Array.isArray(v)) {
      if (typeof cur === 'object' && cur !== null && !Array.isArray(cur)) {
        out[k] = mergeDeep(cur, v);
      } else {
        out[k] = mergeDeep({}, v);
      }
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out as T;
}
