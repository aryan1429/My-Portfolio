import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Filter out browser extension console errors in development
if (import.meta.env.DEV) {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('enable_copy.js') || 
        message.includes('feature_collector.js') ||
        message.includes('E.C.P is not enabled') ||
        message.includes('using deprecated parameters')) {
      return; // Ignore extension errors
    }
    originalError.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('enable_copy.js') || 
        message.includes('feature_collector.js')) {
      return; // Ignore extension warnings
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
