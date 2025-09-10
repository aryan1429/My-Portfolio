// Simple URL generator for static assets
// File can now be saved successfully
const baseUrl = 'https://storage.googleapis.com/my-portfolio-69';

export const generateVideoUrl = (objectPath: string): string => {
  return `${baseUrl}/${objectPath}`;
};

export const generateImageUrl = (objectPath: string): string => {
  return `${baseUrl}/${objectPath}`;
};

export const generateMediaUrl = (objectPath: string): string => {
  return `${baseUrl}/${objectPath}`;
};

const gcpStorageService = {
  generateVideoUrl,
  generateImageUrl,
  generateMediaUrl
};

export default gcpStorageService;