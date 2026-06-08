import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';

export default function Navbar() {
  const { t, lang, setLang } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  if (location.pathname.includes('/admin')) return null;

  const navItems = [
    { path: '/', label: 'Bosh', labelRu: 'Главная', icon: 'fa-house' },
    { path: '/about', label: 'Tuman', labelRu: 'Район', icon: 'fa-circle-info' },
    { path: '/services', label: 'Xizmatlar', labelRu: 'Услуги', icon: 'fa-grip' },
    { path: '/news', label: 'Yangiliklar', labelRu: 'Новости', icon: 'fa-newspaper' },
    { path: '/documents', label: 'Hujjatlar', labelRu: 'Документы', icon: 'fa-file-lines' },
    { path: '/statistics', label: 'Statistika', labelRu: 'Статистика', icon: 'fa-chart-line' },
  ];

  const extraItems = [
    { path: '/media', label: 'Media', labelRu: 'Медиа', icon: 'fa-photo-film' },
    { path: '/dashboard', label: 'Dashboard', labelRu: 'Дашборд', icon: 'fa-gauge-high' },
    { path: '/organizations', label: 'Tashkilotlar', labelRu: 'Организации', icon: 'fa-building-columns' },
  ];

  const formatTime = (d) =>
    d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d) =>
    d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ', {
      weekday: 'long', day: 'numeric', month: 'long',
    });

  const variants = {
    container: { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } } },
    item: { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } },
    mobileMenu: {
      hidden: { x: '100%', opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
      exit: { x: '100%', opacity: 0, transition: { duration: 0.25 } },
    },
    mobileItem: { hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  };

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <motion.div
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden text-white text-xs"
        style={{
          background:
            'linear-gradient(110deg, #001a4d 0%, #003580 35%, #0050b3 65%, #0066cc 100%)',
        }}
      >
        <motion.div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
          animate={{ x: ['-100%', '350%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,.35) 1px, transparent 0)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-medium">{t('Onlayn portal', 'Онлайн портал')}</span>
            </span>
            <span className="hidden sm:flex items-center gap-2 opacity-90">
              <i className="fa-solid fa-phone text-[10px]" />
              +998 (65) 552-14-45
            </span>
            <span className="hidden md:flex items-center gap-2 opacity-90">
              <i className="fa-solid fa-envelope text-[10px]" />
              info@romitan.uz
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 opacity-90">
              <i className="fa-regular fa-calendar text-[10px]" />
              <span className="capitalize">{formatDate(time)}</span>
            </span>
            <span className="flex items-center gap-2 font-mono font-semibold">
              <i className="fa-regular fa-clock text-[10px]" />
              {formatTime(time)}
            </span>

            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-0.5 ring-1 ring-white/20">
              {['uz', 'ru'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang && setLang(l)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                    lang === l
                      ? 'bg-white text-[#003580] shadow'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== MAIN HEADER ===== */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, type: 'spring' }}
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,53,128,0.12)] py-2'
            : 'bg-white py-3 shadow-sm'
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#0066cc] to-transparent opacity-70" />

        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            {/* === LOGO === */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative"
              >
                <div className="absolute inset-0 blur-md opacity-40 group-hover:opacity-70 transition" />
                <div className="relative flex items-center justify-center">
                  <img
                    src="/img.png"
                    alt="Romitan logo"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML =
                        '<i class="fa-solid fa-landmark text-[#003580] text-2xl sm:text-3xl"></i>';
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
                    initial={{ x: '-150%' }}
                    animate={{ x: '150%' }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                  />
                </div>
              </motion.div>

              <div className="leading-tight hidden sm:block">
                <div className="font-extrabold tracking-wide text-sm md:text-base bg-gradient-to-r from-[#001a4d] via-[#003580] to-[#0066cc] bg-clip-text text-transparent">
                  ROMITAN TUMANI
                </div>
                <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-halved text-[#0066cc]" />
                  {t('Rasmiy davlat portali', 'Официальный гос. портал')}
                </div>
              </div>
            </Link>

            {/* === DESKTOP NAV - 1024px dan yuqori === */}
            <div className="hidden xl:flex items-center gap-1">
              <motion.nav
                variants={variants.container}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-1"
              >
                {navItems.map((item, idx) => {
                  const active = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      variants={variants.item}
                      onHoverStart={() => setHoveredItem(idx)}
                      onHoverEnd={() => setHoveredItem(null)}
                    >
                      <Link
                        to={item.path}
                        className={`relative px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 group ${
                          active ? 'text-white' : 'text-gray-600 hover:text-[#003580]'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="activePill"
                            className="absolute inset-0 rounded-xl shadow-md"
                            style={{
                              background:
                                'linear-gradient(135deg, #003580 0%, #0066cc 100%)',
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                          />
                        )}
                        {!active && (
                          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#003580]/0 to-[#0066cc]/0 group-hover:from-[#003580]/8 group-hover:to-[#0066cc]/8 transition" />
                        )}
                        <motion.i
                          className={`fa-solid ${item.icon} text-xs relative z-10`}
                          animate={{
                            rotate: hoveredItem === idx ? [0, -12, 12, 0] : 0,
                            scale: hoveredItem === idx ? 1.15 : 1,
                          }}
                          transition={{ duration: 0.4 }}
                        />
                        <span className="relative z-10">{t(item.label, item.labelRu)}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* More dropdown */}
                <div className="relative group">
                  <button className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-[#003580] hover:bg-gray-50 flex items-center gap-2 transition">
                    <i className="fa-solid fa-grip-vertical text-xs" />
                    <span>{t("Ko'proq", 'Ещё')}</span>
                    <i className="fa-solid fa-chevron-down text-[10px] group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <div className="absolute right-0 top-full pt-2 invisible opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
                      <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
                        {t("Qo'shimcha bo'limlar", 'Дополнительно')}
                      </div>
                      {extraItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#003580]/8 hover:to-[#0066cc]/8 hover:text-[#003580] transition group/i"
                        >
                          <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover/i:bg-gradient-to-br group-hover/i:from-[#003580] group-hover/i:to-[#0066cc] group-hover/i:text-white text-gray-500 flex items-center justify-center transition-all">
                            <i className={`fa-solid ${item.icon} text-xs`} />
                          </span>
                          <span className="font-medium">{t(item.label, item.labelRu)}</span>
                          <i className="fa-solid fa-arrow-right text-[10px] text-gray-300 ml-auto group-hover/i:text-[#0066cc] group-hover/i:translate-x-0.5 transition" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <Link
                  to="/contact"
                  className={`relative px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    location.pathname === '/contact'
                      ? 'text-white bg-gradient-to-br from-[#003580] to-[#0066cc] shadow-md'
                      : 'text-gray-600 hover:text-[#003580] hover:bg-gray-50'
                  }`}
                >
                  <i className="fa-solid fa-envelope text-xs" />
                  <span>{t('Aloqa', 'Контакты')}</span>
                </Link>

                {/* Murojaat CTA */}
                <div className="ml-2">
                  <Link to="/murojatlar" className="relative group block">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition" />
                    <div className="relative flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 shadow-lg group-hover:shadow-emerald-500/40 group-hover:-translate-y-0.5 transition-all duration-300">
                      <i className="fa-solid fa-paper-plane text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                      <span className="hidden 2xl:inline">{t('Murojaat', 'Обращение')}</span>
                      <span className="inline 2xl:hidden">{t('Yuborish', 'Отправить')}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </div>
                  </Link>
                </div>
              </motion.nav>
            </div>

            {/* === MOBILE TOGGLE - 1024px dan past === */}
            <div className="flex items-center gap-3">
              <div className="flex xl:hidden">
                <Link
                  to="/murojatlar"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 shadow-md"
                >
                  <i className="fa-solid fa-paper-plane text-xs" />
                </Link>
              </div>
              <motion.button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden relative w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #003580 0%, #0066cc 100%)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
              >
                <AnimatePresence mode="wait">
                  <motion.i
                    key={mobileOpen ? 'x' : 'bars'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-lg`}
                  />
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              variants={variants.mobileMenu}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 bottom-0 right-0 z-50 overflow-y-auto bg-white shadow-2xl w-[85%] max-w-sm flex flex-col"
            >
              {/* Header */}
              <div
                className="relative p-6 text-white overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #001a4d 0%, #003580 50%, #0066cc 100%)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, rgba(255,255,255,.4) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl" />

                <div className="relative flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/30 flex items-center justify-center shadow-lg">
                      <img
                        src="/img.png"
                        alt=""
                        className="w-9 h-9 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML =
                            '<i class="fa-solid fa-landmark text-white text-lg"></i>';
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-base font-extrabold tracking-wide">ROMITAN</div>
                      <div className="text-[11px] text-white/80">
                        {t('Rasmiy portal', 'Официальный портал')}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setMobileOpen(false)}
                    className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                  >
                    <i className="fa-solid fa-xmark" />
                  </motion.button>
                </div>

                <div className="relative flex gap-2">
                  {['uz', 'ru'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang && setLang(l)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                        lang === l
                          ? 'bg-white text-[#003580] shadow'
                          : 'bg-white/15 text-white ring-1 ring-white/20'
                      }`}
                    >
                      {l === 'uz' ? "O'zbekcha" : 'Русский'}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="px-4 pt-4">
                <Link
                  to="/murojatlar"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 font-bold text-white shadow-lg rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <i className="fa-solid fa-paper-plane" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{t('Murojaat yuborish', 'Отправить обращение')}</div>
                    <div className="text-[10px] font-normal opacity-80">
                      {t('24/7 onlayn xizmat', 'Сервис 24/7')}
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>

              {/* Nav List */}
              <div className="flex flex-col gap-1 p-4 flex-1">
                <div className="px-2 py-2 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  {t('Asosiy menyu', 'Главное меню')}
                </div>
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <motion.div key={item.path} variants={variants.mobileItem}>
                      <Link
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                          active
                            ? 'bg-gradient-to-r from-[#003580]/10 to-[#0066cc]/10 text-[#003580] font-bold ring-1 ring-[#003580]/15'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                            active
                              ? 'bg-gradient-to-br from-[#003580] to-[#0066cc] text-white shadow-md'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <i className={`fa-solid ${item.icon} text-sm`} />
                        </div>
                        <span className="flex-1 text-sm">{t(item.label, item.labelRu)}</span>
                        {active && (
                          <i className="fa-solid fa-circle text-[6px] text-emerald-500 animate-pulse" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="px-2 pt-3 pb-2 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  {t("Qo'shimcha", 'Дополнительно')}
                </div>
                {[...extraItems, { path: '/contact', label: 'Aloqa', labelRu: 'Контакты', icon: 'fa-envelope' }].map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <motion.div key={item.path} variants={variants.mobileItem}>
                      <Link
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                          active
                            ? 'bg-gradient-to-r from-[#003580]/10 to-[#0066cc]/10 text-[#003580] font-bold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          active ? 'bg-gradient-to-br from-[#003580] to-[#0066cc] text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <i className={`fa-solid ${item.icon} text-sm`} />
                        </div>
                        <span className="flex-1 text-sm">{t(item.label, item.labelRu)}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white">
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold text-center mb-3">
                  {t('Bizni kuzating', 'Подписывайтесь')}
                </div>
                <div className="flex justify-center gap-3">
                  {[
                    { n: 'telegram', c: 'hover:bg-sky-500' },
                    { n: 'facebook', c: 'hover:bg-blue-600' },
                    { n: 'instagram', c: 'hover:bg-pink-500' },
                    { n: 'youtube', c: 'hover:bg-red-600' },
                  ].map((s) => (
                    <motion.a
                      key={s.n}
                      href="#"
                      className={`w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:text-white transition-all ${s.c}`}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <i className={`fa-brands fa-${s.n}`} />
                    </motion.a>
                  ))}
                </div>
                <div className="text-center text-[10px] text-gray-400 mt-4">
                  © {new Date().getFullYear()} Romitan tumani hokimligi
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}