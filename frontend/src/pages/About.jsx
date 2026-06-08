import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

export default function About() {
  const [selectedCulture, setSelectedCulture] = useState(null);
const [showCultureModal, setShowCultureModal] = useState(false);
  const { leadership } = useContext(AppContext);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('history');

  // Admin qo'shgan rahbarlar - leadership dan keladi
  const hokim = leadership && leadership.length > 0 ? leadership[0] : null;
  const otherLeaders = leadership && leadership.length > 1 ? leadership.slice(1) : [];

  // Default hokim ma'lumoti
  const defaultHokim = {
    name: "Barnoyev Umedjon Isoyevich",
    position: "Romitan tumani hokimi",
    phone: "(65) 552 1445",
    email: "romitan@buxoro.uz",
    image: null,
    receptionDay: "Dushanba - Juma 09:00 - 12:00"
  };

  const activeHokim = hokim || defaultHokim;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-blue-600 transition">Bosh sahifa</a>
            <span className="text-gray-400">/</span>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition">Hokimiyat haqida</a>
            <span className="text-gray-400">/</span>
            <span className="text-blue-600 font-medium">Tuman haqida</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tuman haqida</h1>
          <div className="w-16 h-1 bg-blue-600 mt-2 rounded-full"></div>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg ${
              activeTab === 'history'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Rahbarlar
          </button>
          <button
            onClick={() => setActiveTab('development')}
            className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg ${
              activeTab === 'development'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Rivojlanish
          </button>
          <button
            onClick={() => setActiveTab('culture')}
            className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg ${
              activeTab === 'culture'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Madaniyat
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden mb-8">
          
          {/* Tarix Tab - Hokim rasmi va ma'lumoti */}
{activeTab === 'history' && (
  <div className="p-6 md:p-8">
    <div className="grid md:grid-cols-3 gap-8">
      {/* Hokim Rasmi - Kattaroq va chiroyli */}
      <div className="md:col-span-1">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 h-96 shadow-xl">
            {activeHokim.image ? (
              <img 
                src={activeHokim.image} 
                alt={activeHokim.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-white/80 shadow-lg flex items-center justify-center mb-4">
                  <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Romitan tumani hokimi</p>
                <p className="text-gray-400 text-sm mt-1">Rasm mavjud emas</p>
              </div>
            )}
            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold rounded-full shadow-md">
                Hokim
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hokim va Tuman Ma'lumoti */}
      <div className="md:col-span-2">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-blue-500 rounded-full"></div>
            <span className="text-blue-600 text-sm font-medium uppercase tracking-wider">
              Romitan tumani rahbari
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
            {activeHokim.name}
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-12 h-0.5 bg-blue-500 rounded-full"></div>
            <div className="w-6 h-0.5 bg-indigo-400 rounded-full"></div>
            <div className="w-12 h-0.5 bg-blue-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Tuman haqida ma'lumot - Kartochka ko'rinishida */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-700 font-semibold text-sm">Tuman haqida qisqacha</span>
          </div>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p className="text-sm">
              Romitan tumani — Buxoro viloyatidagi tuman. <span className="font-semibold text-blue-700">1926-yil</span> tashkil etilgan. 
              Maʼmuriy markazi — <span className="font-semibold text-blue-700">Romitan shaharchasi</span>.
            </p>
            <p className="text-sm">
              Hududi asosan tekisliklardan iborat boʻlib, aholisi dehqonchilik, chorvachilik va tadbirkorlik bilan shugʻullanadi.
            </p>
            <p className="text-sm">
              Romitan tumani qadimiy Buxoro vohasining bir qismi hisoblanadi. 
              Hududda milliy urf-odatlar, hunarmandchilik va anʼanaviy o'zbek madaniyati saqlanib qolgan.
            </p>
          </div>
        </div>
        
        {/* Hokim aloqa ma'lumotlari - Chiroyli kartochkalar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeHokim.phone && (
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-green-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Telefon raqami</p>
                  <a href={`tel:${activeHokim.phone}`} className="text-gray-800 font-semibold hover:text-green-600 transition text-base">
                    {activeHokim.phone}
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {activeHokim.email && (
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-blue-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Elektron pochta</p>
                  <a href={`mailto:${activeHokim.email}`} className="text-gray-800 font-semibold hover:text-blue-600 transition text-sm break-all">
                    {activeHokim.email}
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeHokim.address && (
            <div className="group relative md:col-span-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-purple-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Manzil</p>
                  <p className="text-gray-800 font-medium">{activeHokim.address}</p>
                </div>
              </div>
            </div>
          )}
          
          {activeHokim.receptionDay && (
            <div className="group relative md:col-span-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-orange-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Qabul vaqtlari</p>
                  <p className="text-gray-800 font-medium">{activeHokim.receptionDay}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

          {/* Rivojlanish Tab */}
          {activeTab === 'development' && (
            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Qishloq xo'jaligi</h3>
                  {[
                    "Qishloq xoʻjaligi rivojlangan",
                    "Paxta va gʻalla yetishtiriladi",
                    "Bogʻdorchilik va chorvachilik bilan shugʻullaniladi"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Infratuzilma</h3>
                  {[
                    "Yangi infratuzilma loyihalari amalga oshirilmoqda",
                    "Transport yoʻllari rivojlangan",
                    "Qulay geografik joylashuv"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Madaniyat Tab */}
{activeTab === 'culture' && (
  <div className="p-6 md:p-8">
    {/* Hero description */}
    <div className="relative mb-10 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200 rounded-full blur-2xl opacity-50"></div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <i className="fas fa-landmark text-blue-600 text-xl"></i>
          <h3 className="text-lg font-semibold text-gray-800">Madaniy meros</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Romitan tumanida koʻplab tarixiy obidalar, ziyoratgohlar va madaniy meros obyektlari mavjud. 
          Tuman hududida har yili anʼanaviy bayramlar va festivallar oʻtkaziladi. 
          Mahalliy hunarmandlar tomonidan qadimiy usullarda tayyorlangan buyumlar sayyohlar orasida katta qiziqish uygʻotadi.
        </p>
      </div>
    </div>

    {/* Statistics Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer" 
        onClick={() => {
          setSelectedCulture({
            title: "Tarixiy obidalar",
            icon: "fas fa-monument",
            description: "Romitan tumanida 15 dan ortiq tarixiy obidalar mavjud. Ular orasida O'rta asrga oid masjidlar, madrasalar va qadimiy qabristonlar bor. Eng mashhurlari: Juma masjidi (XII asr), Xoja Ismatulloh maqbarasi (XIV asr) va eski shahar harobalari (VII-X asrlar). Bu obidalar O'zbekistonning boy tarixi va madaniyatini o'zida aks ettiradi."
          });
          setShowCultureModal(true);
        }}>
        <i className="fas fa-monument text-3xl text-blue-600 mb-2"></i>
        <div className="text-2xl font-bold text-gray-800">15+</div>
        <div className="text-xs text-gray-500">Tarixiy obidalar</div>
      </div>
      <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer" 
        onClick={() => {
          setSelectedCulture({
            title: "Ziyoratgohlar",
            icon: "fas fa-mosque",
            description: "Tuman hududida 8 ta ziyoratgoh mavjud bo'lib, ular har yili minglab ziyoratchilarni qabul qiladi. Eng mashhur ziyoratgohlar: Xoja Ismatulloh avliyo maqbarasi - XIV asrda qurilgan, Bobo Orzirov ziyoratgohi - XVI asrga oid, Shodmon ota ziyoratgohi va Xoja Abdulaziz maqbarasi."
          });
          setShowCultureModal(true);
        }}>
        <i className="fas fa-mosque text-3xl text-green-600 mb-2"></i>
        <div className="text-2xl font-bold text-gray-800">8</div>
        <div className="text-xs text-gray-500">Ziyoratgohlar</div>
      </div>
      <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer" 
        onClick={() => {
          setSelectedCulture({
            title: "Hunarmandchilik",
            icon: "fas fa-palette",
            description: "Tuman hududida kulolchilik, gilamdo'zlik, yog'och o'ymakorligi va kashtachilik kabi 20 dan ortiq hunarmandchilik turlari rivojlangan. Mahalliy hunarmandlar qadimiy usullarni saqlab qolgan va ularni avloddan avlodga o'tkazib kelmoqda."
          });
          setShowCultureModal(true);
        }}>
        <i className="fas fa-palette text-3xl text-purple-600 mb-2"></i>
        <div className="text-2xl font-bold text-gray-800">20+</div>
        <div className="text-xs text-gray-500">Hunarmandchilik turlari</div>
      </div>
      <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer" 
        onClick={() => {
          setSelectedCulture({
            title: "Yillik tadbirlar",
            icon: "fas fa-calendar-alt",
            description: "Har yili 'Romitan bayrami', 'Hunarmandchilik festivali' va 'Paxta sayli' kabi 10 dan ortiq madaniy tadbirlar o'tkaziladi. Festivallar davomida milliy o'yinlar - kurash, uloq, poyga kabi musobaqalar, qo'shiqlar va raqslar namoyish qilinadi."
          });
          setShowCultureModal(true);
        }}>
        <i className="fas fa-calendar-alt text-3xl text-orange-600 mb-2"></i>
        <div className="text-2xl font-bold text-gray-800">10+</div>
        <div className="text-xs text-gray-500">Yillik tadbirlar</div>
      </div>
    </div>

    {/* Featured Categories */}
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-800">Madaniyat turlari</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="group p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => {
            setSelectedCulture({
              title: "Tarixiy obidalar",
              icon: "fas fa-monument",
              description: "Romitan tumanida 15 dan ortiq tarixiy obidalar mavjud. Ular orasida O'rta asrga oid masjidlar, madrasalar va qadimiy qabristonlar bor. Eng mashhurlari: Juma masjidi (XII asr), Xoja Ismatulloh maqbarasi (XIV asr) va eski shahar harobalari (VII-X asrlar)."
            });
            setShowCultureModal(true);
          }}>
          <i className="fas fa-monument text-3xl text-blue-600 mb-2 group-hover:scale-110 transition"></i>
          <h4 className="font-semibold text-gray-800">Tarixiy obidalar</h4>
          <p className="text-xs text-gray-500 mt-1">Qadimiy me'morchilik namunalari</p>
        </div>
        <div className="group p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => {
            setSelectedCulture({
              title: "Ziyoratgohlar",
              icon: "fas fa-mosque",
              description: "Tuman hududida 8 ta ziyoratgoh mavjud bo'lib, ular har yili minglab ziyoratchilarni qabul qiladi. Eng mashhur ziyoratgohlar: Xoja Ismatulloh avliyo maqbarasi - XIV asrda qurilgan, Bobo Orzirov ziyoratgohi - XVI asrga oid."
            });
            setShowCultureModal(true);
          }}>
          <i className="fas fa-mosque text-3xl text-green-600 mb-2 group-hover:scale-110 transition"></i>
          <h4 className="font-semibold text-gray-800">Ziyoratgohlar</h4>
          <p className="text-xs text-gray-500 mt-1">Muqaddas qadamjolar</p>
        </div>
        <div className="group p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => {
            setSelectedCulture({
              title: "Hunarmandchilik",
              icon: "fas fa-palette",
              description: "Tuman hududida kulolchilik, gilamdo'zlik, yog'och o'ymakorligi va kashtachilik kabi 20 dan ortiq hunarmandchilik turlari rivojlangan. Mahalliy hunarmandlar qadimiy usullarni saqlab qolgan."
            });
            setShowCultureModal(true);
          }}>
          <i className="fas fa-palette text-3xl text-purple-600 mb-2 group-hover:scale-110 transition"></i>
          <h4 className="font-semibold text-gray-800">Hunarmandchilik</h4>
          <p className="text-xs text-gray-500 mt-1">Milliy san'at turlari</p>
        </div>
        <div className="group p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => {
            setSelectedCulture({
              title: "An'anaviy bayramlar",
              icon: "fas fa-calendar-check",
              description: "Tumanda har yili an'anaviy bayramlar keng nishonlanadi. Navro'z bayrami - bahor kelishining ilk kuni xalq sayillari, milliy o'yinlar va turli musobaqalar bilan o'tkaziladi."
            });
            setShowCultureModal(true);
          }}>
          <i className="fas fa-calendar-check text-3xl text-orange-600 mb-2 group-hover:scale-110 transition"></i>
          <h4 className="font-semibold text-gray-800">An'anaviy bayramlar</h4>
          <p className="text-xs text-gray-500 mt-1">Xalq sayillari</p>
        </div>
        <div className="group p-4 bg-gradient-to-br from-rose-50 to-red-50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => {
            setSelectedCulture({
              title: "Kulolchilik",
              icon: "fas fa-fill-drip",
              description: "Romitan tumani kulolchilik an'analari bilan mashhur. Mahalliy kulollar qadimiy usullarda sopol idishlar, laganlar, ko'zalar va boshqa buyumlar yasaydi."
            });
            setShowCultureModal(true);
          }}>
          <i className="fas fa-fill-drip text-3xl text-red-600 mb-2 group-hover:scale-110 transition"></i>
          <h4 className="font-semibold text-gray-800">Kulolchilik</h4>
          <p className="text-xs text-gray-500 mt-1">Qadimiy kulolchilik an'analari</p>
        </div>
        <div className="group p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => {
            setSelectedCulture({
              title: "Gilamdo'zlik",
              icon: "fas fa-rug",
              description: "Tuman gilamdo'zlik an'analari bilan ham mashhur. Mahalliy usta ayollar qo'lda to'qilgan gilamlar, kurpalar, do'ppilar va boshqa milliy mahsulotlar tayyorlaydi."
            });
            setShowCultureModal(true);
          }}>
          <i className="fas fa-rug text-3xl text-indigo-600 mb-2 group-hover:scale-110 transition"></i>
          <h4 className="font-semibold text-gray-800">Gilamdo'zlik</h4>
          <p className="text-xs text-gray-500 mt-1">Milliy gilam to'qish</p>
        </div>
      </div>
    </div>

    {/* Cultural Events Timeline */}
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-800">Yillik madaniy tadbirlar</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition cursor-pointer"
          onClick={() => {
            setSelectedCulture({
              title: "Navro'z bayrami",
              icon: "fas fa-flower",
              description: "21-mart kuni nishonlanadigan Navro'z bayrami - bahor kelishining ilk kuni. Bayram davomida xalq sayillari, milliy o'yinlar (kurash, poyga, arqon tortish), 'Sumalak' tayyorlash marosimi, qo'shiq va raqs tomoshalari tashkil etiladi."
            });
            setShowCultureModal(true);
          }}>
          <div className="w-16 text-sm font-semibold text-blue-600"><i className="fas fa-calendar-day mr-1"></i> Mart</div>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex-1">
            <span className="text-gray-800">Navro'z bayrami - Xalq sayillari va milliy o'yinlar</span>
          </div>
          <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
        </div>
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition cursor-pointer"
          onClick={() => {
            setSelectedCulture({
              title: "Hunarmandchilik festivali",
              icon: "fas fa-palette",
              description: "May oyida o'tkaziladigan Hunarmandchilik festivali - tumanning eng mashhur tadbirlaridan biri. Festival davomida kulolchilik, gilamdo'zlik, kashtachilik, yog'och o'ymakorligi va boshqa hunarmandchilik turlari bo'yicha ko'rgazmalar tashkil etiladi."
            });
            setShowCultureModal(true);
          }}>
          <div className="w-16 text-sm font-semibold text-blue-600"><i className="fas fa-calendar-day mr-1"></i> May</div>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex-1">
            <span className="text-gray-800">Hunarmandchilik festivali - Kulolchilik va gilamdo'zlik ko'rgazmasi</span>
          </div>
          <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
        </div>
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition cursor-pointer"
          onClick={() => {
            setSelectedCulture({
              title: "Romitan bayrami",
              icon: "fas fa-city",
              description: "Avgust oyida nishonlanadigan Romitan bayrami - tuman kuni munosabati bilan o'tkaziladigan eng katta tadbir. Bayram davomida konsert dasturlari, sport musobaqalari, ko'rgazmalar, xalq sayillari va turli tanlovlar tashkil etiladi."
            });
            setShowCultureModal(true);
          }}>
          <div className="w-16 text-sm font-semibold text-blue-600"><i className="fas fa-calendar-day mr-1"></i> Avgust</div>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex-1">
            <span className="text-gray-800">Romitan bayrami - Tuman kuni tantanalari</span>
          </div>
          <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
        </div>
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition cursor-pointer"
          onClick={() => {
            setSelectedCulture({
              title: "Paxta sayli",
              icon: "fas fa-tractor",
              description: "Oktyabr oyida o'tkaziladigan Paxta sayli - hosil bayrami. Tadbir davomida paxta terimi bo'yicha musobaqalar, mahalliy oshpazlar tomonidan milliy taomlar tayyorlash festivallari, xalq sayillari va konsert dasturlari tashkil etiladi."
            });
            setShowCultureModal(true);
          }}>
          <div className="w-16 text-sm font-semibold text-blue-600"><i className="fas fa-calendar-day mr-1"></i> Oktyabr</div>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex-1">
            <span className="text-gray-800">Paxta sayli - Hosil bayrami va folklor tomoshalari</span>
          </div>
          <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
        </div>
      </div>
    </div>

    {/* Tag cloud */}
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition cursor-pointer" 
          onClick={() => { 
            setSelectedCulture({ 
              title: "#tarix", 
              icon: "fas fa-history",
              description: "Romitan tumanining boy tarixi qadimiy Buxoro vohasi bilan chambarchas bog'liq. Tuman hududida VII asrga oid arxeologik topilmalar mavjud." 
            }); 
            setShowCultureModal(true); 
          }}>
          <i className="fas fa-hashtag mr-1 text-xs"></i>tarix
        </span>
        <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition cursor-pointer" 
          onClick={() => { 
            setSelectedCulture({ 
              title: "#ziyorat", 
              icon: "fas fa-mosque",
              description: "Romitan tumanidagi ziyoratgohlar har yili minglab ziyoratchilarni qabul qiladi. Xoja Ismatulloh maqbarasi, Bobo Orzirov ziyoratgohi, Shodmon ota ziyoratgohi." 
            }); 
            setShowCultureModal(true); 
          }}>
          <i className="fas fa-hashtag mr-1 text-xs"></i>ziyorat
        </span>
        <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition cursor-pointer" 
          onClick={() => { 
            setSelectedCulture({ 
              title: "#hunarmand", 
              icon: "fas fa-palette",
              description: "Tuman hududida 20 dan ortiq hunarmandchilik turlari rivojlangan. Kulolchilik, gilamdo'zlik, kashtachilik, yog'och o'ymakorligi." 
            }); 
            setShowCultureModal(true); 
          }}>
          <i className="fas fa-hashtag mr-1 text-xs"></i>hunarmand
        </span>
        <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100 transition cursor-pointer" 
          onClick={() => { 
            setSelectedCulture({ 
              title: "#festival", 
              icon: "fas fa-calendar-alt",
              description: "Romitan tumanida har yili 10 dan ortiq festival va madaniy tadbirlar o'tkaziladi. Navro'z, Hunarmandchilik festivali, Romitan bayrami, Paxta sayli." 
            }); 
            setShowCultureModal(true); 
          }}>
          <i className="fas fa-hashtag mr-1 text-xs"></i>festival
        </span>
        <span className="px-3 py-1.5 bg-pink-50 text-pink-700 rounded-lg text-xs font-medium hover:bg-pink-100 transition cursor-pointer" 
          onClick={() => { 
            setSelectedCulture({ 
              title: "#milliy", 
              icon: "fas fa-flag",
              description: "Romitan tumanida milliy qadriyatlar, urf-odatlar va an'analar qadimiy Buxoro maktabi asosida saqlanib kelmoqda." 
            }); 
            setShowCultureModal(true); 
          }}>
          <i className="fas fa-hashtag mr-1 text-xs"></i>milliy
        </span>
        <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition cursor-pointer" 
          onClick={() => { 
            setSelectedCulture({ 
              title: "#madaniyat", 
              icon: "fas fa-landmark",
              description: "Romitan tumani boy madaniy merosga ega. Qadimiy obidalar, ziyoratgohlar, milliy hunarmandchilik, an'anaviy bayramlar." 
            }); 
            setShowCultureModal(true); 
          }}>
          <i className="fas fa-hashtag mr-1 text-xs"></i>madaniyat
        </span>
        <span className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition cursor-pointer" 
          onClick={() => { 
            setSelectedCulture({ 
              title: "#anana", 
              icon: "fas fa-heart",
              description: "Romitan tumanida qadimiy Buxoro an'analari saqlanib kelmoqda. Milliy bayramlar, urf-odatlar, hunarmandchilik va milliy taomlar." 
            }); 
            setShowCultureModal(true); 
          }}>
          <i className="fas fa-hashtag mr-1 text-xs"></i>anana
        </span>
      </div>
    </div>

    {/* Culture Modal - Shu yerda */}
    <AnimatePresence>
      {showCultureModal && selectedCulture && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCultureModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <i className={`${selectedCulture.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold">{selectedCulture.title}</h3>
              </div>
              <button
                onClick={() => setShowCultureModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
              >
                <i className="fas fa-times text-white"></i>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {selectedCulture.description}
              </p>
            </div>
            
            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowCultureModal(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Yopish
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)}
        </div>

        {/* Rahbariyat bo'limi - admin qo'shgan barcha rahbarlar */}
{leadership && leadership.length > 0 && (
  <div className="mt-16">
    {/* Section Header */}
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        <span className="text-blue-600 text-sm font-medium uppercase tracking-wider">Bizning jamoa</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
        Tuman <span className="text-blue-600">rahbariyati</span>
      </h2>
      <div className="flex justify-center gap-2 mb-4">
        <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
        <div className="w-6 h-1 bg-blue-400 rounded-full"></div>
        <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
      </div>
      <p className="text-gray-500 max-w-md mx-auto">
        Xalqimizga xizmat qilayotgan fidoyi insonlar
      </p>
      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm text-gray-600">{leadership.length} nafar rahbar</span>
      </div>
    </div>

    {/* Leadership Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leadership.map((leader, index) => (
        <div
          key={leader.id || index}
          className="group relative cursor-pointer"
          onClick={() => {
            setSelectedLeader(leader);
            setShowModal(true);
          }}
        >
          {/* Card with hover effect */}
          <div className="relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
            
            {/* Top gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
            
            {/* Card Content */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex-shrink-0 shadow-md group-hover:shadow-xl transition-all duration-300">
                    {leader.image ? (
                      <img 
                        src={leader.image} 
                        alt={leader.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Role Badge */}
                  <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-md ${
                    index === 0 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}>
                    {index === 0 ? "Hokim" : "Rahbar"}
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition text-lg line-clamp-1">
                    {leader.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <p className="text-xs text-gray-400">Faol</p>
                  </div>
                </div>
              </div>
              
              {/* Position */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[42px]">
                  {leader.position}
                </p>
              </div>
              
              {/* Contact and Action */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  {leader.phone && (
                    <button 
                      className="w-9 h-9 rounded-lg bg-gray-50 text-gray-500 hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${leader.phone}`;
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                  )}
                  {leader.email && (
                    <button 
                      className="w-9 h-9 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${leader.email}`;
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Details button */}
                <button 
                  className="flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLeader(leader);
                    setShowModal(true);
                  }}
                >
                  <span>Batafsil</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
              <div className="absolute -top-6 -right-6 w-12 h-12 rotate-45 bg-gradient-to-r from-blue-500 to-blue-600 opacity-10 group-hover:opacity-20 transition"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    {/* View All Button */}
    <div className="text-center mt-10">
      <button 
        className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Barcha rahbarlar
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
)}

        {/* Rahbarlar bo'lmasa */}
        {(!leadership || leadership.length === 0) && (
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500">Hozircha rahbar ma'lumotlari mavjud emas</p>
          </div>
        )}
      </div>

      {/* Modal - rahbar haqida batafsil ma'lumot */}
      <AnimatePresence>
        {showModal && selectedLeader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-white shadow-lg">
                  {selectedLeader.image ? (
                    <img src={selectedLeader.image} alt={selectedLeader.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mt-4">{selectedLeader.name}</h3>
                <p className="text-sm text-blue-100 mt-1">{selectedLeader.position}</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {selectedLeader.phone && (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Telefon</p>
                      <a href={`tel:${selectedLeader.phone}`} className="text-gray-800 hover:text-blue-600 font-medium">
                        {selectedLeader.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedLeader.email && (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Email</p>
                      <a href={`mailto:${selectedLeader.email}`} className="text-gray-800 hover:text-blue-600 font-medium break-all">
                        {selectedLeader.email}
                      </a>
                    </div>
                  </div>
                )}

                {selectedLeader.address && (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Manzil</p>
                      <p className="text-gray-800">{selectedLeader.address}</p>
                    </div>
                  </div>
                )}

                {selectedLeader.receptionDay && (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Qabul kunlari</p>
                      <p className="text-gray-800">{selectedLeader.receptionDay}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Yopish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}