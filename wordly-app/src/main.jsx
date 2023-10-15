import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import { router } from './router/index.jsx';
import { RouterProvider } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
