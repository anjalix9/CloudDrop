import React, { useState, useEffect, useRef } from 'react';

export default function RenameModal({ file, onClose, onRename }) {
  const [newName, setNewName] = useState(file?.originalName || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (file) {
      setNewName(file.originalName || '');
    }
    // Focus input when modal opens
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Select filename without extension for easier renaming
        const lastDot = newName.lastIndexOf('.');
        if (lastDot > 0) {
          inputRef.current.setSelectionRange(0, lastDot);
        }
      }
    }, 100);
  }, [file, newName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim() && newName.trim() !== file.originalName) {
      onRename(newName.trim());
    } else {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!file) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Rename File</h3>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>New name:</label>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter new file name"
              required
            />
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn">
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

