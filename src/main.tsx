import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '@euvino/ds';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider dismissLabel="Schließen">
      <App />
    </ToastProvider>
  </StrictMode>,
);
