import React, { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../App';
import CountUp from 'react-countup';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartLine, Users, School, Hospital, Building, Briefcase, 
  TrendingUp, Activity, BarChart3, PieChart, LineChart, 
  DollarSign, Globe, MapPin, Calendar, Clock, Award,
  Target, Zap, Shield, Heart, Star, Home, Car, Wifi, Droplet, Flame,
  Baby, TreePine, Factory, Smartphone, BookOpen, Trophy, X,
  Eye, Share2, Download, Printer, Copy, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

// Icon nomiga mos komponentni qaytaruvchi funksiya
const getIconComponent = (iconName) => {
  const icons = {
    ChartLine, Users, School, Hospital, Building, Briefcase,
    TrendingUp, Activity, BarChart3, PieChart, LineChart,
    DollarSign, Globe, MapPin, Calendar, Clock, Award,
    Target, Zap, Shield, Heart, Star, Home, Car, Wifi, Droplet, Flame,
    Baby, TreePine, Factory, Smartphone, BookOpen, Trophy
  };
  const Icon = icons[iconName] || ChartLine;
  return <Icon size={28} />;
};

// Rang bo'yicha gradient olish
const getGradientColor = (color) => {
  const gradients = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    red: 'from-red-500 to-orange-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-yellow-500',
    teal: 'from-teal-500 to-cyan-500',
    indigo: 'from-indigo-500 to-purple-500',
    pink: 'from-pink-500 to-rose-500'
  };
  return gradients[color] || 'from-blue-500 to-cyan-500';
};

