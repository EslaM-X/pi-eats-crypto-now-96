
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { fixViewportHeight } from './utils/mobileViewport';

// Fix viewport height for mobile devices
fixViewportHeight();

createRoot(document.getElementById("root")!).render(<App />);
