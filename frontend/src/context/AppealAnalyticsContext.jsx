import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const AppealAnalyticsContext = createContext();

const STORAGE_KEY = 'jondor_appeal_analytics';

const defaultAppeals = [
  {
    id: 'AP-001',
    fullName: 'Aliyev Alijon',
    phone: '+998901234567',
    mahalla: 'Yangiobod MFY',
    category: 'Suv muammosi',
    type: 'Xalq qabulxonasi',
    text: 'Mahallada suv yo‘q, 3 kundan beri suv kelmayapti',
    status: 'new',
    createdAt: new Date().toISOString(),
    views: 45,
    likes: 3,
    comments: [],
    media: [],
    adminResponse: null,
    statusHistory: [{ status: 'new', date: new Date().toISOString() }]
  },
  {
    id: 'AP-002',
    fullName: 'Karimova Gulnora',
    phone: '+998907654321',
    mahalla: 'Jondor MFY',
    category: 'Elektr',
    type: 'Hokimga murojaat',
    text: 'Elektr uzilishlari tez-tez sodir bo‘lmoqda',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    views: 32,
    likes: 5,
    comments: [],
    media: [],
    adminResponse: null,
    statusHistory: [{ status: 'new', date: new Date().toISOString() }]
  }
];

const loadAppeals = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAppeals));
    return defaultAppeals;
  }
  return JSON.parse(data);
};

