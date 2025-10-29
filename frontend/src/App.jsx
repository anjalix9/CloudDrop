import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar'; // capitalized filename for convention
import './styles.css'; // global styles

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p> Clouddrop &copy; {new Date().getFullYear()} — Secure File Storage in the Cloud</p>
      </footer>
    </div>
  );
}
