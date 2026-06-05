import React, { useContext, useState } from 'react';
import { AppContext } from '../App';

export default function Media() {
  const { t, gallery } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const demoImages = [
    { id: 1, image: "https://images.pexels.com/photos/159740/classroom-school-desk-lecture-159740.jpeg?w=800", title: "Yangi maktab", titleRu: "Новая школа" },
    { id: 2, image: "https://images.pexels.com/photos/162240/field-wheat-grain-crops-162240.jpeg?w=800", title: "Paxta terimi", titleRu: "Сбор хлопка" },
    { id: 3, image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=800", title: "Investitsiya forumi", titleRu: "Инвестиционный форум" },
    { id: 4, image: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?w=800", title: "Sport majmuasi", titleRu: "Спортивный комплекс" },
    { id: 5, image: "https://images.pexels.com/photos/144982/pexels-photo-144982.jpeg?w=800", title: "Jondor shahri", titleRu: "Город Джондор" },
    { id: 6, image: "https://images.pexels.com/photos/263477/pexels-photo-263477.jpeg?w=800", title: "Yangi uskunalar", titleRu: "Новое оборудование" }
  ];
  
  const images = gallery.length > 0 ? gallery : demoImages;

  return (
    <div className="min-h-screen py-16 pt-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t('Media galereya', 'Медиа галерея')}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t('Tumanimiz hayotidan foto va videolar', 'Фото и видео из жизни нашего района')}
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <div 
              key={img.id} 
              onClick={() => setSelectedImage(img)} 
              className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-64 overflow-hidden">
                <img src={img.image} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt={img.title} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-start p-4">
                <p className="text-white font-semibold text-lg">{t(img.title, img.titleRu)}</p>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <i className="fas fa-search-plus text-white text-lg"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition">
            <i className="fas fa-times"></i>
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.image} className="w-full rounded-2xl" alt={selectedImage.title} />
            <p className="text-center text-white mt-4 text-lg font-medium">{t(selectedImage.title, selectedImage.titleRu)}</p>
          </div>
        </div>
      )}
    </div>
  );
}