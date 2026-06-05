import express from 'express';
import mongoose from 'mongoose';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleRu: { type: String },
  description: { type: String },
  category: { type: String, enum: ['qonun', 'qaror', 'farmon', 'hisobot', 'nizom', 'boshqa'], default: 'boshqa' },
  fileUrl: { type: String, required: true },
  fileName: { type: String },
  fileSize: { type: Number },
  fileType: { type: String },
  downloadCount: { type: Number, default: 0 },
  publishDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

// Get all documents (public)
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleRu: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'all') query.category = category;
    
    const documents = await Document.find(query)
      .sort({ publishDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Document.countDocuments(query);
    
    res.json({
      documents,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single document
router.get('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download document (increment count)
router.get('/download/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    doc.downloadCount += 1;
    await doc.save();
    res.json({ downloadUrl: doc.fileUrl, fileName: doc.fileName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin routes
router.post('/', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const doc = new Document(req.body);
    await doc.save();
    await logActivity('create', 'document', doc._id, req.body)(req, res, () => {});
    res.status(201).json({ success: true, doc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    await logActivity('update', 'document', doc._id, req.body)(req, res, () => {});
    res.json({ success: true, doc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    await logActivity('delete', 'document', doc._id)(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;