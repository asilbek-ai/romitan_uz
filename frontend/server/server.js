import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jondor_portal')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ==================== SCHEMAS ====================

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['super_admin', 'admin', 'editor', 'viewer'], default: 'editor' },
  avatar: { type: String, default: '' },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const ActivityLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  adminName: { type: String },
  action: { type: String, enum: ['create', 'update', 'delete', 'upload', 'login', 'logout'] },
  entity: { type: String },
  entityId: { type: String },
  details: { type: Object },
  ipAddress: { type: String }
}, { timestamps: true });

const NewsSchema = new mongoose.Schema({
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
  comments: [{ author: String, text: String, createdAt: { type: Date, default: Date.now } }],
  commentsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' }
}, { timestamps: true });

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameRu: { type: String },
  icon: { type: String, default: 'gear' },
  description: { type: String },
  descriptionRu: { type: String },
  department: { type: String },
  requirements: [{ type: String }],
  duration: { type: String },
  price: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const StatisticSchema = new mongoose.Schema({
  label: { type: String, required: true },
  labelRu: { type: String },
  value: { type: Number, required: true },
  icon: { type: String, default: 'chart-line' },
  color: { type: String, default: 'blue' },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameRu: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  addressRu: { type: String },
  website: { type: String },
  logo: { type: String },
  category: { type: String, default: 'government' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const GallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String },
  titleRu: { type: String },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  category: { type: String, default: 'general' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const AudioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleRu: { type: String },
  description: { type: String },
  descriptionRu: { type: String },
  category: { type: String, enum: ['speech', 'music', 'interview', 'announcement'], default: 'speech' },
  thumbnail: { type: String },
  audioUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  artist: { type: String },
  plays: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleRu: { type: String },
  description: { type: String },
  category: { type: String, enum: ['qonun', 'qaror', 'farmon', 'hisobot', 'nizom', 'boshqa'], default: 'boshqa' },
  fileUrl: { type: String, required: true },
  fileName: { type: String },
  fileSize: { type: Number },
  fileType: { type: String },
  downloadCount: { type: Number, default: 0 },
  publishDate: { type: Date, default: Date.now }
}, { timestamps: true });

const CarouselSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String },
  titleRu: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const LeadershipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String },
  positionRu: { type: String },
  image: { type: String },
  phone: { type: String },
  email: { type: String },
  bio: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  questionRu: { type: String },
  answer: { type: String },
  answerRu: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  reply: { type: String }
}, { timestamps: true });

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

const OnlineReceptionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  passport: { type: String, required: true },
  message: { type: String, required: true },
  fileUrl: { type: String },
  fileName: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'rejected'], default: 'pending' },
  reply: { type: String },
  trackingCode: { type: String, unique: true }
}, { timestamps: true });

// Models
const Admin = mongoose.model('Admin', AdminSchema);
const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
const News = mongoose.model('News', NewsSchema);
const Service = mongoose.model('Service', ServiceSchema);
const Statistic = mongoose.model('Statistic', StatisticSchema);
const Organization = mongoose.model('Organization', OrganizationSchema);
const Gallery = mongoose.model('Gallery', GallerySchema);
const Audio = mongoose.model('Audio', AudioSchema);
const Document = mongoose.model('Document', DocumentSchema);
const Carousel = mongoose.model('Carousel', CarouselSchema);
const Leadership = mongoose.model('Leadership', LeadershipSchema);
const Faq = mongoose.model('Faq', FaqSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Subscriber = mongoose.model('Subscriber', SubscriberSchema);
const OnlineReception = mongoose.model('OnlineReception', OnlineReceptionSchema);

// ==================== MULTER CONFIGURATION ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    if (file.mimetype.startsWith('image/')) folder += 'images/';
    else if (file.mimetype.startsWith('audio/')) folder += 'audio/';
    else if (file.mimetype.startsWith('video/')) folder += 'video/';
    else folder += 'documents/';
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'video/mp4', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('File type not allowed'), false);
};

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter });

// ==================== AUTH MIDDLEWARE ====================
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jondor_secret');
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) throw new Error();
    req.admin = admin;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    admin.lastLogin = new Date();
    await admin.save();
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'jondor_secret', { expiresIn: '7d' });
    res.json({ token, admin: { id: admin._id, username: admin.username, fullName: admin.fullName, email: admin.email, role: admin.role, avatar: admin.avatar } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  res.json(req.admin);
});

