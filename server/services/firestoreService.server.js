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

  // ... (rest of implementation unchanged) ...
}

export default FirestoreService;
