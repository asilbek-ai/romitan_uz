import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiEye, FiTag } from 'react-icons/fi';

export default function NewsCard({ news, variant = 'default' }) {
  const { _id, title, titleRu, excerpt, featuredImage, publishDate, views, category, tags } = news;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (variant === 'compact') {
    return (
      <Link to={`/news/${_id}`}>
        <div className="flex gap-3 p-3 transition bg-white rounded-lg shadow hover:shadow-md">
          {featuredImage && (
            <img src={featuredImage} alt={title} className="object-cover w-20 h-20 rounded-lg" />
          )}
          <div className="flex-1">
            <h4 className="font-medium line-clamp-2">{title}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span><FiCalendar className="inline mr-1" /> {formatDate(publishDate)}</span>
              <span><FiEye className="inline mr-1" /> {views}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="overflow-hidden bg-white rounded-xl shadow hover:shadow-lg transition"
    >
      <Link to={`/news/${_id}`}>
        {featuredImage && (
          <div className="relative overflow-hidden h-56">
            <img
              src={featuredImage}
              alt={title}
              className="object-cover w-full h-full transition duration-500 hover:scale-110"
            />
            {category && (
              <span className="absolute top-4 left-4 px-2 py-1 text-xs font-medium text-white bg-primary rounded-full">
                {category}
              </span>
            )}
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
            <span><FiCalendar className="inline mr-1" /> {formatDate(publishDate)}</span>
            <span><FiEye className="inline mr-1" /> {views}</span>
          </div>
          <h3 className="mb-2 text-xl font-bold line-clamp-2">{title}</h3>
          {excerpt && <p className="mb-4 text-gray-600 line-clamp-3">{excerpt}</p>}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  <FiTag className="inline mr-1 w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}