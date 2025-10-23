import React from 'react';

export default function FileCard({ file, onDownload, onDelete }) {
  return (
    <div className="file-card">
      <div className="file-info">
        <div className="file-name">{file.originalName}</div>
        <div className="file-meta">{(file.size/1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleString()}</div>
      </div>
      <div className="file-actions">
        <button onClick={() => onDownload(file)} className="btn">Download</button>
        <button onClick={() => onDelete(file)} className="btn danger">Delete</button>
      </div>
    </div>
  );
}
