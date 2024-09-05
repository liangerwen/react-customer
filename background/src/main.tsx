import { CustomProvider } from "react-customer";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import plugins from "./plugins.tsx";

createRoot(document.getElementById('root')!).render(
  <CustomProvider plugins={plugins}>
    <App />
  </CustomProvider>,
)
