import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jondor_portal';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('📡 Connected to MongoDB for seeding...');

  const UserSchema = new mongoose.Schema({ email: String, name: String, passwordHash: String, role: String });
  const User = mongoose.model('User', UserSchema);
  const NewsSchema = new mongoose.Schema({ title: String, summary: String, content: String, imageUrl: String, tags: [String], date: Date });
  const News = mongoose.model('News', NewsSchema);
  const ServiceSchema = new mongoose.Schema({ name: String, category: String, description: String, department: String, link: String, phone: String, email: String, icon: String });
  const Service = mongoose.model('Service', ServiceSchema);
  const DocumentSchema = new mongoose.Schema({ title: String, type: String, year: Number, fileUrl: String, description: String });
  const Document = mongoose.model('Document', DocumentSchema);
  const MediaSchema = new mongoose.Schema({ title: String, imageUrl: String, category: String, description: String });
  const Media = mongoose.model('Media', MediaSchema);
  const StatisticSchema = new mongoose.Schema({ label: String, value: Number, icon: String, order: Number });
  const Statistic = mongoose.model('Statistic', StatisticSchema);

  // Admin user
  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10);
    await User.create({ email: process.env.ADMIN_EMAIL || 'admin@jondor.uz', passwordHash, name: 'Jondor Admin', role: 'admin' });
    console.log('✅ Admin user created.');
  }

  // News
  if (await News.countDocuments() === 0) {
    await News.insertMany([
      { title: 'Jondor tumanida yangi maktab qurilishi boshlandi', summary: 'Zamonaviy 500 o\'rinli maktab qurilishi boshlandi.', content: 'Bugun Jondor tumanida yangi maktab qurilishining poydevori qo\'yildi.', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', tags: ['ta\'lim'], date: new Date() },
      { title: 'Qishloq xo\'jaligi mahsulotlari eksporti 25% ga oshdi', summary: 'Tumanda yetishtirilgan mahsulotlar eksporti oshdi.', content: 'Joriy yilda eksport sezilarli darajada oshdi.', imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5c9a8?w=800', tags: ['qishloq xo\'jaligi'], date: new Date() },
      { title: 'Yangi park va istirohat bog\'i ochildi', summary: 'Tuman markazida zamonaviy park ochildi.', content: 'Yangi parkda bolalar maydonchalari va sport zonalari tashkil etilgan.', imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800', tags: ['infratuzilma'], date: new Date() }
    ]);
    console.log('✅ News seeded.');
  }

  // Services
  if (await Service.countDocuments() === 0) {
    await Service.insertMany([
      { name: 'Yagona interaktiv davlat xizmatlari', category: 'E-xizmat', description: 'Onlayn ariza topshirish, to\'lovlar va so\'rovlar.', department: 'AT bo\'limi', link: 'https://my.gov.uz', phone: '+998 65 123-45-67', icon: 'laptop' },
      { name: 'Ko\'chmas mulkni ro\'yxatdan o\'tkazish', category: 'Ro\'yxatga olish', description: 'Arizalar qabul qilish va ko\'rib chiqish.', department: 'Adliya bo\'limi', phone: '+998 65 234-56-78', icon: 'building' },
      { name: 'Tadbirkorlikni qo\'llab-quvvatlash', category: 'Biznes', description: 'Biznes loyihalarni moliyalashtirish.', department: 'Iqtisodiyot bo\'limi', link: 'https://business.uz', icon: 'chart-line' }
    ]);
    console.log('✅ Services seeded.');
  }

  // Documents
  if (await Document.countDocuments() === 0) {
    await Document.insertMany([
      { title: '2025-yilgi budjet haqida qaror', type: 'Qaror', year: 2025, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', description: 'Budjet tasdiqlangan.' },
      { title: 'Biznes subsidiyalar dasturi', type: 'Dastur', year: 2025, fileUrl: 'https://www.orimi.com/pdf-test.pdf', description: 'Subsidiyalar dasturi.' }
    ]);
    console.log('✅ Documents seeded.');
  }

  // Media
  if (await Media.countDocuments() === 0) {
    await Media.insertMany([
      { title: 'Jondor tumani markazi', imageUrl: 'https://images.unsplash.com/photo-1541844053589-346841d0a17f?w=800', category: 'gallery' },
      { title: 'Park va istirohat bog\'i', imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800', category: 'gallery' },
      { title: 'Maktab binosi', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', category: 'gallery' }
    ]);
    console.log('✅ Media seeded.');
  }

  // Statistics
  if (await Statistic.countDocuments() === 0) {
    await Statistic.insertMany([
      { label: 'Aholi soni', value: 218000, icon: 'users', order: 1 },
      { label: 'Mahalla soni', value: 42, icon: 'home', order: 2 },
      { label: 'Maktablar', value: 35, icon: 'school', order: 3 },
      { label: 'Tibbiyot muassasalari', value: 12, icon: 'hospital', order: 4 },
      { label: 'Korxonalar', value: 156, icon: 'factory', order: 5 },
      { label: 'Fermer xo\'jaliklari', value: 320, icon: 'tractor', order: 6 }
    ]);
    console.log('✅ Statistics seeded.');
  }

  await mongoose.disconnect();
  console.log('🎉 Seeding completed!');
};

seed().catch(e => { console.error('❌ Seeding error:', e); process.exit(1); });