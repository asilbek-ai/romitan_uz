import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'jondor_secret_key_2024',
      { expiresIn: '7d' }
    );
    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        avatar: admin.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register new admin (only super_admin can create)
router.post('/register', protect, authorize('super_admin'), async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;
    const existing = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    const admin = new Admin({ username, email, password, fullName, role });
    await admin.save();
    res.status(201).json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current admin
router.get('/me', protect, async (req, res) => {
  res.json({
    id: req.admin._id,
    username: req.admin.username,
    email: req.admin.email,
    fullName: req.admin.fullName,
    role: req.admin.role,
    avatar: req.admin.avatar,
    lastLogin: req.admin.lastLogin
  });
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }
    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;