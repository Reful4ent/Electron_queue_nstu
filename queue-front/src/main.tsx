import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./app/context/AuthProvider/AuthProvider.tsx";
import {ThemeProvider} from "./app/context/ThemeProvider/ThemeProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider>
          <AuthProvider>
              <BrowserRouter>
                  <App />
              </BrowserRouter>
          </AuthProvider>
      </ThemeProvider>
  </StrictMode>,
)
