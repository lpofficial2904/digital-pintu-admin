import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter , HashRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    {/* <HashRouter> */}
    
      <AuthProvider>
        <App />
        <Toaster position="top-right" richColors closeButton duration={3000} theme="dark" />
      </AuthProvider>
      {/* </HashRouter> */}
    </BrowserRouter>
  </React.StrictMode>
);
