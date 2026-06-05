import { useContext, useState } from 'react';
import { AppContext } from '../App';

export default function Media() {
  const { t, adminData } = useContext(AppContext);
  const [selected, setSelected] = useState(null);
  
  return (
    <div className="min-h-screen pb-16 pt-28">
      <div className="container-custom">
        <h1 className="mb-6 text-3xl font-bold gradient-text">{t('Media galereya', 'Медиа галерея')}</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {adminData.gallery.map(img => (
            <div key={img.id} onClick={() => setSelected(img)} className="relative overflow-hidden cursor-pointer group rounded-xl">
              <img src={img.image} className="object-cover w-full h-56" alt={img.title} />
              <div className="absolute inset-0 flex items-center justify-center transition opacity-0 bg-black/50 group-hover:opacity-100">
                <i className="text-3xl text-white fas fa-search-plus"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setSelected(null)}>
          <img src={selected.image} className="max-h-[90vh] max-w-[90vw] rounded-lg" alt={selected.title} />
        </div>
      )}
    </div>
  );
}