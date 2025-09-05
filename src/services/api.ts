// Type definitions for API data structures
interface ProjectData {
  name: string;
  description: string;
  category: string;
  technologies: string[];
  featured?: boolean;
  [key: string]: unknown;
}

interface ContentCreationData {
  title: string;
  description: string;
  category: string;
  featured?: boolean;
  [key: string]: unknown;
}

interface ProfileData {
  name: string;
  title: string;
  description: string;
  skills: string[];
  [key: string]: unknown;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class PortfolioApiService {
  private async makeRequest(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async makeFileRequest(url: string, formData: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'File upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  // Projects API
  async getProjects() {
    return this.makeRequest('/projects');
  }

  async getFeaturedProjects() {
    return this.makeRequest('/projects/featured');
  }

  async getProject(id: string) {
    return this.makeRequest(`/projects/${id}`);
  }

  async createProject(projectData: ProjectData, files?: { [key: string]: File[] }) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(projectData));

    if (files) {
      Object.entries(files).forEach(([key, fileList]) => {
        fileList.forEach(file => {
          formData.append(key, file);
        });
      });
    }

    return this.makeFileRequest('/projects', formData);
  }

  async updateProject(id: string, projectData: ProjectData, files?: { [key: string]: File[] }) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(projectData));

    if (files) {
      Object.entries(files).forEach(([key, fileList]) => {
        fileList.forEach(file => {
          formData.append(key, file);
        });
      });
    }

    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update failed');
    }

    return await response.json();
  }

  async deleteProject(id: string) {
    return this.makeRequest(`/projects/${id}`, { method: 'DELETE' });
  }

  // Content Creation API
  async getContentCreation() {
    return this.makeRequest('/content');
  }

  async getFeaturedContent() {
    return this.makeRequest('/content/featured');
  }

  async getContentCreationById(id: string) {
    return this.makeRequest(`/content/${id}`);
  }

  async createContentCreation(contentData: ContentCreationData, files?: { [key: string]: File[] }) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(contentData));

    if (files) {
      Object.entries(files).forEach(([key, fileList]) => {
        fileList.forEach(file => {
          formData.append(key, file);
        });
      });
    }

    return this.makeFileRequest('/content', formData);
  }

  async updateContentCreation(id: string, contentData: ContentCreationData, files?: { [key: string]: File[] }) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(contentData));

    if (files) {
      Object.entries(files).forEach(([key, fileList]) => {
        fileList.forEach(file => {
          formData.append(key, file);
        });
      });
    }

    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update failed');
    }

    return await response.json();
  }

  async deleteContentCreation(id: string) {
    return this.makeRequest(`/content/${id}`, { method: 'DELETE' });
  }

  // Profile API
  async getProfile() {
    return this.makeRequest('/profile');
  }

  async updateProfile(profileData: ProfileData, files?: { [key: string]: File[] }) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(profileData));

    if (files) {
      Object.entries(files).forEach(([key, fileList]) => {
        fileList.forEach(file => {
          formData.append(key, file);
        });
      });
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Profile update failed');
    }

    return await response.json();
  }

  // Search API
  async searchProjects(query: string) {
    return this.makeRequest(`/search/projects?q=${encodeURIComponent(query)}`);
  }

  async searchContent(query: string) {
    return this.makeRequest(`/search/content?q=${encodeURIComponent(query)}`);
  }

  // File Upload API
  async uploadFile(file: File, category: string = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    return this.makeFileRequest('/upload', formData);
  }

  // Utility method to get media URL
  getMediaUrl(filename: string, category: string = 'images') {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename; // External URL
    return `http://localhost:5000/uploads/${category}/${filename}`;
  }
}

export default new PortfolioApiService();
