import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';  // Изменение здесь
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <HashRouter>  {/* Оберните App в HashRouter */}
        <App />
      </HashRouter>
    </React.StrictMode>
  );