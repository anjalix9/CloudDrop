import React from 'react';

export default function FileCard({ file, onPreview, onDownload, onDelete }) {
  return (
    <div className="file-card">
      <div className="file-info">
        <div className="file-name">{file.originalName}</div>
        <div className="file-meta">{(file.size/1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleString()}</div>
      </div>
      <div className="file-actions">
        {onPreview && (
          <button onClick={() => onPreview(file)} className="btn" style={{ marginRight: 8 }}>Preview</button>
        )}
        <button onClick={() => onDownload(file)} className="btn">Download</button>
        <button onClick={() => onDelete(file)} className="btn danger">Delete</button>
      </div>
    </div>
  );
}
