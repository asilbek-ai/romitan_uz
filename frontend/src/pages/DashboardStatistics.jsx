import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

export default function DashboardStatistics() {
  const [countersStarted, setCountersStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const sectionRef = useRef(null);
  const [dashboardData, setDashboardData] = useState({
    statsCards: [],
    trendData: [],
    incidentRatio: [],
    weeklyData: [],
    monthlyTrend: [],
    locations: []
  });

  // Load dashboard data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jondor_dashboard_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDashboardData(parsed);
      } catch (e) {
        console.error('Error loading dashboard data:', e);
        setDefaultData();
      }
    } else {
      setDefaultData();
    }
  }, []);

  const setDefaultData = () => {
    setDashboardData({
      statsCards: [
        { title: "Total Activities Today", value: 1547, bg: "from-blue-500 to-blue-600", change: "+12%" },
        { title: "Incidents Today", value: 17, bg: "from-red-500 to-red-600", change: "-5%" },
        { title: "Operational Status", value: "15/20", bg: "from-green-500 to-green-600", change: "75%" },
        { title: "Response Time", value: 4.2, bg: "from-purple-500 to-purple-600", change: "-0.3min", suffix: "min" }
      ],
      trendData: [
        { month: 'Yan', activities: 1200, incidents: 45 },
        { month: 'Fev', activities: 1350, incidents: 38 },
        { month: 'Mar', activities: 1480, incidents: 42 },
        { month: 'Apr', activities: 1620, incidents: 35 },
        { month: 'May', activities: 1750, incidents: 30 },
        { month: 'Iyun', activities: 1900, incidents: 28 },
        { month: 'Iyul', activities: 2100, incidents: 32 },
        { month: 'Avg', activities: 2250, incidents: 25 },
        { month: 'Sen', activities: 2400, incidents: 29 },
        { month: 'Okt', activities: 2550, incidents: 22 },
        { month: 'Noy', activities: 2350, incidents: 26 },
        { month: 'Dek', activities: 2200, incidents: 31 }
      ],
      incidentRatio: [
        { name: 'Incident', value: 65, color: '#003580' },
        { name: 'Traffic Accident', value: 20, color: '#ef4444' },
        { name: 'Crime', value: 5, color: '#f59e0b' },
        { name: 'Disaster', value: 10, color: '#10b981' }
      ],
      weeklyData: [
        { day: 'Dush', activities: 320, incidents: 12 },
        { day: 'Sesh', activities: 380, incidents: 15 },
        { day: 'Chor', activities: 350, incidents: 10 },
        { day: 'Pay', activities: 420, incidents: 18 },
        { day: 'Jum', activities: 450, incidents: 14 },
        { day: 'Shan', activities: 290, incidents: 8 },
        { day: 'Yak', activities: 210, incidents: 5 }
      ],
      monthlyTrend: [
        { month: 'Apr', value: 1450 },
        { month: 'May', value: 1620 },
        { month: 'Iyun', value: 1780 },
        { month: 'Iyul', value: 1950 },
        { month: 'Avg', value: 2100 },
        { month: 'Sen', value: 2250 }
      ],
      locations: [
        { name: 'Jembatan Besi', type: 'crime', status: 'high' },
        { name: 'Keluk', type: 'traffic', status: 'medium' },
        { name: 'Jelambar', type: 'incident', status: 'low' },
        { name: 'Petoj', type: 'disaster', status: 'medium' },
        { name: 'Kamp', type: 'crime', status: 'high' },
        { name: 'Kebo', type: 'traffic', status: 'low' },
        { name: 'Sidi', type: 'incident', status: 'medium' }
      ]
    });
  };

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

  const getLocationColor = (status) => {
    switch(status) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      default: return 'text-green-500 bg-green-50';
    }
  };

  const getLocationIcon = (type) => {
    switch(type) {
      case 'crime': return 'fas fa-gavel';
      case 'traffic': return 'fas fa-car';
      case 'disaster': return 'fas fa-bolt';
      default: return 'fas fa-exclamation-triangle';
    }
  };

  if (dashboardData.statsCards.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 pt-24">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#003580] to-[#0066cc] bg-clip-text text-transparent">
            Smart City Dashboard
          </h1>
          <p className="text-gray-500 mt-2">Jondor tumani faoliyat ko'rsatkichlari</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {dashboardData.statsCards.map((card, idx) => (
            <div key={idx} className={`bg-gradient-to-r ${card.bg} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm">{card.title}</p>
                  <div className="text-3xl font-bold mt-2">
                    {typeof card.value === 'number' && countersStarted ? (
                      <CountUp end={card.value} duration={2} />
                    ) : (
                      card.value
                    )}
                    {card.suffix && <span className="text-lg">{card.suffix}</span>}
                  </div>
                  <p className="text-white/70 text-xs mt-2">{card.change} from last month</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-chart-line text-white text-xl"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['overview', 'incidents', 'trends', 'locations'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#003580] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'overview' && 'Umumiy ko\'rinish'}
              {tab === 'incidents' && 'Hodisalar'}
              {tab === 'trends' && 'Trendlar'}
              {tab === 'locations' && 'Joylashuvlar'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Trend Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Trend - May 2025</h2>
                <div className="flex gap-3 text-sm">
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-[#003580] rounded-full"></div> Activities</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Incidents</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={dashboardData.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="activities" stroke="#003580" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-chart-pie text-[#003580]"></i> Incident Ratio
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={dashboardData.incidentRatio}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {dashboardData.incidentRatio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-chart-bar text-[#003580]"></i> Haftalik faoliyat
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dashboardData.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="activities" fill="#003580" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-chart-line text-[#003580]"></i> Oylik trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#003580" fill="#003580" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Incidents Tab */}
        {activeTab === 'incidents' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Hodisalar tahlili</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Hodisa turlari bo'yicha</h3>
                {dashboardData.incidentRatio.map(item => (
                  <div key={item.name} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-semibold mb-3">Hafta kunlari bo'yicha</h3>
                {dashboardData.weeklyData.map(day => (
                  <div key={day.day} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{day.day}</span>
                      <span className="font-semibold">{day.incidents} ta</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-red-500" style={{ width: `${(day.incidents / 20) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Yillik trendlar</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dashboardData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="activities" stroke="#003580" strokeWidth={3} name="Faoliyatlar" />
                <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={3} name="Hodisalar" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === 'locations' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-[#003580]"></i> Incident Location
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {dashboardData.locations.map((loc, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${getLocationColor(loc.status)}`}>
                  <div className="flex items-center gap-3">
                    <i className={`${getLocationIcon(loc.type)} text-lg`}></i>
                    <span className="font-medium">{loc.name}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                    {loc.type === 'crime' ? 'Jinoyat' : loc.type === 'traffic' ? 'Yo\'l' : 'Hodisa'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}