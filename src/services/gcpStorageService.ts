// Simple helper to build public URLs for objects stored in a Google Cloud Storage bucket.
// The base URL should point to the public bucket endpoint, e.g.:
// https://storage.googleapis.com/<bucket-name>/
// Configure via Vite env: VITE_GCP_STORAGE_BASE_URL

const BASE = (typeof import.meta !== 'undefined' && (import.meta as ImportMeta & { env?: Record<string, string> }).env && (import.meta as ImportMeta & { env?: Record<string, string> }).env.VITE_GCP_STORAGE_BASE_URL)
  || (typeof process !== 'undefined' && process.env.REACT_APP_GCP_STORAGE_BASE_URL)
  || 'https://storage.googleapis.com/my-portfolio-69'; // Explicit fallback

function ensureTrailingSlash(s: string) {
  if (!s) return '';
  return s.endsWith('/') ? s : s + '/';
}

export function generateVideoUrl(objectPath: string): string {
  if (!objectPath) return '';
  // If objectPath already looks like an absolute URL, return as-is
  if (/^https?:\/\//i.test(objectPath)) return objectPath;
  const base = ensureTrailingSlash(BASE);
  const finalUrl = base ? `${base}${objectPath}` : `/${objectPath}`; // fallback to local-relative path
  return finalUrl;
}

export function generateImageUrl(objectPath: string): string {
  return generateVideoUrl(objectPath);
}

export default { generateVideoUrl, generateImageUrl };
