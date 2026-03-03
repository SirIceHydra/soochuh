import { apiPost } from './api';

/**
 * Upload a scrub customisation logo (PNG) to the server.
 * Returns the full image URL for storage in cart/order meta.
 * @param {File} file - PNG file from input
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export async function uploadScrubLogo(file) {
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file');
  }
  if (!file.type || !file.type.match(/^image\/png/)) {
    throw new Error('Only PNG images are supported');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result;
        if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/png')) {
          reject(new Error('Failed to read file as PNG'));
          return;
        }
        const r = await apiPost('/logo/upload', { imageBase64: dataUrl });
        if (r && r.success && r.url) {
          resolve(r.url);
        } else {
          reject(new Error(r?.message || 'Upload failed'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
