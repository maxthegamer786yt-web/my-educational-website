import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const reg of registrations) {
      reg.unregister();
    }
  }).catch(() => {});
}

function mount() {
  const root = document.getElementById('root');
  if (root) {
    try {
      createRoot(root).render(<App />);
    } catch (e) {
      console.error('App mount failed:', e);
    }
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
