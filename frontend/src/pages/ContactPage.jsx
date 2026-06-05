import { useState, useContext } from 'react';
import { AppContext } from '../App';

export default function Contact() {
  const { t, submitContact } = useContext(AppContext);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert(t('Barcha majburiy maydonlarni to\'ldiring!', 'Заполните все обязательные поля!'));
      return;
    }
    setLoading(true);
    const result = await submitContact(form);
    if (result) {
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen py-16 pt-28">
      <div className="max-w-5xl mx-auto container-custom">
        <h1 className="mb-4 text-3xl font-bold text-center gradient-text">{t('Biz bilan bog\'laning', 'Свяжитесь с нами')}</h1>
        <p className="mb-8 text-center text-gray-500">{t('Savol va takliflaringizni yuboring', 'Отправьте ваши вопросы и предложения')}</p>
        <div className="w-20 h-1 mx-auto mb-10 rounded-full bg-primary"></div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-white shadow rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <i className="text-xl text-primary fas fa-map-marker-alt"></i>
              </div>
              <div>
                <div className="font-semibold">{t('Manzil', 'Адрес')}</div>
                <div className="text-sm text-gray-500">Jondor tumani, Buxoro viloyati</div>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white shadow rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <i className="text-xl text-primary fas fa-phone-alt"></i>
              </div>
              <div>
                <div className="font-semibold">{t('Telefon', 'Телефон')}</div>
                <div className="text-sm text-gray-500">+998 65 380-00-00</div>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white shadow rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <i className="text-xl text-primary fas fa-envelope"></i>
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-gray-500">info@jondor.uz</div>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white shadow rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <i className="text-xl text-primary fas fa-clock"></i>
              </div>
              <div>
                <div className="font-semibold">{t('Ish vaqti', 'Режим работы')}</div>
                <div className="text-sm text-gray-500">Dushanba-Juma: 9:00 - 18:00</div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="p-6 bg-white shadow rounded-xl">
            {submitted ? (
              <div className="py-12 text-center">
                <i className="mb-4 text-5xl text-green-500 fas fa-check-circle"></i>
                <h3 className="mb-2 text-xl font-bold">{t('Murojaatingiz qabul qilindi!', 'Ваше обращение принято!')}</h3>
                <p className="text-gray-500">{t('Tez orada javob beramiz', 'Мы ответим в ближайшее время')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">{t('Ism familiya *', 'Имя фамилия *')}</label>
                  <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Email *</label>
                  <input type="email" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">{t('Telefon', 'Телефон')}</label>
                  <input type="tel" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">{t('Xabar *', 'Сообщение *')}</label>
                  <textarea rows="5" required className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:border-primary" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 font-bold text-white transition rounded-lg bg-primary hover:bg-primary/90">
                  {loading ? <i className="mr-2 fas fa-spinner fa-spin"></i> : <i className="mr-2 fas fa-paper-plane"></i>}
                  {t('Yuborish', 'Отправить')}
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-8 overflow-hidden shadow rounded-xl h-80">
          <iframe
            title="Jondor map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Jondor+Uzbekistan"
          ></iframe>
        </div>
      </div>
    </div>
  );
}