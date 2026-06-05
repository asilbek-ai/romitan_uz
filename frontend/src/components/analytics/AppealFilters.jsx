// src/components/analytics/AppealFilters.jsx
import React from 'react';
import { Search, Filter } from 'lucide-react';

const statusOptions = ['new', 'in_progress', 'resolved', 'cancelled'];
const categoryOptions = ['Suv muammosi', 'Elektr', 'Gaz', 'Internet', 'Yo‘l muammosi', 'Umumiy'];
const typeOptions = ['Xalq qabulxonasi', 'Xalq nazorati', 'Hokimga murojaat', 'Telegram bot', 'EDO tizimi', 'Portal orqali'];
const mahallaOptions = ['Yangiobod MFY', 'Jondor MFY', 'Mustaqillik MFY', 'Navoiy MFY', 'Alisher Navoiy MFY', 'Bobur MFY'];

export default function AppealFilters({ filters, setFilters }) {
  return (
    <div className="p-4 mb-6 border bg-white/80 backdrop-blur-md rounded-2xl border-white/20">
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-xs text-gray-500">Qidiruv</label>
          <div className="relative">
            <Search size={16} className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Ism, telefon yoki matn..."
              className="w-full py-2 pl-10 pr-4 text-sm border rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 text-xs text-gray-500">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 text-sm bg-white border rounded-xl"
          >
            <option value="">Barcha</option>
            {statusOptions.map(s => <option key={s} value={s}>{s === 'new' ? 'Yangi' : s === 'in_progress' ? 'Jarayonda' : s === 'resolved' ? 'Hal qilindi' : 'Bekor qilindi'}</option>)}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 text-xs text-gray-500">Kategoriya</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 text-sm bg-white border rounded-xl"
          >
            <option value="">Barcha</option>
            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1 text-xs text-gray-500">Murojaat turi</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-3 py-2 text-sm bg-white border rounded-xl"
          >
            <option value="">Barcha</option>
            {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Mahalla */}
        <div>
          <label className="block mb-1 text-xs text-gray-500">Mahalla</label>
          <select
            value={filters.mahalla}
            onChange={(e) => setFilters({ ...filters, mahalla: e.target.value })}
            className="px-3 py-2 text-sm bg-white border rounded-xl"
          >
            <option value="">Barcha</option>
            {mahallaOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Date range */}
        <div>
          <label className="block mb-1 text-xs text-gray-500">Boshlanish sanasi</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="px-3 py-2 text-sm border rounded-xl"
          />
        </div>
        <div>
          <label className="block mb-1 text-xs text-gray-500">Tugash sanasi</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="px-3 py-2 text-sm border rounded-xl"
          />
        </div>

        <button
          onClick={() => setFilters({ search: '', status: '', category: '', type: '', mahalla: '', startDate: '', endDate: '' })}
          className="px-4 py-2 text-sm transition bg-gray-100 rounded-xl hover:bg-gray-200"
        >
          <Filter size={16} className="inline mr-1" /> Tozalash
        </button>
      </div>
    </div>
  );
}