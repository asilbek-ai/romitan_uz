import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import toast from 'react-hot-toast';

export default function AdminLeadership() {
  const { leadership, addLeadership, deleteLeadership, updateLeadership } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [form, setForm] = useState({
    name: '',
    position: '',
    positionRu: '',
    image: '',
    phone: '',
    email: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm({ ...form, image: reader.result });
        toast.success('Rasm yuklandi');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Ism familiya kiritilmadi');
      return;
    }
    addLeadership({ ...form, id: Date.now() });
    toast.success('Rahbar qo\'shildi');
    setIsModalOpen(false);
    setEditingLeader(null);
    resetForm();
  };

  const handleUpdate = () => {
    if (!form.name) {
      toast.error('Ism familiya kiritilmadi');
      return;
    }
    updateLeadership({ ...editingLeader, ...form });
    toast.success('Rahbar yangilandi');
    setIsModalOpen(false);
    setEditingLeader(null);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('O\'chirilsinmi?')) {
      deleteLeadership(id);
      toast.success('O\'chirildi');
    }
  };

  const handleEdit = (leader) => {
    setEditingLeader(leader);
    setForm({
      name: leader.name,
      position: leader.position || '',
      positionRu: leader.positionRu || '',
      image: leader.image || '',
      phone: leader.phone || '',
      email: leader.email || ''
    });
    setImagePreview(leader.image || null);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      name: '',
      position: '',
      positionRu: '',
      image: '',
      phone: '',
      email: ''
    });
    setImagePreview(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">👥 Rahbariyat boshqaruvi ({leadership.length})</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 text-white rounded-lg bg-primary">
          + Yangi rahbar
        </button>
      </div>

      {leadership.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl">
          <i className="mb-4 text-6xl text-gray-300 fas fa-users"></i>
          <p className="text-gray-500">Hech qanday rahbar yo'q</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {leadership.map(leader => (
            <div key={leader.id} className="overflow-hidden transition bg-white shadow-md rounded-xl hover:shadow-lg">
              <div className="flex items-center justify-center h-40 bg-gradient-to-r from-primary/10 to-primary/5">
                {leader.image ? (
                  <img src={leader.image} className="object-cover w-full h-full" />
                ) : (
                  <i className="text-5xl fas fa-user-circle text-primary/40"></i>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{leader.name}</h3>
                <p className="text-sm text-primary">{leader.position}</p>
                {leader.positionRu && <p className="text-xs text-gray-500">{leader.positionRu}</p>}
                <div className="mt-2 text-sm text-gray-500">
                  {leader.phone && <p><i className="mr-1 fas fa-phone"></i> {leader.phone}</p>}
                  {leader.email && <p><i className="mr-1 fas fa-envelope"></i> {leader.email}</p>}
                </div>
                <div className="flex gap-2 pt-3 mt-3 border-t">
                  <button onClick={() => handleEdit(leader)} className="flex-1 py-2 text-blue-600 transition rounded-lg bg-blue-50 hover:bg-blue-100">
                    <i className="mr-1 fas fa-edit"></i> Tahrirlash
                  </button>
                  <button onClick={() => handleDelete(leader.id)} className="flex-1 py-2 text-red-600 transition rounded-lg bg-red-50 hover:bg-red-100">
                    <i className="mr-1 fas fa-trash-alt"></i> O'chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 p-4 bg-white border-b">
              <h2 className="text-xl font-bold">{editingLeader ? '✏️ Rahbarni tahrirlash' : '👤 Yangi rahbar'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="absolute text-gray-500 top-4 right-4 hover:text-gray-700">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={editingLeader ? handleUpdate : handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Ism familiya *</label>
                <input type="text" required className="w-full p-2 border rounded-lg focus:outline-none focus:border-primary" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Lavozimi (UZ)</label>
                  <input type="text" className="w-full p-2 border rounded-lg" value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Lavozimi (RU)</label>
                  <input type="text" className="w-full p-2 border rounded-lg" value={form.positionRu} onChange={e => setForm({...form, positionRu: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Telefon</label>
                  <input type="text" className="w-full p-2 border rounded-lg" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Email</label>
                  <input type="email" className="w-full p-2 border rounded-lg" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Rasm</label>
                <div className="p-4 text-center border-2 border-dashed rounded-lg">
                  {imagePreview ? (
                    <div>
                      <img src={imagePreview} className="object-cover w-24 h-24 mx-auto rounded-full" />
                      <button type="button" onClick={() => { setImagePreview(null); setForm({...form, image: ''}); }} className="mt-2 text-sm text-red-500">O'chirish</button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <i className="text-3xl text-gray-400 fas fa-cloud-upload-alt"></i>
                      <p className="text-sm text-gray-500">Rasm yuklash</p>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-2 border rounded-lg hover:bg-gray-50">Bekor</button>
                <button type="submit" className="flex-1 p-2 text-white rounded-lg bg-primary hover:bg-primary/90">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}