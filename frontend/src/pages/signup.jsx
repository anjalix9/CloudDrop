import React, { useState } from 'react';
import { signup } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', retypePassword: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.retypePassword) {
      setErr('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const res = await signup({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.user.name || form.name);
      nav('/files');
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || 'Signup failed');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">SIGN UP</h1>
        <form onSubmit={submit}>
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Username"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Create Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Retype Password"
              value={form.retypePassword}
              onChange={(e) => setForm({ ...form, retypePassword: e.target.value })}
              required
            />
          </div>
          <button className="signup-btn" disabled={loading}>{loading ? 'Signing up...' : 'SIGN UP'}</button>
          {err && <div className="error">{err}</div>}
        </form>
        <div className="login-link">
          Already have an account? <span onClick={() => nav('/login')} style={{cursor: 'pointer', color: '#ff007f'}}>Login now</span>
        </div>
      </div>
    </div>
  );
}
