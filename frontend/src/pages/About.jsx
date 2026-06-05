import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

export default function About() {
  const { t, leadership } = useContext(AppContext);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [countersStarted, setCountersStarted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCountersStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // CountUp komponenti
  const CountUp = ({ end, duration = 2, suffix = "" }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!countersStarted) return;
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }, [end, duration, countersStarted]);
    return <>{count.toLocaleString()}{suffix}</>;
  };

  const stats = [
    { icon: "fa-calendar-alt", value: 1926, suffix: "", label: "Tashkil etilgan", labelRu: "Основан", color: "from-blue-500 to-cyan-500", delay: 0 },
    { icon: "fa-users", value: 154700, suffix: "+", label: "Aholi soni", labelRu: "Население", color: "from-purple-500 to-pink-500", delay: 100 },
    { icon: "fa-map-marker-alt", value: 1200, suffix: " km²", label: "Maydoni", labelRu: "Площадь", color: "from-green-500 to-emerald-500", delay: 200 },
    { icon: "fa-school", value: 45, suffix: "", label: "Maktablar", labelRu: "Школы", color: "from-orange-500 to-red-500", delay: 300 },
    { icon: "fa-hospital", value: 8, suffix: "", label: "Kasalxonalar", labelRu: "Больницы", color: "from-teal-500 to-green-500", delay: 400 },
    { icon: "fa-theater-masks", value: 24, suffix: "", label: "Madaniyat markazlari", labelRu: "Центры культуры", color: "from-yellow-500 to-amber-500", delay: 500 }
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
      scale: 1.05, 
      y: -8,
      transition: { duration: 0.3, type: 'spring', stiffness: 300 }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background */}
      {/* <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-30 animate-slow-pan"></div>
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-blue-200/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-indigo-200/20 blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute w-48 h-48 rounded-full top-1/3 right-1/4 bg-purple-200/10 blur-3xl animate-float"></div>
      </div> */}

      <div className="relative z-10 pb-20 pt-28">
        <div className="px-4 mx-auto max-w-7xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-16 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2 mb-5 border rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-sm border-blue-200/30"
            >
              <i className="text-sm text-blue-600 fas fa-landmark"></i>
              <span className="text-sm font-semibold text-blue-700">
                {t("Jondor tumani", "Джондорский район")}
              </span>
            </motion.div>
            
            <h1 className="mb-4 text-5xl font-bold text-transparent md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text">
              {t('Tuman haqida', 'О районе')}
            </h1>
            
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
              <div className="w-6 h-1 bg-indigo-400 rounded-full"></div>
              <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
            </div>
            
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              {t("Buxoro viloyatining durdonasi - qadimiy va go'zal Jondor tumani bilan tanishing", 
                 "Познакомьтесь с жемчужиной Бухарской области - древним и прекрасным Джондорским районом")}
            </p>
          </motion.div>

          {/* Stats Grid */}
          {/* <motion.div
            ref={statsRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-5 mb-16 md:grid-cols-3 lg:grid-cols-6"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 transition duration-500 opacity-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl group-hover:opacity-30"></div>
                <div className="relative p-5 text-center transition-all duration-300 bg-white shadow-md rounded-2xl hover:shadow-xl">
                  <div className={`w-14 h-14 mx-auto mb-3 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300`}>
                    <i className={`fas ${stat.icon} text-white text-xl`}></i>
                  </div>
                  <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                    {countersStarted ? <CountUp end={stat.value} suffix={stat.suffix} /> : stat.value}{stat.suffix}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{t(stat.label, stat.labelRu)}</div>
                </div>
              </motion.div>
            ))}
          </motion.div> */}

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-16 overflow-hidden border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/20"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative p-8 md:p-10">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
                <div className="relative">
                  <div className="flex items-center justify-center mb-4 shadow-md w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                    <i className="text-2xl text-white fas fa-history"></i>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-800">
                    {t("Tariximiz", "Наша история")}
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p className="leading-relaxed">
                      {t('Jondor tumani — Buxoro viloyatidagi tuman. 1926-yil tashkil etilgan. Maʼmuriy markazi — Jondor shaharchasi.', 
                         'Джондорский район — район Бухарской области. Образован в 1926 году. Административный центр — город Джондор.')}
                    </p>
                    <p className="leading-relaxed">
                      {t('Hududi asosan tekisliklardan iborat boʻlib, aholisi dehqonchilik, chorvachilik va tadbirkorlik bilan shugʻullanadi.', 
                         'Территория в основном равнинная, население занимается земледелием, животноводством и предпринимательством.')}
                    </p>
                    <p className="leading-relaxed">
                      {t('Jondor tumani qadimiy Buxoro vohasining bir qismi hisoblanadi. Hududda milliy urf-odatlar, hunarmandchilik va anʼanaviy o\'zbek madaniyati saqlanib qolgan.', 
                         'Джондорский район является частью древней Бухарской оазиса. В районе сохранились национальные традиции, ремесла и традиционная узбекская культура.')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative p-8 md:p-10 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
                <div className="relative">
                  <div className="flex items-center justify-center mb-4 shadow-md w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                    <i className="text-2xl text-white fas fa-chart-line"></i>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-800">
                    {t("Rivojlanish", "Развитие")}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 transition-all duration-300 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white">
                      <div className="flex items-center justify-center w-6 h-6 mt-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                        <i className="text-xs text-white fas fa-check"></i>
                      </div>
                      <p className="text-gray-600">{t("Qishloq xoʻjaligi rivojlangan", "Развитое сельское хозяйство")}</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 transition-all duration-300 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white">
                      <div className="flex items-center justify-center w-6 h-6 mt-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                        <i className="text-xs text-white fas fa-check"></i>
                      </div>
                      <p className="text-gray-600">{t("Paxta va gʻalla yetishtiriladi", "Выращивается хлопок и зерно")}</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 transition-all duration-300 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white">
                      <div className="flex items-center justify-center w-6 h-6 mt-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                        <i className="text-xs text-white fas fa-check"></i>
                      </div>
                      <p className="text-gray-600">{t("Bogʻdorchilik va chorvachilik bilan shugʻullaniladi", "Занимаются садоводством и животноводством")}</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 transition-all duration-300 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white">
                      <div className="flex items-center justify-center w-6 h-6 mt-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                        <i className="text-xs text-white fas fa-check"></i>
                      </div>
                      <p className="text-gray-600">{t("Yangi uy-joy va infratuzilma loyihalari amalga oshirilmoqda", "Реализуются новые жилищные и инфраструктурные проекты")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leadership Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16"
          >
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
                <i className="text-sm text-blue-600 fas fa-users"></i>
                <span className="text-sm font-semibold text-blue-700">
                  {t("Bizning jamoa", "Наша команда")}
                </span>
              </div>
              <h2 className="mb-3 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text">
                {t('Tuman rahbariyati', 'Руководство района')}
              </h2>
              <div className="flex justify-center gap-2 mb-4">
                <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
                <div className="w-6 h-1 bg-indigo-400 rounded-full"></div>
                <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
              </div>
              <p className="max-w-2xl mx-auto text-gray-500">
                {t("Rahbariyatimiz sizning manfaatlaringiz va farovonligingiz yo'lida mehnat qiladi", 
                   "Наше руководство работает на благо ваших интересов и благополучия")}
              </p>
            </div>

            {!leadership || leadership.length === 0 ? (
              <div className="py-20 text-center bg-white/60 backdrop-blur-sm rounded-2xl">
                <i className="mb-4 text-6xl text-gray-300 fas fa-users"></i>
                <p className="text-gray-500">{t("Hech qanday rahbar yo'q", "Нет руководителей")}</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {leadership.map((leader, index) => (
                  <motion.div
                    key={leader.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onHoverStart={() => setHoveredCard(leader.id)}
                    onHoverEnd={() => setHoveredCard(null)}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedLeader(leader);
                      setShowModal(true);
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 transition duration-500 opacity-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl group-hover:opacity-30"></div>
                      <div className="relative overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl">
                        <div className="relative overflow-hidden h-72">
                          {leader.image ? (
                            <>
                              <img
                                src={leader.image}
                                alt={leader.name}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 transition duration-500 opacity-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-100"></div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100">
                              <i className="text-blue-300 fas fa-user-tie text-8xl"></i>
                            </div>
                          )}
                          
                          <div className="absolute top-4 right-4">
                            <div className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                              {index === 0 ? t("Rais", "Председатель") : t("A'zo", "Член")}
                            </div>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-5 text-white transition-transform duration-500 transform translate-y-full group-hover:translate-y-0 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="space-y-2">
                              {leader.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <i className="fas fa-phone-alt"></i>
                                  <span>{leader.phone}</span>
                                </div>
                              )}
                              {leader.email && (
                                <div className="flex items-center gap-2 text-sm">
                                  <i className="fas fa-envelope"></i>
                                  <span className="truncate">{leader.email}</span>
                                </div>
                              )}
                              <div className="pt-2 text-xs opacity-80">
                                <i className="fas fa-mouse-pointer"></i> {t("Batafsil uchun bosing", "Нажмите для деталей")}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5 text-center">
                          <h3 className="mb-1 text-xl font-bold text-gray-800 transition group-hover:text-blue-600">
                            {leader.name}
                          </h3>
                          <p className="text-sm font-medium text-blue-600">
                            {leader.position}
                          </p>
                          <div className="flex justify-center gap-3 mt-4">
                            <div className="flex items-center justify-center w-8 h-8 transition-all duration-300 bg-gray-100 rounded-full cursor-pointer hover:bg-blue-600 hover:scale-110">
                              <i className="text-xs text-gray-600 fas fa-phone-alt hover:text-white"></i>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 transition-all duration-300 bg-gray-100 rounded-full cursor-pointer hover:bg-blue-600 hover:scale-110">
                              <i className="text-xs text-gray-600 fas fa-envelope hover:text-white"></i>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 transition-all duration-300 bg-gray-100 rounded-full cursor-pointer hover:bg-blue-600 hover:scale-110">
                              <i className="text-xs text-gray-600 fab fa-telegram hover:text-white"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative mt-16 overflow-hidden shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="relative p-10 text-center text-white">
              <i className="mb-4 text-5xl fas fa-handshake"></i>
              <h3 className="mb-3 text-2xl font-bold md:text-3xl">
                {t("Biz bilan hamkorlik qiling", "Сотрудничайте с нами")}
              </h3>
              <p className="max-w-2xl mx-auto mb-6 text-white/80">
                {t("Jondor tumani sizning investitsiyalaringiz va loyihalaringizni kutmoqda", 
                   "Джондорский район ждет ваших инвестиций и проектов")}
              </p>
              <button className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-blue-600 transition-all duration-300 bg-white rounded-full hover:shadow-xl hover:scale-105">
                {t("Bog'lanish", "Связаться")}
                <i className="text-sm fas fa-arrow-right"></i>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedLeader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative p-6 text-center text-white bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="w-24 h-24 mx-auto mb-3 overflow-hidden bg-white border-4 rounded-full border-white/20">
                  {selectedLeader.image ? (
                    <img src={selectedLeader.image} alt={selectedLeader.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <i className="text-4xl text-blue-400 fas fa-user-tie"></i>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold">{selectedLeader.name}</h3>
                <p className="mt-1 text-sm text-white/80">{selectedLeader.position}</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute flex items-center justify-center w-8 h-8 transition rounded-full top-4 right-4 bg-white/20 hover:bg-white/30"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {selectedLeader.phone && (
                  <div className="flex items-center gap-3 p-3 transition rounded-xl bg-gray-50 hover:bg-blue-50">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                      <i className="text-green-600 fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t("Telefon", "Телефон")}</p>
                      <a href={`tel:${selectedLeader.phone}`} className="font-medium text-gray-800 hover:text-blue-600">
                        {selectedLeader.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedLeader.email && (
                  <div className="flex items-center gap-3 p-3 transition rounded-xl bg-gray-50 hover:bg-blue-50">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <i className="text-blue-600 fas fa-envelope"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t("Email", "Электронная почта")}</p>
                      <a href={`mailto:${selectedLeader.email}`} className="font-medium text-gray-800 hover:text-blue-600">
                        {selectedLeader.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedLeader.address && (
                  <div className="flex items-center gap-3 p-3 transition rounded-xl bg-gray-50 hover:bg-blue-50">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                      <i className="text-purple-600 fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t("Manzil", "Адрес")}</p>
                      <p className="font-medium text-gray-800">{selectedLeader.address}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-5 border-t bg-gray-50">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg"
                >
                  {t("Yopish", "Закрыть")}
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