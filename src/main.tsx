import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { supabaseUrl } from './lib/supabase'

// FORÇAR VITE A INCLUIR - USO IMEDIATO
console.log('=== FEBIC VPS CONFIG ===');
console.log('URL:', supabaseUrl);
console.log('API:', supabaseUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
