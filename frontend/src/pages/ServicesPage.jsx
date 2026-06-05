import React, { useContext, useState } from 'react';
import { AppContext } from '../App';

export default function Services() {
  const { t, services } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(services.map(s => s.department || 'Boshqa'))];
  
  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.nameRu && s.nameRu.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = selectedCategory === 'all' || s.department === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen py-16 pt-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t('Davlat xizmatlari', 'Государственные услуги')}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t('Sizga kerakli barcha davlat xizmatlari bir joyda', 'Все необходимые государственные услуги в одном месте')}
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder={t('Xizmat qidirish...', 'Поиск услуг...')} 
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? t('Barchasi', 'Все') : cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(service => (
            <div key={service.id} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center group-hover:from-primary group-hover:to-primaryDark transition-all duration-300">
                  <i className={`fas fa-${service.icon} text-2xl text-primary group-hover:text-white transition-all duration-300`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition">{t(service.name, service.nameRu)}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                    <i className="fas fa-building"></i>
                    <span>{service.department || t('Tuman hokimligi', 'Хокимият района')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">{t('Hech qanday xizmat topilmadi', 'Услуги не найдены')}</p>
          </div>
        )}
      </div>
    </div>
  );
}