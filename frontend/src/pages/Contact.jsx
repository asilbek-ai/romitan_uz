import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import toast from "react-hot-toast";

export default function Contact() {
  const { t, submitContact } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(
        t(
          "Barcha majburiy maydonlarni to'ldiring!",
          "Заполните все обязательные поля!",
        ),
      );
      return;
    }
    setLoading(true);
    const result = await submitContact(form);
    if (result) {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
      toast.success(t("Xabaringiz qabul qilindi!", "Ваше сообщение принято!"));
    }
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: "fa-map-marker-alt",
      title: t("Manzil", "Адрес"),
      value: "Jondor tumani, Buxoro viloyati",
    },
    {
      icon: "fa-phone-alt",
      title: t("Telefon", "Телефон"),
      value: "+998 65 380-00-00",
    },
    { icon: "fa-envelope", title: "Email", value: "info@jondor.uz" },
    {
      icon: "fa-clock",
      title: t("Ish vaqti", "Режим работы"),
      value: t("Dushanba-Juma: 9:00 - 18:00", "Пн-Пт: 9:00 - 18:00"),
    },
  ];

  // Tashkilotlar ro'yxati (sayt ichida)
  const organizations = [
    {
      id: "oneid",
      name: "OneID",
      fullName: "Yagona login va identifikatsiya tizimi",
      description: "Davlat xizmatlariga yagona login orqali kirish",
      icon: "fa-id-card",
      color: "from-purple-600 to-blue-600",
      bg: "from-purple-50 to-blue-50",
      loginUrl: "/oneid-login",
      registerUrl: "/oneid-register",
    },
    {
      id: "iduz",
      name: "ID.UZ",
      fullName: "Yagona akkaunt tizimi",
      description: "Portal va xizmatlar uchun yagona akkaunt",
      icon: "fa-user-circle",
      color: "from-green-600 to-teal-600",
      bg: "from-green-50 to-teal-50",
      loginUrl: "/iduz-login",
      registerUrl: "/iduz-register",
    },
    {
      id: "myid",
      name: "MyID",
      fullName: "Biometrik identifikatsiya tizimi",
      description: "Biometrik ma'lumotlar orqali identifikatsiya",
      icon: "fa-fingerprint",
      color: "from-red-600 to-orange-600",
      bg: "from-red-50 to-orange-50",
      loginUrl: "/myid-login",
      registerUrl: "/myid-register",
    },
    {
      id: "eimzo",
      name: "E-IMZO",
      fullName: "Elektron raqamli imzo tizimi",
      description: "Hujjatlarni raqamli imzo bilan tasdiqlash",
      icon: "fa-file-signature",
      color: "from-indigo-600 to-purple-600",
      bg: "from-indigo-50 to-purple-50",
      loginUrl: "/eimzo-login",
      registerUrl: "/eimzo-register",
    },
    {
      id: "mygov",
      name: "my.gov.uz",
      fullName: "Davlat xizmatlari portali",
      description: "Online davlat xizmatlari platformasi",
      icon: "fa-building",
      color: "from-blue-600 to-cyan-600",
      bg: "from-blue-50 to-cyan-50",
      loginUrl: "/mygov-login",
      registerUrl: "/mygov-register",
    },
  ];

  return (
    <div className="relative min-h-screen py-16 overflow-hidden pt-28 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Animated background elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bg-purple-300 rounded-full -top-40 -right-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bg-blue-300 rounded-full -bottom-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-indigo-300 rounded-full top-1/2 left-1/2 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div> */}

      <div className="relative z-10 px-4 mx-auto max-w-7xl">
        {/* Header with 3D tilt effect */}
        <div className="mb-12 text-center transition-all duration-700 transform hover:scale-105">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#003580] via-[#0066cc] to-[#00a1ff] bg-clip-text text-transparent md:text-6xl animate-gradient">
            {t("Biz bilan bog'laning", "Свяжитесь с нами")}
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-500 animate-fade-in-up">
            {t(
              "Savol va takliflaringizni yuboring",
              "Отправьте ваши вопросы и предложения",
            )}
          </p>
          <div className="relative w-24 h-1 mx-auto mt-6 overflow-hidden rounded-full bg-gradient-to-r from-[#003580] to-[#0066cc]">
            <div className="absolute inset-0 w-full h-full bg-white/30 animate-shimmer"></div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left side - Contact Info with 3D cards */}
          <div className="space-y-6 perspective-1000">
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="relative transition-all duration-500 transform group hover:rotate-y-6 hover:shadow-2xl"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-5 p-5 transition-all duration-500 border shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-2xl hover:-translate-y-2 group-hover:bg-white border-white/20">
                  <div className="relative flex items-center justify-center overflow-hidden transition-all duration-500 w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-110 group-hover:rotate-3">
                    <i
                      className={`fas ${info.icon} text-2xl text-[#003580] transition-all duration-500 group-hover:scale-110`}
                    ></i>
                    <div className="absolute inset-0 transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {info.title}
                    </h3>
                    <p className="text-gray-500">{info.value}</p>
                  </div>
                  <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <i className="fas fa-arrow-right text-[#003580]"></i>
                  </div>
                </div>
              </div>
            ))}

            {/* Social Media Card with floating animation */}
            <div className="relative p-6 overflow-hidden transition-all duration-500 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl group hover:scale-[1.02] animate-float">
              <div className="absolute w-40 h-40 transition-transform duration-700 rounded-full -top-20 -right-20 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-2xl group-hover:scale-150"></div>
              <h3 className="relative mb-3 text-lg font-bold text-gray-800">
                {t("Ijtimoiy tarmoqlar", "Социальные сети")}
              </h3>
              <div className="relative flex gap-4">
                {[
                  {
                    icon: "fab fa-telegram",
                    color: "bg-[#0088cc]",
                    link: "https://t.me/Asbek_a1",
                  },
                  {
                    icon: "fab fa-facebook-f",
                    color: "bg-[#1877f2]",
                    link: "https://facebook.com",
                  },
                  {
                    icon: "fab fa-instagram",
                    color: "bg-[#e4405f]",
                    link: "https://instagram.com/_asil_bek_07",
                  },
                  {
                    icon: "fab fa-youtube",
                    color: "bg-[#ff0000]",
                    link: "https://www.youtube.com/@jondortumanhokimligi6932",
                  },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative w-12 h-12 ${social.color} rounded-xl flex items-center justify-center text-white text-xl transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-xl group/social overflow-hidden`}
                  >
                    <i className={social.icon}></i>
                    <div className="absolute inset-0 transition-transform duration-300 origin-left transform scale-x-0 bg-white/20 group-hover/social:scale-x-100"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Contact Form with 3D effect */}
          <div className="relative transition-all duration-700 transform perspective-1000 hover:rotate-y-3">
            <div className="p-6 border shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl md:p-8 border-white/20">
              {submitted ? (
                <div className="py-12 text-center animate-bounce-in">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full animate-pulse">
                    <i className="text-3xl text-green-600 fas fa-check"></i>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-800">
                    {t(
                      "Murojaatingiz qabul qilindi!",
                      "Ваше обращение принято!",
                    )}
                  </h3>
                  <p className="text-gray-500">
                    {t(
                      "Tez orada javob beramiz",
                      "Мы ответим в ближайшее время",
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {["name", "email", "phone", "subject"].map((field, idx) => (
                    <div
                      key={field}
                      className="group animate-fade-in-up"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        {field === "name"
                          ? t("Ism familiya *", "Имя фамилия *")
                          : field === "email"
                            ? "Email *"
                            : field === "phone"
                              ? t("Telefon", "Телефон")
                              : t("Mavzu", "Тема")}
                      </label>
                      <input
                        type={
                          field === "email"
                            ? "email"
                            : field === "phone"
                              ? "tel"
                              : "text"
                        }
                        required={field !== "phone"}
                        className="w-full px-4 py-3 transition-all duration-300 border border-gray-200 rounded-xl focus:outline-none focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20 focus:shadow-lg hover:shadow-md group-hover:border-gray-300"
                        value={form[field]}
                        onChange={(e) =>
                          setForm({ ...form, [field]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <div
                    className="group animate-fade-in-up"
                    style={{ animationDelay: "400ms" }}
                  >
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {t("Xabar *", "Сообщение *")}
                    </label>
                    <textarea
                      rows="5"
                      required
                      className="w-full px-4 py-3 transition-all duration-300 border border-gray-200 rounded-xl focus:outline-none focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20 focus:shadow-lg hover:shadow-md resize-none group-hover:border-gray-300"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-3 overflow-hidden text-white font-bold rounded-xl transition-all duration-500 hover:scale-105 focus:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-[#003580] to-[#0066cc] group/btn"
                  >
                    <div className="absolute inset-0 transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 group-hover/btn:translate-x-full"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="transition-transform fas fa-paper-plane group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"></i>
                      )}
                      {loading
                        ? t("Yuborilmoqda...", "Отправка...")
                        : t("Yuborish", "Отправить")}
                    </div>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* TASHKILOTLAR / TIZIMLAR with 3D cards */}
        {/* <div className="mt-20">
          <div className="mb-12 text-center">
            <div className="inline-block px-4 py-1 mb-4 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full animate-fade-in-up">
              <i className="mr-2 text-xs fas fa-crown"></i>
              {t("Hamkor tizimlar", "Партнерские системы")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-[#003580] via-[#0066cc] to-[#00a1ff] bg-clip-text animate-gradient">
              {t("Tashkilotlar va tizimlar", "Организации и системы")}
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-gray-500 animate-fade-in-up animation-delay-200">
              {t(
                "Quyidagi tizimlar orqali tezkor va xavfsiz autentifikatsiyadan foydalaning",
                "Используйте быструю и безопасную аутентификацию через следующие системы",
              )}
            </p>
            <div className="relative w-24 h-1 mx-auto mt-6 overflow-hidden rounded-full bg-gradient-to-r from-[#003580] to-[#0066cc]">
              <div className="absolute inset-0 w-full h-full bg-white/50 animate-shimmer"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {organizations.map((org, idx) => (
              <div
                key={org.id}
                className="relative group animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative overflow-hidden transition-all duration-500 border shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-2xl hover:-translate-y-3 border-blue-100/50">
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 rounded-2xl group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#003580] via-[#0066cc] to-[#00a1ff] blur-xl"></div>
                  </div>

                  <div className="relative z-10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`relative w-16 h-16 bg-gradient-to-br from-[#003580] to-[#0066cc] rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 overflow-hidden`}
                      >
                        <i
                          className={`fas ${org.icon} text-white text-2xl relative z-10`}
                        ></i>
                        <div className="absolute inset-0 transition-transform duration-700 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full"></div>
                      </div>

                      {idx === 0 && (
                        <div className="px-2 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-full animate-pulse">
                          <i className="mr-1 text-yellow-500 fas fa-star"></i>
                          {t("Eng ommabop", "Популярный")}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#003580] transition-colors duration-300">
                        {org.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        {org.fullName}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        {org.description}
                      </p>
                    </div>

                    
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg flex items-center gap-1.5 border border-blue-200">
                        <i className="fas fa-bolt text-[10px]"></i>
                        <span>{t("Tez", "Быстро")}</span>
                      </span>
                      <span className="px-2.5 py-1 bg-cyan-50 text-cyan-600 text-xs rounded-lg flex items-center gap-1.5 border border-cyan-200">
                        <i className="fas fa-shield-alt text-[10px]"></i>
                        <span>{t("Xavfsiz", "Безопасно")}</span>
                      </span>
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-lg flex items-center gap-1.5 border border-indigo-200">
                        <i className="fas fa-check-circle text-[10px]"></i>
                        <span>{t("Ishonchli", "Надежно")}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 mb-4 border-t border-b border-blue-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#003580]">
                          10k+
                        </div>
                        <div className="text-xs text-gray-400">
                          {t("Foydalanuvchi", "Пользователей")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#003580]">
                          99.9%
                        </div>
                        <div className="text-xs text-gray-400">
                          {t("Ishonchlilik", "Надежность")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#003580]">
                          24/7
                        </div>
                        <div className="text-xs text-gray-400">
                          {t("Qo'llab-quvvatlash", "Поддержка")}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-1 text-xs text-gray-500">
                        <span>
                          {t("Integratsiya darajasi", "Уровень интеграции")}
                        </span>
                        <span>{(idx + 1) * 20}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#003580] to-[#0066cc] rounded-full transition-all duration-1000 group-hover:w-full"
                          style={{ width: `${(idx + 1) * 20}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Link
                        to={org.loginUrl}
                        className="group/btn flex-1 px-4 py-2.5 text-sm font-medium text-center text-gray-700 transition-all duration-300 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:border-[#003580] hover:shadow-md hover:-translate-y-0.5"
                      >
                        <i className="mr-2 fas fa-sign-in-alt text-xs transition-transform group-hover/btn:translate-x-0.5"></i>
                        {t("Kirish", "Вход")}
                      </Link>
                      <Link
                        to={org.registerUrl}
                        className="group/btn flex-1 relative overflow-hidden px-4 py-2.5 text-sm font-medium text-center text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-[#003580] to-[#0066cc] hover:scale-105 hover:shadow-lg"
                        onClick={() => {
                          console.log(`Register clicked for ${org.name}`);
                          toast.success(
                            `${org.name} tizimida ro'yxatdan o'tish`,
                          );
                        }}
                      >
                        <div className="absolute inset-0 transition-transform duration-700 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/btn:translate-x-full"></div>
                        <span className="relative flex items-center justify-center">
                          <i className="mr-2 fas fa-user-plus text-xs transition-transform group-hover/btn:translate-x-0.5"></i>
                          {t("Ro'yxatdan o'tish", "Регистрация")}
                        </span>
                      </Link>
                    </div>

                    <div className="flex gap-2 pt-3 mt-3 border-t border-blue-100">
                      <button
                        onClick={() => {
                          toast.success(
                            `${org.name} haqida ma'lumot yuborildi`,
                          );
                        }}
                        className="flex-1 text-xs text-gray-400 hover:text-[#003580] transition-colors py-1"
                      >
                        <i className="mr-1 fas fa-info-circle"></i>{" "}
                        {t("Batafsil", "Подробнее")}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(org.loginUrl);
                          toast.success(`${org.name} linki nusxalandi`);
                        }}
                        className="flex-1 text-xs text-gray-400 hover:text-[#003580] transition-colors py-1"
                      >
                        <i className="mr-1 fas fa-share-alt"></i>{" "}
                        {t("Ulashish", "Поделиться")}
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#003580] to-[#0066cc] transform rotate-45 translate-x-8 -translate-y-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>

                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#003580] text-white text-xs py-1 px-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                    <i className="mr-1 fas fa-hand-pointer"></i>
                    {t("Karta ustiga bosing", "Нажмите на карту")}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => {
                toast.success(
                  t("Barcha tizimlar yuklanmoqda", "Все системы загружаются"),
                );
              }}
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#003580] bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 hover:scale-105"
            >
              <span>
                {t("Barcha tizimlarni ko'rish", "Посмотреть все системы")}
              </span>
              <i className="transition-transform fas fa-arrow-right group-hover:translate-x-1"></i>
            </button>
          </div>
        </div> */}

        <style jsx>{`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          @keyframes pulse-slow {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
            opacity: 0;
          }
          .animate-shimmer {
            animation: shimmer 1.5s infinite;
          }
          .animation-delay-200 {
            animation-delay: 200ms;
          }

          /* Custom scrollbar for cards */
          .overflow-auto::-webkit-scrollbar {
            width: 4px;
          }
          .overflow-auto::-webkit-scrollbar-track {
            background: #e2e8f0;
            border-radius: 10px;
          }
          .overflow-auto::-webkit-scrollbar-thumb {
            background: #003580;
            border-radius: 10px;
          }
        `}</style>

        {/* Map with 3D transform */}
        <div className="relative mt-12 overflow-hidden transition-all duration-500 shadow-2xl rounded-2xl hover:shadow-3xl group">
          <div className="absolute inset-0 z-10 transition-opacity duration-500 opacity-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-100 rounded-2xl"></div>
          <div className="transition-all duration-700 transform group-hover:scale-105">
            <iframe
              title="Jondor map"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d24472.90306628009!2d64.3659289!3d39.9388646!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f50752402a70023%3A0x9fe1fe6b8de1d483!2z0KDQvtC80LjRgtCw0L0sINCR0YPRhdCw0YDQsCwg0KPQt9Cx0LXQutC40YHRgtCw0L0!5e0!3m2!1sru!2s!4v1780656871684!5m2!1sru!2s"
              className="rounded-2xl"
            ></iframe>

            
          </div>
          <div className="absolute z-20 flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-all duration-500 transform -translate-x-1/2 rounded-full shadow-lg opacity-0 bottom-4 left-1/2 bg-white/90 backdrop-blur-sm group-hover:opacity-100">
            <i className="text-red-500 fas fa-map-marker-alt animate-bounce"></i>
            <span>Romitan tumani, Buxoro viloyati</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .hover\\:rotate-y-6:hover {
          transform: rotateY(6deg);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
