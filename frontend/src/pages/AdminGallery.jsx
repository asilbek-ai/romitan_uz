import React, { useState, useContext } from "react";
import { AppContext } from "../App";
import { motion } from "framer-motion";
import AddModal from "../components/AddModal";
import toast from "react-hot-toast";
import { uploadAPI } from "../services/api";

export default function AdminGallery() {
  const { gallery, addGallery, deleteGallery, updateGallery } =
    useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ image: "", imageId: null, title: "", titleRu: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        setUploadingImage(true);
        const response = await uploadAPI.uploadSingle(file, "/media");
        setForm({
          ...form,
          image: uploadAPI.getFileUrl(response.data.id),
          imageUrl: uploadAPI.getFileUrl(response.data.id),
          imageId: response.data.id,
        });
        toast.success("Rasm yuklandi");
      } catch (error) {
        toast.error("Rasm yuklab bo'lmadi");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.image) {
      toast.error("Rasm kiritilmadi");
      return;
    }
    if (editingItem) {
      updateGallery({ ...editingItem, ...form });
      toast.success("Rasm yangilandi");
    } else {
      addGallery({ ...form, id: Date.now() });
      toast.success("Rasm qo'shildi");
    }
    setIsModalOpen(false);
    setEditingItem(null);
    setForm({ image: "", imageId: null, title: "", titleRu: "" });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          🖼️ Galereya boshqaruvi ({gallery.length})
        </h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setForm({ image: "", imageId: null, title: "", titleRu: "" });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Yangi rasm
        </button>
      </div>
      {gallery.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <i className="fas fa-images text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Hech qanday rasm yo'q</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <img src={item.image} className="w-full h-40 object-cover" />
              <div className="p-3">
                <h3 className="font-bold text-sm">{item.title}</h3>
                {item.titleRu && (
                  <p className="text-xs text-gray-500">{item.titleRu}</p>
                )}
              </div>
              <div className="border-t p-2 flex gap-2">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setForm({
                      image: item.image,
                      imageId: item.imageId || null,
                      title: item.title || "",
                      titleRu: item.titleRu || "",
                    });
                    setIsModalOpen(true);
                  }}
                  className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition"
                >
                  <i className="fas fa-edit"></i> Tahrirlash
                </button>
                <button
                  onClick={() => {
                    if (confirm("O'chirilsinmi?")) {
                      deleteGallery(item.id);
                      toast.success("Rasm o'chirildi");
                    }
                  }}
                  className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition"
                >
                  <i className="fas fa-trash-alt"></i> O'chirish
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
        title={editingItem ? "Rasmni tahrirlash" : "Yangi rasm"}
        onSubmit={handleSubmit}
        editMode={!!editingItem}
      >
        <div>
          <label className="block text-sm font-medium mb-1">Rasm *</label>
          <div className="border-2 border-dashed p-4 text-center rounded-lg">
            {form.image ? (
              <div>
                <img src={form.image} className="h-32 mx-auto rounded" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "", imageUrl: "", imageId: null })}
                  className="mt-2 text-sm text-red-500"
                >
                  O'chirish
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                <p className="text-sm">{uploadingImage ? "Yuklanmoqda..." : "Rasm yuklash"}</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Sarlavha (UZ)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Sarlavha (RU)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={form.titleRu}
            onChange={(e) => setForm({ ...form, titleRu: e.target.value })}
          />
        </div>
      </AddModal>
    </div>
  );
}
