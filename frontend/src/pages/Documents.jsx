import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Documents() {
  const { t, documents } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredDoc, setHoveredDoc] = useState(null);
  const [localDocs, setLocalDocs] = useState([]);

  useEffect(() => {
    if (Array.isArray(documents)) {
      setLocalDocs(documents);
    }
  }, [documents]);

  const categories = [
    { value: 'all', label: 'Barchasi', labelRu: 'Все', icon: 'fa-folder-open' },
    { value: 'qonun', label: 'Qonun', labelRu: 'Закон', icon: 'fa-gavel' },
    { value: 'qaror', label: 'Qaror', labelRu: 'Постановление', icon: 'fa-stamp' },
    { value: 'farmon', label: 'Farmon', labelRu: 'Указ', icon: 'fa-feather-alt' },
    { value: 'hisobot', label: 'Hisobot', labelRu: 'Отчет', icon: 'fa-chart-line' },
    { value: 'nizom', label: 'Nizom', labelRu: 'Положение', icon: 'fa-book' },
    { value: 'boshqa', label: 'Boshqa', labelRu: 'Другое', icon: 'fa-file' }
  ];

  const filteredDocs = localDocs.filter(doc => {
    const matchesSearch = doc?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (doc?.nameRu && doc.nameRu.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (doc) => {
    if (doc.fileUrl) {
      try {
        const link = document.createElement('a');
        link.href = doc.fileUrl;
        link.download = doc.name + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Yuklab olish boshlandi');
      } catch (error) {
        toast.error('Yuklab olishda xatolik');
      }
    } else {
      toast.error('Fayl mavjud emas');
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      qonun: '📜 Qonun',
      qaror: '📋 Qaror',
      farmon: '📝 Farmon',
      hisobot: '📊 Hisobot',
      nizom: '📑 Nizom',
      boshqa: '📁 Boshqa'
    };
    return labels[category] || '📁 Hujjat';
  };

  const getCategoryColor = (category) => {
    const colors = {
      qonun: 'bg-purple-100 text-purple-700 border-purple-200',
      qaror: 'bg-blue-100 text-blue-700 border-blue-200',
      farmon: 'bg-green-100 text-green-700 border-green-200',
      hisobot: 'bg-orange-100 text-orange-700 border-orange-200',
      nizom: 'bg-teal-100 text-teal-700 border-teal-200',
      boshqa: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colors[category] || colors.boshqa;
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
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: { duration: 0.3, type: 'spring', stiffness: 300 }
    }
  };

  if (localDocs.length === 0) {
    return (
      <div className="relative min-h-screen py-20 overflow-hidden pt-28 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-30 animate-slow-pan"></div>
        </div>
        <div className="relative z-10 px-4 mx-auto text-center max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 border shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl border-white/20"
          >
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
              <i className="text-5xl text-blue-600 fas fa-file-alt"></i>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">📄 {t('Hujjatlar', 'Документы')}</h1>
            <p className="text-gray-500">{t('Hozircha hech qanday hujjat yo\'q', 'Пока нет документов')}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-20 overflow-hidden pt-18 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background */}
      {/* <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-30 animate-slow-pan"></div>
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-blue-200/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-indigo-200/20 blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div> */}

      <div className="relative z-10 px-4 mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-12 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2 mb-5 border rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-sm border-blue-200/30"
          >
            <i className="text-sm text-blue-600 fas fa-file-alt"></i>
            <span className="text-sm font-semibold text-blue-700">
              {t("Rasmiy hujjatlar", "Официальные документы")}
            </span>
          </motion.div>
          
          <h1 className="mb-4 text-5xl font-bold text-transparent md:text-6xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text">
            📄 {t('Hujjatlar', 'Документы')}
          </h1>
          
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
            <div className="w-6 h-1 bg-indigo-400 rounded-full"></div>
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
          </div>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            {t('Qonunlar, qarorlar, farmonlar va boshqa rasmiy hujjatlar', 
               'Законы, постановления, указы и другие официальные документы')}
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative group">
            <div className="absolute inset-0 transition duration-500 opacity-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-lg group-hover:opacity-30"></div>
            <div className="relative">
              <i className="absolute text-gray-400 transition duration-300 -translate-y-1/2 fas fa-search left-5 top-1/2 group-focus-within:text-blue-500"></i>
              <input
                type="text"
                placeholder={t('Hujjat qidirish...', 'Поиск документов...')}
                className="w-full py-4 pr-5 transition-all duration-300 bg-white border-2 border-gray-100 shadow-md pl-14 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute text-gray-400 -translate-y-1/2 right-5 top-1/2 hover:text-gray-600"
                >
                  ✕
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.value)}
              className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 overflow-hidden group ${
                selectedCategory === cat.value
                  ? 'text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {selectedCategory === cat.value && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <i className={`${cat.icon} text-sm`}></i>
                <span>{t(cat.label, cat.labelRu)}</span>
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Results Count */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-700 bg-blue-100 rounded-full">
              <i className="text-xs fas fa-search"></i>
              {t('Topildi', 'Найдено')}: {filteredDocs.length} {t('ta hujjat', 'документов')}
            </span>
          </motion.div>
        )}

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center bg-white/50 backdrop-blur-sm rounded-2xl"
          >
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
              <i className="text-4xl text-gray-400 fas fa-search"></i>
            </div>
            <p className="text-lg text-gray-500">{t('Hech qanday hujjat topilmadi', 'Документы не найдены')}</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-600 hover:underline"
            >
              {t('Tozalash', 'Очистить поиск')}
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {filteredDocs.map((doc, idx) => (
              <motion.div
                key={doc.id}
                variants={itemVariants}
                onHoverStart={() => setHoveredDoc(doc.id)}
                onHoverEnd={() => setHoveredDoc(null)}
              >
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  whileHover="hover"
                  className="relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative p-6 transition-all duration-300 bg-white shadow-md rounded-2xl hover:shadow-xl">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <motion.div
                            animate={{ 
                              rotate: hoveredDoc === doc.id ? [0, -5, 5, 0] : 0,
                              scale: hoveredDoc === doc.id ? 1.1 : 1
                            }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-center shadow-md w-14 h-14 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl"
                          >
                            <i className="text-2xl text-white fas fa-file-pdf"></i>
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 transition duration-300 group-hover:text-blue-600">
                              {doc.name}
                            </h3>
                            {doc.nameRu && <p className="text-sm text-gray-500">{doc.nameRu}</p>}
                          </div>
                        </div>
                        
                        {doc.description && (
                          <p className="mb-3 text-gray-600 line-clamp-2">{doc.description}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <i className="text-gray-400 fas fa-calendar-alt"></i> {doc.date}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(doc.category)}`}>
                            {getCategoryLabel(doc.category)}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <i className="text-gray-400 fas fa-database"></i> {doc.fileSize || '1.2 MB'}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <i className="text-gray-400 fas fa-download"></i> {doc.downloadCount || 0} {t('marta', 'раз')}
                          </span>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload(doc)}
                        className="px-6 py-3 bg-gradient-to-r from-[#003580] to-[#0066cc] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                      >
                        <i className="fas fa-download"></i> {t('Yuklab olish', 'Скачать')}
                      </motion.button>
                    </div>
                    
                    {/* Progress bar on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 transition-transform duration-500 origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:scale-x-100 rounded-b-2xl"></div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-6 mt-10 text-center border-t border-gray-200"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-sm bg-white/80 backdrop-blur-sm">
            <i className="text-sm text-blue-600 fas fa-file-alt"></i>
            <span className="text-sm text-gray-600">
              {t('Jami', 'Всего')}: {filteredDocs.length} {t('ta hujjat', 'документов')}
            </span>
            <i className="ml-2 text-sm text-gray-400 fas fa-download"></i>
            <span className="text-sm text-gray-400">
              {t('Jami yuklab olishlar', 'Всего скачиваний')}: {filteredDocs.reduce((sum, doc) => sum + (doc.downloadCount || 0), 0)}
            </span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.05); opacity: 0.4; }
        }
        @keyframes slow-pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-slow-pan {
          animation: slow-pan 60s linear infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}