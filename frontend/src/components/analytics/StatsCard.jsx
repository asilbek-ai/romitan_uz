import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

export default function StatsCard({ title, value, icon, color }) {
  const colors = {
    blue: 'from-blue-500 to-indigo-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-rose-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${colors[color] || colors.blue} rounded-2xl p-5 text-white shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl">{icon}</span>
        <span className="text-2xl font-bold"><CountUp end={value} duration={2} /></span>
      </div>
      <p className="mt-2 text-sm opacity-90">{title}</p>
    </motion.div>
  );
}