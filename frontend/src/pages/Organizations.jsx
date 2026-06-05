import React, { useContext, useState } from 'react';
import { AppContext } from '../App';

export default function Organizations() {
  const { t, organizations } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = organizations.filter(org =>
    t(org.name, org.nameRu).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-16 pt-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            🏢 {t('Tashkilotlar', 'Организации')}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t('Tumanimizdagi davlat tashkilotlari', 'Государственные организации нашего района')}
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder={t('Tashkilot qidirish...', 'Поиск организаций...')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {organizations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <i className="fas fa-building text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">{t('Hech qanday tashkilot yo\'q', 'Нет организаций')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(org => (
              <div key={org.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <i className="fas fa-building text-primary text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{t(org.name, org.nameRu)}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {org.phone && (
                    <a href={`tel:${org.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-primary transition">
                      <i className="fas fa-phone text-primary w-4"></i> {org.phone}
                    </a>
                  )}
                  {org.email && (
                    <a href={`mailto:${org.email}`} className="flex items-center gap-2 text-gray-600 hover:text-primary transition">
                      <i className="fas fa-envelope text-primary w-4"></i> {org.email}
                    </a>
                  )}
                  {org.address && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-map-marker-alt text-primary w-4"></i> {org.address}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}