import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function DocumentCard({ document, variant = 'default' }) {
  const [downloading, setDownloading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { _id, title, titleRu, description, category, fileUrl, fileName, fileSize, downloadCount, publishDate } = document;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/documents/download/${_id}`);
      const link = document.createElement('a');
      link.href = res.data.downloadUrl;
      link.download = res.data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Yuklab olish boshlandi');
    } catch (error) {
      toast.error('Yuklab olishda xatolik');
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Noma\'lum';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      qonun: 'Qonun',
      qaror: 'Qaror',
      farmon: 'Farmon',
      hisobot: 'Hisobot',
      nizom: 'Nizom',
      boshqa: 'Boshqa'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      qonun: 'bg-red-100 text-red-700',
      qaror: 'bg-blue-100 text-blue-700',
      farmon: 'bg-purple-100 text-purple-700',
      hisobot: 'bg-green-100 text-green-700',
      nizom: 'bg-orange-100 text-orange-700',
      boshqa: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between p-3 transition bg-white rounded-lg shadow-sm hover:shadow-md">
        <div className="flex items-center gap-3">
          <FiFileText className="text-primary" />
          <div>
            <p className="font-medium line-clamp-1">{title}</p>
            <p className="text-xs text-gray-500">{new Date(publishDate).toLocaleDateString()}</p>
          </div>
        </div>
        <button onClick={handleDownload} disabled={downloading} className="p-2 text-primary hover:text-primary/80">
          {downloading ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <FiDownload />}
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <FiFileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              {titleRu && <p className="text-sm text-gray-500">{titleRu}</p>}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                <span className={`px-2 py-0.5 rounded-full ${getCategoryColor(category)}`}>
                  {getCategoryLabel(category)}
                </span>
                <span><i className="far fa-calendar-alt mr-1"></i> {new Date(publishDate).toLocaleDateString()}</span>
                <span><i className="far fa-file mr-1"></i> {formatFileSize(fileSize)}</span>
                <span><i className="fas fa-download mr-1"></i> {downloadCount} marta</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {downloading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiDownload />}
            <span className="hidden sm:inline">Yuklash</span>
          </button>
        </div>

        {description && (
          <div className="mt-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <FiEye className="w-4 h-4" />
              {showDetails ? 'Yopish' : 'Batafsil'}
            </button>
            {showDetails && (
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}