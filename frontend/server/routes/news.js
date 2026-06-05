import express from 'express';
import mongoose from 'mongoose';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleRu: { type: String },
  content: { type: String, required: true },
  contentRu: { type: String },
  excerpt: { type: String },
  excerptRu: { type: String },
  category: { type: String, default: 'yangilik' },
  tags: [{ type: String }],
  featuredImage: { type: String },
  additionalImages: [{ type: String }],
  publishDate: { type: Date, default: Date.now },
  author: { type: String },
  views: { type: Number, default: 0 },
  comments: [{ 
    author: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  commentsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

// Get all news (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, tag } = req.query;
    const query = { status: 'published' };
    
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    if (tag) query.tags = tag;

    const news = await News.find(query)
      .sort({ publishDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await News.countDocuments(query);

    res.json({
      news,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single news
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'Not found' });
    // Increment views
    news.views += 1;
    await news.save();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get news by slug/ID
router.get('/slug/:slug', async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });
    if (!news) return res.status(404).json({ error: 'Not found' });
    news.views += 1;
    await news.save();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get related news
router.get('/:id/related', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'Not found' });
    const related = await News.find({
      _id: { $ne: news._id },
      $or: [
        { category: news.category },
        { tags: { $in: news.tags } }
      ]
    }).limit(5);
    res.json(related);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin routes
router.get('/admin/all', protect, authorize('admin', 'super_admin', 'editor'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await News.countDocuments(query);
    res.json({ news, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create news
router.post('/', protect, authorize('admin', 'super_admin', 'editor'), async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    await logActivity('create', 'news', news._id, req.body)(req, res, () => {});
    res.status(201).json({ success: true, news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update news
router.put('/:id', protect, authorize('admin', 'super_admin', 'editor'), async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!news) return res.status(404).json({ error: 'Not found' });
    await logActivity('update', 'news', news._id, req.body)(req, res, () => {});
    res.json({ success: true, news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete news
router.delete('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ error: 'Not found' });
    await logActivity('delete', 'news', news._id)(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment to news
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, text } = req.body;
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'Not found' });
    news.comments.push({ author, text });
    news.commentsCount = news.comments.length;
    await news.save();
    res.json({ success: true, comment: news.comments[news.comments.length - 1] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;