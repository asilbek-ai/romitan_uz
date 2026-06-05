import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CinematicHero = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const overlayRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.3]), {
    stiffness: 100,
    damping: 30,
    mass: 1
  });

  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]), {
    stiffness: 100,
    damping: 30
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), {
    stiffness: 100,
    damping: 30
  });

  const blur = useSpring(useTransform(scrollYProgress, [0, 0.7, 1], [0, 5, 10]), {
    stiffness: 100,
    damping: 30
  });

  const images = [
    {
      url: "https://images.pexels.com/photos/154801/pexels-photo-154801.jpeg?w=1600",
      title: "Jondor tumani",
      titleRu: "Джондорский район",
      subtitle: "Taraqqiyot sari",
      subtitleRu: "К прогрессу"
    },
    {
      url: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=1600",
      title: "Yangi investitsiyalar",
      titleRu: "Новые инвестиции",
      subtitle: "Iqtisodiy o'sish",
      subtitleRu: "Экономический рост"
    },
    {
      url: "https://images.pexels.com/photos/159740/classroom-school-desk-lecture-159740.jpeg?w=1600",
      title: "Zamonaviy ta'lim",
      titleRu: "Современное образование",
      subtitle: "Kelajak poydevori",
      subtitleRu: "Фундамент будущего"
    }
  ];

  useEffect(() => {
    // Preload images
    images.forEach(img => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = img.url;
      document.head.appendChild(preloadLink);
    });

    // GSAP text animation
    const tl = gsap.timeline();
    tl.fromTo(textRef.current,
      { opacity: 0, y: 100, rotationX: -45 },
      { opacity: 1, y: 0, rotationX: 0, duration: 1.2, ease: "power4.out", delay: 0.3 }
    );

    // Auto image transition
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => {
      clearInterval(interval);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const t = (uz, ru) => {
    // This will be replaced by actual context
    return uz;
  };

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          ref={imageRef}
          src={images[currentImageIndex].url}
          alt={images[currentImageIndex].title}
          className="absolute inset-0 object-cover w-full h-full"
          style={{ scale, filter: `blur(${blur}px)` }}
          initial={{ scale: 1 }}
          key={currentImageIndex}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>

      {/* Gradient Overlay */}
      <motion.div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"
        style={{ opacity }}
      />

      {/* Dynamic Light Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0,53,128,0.2) 0%, transparent 70%)`,
          opacity: useTransform(scrollYProgress, [0, 0.5], [0.5, 0])
        }}
      />

      {/* Content */}
      <motion.div
        ref={textRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center text-white"
        style={{ y, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-4"
        >
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-mono tracking-wider border border-white/20">
            JONDOR TUMANI • OFFICIAL PORTAL
          </span>
        </motion.div>

        <motion.h1
          className="mb-4 text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <span className="text-transparent bg-gradient-to-r from-white via-white to-white/70 bg-clip-text">
            {images[currentImageIndex].title}
          </span>
        </motion.h1>

        <motion.p
          className="max-w-2xl mb-8 text-xl md:text-2xl text-white/80"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {images[currentImageIndex].subtitle}
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <Link to="/services">
            <button className="px-8 py-3 bg-white text-[#003580] rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
              <i className="mr-2 fas fa-th-large"></i> Xizmatlar
            </button>
          </Link>
          <Link to="/about">
            <button className="px-8 py-3 font-semibold text-white transition-all duration-300 bg-transparent border-2 border-white rounded-full hover:bg-white/10 hover:scale-105">
              <i className="mr-2 fas fa-info-circle"></i> Tuman haqida
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Glassmorphism Stats Card */}
      <motion.div
        className="absolute z-10 flex gap-6 p-4 -translate-x-1/2 border bottom-8 left-1/2 bg-white/10 backdrop-blur-md rounded-2xl border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        style={{ y: useTransform(scrollYProgress, [0, 0.3], [0, 100]) }}
      >
        <div className="px-4 text-center">
          <div className="text-2xl font-bold text-white">42</div>
          <div className="text-xs text-white/70">Mahalla</div>
        </div>
        <div className="px-4 text-center border-l border-white/20">
          <div className="text-2xl font-bold text-white">86</div>
          <div className="text-xs text-white/70">Maktab</div>
        </div>
        <div className="px-4 text-center border-l border-white/20">
          <div className="text-2xl font-bold text-white">128K+</div>
          <div className="text-xs text-white/70">Aholi</div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute z-10 -translate-x-1/2 bottom-8 left-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
      >
        <div className="flex justify-center w-6 h-10 border-2 rounded-full border-white/50">
          <div className="w-1 h-2 mt-2 bg-white rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-40px) translateX(-10px); opacity: 0.8; }
          75% { transform: translateY(-20px) translateX(5px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default CinematicHero;