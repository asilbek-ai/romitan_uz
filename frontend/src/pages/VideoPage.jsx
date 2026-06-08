// VideoPage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../App';
import { motion } from 'framer-motion';

export default function VideoPage() {
  const { id } = useParams();
  const { t } = useContext(AppContext);
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('admin_videos');
    if (saved) {
      const allVideos = JSON.parse(saved);
      setVideos(allVideos);
      const found = allVideos.find(v => v.id === parseInt(id));
      setVideo(found);
    }
  }, [id]);

  const getVideoEmbedUrl = (url, type) => {
    if (!url) return null;
    if (type === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (type === 'vimeo') {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
          <p className="mt-4 text-gray-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="px-4 mx-auto max-w-5xl">
        <Link to="/news" className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700">
          <i className="fas fa-arrow-left"></i>
          {t('Ortga', 'Назад')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="relative aspect-video bg-black">
            <iframe
              src={getVideoEmbedUrl(video.videoUrl, video.videoType)}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title={t(video.title, video.titleRu)}
            ></iframe>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r from-red-600 to-rose-600">
                <i className="mr-1 fas fa-video"></i>
                Video
              </span>
              <span className="text-sm text-gray-400">
                <i className="mr-1 far fa-calendar-alt"></i>
                {video.date}
              </span>
            </div>
            
            <h1 className="mb-4 text-2xl font-bold md:text-3xl text-gray-800">
              {t(video.title, video.titleRu)}
            </h1>
            
            <p className="text-gray-600 leading-relaxed">
              {video.description}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}