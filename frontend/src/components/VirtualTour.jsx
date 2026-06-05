import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function VirtualTour() {
  const [activeTour, setActiveTour] = useState(0);

  const tours = [
    { id: 0, name: 'Tuman markazi', image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800', desc: 'Jondor shahri markaziy ko\'chasi' },
    { id: 1, name: 'Bog\' va istirohat', image: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=800', desc: 'Markaziy bog\' manzaralari' },
    { id: 2, name: 'Sport majmuasi', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', desc: 'Yangi sport inshootlari' }
  ];

  return (
    <section className="py-16 text-white bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-3 text-4xl font-bold">Virtual sayohat</h2>
            <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-pink-400"></div>
            <p className="mt-4 text-gray-300">Tumanimizni 360° formatida kashing</p>
          </motion.div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="relative overflow-hidden shadow-2xl rounded-2xl">
              <img
                src={tours[activeTour].image}
                alt={tours[activeTour].name}
                className="object-cover w-full transition-transform duration-700 h-96 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold">{tours[activeTour].name}</h3>
                <p className="text-gray-200">{tours[activeTour].desc}</p>
              </div>
              <div className="absolute top-6 right-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur">
                  <i className="text-xl text-white fas fa-arrows-spin"></i>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tour List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {tours.map((tour, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTour(idx)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  activeTour === idx
                    ? 'bg-white/20 backdrop-blur shadow-lg'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    activeTour === idx ? 'bg-gradient-to-r from-blue-500 to-pink-500' : 'bg-white/10'
                  }`}>
                    <i className="text-xl fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold">{tour.name}</h4>
                    <p className="text-sm text-gray-300">{tour.desc}</p>
                  </div>
                  {activeTour === idx && (
                    <motion.div
                      layoutId="active-indicator"
                      className="w-2 h-2 ml-auto bg-blue-400 rounded-full"
                    />
                  )}
                </div>
              </button>
            ))}

            <button className="w-full px-6 py-3 mt-6 font-semibold transition-all bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl hover:shadow-xl hover:-translate-y-1">
              <i className="mr-2 fas fa-play"></i>
              Boshlash
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}