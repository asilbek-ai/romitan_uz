import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { motion } from 'framer-motion';
import AddModal from '../components/AddModal';
import toast from 'react-hot-toast';

export default function AdminOrganizations() {
  const { organizations, addOrganization, deleteOrganization, updateOrganization } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [form, setForm] = useState({ name: '', nameRu: '', phone: '', email: '', address: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Tashkilot nomi kiritilmadi');
      return;
    }
    if (editingOrg) {
      updateOrganization({ ...editingOrg, ...form });
      toast.success('Tashkilot yangilandi');
    } else {
      addOrganization({ ...form, id: Date.now() });
      toast.success('Tashkilot qo\'shildi');
    }
    setIsModalOpen(false);
    setEditingOrg(null);
    setForm({ name: '', nameRu: '', phone: '', email: '', address: '' });
  };

  const handleEdit = (org) => {
    setEditingOrg(org);
    setForm({ name: org.name, nameRu: org.nameRu || '', phone: org.phone || '', email: org.email || '', address: org.address || '' });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tashkilotni o\'chirishni tasdiqlaysizmi?')) {
      deleteOrganization(id);
      toast.success('Tashkilot o\'chirildi');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏢 Tashkilotlar boshqaruvi ({organizations.length})</h1>
        <button
          onClick={() => { setEditingOrg(null); setForm({ name: '', nameRu: '', phone: '', email: '', address: '' }); setIsModalOpen(true); }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          <i className="fas fa-plus mr-2"></i> Yangi tashkilot
        </button>
      </div>

      {/* Cards Grid */}
      {organizations.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <i className="fas fa-building text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Hech qanday tashkilot yo'q</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {organizations.map(org => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-building text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{org.name}</h3>
                    {org.nameRu && <p className="text-sm text-gray-500">{org.nameRu}</p>}
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {org.phone && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <i className="fas fa-phone text-primary w-4"></i> {org.phone}
                  </p>
                )}
                {org.email && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <i className="fas fa-envelope text-primary w-4"></i> {org.email}
                  </p>
                )}
                {org.address && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-primary w-4"></i> {org.address}
                  </p>
                )}
              </div>
              <div className="border-t p-3 flex gap-2">
                <button onClick={() => handleEdit(org)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                  <i className="fas fa-edit mr-1"></i> Tahrirlash
                </button>
                <button onClick={() => handleDelete(org.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                  <i className="fas fa-trash-alt mr-1"></i> O'chirish
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AddModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingOrg(null); }}
        title={editingOrg ? '✏️ Tashkilotni tahrirlash' : '➕ Yangi tashkilot'}
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium mb-1">Nomi (UZ) *</label>
          <input type="text" required className="w-full p-2 border rounded-lg focus:outline-none focus:border-primary" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nomi (RU)</label>
          <input type="text" className="w-full p-2 border rounded-lg" value={form.nameRu} onChange={e => setForm({...form, nameRu: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input type="text" className="w-full p-2 border rounded-lg" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full p-2 border rounded-lg" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Manzil</label>
          <input type="text" className="w-full p-2 border rounded-lg" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        </div>
      </AddModal>
    </div>
  );
}