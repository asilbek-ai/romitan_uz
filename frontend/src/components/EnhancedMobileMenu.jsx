// src/components/EnhancedMobileMenu.jsx
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EnhancedMobileMenu({ isOpen, onClose, lang, t }) {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Spring animation for smooth menu opening
  const menuX = useSpring(0, { stiffness: 300, damping: 30 });
  const menuOpacity = useSpring(0, { stiffness: 300, damping: 30 });
  
  useEffect(() => {
    if (isOpen) {
      menuX.set(0);
      menuOpacity.set(1);
      document.body.style.overflow = "hidden";
    } else {
      menuX.set("100%");
      menuOpacity.set(0);
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, menuX, menuOpacity]);

  const menuItems = [
    { path: "/", label: "Bosh sahifa", labelRu: "Главная", icon: "fa-home", color: "#00ff88" },
    { path: "/about", label: "Tuman haqida", labelRu: "О районе", icon: "fa-info-circle", color: "#3b82f6" },
    { path: "/services", label: "Xizmatlar", labelRu: "Услуги", icon: "fa-th-large", color: "#f59e0b" },
    { path: "/news", label: "Yangiliklar", labelRu: "Новости", icon: "fa-newspaper", color: "#ef4444" },
    { path: "/documents", label: "Hujjatlar", labelRu: "Документы", icon: "fa-file-alt", color: "#8b5cf6" },
    { path: "/media", label: "Media", labelRu: "Медиа", icon: "fa-photo-video", color: "#06b6d4" },
    { path: "/tourism", label: "Turizm", labelRu: "Туризм", icon: "fa-map-marked-alt", color: "#10b981" },
    { path: "/contact", label: "Aloqa", labelRu: "Контакты", icon: "fa-envelope", color: "#ec4899" },
    { path: "/statistics", label: "Statistika", labelRu: "Статистика", icon: "fa-chart-line", color: "#6366f1" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Menu Panel with spring animation */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl z-[101] overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header with animation */}
            <div className="sticky top-0 p-5 bg-gradient-to-r from-primary/95 to-primaryLight/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl">
                    <i className="text-xl text-white fas fa-landmark"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Jondor tumani</div>
                    <div className="text-xs text-white/60">{t("Rasmiy portal", "Официальный портал")}</div>
                  </div>
                </motion.div>
                
                <motion.button
                  onClick={onClose}
                  className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 90, backgroundColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <i className="text-xl text-white fas fa-times"></i>
                </motion.button>
              </div>
            </div>

            {/* Menu Items with stagger animation */}
            <div className="p-5 space-y-3">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.03, type: "spring", stiffness: 200 }}
                  onHoverStart={() => setActiveIndex(index)}
                  onHoverEnd={() => setActiveIndex(null)}
                >
                  <Link to={item.path} onClick={onClose}>
                    <motion.div
                      className="relative flex items-center gap-4 p-4 overflow-hidden cursor-pointer rounded-xl"
                      style={{
                        background: activeIndex === index 
                          ? `linear-gradient(135deg, ${item.color}20, transparent)`
                          : "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${activeIndex === index ? item.color : "rgba(255,255,255,0.1)"}`,
                      }}
                      whileHover={{ x: 8 }}
                    >
                      {/* Ripple effect on click */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      <div 
                        className="flex items-center justify-center w-12 h-12 rounded-xl"
                        style={{ background: `${item.color}20` }}
                      >
                        <i className={`fas ${item.icon} text-xl`} style={{ color: item.color }}></i>
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-base font-semibold text-white">
                          {lang === 'uz' ? item.label : item.labelRu}
                        </div>
                        <div className="text-xs text-white/40">
                          {lang === 'uz' ? "Menyu" : "Меню"}
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ x: activeIndex === index ? 5 : 0 }}
                        style={{ color: item.color }}
                      >
                        <i className="text-sm fas fa-chevron-right"></i>
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Admin Special Button */}
            <motion.div
              className="px-5 pb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/admin" onClick={onClose}>
                <motion.div
                  className="flex items-center gap-4 p-4 border rounded-xl bg-gradient-to-r from-primary/30 to-primary/20 border-primary/40"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)" }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
                    <i className="text-xl text-white fas fa-user-shield"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold text-primary">
                      {t("Admin panel", "Панель администратора")}
                    </div>
                    <div className="text-xs text-white/50">
                      {t("Tizimga kirish", "Вход в систему")}
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <i className="fas fa-arrow-right text-primary"></i>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="px-5 pt-4 pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-center gap-4 mb-4">
                  {['telegram', 'facebook', 'instagram', 'youtube'].map((social, i) => (
                    <motion.a
                      key={social}
                      href="#"
                      className="flex items-center justify-center w-10 h-10 transition-all rounded-full bg-white/10 hover:bg-primary/30"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                    >
                      <i className={`fab fa-${social} text-white text-sm`}></i>
                    </motion.a>
                  ))}
                </div>
                <div className="text-xs text-center text-white/30">
                  © 2025 Jondor tumani {t("hokimligi", "хокимият")}
                </div>
              </div>
            </motion.div>

            {/* Animated decorative elements */}
            <div className="absolute w-40 h-40 rounded-full top-1/3 -left-20 bg-primary/20 blur-3xl animate-pulse" />
            <div className="absolute w-40 h-40 delay-1000 rounded-full bottom-1/3 -right-20 bg-cyan-500/20 blur-3xl animate-pulse" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}