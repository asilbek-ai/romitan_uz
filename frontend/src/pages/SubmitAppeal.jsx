// src/pages/SubmitAppeal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppealAnalytics } from '../context/AppealAnalyticsContext';
import { Send, Upload, X, Image, Video, Mic } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubmitAppeal() {
  const navigate = useNavigate();
  const { addAppeal } = useAppealAnalytics();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    mahalla: '',
    type: 'Xalq qabulxonasi',
    text: '',
    media: []
  });
  const [mediaPreview, setMediaPreview] = useState([]);

  const appealTypes = ['Xalq qabulxonasi', 'Xalq nazorati', 'Hokimga murojaat', 'Telegram bot', 'EDO tizimi', 'Portal orqali'];
  const mahallalar = ['Yangiobod MFY', 'Jondor MFY', 'Mustaqillik MFY', 'Navoiy MFY', 'Alisher Navoiy MFY', 'Bobur MFY'];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file
    }));
    setMediaPreview([...mediaPreview, ...newMedia]);
    setForm({ ...form, media: [...form.media, ...newMedia] });
  };

  const removeMedia = (id) => {
    setMediaPreview(mediaPreview.filter(m => m.id !== id));
    setForm({ ...form, media: form.media.filter(m => m.id !== id) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.text) {
      toast.error('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    setLoading(true);
    await addAppeal(form);
    setLoading(false);
    navigate('/appeals-analytics');
  };

  return (
    <div className="min-h-screen py-20 pt-28 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-3xl px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text">
            Murojaat yuborish
          </h1>
          <p className="mt-2 text-gray-500">Muammoingizni yozing, tezda javob beramiz</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSubmit}
          className="p-6 border shadow-xl bg-white/80 backdrop-blur-md rounded-2xl md:p-8 border-white/20"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Ism familiya *</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-3 transition border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                placeholder="Ism familiyangiz"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Telefon *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 transition border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                placeholder="+998 XX XXX XX XX"
              />
            </div>
          </div>

          <div className="grid gap-5 mt-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Mahalla</label>
              <select
                value={form.mahalla}
                onChange={(e) => setForm({ ...form, mahalla: e.target.value })}
                className="w-full px-4 py-3 transition border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="">Mahalla tanlang</option>
                {mahallalar.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Murojaat turi</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 transition border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              >
                {appealTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Murojaat matni *</label>
            <textarea
              rows="5"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full px-4 py-3 transition border border-gray-200 resize-none rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="Muammoingizni batafsil yozing..."
            />
          </div>

          {/* Media Upload */}
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Media fayllar (rasm, video, audio)</label>
            <div className="flex gap-3">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
                <div className="flex flex-col items-center gap-1 p-3 transition border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500">
                  <Image size={24} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Rasm</span>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="file" accept="video/*" multiple className="hidden" onChange={handleFileUpload} />
                <div className="flex flex-col items-center gap-1 p-3 transition border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500">
                  <Video size={24} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Video</span>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="file" accept="audio/*" multiple className="hidden" onChange={handleFileUpload} />
                <div className="flex flex-col items-center gap-1 p-3 transition border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500">
                  <Mic size={24} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Audio</span>
                </div>
              </label>
            </div>
            {mediaPreview.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {mediaPreview.map(media => (
                  <div key={media.id} className="relative">
                    {media.type.startsWith('image/') && (
                      <img src={media.url} className="object-cover w-16 h-16 rounded-lg" alt="" />
                    )}
                    {media.type.startsWith('video/') && (
                      <video src={media.url} className="object-cover w-16 h-16 rounded-lg" />
                    )}
                    {media.type.startsWith('audio/') && (
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
                        <Mic size={24} className="text-gray-500" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(media.id)}
                      className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-3 mt-6 font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:scale-105 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" /> : <Send size={18} />}
            {loading ? 'Yuborilmoqda...' : 'Murojaat yuborish'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}