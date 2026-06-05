// src/components/MobileMenu.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const menuItems = [
  { path: "/", label: "Bosh sahifa", labelRu: "Главная", icon: "fa-home" },
  { path: "/about", label: "Tuman haqida", labelRu: "О районе", icon: "fa-info-circle" },
  { path: "/services", label: "Xizmatlar", labelRu: "Услуги", icon: "fa-th-large" },
  { path: "/news", label: "Yangiliklar", labelRu: "Новости", icon: "fa-newspaper" },
  { path: "/documents", label: "Hujjatlar", labelRu: "Документы", icon: "fa-file-alt" },
  { path: "/media", label: "Media", labelRu: "Медиа", icon: "fa-photo-video" },
  { path: "/tourism", label: "Turizm", labelRu: "Туризм", icon: "fa-map-marked-alt" },
  { path: "/contact", label: "Aloqa", labelRu: "Контакты", icon: "fa-envelope" },
  { path: "/statistics", label: "Statistika", labelRu: "Статистика", icon: "fa-chart-line" },
];

export default function MobileMenu({ isOpen, onClose, lang, t }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Menu animation variants
  const menuVariants = {
    hidden: { 
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        when: "afterChildren"
      }
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 200,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-gradient-to-br from-gray-900 via-primary/95 to-gray-900 shadow-2xl z-[101] overflow-y-auto"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-5 shadow-lg bg-gradient-to-r from-primary to-primaryLight">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl">
                  <i className="text-xl text-white fas fa-landmark"></i>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Jondor tumani</div>
                  <div className="text-xs text-white/70">{t("Rasmiy portal", "Официальный портал")}</div>
                </div>
              </motion.div>
              
              <motion.button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 transition-all bg-white/20 rounded-xl hover:bg-white/30"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="text-xl text-white fas fa-times"></i>
              </motion.button>
            </div>

            {/* Menu Items */}
            <div className="p-5 space-y-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  variants={itemVariants}
                  custom={index}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="block"
                  >
                    <motion.div
                      className="flex items-center gap-4 p-4 transition-all duration-300 border rounded-xl bg-white/5 backdrop-blur-sm border-white/10 hover:border-primary/50"
                      whileHover={{ 
                        x: 10,
                        backgroundColor: "rgba(0, 255, 136, 0.1)",
                        borderColor: "#00ff88"
                      }}
                      animate={{
                        x: hoveredIndex === index ? 10 : 0,
                      }}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20">
                        <i className={`fas ${item.icon} text-primary text-xl`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-white">
                          {lang === 'uz' ? item.label : item.labelRu}
                        </div>
                        <div className="text-xs text-white/50">
                          {lang === 'uz' ? "Menyu" : "Меню"}
                        </div>
                      </div>
                      <motion.div
                        animate={{ x: hoveredIndex === index ? 5 : 0 }}
                        className="text-primary/50"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Admin Button */}
            <motion.div
              variants={itemVariants}
              className="px-5 pb-5"
            >
              <Link to="/admin" onClick={onClose}>
                <motion.div
                  className="flex items-center gap-4 p-4 border rounded-xl bg-gradient-to-r from-primary/30 to-primary/20 border-primary/30"
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
                  <i className="fas fa-arrow-right text-primary"></i>
                </motion.div>
              </Link>
            </motion.div>

            {/* Footer Info */}
            <motion.div
              variants={itemVariants}
              className="px-5 pt-4 pb-8"
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
                      transition={{ delay: 0.5 + i * 0.05 }}
                    >
                      <i className={`fab fa-${social} text-white text-sm`}></i>
                    </motion.a>
                  ))}
                </div>
                <div className="text-xs text-center text-white/40">
                  © 2025 Jondor tumani
                </div>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute w-40 h-40 rounded-full top-1/4 -left-20 bg-primary/20 blur-3xl" />
            <div className="absolute w-40 h-40 rounded-full bottom-1/4 -right-20 bg-cyan-500/20 blur-3xl" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}