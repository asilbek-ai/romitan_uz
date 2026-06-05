import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { motion } from 'framer-motion';
import { Calendar, Eye, ArrowLeft, Share2, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, adminData, lang } = useContext(AppContext);
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Yangilikni ID bo'yicha qidirish
    if (adminData?.news && adminData.news.length > 0) {
      const foundNews = adminData.news.find(item => item.id === id || item._id === id);
      setNews(foundNews || null);
      setLoading(false);
    }
  }, [id, adminData]);

  // Ko'rishlar sonini oshirish
  useEffect(() => {
    if (news && news.id) {
      // Bu yerda API ga ko'rishlar sonini oshirish so'rovi yuborilishi mumkin
      console.log('News viewed:', news.id);
    }
  }, [news]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link nusxalandi!');
    } catch (error) {
      toast.error('Nusxalashda xatolik');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">{t("Yuklanmoqda...", "Загрузка...")}</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
            <i className="fas fa-newspaper text-6xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("Yangilik topilmadi", "Новость не найдена")}</h2>
          <p className="text-gray-500 mb-6">{t("Kechirasiz, siz qidirayotgan yangilik mavjud emas.", "Извините, новость которую вы ищете, не существует.")}</p>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("Yangiliklarga qaytish", "Вернуться к новостям")}
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = news.gallery || news.images || [];
  const title = t(news.title, news.titleRu);
  const content = news.content || news.description || '';

  return (
    <div className="min-h-screen py-10 pt-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 gap-8 flex flex-col lg:flex-row">
        
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Main Image */}
            {news.image && (
              <div className="relative h-96 overflow-hidden">
                <img
                  src={news.image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}
            
            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(news.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{news.views || 0} {t("ko'rildi", "просмотров")}</span>
                </div>
              </div>
              
              {/* Description/Content */}
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                {content.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className="mb-4">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
              
              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {t("Galereya", "Галерея")}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square bg-black"
                        onClick={() => openImageModal(img)}
                      >
                        <img
                          src={img}
                          alt={`${title} - ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <i className="fas fa-search-plus text-white text-2xl"></i>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-4 border-t">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  <Share2 className="w-4 h-4" />
                  {t("Ulashish", "Поделиться")}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  <Printer className="w-4 h-4" />
                  {t("Chop etish", "Печать")}
                </button>
                <Link
                  to="/news"
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("Barcha yangiliklar", "Все новости")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Sidebar - So'nggi yangiliklar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-lg p-5 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              {t("So'nggi yangiliklar", "Последние новости")}
            </h2>
            <div className="space-y-4">
              {adminData?.news && adminData.news
                .filter(item => item.id !== news.id && item._id !== news.id)
                .slice(0, 5)
                .map((item) => (
                  <motion.div
                    key={item.id || item._id}
                    whileHover={{ x: 5 }}
                    onClick={() => navigate(`/news/${item.id || item._id}`)}
                    className="group cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-all duration-300"
                  >
                    <div className="flex gap-3">
                      {item.image && (
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition line-clamp-2">
                          {t(item.title, item.titleRu)}
                        </h5>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(item.date)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
            
            {/* View All Button */}
            <Link
              to="/news"
              className="flex items-center justify-center gap-2 w-full mt-4 px-4 py-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              {t("Barcha yangiliklar", "Все новости")}
              <i className="fas fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-5xl w-full mx-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition"
            >
              <i className="fas fa-times"></i>
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
      
      {/* Print Styles */}
      <style>{`
        @media print {
          .sticky, .fixed, button, .lg\\:w-1\\/3, .border-t, .gap-3 {
            display: none !important;
          }
          .w-full.lg\\:w-2\\/3 {
            width: 100% !important;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}