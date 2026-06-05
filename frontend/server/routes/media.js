import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';
import Audio from '../models/Audio.js';
import Gallery from '../models/Gallery.js';

const router = express.Router();

// ==================== AUDIO ROUTES ====================
router.get('/audio', async (req, res) => {
  try {
    const audios = await Audio.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(audios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/audio/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ error: 'Audio not found' });
    // Increment play count
    audio.plays += 1;
    await audio.save();
    res.json(audio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/audio', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const audio = new Audio(req.body);
    await audio.save();
    await logActivity('create', 'audio', audio._id, req.body)(req, res, () => {});
    res.status(201).json({ success: true, audio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/audio/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const audio = await Audio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!audio) return res.status(404).json({ error: 'Audio not found' });
    await logActivity('update', 'audio', audio._id, req.body)(req, res, () => {});
    res.json({ success: true, audio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/audio/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const audio = await Audio.findByIdAndDelete(req.params.id);
    if (!audio) return res.status(404).json({ error: 'Audio not found' });
    await logActivity('delete', 'audio', audio._id)(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GALLERY ROUTES ====================
router.get('/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/gallery', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const item = new Gallery(req.body);
    await item.save();
    await logActivity('create', 'gallery', item._id, req.body)(req, res, () => {});
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/gallery/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await logActivity('delete', 'gallery', item._id)(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;