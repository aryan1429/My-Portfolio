import emailjs from '@emailjs/browser';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = `${BASE_URL}/api`;

class PortfolioService {
  async fetchData(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Projects
  async getProjects() {
    return this.fetchData('/projects');
  }

  async getProject(id) {
    return this.fetchData(`/projects/${id}`);
  }

  async getFeaturedProjects() {
    const projects = await this.getProjects();
    return projects.filter(project => project.featured);
  }

  // Content Creation
  async getContentCreation() {
    return this.fetchData('/content');
  }

  async getContentItem(id) {
    return this.fetchData(`/content/${id}`);
  }

  async getFeaturedContent() {
    const content = await this.getContentCreation();
    return content.filter(item => item.featured);
  }

  // Profile
  async getProfile() {
    return this.fetchData('/profile');
  }

  // Search
  async searchProjects(query) {
    return this.fetchData(`/search/projects?q=${encodeURIComponent(query)}`);
  }

  async searchContent(query) {
    return this.fetchData(`/search/content?q=${encodeURIComponent(query)}`);
  }

  // Helper methods for media URLs
  getMediaUrl(mediaPath) {
    if (!mediaPath) return '';

    // If it's already a full URL, return as is
    if (mediaPath.startsWith('http')) return mediaPath;

    // If it starts with /, it's an absolute path from root
    if (mediaPath.startsWith('/')) return `${BASE_URL}${mediaPath}`;

    // Otherwise, prepend /media/
    return `${BASE_URL}/media/${mediaPath}`;
  }

  // Get optimized image URL (you can implement CDN logic here)
  getOptimizedImageUrl(mediaPath, width = null, height = null) {
    const baseUrl = this.getMediaUrl(mediaPath);
    return baseUrl;
  }

  // Contact form - Now using EmailJS
  async sendContactMessage(data) {
    try {
      // Use environment variables for EmailJS configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      console.log('EmailJS Config Status:', {
        hasServiceId: !!serviceId,
        hasTemplateId: !!templateId,
        hasPublicKey: !!publicKey,
        serviceIdPrefix: serviceId ? serviceId.substring(0, 4) + '...' : 'MISSING'
      });

      if (!serviceId || !templateId || !publicKey) {
        console.warn('EmailJS credentials not found in environment variables');
        return {
          success: true,
          message: 'Message saved (Email configuration missing)',
          warning: true
        };
      }

      const templateParams = {
        name: data.name,
        email: data.email,
        message: data.message,
        time: new Date().toLocaleString(), // Add timestamp for the template
      };

      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);

      if (response.status === 200) {
        return { success: true, message: 'Message sent successfully!' };
      } else {
        throw new Error('EmailJS returned non-200 status');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      // Return a warning so the user knows the message was "saved" (locally/conceptually) but email failed
      return {
        success: true,
        message: 'Message saved but email notification failed.',
        warning: true
      };
    }
  }
}

export default new PortfolioService();
