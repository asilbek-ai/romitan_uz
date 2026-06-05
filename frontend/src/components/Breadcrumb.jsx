import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiChevronRight } from 'react-icons/fi';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getPageName = (name) => {
    const names = {
      '': 'Bosh sahifa',
      'about': 'Tuman haqida',
      'services': 'Xizmatlar',
      'news': 'Yangiliklar',
      'documents': 'Hujjatlar',
      'media': 'Media',
      'contact': 'Aloqa',
      'statistics': 'Statistika',
      'organizations': 'Tashkilotlar',
      'online-reception': 'Onlayn qabul',
      'admin': 'Admin panel',
      'dashboard': 'Dashboard'
    };
    return names[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <nav className="py-3 text-sm text-gray-500">
      <div className="container-custom">
        <ol className="flex items-center flex-wrap gap-1">
          <li>
            <Link to="/" className="hover:text-primary flex items-center gap-1">
              <FiHome className="w-4 h-4" />
              Bosh sahifa
            </Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            
            return (
              <li key={name} className="flex items-center gap-1">
                <FiChevronRight className="w-3 h-3" />
                {isLast ? (
                  <span className="text-gray-700 font-medium">{getPageName(name)}</span>
                ) : (
                  <Link to={routeTo} className="hover:text-primary">
                    {getPageName(name)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}