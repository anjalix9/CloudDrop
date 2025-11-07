import React, { useState, useEffect, useRef } from 'react';

export default function MoveToFolderModal({ file, onClose, onMove, existingFolders = [] }) {
  const [folderName, setFolderName] = useState(file?.folder || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (file) {
      setFolderName(file.folder || '');
    }
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, [file]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onMove(folderName.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const filteredFolders = existingFolders.filter(f => 
    f.toLowerCase().includes(folderName.toLowerCase()) && f !== folderName
  );

  const handleSelectFolder = (folder) => {
    setFolderName(folder);
    setShowSuggestions(false);
  };

  if (!file) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Move to Folder</h3>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>Folder name (leave empty for root):</label>
            <div className="input-with-suggestions">
              <input
                ref={inputRef}
                type="text"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Enter folder name"
              />
              {showSuggestions && filteredFolders.length > 0 && (
                <div className="suggestions-dropdown">
                  {filteredFolders.slice(0, 5).map((folder, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      onClick={() => handleSelectFolder(folder)}
                    >
                      📁 {folder}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn">
              Move
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

