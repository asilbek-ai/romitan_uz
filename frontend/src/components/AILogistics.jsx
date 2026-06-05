// src/components/AILogistics.jsx
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";

export default function AILogistics() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      gsap.fromTo(
        ".ai-card",
        { opacity: 0, y: 100, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.2, duration: 1, ease: "back.out(1.2)" }
      );
    }
  }, [isInView]);

  const metrics = [
    { label: "Real-time tracking", value: "99.99%", icon: "radar" },
    { label: "Carbon reduction", value: "47%", icon: "leaf" },
    { label: "AI accuracy", value: "99.7%", icon: "brain" },
  ];

  return (
    <section ref={sectionRef} className="relative py-32" id="ainetwork">
      <div className="px-6 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <span className="px-4 py-1 font-mono text-sm tracking-wider rounded-full text-primary bg-primary/10">AI NETWORK CORE</span>
          <h2 className="mt-4 text-4xl font-bold text-transparent md:text-6xl bg-clip-text bg-gradient-to-r from-white via-primary to-cyan-400">
            Neural Logistics Engine
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-400">
            Our AI predicts, optimizes, and autonomously routes millions of shipments daily.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {metrics.map((m, idx) => (
            <motion.div
              key={idx}
              className="p-8 text-center transition-all duration-500 ai-card glass-card hover:neon-border"
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10">
                <i className={`fas fa-${m.icon} text-3xl text-primary`}></i>
              </div>
              <div className="text-4xl font-black text-primary neon-glow">{m.value}</div>
              <div className="mt-2 font-medium text-gray-300">{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Animated Network Lines */}
        <div className="relative h-64 mt-24">
          <canvas id="networkCanvas" className="absolute inset-0 w-full h-full rounded-2xl" />
        </div>
      </div>
    </section>
  );
}