import React, { useState } from 'react';
import { login } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.user.name);
      nav('/files');
    } catch (error) {
      setErr(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="card login-card">
        <h2>Welcome Back</h2>
        <p className="subtext">Login to access your CloudDrop files</p>
        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="btn full-width">Login</button>
          {err && <div className="error">{err}</div>}
        </form>
      </div>
    </div>
  );
}
