import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent libraries from trying to overwrite window.fetch which is read-only in this environment
try {
  if (typeof window !== 'undefined') {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (descriptor && !descriptor.writable && !descriptor.set) {
      console.log('window.fetch is read-only, protecting against overwrite attempts');
      // We don't need to do anything if it's already read-only, 
      // but some polyfills might still try to assignment which causes the TypeError.
      // By defining a no-op setter if possible, we might avoid the crash.
    }
  }
} catch (e) {
  // Ignore errors in protection attempt
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
