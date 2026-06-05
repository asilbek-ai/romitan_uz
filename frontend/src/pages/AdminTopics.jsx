import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import toast from 'react-hot-toast';

export default function AdminTopics() {
  const { topics, addTopic, updateTopic, deleteTopic } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    icon: 'fa-landmark',
    titleUz: '',
    titleRu: '',
    titleEn: '',
    image: '',
    descUz: '',
    descRu: '',
    descEn: ''
  });

  useEffect(() => {
    if (topics) {
      setLoading(false);
    }
  }, [topics]);

  const icons = [
    'fa-landmark', 'fa-history', 'fa-map-marker-alt', 'fa-users', 'fa-chart-line',
    'fa-theater-masks', 'fa-user-tie', 'fa-school', 'fa-hospital', 'fa-phone-alt',
    'fa-building', 'fa-tree', 'fa-water', 'fa-tractor', 'fa-apple-alt'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.titleUz) {
      toast.error('Nomi kiritilmadi');
      return;
    }
    
    const newTopic = {
      icon: form.icon,
      title: { uz: form.titleUz, ru: form.titleRu || form.titleUz, en: form.titleEn || form.titleUz },
      image: form.image || 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?w=400',
      description: { 
        uz: form.descUz || 'Maʼlumot kiritilmagan', 
        ru: form.descRu || form.descUz || 'Информация не указана', 
        en: form.descEn || form.descUz || 'No information'
      }
    };
    
    if (editingTopic) {
      updateTopic(editingTopic.id, newTopic);
      toast.success('Mavzu yangilandi');
    } else {
      addTopic(newTopic);
      toast.success('Mavzu qo\'shildi');
    }
    
    setIsModalOpen(false);
    setEditingTopic(null);
    resetForm();
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setForm({
      icon: topic.icon || 'fa-landmark',
      titleUz: topic.title?.uz || '',
      titleRu: topic.title?.ru || '',
      titleEn: topic.title?.en || '',
      image: topic.image || '',
      descUz: topic.description?.uz || '',
      descRu: topic.description?.ru || '',
      descEn: topic.description?.en || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Ushbu mavzuni o\'chirmoqchimisiz?')) {
      deleteTopic(id);
      toast.success('Mavzu o\'chirildi');
    }
  };

  const resetForm = () => {
    setForm({
      icon: 'fa-landmark',
      titleUz: '',
      titleRu: '',
      titleEn: '',
      image: '',
      descUz: '',
      descRu: '',
      descEn: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const topicsList = Array.isArray(topics) ? topics : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📱 Mobile Mavzular boshqaruvi ({topicsList.length})</h1>
        <button
          onClick={() => { resetForm(); setEditingTopic(null); setIsModalOpen(true); }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Yangi mavzu
        </button>
      </div>

      {topicsList.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <i className="fas fa-mobile-alt text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Hech qanday mavzu yo'q</p>
          <button onClick={() => { resetForm(); setEditingTopic(null); setIsModalOpen(true); }} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
            + Birinchi mavzuni qo'shish
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topicsList.map(topic => (
            <div key={topic.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="flex p-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <i className={`fas ${topic.icon} text-xl text-indigo-600`}></i>
                </div>
                <div className="flex-1 ml-3">
                  <h3 className="font-bold text-gray-800">{topic.title?.uz || 'Noma\'lum'}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {topic.description?.uz?.substring(0, 50)}...
                  </p>
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => handleEdit(topic)} className="text-indigo-600 text-sm hover:text-indigo-700">
                      <i className="fas fa-edit"></i> Tahrirlash
                    </button>
                    <button onClick={() => handleDelete(topic.id)} className="text-red-600 text-sm hover:text-red-700">
                      <i className="fas fa-trash-alt"></i> O'chirish
                    </button>
                  </div>
                </div>
              </div>
              {topic.image && (
                <img src={topic.image} className="h-24 w-full object-cover" alt={topic.title?.uz} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 p-4 bg-white border-b">
              <h2 className="text-xl font-bold">{editingTopic ? '✏️ Mavzuni tahrirlash' : '📱 Yangi mavzu'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Belgi (icon)</label>
                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm({...form, icon})}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        form.icon === icon ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <i className={`fas ${icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nomi (O'zbek) *</label>
                  <input type="text" required className="w-full p-2 border rounded-lg" value={form.titleUz} onChange={e => setForm({...form, titleUz: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nomi (Русский)</label>
                  <input type="text" className="w-full p-2 border rounded-lg" value={form.titleRu} onChange={e => setForm({...form, titleRu: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nomi (English)</label>
                  <input type="text" className="w-full p-2 border rounded-lg" value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rasm URL</label>
                <input type="text" className="w-full p-2 border rounded-lg" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." />
                {form.image && (
                  <img src={form.image} className="mt-2 w-32 h-20 object-cover rounded" alt="preview" />
                )}
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tavsif (O'zbek)</label>
                  <textarea rows="4" className="w-full p-2 border rounded-lg" value={form.descUz} onChange={e => setForm({...form, descUz: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tavsif (Русский)</label>
                  <textarea rows="4" className="w-full p-2 border rounded-lg" value={form.descRu} onChange={e => setForm({...form, descRu: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tavsif (English)</label>
                  <textarea rows="4" className="w-full p-2 border rounded-lg" value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-2 border rounded-lg hover:bg-gray-50">
                  Bekor qilish
                </button>
                <button type="submit" className="flex-1 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <i className="fas fa-save mr-1"></i> Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}