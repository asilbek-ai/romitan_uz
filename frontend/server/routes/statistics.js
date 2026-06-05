import express from 'mongoose';
import mongoose from 'mongoose';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

const statisticSchema = new mongoose.Schema({
  label: { type: String, required: true },
  labelRu: { type: String },
  value: { type: Number, required: true },
  icon: { type: String, default: 'chart-line' },
  color: { type: String, default: 'blue' },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Statistic = mongoose.model('Statistic', statisticSchema);

// Get all statistics (public)
router.get('/', async (req, res) => {
  try {
    const stats = await Statistic.find({ isActive: true }).sort({ order: 1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single statistic
router.get('/:id', async (req, res) => {
  try {
    const stat = await Statistic.findById(req.params.id);
    if (!stat) return res.status(404).json({ error: 'Not found' });
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create statistic (admin only)
router.post('/', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const stat = new Statistic(req.body);
    await stat.save();
    await logActivity('create', 'statistic', stat._id, req.body)(req, res, () => {});
    res.status(201).json({ success: true, stat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update statistic
router.put('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const stat = await Statistic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stat) return res.status(404).json({ error: 'Not found' });
    await logActivity('update', 'statistic', stat._id, req.body)(req, res, () => {});
    res.json({ success: true, stat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete statistic
router.delete('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const stat = await Statistic.findByIdAndDelete(req.params.id);
    if (!stat) return res.status(404).json({ error: 'Not found' });
    await logActivity('delete', 'statistic', stat._id)(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;