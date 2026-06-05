import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const createCameraAnimation = (elements) => {
  const { container, imageLayer, overlayLayer, textLayer, glowLayer, cameraLayer } = elements;

  // Main timeline
  const mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  // Scene 1: Initial zoom in
  mainTimeline.to(imageLayer, {
    scale: 1.3,
    duration: 1.5,
    ease: "power2.out",
  }, 0);

  // Scene 2: Camera movement (pan right and slight rotation)
  mainTimeline.to(cameraLayer, {
    x: '-5%',
    rotationY: 5,
    duration: 1,
    ease: "power2.inOut",
  }, 1);

  // Scene 3: Depth effect - foreground and background separate
  mainTimeline.to(imageLayer, {
    scale: 1.6,
    x: '-8%',
    duration: 1.2,
    ease: "power2.inOut",
  }, 1.5);

  // Scene 4: Blur transition for entrance
  mainTimeline.to(overlayLayer, {
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    duration: 0.8,
    ease: "power2.inOut",
  }, 2.2);

  // Scene 5: Light effect
  mainTimeline.to(glowLayer, {
    opacity: 0.6,
    scale: 1.5,
    duration: 0.8,
    ease: "power2.inOut",
  }, 2.5);

  // Scene 6: Text reveal animation
  mainTimeline.fromTo(textLayer,
    {
      opacity: 0,
      y: 50,
      scale: 0.9,
      filter: 'blur(10px)',
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: "back.out(1.2)",
    },
    2.8
  );

  // Scene 7: Final zoom out to normal
  mainTimeline.to(imageLayer, {
    scale: 1,
    x: 0,
    rotationY: 0,
    duration: 1,
    ease: "power2.inOut",
  }, 3.5);

  mainTimeline.to(overlayLayer, {
    backdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    duration: 0.8,
    ease: "power2.inOut",
  }, 3.5);

  mainTimeline.to(textLayer, {
    opacity: 0,
    y: -30,
    duration: 0.6,
    ease: "power2.in",
  }, 4);

  return mainTimeline;
};