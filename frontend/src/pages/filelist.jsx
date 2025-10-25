import React, { useState, useEffect } from 'react';
import { listFiles, downloadFile, deleteFile } from '../api/api';
import FileCard from '../components/filecard';

export default function FilesList(){
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState('');

  const load = async () => {
    setErr('');
    try {
      const res = await listFiles();
      setFiles(res.data.files);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDownload = async (file) => {
    try {
      const res = await downloadFile(file._id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Download failed: ' + (e?.response?.data?.message || e.message));
    }
  };

  const handleDelete = async (file) => {
    if (!confirm(`Delete ${file.originalName}?`)) return;
    try {
      await deleteFile(file._id);
      setFiles(f => f.filter(x => x._id !== file._id));
    } catch (e) {
      alert('Delete failed: ' + (e?.response?.data?.message || e.message));
    }
  };

  return (
  <div className="card">
    <h2>Your files</h2>

    {/* Error message */}
    {err && <div className="error">{err}</div>}

    {/* Empty state (no files) */}
    {files.length === 0 && (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <img
          src="/assets/images.png"
          alt="No files yet"
          style={{
            width: "220px",
            opacity: "0.9",
            marginBottom: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        />
        <div style={{ fontSize: "1.1em", color: "#334155" }}>
          No files yet. <strong>Upload something.</strong>
        </div>
      </div>
    )}

    {/* File list */}
    <div style={{ marginTop: 20 }}>
      {files.map((f) => (
        <FileCard
          key={f._id}
          file={f}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      ))}
    </div>
  </div>
);
}
