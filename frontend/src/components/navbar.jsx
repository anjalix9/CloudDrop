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
            <div className="header-user">
              <span className="user-greeting">Howdy, {name}</span>
              <button onClick={logout} className="header-btn header-btn-primary">Logout</button>
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
