import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupConsoleFiltering } from './utils/consoleUtils'

// Set up console filtering for development
setupConsoleFiltering();

createRoot(document.getElementById("root")!).render(<App />);
