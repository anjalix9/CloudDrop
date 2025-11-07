import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const token = localStorage.getItem('token');
  const nav = useNavigate();

  if (!token) {
    return null; // Don't show sidebar if not logged in
  }

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand">
            <img
              src="/assets/images.png"
              alt="CloudDrop"
              className="sidebar-logo"
            />
            <span className="sidebar-title">CloudDrop</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/files" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📁</span>
          {!collapsed && <span className="nav-text">Files</span>}
        </NavLink>
        
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📊</span>
          {!collapsed && <span className="nav-text">Analytics</span>}
        </NavLink>

        <NavLink to="/upload" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📤</span>
          {!collapsed && <span className="nav-text">Upload</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          <span className="nav-icon">☰</span>
        </button>
      </div>
    </div>
  );
}

