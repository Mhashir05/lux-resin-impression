// A SiteContent or Product image field can hold a real uploaded URL, or (until
// someone uploads one) the placeholder label it started as, e.g. "PORTRAIT —
// THE MAKER" or "TRAY — TOP". Checking the shape up front is more reliable
// than an <img onError>: the browser resolves a non-URL string as a relative
// path, which can 200 with an HTML page rather than cleanly failing, so
// onError never fires.
export function isLikelyUrl(value: string): boolean {
  return /^(https?:|blob:|data:)/i.test(value);
}
