import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useMurojaat } from '../context/MurojaatContext';
import { 
  TrendingUp, Users, Calendar, CheckCircle, Clock, 
  AlertCircle, MessageCircle, BarChart3,
  PieChart as PieChartIcon, LineChart as LineChartIcon
} from 'lucide-react';

// Recharts importlari
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

export default function MurojaatStatistika() {
  const { murojaatlar, getStatistics } = useMurojaat();
  const [countersStarted, setCountersStarted] = useState(false);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({
    dailyData: [],
    categoryData: [],
    statusData: []
  });
  const [activeChart, setActiveChart] = useState('daily');
  const sectionRef = useRef(null);

  useEffect(() => {
    const loadStats = () => {
      const data = getStatistics();
      console.log('Statistics data:', data);
      setStats(data);
      
      if (data) {
        // Daily data
        const daily = Object.entries(data.dailyData || {}).slice(-7).map(([date, count]) => ({
          name: date.slice(5),
          murojaatlar: count
        }));
        
        // Category data
        const category = Object.entries(data.categoryStats || {}).map(([name, value]) => ({
          name: name,
          value: value
        }));
        
        // Status data
        const status = [
          { name: 'Yangi', value: data.unreadCount || 0, color: '#ef4444' },
          { name: 'Hal qilindi', value: data.readCount || 0, color: '#10b981' }
        ];
        
        setChartData({ daily, category, status });
      }
    };
    
    loadStats();
  }, [murojaatlar, getStatistics]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCountersStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-500">Statistika yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block p-3 mb-4 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text">
            Murojaatlar statistikasi
          </h1>
          <p className="max-w-2xl mx-auto mt-2 text-gray-500">
            Murojaatlarning batafsil tahlili va grafiklari
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
          <div className="p-4 bg-white shadow-md rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {countersStarted ? <CountUp end={stats.total} duration={2} /> : stats.total}
                </div>
                <div className="text-xs text-gray-500">Jami murojaatlar</div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white shadow-md rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {countersStarted ? <CountUp end={stats.todayCount} duration={2} /> : stats.todayCount}
                </div>
                <div className="text-xs text-gray-500">Bugungi murojaatlar</div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white shadow-md rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {countersStarted ? <CountUp end={stats.readCount} duration={2} /> : stats.readCount}
                </div>
                <div className="text-xs text-gray-500">Hal qilindi</div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white shadow-md rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {((stats.readCount / stats.total) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Hal qilish darajasi</div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-xl">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['daily', 'category', 'status'].map(type => (
            <button
              key={type}
              onClick={() => setActiveChart(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeChart === type
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {type === 'daily' && 'Kunlik'}
              {type === 'category' && 'Kategoriyalar'}
              {type === 'status' && 'Holatlar'}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="p-5 bg-white shadow-lg rounded-2xl">
          {activeChart === 'daily' && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Kunlik murojaatlar dinamikasi</h3>
              {chartData.daily.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Area type="monotone" dataKey="murojaatlar" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-gray-400">Ma'lumot mavjud emas</div>
              )}
            </div>
          )}

          {activeChart === 'category' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Kategoriyalar bo'yicha</h3>
                {chartData.category.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.category}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.category.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-400">Ma'lumot mavjud emas</div>
                )}
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Kategoriya statistikasi</h3>
                <div className="space-y-3">
                  {chartData.category.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span className="text-gray-700">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800">{cat.value}</span>
                        <span className="text-sm text-gray-400">{((cat.value / stats.total) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeChart === 'status' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Holatlar bo'yicha</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.status}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.status.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Holat statistikasi</h3>
                <div className="space-y-3">
                  {chartData.status.map((status, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                        <span className="text-gray-700">{status.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800">{status.value}</span>
                        <span className="text-sm text-gray-400">{((status.value / stats.total) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 mt-6 md:grid-cols-2">
          <div className="p-4 bg-white shadow-md rounded-2xl">
            <h3 className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
              <Users className="w-4 h-4 text-blue-500" />
              Eng faol mahalla
            </h3>
            <div className="text-xl font-bold text-gray-800">{stats.topMahalla}</div>
          </div>
          <div className="p-4 bg-white shadow-md rounded-2xl">
            <h3 className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              Eng ko'p murojaat turi
            </h3>
            <div className="text-xl font-bold text-gray-800">{stats.topMavzu || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}