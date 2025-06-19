import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { bootstrap } from './services/authService.js';

bootstrap();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </BrowserRouter>
  </StrictMode>,
)
