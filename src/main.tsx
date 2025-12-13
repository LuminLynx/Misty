import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Register service worker for PWA functionality
// Skip service worker registration in Capacitor (native app)
declare global {
  interface Window {
    Capacitor?: unknown;
  }
}

if ('serviceWorker' in navigator && !window.Capacitor) {
  window.addEventListener('load', () => {
    // Use different paths for GitHub Pages vs local dev
    const swPath = import.meta.env.BASE_URL === '/Misty/' ? '/Misty/sw.js' : '/sw.js';
    navigator.serviceWorker
      .register(swPath)
      .then((registration) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Service Worker registered successfully:', registration.scope);
        }
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
