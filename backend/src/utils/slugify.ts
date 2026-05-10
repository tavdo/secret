export function slugify(input: string, suffix?: string): string {
  let s = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!s.length) s = "user";
  return suffix ? `${s}-${suffix}` : s;
}
