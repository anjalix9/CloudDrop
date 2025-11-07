import React, { useState } from 'react';

export default function FileCard({ file, onDownload, onDelete, onPreview, onRename, onMove, onContextMenu }) {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleClick = (e) => {
    // Don't trigger preview if clicking on buttons
    if (e.target.closest('.file-actions')) return;
    if (onPreview) {
      onPreview(file);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onContextMenu) {
      onContextMenu(e, file);
    }
  };

  return (
    <div 
      className="file-card" 
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      style={{ cursor: 'pointer' }}
    >
      <div className="file-info">
        <div className="file-name">{file.originalName}</div>
        <div className="file-meta">{formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleString()}</div>
      </div>
      <div className="file-actions" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onDownload(file)} className="btn" type="button">Download</button>
        <button onClick={() => onDelete(file)} className="btn danger" type="button">Delete</button>
      </div>
    </div>
  );
}
