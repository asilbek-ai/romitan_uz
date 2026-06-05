import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { motion } from 'framer-motion';
import AddModal from '../components/AddModal';
import toast from 'react-hot-toast';
import { uploadAPI } from '../services/api';

export default function AdminNews() {
  const { news, addNews, deleteNews, updateNews } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ title: '', titleRu: '', content: '', image: '', imageId: null });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Sarlavha kiritilmadi');
      return;
    }
    if (editingItem) {
      updateNews({ ...editingItem, ...form });
      toast.success('Yangilik yangilandi');
    } else {
      addNews({ ...form, id: Date.now(), date: new Date().toISOString().split('T')[0], views: 0 });
      toast.success('Yangilik qo\'shildi');
    }
    setIsModalOpen(false);
    setEditingItem(null);
    setForm({ title: '', titleRu: '', content: '', image: '', imageId: null });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({ title: item.title, titleRu: item.titleRu || '', content: item.content || '', image: item.image || '', imageId: item.imageId || null });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('O\'chirilsinmi?')) {
      deleteNews(id);
      toast.success('Yangilik o\'chirildi');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        setUploadingImage(true);
        const response = await uploadAPI.uploadSingle(file, '/news');
        setForm({
          ...form,
          image: uploadAPI.getFileUrl(response.data.id),
          imageUrl: uploadAPI.getFileUrl(response.data.id),
          imageId: response.data.id,
        });
        toast.success('Rasm yuklandi');
      } catch (error) {
        toast.error('Rasm yuklab bo\'lmadi');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📰 Yangiliklar boshqaruvi ({news.length})</h1>
        <button onClick={() => { setEditingItem(null); setForm({ title: '', titleRu: '', content: '', image: '', imageId: null }); setIsModalOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2">
          <i className="fas fa-plus"></i> Yangi yangilik
        </button>
      </div>

      {news.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Hech qanday yangilik yo'q</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.map(item => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
              {item.image && <img src={item.image} className="w-full h-40 object-cover" alt={item.title} />}
              <div className="p-4">
                <h3 className="font-bold text-lg line-clamp-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.date}</p>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">{item.content}</p>
              </div>
              <div className="border-t p-3 flex gap-2">
                <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><i className="fas fa-edit mr-1"></i> Tahrirlash</button>
                <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><i className="fas fa-trash-alt mr-1"></i> O'chirish</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} title={editingItem ? 'Yangilikni tahrirlash' : 'Yangi yangilik'} onSubmit={handleSubmit} editMode={!!editingItem}>
        <div><label className="block text-sm font-medium mb-1">Sarlavha (UZ) *</label><input type="text" required className="w-full p-2 border rounded-lg" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
        <div><label className="block text-sm font-medium mb-1">Sarlavha (RU)</label><input type="text" className="w-full p-2 border rounded-lg" value={form.titleRu} onChange={e => setForm({...form, titleRu: e.target.value})} /></div>
        <div><label className="block text-sm font-medium mb-1">Matn</label><textarea rows="4" className="w-full p-2 border rounded-lg" value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div>
        <div><label className="block text-sm font-medium mb-1">Rasm</label><div className="border-2 border-dashed p-4 text-center rounded-lg">{form.image ? <div><img src={form.image} className="h-24 mx-auto rounded" /><button type="button" onClick={() => setForm({...form, image: '', imageUrl: '', imageId: null})} className="mt-2 text-sm text-red-500">O'chirish</button></div> : <label className="cursor-pointer block"><i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i><p className="text-sm">{uploadingImage ? 'Yuklanmoqda...' : 'Rasm yuklash'}</p><input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} /></label>}</div></div>
      </AddModal>
    </div>
  );
}
