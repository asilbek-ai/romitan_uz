import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, FileText, Building, Users, Landmark, Briefcase, 
  Shield, Truck, Wifi, Droplet, Flame, Zap, School, Hospital, 
  ShoppingBag, Home, Car, Phone, Mail, MapPin, Calendar, Clock,
  User, Heart, Star, Award, Coffee, Camera, Video, Music, Book, 
  PenTool, Database, Server, Headphones, Key, Lock, Map, Globe, 
  MessageCircle, Bell, AlertCircle, CheckCircle, Search,
  Sparkles, TrendingUp, ArrowRight, X, Calendar as CalendarIcon,
  Phone as PhoneIcon, Mail as MailIcon, MapPin as MapPinIcon
} from 'lucide-react';

const getIconComponent = (iconName) => {
  const icons = {
    Settings, FileText, Building, Users, Landmark, Briefcase,
    Shield, Truck, Wifi, Droplet, Flame, Zap, School, Hospital,
    ShoppingBag, Home, Car, Phone, Mail, MapPin, Calendar, Clock,
    User, Heart, Star, Award, Coffee, Camera, Video, Music, Book,
    PenTool, Database, Server, Headphones, Key, Lock, Map, Globe,
    MessageCircle, Bell, AlertCircle, CheckCircle
  };
  const Icon = icons[iconName] || Settings;
  return <Icon size={24} />;
};

