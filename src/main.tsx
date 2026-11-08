import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/daom-theme.css';

// Registro de Service Worker para capacidades PWA Offline
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('Fallo en registro de SW:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
