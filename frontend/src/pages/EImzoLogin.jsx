import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EImzoLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ pinfl: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('eimzo_users') || '[]');
    setUsers(savedUsers);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pinfl || !form.password) {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }
    const existingUsers = JSON.parse(localStorage.getItem('eimzo_users') || '[]');
    const user = existingUsers.find(u => u.pinfl === form.pinfl && u.password === form.password);
    if (!user) {
      toast.error('JShShIR yoki parol xato!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success(`Xush kelibsiz, ${user.fullName}!`);
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  const handleQuickLogin = (user) => {
    setForm({ pinfl: user.pinfl, password: user.password });
  };

  return (
    <div className="min-h-screen py-16 pt-28 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="fas fa-file-signature text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">E-IMZO</h1>
          <p className="text-gray-500 mt-2">Elektron raqamli imzo tizimiga kiring</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Kirish</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">JShShIR (PINFL)</label><input type="text" name="pinfl" value={form.pinfl} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-indigo-500" placeholder="14 raqamli JShShIR" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Parol</label><input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-indigo-500" /></div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:scale-105 transition flex items-center justify-center gap-2">{loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-signature"></i>}{loading ? 'Kirish...' : 'Kirish'}</button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-5"><h2 className="text-xl font-bold text-gray-800">Ro'yxatdan o'tgan foydalanuvchilar</h2><button onClick={() => setShowUsers(!showUsers)} className="text-sm text-indigo-600 hover:underline">{showUsers ? 'Yopish' : 'Ko\'rsatish'}</button></div>
            {showUsers && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.length === 0 ? <div className="text-center py-8 text-gray-500"><i className="fas fa-users text-4xl mb-2"></i><p>Hozircha hech kim ro'yxatdan o'tmagan</p><Link to="/eimzo-register" className="inline-block mt-2 text-indigo-600 hover:underline">Birinchi bo'lib ro'yxatdan o'ting</Link></div> :
                users.map((user) => (<div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"><i className="fas fa-user text-indigo-600"></i></div><div><p className="font-medium text-gray-800">{user.fullName}</p><p className="text-xs text-gray-500">{user.pinfl}</p><p className="text-xs text-gray-400">{user.phone}</p></div></div><button onClick={() => handleQuickLogin(user)} className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">Kirish</button></div>))}
              </div>
            )}
            {!showUsers && (<div className="text-center py-8 text-gray-500"><i className="fas fa-users text-4xl mb-2"></i><p>{users.length} ta foydalanuvchi ro'yxatdan o'tgan</p><button onClick={() => setShowUsers(true)} className="text-indigo-600 hover:underline mt-2">Ko'rish</button></div>)}
          </div>
        </div>
        <div className="text-center mt-6"><p className="text-gray-500">Hisobingiz yo'qmi? <Link to="/eimzo-register" className="text-indigo-600 hover:underline">Ro'yxatdan o'tish</Link></p><Link to="/contact" className="text-gray-400 hover:text-gray-600 text-sm mt-2 block"><i className="fas fa-arrow-left mr-1"></i> Orqaga qaytish</Link></div>
      </div>
    </div>
  );
}