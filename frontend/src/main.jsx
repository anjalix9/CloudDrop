import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Login from './pages/login'
import Signup from './pages/signup'
import UploadPage from './pages/uploadpage'
import FilesList from './pages/filelist'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/files" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="files" element={<FilesList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
