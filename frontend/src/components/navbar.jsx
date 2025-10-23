import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
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
      <div className="nav-left">
        <Link to="/files" className="brand">Clouddrop</Link>
      </div>
      <div>
        { token ? (
          <>
            <span style={{marginRight:12}}>Hi, {name}</span>
            <Link to="/upload" className="btn">Upload</Link>
            <button onClick={logout} className="btn" style={{marginLeft:8}}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn" style={{marginLeft:8}}>Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
