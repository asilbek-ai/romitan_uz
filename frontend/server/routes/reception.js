import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

// Reception hours schema (in-memory cache for now)
let receptionHours = {
  governor: {
    days: 'Dushanba - Juma',
    daysRu: 'Понедельник - Пятница',
    time: '15:00 - 17:00',
    location: 'Hokimiyat binosi, 2-qavat',
    locationRu: 'Здание хокимията, 2-этаж'
  },
  citizens: {
    days: 'Har payshanba',
    daysRu: 'Каждый четверг',
    time: '10:00 - 13:00',
    phone: '+998 65 380-00-00',
    phoneRu: '+998 65 380-00-00'
  }
};

// Get reception hours (public)
router.get('/', async (req, res) => {
  try {
    res.json(receptionHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update reception hours (admin only)
router.put('/', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    receptionHours = { ...receptionHours, ...req.body };
    await logActivity('update', 'reception', null, req.body)(req, res, () => {});
    res.json({ success: true, data: receptionHours });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;