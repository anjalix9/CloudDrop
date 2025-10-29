import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-left" style={{ display: "flex", alignItems: "center" }}>
        {/* Optional: Logo beside brand name */}
        <img
          src="/assets/images.png"
          alt="CloudDrop Logo"
          style={{
            height: "32px",
            marginRight: "10px",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.2)",
          }}
        />
        <Link to="/files" className="brand">Clouddrop</Link>
      </div>

      <div className="nav-right" style={{ display: "flex", alignItems: "center" }}>
        {token ? (
          <>
            <span style={{ marginRight: 16, fontWeight: "500" }}>Hi, {name}</span>
            <Link to="/files" className="btn" style={{ marginRight: 8 }}>My Files</Link>
            <Link to="/analytics" className="btn" style={{ marginRight: 8 }}>Analytics</Link>
            <Link to="/upload" className="btn">Upload</Link>
            <button onClick={logout} className="btn danger" style={{ marginLeft: 8 }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn" style={{ marginLeft: 8 }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
