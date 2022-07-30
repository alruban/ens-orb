import React from 'react';
import { render } from 'react-dom';
import App from './App';

const StrictApp = () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const rootElement = document.getElementById('root');

render(<StrictApp />, rootElement);

module.hot.accept();
