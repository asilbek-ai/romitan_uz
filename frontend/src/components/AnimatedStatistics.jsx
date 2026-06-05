import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

export default function AnimatedStatistics() {
  const [countersStarted, setCountersStarted] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.3 });

  useEffect(() => {
    if (isInView && !countersStarted) {
      setCountersStarted(true);
    }
  }, [isInView, countersStarted]);

  const stats = [
    {
      id: 1,
      value: 185500,
      prefix: "",
      suffix: "+",
      label: "Aholi soni",
      labelRu: "Численность населения",
      icon: "fa-users",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      delay: 0
    },
    {
      id: 2,
      value: 52,
      prefix: "",
      suffix: "",
      label: "Maktablar",
      labelRu: "Школы",
      icon: "fa-school",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      delay: 0.1
    },
    {
      id: 3,
      value: 50,
      prefix: "",
      suffix: "",
      label: "Mahallalar",
      labelRu: "Махалли",
      icon: "fa-home",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      delay: 0.2
    },
    {
      id: 4,
      value: 250,
      prefix: "",
      suffix: "",
      label: "Maktabgacha ta'lim",
      labelRu: "Дошкольное образование",
      icon: "fa-child",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
      delay: 0.3
    },
    {
      id: 5,
      value: 6,
      prefix: "",
      suffix: "",
      label: "Tibbi muassasalar",
      labelRu: "Больницы",
      icon: "fa-hospital",
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-50 to-orange-50",
      delay: 0.4
    },
    {
      id: 6,
      value: 3000,
      prefix: "",
      suffix: "+",
      label: "Tadbirkorlar",
      labelRu: "Предприниматели",
      icon: "fa-briefcase",
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
      delay: 0.5
    },
    {
      id: 7,
      value: 100,
      prefix: "",
      suffix: "+",
      label: "Yangi ish o'rinlari",
      labelRu: "Новые рабочие места",
      icon: "fa-chart-line",
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50",
      delay: 0.6
    },
    {
      id: 8,
      value: 10000,
      prefix: "",
      suffix: "+",
      label: "Turistlar",
      labelRu: "Туристы",
      icon: "fa-globe",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      delay: 0.7
    }
  ];

  // Animated Counter Component
  const AnimatedCounter = ({ value, prefix, suffix, delay }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);

    useEffect(() => {
      if (countersStarted) {
        let start = 0;
        const duration = 2500;
        const step = value / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        return () => clearInterval(timer);
      }
    }, [value, countersStarted]);

    return (
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 + delay, type: "spring", stiffness: 200 }}
        className="text-4xl font-extrabold md:text-5xl"
      >
        {prefix}{count.toLocaleString()}{suffix}
      </motion.span>
    );
  };

  return (
    <div ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
      
      {/* Animated background circles */}
      <motion.div
        className="absolute w-64 h-64 rounded-full top-20 left-10 bg-blue-200/30 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full bottom-20 right-10 w-80 h-80 bg-purple-200/30 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-96 h-96 bg-green-200/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-primaryLight text-white text-sm font-semibold rounded-full shadow-lg">
              📊 JONDOR TUMANI
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
          >
            <span className="text-transparent bg-gradient-to-r from-primary via-primaryLight to-accent bg-clip-text">
              Statistik ma'lumotlar
            </span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-primary to-accent"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="max-w-2xl mx-auto mt-4 text-gray-500"
          >
            Tuman rivojlanishining asosiy ko'rsatkichlari
          </motion.p>
        </motion.div>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ delay: stat.delay, duration: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`group relative bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}
            >
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-2xl group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.gradient.includes('blue') ? '#3b82f6' : stat.gradient.includes('green') ? '#10b981' : stat.gradient.includes('orange') ? '#f97316' : stat.gradient.includes('pink') ? '#ec4899' : stat.gradient.includes('red') ? '#ef4444' : stat.gradient.includes('purple') ? '#8b5cf6' : '#14b8a6'}, transparent)`,
                }}
                animate={{
                  x: [-200, 200],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Icon with animation */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
              >
                <i className={`fas ${stat.icon} text-white text-2xl`}></i>
              </motion.div>

              {/* Counter */}
              <div className="mb-2">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  delay={stat.delay}
                />
              </div>

              {/* Label */}
              <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
                {stat.label}
              </h3>
              <p className="mt-1 text-xs text-gray-400">{stat.labelRu}</p>

              {/* Decorative line */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.gradient}`}
                initial={{ width: "0%" }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ delay: 0.8 + stat.delay, duration: 1 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="p-6 mt-12 text-white shadow-xl bg-gradient-to-r from-primary to-primaryDark rounded-2xl"
        >
          <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="border-r border-white/20 last:border-none"
            >
              <i className="block mb-2 text-3xl fas fa-calendar-alt"></i>
              <div className="text-2xl font-bold">1935</div>
              <div className="text-sm opacity-80">Tashkil etilgan yil</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="border-r border-white/20 last:border-none"
            >
              <i className="block mb-2 text-3xl fas fa-map-marker-alt"></i>
              <div className="text-2xl font-bold">5,17000 km²</div>
              <div className="text-sm opacity-80">Hudud maydoni</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <i className="block mb-2 text-3xl fas fa-building"></i>
              <div className="text-2xl font-bold">50</div>
              <div className="text-sm opacity-80">Mahallalar soni</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -100, -200],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}