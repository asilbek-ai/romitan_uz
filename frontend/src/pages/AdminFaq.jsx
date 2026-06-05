import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { motion } from 'framer-motion';
import AddModal from '../components/AddModal';
import toast from 'react-hot-toast';

export default function AdminFaq() {
  const { faqs, addFaq, deleteFaq, updateFaq } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ question: '', questionRu: '', answer: '', answerRu: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.question) { toast.error('Savol kiritilmadi'); return; }
    if (editingItem) { updateFaq({ ...editingItem, ...form }); toast.success('FAQ yangilandi'); }
    else { addFaq({ ...form, id: Date.now() }); toast.success('FAQ qo\'shildi'); }
    setIsModalOpen(false); setEditingItem(null); setForm({ question: '', questionRu: '', answer: '', answerRu: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">❓ FAQ boshqaruvi ({faqs.length})</h1>
        <button onClick={() => { setEditingItem(null); setForm({ question: '', questionRu: '', answer: '', answerRu: '' }); setIsModalOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"><i className="fas fa-plus"></i> Yangi savol</button>
      </div>
      {faqs.length === 0 ? (<div className="bg-white rounded-xl p-12 text-center"><i className="fas fa-question-circle text-6xl text-gray-300 mb-4"></i><p className="text-gray-500">Hech qanday savol yo'q</p></div>) : (
        <div className="space-y-3">
          {faqs.map(item => (<motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ x: 5 }} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
            <div className="p-4 border-b bg-gray-50"><div className="flex justify-between items-center"><h3 className="font-bold text-lg">❓ {item.question}</h3><div className="flex gap-2"><button onClick={() => { setEditingItem(item); setForm({ question: item.question, questionRu: item.questionRu || '', answer: item.answer || '', answerRu: item.answerRu || '' }); setIsModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><i className="fas fa-edit"></i></button><button onClick={() => { if (confirm('O\'chirilsinmi?')) { deleteFaq(item.id); toast.success('FAQ o\'chirildi'); } }} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><i className="fas fa-trash-alt"></i></button></div></div></div>
            <div className="p-4"><p className="text-gray-600">💡 {item.answer}</p>{item.answerRu && <p className="text-gray-500 text-sm mt-2">{item.answerRu}</p>}</div>
          </motion.div>))}
        </div>
      )}
      <AddModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} title={editingItem ? 'Savolni tahrirlash' : 'Yangi savol'} onSubmit={handleSubmit} editMode={!!editingItem}>
        <div><label className="block text-sm font-medium mb-1">Savol (UZ) *</label><input type="text" required className="w-full p-2 border rounded-lg" value={form.question} onChange={e => setForm({...form, question: e.target.value})} /></div>
        <div><label className="block text-sm font-medium mb-1">Savol (RU)</label><input type="text" className="w-full p-2 border rounded-lg" value={form.questionRu} onChange={e => setForm({...form, questionRu: e.target.value})} /></div>
        <div><label className="block text-sm font-medium mb-1">Javob (UZ)</label><textarea rows="3" className="w-full p-2 border rounded-lg" value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} /></div>
        <div><label className="block text-sm font-medium mb-1">Javob (RU)</label><textarea rows="3" className="w-full p-2 border rounded-lg" value={form.answerRu} onChange={e => setForm({...form, answerRu: e.target.value})} /></div>
      </AddModal>
    </div>
  );
}