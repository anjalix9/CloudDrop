import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import './styles.css';

export default function App() {
  const token = localStorage.getItem('token');
  
  return (
    <div className="app-container">
      <Navbar />
      <div className="app-body">
        {token && <Sidebar />}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
