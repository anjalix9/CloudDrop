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
    <div>
      <h2>Your files</h2>
      {err && <div className="error">{err}</div>}
      {files.length === 0 && <div>No files yet. Upload something.</div>}
      <div style={{marginTop:12}}>
        {files.map(f => (
          <FileCard key={f._id} file={f} onDownload={handleDownload} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
