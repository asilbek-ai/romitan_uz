import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiMessageSquare, FiEye, FiClock, FiUser, FiPhone, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function AdminOnlineReception() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all');

  const statuses = [
    { value: 'pending', label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-700', icon: FiClock },
    { value: 'processing', label: 'Ko‘rib chiqilmoqda', color: 'bg-blue-100 text-blue-700', icon: FiEye },
    { value: 'completed', label: 'Bajarildi', color: 'bg-green-100 text-green-700', icon: FiCheck },
    { value: 'rejected', label: 'Rad etildi', color: 'bg-red-100 text-red-700', icon: FiX }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/online-reception');
      setApplications(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Murojaatlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, reply = null) => {
    try {
      const payload = { status };
      if (reply) payload.reply = reply;
      await api.put(`/online-reception/${id}`, payload);
      toast.success(`Holat o'zgartirildi: ${statuses.find(s => s.value === status)?.label}`);
      fetchApplications();
      setSelectedApp(null);
      setReplyText('');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const filteredApps = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    processing: applications.filter(a => a.status === 'processing').length,
    completed: applications.filter(a => a.status === 'completed').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  if (loading) return <div className="p-8 text-center">Yuklanmoqda...</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Onlayn qabul boshqaruvi</h1>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'processing', 'completed', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === status
                ? status === 'all' ? 'bg-primary text-white' : statuses.find(s => s.value === status)?.color
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? `Barchasi (${statusCounts.all})` : `${statuses.find(s => s.value === status)?.label} (${statusCounts[status]})`}
          </button>
        ))}
      </div>

      {/* Applications list */}
      <div className="space-y-4">
        {filteredApps.map((app, idx) => {
          const status = statuses.find(s => s.value === app.status);
          const StatusIcon = status?.icon;
          return (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{app.fullName}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status?.color}`}>
                      <StatusIcon className="inline w-3 h-3 mr-1" />
                      {status?.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span><FiPhone className="inline mr-1" /> {app.phone}</span>
                    <span><FiFileText className="inline mr-1" /> {app.passport}</span>
                    <span><FiClock className="inline mr-1" /> {new Date(app.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-2 text-gray-700">{app.message}</p>
                  {app.fileUrl && (
                    <a href={app.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline">
                      <i className="fas fa-paperclip"></i> Qo'shimcha fayl
                    </a>
                  )}
                  {app.reply && (
                    <div className="p-3 mt-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-700">Javob:</p>
                      <p className="text-sm text-blue-600">{app.reply}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="p-2 text-white rounded-lg bg-primary hover:bg-primary/90"
                  >
                    <FiMessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-xl"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-bold">Murojaatga javob berish</h3>
                <button onClick={() => setSelectedApp(null)} className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Kimdan: {selectedApp.fullName}</p>
                  <p className="text-sm text-gray-500">Telefon: {selectedApp.phone}</p>
                  <p className="mt-2 p-2 bg-gray-50 rounded text-sm">{selectedApp.message}</p>
                </div>
                <textarea
                  rows={4}
                  placeholder="Javob matnini kiriting..."
                  className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:border-primary"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => updateStatus(selectedApp._id, 'completed', replyText)}
                    className="flex-1 py-2 text-white rounded-lg bg-green-500 hover:bg-green-600"
                  >
                    <FiCheck className="inline mr-1" /> Qabul qilish va javob berish
                  </button>
                  <button
                    onClick={() => updateStatus(selectedApp._id, 'rejected', replyText)}
                    className="flex-1 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600"
                  >
                    <FiX className="inline mr-1" /> Rad etish
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}