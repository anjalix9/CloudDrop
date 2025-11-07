import React, { useEffect, useRef } from 'react';

export default function ContextMenu({ x, y, onClose, onRename, onDelete, onMove, onDownload, fileName }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('scroll', onClose, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('scroll', onClose, true);
    };
  }, [onClose]);

  // Adjust position if menu goes off screen
  const getStyle = () => {
    const style = {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      zIndex: 1000,
    };

    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > window.innerHeight) {
        style.top = `${y - rect.height}px`;
      }
    }

    return style;
  };

  const handleAction = (action) => {
    action();
    onClose();
  };

  return (
    <div ref={menuRef} className="context-menu" style={getStyle()}>
      <div className="context-menu-item" onClick={() => handleAction(onDownload)}>
        <span className="context-menu-icon">⬇️</span>
        <span>Download</span>
      </div>
      <div className="context-menu-item" onClick={() => handleAction(onRename)}>
        <span className="context-menu-icon">✏️</span>
        <span>Rename</span>
      </div>
      <div className="context-menu-item" onClick={() => handleAction(onMove)}>
        <span className="context-menu-icon">📁</span>
        <span>Move to Folder</span>
      </div>
      <div className="context-menu-divider"></div>
      <div className="context-menu-item danger" onClick={() => handleAction(onDelete)}>
        <span className="context-menu-icon">🗑️</span>
        <span>Delete</span>
      </div>
    </div>
  );
}

