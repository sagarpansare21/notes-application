/**
 * Normalizes an array of tags by trimming whitespace, converting to lowercase,
 * filtering out empty strings, and removing duplicates.
 */
export function normalizeTags(tags?: string[]): string[] {
  if (!tags) return [];
  const normalized = tags
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t !== "");
  return Array.from(new Set(normalized));
}
