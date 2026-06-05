import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";

export default function Hero() {
  const { t } = useContext(AppContext);

  return (
    <section className="relative flex items-center justify-center min-h-screen pt-20 overflow-hidden">
      {/* Background Video/Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-dark to-primaryDark/50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accentBlue/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 mb-6 font-mono text-sm rounded-full bg-accent/20 text-accent">
            {t("JONDOR TUMANI RASMIY PORTALI", "ОФИЦИАЛЬНЫЙ ПОРТАЛ ДЖОНДОРСКОГО РАЙОНА")}
          </span>
        </motion.div>

        <motion.h1
          className="mb-6 text-5xl font-bold md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-white">JONDOR</span>
          <span className="text-accent neon-text"> TUMANI</span>
        </motion.h1>

        <motion.p
          className="max-w-3xl mx-auto mb-10 text-xl md:text-2xl text-white/70"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {t(
            "Raqamli davlat boshqaruvi | Yangi O'zbekistonning buyuk kelajagi sari",
            "Цифровое государственное управление | К великому будущему Нового Узбекистана"
          )}
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/services">
            <button className="btn-primary">
              <i className="mr-2 fas fa-th-large"></i> {t("Xizmatlar", "Услуги")}
            </button>
          </Link>
          <Link to="/contact">
            <button className="px-6 py-3 font-semibold transition border rounded-full border-accent text-accent hover:bg-accent/10">
              <i className="mr-2 fas fa-paper-plane"></i> {t("Murojaat qilish", "Связаться")}
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute -translate-x-1/2 bottom-8 left-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex justify-center w-6 h-10 border-2 rounded-full border-white/30">
          <div className="w-1 h-2 mt-2 rounded-full bg-accent animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}