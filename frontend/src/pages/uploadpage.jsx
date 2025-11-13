import React, { useState, useEffect } from 'react';
import { uploadFile } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function UploadPage(){
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
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
    <div className="upload-page">
      <div className="upload-card">
        <h1 className="upload-title">Upload File</h1>
        <form onSubmit={submit}>
          <input
            id="fileInput"
            className="file-input"
            type="file"
            onChange={e => {
              const f = e.target.files[0];
              setFile(f || null);
              setFileName(f ? f.name : 'No file chosen');
            }}
            disabled={loading}
          />
          <div className="file-input-row">
            <label htmlFor="fileInput" className="file-input-label">Choose File</label>
            <span className="file-name">{fileName}</span>
          </div>
          <button className="upload-btn" disabled={loading || !file}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {msg && <div className={msg.toLowerCase().includes('success') ? 'success' : 'error'} style={{marginTop:10}}>{msg}</div>}
      </div>
    </div>
  );
}
