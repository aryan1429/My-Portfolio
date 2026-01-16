import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Parallax scroll effect
const updateParallax = () => {
  document.body.style.setProperty('--scroll', `${window.scrollY}px`);
};
window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();

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
