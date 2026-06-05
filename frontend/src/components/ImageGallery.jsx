import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';

export default function ImageGallery({ images, title }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full">
      {title && <h3 className="mb-3 text-lg font-semibold">{title}</h3>}
      
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-xl cursor-pointer group aspect-square"
            onClick={() => openLightbox(idx)}
          >
            <img
              src={typeof img === 'string' ? img : img.url}
              alt={typeof img === 'string' ? `Gallery ${idx}` : img.title}
              className="object-cover w-full h-full transition duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center transition duration-300 bg-black/50 opacity-0 group-hover:opacity-100">
              <FiZoomIn className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && selectedIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 text-white transition rounded-full bg-white/20 hover:bg-white/30"
            >
              <FiX className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white transition rounded-full bg-white/20 hover:bg-white/30"
            >
              <FiChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white transition rounded-full bg-white/20 hover:bg-white/30"
            >
              <FiChevronRight className="w-8 h-8" />
            </button>

            <div className="flex items-center justify-center h-full p-4">
              <img
                src={typeof images[selectedIndex] === 'string' ? images[selectedIndex] : images[selectedIndex].url}
                alt="Lightbox"
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}