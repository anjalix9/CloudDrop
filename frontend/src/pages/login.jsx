import React, { useState } from 'react';
import { login } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await login({ email: form.email, password: form.password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.user.name || 'User');
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      nav('/files');
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || 'Login failed');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">LOGIN</h1>
        <form onSubmit={submit}>
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
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Logging in...' : 'LOGIN'}</button>
          {err && <div className="error">{err}</div>}
        </form>
        <div className="divider">
          <span>Or login with</span>
        </div>
        <button className="google-btn">
          <i className="fab fa-google"></i>
          Google
        </button>
        <div className="signup-link">
          Not a member? <span onClick={() => nav('/signup')} style={{cursor: 'pointer', color: '#ff007f'}}>Sign up now</span>
        </div>
      </div>
    </div>
  );
}
