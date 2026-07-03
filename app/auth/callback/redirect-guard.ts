// Open-redirect guard for the OAuth callback `next` param (F005, SC-004).
//
// The `next` value is attacker-controllable query input. A naive `!next.startsWith('/')` check is
// INSUFFICIENT: `//evil.com` starts with `/` yet is a protocol-relative URL the browser resolves
// off-site. Accept a value ONLY if it starts with a single `/` (and not `//`); otherwise fall back
// to the homepage. So: `/foo` -> `/foo`; `//evil.com` -> `/`; `https://evil.com` -> `/`;
// null / '' -> `/`.
export function sanitizeNext(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/";
}
