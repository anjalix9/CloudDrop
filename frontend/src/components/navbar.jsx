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
    <header className="top-header">
      <div className="header-left">
        <div className="header-brand">
          <img
            src="/assets/images.png"
            alt="CloudDrop"
            className="header-logo"
          />
          <span className="header-title">CloudDrop File Manager</span>
        </div>
      </div>

      <div className="header-right">
        {token ? (
          <>
            <Link to="/upload" className="header-btn header-btn-primary">
              <span className="btn-icon">+</span> New
            </Link>
            <div className="header-user">
              <span className="user-greeting">Howdy, {name}</span>
              <div className="header-dropdown">
                <button className="header-btn">Help</button>
                <div className="dropdown-menu">
                  <button onClick={logout} className="dropdown-item">Logout</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="header-btn">Login</Link>
            <Link to="/signup" className="header-btn header-btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
