import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang');
    return saved || 'uz';
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });
  const [loading, setLoading] = useState(true);
  
  // Statistics state - faqat localStorage bilan
  const [statistics, setStatistics] = useState([]);

  // Statistics CRUD operations - API YO'Q, faqat localStorage
  const addStatistic = (item) => {
    console.log('Adding statistic (localStorage):', item);
    const newItem = { 
      ...item, 
      id: Date.now(),
      value: typeof item.value === 'string' ? parseFloat(item.value.replace(/[^0-9.-]/g, '')) || 0 : item.value
    };
    const updated = [...statistics, newItem];
    setStatistics(updated);
    localStorage.setItem('admin_statistics', JSON.stringify(updated));
    console.log('Statistics after add:', updated);
    return newItem;
  };

  const updateStatistic = (item) => {
    console.log('Updating statistic (localStorage):', item);
    const updated = statistics.map(s => s.id === item.id ? item : s);
    setStatistics(updated);
    localStorage.setItem('admin_statistics', JSON.stringify(updated));
    console.log('Statistics after update:', updated);
  };

  const deleteStatistic = (id) => {
    console.log('Deleting statistic (localStorage):', id);
    const updated = statistics.filter(s => s.id !== id);
    setStatistics(updated);
    localStorage.setItem('admin_statistics', JSON.stringify(updated));
    console.log('Statistics after delete:', updated);
  };

  // Default statistika ma'lumotlari
  const defaultStatistics = [
    { id: 1, label: "Aholi soni", labelRu: "Численность населения", value: 167400, icon: "Users", color: "blue" },
    { id: 2, label: "Tuman maydoni", labelRu: "Площадь района", value: 1100, icon: "MapPin", color: "green" },
    { id: 3, label: "Maktablar", labelRu: "Школы", value: 42, icon: "School", color: "orange" },
    { id: 4, label: "Kasalxonalar", labelRu: "Больницы", value: 6, icon: "Hospital", color: "red" },
    { id: 5, label: "Korxonalar", labelRu: "Предприятия", value: 1800, icon: "Building", color: "purple" },
    { id: 6, label: "Fermer xo'jaliklari", labelRu: "Фермерские хозяйства", value: 120, icon: "Briefcase", color: "teal" },
  ];

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load statistics
        const savedStats = localStorage.getItem('admin_statistics');
        console.log('Raw saved statistics:', savedStats);
        
        if (savedStats && savedStats !== 'undefined' && savedStats !== 'null') {
          const parsed = JSON.parse(savedStats);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStatistics(parsed);
            console.log('Loaded statistics from localStorage:', parsed);
          } else {
            setStatistics(defaultStatistics);
            localStorage.setItem('admin_statistics', JSON.stringify(defaultStatistics));
            console.log('Set default statistics:', defaultStatistics);
          }
        } else {
          setStatistics(defaultStatistics);
          localStorage.setItem('admin_statistics', JSON.stringify(defaultStatistics));
          console.log('No saved statistics, set default:', defaultStatistics);
        }
      } catch (error) {
        console.error('Error loading statistics:', error);
        setStatistics(defaultStatistics);
        localStorage.setItem('admin_statistics', JSON.stringify(defaultStatistics));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save language
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const login = async (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('adminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminLoggedIn');
  };

  const t = (uz, ru, en) => {
    if (lang === 'uz') return uz;
    if (lang === 'ru') return ru;
    return en || uz;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      lang, setLang, t, isAdmin, login, logout,
      statistics, addStatistic, updateStatistic, deleteStatistic,
    }}>
      {children}
    </AppContext.Provider>
  );
};