export default function Statistics() {
  const { t, statistics } = useContext(AppContext);
  const [countersStarted, setCountersStarted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const statsRef = useRef(null);

  // Body scroll-ni blokirovka qilish
  useEffect(() => {
    if (isModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCountersStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const statsList = Array.isArray(statistics) ? statistics : [];

  // Statistikaga oid batafsil ma'lumotlar - faqat admin kiritgan ma'lumotlar
  const getStatDetails = (stat) => {
    // Agar admin yillik ma'lumot kiritgan bo'lsa
    if (stat.yearlyData && stat.yearlyData.length > 0) {
      const chartData = stat.yearlyData.map(item => item.value);
      const chartLabels = stat.yearlyData.map(item => item.year);
      const firstValue = chartData[0];
      const lastValue = chartData[chartData.length - 1];
      const growth = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
      
      return {
        description: stat.description || `${stat.label} bo'yicha batafsil ma'lumot.`,
        chartData: chartData,
        chartLabels: chartLabels,
        growth: `+${growth}%`,
        rank: stat.rank || 'Maʼlumot mavjud emas'
      };
    }
    
    // Agar faqat joriy qiymat bo'lsa
    return {
      description: stat.description || `${stat.label} bo'yicha batafsil ma'lumot. Hozirgi ko'rsatkich: ${stat.prefix || ''}${stat.value?.toLocaleString() || 0}${stat.suffix || ''}.`,
      chartData: [stat.value || 0],
      chartLabels: [new Date().getFullYear().toString()],
      growth: 'Maʼlumot mavjud emas',
      rank: 'Maʼlumot mavjud emas'
    };
  };

  // Yuklab olish funksiyasi
  const handleDownload = () => {
    try {
      const details = getStatDetails(selectedStat);
      const content = `
📊 ${selectedStat.label} statistikasi
📅 Sana: ${new Date().toLocaleDateString()}

📈 Joriy ko'rsatkich: ${selectedStat.prefix || ''}${selectedStat.value?.toLocaleString() || 0}${selectedStat.suffix || ''}
📈 O'sish: ${details.growth}
🏆 Viloyatdagi o'rni: ${details.rank}

📝 Tavsif: ${details.description}

${details.chartLabels.length > 1 ? '📊 Yillar kesimida:\n' + details.chartLabels.map((label, i) => `${label}: ${details.chartData[i].toLocaleString()}`).join('\n') : ''}

© Jondor tumani rasmiy portali
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedStat.label}_statistikasi.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Maʼlumotlar yuklab olindi!');
    } catch (error) {
      toast.error('Yuklab olishda xatolik yuz berdi');
    }
  };

  // Chop etish funksiyasi
  const handlePrint = () => {
    const details = getStatDetails(selectedStat);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${selectedStat.label} - Statistik ma'lumotlar</title>
        <style>
          body { font-family: 'Arial', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
          .title { font-size: 28px; font-weight: bold; color: #1e3a5f; }
          .value { font-size: 48px; font-weight: bold; color: #3b82f6; text-align: center; margin: 20px 0; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .info-card { background: #f3f4f6; padding: 15px; border-radius: 10px; text-align: center; }
          .description { background: #eef2ff; padding: 20px; border-radius: 10px; margin: 20px 0; line-height: 1.6; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header"><div class="title">📊 ${selectedStat.label}</div></div>
        <div class="value">${selectedStat.prefix || ''}${selectedStat.value?.toLocaleString() || 0}${selectedStat.suffix || ''}</div>
        <div class="info-grid">
          <div class="info-card">📈 O'sish: ${details.growth}</div>
          <div class="info-card">🏆 Viloyatdagi o'rni: ${details.rank}</div>
        </div>
        <div class="description">${details.description}</div>
        <div class="footer">© Jondor tumani rasmiy portali | ${new Date().toLocaleDateString()}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    toast.success('Chop etish oynasi ochildi');
  };

  // Ulashish funksiyasi
  const handleShare = async () => {
    const details = getStatDetails(selectedStat);
    const shareData = {
      title: `${selectedStat.label} - Jondor tumani statistikasi`,
      text: `${selectedStat.label}: ${selectedStat.prefix || ''}${selectedStat.value?.toLocaleString() || 0}${selectedStat.suffix || ''}\nO'sish: ${details.growth}\n${details.description}`,
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Ulashildi!');
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        toast.success('Link nusxalandi!');
      }
    } catch (error) {
      toast.error('Ulashishda xatolik yuz berdi');
    }
  };

  const openModal = (stat) => {
    setSelectedStat(stat);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen py-20 overflow-hidden pt-28 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background 3D */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-30 animate-slow-pan"></div>
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-blue-200/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-indigo-200/20 blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-200/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50, rotateX: -30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="mb-12 text-center perspective-1000"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 0.95, 1] }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
            className="inline-block p-4 mb-4 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl"
          >
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="mb-4 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text">
            {t('Statistik ma\'lumotlar', 'Статистические данные')}
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            {t('Tuman rivojlanishining asosiy ko\'rsatkichlari', 'Основные показатели развития района')}
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
            <div className="w-6 h-1 bg-indigo-400 rounded-full"></div>
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <div ref={statsRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsList.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1, type: 'spring', stiffness: 100 }}
              onHoverStart={() => setHoveredCard(stat.id)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative cursor-pointer group"
              onClick={() => openModal(stat)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative p-6 text-center transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl">
                <motion.div
                  animate={{
                    rotateY: hoveredCard === stat.id ? [0, 360] : 0,
                    scale: hoveredCard === stat.id ? 1.1 : 1
                  }}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${getGradientColor(stat.color)} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl`}
                >
                  {getIconComponent(stat.icon)}
                </motion.div>

                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05, type: 'spring', stiffness: 200 }}
                  className="mb-1 text-3xl font-bold text-gray-800 md:text-4xl"
                >
                  {stat.prefix || ''}
                  {countersStarted && <CountUp end={stat.value || 0} duration={2.5} />}
                  {stat.suffix || ''}
                </motion.div>

                <div className="text-sm font-medium text-gray-600">{t(stat.label, stat.labelRu)}</div>

                <motion.div
                  className={`h-1 mt-4 rounded-full bg-gradient-to-r ${getGradientColor(stat.color)}`}
                  initial={{ width: "0%", opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05, duration: 0.8 }}
                />
                
                <div className="absolute transition duration-300 opacity-0 bottom-2 right-2 group-hover:opacity-100">
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex justify-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 rounded-full bg-blue-50">
            <TrendingUp className="w-4 h-4" />
            <span>Ma'lumotlar {new Date().getFullYear()}-yil uchun</span>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedStat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="overflow-hidden bg-white rounded-2xl shadow-2xl">
                
                {/* Modal Header */}
                <div className={`relative p-5 text-white bg-gradient-to-r ${getGradientColor(selectedStat.color)}`}>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute text-white transition-all rounded-full top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl">
                      {getIconComponent(selectedStat.icon)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedStat.label}</h3>
                      <p className="text-sm text-white/80">{selectedStat.labelRu}</p>
                    </div>
                  </div>
                </div>
                
                {/* Modal Body - Scrollable */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  
                  {/* Current Value */}
                  <div className="mb-6 text-center">
                    <div className="text-5xl font-bold text-gray-800">
                      {selectedStat.prefix || ''}{selectedStat.value?.toLocaleString() || 0}{selectedStat.suffix || ''}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      <i className="mr-1 fas fa-chart-line"></i> Joriy ko'rsatkich
                    </p>
                  </div>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 text-center bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">{getStatDetails(selectedStat).growth}</div>
                      <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500">
                        <i className="fas fa-arrow-up text-green-500"></i>
                        <span>O'sish</span>
                      </div>
                    </div>
                    
                    <div className="p-4 text-center bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">{getStatDetails(selectedStat).rank}</div>
                      <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500">
                        <i className="fas fa-trophy text-yellow-500"></i>
                        <span>Viloyatda</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4 mb-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <i className="mt-1 text-blue-500 fas fa-info-circle"></i>
                      <p className="leading-relaxed text-gray-700">
                        {getStatDetails(selectedStat).description}
                      </p>
                    </div>
                  </div>

                  {/* Chart Section - Faqat admin kiritgan yillik ma'lumotlar bo'lsa ko'rsatiladi */}
                  {getStatDetails(selectedStat).chartLabels.length > 1 && (
                    <div className="mb-6">
                      <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
                        <i className="text-blue-500 fas fa-chart-line"></i>
                        <span>Yillar kesimida o'zgarish</span>
                      </h4>
                      
                      <div className="space-y-4">
                        {getStatDetails(selectedStat).chartLabels.map((label, idx) => {
                          const maxVal = Math.max(...getStatDetails(selectedStat).chartData);
                          const percent = (getStatDetails(selectedStat).chartData[idx] / maxVal) * 100;
                          const currentYear = new Date().getFullYear();
                          const isCurrentYear = label == currentYear;
                          
                          return (
                            <div key={idx} className="group">
                              <div className="flex justify-between mb-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${isCurrentYear ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                  <span className={`font-medium ${isCurrentYear ? 'text-blue-600' : 'text-gray-600'}`}>
                                    {label}
                                  </span>
                                  {isCurrentYear && (
                                    <span className="px-1.5 py-0.5 text-[9px] font-bold text-white bg-blue-500 rounded-full">
                                      Hozirgi
                                    </span>
                                  )}
                                </div>
                                <span className="font-bold text-gray-800">
                                  {getStatDetails(selectedStat).chartData[idx].toLocaleString()}
                                </span>
                              </div>
                              <div className="w-full h-2 overflow-hidden bg-gray-100 rounded-full">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  transition={{ duration: 1, delay: idx * 0.1 }}
                                  className={`h-full rounded-full bg-gradient-to-r ${getGradientColor(selectedStat.color)}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Yearly Summary - Faqat admin kiritgan yillik ma'lumotlar bo'lsa ko'rsatiladi */}
                  {getStatDetails(selectedStat).chartLabels.length > 1 && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h5 className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                        <i className="fas fa-calendar-alt text-blue-500"></i>
                        <span>Yillik taqsimot</span>
                      </h5>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {getStatDetails(selectedStat).chartLabels.map((label, idx) => (
                          <div key={idx} className="p-2 text-center bg-white rounded-lg shadow-sm">
                            <div className="text-xs font-bold text-blue-600">{label}</div>
                            <div className="text-[10px] font-semibold text-gray-700">
                              {getStatDetails(selectedStat).chartData[idx].toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Modal Footer */}
                <div className="flex flex-wrap gap-3 p-4 border-t bg-gray-50">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-2.5 text-sm text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Yuklash
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 py-2.5 text-sm text-white bg-green-600 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Ulashish
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-2.5 text-sm text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" /> Chop etish
                  </button>
                </div>
                
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
        @keyframes slow-pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-slow-pan {
          animation: slow-pan 60s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}