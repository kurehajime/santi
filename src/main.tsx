import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <>
      <App />
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnHover theme="light" />
    </>
  </React.StrictMode>
);
