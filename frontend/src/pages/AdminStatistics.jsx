import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import AddModal from '../components/AddModal';
import toast from 'react-hot-toast';
import { 
  ChartLine, Users, School, Hospital, Building, Briefcase, 
  TrendingUp, Activity, BarChart3, PieChart, LineChart, 
  DollarSign, Globe, MapPin, Calendar, Clock, Award,
  Target, Zap, Shield, Heart, Star, Home, Car, Wifi, Droplet, Flame
} from 'lucide-react';

export default function AdminStatistics() {
  const { statistics, addStatistic, deleteStatistic, updateStatistic } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchIcon, setSearchIcon] = useState('');
  const [form, setForm] = useState({ label: '', labelRu: '', value: 0, icon: 'ChartLine', color: 'blue' });

  // Barcha iconlar ro'yxati
  const iconList = [
    { name: 'ChartLine', component: ChartLine, keywords: ['chart', 'statistika', 'grafik', 'diagramma'] },
    { name: 'Users', component: Users, keywords: ['aholi', 'odam', 'user', 'people'] },
    { name: 'School', component: School, keywords: ['maktab', 'school', 'ta\'lim', 'education'] },
    { name: 'Hospital', component: Hospital, keywords: ['kasalxona', 'hospital', 'sog\'liq', 'health'] },
    { name: 'Building', component: Building, keywords: ['bino', 'building', 'tashkilot', 'organization'] },
    { name: 'Briefcase', component: Briefcase, keywords: ['ish', 'work', 'biznes', 'business', 'korxona'] },
    { name: 'TrendingUp', component: TrendingUp, keywords: ['o\'sish', 'trend', 'increase'] },
    { name: 'Activity', component: Activity, keywords: ['faoliyat', 'activity'] },
    { name: 'BarChart3', component: BarChart3, keywords: ['bar chart', 'ustunli', 'diagramma'] },
    { name: 'PieChart', component: PieChart, keywords: ['pie chart', 'doiraviy', 'diagramma'] },
    { name: 'LineChart', component: LineChart, keywords: ['line chart', 'chiziqli', 'diagramma'] },
    { name: 'DollarSign', component: DollarSign, keywords: ['pul', 'money', 'daromad', 'iqtisod'] },
    { name: 'Globe', component: Globe, keywords: ['dunyo', 'global', 'xalqaro'] },
    { name: 'MapPin', component: MapPin, keywords: ['joylashuv', 'location', 'manzil'] },
    { name: 'Calendar', component: Calendar, keywords: ['sana', 'date', 'taqvim'] },
    { name: 'Clock', component: Clock, keywords: ['vaqt', 'time', 'soat'] },
    { name: 'Award', component: Award, keywords: ['mukofot', 'award', 'sovrin'] },
    { name: 'Target', component: Target, keywords: ['maqsad', 'target', 'goal'] },
    { name: 'Zap', component: Zap, keywords: ['elektr', 'electric', 'zap'] },
    { name: 'Shield', component: Shield, keywords: ['himoya', 'xavfsizlik', 'security'] },
    { name: 'Heart', component: Heart, keywords: ['sog\'liq', 'health', 'yurak'] },
    { name: 'Star', component: Star, keywords: ['yulduz', 'star', 'baho'] },
    { name: 'Home', component: Home, keywords: ['uy', 'home', 'turarjoy'] },
    { name: 'Car', component: Car, keywords: ['avtomobil', 'car', 'transport'] },
    { name: 'Wifi', component: Wifi, keywords: ['internet', 'wifi', 'aloqa'] },
    { name: 'Droplet', component: Droplet, keywords: ['suv', 'water', 'droplet'] },
    { name: 'Flame', component: Flame, keywords: ['gaz', 'gas', 'flame'] },
  ];

  const getIconComponent = (iconName) => {
    const found = iconList.find(i => i.name === iconName);
    if (found) {
      const IconComponent = found.component;
      return <IconComponent size={24} />;
    }
    return <ChartLine size={24} />;
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    const lowerName = newName.toLowerCase();
    const matched = iconList.find(icon => 
      icon.keywords.some(keyword => lowerName.includes(keyword))
    );
    setForm({ ...form, label: newName, icon: matched ? matched.name : 'ChartLine' });
  };

  const filteredIcons = iconList.filter(icon =>
    icon.name.toLowerCase().includes(searchIcon.toLowerCase()) ||
    icon.keywords.some(keyword => keyword.includes(searchIcon.toLowerCase()))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.label) { toast.error('Statistika nomi kiritilmadi'); return; }
    if (editingItem) { 
      updateStatistic({ ...editingItem, ...form }); 
      toast.success('Statistika yangilandi'); 
    } else { 
      addStatistic({ ...form, id: Date.now() }); 
      toast.success('Statistika qo\'shildi'); 
    }
    setIsModalOpen(false); 
    setEditingItem(null); 
    setForm({ label: '', labelRu: '', value: 0, icon: 'ChartLine', color: 'blue' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      deleteStatistic(id);
      toast.success('Statistika o\'chirildi');
    }
  };

  const getColorBg = (color) => ({ 
    blue: 'bg-blue-100', green: 'bg-green-100', red: 'bg-red-100', 
    purple: 'bg-purple-100', orange: 'bg-orange-100', teal: 'bg-teal-100' 
  }[color] || 'bg-gray-100');
  
  const getColorText = (color) => ({ 
    blue: 'text-blue-600', green: 'text-green-600', red: 'text-red-600', 
    purple: 'text-purple-600', orange: 'text-orange-600', teal: 'text-teal-600' 
  }[color] || 'text-gray-600');
  
  const getBorderColor = (color) => ({ 
    blue: 'border-blue-500', green: 'border-green-500', red: 'border-red-500', 
    purple: 'border-purple-500', orange: 'border-orange-500', teal: 'border-teal-500' 
  }[color] || 'border-gray-500');

  const getGradientColor = (color) => {
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      teal: 'from-teal-500 to-teal-600'
    };
    return gradients[color] || 'from-blue-500 to-blue-600';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
            📊 Statistika boshqaruvi
          </h1>
          <p className="mt-1 text-gray-500">Jami: {statistics.length} ta statistika</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setEditingItem(null); setForm({ label: '', labelRu: '', value: 0, icon: 'ChartLine', color: 'blue' }); setIsModalOpen(true); }} 
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Yangi statistika
        </motion.button>
      </div>

      {statistics.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
            <ChartLine size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-500">Hech qanday statistika yo'q</p>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 mt-4 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
            + Birinchi statistikani qo'shing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statistics.map((item, idx) => {
            const borderColor = getBorderColor(item.color);
            const gradientColor = getGradientColor(item.color);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 ${borderColor} overflow-hidden`}
              >
                <div className={`p-5 text-center bg-gradient-to-br ${gradientColor} bg-opacity-5`}>
                  <div className={`w-20 h-20 ${getColorBg(item.color)} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300 shadow-md`}>
                    {getIconComponent(item.icon)}
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    {item.value.toLocaleString()}
                  </div>
                  <h3 className="mt-2 font-bold text-gray-800">{item.label}</h3>
                  {item.labelRu && <p className="text-xs text-gray-500">{item.labelRu}</p>}
                </div>
                <div className="flex gap-3 p-4 border-t">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { 
                      setEditingItem(item); 
                      setForm({ 
                        label: item.label, 
                        labelRu: item.labelRu || '', 
                        value: item.value, 
                        icon: item.icon || 'ChartLine', 
                        color: item.color || 'blue' 
                      }); 
                      setIsModalOpen(true); 
                    }}
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
            );
          })}
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
                      {editingItem ? '✏️ Statistikani tahrirlash' : '📊 Yangi statistika'}
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
                      value={form.label}
                      onChange={handleNameChange}
                      placeholder="Masalan: Aholi soni"
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
                      value={form.labelRu}
                      onChange={e => setForm({...form, labelRu: e.target.value})}
                      placeholder="Например: Численность населения"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Qiymat
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    value={form.value}
                    onChange={e => setForm({...form, value: parseInt(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Icon tanlash
                  </label>
                  <div className="relative mb-3">
                    <i className="absolute text-sm text-gray-400 -translate-y-1/2 fas fa-search left-3 top-1/2"></i>
                    <input
                      type="text"
                      placeholder="Icon qidirish..."
                      className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      value={searchIcon}
                      onChange={(e) => setSearchIcon(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-6 gap-2 p-2 overflow-y-auto border border-gray-200 max-h-48 rounded-xl bg-gray-50">
                    {filteredIcons.map(icon => {
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
                    Rang
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['blue', 'green', 'red', 'purple', 'orange', 'teal'].map(color => (
                      <motion.button
                        key={color}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setForm({...form, color})}
                        className={`w-10 h-10 rounded-full transition-all ${
                          form.color === color 
                            ? `ring-2 ring-offset-2 ring-${color}-500 scale-110` 
                            : ''
                        }`}
                        style={{ backgroundColor: color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : color === 'red' ? '#ef4444' : color === 'purple' ? '#8b5cf6' : color === 'orange' ? '#f59e0b' : '#14b8a6' }}
                      />
                    ))}
                  </div>
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