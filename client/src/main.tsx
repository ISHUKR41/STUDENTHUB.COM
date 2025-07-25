import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Lenis from '@studio-freight/lenis'

// Initialize Lenis smooth scrolling with optimized performance settings
const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
  infinite: false,
})

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

createRoot(document.getElementById("root")!).render(<App />);
