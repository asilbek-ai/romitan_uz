import React, { useContext, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import AnimatedStatistics from "../components/AnimatedStatistics";
import { AppContext } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import VirtualTour360 from "../components/VirtualTour360";
import Statistics from "./Statistics";
import { useNavigate } from "react-router-dom";
import rasm from "../../public/image.png";

export default function Home() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { t, adminData, addSubscriber, lang, setLang } = useContext(AppContext);
  const [countersStarted, setCountersStarted] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const statsRef = useRef(null);
  const navigate = useNavigate();

  // AI Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiLang, setAiLang] = useState("uz");
  const chatEndRef = useRef(null);
  const speechSynth = window.speechSynthesis;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCountersStarted(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  // Boshlang'ich xabar
  useEffect(() => {
    if (chatMessages.length === 0) {
      const welcomeMessages = {
        uz: "Assalomu alaykum! 👋 Men Romitan tumanining aqlli sun'iy intellekt yordamchisiman. Sizga tumanimiz haqida istalgan ma'lumotni bera olaman. Qanday savolingiz bor?",
        ru: "Здравствуйте! 👋 Я умный помощник Джондорского района. Могу предоставить любую информацию о нашем районе. Какой у вас вопрос?",
        en: "Hello! 👋 I am the smart AI assistant of Romitan district. I can provide any information about our district. What is your question?",
      };
      setChatMessages([
        {
          id: 1,
          text: welcomeMessages[aiLang],
          isUser: false,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  }, [aiLang]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscriberEmail) {
      const alerts = {
        uz: "Email kiritilmadi",
        ru: "Email не введен",
        en: "Email not entered",
      };
      alert(alerts[lang]);
      return;
    }
    const result = addSubscriber(subscriberEmail);
    if (result) {
      setSubscribed(true);
      setSubscriberEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } else {
      const alerts = {
        uz: "Bu email allaqachon obuna bo'lgan",
        ru: "Этот email уже подписан",
        en: "This email is already subscribed",
      };
      alert(alerts[lang]);
    }
  };

  // Ovozli javob berish
  const speakText = (text, language) => {
    if (speechSynth.speaking) {
      speechSynth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };
    utterance.lang = langMap[language] || "uz-UZ";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynth.speak(utterance);
  };

  // Aqlli AI javob berish funksiyasi (3 tilda)
  const getAIResponse = (userMessage, language) => {
    const msg = userMessage.toLowerCase().trim();

    // Matnni chiroyli qilish funksiyasi
    const beautifyText = (text) => {
      let result = text;
      result = result.replace(/\?/g, "? 🤔");
      result = result.replace(/\!/g, "! 😊");
      result = result.replace(/\. /g, ". ✨ ");
      return result;
    };

    const [activeSlide, setActiveSlide] = useState(0);

    // Auto-slide uchun
    useEffect(() => {
      if (carouselList.length > 1) {
        const interval = setInterval(() => {
          setActiveSlide((prev) => (prev + 1) % carouselList.length);
        }, 5000);
        return () => clearInterval(interval);
      }
    }, [carouselList.length]);

    const responses = {
      // ============ SALOMLASHISH ============
      salom: {
        uz: "Assalomu alaykum! 👋 Men Romitan tumanining aqlli AI yordamchisiman. Sizga quyidagilar haqida to'liq ma'lumot bera olaman:\n\n📍 Tuman haqida umumiy\n🏛️ Rahbariyat va hokim\n📊 Statistika (aholi, maktablar, korxonalar)\n📞 Telefon va aloqa\n✉️ Email va manzil\n🏫 Ta'lim va sog'liq\n💰 Iqtisodiyot va fermerlik\n🏦 SOLG BANK (kreditlar, kartalar)\n📰 Yangiliklar va galereya\n\nSavolingizni yozing! 😊",
        ru: "Здравствуйте! 👋 Я умный AI помощник Джондорского района. Могу предоставить полную информацию о:\n\n📍 Общая информация о районе\n🏛️ Руководство и хоким\n📊 Статистика (население, школы, предприятия)\n📞 Телефоны и контакты\n✉️ Email и адрес\n🏫 Образование и здравоохранение\n💰 Экономика и фермерство\n🏦 SOLG БАНК (кредиты, карты)\n📰 Новости и галерея\n\nНапишите ваш вопрос! 😊",
        en: "Hello! 👋 I am the smart AI assistant of Romitan district. I can provide complete information about:\n\n📍 General district info\n🏛️ Leadership and khokim\n📊 Statistics (population, schools, enterprises)\n📞 Phone and contacts\n✉️ Email and address\n🏫 Education and healthcare\n💰 Economy and farming\n🏦 SOLG BANK (loans, cards)\n📰 News and gallery\n\nWrite your question! 😊",
      },

      // ============ TUMAN HAQIDA TO'LIQ ============
      tuman_batafsil: {
        uz: `📍 ROMETAN TUMANI HAQIDA TO'LIQ MA'LUMOT

📅 TASHKIL TOPGAN SANASI: 1926-yil 29-sentyabr
📏 MAYDONI: 1,200 km² (1.2 ming km²)
👥 AHOLISI: 154,700 dan ortiq kishi
🏘️ MFY: 14 ta
🏡 QISHL OQLAR: 42 ta

📜 TARIXIY MA'LUMOT:
Romitan tumani boy tarixga ega. Hududida 20 dan ortiq tarixiy obidalar mavjud:
• Chor Bakr majmuasi (XI asr)
• Sitorai Mohi Xosa (XIX asr)
• Bahouddin Naqshband majmuasi (XIV asr)

🗺️ GEOGRAFIK JOYLASHUVI:
Buxoro viloyatining shimoli-g'arbiy qismida joylashgan. Shimoldan Qorako'l tumani, janubdan Buxoro tumani, sharqdan Vobkent tumani bilan chegaradosh.

🌡️ IQLIMI:
Kontinental - yozi issiq (40-45°C), qishi sovuq (-5°C dan -15°C gacha). Yillik yog'in miqdori 150-200 mm.

💧 SUV RESURSLARI:
Amudaryo, Zarafshon daryosi, kanallar tarmog'i (umumiy uzunligi 245 km)`,
        ru: `📍 ПОЛНАЯ ИНФОРМАЦИЯ О ДЖОНДОРСКОМ РАЙОНЕ

📅 ДАТА ОСНОВАНИЯ: 29 сентября 1926 года
📏 ПЛОЩАДЬ: 1 200 км²
👥 НАСЕЛЕНИЕ: более 154 700 человек
🏘️ МФЙ: 14
🏡 СЕЛА: 42

📜 ИСТОРИЧЕСКАЯ ИНФОРМАЦИЯ:
Джондорский район имеет богатую историю. Более 20 исторических памятников:
• Комплекс Чор-Бакр (XI век)
• Ситораи Мохи Хоса (XIX век)
• Комплекс Бахауддина Накшбанда (XIV век)

🗺️ ГЕОГРАФИЧЕСКОЕ РАСПОЛОЖЕНИЕ:
Северо-западная часть Бухарской области. Граничит с Каракульским, Бухарским, Вобкентским районами.

🌡️ КЛИМАТ:
Континентальный - лето жаркое (40-45°C), зима холодная (-5°C до -15°C). Годовое количество осадков 150-200 мм.

💧 ВОДНЫЕ РЕСУРСЫ:
Амударья, Зарафшан, сеть каналов (общая длина 245 км)`,
        en: `📍 COMPLETE INFORMATION ABOUT ROMITAN DISTRICT

📅 FOUNDED: September 29, 1926
📏 AREA: 1,200 km²
👥 POPULATION: over 154,700 people
🏘️ MFY: 14
🏡 VILLAGES: 42

📜 HISTORICAL INFORMATION:
Romitan district has a rich history. Over 20 historical monuments:
• Chor-Bakr complex (11th century)
• Sitorai Mohi Hosa (19th century)
• Bahauddin Naqshband complex (14th century)

🗺️ GEOGRAPHICAL LOCATION:
Northwestern part of Bukhara region. Borders with Karakul, Bukhara, Vobkent districts.

🌡️ CLIMATE:
Continental - hot summers (40-45°C), cold winters (-5°C to -15°C). Annual precipitation 150-200 mm.

💧 WATER RESOURCES:
Amudarya, Zarafshan, canal network (total length 245 km)`,
      },

      // ============ HOKIM VA RAHBARIYAT TO'LIQ ============
      hokim_batafsil: {
        uz: `🏛️ ROMITAN TUMANI RAHBARIYATI

👨‍💼 TUMAN HOKIMI: Xudoyev Jamshid Rajabovich

📞 TELEFON RAQAMLARI:
• Hokim qabuli: +998 65 380-00-01
• Ishonch telefoni: +998 65 582-18-53
• Qabulxona: +998 65 380-00-00
• Faks: +998 65 582-26-53
• Navbatchi: +998 65 380-00-02

✉️ EMAIL MANZILLARI:
• Rasmiy email: jondor.t@exat.uz
• Umumiy bo'lim: info@jondor.uz
• Murojaatlar uchun: appeal@jondor.uz
• Hokim qabuli: qabul@jondor.uz

🏢 MANZIL:
Buxoro viloyati, Jondor tumani, M. Tarobiy ko'chasi, 26-uy

📅 QABUL VAQTLARI:
• Hokim qabuli: Dushanba - Juma, 15:00 - 17:00
• Fuqarolar qabuli: Har payshanba, 10:00 - 13:00
• Ish vaqti: Dushanba - Juma, 09:00 - 18:00
• Tushlik: 13:00 - 14:00
• Dam olish kunlari: Shanba, Yakshanba

👥 HOKIM O'RINBOSARLARI:
1. Xo'jayev Alisher - Iqtisodiyot va moliya
2. Qobilov Rustam - Qishloq xo'jaligi
3. To'rayeva Nilufar - Ijtimoiy masalalar
4. Rajabov Sherzod - Qurilish va infratuzilma
5. Saidova Gulnora - Ma'naviyat va targ'ibot

📱 IJTIMOIY TARMOQLAR:
• Telegram: t.me/jondor_hokimlik
• Facebook: facebook.com/jondor.tumani`,
        ru: `🏛️ РУКОВОДСТВО ДЖОНДОРСКОГО РАЙОНА

👨‍💼 ХОКИМ РАЙОНА: Худоев Джамшид Раджабович

📞 ТЕЛЕФОНЫ:
• Прием хокима: +998 65 380-00-01
• Телефон доверия: +998 65 582-18-53
• Приемная: +998 65 380-00-00
• Факс: +998 65 582-26-53

✉️ EMAIL:
• Официальный: jondor.t@exat.uz
• Общий отдел: info@jondor.uz
• Для обращений: appeal@jondor.uz

🏢 АДРЕС:
Бухарская область, Джондорский район, ул. М. Таробий, 26

📅 ВРЕМЯ ПРИЕМА:
• Прием хокима: Пн-Пт, 15:00-17:00
• Прием граждан: Каждый четверг, 10:00-13:00
• Рабочее время: Пн-Пт, 09:00-18:00
• Обед: 13:00-14:00

👥 ЗАМЕСТИТЕЛИ ХОКИМА:
1. Хужаев Алишер - Экономика и финансы
2. Кобилов Рустам - Сельское хозяйство
3. Тураева Нилуфар - Социальные вопросы
4. Раджабов Шерзод - Строительство
5. Саидова Гулнора - Духовность и пропаганда`,
        en: `🏛️ LEADERSHIP OF JONDOR DISTRICT

👨‍💼 KHOKIM: Khudoyev Jamshid Rajabovich

📞 PHONE NUMBERS:
• Khokim reception: +998 65 380-00-01
• Hotline: +998 65 582-18-53
• Reception: +998 65 380-00-00
• Fax: +998 65 582-26-53

✉️ EMAIL ADDRESSES:
• Official: jondor.t@exat.uz
• General: info@jondor.uz
• Appeals: appeal@jondor.uz

🏢 ADDRESS:
Bukhara region, Jondor district, M. Tarobiy str., 26

📅 RECEPTION HOURS:
• Khokim reception: Mon-Fri, 15:00-17:00
• Citizens reception: Every Thursday, 10:00-13:00
• Working hours: Mon-Fri, 09:00-18:00
• Lunch: 13:00-14:00

👥 DEPUTY KHOKIMS:
1. Khujayev Alisher - Economy and finance
2. Qobilov Rustam - Agriculture
3. To'rayeva Nilufar - Social affairs
4. Rajabov Sherzod - Construction
5. Saidova Gulnora - Spirituality and propaganda`,
      },

      // ============ STATISTIKA TO'LIQ ============
      statistika_batafsil: {
        uz: `📊 JONDOR TUMANI TO'LIQ STATISTIKASI (2024)



👥 AHOLI:
• Jami aholi: 154,700+ kishi
• Shahar aholisi: 45,200 kishi (29.2%)
• Qishloq aholisi: 109,500 kishi (70.8%)
• Erkaklar: 77,800 kishi (50.3%)
• Ayollar: 76,900 kishi (49.7%)
• Aholi zichligi: 1 km² ga 129 kishi
• O'rtacha yosh: 28.5 yil
• Yosh bolalar (0-14): 35.2%
• Mehnatga layoqatlilar (15-64): 58.3%
• Keksalar (65+): 6.5%



🏫 TA'LIM:
• Umumta'lim maktablari: 45 ta
• Litsey va kollejlar: 3 ta
• Maktabgacha ta'lim: 24 ta bog'cha
• O'quvchilar: 28,450+ nafar
• O'qituvchilar: 1,850+ nafar
• Oliy ma'lumotlilar: 8,500+ nafar



🏥 SOG'LIQNI SAQLASH:
• Kasalxonalar: 8 ta (500+ o'rin)
• Poliklinikalar: 12 ta
• Qishloq vrachlik punktlari: 25 ta
• Tez yordam stansiyalari: 3 ta
• Shifokorlar: 320+ nafar
• O'rta tibbiy xodimlar: 580+ nafar
• Aholiga to'g'ri keladigan shifokorlar: 483 kishiga 1 shifokor



🏪 IQTISODIYOT:
• Korxonalar: 2,004 ta
• Kichik biznes: 1,850+ ta
• O'rta biznes: 120+ ta
• Yirik korxonalar: 34 ta
• Xususiy tadbirkorlik: 2,500+ ta
• Investitsiyalar hajmi: 85+ mlrd so'm



🌾 QISHLOQ XO'JALIGI:
• Fermer xo'jaliklari: 134 ta
• Qishloq xo'jaligi korxonalari: 56 ta
• Ekin maydoni: 35,000+ gektar
• Sug'oriladigan yerlar: 32,000+ gektar



🏘️ MA'MURIY HUDUDLAR:
• MFY: 14 ta
• Qishloqlar: 42 ta
• Shaharchalar: 3 ta (Jondor, Qiziltepa, Yangiobod)`,
        ru: `📊 ПОЛНАЯ СТАТИСТИКА ДЖОНДОРСКОГО РАЙОНА (2024)



👥 НАСЕЛЕНИЕ:
• Всего: 154 700+ человек
• Городское: 45 200 (29.2%)
• Сельское: 109 500 (70.8%)
• Мужчины: 77 800 (50.3%)
• Женщины: 76 900 (49.7%)
• Плотность: 129 чел/км²
• Средний возраст: 28.5 лет



🏫 ОБРАЗОВАНИЕ:
• Школы: 45
• Лицеи и колледжи: 3
• Детские сады: 24
• Ученики: 28 450+
• Учителя: 1 850+



🏥 ЗДРАВООХРАНЕНИЕ:
• Больницы: 8 (500+ коек)
• Поликлиники: 12
• Сельские врачебные пункты: 25
• Врачи: 320+
• Медсестры: 580+



🏪 ЭКОНОМИКА:
• Предприятия: 2 004
• Малый бизнес: 1 850+
• Крупные предприятия: 34
• Инвестиции: 85+ млрд сумов



🌾 СЕЛЬСКОЕ ХОЗЯЙСТВО:
• Фермерские хозяйства: 134
• Посевная площадь: 35 000+ га
• Орошаемые земли: 32 000+ га`,
        en: `📊 COMPLETE STATISTICS OF JONDOR DISTRICT (2024)



👥 POPULATION:
• Total: 154,700+
• Urban: 45,200 (29.2%)
• Rural: 109,500 (70.8%)
• Men: 77,800 (50.3%)
• Women: 76,900 (49.7%)
• Density: 129 people/km²
• Average age: 28.5 years



🏫 EDUCATION:
• Schools: 45
• Lyceums and colleges: 3
• Kindergartens: 24
• Students: 28,450+
• Teachers: 1,850+



🏥 HEALTHCARE:
• Hospitals: 8 (500+ beds)
• Polyclinics: 12
• Rural medical stations: 25
• Doctors: 320+
• Nurses: 580+



🏪 ECONOMY:
• Enterprises: 2,004
• Small business: 1,850+
• Large enterprises: 34
• Investments: 85+ billion sums



🌾 AGRICULTURE:
• Farms: 134
• Sown area: 35,000+ hectares
• Irrigated land: 32,000+ hectares`,
      },

      // ============ QISHLOQ XO'JALIGI TO'LIQ ============
      qishloq_xojaligi: {
        uz: `🌾 JONDOR TUMANI QISHLOQ XO'JALIGI



🌱 EKIN MAYDONLARI:
• Paxta: 15,500 gektar
• Bug'doy: 12,800 gektar
• Arpa: 4,200 gektar
• Makkajo'xori: 2,100 gektar
• Sabzavot: 2,500 gektar
• Poliz ekinlari (qovun, tarvuz): 1,800 gektar
• Meva bog'lari: 950 gektar
• Uzumzorlar: 620 gektar
• Yem-xashak ekinlari: 3,200 gektar



📊 YILLIK HOSIL:
• Paxta: 52,000+ tonna
• Bug'doy: 38,000+ tonna
• Arpa: 12,500+ tonna
• Sabzavot: 45,000+ tonna
• Qovun-tarvuz: 35,000+ tonna
• Meva: 12,000+ tonna
• Uzum: 8,500+ tonna
• Kartoshka: 5,200+ tonna



🐄 CHORVACHILIK:
• Qoramol: 18,500 bosh (shundan 8,200 ta sigir)
• Qo'y-echki: 32,000 bosh
• Parranda: 45,000 bosh
• Ot: 850 bosh
• Tuyalar: 120 bosh
• Asalari oilalari: 450 ta



🥛 HOSIL MAHSULOTLARI:
• Sut: 35,000+ tonna/yil
• Go'sht: 4,500+ tonna/yil
• Tuxum: 2.5+ million dona/yil
• Jun: 45+ tonna/yil
• Asal: 8+ tonna/yil



🏭 QAYTA ISHLASH KORXONALARI:
• Paxta tozalash zavodi: 2 ta
• Un va don mahsulotlari: 4 ta
• Sut va go'sht mahsulotlari: 3 ta
• Sabzavot konserva: 2 ta
• Non mahsulotlari: 12 ta



💧 SUG'ORISH TIZIMI:
• Amudaryodan suv olinadi
• Zamonaviy tomchilatib sug'orish: 3,500 gektar
• Nasos stansiyalari: 18 ta
• Kanallar umumiy uzunligi: 245 km
• Suv omborlari: 5 ta`,
        ru: `🌾 СЕЛЬСКОЕ ХОЗЯЙСТВО ДЖОНДОРСКОГО РАЙОНА

🌱 ПОСЕВНЫЕ ПЛОЩАДИ:
• Хлопок: 15 500 га
• Пшеница: 12 800 га
• Ячмень: 4 200 га
• Овощи: 2 500 га
• Сады: 950 га
• Виноградники: 620 га

📊 ГОДОВОЙ УРОЖАЙ:
• Хлопок: 52 000+ тонн
• Пшеница: 38 000+ тонн
• Овощи: 45 000+ тонн
• Фрукты: 12 000+ тонн
• Виноград: 8 500+ тонн

🐄 ЖИВОТНОВОДСТВО:
• КРС: 18 500 голов
• Овцы-козы: 32 000 голов
• Птица: 45 000 голов
• Лошади: 850 голов
• Верблюды: 120 голов

💧 ОРОСИТЕЛЬНАЯ СИСТЕМА:
• Капельное орошение: 3 500 га
• Насосные станции: 18
• Каналы: 245 км`,
        en: `🌾 AGRICULTURE OF JONDOR DISTRICT

🌱 SOWN AREAS:
• Cotton: 15,500 hectares
• Wheat: 12,800 hectares
• Barley: 4,200 hectares
• Vegetables: 2,500 hectares
• Orchards: 950 hectares
• Vineyards: 620 hectares

📊 ANNUAL HARVEST:
• Cotton: 52,000+ tons
• Wheat: 38,000+ tons
• Vegetables: 45,000+ tons
• Fruits: 12,000+ tons
• Grapes: 8,500+ tons

🐄 LIVESTOCK:
• Cattle: 18,500 heads
• Sheep-goats: 32,000 heads
• Poultry: 45,000 heads
• Horses: 850 heads
• Camels: 120 heads

💧 IRRIGATION SYSTEM:
• Drip irrigation: 3,500 hectares
• Pumping stations: 18
• Canals: 245 km`,
      },

      // ============ SOLG BANK TO'LIQ ============
      solg_bank: {
        uz: `🏦 SOLG BANK (SOLG BANK) HAQIDA TO'LIQ MA'LUMOT



📞 ALOQA MA'LUMOTLARI:
• Asosiy telefon: +998 65 380-01-00
• Qo'llab-quvvatlash: +998 65 380-01-01
• Faks: +998 65 380-01-02
• Call-center: 1245 (24/7)
• Email: solg@jondorbank.uz



🏢 MANZIL VA FILIALLAR:
📍 MARKAZIY FILIAL:
Jondor tumani, Markaziy ko'cha, 15-uy
(Jondor tuman hokimligidan 500 metr sharqda)

📍 QIZILTEPA FILIALI:
Qiziltepa MFY, Do'stlik ko'chasi, 8-uy

📍 YANGIOBOD FILIALI:
Yangiobod qishlog'i, Navoiy ko'chasi, 23-uy



⏰ ISH VAQTI:
• Dushanba - Juma: 09:00 - 18:00
• Shanba: 09:00 - 14:00
• Yakshanba: Dam olish kuni
• Tushlik: 13:00 - 14:00



💳 BANK XIZMATLARI:

1️⃣ PLASTIK KARTALAR:
• Humo (Milliy to'lov tizimi)
• Uzcard
• Visa Classic / Gold
• MasterCard Standard / Gold

2️⃣ KREDITLAR:
• "Oson kredit" - 24% dan boshlab (30 kunda tasdiq)
• "Tadbirkor" - mikrokredit 18% dan
• "Farovon hayot" - ipoteka 22% dan (15 yilgacha)
• "Avto kredit" - avtomobil uchun 20% dan
• "Agro kredit" - fermerlar uchun 16% dan

3️⃣ DEPOZITLAR:
• "Omonat" - 22% gacha (12 oy)
• "Farzandlar kelajagi" - 23% gacha (24 oy)
• "Pensiya+" - 21% gacha

4️⃣ PUL O'TKAZMALARI:
• Golden Pay
• Contact
• Unistream
• Zolotaya Korona
• Western Union



📱 ONLINE BANKING:
SOLG24 mobil ilovasi orqali:
• Hisob raqamlarini boshqarish
• To'lovlarni amalga oshirish
• Karta blokirovkasi
• Kredit olish uchun ariza
• Balansni tekshirish



💰 KURS (O'zbekiston Respublikasi Markaziy bankiga ko'ra):
• USD: 1 USD = 12,600+ so'm
• EUR: 1 EUR = 13,500+ so'm
• RUB: 1 RUB = 140+ so'm



📞 QO'SHIMCHA MA'LUMOT:
• Kredit bo'limi: +998 65 380-01-03
• Depozit bo'limi: +998 65 380-01-04
• Plastik kartalar: +998 65 380-01-05`,
        ru: `🏦 SOLG БАНК (SOLG BANK) ПОЛНАЯ ИНФОРМАЦИЯ

📞 КОНТАКТЫ:
• Основной: +998 65 380-01-00
• Поддержка: +998 65 380-01-01
• Call-центр: 1245
• Email: solg@jondorbank.uz

🏢 АДРЕС И ФИЛИАЛЫ:
📍 Центральный: ул. Марказий, 15
📍 Кызылтепа: ул. Достлик, 8
📍 Янгиабад: ул. Навои, 23

⏰ РЕЖИМ РАБОТЫ:
Пн-Пт: 09:00-18:00, Сб: 09:00-14:00

💳 УСЛУГИ:
• Карты: Humo, Uzcard, Visa, MasterCard
• Кредиты: от 16% до 24%
• Депозиты: до 23%
• Переводы: Golden Pay, Contact, Western Union

📱 Мобильное приложение: SOLG24`,
        en: `🏦 SOLG BANK COMPLETE INFORMATION

📞 CONTACTS:
• Main: +998 65 380-01-00
• Support: +998 65 380-01-01
• Call-center: 1245
• Email: solg@jondorbank.uz

🏢 ADDRESS AND BRANCHES:
📍 Central: Markaziy str., 15
📍 Qiziltepa: Do'stlik str., 8
📍 Yangiobod: Navoiy str., 23

⏰ WORKING HOURS:
Mon-Fri: 09:00-18:00, Sat: 09:00-14:00

💳 SERVICES:
• Cards: Humo, Uzcard, Visa, MasterCard
• Loans: from 16% to 24%
• Deposits: up to 23%
• Transfers: Golden Pay, Contact, Western Union

📱 Mobile app: SOLG24`,
      },

      // ============ YANGILIKLAR ============
      yangiliklar: {
        uz: `📰 JONDOR TUMANIDA SO'NGI YANGILIKLAR

• "Yangi Jondor" gazetasi har payshanba va yakshanba kunlari chiqadi
• Rasmiy Telegram kanal: t.me/jondor_xabarlari
• Facebook sahifasi: facebook.com/jondor.tumani

🔔 Doimiy yangiliklardan xabardor bo'lish uchun "Yangiliklar" bo'limiga tashrif buyuring!`,
        ru: `📰 ПОСЛЕДНИЕ НОВОСТИ ДЖОНДОРСКОГО РАЙОНА

• Газета "Новый Джондор" выходит по четвергам и воскресеньям
• Telegram канал: t.me/jondor_xabarlari
• Facebook страница: facebook.com/jondor.tumani

🔔 Чтобы быть в курсе новостей, посетите раздел "Новости"!`,
        en: `📰 LATEST NEWS OF JONDOR DISTRICT

• "Yangi Jondor" newspaper published on Thursdays and Sundays
• Telegram channel: t.me/jondor_xabarlari
• Facebook page: facebook.com/jondor.tumani

🔔 Visit the "News" section to stay updated!`,
      },

      // ============ YORDAM ============
      yordam_batafsil: {
        uz: `🤖 JONDOR AI YORDAMCHI - BARCHA MUMKIN BO'LGAN SAVOLLAR



📍 TUMAN HAQIDA:
• "Tuman haqida" - To'liq ma'lumot
• "Tarix" - Tarixiy obidalar
• "Geografiya" - Joylashuvi va iqlimi
• "Maydoni" / "Aholisi"



🏛️ RAHBARIYAT:
• "Hokim" - Hokim ma'lumotlari
• "Hokim o'rinbosarlari" - 5 ta o'rinbosar
• "Qabul vaqti" - Ish vaqti va qabul kunlari• "Telefon" / "Email" / "Manzil"



📊 STATISTIKA:
• "Statistika" - To'liq raqamlar
• "Aholi" - Aholi soni va tarkibi
• "Maktablar" - Ta'lim muassasalari
• "Kasalxonalar" - Sog'liqni saqlash
• "Iqtisodiyot" / "Korxonalar"



🌾 QISHLOQ XO'JALIGI:
• "Fermerlar" / "Fermer xo'jaliklari"
• "Qishloq xo'jaligi" - Ekinlar va chorvachilik
• "Paxta" / "Bug'doy" / "Hosil"



🏦 BANK VA MOLIYA:
• "SOLG" / "GOLS" / "SOLG BANK"
• "Kredit" / "Kartalar" / "Plastik karta"
• "Depozit" / "Pul o'tkazmasi"


📞 ALOQA VA XIZMATLAR:
• "Telefon raqamlari" / "Qabulxona"
• "Email manzillari"
• "Xizmatlar" / "Davlat xizmatlari"


📰 YANGILIKLAR VA MEDIA:
• "Yangiliklar" / "Galereya"


❓ Istalgan savolingizga javob berishga tayyorman!
💡 Masalan: "Statistika", "Hokim o'rinbosarlari", "SOLG kredit"`,
        ru: `🤖 ПОМОЩНИК JONDOR AI - ВСЕ ВОПРОСЫ

📍 О РАЙОНЕ: "О районе", "История", "География"
🏛️ РУКОВОДСТВО: "Хоким", "Заместители хокима", "Время приема"
📊 СТАТИСТИКА: "Статистика", "Население", "Школы", "Больницы"
🌾 СЕЛЬСКОЕ ХОЗЯЙСТВО: "Фермеры", "Сельское хозяйство"
🏦 БАНК: "SOLG", "Кредит", "Карты"
📞 КОНТАКТЫ: "Телефон", "Email", "Услуги"

❓ Задайте любой вопрос!`,
        en: `🤖 JONDOR AI ASSISTANT - ALL POSSIBLE QUESTIONS

📍 DISTRICT: "About district", "History", "Geography"
🏛️ LEADERSHIP: "Khokim", "Deputy khokims", "Reception hours"
📊 STATISTICS: "Statistics", "Population", "Schools", "Hospitals"
🌾 AGRICULTURE: "Farms", "Agriculture"
🏦 BANK: "SOLG", "Credit", "Cards"
📞 CONTACTS: "Phone", "Email", "Services"

❓ Ask me anything!`,
      },
    };

    // ==================== SAVOLLARGA JAVOB BERISH ====================

    // Salomlashish
    if (
      msg.match(
        /(salom|assalom|alom|hello|hi|hay|assalomu alaykum|aleykum assalom|good morning|good afternoon)/i,
      )
    ) {
      return beautifyText(responses.salom[language]);
    }

    // Tuman haqida to'liq
    if (
      msg.match(
        /(tuman haqida|jondor haqida|tuman|qanday tuman|tumaningiz qanday|tumanni tanishtir|jondor qanday tuman|tuman haqida malumot|batafsil ma'lumot)/i,
      )
    ) {
      return beautifyText(responses.tuman_batafsil[language]);
    }

    // Tarix
    if (
      msg.match(
        /(tarix|tarixi|qachon tashkil topgan|tarixiy obidalar|qadimiy|boy tarix|nechanchi yilda|1926)/i,
      )
    ) {
      return beautifyText(
        responses.tuman_batafsil[language].split("📜")[1]?.split("🗺️")[0] ||
          responses.tuman_batafsil[language],
      );
    }

    // Geografiya va joylashuv
    if (
      msg.match(
        /(geografiya|joylashuvi|qayerda joylashgan|maydoni|iqlimi|ob-havo|qayerda|hududi|chegaradosh|daryo|suv)/i,
      )
    ) {
      return beautifyText(
        responses.tuman_batafsil[language].split("🗺️")[1] ||
          responses.tuman_batafsil[language],
      );
    }

    // Aholi
    if (
      msg.match(
        /(aholi|odam|kishi|qancha odam|aholisi|necha kishi|aholi soni|aholi tarkibi)/i,
      )
    ) {
      const stats = responses.statistika_batafsil[language];
      const populationPart = stats.split("👥")[1]?.split("🏫")[0] || stats;
      return beautifyText(`👥 AHOLI HAQIDA MA'LUMOT\n\n${populationPart}`);
    }

    // Hokim va rahbariyat
    if (
      msg.match(
        /(hokim|rahbar|rahbariyat|tuman rahbari|hokim kim|hokim ismi|hokim familiyasi|hokimning ismi|tuman hokimi)/i,
      )
    ) {
      return beautifyText(responses.hokim_batafsil[language]);
    }

    // Hokim o'rinbosarlari
    if (
      msg.match(
        /(hokim o'rinbosari|o'rinbosar|yordamchisi|deputat|hokim yordamchisi|hokim deputati|o'rinbosarlari)/i,
      )
    ) {
      const deputies =
        responses.hokim_batafsil[language].split("👥")[1]?.split("📱")[0] ||
        responses.hokim_batafsil[language].split("👥")[1];
      return beautifyText(
        `👥 HOKIM O'RINBOSARLARI\n${deputies || "Hokimning 5 nafar o'rinbosari mavjud. Batafsil ma'lumot uchun 'Hokim' deb yozing."}`,
      );
    }

    // Statistika (to'liq)
    if (
      msg.match(
        /(statistika|raqamlar|qancha|nechta|ma'lumotlar|statistik ma'lumot|soni|ko'rsatkichlar|statistika batafsil)/i,
      )
    ) {
      return beautifyText(responses.statistika_batafsil[language]);
    }

    // Maktablar va ta'lim
    if (
      msg.match(
        /(maktab|ta'lim|o'quvchi|talaba|maktablar|o'quvchilar|kollej|litsey|bog'cha|o'qituvchi)/i,
      )
    ) {
      const stats = responses.statistika_batafsil[language];
      const eduPart = stats.split("🏫")[1]?.split("🏥")[0] || stats;
      return beautifyText(`🏫 TA'LIM TIZIMI\n${eduPart}`);
    }

    // Kasalxonalar va sog'liq
    if (
      msg.match(
        /(kasalxona|shifoxona|sog'liq|poliklinika|shifokor|vrach|hamshira|davolanish|tibbiyot)/i,
      )
    ) {
      const stats = responses.statistika_batafsil[language];
      const healthPart = stats.split("🏥")[1]?.split("🏪")[0] || stats;
      return beautifyText(`🏥 SOG'LIQNI SAQLASH\n${healthPart}`);
    }

    // Iqtisodiyot va korxonalar
    if (
      msg.match(
        /(iqtisod|iqtisodiyot|korxona|ishlab chiqarish|biznes|tadbirkorlik|iqtisodiy|investitsiya|sanoat)/i,
      )
    ) {
      const stats = responses.statistika_batafsil[language];
      const ecoPart = stats.split("🏪")[1]?.split("🌾")[0] || stats;
      return beautifyText(`💰 IQTISODIYOT\n${ecoPart}`);
    }

    // Qishloq xo'jaligi va fermerlar
    if (
      msg.match(
        /(fermer|qishloq xo'jaligi|paxta|bug'doy|sabzavot|bog'|chorva|dehqon|fermerlik|ekin|hosil|qoramol|qo'y|echki|parranda|sut|go'sht)/i,
      )
    ) {
      return beautifyText(responses.qishloq_xojaligi[language]);
    }

    // SOLG BANK (GOLS)
    if (
      msg.match(
        /(solg|gols|solg bank|gols bank|bank|kredit|karta|plastik karta|depozit|pul o'tkazmasi|ipoteka|mikrokredit|humo|uzcard|visa|mastercard)/i,
      )
    ) {
      return beautifyText(responses.solg_bank[language]);
    }

    // Telefon va aloqa
    if (
      msg.match(
        /(telefon|tel|aloqa|nomer|qo'ng'iroq|qayta aloqa|bog'lanish|call)/i,
      )
    ) {
      const contact =
        responses.hokim_batafsil[language].split("📞")[1]?.split("✉️")[0] ||
        responses.hokim_batafsil[language];
      return beautifyText(`📞 ALOQA MA'LUMOTLARI\n${contact}`);
    }

    // Email
    if (
      msg.match(
        /(email|pochta|mail|elektron pochta|gmail|@|jondor.t|exat|info@)/i,
      )
    ) {
      const emailPart =
        responses.hokim_batafsil[language].split("✉️")[1]?.split("🏢")[0] ||
        responses.hokim_batafsil[language];
      return beautifyText(`✉️ EMAIL MANZILLARI\n${emailPart}`);
    }

    // Manzil
    if (
      msg.match(
        /(manzil|qayerda|borish|adres|uy|joylashgan|ko'cha|map|navigatsiya|tarobiy)/i,
      )
    ) {
      const addressPart =
        responses.hokim_batafsil[language].split("🏢")[1]?.split("📅")[0] ||
        responses.hokim_batafsil[language];
      return beautifyText(`📍 MANZIL\n${addressPart}`);
    }

    // Qabul vaqti
    if (
      msg.match(
        /(qabul vaqti|ish vaqti|kabul|qabul kunlari|qachon qabul|soat|dushanba|payshanba|juma|seshanba|chorshanba)/i,
      )
    ) {
      const receptionPart =
        responses.hokim_batafsil[language].split("📅")[1]?.split("👥")[0] ||
        responses.hokim_batafsil[language];
      return beautifyText(`📅 QABUL VAQTLARI\n${receptionPart}`);
    }

    // Xizmatlar
    if (
      msg.match(
        /(xizmat|xizmatlar|davlat xizmati|hujjat|rasmiylashtirish|pasport|id card|hujjatlar)/i,
      )
    ) {
      return beautifyText(`✅ JONDOR TUMANIDA KO'RSATILADIGAN XIZMATLAR

📄 HUJJATLAR:
• Pasport va ID card rasmiylashtirish
• Mehnat daftarchasi berish
• Nikoh va ajrim qaydnomasi
• Tug'ilganlik haqida guvohnoma
• Ko'chmas mulk hujjatlari

🏢 DAVLAT XIZMATLARI:
• Tadbirkorlikni ro'yxatdan o'tkazish
• Litsenziya va ruxsatnomalar
• Subsidiyalar va grantlar

👨‍👩‍👧‍👦 IJTIMOIY YORDAM:
• Moddiy yordam va nafaqalar
• Pensiya tayinlash
• Nogironlik guvohnomasi

📞 MA'LUMOT UCHUN: +998 65 380-00-00`);
    }

    // Yangiliklar
    if (
      msg.match(
        /(yangilik|yangiliklar|so'nggi yangilik|oxirgi yangilik|yangi|news|xabar|voqea|tadbir|jondor xabarlari)/i,
      )
    ) {
      return beautifyText(responses.yangiliklar[language]);
    }

    // Galereya
    if (
      msg.match(/(galereya|rasm|foto|surat|media|gallery|rasmlar|fotografiya)/i)
    ) {
      return beautifyText(`🖼️ JONDOR TUMANI GALEREYASI

Rasmlar soni: 20+ ta
Eng so'nggi rasmlar galereyada mavjud.

📸 Barcha rasmlarni "Media" bo'limida ko'rishingiz mumkin!`);
    }

    // Xayr
    if (
      msg.match(/(xayr|hayr|bye|goodbye|ko'rishguncha|salomat bo'ling|alvido)/i)
    ) {
      return beautifyText(
        "Xayr! 👋 Jondor tumanining AI yordamchisidan foydalanganingiz uchun katta rahmat. Yana ko'rishguncha! 😊 Sizga yordam berishdan doim mamnunman. Omad tilayman! 🌟",
      );
    }

    // Rahmat
    if (
      msg.match(/(rahmat|raxmat|tashakkur|thank|thanks|spasibo|minnatdor)/i)
    ) {
      return beautifyText(
        "Rahmat katta! 😊 Sizga yordam berishdan mamnunman. Yana savolingiz bo'lsa, so'rashingiz mumkin. Jondor tumani haqida yana qanday ma'lumot kerak?",
      );
    }

    // Yordam
    if (
      msg.match(
        /(yordam|help|yardim|qanday ishlatiladi|qanaqa savol bera olaman|nima deb so'rasam|qanday savollar)/i,
      )
    ) {
      return beautifyText(responses.yordam_batafsil[language]);
    }

    // Default javob (topilmaganda)
    const defaultResponses = {
      uz: `🤔 Kechirasiz, men "${userMessage}" degan savolingizga aniq javob topa olmadim. 😅

💡 Quyidagi so'zlardan birini yozib ko'ring:
• "Yordam" - Barcha mumkin bo'lgan savollar
• "Tuman haqida" - Umumiy ma'lumot
• "Statistika" - Raqamli ma'lumotlar
• "Hokim" - Tuman hokimi haqida
• "SOLG" - SOLG BANK haqida
• "Fermerlar" - Qishloq xo'jaligi haqida

Yoki savolingizni boshqacha tarzda yozing. Men sizga yordam berishga harakat qilaman! 💪`,
      ru: `🤔 Извините, я не смог найти точный ответ на ваш вопрос "${userMessage}". 😅

💡 Попробуйте написать одно из слов:
• "Помощь" - Все возможные вопросы
• "О районе" - Общая информация
• "Статистика" - Цифровые данные
• "Хоким" - О хокиме района
• "SOLG" - О банке SOLG
• "Фермеры" - О сельском хозяйстве

Или попробуйте задать вопрос по-другому. Я постараюсь вам помочь! 💪`,
      en: `🤔 Sorry, I couldn't find an exact answer to your question "${userMessage}". 😅

💡 Try typing one of these:
• "Help" - All possible questions
• "About district" - General information
• "Statistics" - Numerical data
• "Khokim" - About the district khokim
• "SOLG" - About SOLG BANK
• "Farms" - About agriculture

Or try asking your question differently. I will try to help you! 💪`,
    };

    return beautifyText(defaultResponses[language]);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      isUser: true,
      time: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    const question = chatInput;
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = getAIResponse(question, aiLang);
      const aiMessage = {
        id: Date.now() + 1,
        text: answer,
        isUser: false,
        time: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      // Ovozli javob berish
      speakText(answer, aiLang);
    }, 800);
  };

  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-slide uchun useEffect
  useEffect(() => {
    if (adminData?.carousel && adminData.carousel.length > 1) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % adminData.carousel.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [adminData?.carousel]);

  const handleVoiceInput = () => {
    const recognition = new (
      window.SpeechRecognition || window.webkitSpeechRecognition
    )();
    const langMap = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };
    recognition.lang = langMap[aiLang];
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setChatInput(text);
      setTimeout(() => handleSendMessage(), 100);
    };
    recognition.start();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const quickLinks = [
    {
      path: "/services",
      icon: "th-large",
      label: "Xizmatlar",
      labelRu: "Услуги",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      path: "/news",
      icon: "newspaper",
      label: "Yangiliklar",
      labelRu: "Новости",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      path: "/documents",
      icon: "file-alt",
      label: "Hujjatlar",
      labelRu: "Документы",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      path: "/media",
      icon: "photo-video",
      label: "Media",
      labelRu: "Медиа",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      path: "/organizations",
      icon: "building",
      label: "Tashkilotlar",
      labelRu: "Организации",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      path: "/statistics",
      icon: "chart-line",
      label: "Statistika",
      labelRu: "Статистика",
      bg: "bg-teal-50",
      text: "text-teal-600",
    },
    {
      path: "/contact",
      icon: "envelope",
      label: "Aloqa",
      labelRu: "Контакты",
      bg: "bg-pink-50",
      text: "text-pink-600",
    },
    {
      path: "/about",
      icon: "info-circle",
      label: "Tuman haqida",
      labelRu: "О районе",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
  ];

  const features = [
    {
      icon: "fas fa-user-check",
      title: t("Tez xizmat ko'rsatish", "Быстрое обслуживание"),
      desc: t("30 daqiqada javob", "Ответ за 30 минут"),
    },
    {
      icon: "fas fa-shield-alt",
      title: t("Ishonchli tizim", "Надежная система"),
      desc: t("Ma'lumotlar himoyasi", "Защита данных"),
    },
    {
      icon: "fas fa-mobile-alt",
      title: t("Mobil qulaylik", "Мобильное удобство"),
      desc: t("Har qanday qurilmadan", "С любого устройства"),
    },
    {
      icon: "fas fa-headset",
      title: t("24/7 Yordam", "Круглосуточная помощь"),
      desc: t("Doimiy online qo'llab-quvvatlash", "Постоянная поддержка"),
    },
  ];

  const receptionHours = {
    governor: {
      days: "Dushanba - Juma",
      daysRu: "Понедельник - Пятница",
      time: "15:00 - 17:00",
      location: "Hokimiyat binosi, 2-qavat",
      locationRu: "Здание хокимията, 2-этаж",
    },
    citizens: {
      days: "Har payshanba",
      daysRu: "Каждый четверг",
      time: "10:00 - 13:00",
      phone: "+998 65 380-00-00",
    },
  };

  const carouselList = adminData?.carousel || [];
  const leadersList = adminData?.leadership || [];
  const galleryList = adminData?.gallery || [];
  const newsList = adminData?.news || [];

  // Faqat 3 ta eng so'nggi yangilikni olish
  const latestNews = newsList.slice(0, 3);

  const getCategoryColor = (category) => {
    const colors = {
      yangilik: "bg-blue-500",
      "e'lon": "bg-green-500",
      tadbir: "bg-purple-500",
      default: "bg-gray-500",
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      uz: { yangilik: "Yangilik", "e'lon": "E'lon", tadbir: "Tadbir" },
      ru: { yangilik: "Новость", "e'lon": "Объявление", tadbir: "Событие" },
      en: { yangilik: "News", "e'lon": "Announcement", tadbir: "Event" },
    };
    return labels[lang]?.[category?.toLowerCase()] || category;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hozirgina";
    if (diffMins < 60)
      return `${diffMins} ${lang === "uz" ? "daqiqa oldin" : lang === "ru" ? "минут назад" : "minutes ago"}`;
    if (diffHours < 24)
      return `${diffHours} ${lang === "uz" ? "soat oldin" : lang === "ru" ? "часов назад" : "hours ago"}`;
    if (diffDays < 7)
      return `${diffDays} ${lang === "uz" ? "kun oldin" : lang === "ru" ? "дней назад" : "days ago"}`;

    return date.toLocaleDateString(
      lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );
  };

  return (
    <div
      style={{ backgroundImage: `url(${rasm})` }}
      className="relative overflow-x-hidden "
    >
      {/* Hero Slider - Video bilan to'liq versiya */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 w-full overflow-hidden pb-8 lg:rounded-b-[80px] rounded-b-[40px]">
        {/* Video Background */}
        <video
          className="absolute lg:flex opacity-30 bottom-0 h-full w-full pointer-events-none object-cover"
          src="https://media.istockphoto.com/id/675934872/video/timelapse-of-the-clear-sky.mp4?p=1&s=mp4-640x640-is&k=20&c=ew0TN6INcUMXOtPiLJENipUMAt2ywHPw4mIFLcORpPU="
          autoPlay
          loop
          muted
          playsInline
          style={{ objectFit: "cover" }}
        />

        {/* Orbs */}
        <span className="hero-orb hero-orb-1"></span>
        <span className="hero-orb hero-orb-2"></span>
        <span className="hero-orb hero-orb-3"></span>
        <span className="hero-orb hero-orb-4"></span>

        <div>
          {/* Quick Links Scroll Section */}
          <section>
            <div className=" mx-auto lg:py-4 py-1 lg:my-6 my-1">
              <div className="overflow-x-hidden">
                <div id="scroll-container" className="flex gap-8">
                  <div className="scroll-content gap-[11px] py-2 flex">
                    {quickLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.path}
                        className="custom-group group relative min-w-[150px] max-w-[220px] h-[50px] md:h-[70px] lg:min-w-[190px] lg:max-w-[300px] lg:h-[85px] bg-[#f3f4f6] rounded-md lg:rounded-xl p-6 overflow-hidden no-underline transition-all duration-200 hover:-translate-y-0 hover:shadow-lg cursor-pointer flex justify-between flex-shrink-0"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 flex items-center justify-center rounded-md lg:rounded-xl bg-[#213972] text-white shadow-[0_8px_25px_rgba(33,57,114,0.35)] transition-all duration-300 custom-group-hover:shadow-[0_12px_35px_rgba(33,57,114,0.55)] custom-group-hover:bg-[#244db6]">
                            <i className={`fas fa-${link.icon} text-xl`}></i>
                          </div>
                          <div>
                            <h3 className="mt-2 text-base font-semibold leading-none text-[#213972] transition-colors duration-300 custom-group-hover:text-[#244db6]">
                              {t(link.label, link.labelRu)}
                            </h3>
                            <p className="text-gray-400 hidden lg:block transition-all duration-300 text-sm font-semibold custom-group-hover:text-gray-500">
                              {t("Davom etish", "Продолжить")}
                            </p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 text-[#213972]/10 transition-all duration-500 ease-out origin-bottom-right group-hover:rotate-45 group-hover:text-[#244db6]/60">
                          <i
                            className={`fas fa-${link.icon} text-7xl lg:text-8xl opacity-50`}
                          ></i>
                        </div>
                      </Link>
                    ))}
                    {/* Duplicate for infinite scroll effect */}
                    {quickLinks.map((link, idx) => (
                      <Link
                        key={`dup-${idx}`}
                        to={link.path}
                        className="custom-group group relative min-w-[150px] max-w-[220px] h-[50px] md:h-[70px] lg:min-w-[190px] lg:max-w-[300px] lg:h-[85px] bg-[#f3f4f6] rounded-md lg:rounded-xl p-6 overflow-hidden no-underline transition-all duration-200 hover:-translate-y-0 hover:shadow-lg cursor-pointer flex justify-between flex-shrink-0"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 flex items-center justify-center rounded-md lg:rounded-xl bg-[#213972] text-white shadow-[0_8px_25px_rgba(33,57,114,0.35)] transition-all duration-300 custom-group-hover:shadow-[0_12px_35px_rgba(33,57,114,0.55)] custom-group-hover:bg-[#244db6]">
                            <i className={`fas fa-${link.icon} text-xl`}></i>
                          </div>
                          <div>
                            <h3 className="mt-2 text-base font-semibold leading-none text-[#213972] transition-colors duration-300 custom-group-hover:text-[#244db6]">
                              {t(link.label, link.labelRu)}
                            </h3>
                            <p className="text-gray-400 hidden lg:block transition-all duration-300 text-sm font-semibold custom-group-hover:text-gray-500">
                              {t("Davom etish", "Продолжить")}
                            </p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 text-[#213972]/10 transition-all duration-500 ease-out origin-bottom-right group-hover:rotate-45 group-hover:text-[#244db6]/60">
                          <i
                            className={`fas fa-${link.icon} text-7xl lg:text-8xl opacity-50`}
                          ></i>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top accent line */}
            <div className="w-24 h-1 bg-gradient-to-r from-[#244db6] via-[#3a6fe0] to-transparent rounded-full mb-6 hero-accent-line"></div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
              {/* LEFT — Hero Text + Carousel */}
              <div className="lg:col-span-3 text-white flex flex-col justify-center anim-fade-up anim-delay-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 hero-title-gradient">
                  {t("Jondor tumani", "Джондорский район")}
                </h1>

                {/* Carousel */}
                <div className="shine-wrapper block rounded-2xl lg:rounded-3xl relative overflow-hidden w-full aspect-[16/9] sm:aspect-[12/5.5] bg-gradient-to-br from-blue-700 to-indigo-800 shadow-2xl shadow-blue-900/40 ring-1 ring-white/10">
                  <div className="relative w-full h-full">
                    {carouselList && carouselList.length > 0 ? (
                      carouselList.map((slide, index) => (
                        <div
                          key={slide.id || index}
                          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                            index === activeSlide
                              ? "opacity-100 scale-100 z-10"
                              : "opacity-0 scale-105 z-0"
                          }`}
                        >
                          {slide.image ? (
                            <img
                              src={slide.image}
                              className="absolute inset-0 w-full h-full object-cover"
                              alt={slide.title || "Slide image"}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.style.backgroundColor =
                                  "#1e3a8a";
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center">
                              <div className="text-center text-white/50">
                                <i className="fas fa-image text-6xl mb-4"></i>
                                <p>{slide.title || "Rasm mavjud emas"}</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white z-10">
                            <h4 className="text-lg md:text-2xl font-bold tracking-wide drop-shadow-lg">
                              {slide.title}
                            </h4>
                            {slide.description && (
                              <p className="mt-1 text-sm sm:text-base opacity-90 line-clamp-2">
                                {slide.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center">
                        <div className="text-center text-white">
                          <i className="fas fa-image text-6xl mb-4 opacity-50"></i>
                          <p className="text-lg">
                            {t("Jondor tumani", "Джондорский район")}
                          </p>
                          <p className="text-sm opacity-70">
                            {t(
                              "Rasmlar mavjud emas",
                              "Изображения отсутствуют",
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Dots */}
                    {carouselList && carouselList.length > 1 && (
                      <div className="carousel-dots absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
                        {carouselList.map((_, index) => (
                          <button
                            key={index}
                            className={`transition-all duration-300 rounded-full ${
                              index === activeSlide
                                ? "bg-white w-8 h-2"
                                : "bg-white/50 w-2 h-2 hover:bg-white/80"
                            }`}
                            onClick={() => setActiveSlide(index)}
                            aria-label={`Slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Progress bar */}
                    {carouselList && carouselList.length > 1 && (
                      <div className="carousel-progress-bar absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                        <div
                          className="carousel-progress-fill h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-500"
                          style={{
                            width: `${((activeSlide + 1) / carouselList.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    )}

                    <span className="shine-overlay absolute inset-0 pointer-events-none"></span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg lg:text-xl font-medium text-white/90 mb-1 mt-5">
                  {t(
                    "Jondor tumani rasmiy portali",
                    "Официальный портал Джондорского района",
                  )}
                </h3>
                <p className="text-sm sm:text-base text-white/70 mb-5">
                  {t(
                    "Xalqimizning farovon hayoti va tuman taraqqiyoti yo'lida",
                    "Во имя благополучия и развития нашего района",
                  )}
                </p>
              </div>

              {/* RIGHT — Action Buttons */}
              <div className="lg:col-span-2 flex flex-col gap-3 justify-center anim-fade-up anim-delay-3">
                {/* Primary CTA — Xizmatlar */}
                <Link
                  to="/services"
                  className="group relative overflow-hidden flex items-center justify-between rounded-2xl lg:rounded-3xl p-5 lg:p-6 no-underline shadow-xl shadow-amber-900/30 hover:shadow-2xl hover:shadow-amber-900/40 transition-all duration-500 hover:-translate-y-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(184,134,11) 0%, rgb(218,165,32) 35%, rgb(255,215,0) 65%, rgb(184,134,11) 100%)",
                  }}
                >
                  <span className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 bg-white blur-xl group-hover:scale-150 transition-transform duration-700"></span>
                  <span className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10 bg-white"></span>
                 
                  <div className="relative z-10 flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 mb-1">
                      {t("Davlat xizmatlari", "Гос. услуги")}
                    </span>
                    <span className="text-2xl lg:text-3xl font-bold text-white tracking-wide">
                      {t("Xizmatlar", "Услуги")}
                    </span>
                  </div>
                  <span className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 transition-all duration-500 group-hover:bg-white group-hover:scale-110">
                    <i className="fas fa-arrow-right text-white text-lg transition-colors duration-500 group-hover:text-amber-600"></i>
                  </span>
                </Link>

                {/* Category list */}
                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      to: "/news",
                      label: t("Yangiliklar", "Новости"),
                      icon: "fa-newspaper",
                    },
                    {
                      to: "/dashboard",
                      label: t("Dashboard", "Статистика"),
                      icon: "fa-chart-line",
                    },
                    {
                      to: "/murojatlar",
                      label: t("Murojaat", "Murojaat"),
                      icon: "fa-phone",
                    },
                  ].map((item) => (
                    <Link to={item.to} key={item.to}>
                      <div className="group flex items-center gap-3 w-full text-left text-lg lg:text-xl font-semibold text-white bg-gradient-to-r from-[#2347b2] to-[#1a3680] hover:from-[#2d5ad9] hover:to-[#2347b2] rounded-2xl px-4 py-3.5 shadow-md hover:shadow-xl shadow-blue-950/30 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ring-1 ring-white/5">
                        <span className="text-white bg-white/15 rounded-xl w-10 h-10 flex items-center justify-center text-base transition-all duration-300 group-hover:bg-white/25 group-hover:rotate-6">
                          <i className={`fas ${item.icon}`}></i>
                        </span>
                        <span className="flex-1 transition-transform duration-300 group-hover:translate-x-1">
                          {item.label}
                        </span>
                        <i className="fas fa-arrow-right text-white/70 text-base transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"></i>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Online Registration */}
                <Link
                  to="/contact"
                  className="group relative overflow-hidden flex items-center justify-between text-black bg-white rounded-2xl lg:rounded-3xl p-5 lg:p-6 no-underline shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-0.5"
                >
                  <div className="circles">
                    <span className="circle circle-1"></span>
                    <span className="circle circle-2"></span>
                    <span className="circle circle-3"></span>
                  </div>
                  <div className="relative z-10 flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2347b2]/70 mb-1">
                      {t("24/7 ochiq", "24/7 открыто")}
                    </span>
                    <h5 className="font-bold text-lg md:text-2xl text-[#1a3680]">
                      {t("Onlayn murojaat", "Онлайн обращение")}
                    </h5>
                  </div>
                  <span className="relative z-10 rounded-full border-2 border-[#2347b2] p-3 icon-svg transition-all duration-500 group-hover:border-[#2347b2] group-hover:bg-[#2347b2] group-hover:scale-110 group-hover:rotate-12">
                    <i className="fas fa-arrow-right text-[#2347b2] text-lg transition-colors duration-500 group-hover:text-white"></i>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links - Yangilangan Karusel */}
      {/* <div className="relative z-20 px-4 mx-auto -mt-12 max-w-7xl overflow-hidden">
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex gap-4 lg:gap-6 animate-scroll hover:animate-scroll-pause"
              style={{ width: 'max-content' }}
            >
              {[...quickLinks, ...quickLinks].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="group relative min-w-[160px] max-w-[200px] h-[60px] md:h-[75px] lg:min-w-[200px] lg:max-w-[260px] lg:h-[85px] bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 overflow-hidden no-underline transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex items-center justify-between flex-shrink-0 border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110 group-hover:from-blue-700 group-hover:to-indigo-700">
                      <i className={`fas fa-${link.icon} text-lg lg:text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-sm font-bold leading-tight text-gray-800 transition-colors duration-300 group-hover:text-blue-600 line-clamp-2 max-w-[100px] lg:max-w-[140px]">
                        {t(link.label, link.labelRu)}
                      </h3>
                      <p className="text-gray-400 hidden lg:block text-xs font-medium group-hover:text-blue-500 mt-1">
                        {t("Batafsil", "Подробнее")} →
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 text-blue-100 transition-all duration-500 origin-bottom-right group-hover:rotate-12 group-hover:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lg:w-[80] lg:h-[80] w-[50] h-[50] opacity-50">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="absolute left-0 top-0 bottom-0 w-12 lg:w-20 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 lg:w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div> */}

      {/* Scroll uchun tugmalar (iste'molchi xohishiga qarab) */}
      {/* <div className="flex justify-center gap-2 mt-2">
        <button 
          onClick={() => {
            const container = document.getElementById('quickLinksScroll');
            container.scrollBy({ left: -300, behavior: 'smooth' });
          }}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300"
        >
          <i className="fas fa-chevron-left text-gray-600 text-sm"></i>
        </button>
        <button 
          onClick={() => {
            const container = document.getElementById('quickLinksScroll');
            container.scrollBy({ left: 300, behavior: 'smooth' });
          }}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300"
        >
          <i className="fas fa-chevron-right text-gray-600 text-sm"></i>
        </button>
      </div> */}

      {/* Features Section */}
      <div className="relative z-10 py-16 bg-white/80 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-blue-600 md:text-4xl">
              {t("Nima uchun biz?", "Почему мы?")}
            </h2>
            <div className="w-20 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 text-center transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-2 group"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-600 group-hover:scale-110">
                  <i
                    className={`${feature.icon} text-2xl text-blue-600 group-hover:text-white transition-all duration-300`}
                  ></i>
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 py-26">
        <VirtualTour360 />
      </div>

      {/* Statistics Section */}
      <div ref={statsRef} className="relative z-10 pb-20 bg-white">
        <Statistics />
      </div>

      {/* Leadership Section - Rahbariyat Karusel */}
      {leadersList.length > 0 && (
        <div className="relative py-20 overflow-hidden">
          {/* Animated Pattern Background */}
          <div className="absolute inset-0 bg-blue-900 ">
            {/* Animated Gradient Orbs */}
            {/* <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse-slow opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse-slow animation-delay-2000 opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-3xl animate-pulse-slow animation-delay-1000 opacity-20"></div>
             */}
            {/* Geometric Pattern Overlay */}
            {/* <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '40px'
            }}></div> */}

            {/* Dot Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }}
            ></div>
          </div>

          {/* Orbs */}
          {/* <span className="hero-orb hero-orb-1"></span>
          <span className="hero-orb hero-orb-2"></span>
          <span className="hero-orb hero-orb-3"></span>
          <span className="hero-orb hero-orb-4"></span> */}

          <div className=" mx-auto  relative z-10">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <i className="text-blue-400 fas fa-users text-sm"></i>
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  {t("Rahbariyat", "Руководство")}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                {t("Tuman rahbariyati", "Руководство района")}
              </h2>
              <div className="w-24 h-1 mx-auto mt-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>
              <p className="text-blue-100 mt-4 max-w-2xl mx-auto">
                {t(
                  "Tumanimiz taraqqiyoti yo'lida fidokorona mehnat qilayotgan rahbarlar",
                  "Руководители, самоотверженно работающие на пути развития нашего района",
                )}
              </p>
            </div>

            {/* Infinite Auto-Scroll Carousel */}
            <div className="relative overflow-hidden py-6">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 md:w-64 lg:w-80 bg-gradient-to-r from-blue-900 via-blue-900/95 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 md:w-64 lg:w-80 bg-gradient-to-l from-blue-900 via-blue-900/95 to-transparent z-20 pointer-events-none"></div>
              
              {/* Infinite Scroll Container */}
              <div className="overflow-hidden">
                {/* Carousel Track - sekinroq aylanish va hoverda to'xtash */}
                <div
                  className="infinite-scroll-track flex gap-6"
                  style={{
                    animation: `infiniteScroll 60s linear infinite`,
                    width: "max-content",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.animationPlayState = "paused";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.animationPlayState = "running";
                  }}
                >
                  {/* First set */}
                  {leadersList.map((leader, idx) => (
                    <div
                      key={`first-${leader.id}`}
                      className="relative h-[450px] w-[280px] flex-shrink-0 group cursor-pointer"
                      onClick={() => setSelectedTeacher(leader)}
                    >
                      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-blue-500/20 border border-white/20">
                        {leader.image ? (
                          <>
                            <img
                              src={leader.image}
                              alt={leader.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/400x500?text=No+Image";
                              }}
                            />
                            {/* Glossy Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                            <i className="fas fa-user-tie text-7xl text-white/40"></i>
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                          <p className="text-white text-lg font-bold leading-tight line-clamp-2 drop-shadow-md">
                            {leader.name}
                          </p>
                          <p className="text-blue-300 text-sm mt-1 font-medium line-clamp-2">
                            {leader.position}
                          </p>
                          {/* Animated underline */}
                          <div className="absolute bottom-4 left-5 h-[2px] w-16 origin-left scale-x-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
                        </div>

                        {/* Hover Effect Glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {leadersList.map((leader, idx) => (
                    <div
                      key={`second-${leader.id}`}
                      className="relative h-[450px] w-[280px] flex-shrink-0 group cursor-pointer"
                      onClick={() => setSelectedTeacher(leader)}
                    >
                      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-blue-500/20 border border-white/20">
                        {leader.image ? (
                          <>
                            <img
                              src={leader.image}
                              alt={leader.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/400x500?text=No+Image";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                            <i className="fas fa-user-tie text-7xl text-white/40"></i>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                          <p className="text-white text-lg font-bold leading-tight line-clamp-2 drop-shadow-md">
                            {leader.name}
                          </p>
                          <p className="text-blue-300 text-sm mt-1 font-medium line-clamp-2">
                            {leader.position}
                          </p>
                          <div className="absolute bottom-4 left-5 h-[2px] w-16 origin-left scale-x-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
                        </div>

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
              <button
                onClick={() => navigate("/about")}
                className="group relative overflow-hidden inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/20 transition-all duration-300"
              >
                <span className="relative z-10">
                  {t("Barcha rahbarlar", "Все руководители")}
                </span>
                <i className="fas fa-arrow-right relative z-10 group-hover:translate-x-1 transition-transform duration-300"></i>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Leader Details */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedTeacher(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl animate-modalFadeIn border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedTeacher(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Section */}
              <div className="relative h-80 md:h-full overflow-hidden bg-gradient-to-br from-blue-800 to-indigo-900">
                {selectedTeacher.image ? (
                  <img
                    src={selectedTeacher.image}
                    alt={selectedTeacher.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/500x600?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="fas fa-user-tie text-8xl text-white/30"></i>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Info Section */}
              <div className="p-6 md:p-8">
                <div className="mb-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-3"></div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {selectedTeacher.name}
                  </h3>
                  <p className="text-blue-400 font-medium text-lg mt-1">
                    {selectedTeacher.position}
                  </p>
                </div>

                {/* Description / Bio */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    <i className="fas fa-user-circle mr-2 text-blue-400"></i>
                    {t("Biografiya", "Биография")}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedTeacher.description ||
                      t("Ma'lumot mavjud emas", "Информация отсутствует")}
                  </p>
                </div>

                {/* Contact if available */}
                {selectedTeacher.email && (
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <a
                      href={`mailto:${selectedTeacher.email}`}
                      className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <i className="fas fa-envelope"></i>
                      <span>{selectedTeacher.email}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Teacher Details */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedTeacher(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-2xl animate-modalFadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedTeacher(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Section */}
              <div className="relative h-80 md:h-full overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900">
                {selectedTeacher.image ? (
                  <img
                    src={selectedTeacher.image}
                    alt={selectedTeacher.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/500x600?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="fas fa-user-tie text-8xl text-white/30"></i>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>

              {/* Info Section */}
              <div className="p-6 md:p-8">
                <div className="mb-4">
                  <div className="w-12 h-1 bg-blue-600 rounded-full mb-3"></div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {selectedTeacher.name}
                  </h3>
                  <p className="text-blue-600 font-medium text-lg mt-1">
                    {selectedTeacher.position}
                  </p>
                </div>

                {/* Description / Bio */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <i className="fas fa-user-circle mr-2 text-blue-500"></i>
                    {t("Biografiya", "Биография")}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedTeacher.description ||
                      t("Ma'lumot mavjud emas", "Информация отсутствует")}
                  </p>
                </div>

                {/* Contact if available */}
                {selectedTeacher.email && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <a
                      href={`mailto:${selectedTeacher.email}`}
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <i className="fas fa-envelope"></i>
                      <span>{selectedTeacher.email}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Section */}
      {galleryList.length > 0 && (
        <div className="relative z-10 py-16 bg-gradient-to-br from-gray-50/50 to-white/50 backdrop-blur-sm">
          <div className="px-4 mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-blue-600 md:text-4xl">
                {t("Galereya", "Галерея")}
              </h2>
              <div className="w-20 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
            </div>
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              speed={800}
              pagination={{ clickable: true }}
              navigation
              loop={true}
              className="pb-12"
            >
              {galleryList.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="relative overflow-hidden shadow-lg rounded-2xl group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={item.image}
                        className="object-cover w-full h-full transition duration-500 group-hover:scale-110"
                        alt={item.title}
                      />
                      <div className="absolute inset-0 transition duration-300 opacity-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:opacity-100" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transition duration-300 transform translate-y-full group-hover:translate-y-0">
                        <p className="text-sm font-medium">{item.title}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Reception Hours - Light Premium Version */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Animated Background Elements */}
        {/* <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>

          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(59,130,246,0.1) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          ></div>

          <div className="absolute top-0 left-0 right-0">
            <svg
              className="w-full h-20 text-blue-50"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div> */}

        <div className="relative z-10 px-4 mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-white shadow-md rounded-full border border-blue-100">
              <i className="text-blue-500 fas fa-calendar-alt text-sm"></i>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {t("Ish vaqti", "Время работы")}
              </span>
            </div>
            <h2 className="mb-3 text-3xl font-bold text-gray-800 md:text-4xl">
              {t("Qabul jadvali", "График приема")}
            </h2>
            <div className="w-24 h-1 mx-auto mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              {t(
                "Sizni qabul qilishdan mamnunmiz. Quyidagi jadval asosida murojaat qilishingiz mumkin.",
                "Мы рады приветствовать вас. Вы можете обратиться по следующему графику.",
              )}
            </p>
          </div>

          <div className="grid max-w-5xl gap-6 mx-auto md:grid-cols-2">
            {/* Hokim qabuli Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Top Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>

              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
                      <i className="text-2xl text-white fas fa-user-tie"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("Tuman hokimi qabuli", "Прием хокима района")}
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-transparent rounded-full mt-1"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <i className="text-blue-500 fas fa-calendar-alt text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        {t("Kunlar", "Дни")}
                      </p>
                      <p className="font-medium">
                        {t(
                          receptionHours.governor.days,
                          receptionHours.governor.daysRu,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <i className="text-blue-500 fas fa-clock text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        {t("Vaqt", "Время")}
                      </p>
                      <p className="font-medium">
                        {receptionHours.governor.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <i className="text-blue-500 fas fa-map-marker-alt text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        {t("Manzil", "Адрес")}
                      </p>
                      <p className="font-medium">
                        {t(
                          receptionHours.governor.location,
                          receptionHours.governor.locationRu,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Icon Bottom Right */}
                <div className="absolute bottom-4 right-4 text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <i className="fas fa-calendar-check text-4xl"></i>
                </div>
              </div>
            </motion.div>

            {/* Fuqarolar qabuli Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.21, 0.47, 0.32, 0.98],
                delay: 0.1,
              }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Top Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>

              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg">
                      <i className="text-2xl text-white fas fa-users"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("Fuqarolar qabuli", "Прием граждан")}
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-transparent rounded-full mt-1"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                      <i className="text-emerald-500 fas fa-calendar-alt text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        {t("Kun", "День")}
                      </p>
                      <p className="font-medium">
                        {t(
                          receptionHours.citizens.days,
                          receptionHours.citizens.daysRu,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                      <i className="text-emerald-500 fas fa-clock text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        {t("Vaqt", "Время")}
                      </p>
                      <p className="font-medium">
                        {receptionHours.citizens.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                      <i className="text-emerald-500 fas fa-phone-alt text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        {t("Telefon", "Телефон")}
                      </p>
                      <p className="font-medium">
                        {receptionHours.citizens.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Icon Bottom Right */}
                <div className="absolute bottom-4 right-4 text-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <i className="fas fa-clock text-4xl"></i>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white shadow-md rounded-full border border-blue-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="text-blue-500 fas fa-info-circle text-sm"></i>
              </div>
              <span className="text-gray-600 text-sm">
                {t(
                  "Qo'shimcha ma'lumot uchun:",
                  "Для дополнительной информации:",
                )}
              </span>
              <a
                href="tel:+998653800000"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors hover:underline"
              >
                +998 65 380-00-00
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 text-blue-50/50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="relative z-10 py-16 bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-blue-50 rounded-full">
              <i className="text-blue-500 fas fa-newspaper text-sm"></i>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {t("Eng so'nggi yangiliklar", "Последние новости")}
              </span>
            </div>
            <h2 className="mb-3 text-3xl font-bold text-gray-800 md:text-4xl">
              {t("So'nggi yangiliklar", "Последние новости")}
            </h2>
            <div className="w-24 h-1 mx-auto mt-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              {t(
                "Jondor tumanidagi so'nggi yangiliklar va e'lonlardan xabardor bo'ling",
                "Будьте в курсе последних новостей и объявлений Джондорского района",
              )}
            </p>
          </div>

          {/* News Grid */}
          {latestNews.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/news/${news.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="overflow-hidden bg-white shadow-lg rounded-2xl transition-all duration-300 hover:shadow-2xl">
                    {/* Image Section */}
                    <div className="relative overflow-hidden h-56">
                      {news.image ? (
                        <>
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <i className="text-6xl text-white/50 fas fa-newspaper"></i>
                        </div>
                      )}

                      {/* Category Badge */}
                      {news.category && (
                        <div className="absolute top-4 left-4">
                          <span
                            className={`${getCategoryColor(news.category)} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm`}
                          >
                            {getCategoryLabel(news.category)}
                          </span>
                        </div>
                      )}

                      {/* Date Badge */}
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <div className="flex items-center gap-2 text-white text-xs">
                          <i className="fas fa-calendar-alt text-blue-300"></i>
                          <span>{formatDate(news.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {news.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                        {news.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <i className="fas fa-eye"></i>
                          <span>
                            {news.views || 0} {t("ko'rish", "просмотров")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-500 text-sm font-medium group-hover:gap-2 transition-all duration-300">
                          <span>{t("Batafsil", "Подробнее")}</span>
                          <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="text-6xl text-gray-300 far fa-newspaper mb-4"></i>
              <p className="text-gray-400">
                {t("Hozircha yangiliklar yo'q", "Новостей пока нет")}
              </p>
            </div>
          )}

          {/* View All Button */}
          {latestNews.length > 0 && (
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/news")}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span>{t("Barcha yangiliklar", "Все новости")}</span>
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0px 0px 0px rgba(59,130,246,0)",
            "0px 0px 20px rgba(59,130,246,0.5)",
            "0px 0px 0px rgba(59,130,246,0)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed z-50 flex items-center justify-center text-white transition-all duration-300 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl hover:scale-110"
      >
        {isChatOpen ? (
          <i className="text-xl fas fa-times"></i>
        ) : (
          <div className="relative">
            <i className="text-2xl fas fa-robot"></i>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute w-3 h-3 bg-green-400 rounded-full -top-1 -right-1"
            ></motion.span>
          </div>
        )}
      </motion.button>

      {/* AI Chat Window */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-14 right-6 z-50 w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Header with Gradient Animation */}
          <div className="relative p-4 overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <motion.div
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm"
                >
                  <i className="text-xl fas fa-robot"></i>
                </motion.div>
                <div>
                  <h3 className="font-bold text-white">Jondor AI Yordamchi</h3>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <span className="flex items-center gap-1">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                      Online
                    </span>
                    <span>•</span>
                    <motion.span
                      animate={{ scale: isSpeaking ? [1, 1.2, 1] : 1 }}
                      transition={{
                        duration: 0.5,
                        repeat: isSpeaking ? Infinity : 0,
                      }}
                      className="flex items-center gap-1"
                    >
                      <i className="text-xs fas fa-volume-up"></i>
                      {isSpeaking ? "Gapiryapti..." : "Ovozli javob"}
                    </motion.span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="flex gap-1 p-0.5 rounded-lg bg-white/20 backdrop-blur-sm">
                  {["uz", "ru", "en"].map((lang) => (
                    <motion.button
                      key={lang}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAiLang(lang)}
                      className={`px-2 py-1 text-xs rounded-md transition-all duration-200 ${
                        aiLang === lang
                          ? "bg-white text-blue-600 shadow-md"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsChatOpen(false)}
                  className="flex items-center justify-center w-8 h-8 transition rounded-full bg-white/20 hover:bg-white/30"
                >
                  <i className="fas fa-times text-white text-sm"></i>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Messages Area with Custom Scrollbar */}
          <div className="h-[400px] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-3">
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.isUser ? 20 : -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    delay: idx * 0.05,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-end gap-2 max-w-[85%] ${msg.isUser ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                        msg.isUser
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : "bg-gradient-to-r from-purple-500 to-pink-500"
                      }`}
                    >
                      <i
                        className={`text-xs text-white ${msg.isUser ? "fas fa-user" : "fas fa-robot"}`}
                      ></i>
                    </motion.div>

                    {/* Message Bubble */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`relative p-3 rounded-2xl shadow-md ${
                        msg.isUser
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md"
                          : "bg-white text-gray-700 rounded-bl-md border border-gray-100"
                      }`}
                    >
                      {/* Animated shine effect for AI messages */}
                      {!msg.isUser && (
                        <motion.div
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: idx * 0.5,
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                        />
                      )}
                      <p className="text-sm whitespace-pre-line leading-relaxed">
                        {msg.text}
                      </p>
                      <span
                        className={`block mt-1 text-[10px] ${msg.isUser ? "text-blue-100" : "text-gray-400"}`}
                      >
                        <i className="far fa-clock mr-1"></i> {msg.time}
                      </span>
                      {/* Message Tail */}
                      <div
                        className={`absolute bottom-0 w-2.5 h-2.5 transform rotate-45 ${
                          msg.isUser
                            ? "-right-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                            : "-left-1 bg-white border-l border-t border-gray-100"
                        }`}
                      ></div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <i className="fas fa-robot text-white text-xs"></i>
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-md">
                      <div className="flex gap-1.5">
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Quick Buttons with Animations */}
          <div className="px-4 py-3 bg-white border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {[
                {
                  icon: "fas fa-hand-peace",
                  text: "Salom",
                  query: "Salom",
                  color: "from-blue-400 to-blue-500",
                },
                {
                  icon: "fas fa-map-marker-alt",
                  text: "Tuman",
                  query: "Tuman haqida",
                  color: "from-red-400 to-red-500",
                },
                {
                  icon: "fas fa-user-tie",
                  text: "Hokim",
                  query: "Hokim",
                  color: "from-indigo-400 to-indigo-600",
                },
                {
                  icon: "fas fa-chart-line",
                  text: "Statistika",
                  query: "Statistika",
                  color: "from-green-400 to-green-600",
                },
                {
                  icon: "fas fa-university",
                  text: "SOLG",
                  query: "SOLG bank haqida",
                  color: "from-yellow-500 to-orange-600",
                },
                {
                  icon: "fas fa-phone-alt",
                  text: "Aloqa",
                  query: "Aloqa",
                  color: "from-teal-400 to-teal-600",
                },
                {
                  icon: "fas fa-question-circle",
                  text: "Yordam",
                  query: "Yordam",
                  color: "from-purple-500 to-pink-600",
                },
              ].map((btn, idx) => (
                <motion.button
                  key={btn.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChatInput(btn.query)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r ${btn.color} text-white shadow-md transition-all duration-200`}
                >
                  <i className={`${btn.icon} mr-1 text-[10px]`}></i>
                  <span>{btn.text}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input Area with Animations */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceInput}
                className="px-4 py-2.5 text-gray-600 transition-all bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:shadow-md group"
                title="Ovozli so'roq"
              >
                <motion.i
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="fas fa-microphone"
                />
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className="flex-1 relative"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="💬 Savolingizni yozing..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-gray-50"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  animate={{ width: chatInput ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="px-5 py-2.5 text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg"
              >
                <motion.i
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                  className="fas fa-paper-plane"
                />
              </motion.button>
            </div>

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-2 mt-3"
            >
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <i className="fas fa-lightbulb text-yellow-400"></i>
                <span>Masalan:</span>
              </span>
              {["SOLG bank", "Statistika", "Hokim kim"].map((s, idx) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setChatInput(s)}
                  className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
