#!/usr/bin/env node

/**
 * Portfolio Project Structure Validator
 * Run with: node scripts/validate-structure.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expectedStructure = {
  'config/': ['app.yaml', 'cloudbuild.yaml', 'Dockerfile', 'vercel.json'],
  'docs/': ['README.md'],
  'env/': ['.env.example', '.env.gcp'],
  'secrets/': ['node-mailer-project-*.json'],
  'server/': {
    'database/': ['schema.json', 'service.js'],
    'services/': ['firestoreService.server.js', 'gcpStorageService.server.js'],
    '': ['server.js', 'server-gcp.js']
  },
  'src/': {
    'components/': {
      'ui/': ['*.tsx'],
      '': ['*.tsx']
    },
    'hooks/': ['*.ts', '*.tsx'],
    'lib/': ['utils.ts'],
    'pages/': ['*.tsx'],
    'services/': ['*.ts'],
    'utils/': ['*.ts'],
    '': ['App.tsx', 'main.tsx', 'index.css', 'App.css', 'vite-env.d.ts']
  },
  'public/': ['manifest.json', 'robots.txt', '*.svg', '*.pdf'],
  '': ['package.json', 'vite.config.ts', 'tsconfig*.json', 'eslint.config.js', 'postcss.config.js', 'tailwind.config.ts', 'components.json', 'index.html']
};

console.log('🔍 Validating project structure...\n');

function validateStructure(basePath, structure, currentPath = '') {
  let isValid = true;

  for (const [key, value] of Object.entries(structure)) {
    const fullPath = path.join(basePath, currentPath, key);

    if (typeof value === 'object') {
      // It's a directory
      if (!fs.existsSync(fullPath)) {
        console.log(`❌ Missing directory: ${path.join(currentPath, key)}`);
        isValid = false;
      } else {
        isValid = validateStructure(basePath, value, path.join(currentPath, key)) && isValid;
      }
    } else if (Array.isArray(value)) {
      // It's a list of expected files
      if (!fs.existsSync(fullPath)) {
        console.log(`❌ Missing directory: ${path.join(currentPath, key)}`);
        isValid = false;
      } else {
        const files = fs.readdirSync(fullPath);
        for (const pattern of value) {
          const matches = files.filter(file => {
            if (pattern.includes('*')) {
              const regex = new RegExp(pattern.replace(/\*/g, '.*'));
              return regex.test(file);
            }
            return file === pattern;
          });
          if (matches.length === 0) {
            console.log(`⚠️  Missing expected file pattern: ${path.join(currentPath, key, pattern)}`);
          }
        }
      }
    }
  }

  return isValid;
}

const isValid = validateStructure('.', expectedStructure);

if (isValid) {
  console.log('✅ Project structure is well organized!');
} else {
  console.log('\n💡 Consider running the organization script to fix issues.');
}

console.log('\n📁 Current structure:');
console.log('├── config/          # Deployment configs');
console.log('├── docs/            # Documentation');
console.log('├── env/             # Environment files');
console.log('├── secrets/         # Service account keys');
console.log('├── server/          # Backend code');
console.log('├── src/             # Frontend code');
console.log('├── public/          # Static assets');
console.log('└── scripts/         # Utility scripts');
