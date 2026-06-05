// MurojaatContext.jsx - to'liq tuzatilgan versiya
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const MurojaatContext = createContext();

const STORAGE_KEYS = {
  MUROJAATLAR: 'jondor_murojaatlar',
  MALUMOTLAR: 'jondor_malumotlar',
  OQILGANLAR: 'jondor_oqilganlar'
};

const defaultMurojaatlar = [
  {
    id: 'MR-001',
    fullName: 'Aliyev Alijon',
    phone: '+998901234567',
    mahalla: 'Yangiobod MFY',
    mavzu: 'Suv toshgan',
    text: 'Mahallada suv toshib ketdi, yordam kerak',
    media: [],
    category: 'Suv muammosi',
    status: 'unread',
    createdAt: new Date().toISOString(),
    readAt: null
  },
  {
    id: 'MR-002',
    fullName: 'Karimova Gulnora',
    phone: '+998907654321',
    mahalla: 'Jondor MFY',
    mavzu: 'Elektr uzilishi',
    text: 'Elektr uzilishlari tez-tez sodir bo‘lmoqda',
    media: [],
    category: 'Elektr',
    status: 'unread',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    readAt: null
  }
];

const defaultMalumotlar = [
  {
    id: 'INF-001',
    title: 'Jondor tumani rivojlanishi',
    text: 'Tumanimizda yangi loyihalar ishga tushirilmoqda. 2025-yil yakuniga qadar 10 ta yangi ob\'yekt foydalanishga topshiriladi.',
    image: null,
    media: [],
    date: new Date().toISOString()
  },
  {
    id: 'INF-002',
    title: 'Yangi maktab ochildi',
    text: 'Jondor tumanida 600 o‘rinli zamonaviy maktab foydalanishga topshirildi.',
    image: null,
    media: [],
    date: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

const loadData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const MurojaatProvider = ({ children }) => {
  const [murojaatlar, setMurojaatlar] = useState([]);
  const [malumotlar, setMalumotlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ count: 0, show: false });

  // Load data on mount
  useEffect(() => {
    const loadedMurojaatlar = loadData(STORAGE_KEYS.MUROJAATLAR, defaultMurojaatlar);
    const loadedMalumotlar = loadData(STORAGE_KEYS.MALUMOTLAR, defaultMalumotlar);
    
    setMurojaatlar(loadedMurojaatlar);
    setMalumotlar(loadedMalumotlar);
    
    const unreadCount = loadedMurojaatlar.filter(m => m.status === 'unread').length;
    setNotification({ count: unreadCount, show: unreadCount > 0 });
    setLoading(false);
  }, []);

  const analyzeCategory = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('suv') || lowerText.includes('water')) return 'Suv muammosi';
    if (lowerText.includes('elektr') || lowerText.includes('electric')) return 'Elektr';
    if (lowerText.includes('yo‘l') || lowerText.includes('asfalt') || lowerText.includes('road')) return 'Yo‘l muammosi';
    if (lowerText.includes('gaz') || lowerText.includes('gas')) return 'Gaz';
    if (lowerText.includes('internet') || lowerText.includes('wifi') || lowerText.includes('aloqa')) return 'Internet';
    return 'Umumiy';
  };

  const addMurojaat = async (data) => {
    const newId = `MR-${String(murojaatlar.length + 101).padStart(3, '0')}`;
    const category = analyzeCategory(data.text);
    const newMurojaat = {
      id: newId,
      ...data,
      category,
      status: 'unread',
      createdAt: new Date().toISOString(),
      readAt: null,
      media: data.media || []
    };
    const updated = [newMurojaat, ...murojaatlar];
    setMurojaatlar(updated);
    saveData(STORAGE_KEYS.MUROJAATLAR, updated);
    
    const unreadCount = updated.filter(m => m.status === 'unread').length;
    setNotification({ count: unreadCount, show: true });
    toast.success('Murojaatingiz qabul qilindi!');
    return newMurojaat;
  };

  const markAsRead = (id) => {
    const updated = murojaatlar.map(m => 
      m.id === id ? { ...m, status: 'read', readAt: new Date().toISOString() } : m
    );
    setMurojaatlar(updated);
    saveData(STORAGE_KEYS.MUROJAATLAR, updated);
    
    const unreadCount = updated.filter(m => m.status === 'unread').length;
    setNotification({ count: unreadCount, show: unreadCount > 0 });
    toast.success('Murojaat o‘qilgan deb belgilandi');
  };

  const addMalumot = async (data) => {
    const newId = `INF-${String(malumotlar.length + 101).padStart(3, '0')}`;
    const newMalumot = {
      id: newId,
      title: data.title,
      text: data.text,
      image: data.image || null,
      media: data.media || [],
      date: new Date().toISOString()
    };
    const updated = [newMalumot, ...malumotlar];
    setMalumotlar(updated);
    saveData(STORAGE_KEYS.MALUMOTLAR, updated);
    toast.success('Ma\'lumot qo‘shildi');
    return newMalumot;
  };

  const deleteMalumot = (id) => {
    const updated = malumotlar.filter(m => m.id !== id);
    setMalumotlar(updated);
    saveData(STORAGE_KEYS.MALUMOTLAR, updated);
    toast.success('Ma\'lumot o‘chirildi');
  };

  const getStatistics = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    
    const todayCount = murojaatlar.filter(m => m.createdAt?.slice(0, 10) === today).length;
    const weeklyCount = murojaatlar.filter(m => m.createdAt >= weekAgo).length;
    const readCount = murojaatlar.filter(m => m.status === 'read').length;
    const unreadCount = murojaatlar.filter(m => m.status === 'unread').length;
    
    const categoryStats = {
      'Suv muammosi': murojaatlar.filter(m => m.category === 'Suv muammosi').length,
      'Elektr': murojaatlar.filter(m => m.category === 'Elektr').length,
      'Yo‘l muammosi': murojaatlar.filter(m => m.category === 'Yo‘l muammosi').length,
      'Gaz': murojaatlar.filter(m => m.category === 'Gaz').length,
      'Internet': murojaatlar.filter(m => m.category === 'Internet').length,
      'Umumiy': murojaatlar.filter(m => m.category === 'Umumiy').length
    };
    
    const mahallaStats = {};
    murojaatlar.forEach(m => {
      if (m.mahalla) mahallaStats[m.mahalla] = (mahallaStats[m.mahalla] || 0) + 1;
    });
    const topMahalla = Object.entries(mahallaStats).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    
    const mavzuStats = {};
    murojaatlar.forEach(m => {
      mavzuStats[m.mavzu] = (mavzuStats[m.mavzu] || 0) + 1;
    });
    const topMavzu = Object.entries(mavzuStats).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    
    const dailyData = {};
    murojaatlar.forEach(m => {
      const date = m.createdAt?.slice(0, 10);
      if (date) dailyData[date] = (dailyData[date] || 0) + 1;
    });
    
    const groupedByMavzu = {};
    murojaatlar.forEach(m => {
      if (!groupedByMavzu[m.mavzu]) {
        groupedByMavzu[m.mavzu] = { mavzu: m.mavzu, count: 0, items: [] };
      }
      groupedByMavzu[m.mavzu].count++;
      groupedByMavzu[m.mavzu].items.push(m);
    });
    
    const grouped = Object.values(groupedByMavzu).filter(g => g.count > 1);
    
    return {
      total: murojaatlar.length,
      todayCount,
      weeklyCount,
      readCount,
      unreadCount,
      categoryStats,
      topMahalla,
      topMavzu,
      dailyData,
      groupedMurojaatlar: grouped
    };
  }, [murojaatlar]);

  return (
    <MurojaatContext.Provider value={{
      murojaatlar,
      malumotlar,
      loading,
      notification,
      addMurojaat,
      markAsRead,
      addMalumot,
      deleteMalumot,
      getStatistics,
      analyzeCategory
    }}>
      {children}
    </MurojaatContext.Provider>
  );
};

export const useMurojaat = () => {
  const context = useContext(MurojaatContext);
  if (!context) {
    throw new Error('useMurojaat must be used within MurojaatProvider');
  }
  return context;
};