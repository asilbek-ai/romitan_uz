import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMurojaat } from '../context/MurojaatContext';
import { Plus, Trash2, Edit, X, Image as ImageIcon, FileText, Calendar, AlertCircle, Upload, Video, Music, File } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMalumotlar() {
  const { malumotlar, addMalumot, deleteMalumot, loading } = useMurojaat();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', text: '', media: [] });
  const [mediaPreview, setMediaPreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Fayl yuklash funksiyasi
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file,
      size: (file.size / 1024 / 1024).toFixed(2)
    }));
    setMediaPreview([...mediaPreview, ...newMedia]);
    setForm({ ...form, media: [...form.media, ...newMedia] });
    toast.success(`${files.length} ta fayl yuklandi`);
  };

  // Media o'chirish
  const removeMedia = (id) => {
    setMediaPreview(mediaPreview.filter(m => m.id !== id));
    setForm({ ...form, media: form.media.filter(m => m.id !== id) });
    toast.success('Fayl o\'chirildi');
  };

  // Media ikonkasi
  const getMediaIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5 text-red-500" />;
    if (type.startsWith('audio/')) return <Music className="w-5 h-5 text-green-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.text) {
      toast.error('Sarlavha va matn majburiy');
      return;
    }
    setSubmitting(true);
    await addMalumot(form);
    setForm({ title: '', text: '', media: [] });
    setMediaPreview([]);
    setShowModal(false);
    setSubmitting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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
          className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Ma'lumotlar boshqaruvi</h1>
            <p className="mt-1 text-gray-500">Tuman haqidagi ma'lumotlarni qo'shish va boshqarish</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-xl"
          >
            <Plus size={20} /> Yangi ma'lumot
          </motion.button>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 mb-8 bg-white border border-gray-100 shadow-sm rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-800">{malumotlar.length}</div>
              <div className="text-sm text-gray-500">Jami ma'lumotlar</div>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        {/* Ma'lumotlar grid */}
        {malumotlar.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center bg-white shadow-sm rounded-2xl"
          >
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-400">Hech qanday ma'lumot yo‘q</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 mt-4 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              + Birinchi ma'lumotni qo'shing
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {malumotlar.map((m, idx) => (
              <motion.div
                key={m.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-md group rounded-2xl hover:shadow-xl"
              >
                {/* Media galereya */}
                {m.media && m.media.length > 0 && (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {m.media[0].type.startsWith('image/') ? (
                      <img 
                        src={m.media[0].url} 
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
                        alt={m.title} 
                      />
                    ) : m.media[0].type.startsWith('video/') ? (
                      <video src={m.media[0].url} className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <Music className="w-12 h-12 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">Audio fayl</span>
                      </div>
                    )}
                    {m.media.length > 1 && (
                      <div className="absolute px-2 py-1 text-xs text-white rounded-full bottom-2 right-2 bg-black/50">
                        +{m.media.length - 1} ta fayl
                      </div>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{m.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{m.text}</p>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(m.date).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      {m.media && m.media.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Upload className="w-3 h-3" />
                          {m.media.length}
                        </span>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (window.confirm('Ushbu ma\'lumotni o\'chirmoqchimisiz?')) {
                            deleteMalumot(m.id);
                          }
                        }}
                        className="p-2 text-red-500 transition-all duration-200 rounded-lg bg-red-50 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl rounded-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Yangi ma'lumot qo'shish</h2>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 text-gray-400 transition-all rounded-lg hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Sarlavha *</label>
                    <input
                      type="text"
                      placeholder="Sarlavha kiriting"
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      className="w-full px-4 py-2.5 text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Matn *</label>
                    <textarea
                      rows="5"
                      placeholder="Ma'lumot matnini kiriting"
                      value={form.text}
                      onChange={(e) => setForm({...form, text: e.target.value})}
                      className="w-full px-4 py-2.5 text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Media fayllar (rasm, video, audio)</label>
                    <div className="flex flex-wrap gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,video/*,audio/*"
                          multiple
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
                        <div className="flex flex-col items-center gap-2 p-4 transition-all border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 group">
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
                          <span className="text-sm text-gray-500 group-hover:text-blue-500">Fayl yuklash</span>
                          <span className="text-xs text-gray-400">JPG, PNG, MP4, MP3</span>
                        </div>
                      </label>
                    </div>

                    {/* Media preview */}
                    {mediaPreview.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {mediaPreview.map(media => (
                          <div key={media.id} className="relative group">
                            {media.type.startsWith('image/') ? (
                              <img src={media.url} className="object-cover w-20 h-20 border rounded-lg" alt={media.name} />
                            ) : media.type.startsWith('video/') ? (
                              <video src={media.url} className="object-cover w-20 h-20 border rounded-lg" />
                            ) : media.type.startsWith('audio/') ? (
                              <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-100 border rounded-lg">
                                <Music className="w-8 h-8 text-gray-500" />
                                <span className="text-[10px] text-gray-500 truncate w-full px-1 text-center">{media.name.slice(0, 10)}</span>
                              </div>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => removeMedia(media.id)}
                              className="absolute flex items-center justify-center w-5 h-5 text-xs text-white transition bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2.5 text-gray-600 transition-all border border-gray-200 rounded-xl hover:bg-gray-50"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-2.5 text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      ) : (
                        <Plus size={16} />
                      )}
                      {submitting ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}