export default function Services() {
  const { t, services } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const servicesList = Array.isArray(services) ? services : [];

  const categories = [
    { value: 'all', label: 'Barchasi', labelRu: 'Все', icon: 'th-large', color: 'from-blue-500 to-blue-600' },
    { value: 'hujjat', label: 'Hujjatlar', labelRu: 'Документы', icon: 'file-alt', color: 'from-emerald-500 to-emerald-600' },
    { value: 'tadbirkorlik', label: 'Tadbirkorlik', labelRu: 'Бизнес', icon: 'briefcase', color: 'from-purple-500 to-purple-600' },
    { value: 'ijtimoiy', label: 'Ijtimoiy', labelRu: 'Социальный', icon: 'hands-helping', color: 'from-pink-500 to-pink-600' },
    { value: 'qurilish', label: 'Qurilish', labelRu: 'Строительство', icon: 'hard-hat', color: 'from-orange-500 to-orange-600' },
    { value: 'yer', label: 'Yer va mulk', labelRu: 'Земля и имущество', icon: 'landmark', color: 'from-teal-500 to-teal-600' }
  ];

  const filteredServices = servicesList.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (service.nameRu && service.nameRu.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
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
      y: -8,
      transition: { duration: 0.3, type: 'spring', stiffness: 300 }
    }
  };

  return (
    <div className="min-h-screen py-20 overflow-hidden pt-18">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div> */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-30 animate-slow-pan"></div> */}
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-blue-200/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-indigo-200/20 blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute w-48 h-48 rounded-full top-1/3 right-1/4 bg-purple-200/10 blur-3xl animate-float"></div>
      </div>

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
            className="inline-block p-4 mb-4 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="mb-4 text-4xl font-bold text-transparent md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text">
            {t('Davlat xizmatlari', 'Государственные услуги')}
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            {t('Sizga kerakli davlat xizmatini tez va oson toping', 'Найдите нужную государственную услугу быстро и легко')}
          </p>
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
            <div className="w-6 h-1 bg-indigo-400 rounded-full"></div>
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
          </div>
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
              <Search className="absolute w-5 h-5 text-gray-400 transition duration-300 -translate-y-1/2 left-5 top-1/2 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder={t('Xizmat qidirish...', 'Поиск услуг...')}
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
                  className={`absolute inset-0 bg-gradient-to-r ${cat.color}`}
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <i className={`fas fa-${cat.icon} text-sm`}></i>
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
              <Search className="w-4 h-4" />
              {t('Topildi', 'Найдено')}: {filteredServices.length} {t('ta xizmat', 'услуг')}
            </span>
          </motion.div>
        )}

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center bg-white/50 backdrop-blur-sm rounded-2xl"
          >
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-lg text-gray-500">{t('Hech qanday xizmat topilmadi', 'Услуги не найдены')}</p>
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
            {filteredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                custom={idx}
                onHoverStart={() => setHoveredCard(service.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  whileHover="hover"
                  onClick={() => openModal(service)}
                  className="cursor-pointer group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  
                  <div className="relative block overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl">
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 transition duration-500 opacity-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 group-hover:opacity-100"></div>
                      <div className="p-6 pb-0">
                        <div className="flex items-start justify-between">
                          <motion.div
                            animate={{ 
                              rotate: hoveredCard === service.id ? [0, -10, 10, -5, 5, 0] : 0,
                              scale: hoveredCard === service.id ? 1.1 : 1
                            }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center justify-center w-16 h-16 transition-all duration-300 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl group-hover:shadow-xl"
                          >
                            <div className="text-white">
                              {getIconComponent(service.icon)}
                            </div>
                          </motion.div>
                          <motion.div
                            animate={{ x: hoveredCard === service.id ? 5 : 0 }}
                            className="text-blue-600 transition duration-300 opacity-0 group-hover:opacity-100"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-xl font-bold text-gray-800 transition duration-300 group-hover:text-blue-600">
                            {service.name}
                          </h3>
                          {service.nameRu && (
                            <p className="mt-1 text-sm text-gray-500">{service.nameRu}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-4">
                      <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2">
                        {service.description || "Batafsil ma'lumot olish uchun bosing"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                          <Building className="w-3 h-3" />
                          <span>{service.department || "Jondor tuman hokimligi"}</span>
                        </div>
                        <motion.div
                          animate={{ x: hoveredCard === service.id ? 3 : 0 }}
                          className="flex items-center gap-1 text-sm font-medium text-blue-600"
                        >
                          {t('Batafsil', 'Подробнее')}
                          <ArrowRight className="w-3 h-3" />
                        </motion.div>
                      </div>
                    </div>

                    <div className="h-1 transition-transform duration-500 origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:scale-x-100"></div>
                  </div>
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
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">
              {t('Jami', 'Всего')}: {filteredServices.length} {t('ta xizmat', 'услуг')}
            </span>
            <Clock className="w-4 h-4 ml-2 text-gray-400" />
            <span className="text-sm text-gray-400">
              {t('So‘nggi yangilanish', 'Последнее обновление')}: {new Date().toLocaleDateString()}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl backdrop-blur-sm">
                    {getIconComponent(selectedService.icon)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedService.name}</h2>
                    {selectedService.nameRu && (
                      <p className="mt-1 text-sm text-white/80">{selectedService.nameRu}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute flex items-center justify-center w-8 h-8 transition rounded-lg top-4 right-4 bg-white/20 hover:bg-white/30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-800">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Xizmat haqida
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    {selectedService.description || "Bu xizmat haqida batafsil ma'lumot mavjud emas."}
                  </p>
                </div>

                {/* Department */}
                <div className="p-4 mb-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mas'ul tashkilot</p>
                      <p className="font-medium text-gray-800">{selectedService.department || "Jondor tuman hokimligi"}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info Grid */}
                <div className="grid gap-4 mb-6 md:grid-cols-2">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ish vaqti</p>
                        <p className="font-medium text-gray-800">09:00 - 18:00</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Qabul kunlari</p>
                        <p className="font-medium text-gray-800">Dushanba - Juma</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="pt-6 border-t">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
                    <PhoneIcon className="w-5 h-5 text-blue-600" />
                    Bog'lanish ma'lumotlari
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <PhoneIcon className="w-4 h-4" />
                      <span>+998 65 582-18-53</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MailIcon className="w-4 h-4" />
                      <span>info@jondor.uz</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span>Jondor tumani, M. Tarobiy ko'chasi, 26</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t bg-gray-50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg"
                >
                  Yopish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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