import express from 'express';
import mongoose from 'mongoose';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

const leadershipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String },
  positionRu: { type: String },
  image: { type: String },
  phone: { type: String },
  email: { type: String },
  bio: { type: String },
  bioRu: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Leadership = mongoose.model('Leadership', leadershipSchema);

// Get all leadership (public)
router.get('/', async (req, res) => {
  try {
    const leaders = await Leadership.find({ isActive: true }).sort({ order: 1 });
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single leader
router.get('/:id', async (req, res) => {
  try {
    const leader = await Leadership.findById(req.params.id);
    if (!leader) return res.status(404).json({ error: 'Not found' });
    res.json(leader);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin routes
router.post('/', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const leader = new Leadership(req.body);
    await leader.save();
    await logActivity('create', 'leadership', leader._id, req.body)(req, res, () => {});
    res.status(201).json({ success: true, leader });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const leader = await Leadership.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!leader) return res.status(404).json({ error: 'Not found' });
    await logActivity('update', 'leadership', leader._id, req.body)(req, res, () => {});
    res.json({ success: true, leader });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const leader = await Leadership.findByIdAndDelete(req.params.id);
    if (!leader) return res.status(404).json({ error: 'Not found' });
    await logActivity('delete', 'leadership', leader._id)(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;