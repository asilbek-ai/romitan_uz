import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiMail, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get('/subscribers');
      setSubscribers(res.data);
    } catch (error) {
      toast.error('Obunalarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Obunani o\'chirishni tasdiqlaysizmi?')) {
      try {
        await api.delete(`/subscribers/${id}`);
        toast.success('Obuna o\'chirildi');
        fetchSubscribers();
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      }
    }
  };

  const exportToCSV = () => {
    const csvHeaders = ['Email', 'Obuna sanasi'];
    const csvRows = subscribers.map(sub => [
      sub.email,
      new Date(sub.createdAt).toLocaleString()
    ]);
    const csvContent = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Obunalar eksport qilindi');
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Yuklanmoqda...</div>;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Obunalar</h1>
        <div className="flex gap-3">
          <div className="relative">
            <i className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 fas fa-search"></i>
            <input
              type="text"
              placeholder="Email qidirish..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-primary hover:bg-primary/90"
          >
            <FiDownload /> Eksport
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Obuna sanasi</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSubscribers.map((sub, idx) => (
              <motion.tr
                key={sub._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    <span>{sub.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(sub.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSubscribers.length === 0 && (
        <div className="py-12 text-center">
          <i className="text-5xl text-gray-300 fas fa-bell-slash"></i>
          <p className="mt-4 text-gray-500">Hech qanday obuna yo'q</p>
        </div>
      )}
    </div>
  );
}