// Client-safe URL helper for GCS objects
const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GCP_STORAGE_BASE_URL)
  || '';

function ensureTrailingSlash(s) {
  if (!s) return '';
  return s.endsWith('/') ? s : s + '/';
}

export function generateVideoUrl(objectPath) {
  if (!objectPath) return '';
  if (/^https?:\/\//i.test(objectPath)) return objectPath;
  const base = ensureTrailingSlash(BASE);
  return base ? `${base}${objectPath}` : `/${objectPath}`;
}

export function generateImageUrl(objectPath) {
  return generateVideoUrl(objectPath);
}

export default { generateVideoUrl, generateImageUrl };
