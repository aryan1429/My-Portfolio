import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simple error boundary for debugging
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  } else {
    document.body.innerHTML = '<h1>Error: Root element not found</h1>';
  }
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = '<h1>Error loading application</h1>';
}
