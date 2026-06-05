import express from 'express';
import mongoose from 'mongoose';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameRu: { type: String },
  icon: { type: String, default: 'gear' },
  description: { type: String },
  descriptionRu: { type: String },
  department: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  requirements: [{ type: String }],
  documents: [{ type: String }],
  duration: { type: String },
  price: { type: String }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create service (admin only)
router.post('/', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    await logActivity('create', 'service', service._id, req.body)(req, res, () => {});
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service
router.put('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ error: 'Not found' });
    await logActivity('update', 'service', service._id, req.body)(req, res, () => {});
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete service
router.delete('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: 'Not found' });
    await logActivity('delete', 'service', service._id)(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;