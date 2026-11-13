import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '@euvino/ds';
import { App } from './App';
import { ErrorBoundary } from './ErrorBoundary';

const root = document.getElementById('root');
if (!root) throw new Error('index.html has no #root element');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider dismissLabel="Schließen">
        <App />
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
);
