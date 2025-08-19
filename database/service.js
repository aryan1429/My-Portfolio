const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class DatabaseService {
  constructor() {
    this.dbPath = path.join(__dirname, 'schema.json');
    this.uploadsDir = path.join(__dirname, '..', 'uploads');
    this.assetsDir = path.join(__dirname, '..', 'src', 'assets');
    this.ensureDirectories();
  }

  async ensureDirectories() {
    await fs.ensureDir(this.uploadsDir);
  }

  async readDatabase() {
    try {
      const data = await fs.readJson(this.dbPath);
      return data;
    } catch (error) {
      console.error('Error reading database:', error);
      throw new Error('Failed to read database');
    }
  }

  async writeDatabase(data) {
    try {
      data.settings.lastUpdated = new Date().toISOString();
      await fs.writeJson(this.dbPath, data, { spaces: 2 });
      return true;
    } catch (error) {
      console.error('Error writing database:', error);
      throw new Error('Failed to write to database');
    }
  }

  // Projects CRUD operations
  async getAllProjects() {
    const db = await this.readDatabase();
    return db.projects;
  }

  async getProjectById(id) {
    const db = await this.readDatabase();
    return db.projects.find(project => project.id === id);
  }

  async createProject(projectData) {
    const db = await this.readDatabase();
    const newProject = {
      id: uuidv4(),
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.projects.push(newProject);
    await this.writeDatabase(db);
    return newProject;
  }

  async updateProject(id, updateData) {
    const db = await this.readDatabase();
    const projectIndex = db.projects.findIndex(project => project.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    db.projects[projectIndex] = {
      ...db.projects[projectIndex],
      ...updateData,
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

  // Content Creation CRUD operations
  async getAllContentCreation() {
    const db = await this.readDatabase();
    return db.contentCreation;
  }

  async getContentCreationById(id) {
    const db = await this.readDatabase();
    return db.contentCreation.find(content => content.id === id);
  }

  async createContentCreation(contentData) {
    const db = await this.readDatabase();
    const newContent = {
      id: uuidv4(),
      ...contentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.contentCreation.push(newContent);
    await this.writeDatabase(db);
    return newContent;
  }

  async updateContentCreation(id, updateData) {
    const db = await this.readDatabase();
    const contentIndex = db.contentCreation.findIndex(content => content.id === id);
    if (contentIndex === -1) {
      throw new Error('Content not found');
    }
    db.contentCreation[contentIndex] = {
      ...db.contentCreation[contentIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    await this.writeDatabase(db);
    return db.contentCreation[contentIndex];
  }

  async deleteContentCreation(id) {
    const db = await this.readDatabase();
    const contentIndex = db.contentCreation.findIndex(content => content.id === id);
    if (contentIndex === -1) {
      throw new Error('Content not found');
    }
    const deletedContent = db.contentCreation.splice(contentIndex, 1)[0];
    await this.writeDatabase(db);
    return deletedContent;
  }

  // Profile operations
  async getProfile() {
    const db = await this.readDatabase();
    return db.profile;
  }

  async updateProfile(profileData) {
    const db = await this.readDatabase();
    db.profile = { ...db.profile, ...profileData };
    await this.writeDatabase(db);
    return db.profile;
  }

  // Media operations
  async saveMediaFile(file, category = 'general') {
    const fileName = `${Date.now()}-${file.originalname}`;
    const categoryDir = path.join(this.uploadsDir, category);
    await fs.ensureDir(categoryDir);
    const filePath = path.join(categoryDir, fileName);
    
    await fs.writeFile(filePath, file.buffer);
    
    return {
      filename: fileName,
      originalName: file.originalname,
      path: filePath,
      url: `/uploads/${category}/${fileName}`,
      size: file.size,
      mimetype: file.mimetype
    };
  }

  async deleteMediaFile(filePath) {
    try {
      const fullPath = path.join(__dirname, '..', filePath);
      await fs.remove(fullPath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  // Search operations
  async searchProjects(query) {
    const db = await this.readDatabase();
    const searchTerm = query.toLowerCase();
    return db.projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
    );
  }

  async searchContentCreation(query) {
    const db = await this.readDatabase();
    const searchTerm = query.toLowerCase();
    return db.contentCreation.filter(content => 
      content.title.toLowerCase().includes(searchTerm) ||
      content.description.toLowerCase().includes(searchTerm) ||
      content.category.toLowerCase().includes(searchTerm)
    );
  }

  // Featured content
  async getFeaturedProjects() {
    const db = await this.readDatabase();
    return db.projects.filter(project => project.featured);
  }

  async getFeaturedContent() {
    const db = await this.readDatabase();
    return db.contentCreation.filter(content => content.featured);
  }
}

module.exports = new DatabaseService();
