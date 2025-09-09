import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupConsoleFiltering } from './utils/consoleUtils'

// Set up console filtering for development
setupConsoleFiltering();

console.log('🚀 Starting React app...');

const rootElement = document.getElementById("root");
console.log('Root element:', rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log('Creating React root...');
  root.render(<App />);
  console.log('✅ React app rendered successfully!');
} else {
  console.error('❌ Root element not found!');
}
