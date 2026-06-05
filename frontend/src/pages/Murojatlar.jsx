import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMurojaat } from '../context/MurojaatContext';
import { Send, User, Phone, MapPin, Mail, FileText, CheckCircle, AlertCircle, Clock, Users, Building, MessageCircle, Star, TrendingUp, Calendar, Eye, ThumbsUp, Share2, X, Play, Music, Image as ImageIcon, Video } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Murojatlar() {
  const { malumotlar, addMurojaat, getStatistics } = useMurojaat();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stats, setStats] = useState(null);
  const [likedItems, setLikedItems] = useState({});
  const [sharedItems, setSharedItems] = useState({});
  const [viewCounts, setViewCounts] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
    fullName: '', phone: '', mahalla: '', mavzu: '', text: '', media: []
  });

  useEffect(() => {
    const loadStats = () => {
      const data = getStatistics();
      setStats(data);
    };
    loadStats();
    
    // Load view counts from localStorage
    const savedViews = localStorage.getItem('jondor_malumot_views');
    if (savedViews) {
      setViewCounts(JSON.parse(savedViews));
    }
  }, [getStatistics]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.text || !form.mavzu) {
      toast.error('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }
    setLoading(true);
    await addMurojaat(form);
    setForm({ fullName: '', phone: '', mahalla: '', mavzu: '', text: '', media: [] });
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  // Ko'rish funksiyasi (har safar bosganda hisoblanadi)
  const handleView = (itemId) => {
    // Har safar bosganda yangi ko'rish qo'shiladi
    const newViewCount = (viewCounts[itemId] || 0) + 1;
    const updatedViews = { ...viewCounts, [itemId]: newViewCount };
    setViewCounts(updatedViews);
    localStorage.setItem('jondor_malumot_views', JSON.stringify(updatedViews));
    
    toast.success(`Ko‘rildi! (Jami: ${newViewCount} marta ko‘rilgan)`);
  };

  // Yoqdi (Like) funksiyasi
  const handleLike = (itemId) => {
    if (!likedItems[itemId]) {
      setLikedItems(prev => ({ ...prev, [itemId]: true }));
      toast.success('Rahmat! Sizning fikringiz muhim');
    } else {
      setLikedItems(prev => {
        const newState = { ...prev };
        delete newState[itemId];
        return newState;
      });
      toast('Yoqtirish bekor qilindi');
    }
  };

  // Ulashish funksiyasi
  const handleShare = async (item, itemId) => {
    if (!sharedItems[itemId]) {
      const shareData = {
        title: item.title,
        text: item.text,
        url: window.location.href
      };
      
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          setSharedItems(prev => ({ ...prev, [itemId]: true }));
          toast.success('Ulashildi!');
        } else {
          await navigator.clipboard.writeText(`${item.title}\n${item.text}\n${window.location.href}`);
          setSharedItems(prev => ({ ...prev, [itemId]: true }));
          toast.success('Link nusxalandi!');
        }
      } catch (error) {
        toast.error('Ulashishda xatolik');
      }
    } else {
      toast('Siz allaqachon ulashgansiz');
    }
  };

  // Malumotni ochish
  const openDetail = (item) => {
    setSelectedItem(item);
  };

  // Media turiga qarab komponent
  const renderMedia = (media) => {
    if (!media) return null;
    
    if (media.type?.startsWith('image/')) {
      return <img src={media.url} className="object-cover w-full h-full" alt={media.name} />;
    }
    if (media.type?.startsWith('video/')) {
      return (
        <video 
          src={media.url} 
          className="object-cover w-full h-full" 
          controls 
          controlsList="nodownload"
          playsInline
          autoPlay={false}
        />
      );
    }
    if (media.type?.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
          <Music className="w-16 h-16 mb-4 text-gray-500" />
          <audio src={media.url} controls className="w-full px-4" />
          <p className="mt-2 text-sm text-gray-600">{media.name}</p>
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring', stiffness: 100 } }
  };

  const cardVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2, type: 'spring', stiffness: 300 } }
  };

  return (
    <div className="min-h-screen py-20 pt-28 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Header Section with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mb-12 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block p-4 mb-4 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl"
          >
            <MessageCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text">
            Murojaatlar markazi
          </h1>
          <p className="max-w-2xl mx-auto mt-3 text-gray-500">
            Sizning fikringiz biz uchun muhim. Muammo va takliflaringizni yozib qoldiring, tez orada javob beramiz.
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
            <div className="w-6 h-1 bg-indigo-400 rounded-full"></div>
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 mb-10 md:grid-cols-4"
          >
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="p-4 bg-white border border-gray-100 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between">
                <div><div className="text-2xl font-bold text-blue-600">{stats.total}</div><div className="text-xs text-gray-500">Jami murojaatlar</div></div>
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl"><MessageCircle className="w-5 h-5 text-blue-600" /></div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="p-4 bg-white border border-gray-100 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between">
                <div><div className="text-2xl font-bold text-green-600">{stats.todayCount}</div><div className="text-xs text-gray-500">Bugungi</div></div>
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl"><Calendar className="w-5 h-5 text-green-600" /></div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="p-4 bg-white border border-gray-100 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between">
                <div><div className="text-2xl font-bold text-purple-600">{stats.weeklyCount}</div><div className="text-xs text-gray-500">Haftalik</div></div>
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl"><TrendingUp className="w-5 h-5 text-purple-600" /></div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="p-4 bg-white border border-gray-100 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between">
                <div><div className="text-2xl font-bold text-orange-600">{stats.topMahalla !== '—' ? stats.topMahalla.slice(0, 8) : '—'}</div><div className="text-xs text-gray-500">Eng faol mahalla</div></div>
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-xl"><Users className="w-5 h-5 text-orange-600" /></div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Success Message */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed z-50 flex items-center gap-3 px-6 py-4 text-white -translate-x-1/2 shadow-2xl top-24 left-1/2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl"
            >
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Murojaatingiz muvaffaqiyatli yuborildi!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 lg:grid-cols-2"
        >
          {/* Murojaat Form - Left Side */}
          <motion.div variants={itemVariants}>
            <div className="overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/20">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                  <Send className="w-5 h-5" />
                  Murojaat yuborish
                </h2>
                <p className="mt-1 text-sm text-white/80">Quyidagi formani to'ldiring, tez orada javob olasiz</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="relative group">
                    <User className="absolute w-5 h-5 text-gray-400 transition -translate-y-1/2 left-4 top-1/2 group-focus-within:text-blue-500" />
                    <input
                      type="text"
                      placeholder="Ism familiya *"
                      value={form.fullName}
                      onChange={(e) => setForm({...form, fullName: e.target.value})}
                      className="w-full py-3 pl-12 pr-4 transition-all duration-300 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute w-5 h-5 text-gray-400 transition -translate-y-1/2 left-4 top-1/2 group-focus-within:text-blue-500" />
                    <input
                      type="tel"
                      placeholder="Telefon *"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      className="w-full py-3 pl-12 pr-4 transition-all duration-300 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="relative group">
                    <MapPin className="absolute w-5 h-5 text-gray-400 transition -translate-y-1/2 left-4 top-1/2 group-focus-within:text-blue-500" />
                    <input
                      type="text"
                      placeholder="Mahalla (ixtiyoriy)"
                      value={form.mahalla}
                      onChange={(e) => setForm({...form, mahalla: e.target.value})}
                      className="w-full py-3 pl-12 pr-4 transition-all duration-300 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute w-5 h-5 text-gray-400 transition -translate-y-1/2 left-4 top-1/2 group-focus-within:text-blue-500" />
                    <input
                      type="text"
                      placeholder="Murojaat mavzusi *"
                      value={form.mavzu}
                      onChange={(e) => setForm({...form, mavzu: e.target.value})}
                      className="w-full py-3 pl-12 pr-4 transition-all duration-300 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <FileText className="absolute w-5 h-5 text-gray-400 transition left-4 top-4 group-focus-within:text-blue-500" />
                  <textarea
                    rows="5"
                    placeholder="Murojaat matni *"
                    value={form.text}
                    onChange={(e) => setForm({...form, text: e.target.value})}
                    className="w-full py-3 pl-12 pr-4 transition-all duration-300 border border-gray-200 resize-none rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {loading ? 'Yuborilmoqda...' : 'Murojaat yuborish'}
                </motion.button>

                <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Tez javob</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Ishonchli</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 24/7</span>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Ma'lumotlar - Right Side */}
          <motion.div variants={itemVariants}>
            <div className="h-full overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/20">
              <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                  <Building className="w-5 h-5" />
                  Ma'lumotlar
                </h2>
                <p className="mt-1 text-sm text-white/80">Tumanimiz haqida so'nggi ma'lumotlar</p>
              </div>

              <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                {malumotlar.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
                      <Building className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-400">Hozircha ma'lumot yo‘q</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {malumotlar.map((m, idx) => (
                      <motion.div
                        key={m.id}
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        onClick={() => openDetail(m)}
                        custom={idx}
                        className="p-5 transition-all duration-300 bg-white border border-gray-100 shadow-md cursor-pointer group rounded-2xl hover:shadow-xl"
                      >
                        <div className="flex gap-4">
                          {m.image && (
                            <img src={m.image} className="object-cover w-20 h-20 rounded-xl" alt={m.title} />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                                {m.title}
                              </h3>
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Calendar className="w-3 h-3" />
                                {new Date(m.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-3">{m.text}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleView(m.id); }}
                                className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-blue-500"
                              >
                                <Eye className="w-3 h-3" /> 
                                Ko'rish ({viewCounts[m.id] || 0})
                              </button>
                              
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleLike(m.id); }}
                                className={`flex items-center gap-1 text-xs transition ${
                                  likedItems[m.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" /> 
                                {likedItems[m.id] ? "Yoqdi" : "Yoqdi"}
                              </button>
                              
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleShare(m, m.id); }}
                                className={`flex items-center gap-1 text-xs transition ${
                                  sharedItems[m.id] ? 'text-purple-500' : 'text-gray-400 hover:text-purple-500'
                                }`}
                              >
                                <Share2 className="w-3 h-3" /> 
                                {sharedItems[m.id] ? "Ulashildi" : "Ulashish"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Category Stats */}
        {stats && stats.categoryStats && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12"
          >
            <h3 className="mb-6 text-xl font-bold text-center text-gray-800">Murojaat turlari</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {Object.entries(stats.categoryStats).map(([cat, count], idx) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="p-3 text-center transition-all bg-white shadow-md rounded-xl hover:shadow-lg"
                >
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="mt-1 text-xs text-gray-500">{cat}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-2xl font-bold text-gray-800">{selectedItem.title}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex items-center justify-center w-8 h-8 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row h-full max-h-[calc(85vh-80px)] overflow-y-auto">
                {/* Media qismi */}
                <div className="md:w-1/2 bg-gray-100 min-h-[300px] flex items-center justify-center relative">
                  {selectedItem.media && selectedItem.media.length > 0 ? (
                    renderMedia(selectedItem.media[0])
                  ) : selectedItem.image ? (
                    <img src={selectedItem.image} className="object-cover w-full h-full" alt={selectedItem.title} />
                  ) : (
                    <div className="text-center">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Media fayl mavjud emas</p>
                    </div>
                  )}
                  
                  {/* Ko'rishlar soni badge */}
                  <div className="absolute flex items-center gap-1 px-2 py-1 text-xs text-white rounded-full bottom-3 right-3 bg-black/60">
                    <Eye size={12} /> {viewCounts[selectedItem.id] || 0} marta ko‘rilgan
                  </div>
                </div>

                {/* Ma'lumot qismi */}
                <div className="p-6 overflow-y-auto md:w-1/2">
                  <div className="mb-4">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedItem.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {selectedItem.text}
                  </p>

                  {/* Statistika kartalari */}
                  <div className="grid grid-cols-3 gap-3 p-4 mt-6 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <Eye className="w-5 h-5 mx-auto text-blue-500" />
                      <div className="mt-1 text-lg font-bold text-gray-800">{viewCounts[selectedItem.id] || 0}</div>
                      <div className="text-xs text-gray-500">Ko‘rish</div>
                    </div>
                    <div className="text-center">
                      <ThumbsUp className={`w-5 h-5 mx-auto ${likedItems[selectedItem.id] ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                      <div className="mt-1 text-lg font-bold text-gray-800">{likedItems[selectedItem.id] ? 1 : 0}</div>
                      <div className="text-xs text-gray-500">Yoqdi</div>
                    </div>
                    <div className="text-center">
                      <Share2 className={`w-5 h-5 mx-auto ${sharedItems[selectedItem.id] ? 'text-purple-500' : 'text-gray-400'}`} />
                      <div className="mt-1 text-lg font-bold text-gray-800">{sharedItems[selectedItem.id] ? 1 : 0}</div>
                      <div className="text-xs text-gray-500">Ulashish</div>
                    </div>
                  </div>

                  {/* Qayta ko'rish tugmasi */}
                  {/* <div className="mt-4">
                    <button 
                      onClick={() => handleView(selectedItem.id)}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <Eye size={18} /> Qayta ko‘rish
                    </button>
                  </div> */}

                  {/* Media galereya */}
                  {selectedItem.media && selectedItem.media.length > 1 && (
                    <div className="mt-6">
                      <h3 className="mb-3 font-semibold text-gray-800">Qo'shimcha fayllar ({selectedItem.media.length - 1})</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.media.slice(1).map((media, idx) => (
                          <div key={idx} className="flex items-center justify-center w-16 h-16 transition bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                            {media.type?.startsWith('image/') && <ImageIcon className="w-6 h-6 text-blue-500" />}
                            {media.type?.startsWith('video/') && <Video className="w-6 h-6 text-red-500" />}
                            {media.type?.startsWith('audio/') && <Music className="w-6 h-6 text-green-500" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 mt-6 border-t">
                    <button 
                      onClick={() => handleLike(selectedItem.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        likedItems[selectedItem.id] ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ThumbsUp size={18} /> {likedItems[selectedItem.id] ? "Yoqdi" : "Yoqdi"}
                    </button>
                    <button 
                      onClick={() => handleShare(selectedItem, selectedItem.id)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <Share2 size={18} /> Ulashish
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}