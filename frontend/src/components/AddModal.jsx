import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddModal({ isOpen, onClose, title, onSubmit, children, editMode = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className={`${editMode ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-primary to-primaryLight'} px-6 py-4`}>
              <h2 className="text-xl font-bold text-white">
                {editMode ? <i className="fas fa-edit mr-2"></i> : <i className="fas fa-plus-circle mr-2"></i>}
                {title}
              </h2>
              <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              {children}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Bekor qilish
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                  <i className="fas fa-save mr-1"></i> Saqlash
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}