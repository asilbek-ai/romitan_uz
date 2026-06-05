// src/components/RealTimeClock.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RealTimeClock({ className = "", showSeconds = true, showDate = true, showGreeting = true }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      hour12: false
    });
  };

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('uz-UZ', options);
  };

  const hour = currentTime.getHours();
  const getGreeting = () => {
    if (hour < 12) return "Xayrli tong ☀️";
    if (hour < 18) return "Xayrli kun 🌞";
    return "Xayrli kech 🌙";
  };

  // Get time parts for individual animations
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  return (
    <motion.div 
      className={`glass px-6 py-3 rounded-2xl shadow-xl ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Digital Clock with Animations */}
        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1">
            <motion.div 
              key={hours}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold md:text-5xl text-primary"
            >
              {hours}
            </motion.div>
            <motion.span 
              className="text-4xl font-bold md:text-5xl text-primary animate-pulse"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              :
            </motion.span>
            <motion.div 
              key={minutes}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold md:text-5xl text-primary"
            >
              {minutes}
            </motion.div>
            {showSeconds && (
              <>
                <motion.span 
                  className="text-4xl font-bold md:text-5xl text-primary animate-pulse"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  :
                </motion.span>
                <motion.div 
                  key={seconds}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold md:text-5xl text-primaryLight"
                >
                  {seconds}
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Date */}
        {showDate && (
          <motion.div 
            className="flex items-center gap-2 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <i className="fas fa-calendar-alt text-primary"></i>
            <span>{formatDate(currentTime)}</span>
          </motion.div>
        )}

        {/* Greeting */}
        {showGreeting && (
          <motion.div 
            className="flex items-center gap-2 text-sm font-medium text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <i className="fas fa-smile-wink"></i>
            <span>{getGreeting()}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}