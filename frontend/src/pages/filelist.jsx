import React, { useState, useEffect } from 'react';
import { listFiles, downloadFile, deleteFile, previewFile } from '../api/api';
import FileCard from '../components/filecard';

export default function FilesList(){
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState('');
  const [preview, setPreview] = useState({ url: '', text: '', type: '' });

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

  const handlePreview = async (file) => {
    try {
      const res = await previewFile(file._id);
      const mime = file.mimeType || res.data.type || 'application/octet-stream';
      if (mime.startsWith('text/')) {
        const textContent = await res.data.text();
        setPreview({ url: '', text: textContent, type: 'text' });
      } else {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: mime }));
        setPreview({ url, text: '', type: mime });
      }
    } catch (e) {
      try {
        if (e?.response?.data instanceof Blob) {
          const text = await e.response.data.text();
          try {
            const json = JSON.parse(text);
            alert('Preview failed: ' + (json.message || e.message));
          } catch {
            alert('Preview failed: ' + text);
          }
        } else {
          alert('Preview failed: ' + (e?.response?.data?.message || e.message));
        }
      } catch {
        alert('Preview failed: ' + e.message);
      }
    }
  };

  const closePreview = () => {
    if (preview.url) window.URL.revokeObjectURL(preview.url);
    setPreview({ url: '', text: '', type: '' });
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
          onPreview={handlePreview}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      ))}
    </div>

    {/* Preview Modal */}
    {preview.type && (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }} onClick={closePreview}>
        <div className="card" style={{ width: '90%', maxWidth: 900, maxHeight: '85vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Preview</h3>
            <button className="btn danger" onClick={closePreview}>Close</button>
          </div>
          <div style={{ marginTop: 12 }}>
            {preview.text && (
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{preview.text}</pre>
            )}
            {!preview.text && preview.url && preview.type.startsWith('image/') && (
              <img src={preview.url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70vh' }} />
            )}
            {!preview.text && preview.url && (preview.type === 'application/pdf' || preview.type.startsWith('application/')) && (
              <iframe src={preview.url} title="Preview" style={{ width: '100%', height: '70vh', border: 0 }} />
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
}
