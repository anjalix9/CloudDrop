import React, {useState} from 'react';
import { login } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:''});
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
    } catch (err) {
      setErr(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
        <button className="btn">Login</button>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  );
}
