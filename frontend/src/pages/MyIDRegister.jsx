import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MyIDRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      toast.error('Barcha maydonlarni to\'ldiring!');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Parollar mos kelmadi!');
      return;
    }
    const existingUsers = JSON.parse(localStorage.getItem('myid_users') || '[]');
    if (existingUsers.some(user => user.email === form.email || user.phone === form.phone)) {
      toast.error('Bu email yoki telefon allaqachon ro\'yxatdan o\'tgan!');
      return;
    }
    const newUser = { id: Date.now(), fullName: form.fullName, email: form.email, phone: form.phone, password: form.password, registeredAt: new Date().toLocaleString() };
    existingUsers.push(newUser);
    localStorage.setItem('myid_users', JSON.stringify(existingUsers));
    setLoading(true);
    setTimeout(() => {
      toast.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
      setLoading(false);
      navigate('/myid-login');
    }, 1500);
  };

  return (
    <div className="min-h-screen py-16 pt-28 bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="fas fa-fingerprint text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">MyID ro'yxatdan o'tish</h1>
          <p className="text-gray-500 mt-2">Biometrik identifikatsiya tizimiga ro'yxatdan o'ting</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">To'liq ism *</label><input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Parol *</label><input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlang *</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-red-500" /></div>
            <div className="bg-red-50 p-3 rounded-xl text-center"><i className="fas fa-fingerprint text-red-500 text-2xl"></i><p className="text-xs text-red-600 mt-1">Ro'yxatdan o'tgandan so'ng barmoq izingiz saqlanadi</p></div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:scale-105 transition flex items-center justify-center gap-2">{loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-user-plus"></i>}{loading ? 'Ro\'yxatdan o\'tish...' : 'Ro\'yxatdan o\'tish'}</button>
          </form>
        </div>
        <div className="text-center mt-6"><p className="text-gray-500">Hisobingiz bormi? <Link to="/myid-login" className="text-red-600 hover:underline">Kirish</Link></p><Link to="/contact" className="text-gray-400 hover:text-gray-600 text-sm mt-2 block"><i className="fas fa-arrow-left mr-1"></i> Orqaga qaytish</Link></div>
      </div>
    </div>
  );
}