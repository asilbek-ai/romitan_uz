import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

export default function News() {
  const { t, news } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const filtered = news.filter(item => 
    t(item.title, item.titleRu).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const categories = [
    { value: 'all', label: 'Barchasi', labelRu: 'Все', icon: 'fa-newspaper' },
    { value: 'yangilik', label: 'Yangiliklar', labelRu: 'Новости', icon: 'fa-bell' },
    { value: 'e lon', label: "E'lonlar", labelRu: 'Объявления', icon: 'fa-bullhorn' },
    { value: 'tadbir', label: 'Tadbirlar', labelRu: 'События', icon: 'fa-calendar-alt' }
  ];

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
      scale: 1.03, 
      y: -8,
      transition: { duration: 0.3, type: 'spring', stiffness: 300 }
    }
  };

  return (
    <div className="relative min-h-screen py-20 overflow-hidden pt-18 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background */}
      {/* <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-30 animate-slow-pan"></div>
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-blue-200/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-indigo-200/20 blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute w-48 h-48 rounded-full top-1/3 left-1/4 bg-purple-200/10 blur-3xl animate-float"></div>
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
            <i className="text-sm text-blue-600 fas fa-newspaper"></i>
            <span className="text-sm font-semibold text-blue-700">
              {t("So'nggi yangiliklar", "Последние новости")}
            </span>
          </motion.div>
          
          <h1 className="mb-4 text-5xl font-bold text-transparent md:text-6xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text">
            {t('Yangiliklar', 'Новости')}
          </h1>
          
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
            <div className="w-6 h-1 bg-indigo-400 rounded-full"></div>
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
          </div>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            {t("Romitan tumanidagi eng so'nggi yangiliklar va voqealardan xabardor bo'ling", 
               "Будьте в курсе последних новостей и событий Джондорского района")}
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-xl mx-auto mb-10"
        >
          <div className="relative group">
            <div className="absolute inset-0 transition duration-500 opacity-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-lg group-hover:opacity-30"></div>
            <div className="relative">
              <i className="absolute text-gray-400 transition duration-300 -translate-y-1/2 fas fa-search left-5 top-1/2 group-focus-within:text-blue-500"></i>
              <input
                type="text"
                placeholder={t('Yangilik qidirish...', 'Поиск новостей...')}
                className="w-full py-4 pr-5 transition-all duration-300 bg-white border-2 border-gray-100 shadow-md pl-14 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
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
          className="flex flex-wrap justify-center gap-3 mb-12"
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
              {t('Topildi', 'Найдено')}: {filtered.length} {t('ta yangilik', 'новостей')}
            </span>
          </motion.div>
        )}

        {/* News Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center bg-white/50 backdrop-blur-sm rounded-2xl"
          >
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
              <i className="text-4xl text-gray-400 fas fa-newspaper"></i>
            </div>
            <p className="text-lg text-gray-500">{t('Hech qanday yangilik topilmadi', 'Новости не найдены')}</p>
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
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                onHoverStart={() => setHoveredCard(item.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  <Link
                    to={`/news/${item.id}`}
                    className="relative block overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={item.image} 
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                        alt={t(item.title, item.titleRu)} 
                      />
                      <div className="absolute inset-0 transition duration-500 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100"></div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-xs font-medium text-white rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                          <i className="mr-1 text-xs fas fa-calendar-alt"></i>
                          {item.date}
                        </span>
                      </div>
                      <div className="absolute transition duration-300 opacity-0 bottom-4 right-4 group-hover:opacity-100">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg">
                          <i className="text-sm text-blue-600 fas fa-arrow-right"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                          <i className="text-xs text-blue-500 fas fa-eye"></i>
                        </div>
                        <span className="text-xs text-gray-400">{item.views || 0} {t('ko\'rildi', 'просмотров')}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-800 transition duration-300 line-clamp-2 group-hover:text-blue-600">
                        {t(item.title, item.titleRu)}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.content?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <i className="text-xs text-gray-400 fas fa-clock"></i>
                          <span className="text-xs text-gray-400">{item.date}</span>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-all group-hover:gap-2">
                          {t('Davomi', 'Подробнее')}
                          <i className="text-xs fas fa-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                    
                    <div className="h-1 transition-transform duration-500 origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:scale-x-100"></div>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-sm bg-white/80 backdrop-blur-sm">
            <i className="text-sm text-blue-600 fas fa-newspaper"></i>
            <span className="text-sm text-gray-600">
              {t('Jami', 'Всего')}: {filtered.length} {t('ta yangilik', 'новостей')}
            </span>
            <i className="ml-2 text-sm text-gray-400 fas fa-clock"></i>
            <span className="text-sm text-gray-400">
              {t('So‘nggi yangilanish', 'Последнее обновление')}: {new Date().toLocaleDateString()}
            </span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.05); opacity: 0.4; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.1; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.2; }
          50% { transform: translateY(10px) translateX(-10px); opacity: 0.15; }
          75% { transform: translateY(-10px) translateX(15px); opacity: 0.2; }
        }
        @keyframes slow-pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
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