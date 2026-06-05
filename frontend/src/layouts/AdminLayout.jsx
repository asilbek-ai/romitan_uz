import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiHome, FiFileText, FiGrid, FiBarChart2, FiBuilding, 
  FiImage, FiSliders, FiUsers, FiHelpCircle, FiMail, FiBell, 
  FiLogOut, FiChevronRight, FiChevronLeft, FiUser, FiSettings,
  FiCalendar, FiHeadphones, FiDownload, FiMessageSquare, FiActivity
} from 'react-icons/fi';
import { useAdminAuth } from '../hooks/useAdminAuth';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
        setMobileOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  }, [location]);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FiHome, color: 'blue' },
    { path: '/admin/news', label: 'Yangiliklar', icon: FiFileText, color: 'green' },
    { path: '/admin/services', label: 'Xizmatlar', icon: FiGrid, color: 'purple' },
    { path: '/admin/statistics', label: 'Statistika', icon: FiBarChart2, color: 'orange' },
    { path: '/admin/organizations', label: 'Tashkilotlar', icon: FiBuilding, color: 'red' },
    { path: '/admin/media', label: 'Media galereya', icon: FiImage, color: 'pink' },
    { path: '/admin/carousel', label: 'Karusel', icon: FiSliders, color: 'indigo' },
    { path: '/admin/audio', label: 'Audio xizmatlar', icon: FiHeadphones, color: 'teal' },
    { path: '/admin/documents', label: 'Hujjatlar', icon: FiDownload, color: 'yellow' },
    { path: '/admin/reception', label: 'Qabul jadvali', icon: FiCalendar, color: 'blue' },
    { path: '/admin/online-reception', label: 'Onlayn qabul', icon: FiMessageSquare, color: 'green' },
    { path: '/admin/leadership', label: 'Rahbariyat', icon: FiUsers, color: 'purple' },
    { path: '/admin/faq', label: 'FAQ', icon: FiHelpCircle, color: 'orange' },
    { path: '/admin/contacts', label: 'Murojaatlar', icon: FiMail, color: 'red' },
    { path: '/admin/subscribers', label: 'Obunalar', icon: FiBell, color: 'pink' },
    { path: '/admin/activity-logs', label: 'Faoliyat jurnali', icon: FiActivity, color: 'indigo' },
    { path: '/admin/users', label: 'Admin foydalanuvchilar', icon: FiUser, color: 'teal' },
    { path: '/admin/settings', label: 'Sozlamalar', icon: FiSettings, color: 'gray' },
  ];

  const getActiveClass = (path) => {
    return location.pathname === path
      ? 'bg-primary/10 text-primary border-r-4 border-primary'
      : 'text-gray-600 hover:bg-gray-100';
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-500', green: 'text-green-500', purple: 'text-purple-500',
      orange: 'text-orange-500', red: 'text-red-500', pink: 'text-pink-500',
      indigo: 'text-indigo-500', teal: 'text-teal-500', yellow: 'text-yellow-500',
      gray: 'text-gray-500'
    };
    return colors[color] || 'text-primary';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
    toast.success('Tizimdan chiqildi');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sidebar animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.3 }
    })
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${isDarkMode ? 'dark' : ''}`}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial="open"
        animate={sidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl transition-all duration-300 ${
          sidebarOpen ? 'md:translate-x-0' : '-translate-x-full'
        } ${mobileOpen ? 'translate-x-0' : ''}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-primaryDark">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
              <i className="text-xl text-white fas fa-landmark"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-white/70">Jondor tumani</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white md:hidden hover:text-gray-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              {admin?.avatar ? (
                <img src={admin.avatar} alt={admin.fullName} className="object-cover w-full h-full rounded-full" />
              ) : (
                <FiUser className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <p className="font-semibold">{admin?.fullName || 'Admin User'}</p>
              <p className="text-xs text-gray-500 capitalize">{admin?.role || 'admin'}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 overflow-y-auto h-[calc(100%-160px)]">
          {menuItems.map((item, idx) => (
            <motion.div
              key={item.path}
              custom={idx}
              initial="hidden"
              animate="visible"
              variants={menuItemVariants}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${getActiveClass(item.path)}`}
              >
                <item.icon className={`w-5 h-5 ${getIconColor(item.color)}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {item.path === '/admin/contacts' && (
                  <span className="ml-auto px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">3</span>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden w-full p-2 mb-2 text-gray-500 rounded-lg md:block hover:bg-gray-100"
          >
            <FiChevronLeft className={`mx-auto transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition bg-red-500 rounded-lg hover:bg-red-600"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white shadow-sm">
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileOpen(true);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <FiMenu className="w-5 h-5 text-primary" />
          </button>

          <div className="flex items-center gap-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isDarkMode ? <i className="fas fa-sun text-yellow-500"></i> : <i className="fas fa-moon text-gray-500"></i>}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <FiBell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <FiUser className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden text-sm font-medium md:inline">{admin?.fullName || 'Admin'}</span>
                <FiChevronRight className="hidden w-4 h-4 md:block" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}