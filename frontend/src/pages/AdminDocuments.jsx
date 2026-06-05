import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import toast from 'react-hot-toast';
import { uploadAPI } from '../services/api';

export default function AdminDocuments() {
  const { documents, addDocument, deleteDocument, updateDocument } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [localDocs, setLocalDocs] = useState([]);
  const [form, setForm] = useState({
    name: '',
    nameRu: '',
    description: '',
    category: 'boshqa',
    fileUrl: '',
    fileId: null,
    fileSize: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  // Local state ni sync qilish
  useEffect(() => {
    if (Array.isArray(documents)) {
      setLocalDocs(documents);
    }
  }, [documents]);

  const categories = [
    { value: 'qonun', label: '📜 Qonun' },
    { value: 'qaror', label: '📋 Qaror' },
    { value: 'farmon', label: '📝 Farmon' },
    { value: 'hisobot', label: '📊 Hisobot' },
    { value: 'nizom', label: '📑 Nizom' },
    { value: 'boshqa', label: '📁 Boshqa' }
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Faqat PDF fayl yuklash mumkin');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Fayl hajmi 10MB dan kichik bo\'lishi kerak');
        return;
      }
      
      try {
        setUploadingFile(true);
        const response = await uploadAPI.uploadSingle(file, '/documents');
        setForm({
          ...form,
          fileUrl: uploadAPI.getFileUrl(response.data.id),
          fileId: response.data.id,
          fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        });
        toast.success('Fayl yuklandi');
      } catch (error) {
        toast.error('Fayl yuklab bo\'lmadi');
      } finally {
        setUploadingFile(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.name) {
      toast.error('Hujjat nomi kiritilmadi');
      return;
    }
    
    const newDoc = {
      name: form.name,
      nameRu: form.nameRu || '',
      description: form.description || '',
      category: form.category,
      fileUrl: form.fileUrl || '',
      fileId: form.fileId || null,
      fileSize: form.fileSize || '0.5 MB',
      date: form.date,
      downloadCount: 0
    };
    
    console.log('Submitting new document:', newDoc);
    addDocument(newDoc);
    toast.success('Hujjat qo\'shildi');
    setIsModalOpen(false);
    setEditingDoc(null);
    resetForm();
    
    // Reload page after 1 second to see changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Hujjat nomi kiritilmadi');
      return;
    }
    
    updateDocument({ ...editingDoc, ...form });
    toast.success('Hujjat yangilandi');
    setIsModalOpen(false);
    setEditingDoc(null);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Ushbu hujjatni o\'chirmoqchimisiz?')) {
      deleteDocument(id);
      toast.success('Hujjat o\'chirildi');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setForm({
      name: doc.name,
      nameRu: doc.nameRu || '',
      description: doc.description || '',
      category: doc.category || 'boshqa',
      fileUrl: doc.fileUrl || '',
      fileId: doc.fileId || null,
      fileSize: doc.fileSize || '0.5 MB',
      date: doc.date || new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      name: '',
      nameRu: '',
      description: '',
      category: 'boshqa',
      fileUrl: '',
      fileId: null,
      fileSize: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : '📁 Boshqa';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📄 Hujjatlar boshqaruvi ({localDocs.length})</h1>
        <button 
          onClick={() => { resetForm(); setEditingDoc(null); setIsModalOpen(true); }} 
          className="px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Yangi hujjat
        </button>
      </div>

      {localDocs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl shadow-sm">
          <i className="mb-4 text-6xl text-gray-300 fas fa-file-alt"></i>
          <p className="text-gray-500">Hech qanday hujjat yo'q</p>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="px-4 py-2 mt-4 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            + Birinchi hujjatni qo'shish
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {localDocs.map(doc => (
            <div key={doc.id} className="p-4 transition-all bg-white shadow-md rounded-xl hover:shadow-lg">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <i className="text-2xl text-red-500 fas fa-file-pdf"></i>
                    <div>
                      <h3 className="text-lg font-bold">{doc.name}</h3>
                      {doc.nameRu && <p className="text-sm text-gray-500">{doc.nameRu}</p>}
                    </div>
                  </div>
                  {doc.description && <p className="mt-2 text-sm text-gray-600">{doc.description}</p>}
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                    <span><i className="fas fa-calendar"></i> {doc.date}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">{getCategoryLabel(doc.category)}</span>
                    <span><i className="fas fa-database"></i> {doc.fileSize || '1.2 MB'}</span>
                    <span><i className="fas fa-download"></i> {doc.downloadCount || 0} marta</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(doc)} className="p-2 text-blue-600 transition rounded-lg bg-blue-50 hover:bg-blue-100" title="Tahrirlash">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="p-2 text-red-600 transition rounded-lg bg-red-50 hover:bg-red-100" title="O'chirish">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 p-4 bg-white border-b">
              <h2 className="text-xl font-bold">{editingDoc ? '✏️ Hujjatni tahrirlash' : '📄 Yangi hujjat'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="absolute text-gray-500 top-4 right-4 hover:text-gray-700">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={editingDoc ? handleUpdate : handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Nomi (UZ) *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Nomi (RU)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg" 
                  value={form.nameRu} 
                  onChange={e => setForm({...form, nameRu: e.target.value})} 
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Tavsif</label>
                <textarea 
                  rows="3" 
                  className="w-full p-2 border rounded-lg" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Kategoriya</label>
                <select 
                  className="w-full p-2 border rounded-lg" 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})}
                >
                  {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Sana</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-lg" 
                  value={form.date} 
                  onChange={e => setForm({...form, date: e.target.value})} 
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">PDF fayl</label>
                <div className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition">
                  {form.fileUrl ? (
                    <div>
                      <i className="text-3xl text-red-500 fas fa-file-pdf"></i>
                      <p className="mt-1 text-sm">{form.fileSize}</p>
                      <button 
                        type="button" 
                        onClick={() => setForm({...form, fileUrl: '', fileId: null, fileSize: ''})} 
                        className="mt-2 text-sm text-red-500 hover:underline"
                      >
                        <i className="fas fa-trash-alt mr-1"></i> O'chirish
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <i className="text-3xl text-gray-400 fas fa-cloud-upload-alt"></i>
                      <p className="text-sm text-gray-500">{uploadingFile ? 'Yuklanmoqda...' : 'PDF fayl yuklash (ixtiyoriy)'}</p>
                      <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} disabled={uploadingFile} />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-2 border rounded-lg hover:bg-gray-50">Bekor</button>
                <button type="submit" className="flex-1 p-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
