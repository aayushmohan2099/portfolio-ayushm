import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './ComponentStyles/Title/bg.css'
import App from './App.jsx'

import '@fontsource/geist-sans';
import '@fontsource/geist-mono';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
