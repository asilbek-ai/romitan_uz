import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiCheckCircle, FiClock, FiXCircle, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function OnlineReception() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState('submit');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    passport: '',
    message: ''
  });
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingStatus, setTrackingStatus] = useState(null);
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.passport || !form.message) {
      toast.error(t('Barcha majburiy maydonlarni to\'ldiring!', 'Заполните все обязательные поля!'));
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('fullName', form.fullName);
    formData.append('phone', form.phone);
    formData.append('passport', form.passport);
    formData.append('message', form.message);
    if (file) formData.append('file', file);

    try {
      const res = await api.post('/online-reception/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setSubmitted(true);
        setTrackingCode(res.data.applicationId);
        toast.success(t('Murojaatingiz qabul qilindi!', 'Ваше обращение принято!'));
        setForm({ fullName: '', phone: '', passport: '', message: '' });
        setFile(null);
      }
    } catch (error) {
      toast.error(t('Xatolik yuz berdi', 'Произошла ошибка'));
    } finally {
      setLoading(false);
    }
  };

  const trackApplication = async () => {
    if (!trackingId) {
      toast.error(t('Ariza raqamini kiriting', 'Введите номер заявки'));
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/online-reception/track/${trackingId}`);
      if (res.data) {
        setTrackingStatus(res.data);
      } else {
        toast.error(t('Bunday ariza topilmadi', 'Заявка не найдена'));
      }
    } catch (error) {
      toast.error(t('Xatolik yuz berdi', 'Произошла ошибка'));
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: { icon: FiClock, color: 'text-yellow-500', bg: 'bg-yellow-50', label: t('Kutilmoqda', 'В ожидании') },
    processing: { icon: FiClock, color: 'text-blue-500', bg: 'bg-blue-50', label: t('Ko\'rib chiqilmoqda', 'Рассматривается') },
    completed: { icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: t('Bajarildi', 'Выполнено') },
    rejected: { icon: FiXCircle, color: 'text-red-500', bg: 'bg-red-50', label: t('Rad etildi', 'Отклонено') }
  };

  return (
    <div className="min-h-screen py-16 pt-28">
      <div className="container-custom max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold gradient-text">
            {t('Onlayn qabul', 'Онлайн прием')}
          </h1>
          <p className="mt-2 text-gray-500">
            {t('Murojaatingizni elektron shaklda yuboring', 'Отправьте ваше обращение в электронном виде')}
          </p>
          <div className="w-20 h-1 mx-auto mt-4 bg-primary rounded-full"></div>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => { setActiveTab('submit'); setSubmitted(false); }}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              activeTab === 'submit'
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-pen-alt mr-2"></i> {t('Yangi murojaat', 'Новое обращение')}
          </button>
          <button
            onClick={() => { setActiveTab('track'); setTrackingStatus(null); }}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              activeTab === 'track'
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-search mr-2"></i> {t('Ariza holatini kuzatish', 'Отследить заявку')}
          </button>
        </div>

        {/* Submit Form */}
        {activeTab === 'submit' && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-green-600">
                  {t('Murojaatingiz qabul qilindi!', 'Ваше обращение принято!')}
                </h2>
                <p className="mb-4 text-gray-500">
                  {t('Ariza raqamingiz:', 'Номер вашей заявки:')}
                </p>
                <p className="mb-6 text-xl font-bold text-primary">{trackingCode}</p>
                <p className="text-sm text-gray-500">
                  {t('Arizangizning holatini "Ariza holatini kuzatish" bo\'limidan kuzatib borishingiz mumkin.', 'Вы можете отслеживать статус вашей заявки в разделе "Отследить заявку".')}
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ fullName: '', phone: '', passport: '', message: '' }); setFile(null); }}
                  className="px-6 py-2 mt-4 text-white rounded-lg bg-primary hover:bg-primary/90"
                >
                  {t('Yangi murojaat', 'Новое обращение')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium">{t('Ism familiya *', 'Имя фамилия *')}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">{t('Telefon raqam *', 'Номер телефона *')}</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">{t('Passport seriyasi *', 'Серия паспорта *')}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    value={form.passport}
                    onChange={(e) => setForm({ ...form, passport: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">{t('Murojaat matni *', 'Текст обращения *')}</label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:border-primary"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">{t('Qo\'shimcha hujjat', 'Дополнительный документ')}</label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                      isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <FiUpload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {isDragActive
                        ? t('Faylni tashlang', 'Перетащите файл')
                        : t('Faylni tanlang yoki bu yerga tashlang', 'Выберите файл или перетащите его сюда')}
                    </p>
                    <p className="text-xs text-gray-400">PDF, JPG, PNG (max 10MB)</p>
                  </div>
                  {file && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                      <FiFile /> {file.name}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 font-bold text-white transition rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>{t('Yuborish', 'Отправить')}</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* Track Application */}
        {activeTab === 'track' && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex gap-3 mb-8">
                <input
                  type="text"
                  placeholder={t('Ariza raqamini kiriting', 'Введите номер заявки')}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                <button
                  onClick={trackApplication}
                  disabled={loading}
                  className="px-6 py-2 text-white rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSearch className="w-5 h-5" />}
                </button>
              </div>

              {trackingStatus && (
                <div className={`p-6 rounded-xl ${statusConfig[trackingStatus.status]?.bg}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {(() => {
                      const StatusIcon = statusConfig[trackingStatus.status]?.icon;
                      return StatusIcon ? <StatusIcon className={`w-8 h-8 ${statusConfig[trackingStatus.status]?.color}`} /> : null;
                    })()}
                    <div>
                      <h3 className="font-semibold">
                        {t('Holat', 'Статус')}: {statusConfig[trackingStatus.status]?.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t('Oxirgi yangilanish', 'Последнее обновление')}: {new Date(trackingStatus.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {trackingStatus.reply && (
                    <div className="p-4 mt-4 rounded-lg bg-white">
                      <p className="text-sm font-medium text-primary">{t('Javob:', 'Ответ:')}</p>
                      <p className="mt-1 text-gray-700">{trackingStatus.reply}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}