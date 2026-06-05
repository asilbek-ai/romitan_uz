import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { motion } from 'framer-motion';
import AddModal from '../components/AddModal';
import toast from 'react-hot-toast';

export default function AdminCarousel() {
  const { adminData, addCarousel, deleteCarousel, updateCarousel } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ image: '', title: '', titleRu: '' });
  const [carouselList, setCarouselList] = useState([]);

  // Ma'lumotlar o'zgarganda yangilash
  useEffect(() => {
    if (adminData?.carousel && Array.isArray(adminData.carousel)) {
      setCarouselList(adminData.carousel);
    } else {
      setCarouselList([]);
    }
  }, [adminData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Rasm hajmini cheklash (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Rasm hajmi 2MB dan kichik bo\'lishi kerak');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    } else {
      toast.error('Faqat rasm fayli tanlang');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.image) { 
      toast.error('Rasm kiritilmadi'); 
      return; 
    }
    
    const newItem = {
      id: editingItem ? editingItem.id : Date.now(),
      image: form.image,
      title: form.title || '',
      titleRu: form.titleRu || ''
    };
    
    if (editingItem) { 
      updateCarousel(newItem); 
      toast.success('Rasm yangilandi'); 
    } else { 
      addCarousel(newItem); 
      toast.success('Rasm qo\'shildi'); 
    }
    
    setIsModalOpen(false); 
    setEditingItem(null); 
    setForm({ image: '', title: '', titleRu: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Ushbu rasmni o\'chirmoqchimisiz?')) {
      deleteCarousel(id);
      toast.success('Rasm o\'chirildi');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎠 Karusel boshqaruvi ({carouselList.length})</h1>
        <button 
          onClick={() => { 
            setEditingItem(null); 
            setForm({ image: '', title: '', titleRu: '' }); 
            setIsModalOpen(true); 
          }} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Yangi rasm
        </button>
      </div>

      {carouselList.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <i className="fas fa-images text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Hech qanday rasm yo'q</p>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Birinchi rasm qo'shish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carouselList.map((item, idx) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              whileHover={{ y: -5 }} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="relative h-40 bg-gray-100">
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover" 
                  alt={item.title || 'Carousel image'} 
                  onError={(e) => { 
                    e.target.src = 'https://via.placeholder.com/400x200?text=Rasm+topilmadi';
                  }}
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  #{idx + 1}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-800">{item.title || 'Sarlavha yo\'q'}</h3>
                {item.titleRu && <p className="text-sm text-gray-500">{item.titleRu}</p>}
              </div>
              <div className="border-t p-3 flex gap-2">
                <button 
                  onClick={() => { 
                    setEditingItem(item); 
                    setForm({ 
                      image: item.image, 
                      title: item.title || '', 
                      titleRu: item.titleRu || '' 
                    }); 
                    setIsModalOpen(true); 
                  }} 
                  className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  <i className="fas fa-edit mr-1"></i> Tahrirlash
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
                >
                  <i className="fas fa-trash-alt mr-1"></i> O'chirish
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddModal 
        isOpen={isModalOpen} 
        onClose={() => { 
          setIsModalOpen(false); 
          setEditingItem(null); 
        }} 
        title={editingItem ? 'Rasmni tahrirlash' : 'Yangi rasm'} 
        onSubmit={handleSubmit} 
        editMode={!!editingItem}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rasm *</label>
            <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-lg hover:border-blue-500 transition">
              {form.image ? (
                <div className="relative inline-block">
                  <img src={form.image} className="h-32 w-auto mx-auto rounded object-cover" alt="preview" />
                  <button 
                    type="button"
                    onClick={() => setForm({ ...form, image: '' })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-500">Rasm yuklash uchun bosing</p>
                  <p className="text-xs text-gray-400">JPG, PNG (max 2MB)</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sarlavha (UZ)</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              placeholder="Masalan: Jondor tumani manzarasi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sarlavha (RU)</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={form.titleRu} 
              onChange={e => setForm({...form, titleRu: e.target.value})} 
              placeholder="Например: Вид Джондорского района"
            />
          </div>
        </div>
      </AddModal>
    </div>
  );
}