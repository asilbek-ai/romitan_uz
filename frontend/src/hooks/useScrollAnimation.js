import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // Lenis smooth scroll
    const lenis = new await( import('@studio-freight/lenis')).default({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Hero zoom animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Image zoom effect
    tl.to(imageRef.current, {
      scale: 1.3,
      duration: 1.5,
      ease: "power2.out",
    }, 0);

    // Overlay darken
    tl.to('.hero-overlay', {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      duration: 1,
      ease: "power2.out",
    }, 0);

    // Content fade out
    tl.to(contentRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
    }, 0.3);

    // Particles animation
    if (particlesRef.current) {
      gsap.to(particlesRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.5,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }

    // Second image fade in (will be triggered by scroll)
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top+=200 top',
      end: 'bottom top',
      onUpdate: (self) => {
        const progress = self.progress;
        if (imageRef.current && imageRef.current.nextImage) {
          const opacity = Math.min(progress * 1.5, 1);
          imageRef.current.nextImage.style.opacity = opacity;
          imageRef.current.nextImage.style.transform = `scale(${1 + progress * 0.3})`;
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      lenis.destroy();
    };
  }, []);

  return { heroRef, imageRef, contentRef, particlesRef };
};