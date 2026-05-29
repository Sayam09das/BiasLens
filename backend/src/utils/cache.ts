export function buildCacheKey(...parts: Array<string | number | boolean | null | undefined>): string {
  return parts
    .filter((part) => part !== undefined && part !== null)
    .map((part) => String(part).trim())
    .filter(Boolean)
    .join(":");
}
