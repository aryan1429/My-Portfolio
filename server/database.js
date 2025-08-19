import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'database', 'schema.json');
const UPLOAD_PATH = path.join(__dirname, '..', 'public', 'media', 'uploads');

class DatabaseService {
  constructor() {
    this.ensureUploadDirectory();
  }

  async ensureUploadDirectory() {
    await fs.ensureDir(UPLOAD_PATH);
  }

  async readDatabase() {
    try {
      const data = await fs.readFile(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      return this.getDefaultSchema();
    }
  }

  async writeDatabase(data) {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing database:', error);
      return false;
    }
  }

  getDefaultSchema() {
    return {
      projects: [],
      contentCreation: [],
      profile: {
        name: "",
        title: "",
        bio: "",
        email: "",
        media: {
          profilePic: "",
          heroImage: ""
        },
        skills: [],
        social: {
          github: "",
          linkedin: "",
          twitter: ""
        }
      },
      settings: {
        lastUpdated: new Date().toISOString(),
        version: "1.0.0"
      }
    };
  }

  // Project methods
  async getProjects() {
    const db = await this.readDatabase();
    return db.projects || [];
  }

  async getProject(id) {
    const projects = await this.getProjects();
    return projects.find(project => project.id === id);
  }

  async addProject({ title, description, category, technologies, featured }) {
    const db = await this.readDatabase();
    
    const newProject = {
      id: uuidv4(),
      title,
      description,
      category,
      technologies: technologies || [],
      media: {
        thumbnail: '',
        video: '',
        images: []
      },
      featured: featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.projects.push(newProject);
    await this.writeDatabase(db);
    return newProject;
  }

  async updateProject(id, updates) {
    const db = await this.readDatabase();
    const projectIndex = db.projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    db.projects[projectIndex] = {
      ...db.projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.writeDatabase(db);
    return db.projects[projectIndex];
  }

  async deleteProject(id) {
    const db = await this.readDatabase();
    const projectIndex = db.projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    const deletedProject = db.projects.splice(projectIndex, 1)[0];
    await this.writeDatabase(db);
    return deletedProject;
  }

  // Content Creation methods
  async getContentCreation() {
    const db = await this.readDatabase();
    return db.contentCreation || [];
  }

  async getContentItem(id) {
    const content = await this.getContentCreation();
    return content.find(item => item.id === id);
  }

  async addContentItem({ title, description, category, featured }) {
    const db = await this.readDatabase();
    
    const newItem = {
      id: uuidv4(),
      title,
      description,
      category,
      media: {
        thumbnail: '',
        video: '',
        images: []
      },
      featured: featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!db.contentCreation) {
      db.contentCreation = [];
    }
    
    db.contentCreation.push(newItem);
    await this.writeDatabase(db);
    return newItem;
  }

  async updateContentItem(id, updates) {
    const db = await this.readDatabase();
    const itemIndex = db.contentCreation.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error('Content item not found');
    }

    db.contentCreation[itemIndex] = {
      ...db.contentCreation[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.writeDatabase(db);
    return db.contentCreation[itemIndex];
  }

  async deleteContentItem(id) {
    const db = await this.readDatabase();
    const itemIndex = db.contentCreation.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error('Content item not found');
    }

    const deletedItem = db.contentCreation.splice(itemIndex, 1)[0];
    await this.writeDatabase(db);
    return deletedItem;
  }

  // Profile methods
  async getProfile() {
    const db = await this.readDatabase();
    return db.profile;
  }

  async updateProfile(updates) {
    const db = await this.readDatabase();
    db.profile = {
      ...db.profile,
      ...updates
    };
    
    db.settings.lastUpdated = new Date().toISOString();
    await this.writeDatabase(db);
    return db.profile;
  }

  // Media methods
  async addMediaToProject(projectId, mediaType, filePath) {
    const db = await this.readDatabase();
    const projectIndex = db.projects.findIndex(project => project.id === projectId);
    
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    const project = db.projects[projectIndex];
    
    if (mediaType === 'thumbnail' || mediaType === 'video') {
      project.media[mediaType] = filePath;
    } else if (mediaType === 'image') {
      if (!project.media.images) {
        project.media.images = [];
      }
      project.media.images.push(filePath);
    }

    project.updatedAt = new Date().toISOString();
    await this.writeDatabase(db);
    return project;
  }

  async addMediaToContent(contentId, mediaType, filePath) {
    const db = await this.readDatabase();
    const contentIndex = db.contentCreation.findIndex(item => item.id === contentId);
    
    if (contentIndex === -1) {
      throw new Error('Content item not found');
    }

    const content = db.contentCreation[contentIndex];
    
    if (mediaType === 'thumbnail' || mediaType === 'video') {
      content.media[mediaType] = filePath;
    } else if (mediaType === 'image') {
      if (!content.media.images) {
        content.media.images = [];
      }
      content.media.images.push(filePath);
    }

    content.updatedAt = new Date().toISOString();
    await this.writeDatabase(db);
    return content;
  }

  // Search methods
  async searchProjects(query) {
    const projects = await this.getProjects();
    const lowercaseQuery = query.toLowerCase();
    
    return projects.filter(project => 
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
    );
  }

  async searchContent(query) {
    const content = await this.getContentCreation();
    const lowercaseQuery = query.toLowerCase();
    
    return content.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export default new DatabaseService();
