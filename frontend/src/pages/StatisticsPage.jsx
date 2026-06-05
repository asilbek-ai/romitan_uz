import { useContext, useRef } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { AppContext } from '../App';

export default function Statistics() {
  const { t, adminData } = useContext(AppContext);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <div className="min-h-screen pb-16 pt-28">
      <div className="container-custom">
        <h1 className="mb-6 text-3xl font-bold text-center gradient-text">{t('Statistika', 'Статистика')}</h1>
        <div ref={ref} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {adminData.statistics.map(stat => (
            <div key={stat.id} className="p-6 text-center transition bg-white shadow rounded-xl hover:shadow-lg">
              <i className={`fas fa-${stat.icon} text-4xl text-primary mb-3 block`}></i>
              <div className="text-3xl font-bold text-primary">{isInView && <CountUp end={stat.value} duration={2.5} />}</div>
              <div className="mt-2 text-gray-600">{t(stat.label, stat.labelRu)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}