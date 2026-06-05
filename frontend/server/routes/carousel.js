import express from 'express';
import mongoose from 'mongoose';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

const carouselSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String },
  titleRu: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Carousel = mongoose.model('Carousel', carouselSchema);

// Get all carousel items (public)
router.get('/', async (req, res) => {
  try {
    const items = await Carousel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single carousel item
router.get('/:id', async (req, res) => {
  try {
    const item = await Carousel.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create carousel item (admin only)
router.post('/', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const item = new Carousel(req.body);
    await item.save();
    await logActivity('create', 'carousel', item._id, req.body)(req, res, () => {});
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update carousel item
router.put('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const item = await Carousel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    await logActivity('update', 'carousel', item._id, req.body)(req, res, () => {});
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete carousel item
router.delete('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const item = await Carousel.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await logActivity('delete', 'carousel', item._id)(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;