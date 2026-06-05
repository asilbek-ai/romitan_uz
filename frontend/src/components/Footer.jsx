import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AppContext } from '../App';

export default function Footer() {
  const { t, subscribe } = useContext(AppContext);
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('Email manzilini kiriting!', 'Введите email адрес!'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t('To\'g\'ri email manzilini kiriting!', 'Введите правильный email адрес!'));
      return;
    }
    setLoading(true);
    try {
      const result = subscribe(email);
      if (result) {
        toast.success(t('Obuna bo\'ldingiz! ✅', 'Вы подписались! ✅'));
        setEmail('');
      } else {
        toast.error(t('Bu email allaqachon obuna bo\'lgan!', 'Этот email уже подписан!'));
      }
    } catch (error) {
      toast.error(t('Xatolik yuz berdi!', 'Произошла ошибка!'));
    }
    setLoading(false);
  };

  const socialLinks = [
    { icon: 'fab fa-telegram', href: 'https://t.me/Asbek_a1', color: 'hover:text-[#0088cc]' },
    { icon: 'fab fa-facebook-f', href: 'https://facebook.com', color: 'hover:text-[#1877f2]' },
    { icon: 'fab fa-instagram', href: 'https://instagram.com/_asil_bek_07', color: 'hover:text-[#e4405f]' },
    { icon: 'fab fa-youtube', href: 'https://www.youtube.com', color: 'hover:text-[#ff0000]' }
  ];

  const menuItems = [
    { title: 'Mavzular', links: [
      { path: '/news', label: 'Yangiliklar', icon: 'fa-newspaper' },
      { path: '/services', label: 'Xizmatlar', icon: 'fa-th-large' },
      { path: '/documents', label: 'Hujjatlar', icon: 'fa-file-alt' },
      { path: '/media', label: 'Media', icon: 'fa-photo-video' }
    ]},
    { title: 'Tashkilotlar', links: [
      { path: '/about', label: 'Tuman haqida', icon: 'fa-info-circle' },
      { path: '/statistics', label: 'Statistika', icon: 'fa-chart-line' },
      { path: '/contact', label: 'Aloqa', icon: 'fa-envelope' },
      // { path: '/admin', label: 'Admin', icon: 'fa-shield-alt' }
    ]}
  ];

  return (
    <footer className="relative pt-12 pb-6 overflow-hidden text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Simple Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, -50, 0], y: [0, -50, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bg-blue-500 rounded-full w-80 h-80 -top-40 -right-40 blur-3xl opacity-10"
        />
        <motion.div
          animate={{ x: [0, -100, 50, 0], y: [0, 50, -100, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bg-purple-500 rounded-full w-80 h-80 -bottom-40 -left-40 blur-3xl opacity-10"
        />
      </div>

      <div className="relative z-10 max-w-6xl px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-4">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl"
              >
                <i className="text-xl text-white fas fa-landmark"></i>
              </motion.div>
              <div>
                <h3 className="text-xl font-bold">Romitan tumani</h3>
                <p className="text-xs text-blue-300">{t('Rasmiy veb-portal', 'Официальный веб-портал')}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-blue-200/80">
              {t('Xalq uchun xizmat - eng oliy maqsad', 'Служение народу - высшая цель')}
            </p>
            <div className="flex gap-2 mt-4">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className={`w-8 h-8 bg-white/10 rounded-full flex items-center justify-center transition-all ${social.color} hover:bg-white/20`}
                >
                  <i className={`${social.icon} text-sm`}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Menu Sections */}
          {menuItems.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h4 className="flex items-center gap-2 mb-4 font-semibold">
                <motion.i 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`text-xs ${idx === 0 ? 'text-yellow-400 fas fa-star' : 'text-green-400 fas fa-building'}`}
                />
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <motion.li key={linkIdx} whileHover={{ x: 5 }}>
                    <Link to={link.path} className="flex items-center gap-2 text-sm text-blue-200 transition hover:text-white">
                      <i className={`fas ${link.icon} text-xs text-blue-400 w-4`}></i>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact & Subscribe */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="flex items-center gap-2 mb-4 font-semibold">
              <motion.i 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-xs text-orange-400 fas fa-headset"
              />
              {t('Bog\'lanish', 'Контакты')}
            </h4>
            <ul className="mb-4 space-y-3">
              <motion.li whileHover={{ x: 3 }}>
                <a href="tel:+9986538000000" className="flex items-center gap-2 text-sm text-blue-200 hover:text-white">
                  <i className="w-5 fas fa-phone-alt"></i> +998 65 380-00-00
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 3 }}>
                <a href="mailto:info@romitan.uz" className="flex items-center gap-2 text-sm text-blue-200 hover:text-white">
                  <i className="w-5 fas fa-envelope"></i> info@romitan.uz
                </a>
              </motion.li>
              <li className="flex items-center gap-2 text-sm text-blue-200">
                <i className="w-5 fas fa-map-marker-alt"></i> Romitan tuman
              </li>
            </ul>
            
            {/* Subscribe Form */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold">
                <motion.i 
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-yellow-400 fas fa-bell"
                />
                {t('Yangiliklarga obuna bo\'ling', 'Подпишитесь на новости')}
              </h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email manzil"
                  className="flex-1 px-3 py-2 text-sm text-white border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:border-blue-400 placeholder-white/50"
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm transition rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="pt-6 text-sm text-center border-t border-white/10 text-blue-300/80"
        >
          <p>© {currentYear} {t('Romitan tumani hokimligi', 'Хокимият Джондорского района')} | {t('Barcha huquqlar himoyalangan', 'Все права защищены')}</p>
        </motion.div>
      </div>
    </footer>
  );
}