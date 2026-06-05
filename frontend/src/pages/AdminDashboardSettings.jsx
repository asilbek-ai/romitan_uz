import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminDashboardSettings() {
  const [dashboardData, setDashboardData] = useState({
    statsCards: [
      { title: "Total Activities Today", titleRu: "Bugungi faoliyatlar", value: 1547, bg: "from-blue-500 to-blue-600", change: "+12%" },
      { title: "Incidents Today", titleRu: "Bugungi hodisalar", value: 17, bg: "from-red-500 to-red-600", change: "-5%" },
      { title: "Operational Status", titleRu: "Operatsion holat", value: "15/20", bg: "from-green-500 to-green-600", change: "75%" },
      { title: "Response Time", titleRu: "Javob vaqti", value: 4.2, bg: "from-purple-500 to-purple-600", change: "-0.3min", suffix: "min" }
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
      { name: 'Incident', nameRu: 'Hodisa', value: 65, color: '#003580' },
      { name: 'Traffic Accident', nameRu: 'Yo\'l hodisasi', value: 20, color: '#ef4444' },
      { name: 'Crime', nameRu: 'Jinoyat', value: 5, color: '#f59e0b' },
      { name: 'Disaster', nameRu: 'Tabiiy ofat', value: 10, color: '#10b981' }
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
      { name: 'Jembatan Besi', nameRu: 'Jembatan Besi', type: 'crime', status: 'high' },
      { name: 'Keluk', nameRu: 'Keluk', type: 'traffic', status: 'medium' },
      { name: 'Jelambar', nameRu: 'Jelambar', type: 'incident', status: 'low' },
      { name: 'Petoj', nameRu: 'Petoj', type: 'disaster', status: 'medium' },
      { name: 'Kamp', nameRu: 'Kamp', type: 'crime', status: 'high' },
      { name: 'Kebo', nameRu: 'Kebo', type: 'traffic', status: 'low' },
      { name: 'Sidi', nameRu: 'Sidi', type: 'incident', status: 'medium' }
    ]
  });

  const [activeSection, setActiveSection] = useState('stats');

  useEffect(() => {
    const saved = localStorage.getItem('jondor_dashboard_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDashboardData(parsed);
      } catch (e) {
        console.error('Error loading dashboard data:', e);
      }
    }
  }, []);

  const saveDashboardData = (newData) => {
    setDashboardData(newData);
    localStorage.setItem('jondor_dashboard_data', JSON.stringify(newData));
    toast.success('Dashboard ma\'lumotlari saqlandi');
  };

  // Update functions
  const updateStatsCard = (index, field, value) => {
    const newStats = [...dashboardData.statsCards];
    newStats[index][field] = value;
    saveDashboardData({ ...dashboardData, statsCards: newStats });
  };

  const updateTrendData = (index, field, value) => {
    const newTrend = [...dashboardData.trendData];
    newTrend[index][field] = parseInt(value) || 0;
    saveDashboardData({ ...dashboardData, trendData: newTrend });
  };

  const updateIncidentRatio = (index, field, value) => {
    const newRatio = [...dashboardData.incidentRatio];
    newRatio[index][field] = field === 'value' ? parseInt(value) : value;
    saveDashboardData({ ...dashboardData, incidentRatio: newRatio });
  };

  const updateWeeklyData = (index, field, value) => {
    const newWeekly = [...dashboardData.weeklyData];
    newWeekly[index][field] = parseInt(value) || 0;
    saveDashboardData({ ...dashboardData, weeklyData: newWeekly });
  };

  const updateMonthlyTrend = (index, value) => {
    const newMonthly = [...dashboardData.monthlyTrend];
    newMonthly[index].value = parseInt(value) || 0;
    saveDashboardData({ ...dashboardData, monthlyTrend: newMonthly });
  };

  const updateLocation = (index, field, value) => {
    const newLocations = [...dashboardData.locations];
    newLocations[index][field] = value;
    saveDashboardData({ ...dashboardData, locations: newLocations });
  };

  const sections = [
    { id: 'stats', label: 'Statistika kartochkalari', icon: 'fa-chart-line' },
    { id: 'trend', label: 'Trend ma\'lumotlari', icon: 'fa-chart-line' },
    { id: 'incident', label: 'Hodisa nisbati', icon: 'fa-chart-pie' },
    { id: 'weekly', label: 'Haftalik faoliyat', icon: 'fa-chart-bar' },
    { id: 'monthly', label: 'Oylik trend', icon: 'fa-chart-line' },
    { id: 'locations', label: 'Joylashuvlar', icon: 'fa-map-marker-alt' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Dashboard boshqaruvi</h1>
        <button
          onClick={() => {
            localStorage.setItem('jondor_dashboard_data', JSON.stringify(dashboardData));
            toast.success('Barcha o\'zgarishlar saqlandi!');
          }}
          className="px-4 py-2 bg-gradient-to-r from-[#003580] to-[#0066cc] text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
        >
          <i className="fas fa-save"></i> Saqlash
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeSection === section.id
                ? 'bg-[#003580] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className={`fas ${section.icon}`}></i>
            {section.label}
          </button>
        ))}
      </div>

      {/* Stats Cards Section */}
      {activeSection === 'stats' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm mb-4">Dashboarddagi statistik kartochkalarni tahrirlang</p>
          <div className="grid md:grid-cols-2 gap-4">
            {dashboardData.statsCards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow border">
                <h3 className="font-bold mb-3">Kartochka {idx + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Sarlavha (UZ)</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={card.title} onChange={e => updateStatsCard(idx, 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sarlavha (RU)</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={card.titleRu || ''} onChange={e => updateStatsCard(idx, 'titleRu', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Qiymat</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={card.value} onChange={e => updateStatsCard(idx, 'value', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">O'zgarish (%)</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={card.change} onChange={e => updateStatsCard(idx, 'change', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend Data Section */}
      {activeSection === 'trend' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm mb-4">Trend grafigi ma'lumotlarini tahrirlang</p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow">
              <thead className="bg-gray-50">
                <tr><th className="p-3 text-left">Oy</th><th className="p-3 text-left">Faoliyatlar</th><th className="p-3 text-left">Hodisalar</th></tr>
              </thead>
              <tbody>
                {dashboardData.trendData.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3 font-medium">{item.month}</td>
                    <td className="p-3"><input type="number" className="w-24 p-1 border rounded" value={item.activities} onChange={e => updateTrendData(idx, 'activities', e.target.value)} /></td>
                    <td className="p-3"><input type="number" className="w-24 p-1 border rounded" value={item.incidents} onChange={e => updateTrendData(idx, 'incidents', e.target.value)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Incident Ratio Section */}
      {activeSection === 'incident' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm mb-4">Hodisa nisbatlarini tahrirlang</p>
          <div className="grid md:grid-cols-2 gap-4">
            {dashboardData.incidentRatio.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow border">
                <h3 className="font-bold mb-3">{item.name}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nomi (UZ)</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={item.name} onChange={e => updateIncidentRatio(idx, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nomi (RU)</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={item.nameRu || ''} onChange={e => updateIncidentRatio(idx, 'nameRu', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Qiymat (%)</label>
                    <input type="number" className="w-full p-2 border rounded-lg" value={item.value} onChange={e => updateIncidentRatio(idx, 'value', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rang</label>
                    <input type="color" className="w-full p-1 border rounded h-10" value={item.color} onChange={e => updateIncidentRatio(idx, 'color', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Data Section */}
      {activeSection === 'weekly' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm mb-4">Haftalik faoliyat ma'lumotlarini tahrirlang</p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow">
              <thead className="bg-gray-50">
                <tr><th className="p-3 text-left">Kun</th><th className="p-3 text-left">Faoliyatlar</th><th className="p-3 text-left">Hodisalar</th></tr>
              </thead>
              <tbody>
                {dashboardData.weeklyData.map((item, idx) => (
                    <table>

                  <tr key={idx} className="border-t">
                    <td className="p-3 font-medium">{item.day}</td>
                    <td className="p-3"><input type="number" className="w-24 p-1 border rounded" value={item.activities} onChange={e => updateWeeklyData(idx, 'activities', e.target.value)} /></td>
                    <td className="p-3"><input type="number" className="w-24 p-1 border rounded" value={item.incidents} onChange={e => updateWeeklyData(idx, 'incidents', e.target.value)} /></td>
                 </tr>
                  </table>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Monthly Trend Section */}
      {activeSection === 'monthly' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm mb-4">Oylik trend ma'lumotlarini tahrirlang</p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow">
              <thead className="bg-gray-50"><tr><th className="p-3 text-left">Oy</th><th className="p-3 text-left">Qiymat</th></tr></thead>
              <tbody>
                {dashboardData.monthlyTrend.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3 font-medium">{item.month}</td>
                    <td className="p-3"><input type="number" className="w-24 p-1 border rounded" value={item.value} onChange={e => updateMonthlyTrend(idx, e.target.value)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Locations Section */}
      {activeSection === 'locations' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm mb-4">Joylashuv ma'lumotlarini tahrirlang</p>
          <div className="grid md:grid-cols-2 gap-4">
            {dashboardData.locations.map((loc, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow border">
                <h3 className="font-bold mb-3">Joylashuv {idx + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nomi (UZ)</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={loc.name} onChange={e => updateLocation(idx, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nomi (RU)</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={loc.nameRu || ''} onChange={e => updateLocation(idx, 'nameRu', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tur</label>
                    <select className="w-full p-2 border rounded-lg" value={loc.type} onChange={e => updateLocation(idx, 'type', e.target.value)}>
                      <option value="crime">Jinoyat</option>
                      <option value="traffic">Yo'l hodisasi</option>
                      <option value="incident">Hodisa</option>
                      <option value="disaster">Tabiiy ofat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Holat</label>
                    <select className="w-full p-2 border rounded-lg" value={loc.status} onChange={e => updateLocation(idx, 'status', e.target.value)}>
                      <option value="high">Yuqori</option>
                      <option value="medium">O'rtacha</option>
                      <option value="low">Past</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}