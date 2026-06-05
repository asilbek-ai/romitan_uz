import express from 'express';
import mongoose from 'mongoose';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  questionRu: { type: String },
  answer: { type: String },
  answerRu: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Faq = mongoose.model('Faq', faqSchema);

// Get all FAQs (public)
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find({ isActive: true }).sort({ order: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single FAQ
router.get('/:id', async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ error: 'Not found' });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin routes
router.post('/', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const faq = new Faq(req.body);
    await faq.save();
    await logActivity('create', 'faq', faq._id, req.body)(req, res, () => {});
    res.status(201).json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ error: 'Not found' });
    await logActivity('update', 'faq', faq._id, req.body)(req, res, () => {});
    res.json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ error: 'Not found' });
    await logActivity('delete', 'faq', faq._id)(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;