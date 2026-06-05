import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FiUsers, FiFileText, FiHeadphones, FiImage, FiDownload, FiEye } from 'react-icons/fi';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalNews: 0,
    totalServices: 0,
    totalDocuments: 0,
    totalMedia: 0,
    totalUsers: 0,
    totalContacts: 0,
    totalSubscribers: 0,
    totalOnlineApplications: 0
  });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [mediaTypeDistribution, setMediaTypeDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard-stats');
      setStats(res.data.stats);
      setMonthlyStats(res.data.monthlyStats);
      setRecentActivities(res.data.recentActivities);
      setMediaTypeDistribution(res.data.mediaTypeDistribution);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback demo data
      setStats({
        totalNews: 24,
        totalServices: 12,
        totalDocuments: 45,
        totalMedia: 89,
        totalUsers: 3,
        totalContacts: 67,
        totalSubscribers: 123,
        totalOnlineApplications: 34
      });
      setMonthlyStats([
        { month: 'Yan', news: 5, services: 2, contacts: 8 },
        { month: 'Fev', news: 7, services: 1, contacts: 12 },
        { month: 'Mar', news: 4, services: 3, contacts: 10 },
        { month: 'Apr', news: 8, services: 2, contacts: 15 },
        { month: 'May', news: 6, services: 4, contacts: 11 },
      ]);
      setRecentActivities([
        { id: 1, action: 'Yangi yangilik qo\'shildi', user: 'Admin', date: '2025-05-20 14:30' },
        { id: 2, action: 'Fayl yuklandi: jondor.pdf', user: 'Admin', date: '2025-05-20 10:15' },
        { id: 3, action: 'Yangilik o\'chirildi', user: 'Editor', date: '2025-05-19 16:45' },
      ]);
      setMediaTypeDistribution([
        { name: 'Rasm', value: 45, color: '#3b82f6' },
        { name: 'Audio', value: 12, color: '#10b981' },
        { name: 'Video', value: 18, color: '#ef4444' },
        { name: 'Hujjat', value: 25, color: '#f59e0b' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Yangiliklar', value: stats.totalNews, icon: FiFileText, color: 'blue' },
    { title: 'Xizmatlar', value: stats.totalServices, icon: FiHeadphones, color: 'purple' },
    { title: 'Hujjatlar', value: stats.totalDocuments, icon: FiDownload, color: 'orange' },
    { title: 'Media fayllar', value: stats.totalMedia, icon: FiImage, color: 'pink' },
    { title: 'Foydalanuvchilar', value: stats.totalUsers, icon: FiUsers, color: 'green' },
    { title: 'Murojaatlar', value: stats.totalContacts, icon: FiEye, color: 'red' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${card.color}-100`}>
                <card.icon className={`w-6 h-6 text-${card.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line Chart - Monthly trends */}
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="mb-4 text-lg font-semibold">Oylik statistikalar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="news" stroke="#3b82f6" name="Yangiliklar" />
              <Line type="monotone" dataKey="services" stroke="#8b5cf6" name="Xizmatlar" />
              <Line type="monotone" dataKey="contacts" stroke="#ef4444" name="Murojaatlar" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Media distribution */}
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="mb-4 text-lg font-semibold">Media fayllar taqsimoti</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mediaTypeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {mediaTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="p-4 bg-white rounded-xl shadow">
        <h3 className="mb-4 text-lg font-semibold">So‘nggi faoliyatlar</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 border-b last:border-0">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-gray-500">Foydalanuvchi: {activity.user} • {activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}