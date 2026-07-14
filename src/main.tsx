import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ProjectsPage from './pages/ProjectsPage.tsx'
import BoardPage from './pages/BoardPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
         <Route element={<App />}>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<BoardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
