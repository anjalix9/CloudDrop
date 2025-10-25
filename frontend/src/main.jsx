import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import App from './App';
import Login from './pages/login';
import Signup from './pages/signup';
import UploadPage from './pages/uploadpage';
import FilesList from './pages/filelist';
import './styles.css';

/* --- Scroll to top on route change --- */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/* --- Dynamic title for each route --- */
function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    let title = 'CloudDrop | File Uploader';
    if (pathname === '/login') title = 'Login | Clouddrop';
    else if (pathname === '/signup') title = 'Signup | Clouddrop';
    else if (pathname === '/upload') title = 'Upload File | Clouddrop';
    else if (pathname === '/files') title = 'My Files | Clouddrop';
    document.title = title;
  }, [pathname]);

  return null;
}

/* --- Main Render --- */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <PageTitle />
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
);