// ==================== UPLOAD ROUTE ====================
app.post('/api/upload', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
    res.json({ success: true, file: { url: fileUrl, name: req.file.originalname, size: req.file.size, type: req.file.mimetype } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== NEWS ROUTES ====================
app.get('/api/news', async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = { status: 'published' };
    if (category && category !== 'all') query.category = category;
    const news = await News.find(query).sort({ publishDate: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await News.countDocuments(query);
    res.json({ news, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news) { news.views += 1; await news.save(); }
    res.json(news);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/news', auth, authorize('admin', 'super_admin', 'editor'), async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    await ActivityLog.create({ adminId: req.admin._id, adminName: req.admin.fullName, action: 'create', entity: 'news', entityId: news._id });
    res.status(201).json({ success: true, news });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/news/:id', auth, authorize('admin', 'super_admin', 'editor'), async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await ActivityLog.create({ adminId: req.admin._id, adminName: req.admin.fullName, action: 'update', entity: 'news', entityId: news._id });
    res.json({ success: true, news });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/news/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    await ActivityLog.create({ adminId: req.admin._id, adminName: req.admin.fullName, action: 'delete', entity: 'news', entityId: req.params.id });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== SERVICES ROUTES ====================
app.get('/api/services', async (req, res) => {
  try { res.json(await Service.find({ isActive: true }).sort({ order: 1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/services', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const service = new Service(req.body); await service.save(); res.status(201).json({ success: true, service }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/services/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { await Service.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== STATISTICS ROUTES ====================
app.get('/api/statistics', async (req, res) => {
  try { res.json(await Statistic.find().sort({ order: 1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/statistics', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const stat = new Statistic(req.body); await stat.save(); res.status(201).json({ success: true, stat }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/statistics/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { await Statistic.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== ORGANIZATIONS ROUTES ====================
app.get('/api/organizations', async (req, res) => {
  try { res.json(await Organization.find().sort({ order: 1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/organizations', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const org = new Organization(req.body); await org.save(); res.status(201).json({ success: true, org }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/organizations/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { await Organization.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== GALLERY ROUTES ====================
app.get('/api/gallery', async (req, res) => {
  try { res.json(await Gallery.find().sort({ order: 1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/gallery', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const item = new Gallery(req.body); await item.save(); res.status(201).json({ success: true, item }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/gallery/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { await Gallery.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== AUDIO ROUTES ====================
app.get('/api/audio', async (req, res) => {
  try { res.json(await Audio.find({ isActive: true }).sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/audio', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const audio = new Audio(req.body); await audio.save(); res.status(201).json({ success: true, audio }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/audio/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const audio = await Audio.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, audio }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/audio/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { await Audio.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== DOCUMENTS ROUTES ====================
app.get('/api/documents', async (req, res) => {
  try { const { search, category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category && category !== 'all') query.category = category;
    const docs = await Document.find(query).sort({ publishDate: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Document.countDocuments(query);
    res.json({ documents: docs, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/documents/download/:id', async (req, res) => {
  try { const doc = await Document.findById(req.params.id);
    if (doc) { doc.downloadCount += 1; await doc.save(); }
    res.json({ downloadUrl: doc.fileUrl, fileName: doc.fileName });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/documents', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const doc = new Document(req.body); await doc.save(); res.status(201).json({ success: true, doc }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/documents/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { await Document.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== CAROUSEL ROUTES ====================
app.get('/api/carousel', async (req, res) => {
  try { res.json(await Carousel.find().sort({ order: 1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/carousel', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const item = new Carousel(req.body); await item.save(); res.status(201).json({ success: true, item }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/carousel/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { await Carousel.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== LEADERSHIP ROUTES ====================
app.get('/api/leadership', async (req, res) => {
  try { res.json(await Leadership.find().sort({ order: 1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/leadership', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const leader = new Leadership(req.body); await leader.save(); res.status(201).json({ success: true, leader }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/leadership/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { await Leadership.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== FAQ ROUTES ====================
app.get('/api/faqs', async (req, res) => {
  try { res.json(await Faq.find().sort({ order: 1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/faqs', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const faq = new Faq(req.body); await faq.save(); res.status(201).json({ success: true, faq }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/faqs/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { await Faq.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== CONTACT ROUTES ====================
app.post('/api/contact', async (req, res) => {
  try { const contact = new Contact(req.body); await contact.save(); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/contacts', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { res.json(await Contact.find().sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/contacts/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { await Contact.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== SUBSCRIBE ROUTE ====================
app.post('/api/subscribe', async (req, res) => {
  try {
    const existing = await Subscriber.findOne({ email: req.body.email });
    if (existing) return res.json({ success: true, message: 'Already subscribed' });
    await Subscriber.create({ email: req.body.email });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/subscribers', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { res.json(await Subscriber.find().sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== ONLINE RECEPTION ROUTES ====================
app.post('/api/online-reception/submit', upload.single('file'), async (req, res) => {
  try {
    const { fullName, phone, passport, message } = req.body;
    const data = { fullName, phone, passport, message };
    if (req.file) { data.fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`; data.fileName = req.file.originalname; }
    const reception = new OnlineReception(data);
    await reception.save();
    res.status(201).json({ success: true, applicationId: reception.trackingCode });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/online-reception/track/:code', async (req, res) => {
  try {
    const app = await OnlineReception.findOne({ trackingCode: req.params.code });
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json({ status: app.status, reply: app.reply, updatedAt: app.updatedAt });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/online-reception', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { res.json(await OnlineReception.find().sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/online-reception/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try { const app = await OnlineReception.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, app }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== DASHBOARD STATS ====================
app.get('/api/admin/stats', auth, async (req, res) => {
  try {
    const [newsCount, servicesCount, documentsCount, galleryCount, audioCount, contactsCount, subscribersCount, onlineCount] = await Promise.all([
      News.countDocuments(), Service.countDocuments(), Document.countDocuments(), Gallery.countDocuments(),
      Audio.countDocuments(), Contact.countDocuments(), Subscriber.countDocuments(), OnlineReception.countDocuments()
    ]);
    const monthlyNews = await News.aggregate([{ $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
    const recentActivity = await ActivityLog.find().sort({ createdAt: -1 }).limit(10).populate('adminId', 'fullName');
    res.json({ stats: { newsCount, servicesCount, documentsCount, galleryCount, audioCount, contactsCount, subscribersCount, onlineCount }, monthlyNews, recentActivity });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== INIT ADMIN ====================
const initAdmin = async () => {
  const existing = await Admin.findOne({ username: 'admin' });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hashed, fullName: 'Super Admin', email: 'admin@jondor.uz', role: 'super_admin' });
    console.log('✅ Admin created: admin / admin123');
  }
};
initAdmin();

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));