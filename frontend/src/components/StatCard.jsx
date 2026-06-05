import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

export default function StatCard({ icon, value, label, color = 'blue', prefix = '', suffix = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (inView && !hasStarted) {
      setHasStarted(true);
    }
  }, [inView, hasStarted]);

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600'
  };

  return (
    <div ref={ref} className="p-6 text-center bg-white rounded-xl shadow hover:shadow-md transition">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
        <i className={`fas fa-${icon} text-2xl`}></i>
      </div>
      <div className="text-3xl font-bold text-primary">
        {prefix}
        {hasStarted && <CountUp end={value} duration={2.5} />}
        {suffix}
      </div>
      <p className="mt-2 text-gray-600">{label}</p>
    </div>
  );
}