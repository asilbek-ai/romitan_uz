import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiClock, FiMapPin, FiPhone, FiCalendar, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AppContext } from '../App';

export default function AdminReception() {
  const { t } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    governor: {
      days: 'Dushanba - Juma',
      daysRu: 'Понедельник - Пятница',
      time: '15:00 - 17:00',
      location: 'Hokimiyat binosi, 2-qavat',
      locationRu: 'Здание хокимията, 2-этаж'
    },
    citizens: {
      days: 'Har payshanba',
      daysRu: 'Каждый четверг',
      time: '10:00 - 13:00',
      phone: '+998 65 380-00-00',
      phoneRu: '+998 65 380-00-00'
    }
  });

  useEffect(() => {
    fetchReceptionHours();
  }, []);

  const fetchReceptionHours = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reception');
      if (res.data) {
        setForm(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/reception', form);
      toast.success('Qabul jadvali yangilandi');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form.governor.days) {
    return <div className="p-8 text-center">Yuklanmoqda...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Qabul jadvali boshqaruvi</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Governor Reception */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-2">
              <FiUser className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Tuman hokimi qabuli</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium">Kunlar (UZ)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  value={form.governor.days}
                  onChange={(e) => setForm({ ...form, governor: { ...form.governor, days: e.target.value } })}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Kunlar (RU)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.governor.daysRu}
                  onChange={(e) => setForm({ ...form, governor: { ...form.governor, daysRu: e.target.value } })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium">Vaqt</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.governor.time}
                  onChange={(e) => setForm({ ...form, governor: { ...form.governor, time: e.target.value } })}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Manzil (UZ)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.governor.location}
                  onChange={(e) => setForm({ ...form, governor: { ...form.governor, location: e.target.value } })}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Manzil (RU)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={form.governor.locationRu}
                onChange={(e) => setForm({ ...form, governor: { ...form.governor, locationRu: e.target.value } })}
              />
            </div>
          </div>
        </div>

        {/* Citizens Reception */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b bg-gradient-to-r from-green-50 to-white">
            <div className="flex items-center gap-2">
              <FiUsers className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Fuqarolar qabuli</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium">Kunlar (UZ)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.citizens.days}
                  onChange={(e) => setForm({ ...form, citizens: { ...form.citizens, days: e.target.value } })}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Kunlar (RU)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.citizens.daysRu}
                  onChange={(e) => setForm({ ...form, citizens: { ...form.citizens, daysRu: e.target.value } })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium">Vaqt</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.citizens.time}
                  onChange={(e) => setForm({ ...form, citizens: { ...form.citizens, time: e.target.value } })}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Telefon</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.citizens.phone}
                  onChange={(e) => setForm({ ...form, citizens: { ...form.citizens, phone: e.target.value } })}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Telefon (RU)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={form.citizens.phoneRu}
                onChange={(e) => setForm({ ...form, citizens: { ...form.citizens, phoneRu: e.target.value } })}
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">Oldindan ko‘rish</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <FiUser className="text-blue-600" />
                  <h3 className="font-semibold">Tuman hokimi</h3>
                </div>
                <p className="text-sm"><FiCalendar className="inline mr-2 text-gray-500" /> {form.governor.days}</p>
                <p className="text-sm"><FiClock className="inline mr-2 text-gray-500" /> {form.governor.time}</p>
                <p className="text-sm"><FiMapPin className="inline mr-2 text-gray-500" /> {form.governor.location}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <FiUsers className="text-green-600" />
                  <h3 className="font-semibold">Fuqarolar qabuli</h3>
                </div>
                <p className="text-sm"><FiCalendar className="inline mr-2 text-gray-500" /> {form.citizens.days}</p>
                <p className="text-sm"><FiClock className="inline mr-2 text-gray-500" /> {form.citizens.time}</p>
                <p className="text-sm"><FiPhone className="inline mr-2 text-gray-500" /> {form.citizens.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave />}
            Saqlash
          </button>
        </div>
      </form>
    </div>
  );
}