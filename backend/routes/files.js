const express = require('express');
const fs = require('fs');
const path = require('path');
const FileMeta = require('../models/filemeta');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// upload single file (auth required)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const meta = new FileMeta({
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      owner: req.user._id
    });
    await meta.save();
    res.json({ message: 'Uploaded', file: meta });
  } catch (err) {
    res.status(500).json({ message: 'Upload error', error: err.message });
  }
});

// list files for user
router.get('/', auth, async (req, res) => {
  try {
    const files = await FileMeta.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ files });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// download file by id
router.get('/download/:id', auth, async (req, res) => {
  try {
    const file = await FileMeta.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (!file.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const fullPath = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads', file.storedName);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ message: 'File missing on server' });
    res.download(fullPath, file.originalName);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// delete file by id
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await FileMeta.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (!file.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const fullPath = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads', file.storedName);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    await file.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// preview file (stream for images, text files, etc.)
router.get('/preview/:id', auth, async (req, res) => {
  try {
    const file = await FileMeta.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (!file.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const fullPath = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads', file.storedName);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ message: 'File missing on server' });
    
    // Set appropriate headers
    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
    res.sendFile(fullPath);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// rename file by id
router.patch('/:id/rename', auth, async (req, res) => {
  try {
    const { newName } = req.body;
    if (!newName || newName.trim() === '') {
      return res.status(400).json({ message: 'New name is required' });
    }
    const file = await FileMeta.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (!file.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    file.originalName = newName.trim();
    await file.save();
    res.json({ message: 'File renamed', file });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// move file to folder by id
router.patch('/:id/move', auth, async (req, res) => {
  try {
    const { folder } = req.body;
    const file = await FileMeta.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (!file.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    file.folder = folder || '';
    await file.save();
    res.json({ message: 'File moved', file });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// get analytics for user
router.get('/analytics', auth, async (req, res) => {
  try {
    const files = await FileMeta.find({ owner: req.user._id });
    
    // Calculate total storage
    const totalStorage = files.reduce((sum, file) => sum + (file.size || 0), 0);
    
    // Get file count
    const fileCount = files.length;
    
    // Group uploads by date for history
    const uploadHistory = {};
    files.forEach(file => {
      if (file.createdAt) {
        const date = new Date(file.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD
        uploadHistory[date] = (uploadHistory[date] || 0) + 1;
      }
    });
    
    // Convert to array format sorted by date
    const historyArray = Object.entries(uploadHistory)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Get recent uploads (last 30 days by default, or all if less than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentFiles = files
      .filter(file => file.createdAt && new Date(file.createdAt) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(file => ({
        id: file._id,
        name: file.originalName,
        size: file.size,
        date: file.createdAt
      }));
    
    res.json({
      fileCount,
      totalStorage,
      uploadHistory: historyArray,
      recentUploads: recentFiles
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
