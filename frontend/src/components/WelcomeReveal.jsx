import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WelcomeReveal({ onComplete }) {
  const textRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
        onComplete: () => onComplete && onComplete(),
      }
    });

    tl.fromTo(textRef.current,
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: "back.out(1.2)" }
    );

    tl.fromTo(glowRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 0.5, scale: 1.5, duration: 1, ease: "power2.out" },
      '-=0.5'
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [onComplete]);

  return (
    <div className="relative z-20 max-w-4xl mx-auto text-center">
      <motion.div
        ref={glowRef}
        className="absolute inset-0 rounded-full -inset-10 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
      />
      <div ref={textRef} className="relative">
        <h1 className="mb-6 text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl">
          <span className="text-transparent bg-gradient-to-r from-white via-primary to-accent bg-clip-text">
            Jondor tumaniga
          </span>
          <br />
          <span className="text-white neon-text">xush kelibsiz</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg leading-relaxed md:text-xl text-white/80">
          Raqamli davlat boshqaruvi - Yangi O'zbekistonning buyuk kelajagi sari
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button className="px-8 py-3 font-semibold transition-all duration-300 bg-white rounded-full text-primary hover:shadow-lg hover:scale-105">
            <i className="mr-2 fas fa-play"></i> Virtual sayohat
          </button>
          <button className="px-8 py-3 font-semibold text-white transition-all duration-300 bg-transparent border-2 border-white rounded-full hover:bg-white/10 hover:scale-105">
            <i className="mr-2 fas fa-info-circle"></i> Batafsil
          </button>
        </div>
      </div>
    </div>
  );
}