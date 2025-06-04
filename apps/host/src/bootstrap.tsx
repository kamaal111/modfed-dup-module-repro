import React from 'react';
import ReactDom from 'react-dom/client';

import App from './App';

const rootElement = document.getElementById('root');
if (rootElement == null) {
  throw new Error('Expected there to be a root element');
}

ReactDom.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
