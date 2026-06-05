import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiImage, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { mediaAPI, toApiUrl, uploadAPI } from '../services/api';

export default function AdminMedia() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageId, setImageId] = useState(null);
  const [title, setTitle] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await mediaAPI.getAll();
      setGallery(res.data.map(item => ({
        ...item,
        image: toApiUrl(item.imageUrl),
      })));
    } catch (error) {
      toast.error('Galeriyani yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error('Rasm URL kiritilmadi');
      return;
    }
    try {
      await mediaAPI.create({ imageUrl, imageId, title, titleRu });
      toast.success('Rasm qo\'shildi');
      fetchGallery();
      setIsModalOpen(false);
      setImageUrl('');
      setImageId(null);
      setTitle('');
      setTitleRu('');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Rasmni o\'chirishni tasdiqlaysizmi?')) {
      try {
        await mediaAPI.delete(id);
        toast.success('Rasm o\'chirildi');
        fetchGallery();
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadAPI.uploadSingle(file, '/media');
      setImageId(res.data.id);
      setImageUrl(uploadAPI.getFileUrl(res.data.id));
      toast.success('Rasm yuklandi');
    } catch (error) {
      toast.error('Rasm yuklab bo\'lmadi');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Yuklanmoqda...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media galereya</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-primary"><FiPlus /> Yangi rasm</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="relative group overflow-hidden rounded-xl bg-white shadow"
          >
            <img src={item.image} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-full text-red-500"><FiTrash2 /></button>
            </div>
            {item.title && <div className="p-2 text-center bg-white"><p className="text-sm font-medium truncate">{item.title}</p></div>}
          </motion.div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Yangi rasm</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 text-center border-2 border-dashed rounded">
                {imageUrl ? (
                  <div>
                    <img src={imageUrl} className="h-32 mx-auto rounded object-cover" />
                    <button type="button" onClick={() => { setImageUrl(''); setImageId(null); }} className="mt-2 text-sm text-red-500">O'chirish</button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <FiUpload className="mx-auto mb-2 text-3xl text-gray-400" />
                    <p className="text-sm text-gray-500">{uploading ? 'Yuklanmoqda...' : 'Rasm yuklash'}</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
              </div>
              <input type="text" placeholder="Sarlavha (UZ)" className="w-full p-2 border rounded" value={title} onChange={e => setTitle(e.target.value)} />
              <input type="text" placeholder="Sarlavha (RU)" className="w-full p-2 border rounded" value={titleRu} onChange={e => setTitleRu(e.target.value)} />
              <div className="flex gap-2"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-2 border rounded">Bekor</button><button type="submit" className="flex-1 p-2 bg-primary text-white rounded">Saqlash</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
