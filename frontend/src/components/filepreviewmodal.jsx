import react from 'react';
import React, { useState, useEffect } from 'react';
import { downloadFile } from '../api/api';

export default function FilePreviewModal({ file, onClose }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;

    const fetchFile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await downloadFile(file._id);
        const blob = new Blob([res.data]);
        const mimeType = file.mimeType || '';

        if (mimeType.startsWith('image/')) {
          const url = URL.createObjectURL(blob);
          setContent({ type: 'image', url });
        } else if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('xml')) {
          const text = await blob.text();
          setContent({ type: 'text', text });
        } else {
          setContent({ type: 'metadata', blob });
        }
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load file');
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    return () => {
      if (content?.url) URL.revokeObjectURL(content.url);
    };
  }, [file]);

  if (!file) return null;

  const renderContent = () => {
    if (loading) return <div className="loading">Loading preview...</div>;
    if (error) return <div className="error">{error}</div>;

    switch (content.type) {
      case 'image':
        return <img src={content.url} alt={file.originalName} className="preview-image" />;
      case 'text':
        return <pre className="preview-text">{content.text}</pre>;
      case 'metadata':
        return (
          <div className="preview-metadata">
            <h3>File Information</h3>
            <p><strong>Name:</strong> {file.originalName}</p>
            <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
            <p><strong>Type:</strong> {file.mimeType || 'Unknown'}</p>
            <p><strong>Uploaded:</strong> {new Date(file.createdAt).toLocaleString()}</p>
            <p>This file type cannot be previewed directly. Download to view.</p>
          </div>
        );
      default:
        return <div>Unsupported file type</div>;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{file.originalName}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
