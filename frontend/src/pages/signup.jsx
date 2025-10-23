import React, {useState} from 'react';
import { signup } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', password:''});
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
    } catch (err) {
      setErr(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="card">
      <h2>Sign up</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
        <button className="btn">Create account</button>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  );
}
