const mongoose = require('mongoose');

const fileMetaSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  mimeType: { type: String },
  size: { type: Number },
  folder: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('FileMeta', fileMetaSchema);
