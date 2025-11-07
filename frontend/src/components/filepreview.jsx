import React, { useState, useEffect } from 'react';
import { previewFile } from '../api/api';

export default function FilePreview({ file, onClose }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [textContent, setTextContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;

    const loadPreview = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await previewFile(file._id);
        const blob = response.data;
        const mimeType = file.mimeType || '';

        // Check if it's an image
        if (mimeType.startsWith('image/')) {
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          setTextContent(null);
        }
        // Check if it's a text file
        else if (mimeType.startsWith('text/') || 
                 mimeType === 'application/json' ||
                 mimeType === 'application/javascript' ||
                 mimeType === 'application/xml') {
          const text = await blob.text();
          setTextContent(text);
          setPreviewUrl(null);
        }
        // For other files, show metadata
        else {
          setPreviewUrl(null);
          setTextContent(null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load preview');
      } finally {
        setLoading(false);
      }
    };

    loadPreview();

    // Cleanup
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file]);

  const isImage = file?.mimeType?.startsWith('image/');
  const isText = file?.mimeType?.startsWith('text/') || 
                 ['application/json', 'application/javascript', 'application/xml'].includes(file?.mimeType);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (!file) return null;

  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <h3>{file.originalName}</h3>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        <div className="preview-content">
          {loading && (
            <div className="preview-loading">
              <div className="spinner"></div>
              <p>Loading preview...</p>
            </div>
          )}
          {error && (
            <div className="preview-error">
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && (
            <>
              {isImage && previewUrl && (
                <div className="preview-image-container">
                  <img src={previewUrl} alt={file.originalName} className="preview-image" />
                </div>
              )}
              {isText && textContent !== null && (
                <div className="preview-text-container">
                  <pre className="preview-text">{textContent}</pre>
                </div>
              )}
              {!isImage && !isText && (
                <div className="preview-metadata">
                  <div className="metadata-item">
                    <strong>File Name:</strong> {file.originalName}
                  </div>
                  <div className="metadata-item">
                    <strong>File Type:</strong> {file.mimeType || 'Unknown'}
                  </div>
                  <div className="metadata-item">
                    <strong>File Size:</strong> {formatFileSize(file.size)}
                  </div>
                  <div className="metadata-item">
                    <strong>Uploaded:</strong> {new Date(file.createdAt).toLocaleString()}
                  </div>
                  <div className="metadata-item">
                    <strong>Last Modified:</strong> {new Date(file.updatedAt).toLocaleString()}
                  </div>
                  <div className="metadata-note">
                    <p>Preview not available for this file type. Please download to view.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

