import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App.tsx'
import './index.css'

gsap.registerPlugin(ScrollTrigger);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);

  // GSAP-based parallax for the body::before background
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const scrollY = self.scroll();
      document.body.style.setProperty('--scroll', `${scrollY}px`);
    },
  });
}
