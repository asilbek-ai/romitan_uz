import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Settings, FileText, Building, Users, Landmark, Briefcase, 
  Shield, Truck, Wifi, Droplet, Flame, Zap, School, Hospital, 
  ShoppingBag, Home, Car, Phone, Mail, MapPin, Calendar, Clock,
  User, Heart, Star, Award, Gift, Coffee, Sun, Moon, Cloud, 
  Camera, Video, Music, Book, PenTool, Database, Server,
  Headphones, Key, Lock, Map, Globe, MessageCircle, Bell, 
  AlertCircle, CheckCircle, XCircle, Search
} from 'lucide-react';

export default function AdminServices() {
  const { services, addService, deleteService, updateService } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: '', nameRu: '', icon: 'Settings', description: '', department: '' });
  const [searchIcon, setSearchIcon] = useState('');

  // Barcha iconlar ro'yxati
  const iconList = [
    { name: 'Settings', component: Settings, keywords: ['sozlama', 'setting', 'config'] },
    { name: 'FileText', component: FileText, keywords: ['hujjat', 'document', 'file', 'papka'] },
    { name: 'Building', component: Building, keywords: ['bino', 'building', 'tashkilot', 'organization'] },
    { name: 'Users', component: Users, keywords: ['odam', 'user', 'xodim', 'employee'] },
    { name: 'Landmark', component: Landmark, keywords: ['davlat', 'government', 'hukumat', 'state'] },
    { name: 'Briefcase', component: Briefcase, keywords: ['ish', 'work', 'biznes', 'business', 'korxona'] },
    { name: 'Shield', component: Shield, keywords: ['himoya', 'xavfsizlik', 'security', 'shield'] },
    { name: 'Truck', component: Truck, keywords: ['yuk', 'transport', 'truck', 'mashina'] },
    { name: 'Wifi', component: Wifi, keywords: ['internet', 'wifi', 'aloqa', 'network'] },
    { name: 'Droplet', component: Droplet, keywords: ['suv', 'water', 'droplet'] },
    { name: 'Flame', component: Flame, keywords: ['gaz', 'gas', 'flame', 'olov'] },
    { name: 'Zap', component: Zap, keywords: ['elektr', 'electric', 'zap', 'light'] },
    { name: 'School', component: School, keywords: ['maktab', 'school', 'talim', 'education'] },
    { name: 'Hospital', component: Hospital, keywords: ['kasalxona', 'hospital', 'sog\'liq', 'health'] },
    { name: 'ShoppingBag', component: ShoppingBag, keywords: ['savdo', 'shop', 'bozor', 'market'] },
    { name: 'Home', component: Home, keywords: ['uy', 'home', 'turarjoy', 'residence'] },
    { name: 'Car', component: Car, keywords: ['avtomobil', 'car', 'vehicle', 'mashina'] },
    { name: 'Phone', component: Phone, keywords: ['telefon', 'phone', 'call'] },
    { name: 'Mail', component: Mail, keywords: ['pochta', 'mail', 'email'] },
    { name: 'MapPin', component: MapPin, keywords: ['manzil', 'address', 'location', 'joy'] },
    { name: 'Calendar', component: Calendar, keywords: ['sana', 'date', 'calendar', 'taqvim'] },
    { name: 'Clock', component: Clock, keywords: ['vaqt', 'time', 'clock', 'soat'] },
    { name: 'User', component: User, keywords: ['shaxs', 'person', 'user', 'foydalanuvchi'] },
    { name: 'Heart', component: Heart, keywords: ['sevgi', 'love', 'heart', 'yurak'] },
    { name: 'Star', component: Star, keywords: ['yulduz', 'star', 'mukofot', 'award'] },
    { name: 'Award', component: Award, keywords: ['sovrin', 'award', 'medal'] },
    { name: 'Coffee', component: Coffee, keywords: ['kafe', 'coffee', 'qahva'] },
    { name: 'Camera', component: Camera, keywords: ['kamera', 'camera', 'surat', 'photo'] },
    { name: 'Video', component: Video, keywords: ['video', 'film'] },
    { name: 'Music', component: Music, keywords: ['musiqa', 'music', 'qo\'shiq'] },
    { name: 'Book', component: Book, keywords: ['kitob', 'book', 'adabiyot'] },
    { name: 'PenTool', component: PenTool, keywords: ['yozuv', 'pen', 'qalam'] },
    { name: 'Database', component: Database, keywords: ['ma\'lumot', 'database', 'baza'] },
    { name: 'Server', component: Server, keywords: ['server', 'kompyuter'] },
    { name: 'Headphones', component: Headphones, keywords: ['quloqchin', 'headphone'] },
    { name: 'Key', component: Key, keywords: ['kalit', 'key', 'maxfiy'] },
    { name: 'Lock', component: Lock, keywords: ['qulf', 'lock', 'xavfsiz'] },
    { name: 'Map', component: Map, keywords: ['xarita', 'map', 'joylashuv'] },
    { name: 'Globe', component: Globe, keywords: ['dunyo', 'globe', 'global'] },
    { name: 'MessageCircle', component: MessageCircle, keywords: ['xabar', 'message', 'chat'] },
    { name: 'Bell', component: Bell, keywords: ['bildirishnoma', 'bell', 'notification'] },
    { name: 'AlertCircle', component: AlertCircle, keywords: ['ogohlantirish', 'alert', 'warning'] },
    { name: 'CheckCircle', component: CheckCircle, keywords: ['tasdiqlash', 'check', 'confirm'] },
    { name: 'XCircle', component: XCircle, keywords: ['bekor qilish', 'cancel', 'delete'] },
  ];

  // So'zga qarab icon tanlash
  const suggestIcon = (text) => {
    const lowerText = text.toLowerCase();
    const matched = iconList.find(icon => 
      icon.keywords.some(keyword => lowerText.includes(keyword))
    );
    return matched ? matched.name : 'Settings';
  };

  // Icon nomini o'zgartirganda
  const handleNameChange = (e) => {
    const newName = e.target.value;
    const suggestedIcon = suggestIcon(newName);
    setForm({ ...form, name: newName, icon: suggestedIcon });
  };

  // Filtrlangan iconlar
  const filteredIcons = iconList.filter(icon =>
    icon.name.toLowerCase().includes(searchIcon.toLowerCase()) ||
    icon.keywords.some(keyword => keyword.includes(searchIcon.toLowerCase()))
  );

  const getIconComponent = (iconName) => {
    const found = iconList.find(i => i.name === iconName);
    if (found) {
      const IconComponent = found.component;
      return <IconComponent size={24} />;
    }
    return <Settings size={24} />;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Xizmat nomi kiritilmadi'); return; }
    if (editingItem) { 
      updateService({ ...editingItem, ...form }); 
      toast.success('Xizmat yangilandi'); 
    } else { 
      addService({ ...form, id: Date.now() }); 
      toast.success('Xizmat qo\'shildi'); 
    }
    setIsModalOpen(false); 
    setEditingItem(null); 
    setForm({ name: '', nameRu: '', icon: 'Settings', description: '', department: '' });
    setSearchIcon('');
  };

  const handleEdit = (item) => { 
    setEditingItem(item); 
    setForm({ 
      name: item.name, 
      nameRu: item.nameRu || '', 
      icon: item.icon || 'Settings', 
      description: item.description || '', 
      department: item.department || '' 
    }); 
    setIsModalOpen(true); 
  };
  
  const handleDelete = (id) => { 
    if (window.confirm('Ushbu xizmatni o\'chirmoqchimisiz?')) { 
      deleteService(id); 
      toast.success('Xizmat o\'chirildi'); 
    } 
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
            ⚙️ Xizmatlar boshqaruvi
          </h1>
          <p className="mt-1 text-gray-500">Jami: {services?.length || 0} ta xizmat</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { 
            setEditingItem(null); 
            setForm({ name: '', nameRu: '', icon: 'Settings', description: '', department: '' }); 
            setSearchIcon('');
            setIsModalOpen(true); 
          }} 
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Yangi xizmat
        </motion.button>
      </div>

      {!services || services.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
            <Settings size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-500">Hech qanday xizmat yo'q</p>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 mt-4 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
            + Birinchi xizmatni qo'shing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-md group rounded-2xl hover:shadow-xl"
            >
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-center text-white transition duration-300 shadow-md w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl group-hover:scale-110">
                  {getIconComponent(item.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  {item.nameRu && <p className="text-sm text-gray-500">{item.nameRu}</p>}
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
                  {item.description || 'Tavsif mavjud emas'}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-flex">
                  <Building size={12} />
                  <span>{item.department || 'Departament mavjud emas'}</span>
                </div>
              </div>
              <div className="flex gap-3 p-4 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEdit(item)}
                  className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2 font-medium"
                >
                  <i className="fas fa-edit"></i> Tahrirlash
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2 font-medium"
                >
                  <i className="fas fa-trash-alt"></i> O'chirish
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 p-5 bg-white border-b border-gray-100 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                      {getIconComponent(form.icon)}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {editingItem ? '✏️ Xizmatni tahrirlash' : '📋 Yangi xizmat'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center justify-center w-8 h-8 text-gray-400 transition rounded-lg hover:text-gray-600 hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nomi (O'zbek) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="Masalan: Hujjat rasmiylashtirish"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      <i className="mr-1 text-blue-500 fas fa-magic"></i> 
                      Nomi bo'yicha icon avtomatik tanlanadi
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nomi (Русский)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                      value={form.nameRu}
                      onChange={e => setForm({...form, nameRu: e.target.value})}
                      placeholder="Например: Оформление документов"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Icon tanlash
                  </label>
                  <div className="relative mb-3">
                    <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      placeholder="Icon qidirish..."
                      className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      value={searchIcon}
                      onChange={(e) => setSearchIcon(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-6 gap-2 p-2 overflow-y-auto border border-gray-200 max-h-48 rounded-xl bg-gray-50">
                    {filteredIcons.slice(0, 30).map(icon => {
                      const IconComp = icon.component;
                      const isSelected = form.icon === icon.name;
                      return (
                        <motion.button
                          key={icon.name}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setForm({...form, icon: icon.name})}
                          className={`p-2 rounded-lg transition-all ${
                            isSelected 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }`}
                          title={icon.name}
                        >
                          <IconComp size={20} className="mx-auto" />
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <span className="text-gray-500">Tanlangan icon:</span>
                    <div className="flex items-center justify-center w-8 h-8 text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                      {getIconComponent(form.icon)}
                    </div>
                    <code className="px-2 py-1 text-xs bg-gray-100 rounded">{form.icon}</code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tavsif
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition resize-none"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="Xizmat haqida qisqacha tavsif..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Departament / Mas'ul tashkilot
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    value={form.department}
                    onChange={e => setForm({...form, department: e.target.value})}
                    placeholder="Masalan: Markaziy davlat xizmatlari"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    Bekor qilish
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition font-medium flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-save"></i> Saqlash
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}