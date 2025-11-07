import React, { useState, useEffect } from 'react';
import { uploadFile } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function UploadPage(){
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      nav('/login');
    }
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setMsg('Select a file first');
    const fd = new FormData();
    fd.append('file', file);
    setMsg('');
    setLoading(true);
    try {
      await uploadFile(fd);
      setMsg('Uploaded successfully!');
      setTimeout(() => nav('/files'), 700);
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload file</h2>
      <form onSubmit={submit}>
        <input type="file" onChange={e => setFile(e.target.files[0])} disabled={loading} />
        <button className="btn" disabled={loading || !file}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {msg && <div className={msg.includes('successfully') ? 'success' : 'error'} style={{marginTop:10}}>{msg}</div>}
    </div>
  );
}
