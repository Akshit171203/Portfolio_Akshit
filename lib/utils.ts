export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** A value is a placeholder when it is empty or still in `[ADD …]` form. */
export function isPlaceholder(value?: string | null): boolean {
  return !value || value.trim().startsWith("[ADD");
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
