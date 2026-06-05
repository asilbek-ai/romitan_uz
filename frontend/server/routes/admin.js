import express from 'express';
import mongoose from 'mongoose';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';
import Admin from '../models/Admin.js';
import ActivityLog from '../models/ActivityLog.js';
import News from '../models/News.js';
import Service from '../models/Service.js';
import Document from '../models/Document.js';
import Contact from '../models/Contact.js';
import Subscriber from '../models/Subscriber.js';
import OnlineReception from '../models/OnlineReception.js';

const router = express.Router();

// ==================== DASHBOARD STATS ====================
router.get('/dashboard-stats', protect, async (req, res) => {
  try {
    const [
      totalNews, totalServices, totalDocuments, totalMedia,
      totalUsers, totalContacts, totalSubscribers, totalOnlineApplications
    ] = await Promise.all([
      News.countDocuments(),
      Service.countDocuments(),
      Document.countDocuments(),
      mongoose.model('Gallery').countDocuments(),
      Admin.countDocuments(),
      Contact.countDocuments(),
      Subscriber.countDocuments(),
      OnlineReception.countDocuments()
    ]);

    // Monthly statistics for charts
    const monthlyStats = await News.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          news: { $sum: 1 },
          views: { $sum: '$views' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    const monthNames = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    const formattedStats = monthNames.map((month, idx) => ({
      month,
      news: monthlyStats.find(s => s._id === idx + 1)?.news || 0,
      views: monthlyStats.find(s => s._id === idx + 1)?.views || 0
    }));

    // Media type distribution
    const mediaTypeDistribution = [
      { name: 'Rasm', value: await mongoose.model('Gallery').countDocuments({ type: 'image' }), color: '#3b82f6' },
      { name: 'Audio', value: await mongoose.model('Audio').countDocuments(), color: '#10b981' },
      { name: 'Video', value: await mongoose.model('Gallery').countDocuments({ type: 'video' }), color: '#ef4444' },
      { name: 'Hujjat', value: totalDocuments, color: '#f59e0b' }
    ];

    // Recent activities
    const recentActivities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('adminId', 'fullName username');

    res.json({
      stats: {
        totalNews,
        totalServices,
        totalDocuments,
        totalMedia,
        totalUsers,
        totalContacts,
        totalSubscribers,
        totalOnlineApplications
      },
      monthlyStats: formattedStats,
      mediaTypeDistribution,
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER MANAGEMENT ====================
router.get('/users', protect, authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const users = await Admin.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users', protect, authorize('super_admin'), async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;
    const existing = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    const user = new Admin({ username, email, password, fullName, role });
    await user.save();
    await logActivity('create', 'user', user._id, { username, email, role })(req, res, () => {});
    res.status(201).json({ success: true, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id', protect, authorize('super_admin'), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    if (password) {
      updateData.password = password;
    }
    const user = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    await logActivity('update', 'user', user._id, updateData)(req, res, () => {});
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:id', protect, authorize('super_admin'), async (req, res) => {
  try {
    const user = await Admin.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await logActivity('delete', 'user', user._id, { username: user.username })(req, res, () => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ACTIVITY LOGS ====================
router.get('/activity-logs', protect, authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, entity, action, startDate, endDate } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { adminName: { $regex: search, $options: 'i' } },
        { 'details.body': { $regex: search, $options: 'i' } }
      ];
    }
    if (entity && entity !== 'all') query.entity = entity;
    if (action && action !== 'all') query.action = action;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate + 'T23:59:59');
    }

    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      logs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/activity-logs/export', protect, authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const { search, entity, action } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { adminName: { $regex: search, $options: 'i' } },
        { 'details.body': { $regex: search, $options: 'i' } }
      ];
    }
    if (entity && entity !== 'all') query.entity = entity;
    if (action && action !== 'all') query.action = action;

    const logs = await ActivityLog.find(query).sort({ createdAt: -1 });

    // Create CSV
    const csvHeaders = ['Sana', 'Foydalanuvchi', 'Harakat', 'Bo\'lim', 'IP Manzil', 'Tafsilotlar'];
    const csvRows = logs.map(log => [
      new Date(log.createdAt).toLocaleString(),
      log.adminName,
      log.action,
      log.entity,
      log.ipAddress || '-',
      JSON.stringify(log.details).slice(0, 200)
    ]);

    const csvContent = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=activity-logs-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SETTINGS ====================
let settingsCache = {
  siteName: 'Jondor tumani rasmiy portali',
  siteNameRu: 'Официальный портал Джондорского района',
  siteEmail: 'info@jondor.uz',
  sitePhone: '+998 65 380-00-00',
  siteAddress: 'Jondor tumani, Buxoro viloyati',
  siteAddressRu: 'Джондорский район, Бухарская область',
  adminEmail: 'admin@jondor.uz',
  maintenanceMode: false,
  registrationEnabled: true,
  defaultLanguage: 'uz',
  smtpHost: '',
  smtpPort: '',
  smtpUser: '',
  smtpPass: '',
  socialLinks: {
    telegram: 'https://t.me/jondor',
    facebook: 'https://facebook.com/jondor',
    instagram: 'https://instagram.com/jondor',
    youtube: 'https://youtube.com/jondor'
  },
  seo: {
    metaTitle: 'Jondor tumani | Rasmiy portal',
    metaDescription: 'Jondor tumani rasmiy portali. Yangiliklar, davlat xizmatlari',
    metaKeywords: 'Jondor, tuman, Buxoro, rasmiy portal',
    googleAnalyticsId: '',
    yandexMetrikaId: ''
  }
};

router.get('/settings', protect, async (req, res) => {
  res.json(settingsCache);
});

router.put('/settings', protect, authorize('super_admin', 'admin'), async (req, res) => {
  try {
    settingsCache = { ...settingsCache, ...req.body };
    await logActivity('update', 'settings', null, req.body)(req, res, () => {});
    res.json({ success: true, settings: settingsCache });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== RECENT UPLOADS ====================
router.get('/recent-uploads', protect, async (req, res) => {
  try {
    const recentImages = await mongoose.model('Gallery').find().sort({ createdAt: -1 }).limit(5);
    const recentDocuments = await Document.find().sort({ createdAt: -1 }).limit(5);
    const recentAudios = await mongoose.model('Audio').find().sort({ createdAt: -1 }).limit(5);

    res.json({
      images: recentImages,
      documents: recentDocuments,
      audios: recentAudios
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;