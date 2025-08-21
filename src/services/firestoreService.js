/**
 * Google Firestore Service
 * Handles database operations with Google Firestore
 */

import dotenv from 'dotenv';

dotenv.config();

class FirestoreService {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      const { Firestore } = await import('@google-cloud/firestore');
      this.db = new Firestore({
        projectId: process.env.GCP_PROJECT_ID,
        keyFilename: process.env.GCP_KEY_FILE
      });
      this.initialized = true;
      console.log('✅ Firestore Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Firestore:', error);
      throw error;
    }
  }

  // Portfolio Profile Operations
  async getProfile() {
    try {
      await this.initialize();
      const doc = await this.db.collection('portfolio').doc('profile').get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  async updateProfile(profile) {
    try {
      await this.initialize();
      await this.db.collection('portfolio').doc('profile').update({
        ...profile,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async createProfile(profile) {
    try {
      await this.initialize();
      await this.db.collection('portfolio').doc('profile').set({
        ...profile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  // Project Operations
  async getProjects(featured) {
    try {
      await this.initialize();
      let query = this.db.collection('projects').orderBy('createdAt', 'desc');
      
      if (featured !== undefined) {
        query = query.where('featured', '==', featured);
      }

      const snapshot = await query.get();
      const projects = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        projects.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate()
        });
      });

      return projects;
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  async getProject(id) {
    try {
      await this.initialize();
      const doc = await this.db.collection('projects').doc(id).get();
      if (doc.exists) {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt?.toDate() || new Date(),
          updatedAt: data?.updatedAt?.toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }

  async createProject(project) {
    try {
      await this.initialize();
      const docRef = await this.db.collection('projects').add({
        ...project,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id, project) {
    try {
      await this.initialize();
      await this.db.collection('projects').doc(id).update({
        ...project,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id) {
    try {
      await this.initialize();
      await this.db.collection('projects').doc(id).delete();
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Contact Message Operations
  async saveContactMessage(message) {
    try {
      await this.initialize();
      const docRef = await this.db.collection('contacts').add({
        ...message,
        status: 'new',
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving contact message:', error);
      throw error;
    }
  }

  async getContactMessages(status) {
    try {
      await this.initialize();
      let query = this.db.collection('contacts').orderBy('createdAt', 'desc');
      
      if (status) {
        query = query.where('status', '==', status);
      }

      const snapshot = await query.get();
      const messages = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          repliedAt: data.repliedAt?.toDate()
        });
      });

      return messages;
    } catch (error) {
      console.error('Error getting contact messages:', error);
      throw error;
    }
  }

  async updateContactMessageStatus(id, status) {
    try {
      await this.initialize();
      const updateData = { status };
      if (status === 'replied') {
        updateData.repliedAt = new Date();
      }
      
      await this.db.collection('contacts').doc(id).update(updateData);
    } catch (error) {
      console.error('Error updating contact message status:', error);
      throw error;
    }
  }

  // Analytics and Stats
  async getStats() {
    try {
      await this.initialize();
      const [projectsSnapshot, messagesSnapshot, featuredSnapshot] = await Promise.all([
        this.db.collection('projects').get(),
        this.db.collection('contacts').get(),
        this.db.collection('projects').where('featured', '==', true).get()
      ]);

      return {
        projects: projectsSnapshot.size,
        messages: messagesSnapshot.size,
        featuredProjects: featuredSnapshot.size
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }

  // Search functionality
  async searchProjects(searchTerm) {
    try {
      await this.initialize();
      // Firestore doesn't support full-text search natively
      // This is a basic implementation - consider using Algolia or Elasticsearch for advanced search
      const snapshot = await this.db.collection('projects').get();
      const projects = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        const project = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate()
        };

        // Simple text search in title, description, and technologies
        const searchLower = searchTerm.toLowerCase();
        if (
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
        ) {
          projects.push(project);
        }
      });

      return projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error searching projects:', error);
      throw error;
    }
  }

  // Batch operations
  async batchCreateProjects(projects) {
    try {
      await this.initialize();
      const batch = this.db.batch();
      const ids = [];

      projects.forEach(project => {
        const docRef = this.db.collection('projects').doc();
        batch.set(docRef, {
          ...project,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        ids.push(docRef.id);
      });

      await batch.commit();
      return ids;
    } catch (error) {
      console.error('Error batch creating projects:', error);
      throw error;
    }
  }

  // Database health check
  async healthCheck() {
    try {
      await this.initialize();
      await this.db.collection('_health').doc('check').get();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

export default FirestoreService;
