import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';

export default function NewsPage() {
  const { t, adminData } = useContext(AppContext);
  return (
    <div className="min-h-screen pb-16 pt-28">
      <div className="container-custom">
        <h1 className="mb-6 text-3xl font-bold gradient-text">{t('Yangiliklar', 'Новости')}</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminData.news.map(item => (
            <Link key={item.id} to={`/news/${item.id}`} className="overflow-hidden transition bg-white shadow rounded-xl hover:shadow-lg">
              <img src={item.image} className="object-cover w-full h-48" alt={item.title} />
              <div className="p-4">
                <h3 className="mb-2 font-bold line-clamp-2">{t(item.title, item.titleRu)}</h3>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}