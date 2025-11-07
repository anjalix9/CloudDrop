import React, { useState, useEffect } from 'react';
import { listFiles, downloadFile, deleteFile, renameFile, moveFile } from '../api/api';
import { useNavigate } from 'react-router-dom';
import FileCard from '../components/filecard';
import FilePreview from '../components/filepreview';
import ContextMenu from '../components/contextmenu';
import RenameModal from '../components/renamemodal';
import MoveToFolderModal from '../components/movetofoldermodal';

export default function FilesList(){
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [renameModal, setRenameModal] = useState(null);
  const [moveModal, setMoveModal] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      nav('/login');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav]);

  const load = async () => {
    setErr('');
    setLoading(true);
    try {
      const res = await listFiles();
      setFiles(res.data.files || []);
    } catch (e) {
      if (e?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        nav('/login');
      } else {
        setErr(e?.response?.data?.message || e.message || 'Failed to load files');
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleRename = async (file, newName) => {
    try {
      const res = await renameFile(file._id, newName);
      setFiles(f => f.map(x => x._id === file._id ? res.data.file : x));
      setRenameModal(null);
    } catch (e) {
      alert('Rename failed: ' + (e?.response?.data?.message || e.message));
    }
  };

  const handleMove = async (file, folder) => {
    try {
      const res = await moveFile(file._id, folder);
      setFiles(f => f.map(x => x._id === file._id ? res.data.file : x));
      setMoveModal(null);
    } catch (e) {
      alert('Move failed: ' + (e?.response?.data?.message || e.message));
    }
  };

  const handleContextMenu = (e, file) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      file: file
    });
  };

  const getExistingFolders = () => {
    const folders = new Set();
    files.forEach(file => {
      if (file.folder) {
        folders.add(file.folder);
      }
    });
    return Array.from(folders);
  };

  return (
    <div className="card">
      <h2>Your files</h2>

      {/* Error message */}
      {err && <div className="error">{err}</div>}

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div className="spinner"></div>
          <p>Loading files...</p>
        </div>
      )}

      {/* Empty state (no files) */}
      {!loading && files.length === 0 && !err && (
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
      {!loading && (
        <div style={{ marginTop: 20 }}>
          {files.map((f) => (
            <FileCard
              key={f._id}
              file={f}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onPreview={setPreviewFile}
              onContextMenu={handleContextMenu}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onDownload={() => handleDownload(contextMenu.file)}
          onDelete={() => {
            setContextMenu(null);
            handleDelete(contextMenu.file);
          }}
          onRename={() => {
            setContextMenu(null);
            setRenameModal(contextMenu.file);
          }}
          onMove={() => {
            setContextMenu(null);
            setMoveModal(contextMenu.file);
          }}
          fileName={contextMenu.file.originalName}
        />
      )}

      {/* Rename Modal */}
      {renameModal && (
        <RenameModal
          file={renameModal}
          onClose={() => setRenameModal(null)}
          onRename={(newName) => handleRename(renameModal, newName)}
        />
      )}

      {/* Move to Folder Modal */}
      {moveModal && (
        <MoveToFolderModal
          file={moveModal}
          onClose={() => setMoveModal(null)}
          onMove={(folder) => handleMove(moveModal, folder)}
          existingFolders={getExistingFolders()}
        />
      )}
    </div>
  );
}
