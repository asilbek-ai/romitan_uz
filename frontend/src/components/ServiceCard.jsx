import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock } from 'react-icons/fi';

export default function ServiceCard({ service }) {
  const { _id, name, nameRu, icon, description, duration, price } = service;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-xl p-5 shadow hover:shadow-lg transition"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
          <i className={`fas fa-${icon || 'gear'} text-2xl text-primary group-hover:text-white transition-colors duration-300`}></i>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold group-hover:text-primary transition">{name}</h3>
          {nameRu && <p className="text-sm text-gray-500">{nameRu}</p>}
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            {duration && (
              <span><FiClock className="inline mr-1" /> {duration}</span>
            )}
            {price && (
              <span className="text-primary font-semibold">{price}</span>
            )}
          </div>
          <Link
            to={`/services/${_id}`}
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary group-hover:gap-2 transition-all"
          >
            Batafsil <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}