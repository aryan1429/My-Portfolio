// Portfolio data service for React frontend

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production
  : 'http://localhost:5000';

class PortfolioService {
  async fetchData(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
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
    if (mediaPath.startsWith('/')) return mediaPath;
    
    // Otherwise, prepend /media/
    return `/media/${mediaPath}`;
  }

  // Get optimized image URL (you can implement CDN logic here)
  getOptimizedImageUrl(mediaPath, width = null, height = null) {
    const baseUrl = this.getMediaUrl(mediaPath);
    
    // For now, just return the base URL
    // In the future, you can add query parameters for image optimization
    return baseUrl;
  }

  // Contact form
  async sendContactMessage(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Contact Error:', error);
      throw error;
    }
  }
}

export default new PortfolioService();
