// Cloudinary support removed — no-op stub maintained for compatibility.

export function cloudinaryNotSupported() {
  throw new Error('Cloudinary support removed. Use gcpStorageService instead.');
}

export default { cloudinaryNotSupported };
