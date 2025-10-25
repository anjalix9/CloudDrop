import React, { useState } from 'react';
import { signup } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await signup(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.user.name);
      nav('/files');
    } catch (error) {
      setErr(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="card signup-card">
        <h2>Create Your CloudDrop Account</h2>
        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
          <button className="btn full-width">Sign Up</button>
          {err && <div className="error">{err}</div>}
        </form>
      </div>
    </div>
  );
}
