import React, { useState } from 'react';
import { uploadFile } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function UploadPage(){
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setMsg('Select a file first');
    const fd = new FormData();
    fd.append('file', file);
    setMsg('Uploading...');
    try {
      await uploadFile(fd);
      setMsg('Uploaded');
      setTimeout(() => nav('/files'), 700);
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="card">
      <h2>Upload file</h2>
      <form onSubmit={submit}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button className="btn">Upload</button>
      </form>
      {msg && <div style={{marginTop:10}}>{msg}</div>}
    </div>
  );
}
