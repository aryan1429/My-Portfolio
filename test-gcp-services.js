#!/usr/bin/env node

/**
 * Test script to verify GCP services are working correctly
 */

import dotenv from 'dotenv';

dotenv.config();

async function testGCPServices() {
  console.log('🧪 Testing GCP Services...\n');

  // Test environment variables
  console.log('📋 Environment Check:');
  console.log(`GCP_PROJECT_ID: ${process.env.GCP_PROJECT_ID || '❌ Not set'}`);
  console.log(`GCP_BUCKET_NAME: ${process.env.GCP_BUCKET_NAME || '❌ Not set'}`);
  console.log(`GCP_REGION: ${process.env.GCP_REGION || '❌ Not set'}`);
  console.log(`GCP_KEY_FILE: ${process.env.GCP_KEY_FILE || '❌ Not set'}\n`);

  // Test service imports
  try {
    console.log('📦 Testing service imports...');
    
    const { default: GCPStorageService } = await import('./src/services/gcpStorageService.js');
    const { default: FirestoreService } = await import('./src/services/firestoreService.js');
    
    console.log('✅ GCP Storage Service imported successfully');
    console.log('✅ Firestore Service imported successfully\n');

    // Test service initialization
    if (process.env.GCP_PROJECT_ID && process.env.GCP_KEY_FILE) {
      console.log('🔧 Testing service initialization...');
      
      const storageService = new GCPStorageService();
      const firestoreService = new FirestoreService();
      
      console.log('✅ Services created successfully');
      
      // Test basic operations (only if credentials are available)
      try {
        const fs = await import('fs-extra');
        const keyFileExists = await fs.pathExists(process.env.GCP_KEY_FILE);
        
        if (keyFileExists) {
          console.log('🔑 Service account key file found');
          
          // Test storage bucket access
          const bucketAccess = await storageService.checkBucketAccess();
          console.log(`📦 Storage bucket access: ${bucketAccess ? '✅ Success' : '❌ Failed'}`);
          
          // Test Firestore health check
          const firestoreHealth = await firestoreService.healthCheck();
          console.log(`🔥 Firestore health check: ${firestoreHealth ? '✅ Success' : '❌ Failed'}`);
        } else {
          console.log('⚠️  Service account key file not found - skipping connection tests');
        }
      } catch (error) {
        console.log(`⚠️  Connection test failed: ${error.message}`);
      }
    } else {
      console.log('⚠️  Environment variables not set - skipping initialization tests');
    }

    console.log('\n🎉 GCP Services test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testGCPServices();
}

export default testGCPServices;