const saveAppeals = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const AppealAnalyticsProvider = ({ children }) => {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    type: '',
    mahalla: '',
    startDate: '',
    endDate: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchAppeals = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      let items = loadAppeals();

      if (filters.search) {
        const s = filters.search.toLowerCase();
        items = items.filter(a => 
          a.fullName.toLowerCase().includes(s) || 
          a.text.toLowerCase().includes(s) ||
          a.phone.includes(s)
        );
      }
      if (filters.status) items = items.filter(a => a.status === filters.status);
      if (filters.category) items = items.filter(a => a.category === filters.category);
      if (filters.type) items = items.filter(a => a.type === filters.type);
      if (filters.mahalla) items = items.filter(a => a.mahalla === filters.mahalla);
      if (filters.startDate) items = items.filter(a => new Date(a.createdAt) >= new Date(filters.startDate));
      if (filters.endDate) items = items.filter(a => new Date(a.createdAt) <= new Date(filters.endDate));

      items.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (sortBy === 'createdAt') {
          valA = new Date(valA);
          valB = new Date(valB);
        }
        if (sortOrder === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });

      setTotal(items.length);
      const start = (page - 1) * limit;
      const paginated = items.slice(start, start + limit);
      setAppeals(paginated);
      setLoading(false);
    }, 300);
  }, [filters, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchAppeals();
  }, [fetchAppeals]);

  const analyzeCategory = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('suv')) return 'Suv muammosi';
    if (lowerText.includes('elektr')) return 'Elektr';
    if (lowerText.includes('gaz')) return 'Gaz';
    if (lowerText.includes('internet')) return 'Internet';
    if (lowerText.includes('yo‘l') || lowerText.includes('asfalt')) return 'Yo‘l muammosi';
    return 'Umumiy';
  };

  const addAppeal = async (data) => {
    const items = loadAppeals();
    const category = analyzeCategory(data.text);
    const newId = `AP-${String(items.length + 101).padStart(3, '0')}`;
    const newAppeal = {
      id: newId,
      ...data,
      category,
      status: 'new',
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: [],
      media: data.media || [],
      adminResponse: null,
      statusHistory: [{ status: 'new', date: new Date().toISOString() }]
    };
    items.unshift(newAppeal);
    saveAppeals(items);
    fetchAppeals();
    toast.success('Murojaatingiz qabul qilindi!');
    return newAppeal;
  };

  const updateAppeal = async (id, updated) => {
    let items = loadAppeals();
    const index = items.findIndex(a => a.id === id);
    if (index !== -1) {
      if (updated.status && items[index].status !== updated.status) {
        updated.statusHistory = [
          ...(items[index].statusHistory || []),
          { status: updated.status, date: new Date().toISOString() }
        ];
      }
      items[index] = { ...items[index], ...updated };
      saveAppeals(items);
      fetchAppeals();
      toast.success('Murojaat yangilandi');
      return items[index];
    }
    toast.error('Murojaat topilmadi');
    return null;
  };

  const deleteAppeal = async (id) => {
    let items = loadAppeals();
    items = items.filter(a => a.id !== id);
    saveAppeals(items);
    fetchAppeals();
    toast.success('Murojaat o‘chirildi');
  };

  const addComment = async (appealId, comment) => {
    const items = loadAppeals();
    const appeal = items.find(a => a.id === appealId);
    if (appeal) {
      appeal.comments.push({
        id: Date.now().toString(),
        text: comment,
        admin: false,
        createdAt: new Date().toISOString()
      });
      saveAppeals(items);
      fetchAppeals();
      toast.success('Izoh qo‘shildi');
      return appeal;
    }
    return null;
  };

  const toggleLike = async (appealId) => {
    const items = loadAppeals();
    const appeal = items.find(a => a.id === appealId);
    if (appeal) {
      appeal.likes = (appeal.likes || 0) + 1;
      saveAppeals(items);
      fetchAppeals();
      toast.success('Layk bosildi');
    }
  };

  const incrementViews = async (appealId) => {
    const items = loadAppeals();
    const appeal = items.find(a => a.id === appealId);
    if (appeal) {
      appeal.views = (appeal.views || 0) + 1;
      saveAppeals(items);
    }
  };

  const getStatistics = useCallback(() => {
    const items = loadAppeals();
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = items.filter(a => a.createdAt?.slice(0, 10) === today).length;
    const completed = items.filter(a => a.status === 'resolved').length;
    const inProgress = items.filter(a => a.status === 'in_progress').length;
    const critical = items.filter(a => 
      a.text.toLowerCase().includes('suv') || 
      a.text.toLowerCase().includes('elektr') ||
      a.text.toLowerCase().includes('gaz')
    ).length;

    const categoryStats = {
      'Suv muammosi': items.filter(a => a.category === 'Suv muammosi').length,
      'Elektr': items.filter(a => a.category === 'Elektr').length,
      'Gaz': items.filter(a => a.category === 'Gaz').length,
      'Internet': items.filter(a => a.category === 'Internet').length,
      'Yo‘l muammosi': items.filter(a => a.category === 'Yo‘l muammosi').length,
      'Umumiy': items.filter(a => a.category === 'Umumiy').length
    };

    const mahallaStats = {};
    items.forEach(a => {
      if (a.mahalla) mahallaStats[a.mahalla] = (mahallaStats[a.mahalla] || 0) + 1;
    });

    const topMahalla = Object.entries(mahallaStats).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    const topCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    const statusPercent = {
      new: items.length ? ((items.filter(a => a.status === 'new').length / items.length) * 100).toFixed(1) : 0,
      in_progress: items.length ? ((items.filter(a => a.status === 'in_progress').length / items.length) * 100).toFixed(1) : 0,
      resolved: items.length ? ((items.filter(a => a.status === 'resolved').length / items.length) * 100).toFixed(1) : 0,
      cancelled: items.length ? ((items.filter(a => a.status === 'cancelled').length / items.length) * 100).toFixed(1) : 0
    };

    return {
      total: items.length,
      todayCount,
      completed,
      inProgress,
      critical,
      categoryStats,
      topMahalla,
      topCategory,
      statusPercent
    };
  }, []);

  return (
    <AppealAnalyticsContext.Provider value={{
      appeals,
      loading,
      total,
      page,
      filters,
      sortBy,
      sortOrder,
      setPage,
      setFilters,
      setSortBy,
      setSortOrder,
      addAppeal,
      updateAppeal,
      deleteAppeal,
      addComment,
      toggleLike,
      incrementViews,
      getStatistics,
      fetchAppeals
    }}>
      {children}
    </AppealAnalyticsContext.Provider>
  );
};

export const useAppealAnalytics = () => {
  const context = useContext(AppealAnalyticsContext);
  if (!context) {
    throw new Error('useAppealAnalytics must be used within AppealAnalyticsProvider');
  }
  return context;
};