import express from 'express';
import mongoose from 'mongoose';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameRu: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  addressRu: { type: String },
  website: { type: String },
  logo: { type: String },
  category: { type: String, default: 'government' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);

// Get all organizations (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { isActive: true };
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameRu: { $regex: search, $options: 'i' } }
      ];
    }
    const orgs = await Organization.find(query).sort({ order: 1, name: 1 });
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single organization
router.get('/:id', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Not found' });
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create organization (admin only)
router.post('/', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const org = new Organization(req.body);
    await org.save();
    await logActivity('create', 'organization', org._id, req.body)(req, res, () => {});
    res.status(201).json({ success: true, org });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update organization
router.put('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const org = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!org) return res.status(404).json({ error: 'Not found' });
    await logActivity('update', 'organization', org._id, req.body)(req, res, () => {});
    res.json({ success: true, org });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete organization
router.delete('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const org = await Organization.findByIdAndDelete(req.params.id);
    if (!org) return res.status(404).json({ error: 'Not found' });
    await logActivity('delete', 'organization', org._id)(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;