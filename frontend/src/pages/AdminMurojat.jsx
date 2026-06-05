import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMurojaat } from '../context/MurojaatContext';
import { 
  Bell, CheckCircle, MessageCircle, Eye, Trash2, 
  TrendingUp, Users, Calendar, Clock, AlertCircle,
  ChevronRight, Search, Filter, Download, RefreshCw,
  User, Phone, MapPin, Mail, FileText, Star, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMurojat() {
  const { murojaatlar, markAsRead, getStatistics, notification, loading } = useMurojaat();
  const [selected, setSelected] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = getStatistics();
      setStats(data);
    };
    loadStats();
  }, [murojaatlar, getStatistics]);

  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 10) {
      setScrolled(true);
    }
  };

  // Yangilash funksiyasi
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = getStatistics();
      setStats(data);
      toast.success('Maʼlumotlar yangilandi!');
    } catch (error) {
      toast.error('Yangilashda xatolik yuz berdi');
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  // Eksport funksiyasi
  const handleExport = () => {
    try {
      // Filtrlangan murojaatlarni eksport qilish
      const exportData = filteredMurojaatlar.map(m => ({
        ID: m.id,
        "Ism familiya": m.fullName,
        Telefon: m.phone,
        Mahalla: m.mahalla,
        Mavzu: m.mavzu,
        Matn: m.text,
        Kategoriya: m.category,
        Status: m.status === 'unread' ? 'Yangi' : m.status === 'read' ? 'O‘qilgan' : m.status,
        "Yuborilgan sana": new Date(m.createdAt).toLocaleString()
      }));

      // CSV formatga o'tkazish
      const headers = Object.keys(exportData[0] || {});
      const csvRows = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
      ];
      const csvContent = csvRows.join('\n');

      // Blob yaratish va yuklab olish
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `murojaatlar_${new Date().toISOString().slice(0, 19)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`${filteredMurojaatlar.length} ta murojaat eksport qilindi!`);
    } catch (error) {
      toast.error('Eksport qilishda xatolik yuz berdi');
    }
  };

  const filteredMurojaatlar = murojaatlar.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.mavzu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, type: 'spring', stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mb-8"
        >
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Murojaatlar boshqaruvi</h1>
              <p className="mt-1 text-gray-500">Barcha murojaatlarni ko'rish va boshqarish</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50"
              >
                <Download className="w-4 h-4" /> Eksport
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
                {isRefreshing ? 'Yangilanmoqda...' : 'Yangilash'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4"
          >
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="relative p-5 overflow-hidden text-white shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <MessageCircle className="w-8 h-8 mb-2 opacity-80" />
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm opacity-80">Jami murojaatlar</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="relative p-5 overflow-hidden text-white shadow-lg bg-gradient-to-br from-red-500 to-red-600 rounded-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <Bell className="w-8 h-8 mb-2 opacity-80" />
                <div className="text-3xl font-bold">{stats.unreadCount}</div>
                <div className="text-sm opacity-80">Yangi murojaatlar</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="relative p-5 overflow-hidden text-white shadow-lg bg-gradient-to-br from-green-500 to-green-600 rounded-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
                <div className="text-3xl font-bold">{stats.readCount}</div>
                <div className="text-sm opacity-80">Hal qilindi</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="relative p-5 overflow-hidden text-white shadow-lg bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 rounded-full bg-white/10"></div>
              <div className="relative z-10">
                <Clock className="w-8 h-8 mb-2 opacity-80" />
                <div className="text-3xl font-bold">{stats.todayCount}</div>
                <div className="text-sm opacity-80">Bugungi murojaatlar</div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-6"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              placeholder="Ism, mavzu yoki matn bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Barcha status</option>
            <option value="unread">Yangi</option>
            <option value="read">O'qilgan</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Barcha kategoriya</option>
            <option value="Suv muammosi">Suv muammosi</option>
            <option value="Elektr">Elektr</option>
            <option value="Yo'l muammosi">Yo'l muammosi</option>
            <option value="Gaz">Gaz</option>
            <option value="Internet">Internet</option>
            <option value="Umumiy">Umumiy</option>
          </select>
        </motion.div>

        {/* Grouped Appeals */}
        {stats?.groupedMurojaatlar && stats.groupedMurojaatlar.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
              <Award className="w-5 h-5 text-purple-500" />
              Aqlli guruhlangan murojaatlar
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.groupedMurojaatlar.map((group, idx) => (
                <motion.div
                  key={group.mavzu}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="relative p-4 overflow-hidden transition-all border border-purple-200 cursor-pointer bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-800">{group.mavzu}</h4>
                    <span className="px-2 py-1 text-xs text-white bg-purple-500 rounded-full">{group.count} ta</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{group.items[0]?.text}</p>
                  <ChevronRight className="absolute w-4 h-4 text-purple-400 transition-transform bottom-3 right-3 group-hover:translate-x-1" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Murojaatlar ro'yxati */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filteredMurojaatlar.length === 0 ? (
            <motion.div variants={itemVariants} className="py-16 text-center bg-white shadow-sm rounded-2xl">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-400">Hech qanday murojaat topilmadi</p>
            </motion.div>
          ) : (
            filteredMurojaatlar.map((m, idx) => (
              <motion.div
                key={m.id}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                onClick={() => { setSelected(m); setScrolled(false); }}
                className="relative p-5 overflow-hidden transition-all duration-300 bg-white border border-gray-100 cursor-pointer group rounded-xl hover:shadow-lg hover:border-blue-200"
              >
                <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{m.mavzu}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${m.status === 'unread' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                        {m.status === 'unread' ? 'Yangi' : 'O‘qilgan'}
                      </span>
                      <span className="px-2 py-0.5 text-xs text-blue-700 rounded-full bg-blue-100">{m.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{m.text}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {m.fullName}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {m.mahalla || '—'}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(m.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {m.phone}</span>
                    </div>
                  </div>
                  {m.status === 'unread' && (
                    <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full animate-pulse">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Murojaat tafsilotlari</h2>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 text-gray-400 transition-all rounded-lg hover:bg-gray-100 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div ref={modalRef} onScroll={handleScroll} className="p-6 overflow-y-auto max-h-[55vh] space-y-5">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${selected.status === 'unread' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                      {selected.status === 'unread' ? 'Yangi' : 'O‘qilgan'}
                    </span>
                    <span className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">{selected.category}</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <User className="w-5 h-5 mt-0.5 text-blue-500" />
                      <div><label className="block text-xs text-gray-500">Ism familiya</label><p className="font-medium text-gray-800">{selected.fullName}</p></div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <Phone className="w-5 h-5 mt-0.5 text-green-500" />
                      <div><label className="block text-xs text-gray-500">Telefon</label><p className="font-medium text-gray-800">{selected.phone}</p></div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <MapPin className="w-5 h-5 mt-0.5 text-orange-500" />
                      <div><label className="block text-xs text-gray-500">Mahalla</label><p className="font-medium text-gray-800">{selected.mahalla || '—'}</p></div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <Mail className="w-5 h-5 mt-0.5 text-purple-500" />
                      <div><label className="block text-xs text-gray-500">Mavzu</label><p className="font-semibold text-gray-800">{selected.mavzu}</p></div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50">
                      <label className="flex items-center gap-2 mb-2 text-xs text-gray-500"><FileText className="w-4 h-4" /> Murojaat matni</label>
                      <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">{selected.text}</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <Calendar className="w-5 h-5 mt-0.5 text-cyan-500" />
                      <div><label className="block text-xs text-gray-500">Yuborilgan sana</label><p className="font-medium text-gray-800">{new Date(selected.createdAt).toLocaleString()}</p></div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { if(scrolled) { markAsRead(selected.id); setSelected(null); } }}
                    disabled={!scrolled}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      scrolled ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg text-white cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {scrolled ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    {scrolled ? '✅ Tushunarli' : '📖 Murojaatni oxirigacha o‘qing'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}