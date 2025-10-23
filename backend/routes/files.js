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
    const fullPath = path.join(process.env.UPLOAD_DIR || 'uploads', file.storedName);
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
    const fullPath = path.join(process.env.UPLOAD_DIR || 'uploads', file.storedName);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    await file.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
