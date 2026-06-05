// src/pages/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppealAnalytics } from '../context/AppealAnalyticsContext';
import StatsCard from '../components/analytics/StatsCard';
import AppealFilters from '../components/analytics/AppealFilters';
import StatusBadge from '../components/analytics/StatusBadge';
import CategoryBadge from '../components/analytics/CategoryBadge';
import { Eye, MessageCircle, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnalyticsDashboard() {
  const { appeals, loading, total, page, setPage, filters, setFilters, sortBy, setSortBy, setSortOrder, updateAppeal, deleteAppeal, getStatistics } = useAppealAnalytics();
  const [stats, setStats] = useState(null);
  const limit = 10;

  useEffect(() => {
    setStats(getStatistics());
  }, [appeals, getStatistics]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen py-20 pt-28 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="px-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text">
            Murojaatlar analitikasi
          </h1>
          <p className="mt-2 text-gray-500">Dashboard va statistikalar</p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-5">
            <StatsCard title="Jami murojaatlar" value={stats.total} icon="📋" color="blue" />
            <StatsCard title="Bugungi" value={stats.todayCount} icon="📆" color="green" />
            <StatsCard title="Hal qilindi" value={stats.completed} icon="✅" color="green" />
            <StatsCard title="Jarayonda" value={stats.inProgress} icon="⚙️" color="yellow" />
            <StatsCard title="Kritik" value={stats.critical} icon="⚠️" color="red" />
          </div>
        )}

        {/* Filters */}
        <AppealFilters filters={filters} setFilters={setFilters} />

        {/* Sort */}
        <div className="flex justify-end gap-3 mb-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm bg-white border rounded-lg"
          >
            <option value="createdAt">Sana</option>
            <option value="views">Ko‘rishlar</option>
            <option value="likes">Layklar</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 text-sm bg-white border rounded-lg"
          >
            {sortOrder === 'desc' ? '🔽' : '🔼'}
          </button>
        </div>

        {/* Appeals Table */}
        <div className="overflow-hidden border shadow-xl bg-white/80 backdrop-blur-md rounded-2xl border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-left">ID</th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">Ism</th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">Mahalla</th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">Kategoriya</th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">Sana</th>
                  <th className="px-4 py-3 text-sm font-semibold text-center">Statistika</th>
                  <th className="px-4 py-3 text-sm font-semibold text-center">Harakat</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="py-10 text-center">Yuklanmoqda...</td></tr>
                ) : appeals.length === 0 ? (
                  <tr><td colSpan="8" className="py-10 text-center">Hech qanday murojaat yo‘q</td></tr>
                ) : (
                  appeals.map(appeal => (
                    <tr key={appeal.id} className="transition border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm">{appeal.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{appeal.fullName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{appeal.mahalla || '—'}</td>
                      <td className="px-4 py-3"><CategoryBadge category={appeal.category} /></td>
                      <td className="px-4 py-3"><StatusBadge status={appeal.status} /></td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(appeal.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-3 text-gray-500">
                          <span className="flex items-center gap-1 text-xs"><Eye size={14} /> {appeal.views}</span>
                          <span className="flex items-center gap-1 text-xs"><Heart size={14} /> {appeal.likes}</span>
                          <span className="flex items-center gap-1 text-xs"><MessageCircle size={14} /> {appeal.comments?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Link to={`/appeal-analytics/${appeal.id}`} className="text-blue-600 hover:text-blue-700">
                            <Eye size={18} />
                          </Link>
                          <select
                            value={appeal.status}
                            onChange={(e) => updateAppeal(appeal.id, { status: e.target.value })}
                            className="px-2 py-1 text-xs border rounded"
                          >
                            <option value="new">Yangi</option>
                            <option value="in_progress">Jarayonda</option>
                            <option value="resolved">Hal qilindi</option>
                            <option value="cancelled">Bekor qilindi</option>
                          </select>
                          <button onClick={() => deleteAppeal(appeal.id)} className="text-red-600 hover:text-red-700">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-2 text-sm"> {page} / {totalPages} </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border rounded-lg disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}