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
        ru: "Здравствуйте! 👋 Я умный помощник Ромитанского района. Могу предоставить любую информацию о нашем районе. Какой у вас вопрос?",
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

    const beautifyText = (text) => {
      let result = text;
      result = result.replace(/\?/g, "? 🤔");
      result = result.replace(/\!/g, "! 😊");
      result = result.replace(/\. /g, ". ✨ ");
      return result;
    };

    const responses = {
      salom: {
        uz: "Assalomu alaykum! 👋 Men Romitan tumanining aqlli AI yordamchisiman. Sizga quyidagilar haqida to'liq ma'lumot bera olaman:\n\n📍 Tuman haqida umumiy\n🏛️ Rahbariyat va hokim\n📊 Statistika (aholi, maktablar, korxonalar)\n📞 Telefon va aloqa\n✉️ Email va manzil\n🏫 Ta'lim va sog'liq\n💰 Iqtisodiyot va fermerlik\n🏦 ROMITAN BANK (kreditlar, kartalar)\n📰 Yangiliklar va galereya\n\nSavolingizni yozing! 😊",
        ru: "Здравствуйте! 👋 Я умный AI помощник Ромитанского района. Могу предоставить полную информацию о:\n\n📍 Общая информация о районе\n🏛️ Руководство и хоким\n📊 Статистика (население, школы, предприятия)\n📞 Телефоны и контакты\n✉️ Email и адрес\n🏫 Образование и здравоохранение\n💰 Экономика и фермерство\n🏦 ROMITAN БАНК (кредиты, карты)\n📰 Новости и галерея\n\nНапишите ваш вопрос! 😊",
        en: "Hello! 👋 I am the smart AI assistant of Romitan district. I can provide complete information about:\n\n📍 General district info\n🏛️ Leadership and khokim\n📊 Statistics (population, schools, enterprises)\n📞 Phone and contacts\n✉️ Email and address\n🏫 Education and healthcare\n💰 Economy and farming\n🏦 ROMITAN BANK (loans, cards)\n📰 News and gallery\n\nWrite your question! 😊",
      },
      tuman_batafsil: {
        uz: `📍 ROMITAN TUMANI HAQIDA TO'LIQ MA'LUMOT

📅 TASHKIL TOPGAN SANASI: 1926-yil
📏 MAYDONI: 890 km²
👥 AHOLISI: 180,000 dan ortiq kishi
🏘️ MFY: 13 ta
🏡 QISHL OQLAR: 38 ta

📜 TARIXIY MA'LUMOT:
Romitan tumani qadimiy tarixga ega. Romitan shahri buyuk allomalar vatani hisoblanadi.

🗺️ GEOGRAFIK JOYLASHUVI:
Buxoro viloyatining markaziy qismida joylashgan. Shimoldan Shofirkon tumani, janubdan Buxoro tumani, sharqdan Vobkent tumani, g'arbdan Qorako'l tumani bilan chegaradosh.

🌡️ IQLIMI:
Kontinental - yozi issiq (40-45°C), qishi sovuq (-5°C dan -15°C gacha). Yillik yog'in miqdori 150-200 mm.

💧 SUV RESURSLARI:
Zarafshon daryosi, Romitan kanali va sug'orish tarmoqlari`,
        ru: `📍 ПОЛНАЯ ИНФОРМАЦИЯ О РОМИТАНСКОМ РАЙОНЕ

📅 ДАТА ОСНОВАНИЯ: 1926 год
📏 ПЛОЩАДЬ: 890 км²
👥 НАСЕЛЕНИЕ: более 180 000 человек
🏘️ МФЙ: 13
🏡 СЕЛА: 38

📜 ИСТОРИЧЕСКАЯ ИНФОРМАЦИЯ:
Ромитанский район имеет богатую историю. Город Ромитан является родиной великих учёных.

🗺️ ГЕОГРАФИЧЕСКОЕ РАСПОЛОЖЕНИЕ:
Расположен в центральной части Бухарской области.

🌡️ КЛИМАТ:
Континентальный - лето жаркое (40-45°C), зима холодная (-5°C до -15°C).

💧 ВОДНЫЕ РЕСУРСЫ:
Река Зарафшан, канал Ромитан`,
        en: `📍 COMPLETE INFORMATION ABOUT ROMITAN DISTRICT

📅 FOUNDED: 1926
📏 AREA: 890 km²
👥 POPULATION: over 180,000 people
🏘️ MFY: 13
🏡 VILLAGES: 38

📜 HISTORICAL INFORMATION:
Romitan district has a rich history. Romitan city is the homeland of great scholars.

🗺️ GEOGRAPHICAL LOCATION:
Located in the central part of Bukhara region.

🌡️ CLIMATE:
Continental - hot summers (40-45°C), cold winters (-5°C to -15°C).

💧 WATER RESOURCES:
Zarafshan River, Romitan canal`,
      },
      hokim_batafsil: {
        uz: `🏛️ ROMITAN TUMANI RAHBARIYATI

👨‍💼 TUMAN HOKIMI: ___________________

📞 TELEFON RAQAMLARI:
• Hokim qabuli: +998 65 481-00-01
• Ishonch telefoni: +998 65 481-18-53
• Qabulxona: +998 65 481-00-00

✉️ EMAIL MANZILLARI:
• Rasmiy email: romitan@exat.uz
• Umumiy bo'lim: info@romitan.uz

🏢 MANZIL:
Buxoro viloyati, Romitan tumani, Mustaqillik ko'chasi, 1-uy

📅 QABUL VAQTLARI:
• Hokim qabuli: Dushanba - Juma, 15:00 - 17:00
• Fuqarolar qabuli: Har payshanba, 10:00 - 13:00
• Ish vaqti: Dushanba - Juma, 09:00 - 18:00
• Tushlik: 13:00 - 14:00

👥 HOKIM O'RINBOSARLARI:
1. ___________________
2. ___________________
3. ___________________
4. ___________________
5. ___________________

📱 IJTIMOIY TARMOQLAR:
• Telegram: t.me/romitan_hokimlik
• Facebook: facebook.com/romitan.tumani`,
        ru: `🏛️ РУКОВОДСТВО РОМИТАНСКОГО РАЙОНА

👨‍💼 ХОКИМ РАЙОНА: ___________________

📞 ТЕЛЕФОНЫ:
• Прием хокима: +998 65 481-00-01
• Телефон доверия: +998 65 481-18-53
• Приемная: +998 65 481-00-00

✉️ EMAIL:
• Официальный: romitan@exat.uz
• Общий отдел: info@romitan.uz

🏢 АДРЕС:
Бухарская область, Ромитанский район, ул. Мустакиллик, 1

📅 ВРЕМЯ ПРИЕМА:
• Прием хокима: Пн-Пт, 15:00-17:00
• Прием граждан: Каждый четверг, 10:00-13:00
• Рабочее время: Пн-Пт, 09:00-18:00
• Обед: 13:00-14:00

👥 ЗАМЕСТИТЕЛИ ХОКИМА:
1. ___________________
2. ___________________
3. ___________________
4. ___________________
5. ___________________

📱 СОЦИАЛЬНЫЕ СЕТИ:
• Telegram: t.me/romitan_hokimlik
• Facebook: facebook.com/romitan.tumani`,
        en: `🏛️ LEADERSHIP OF ROMITAN DISTRICT

👨‍💼 KHOKIM: ___________________

📞 PHONE NUMBERS:
• Khokim reception: +998 65 481-00-01
• Hotline: +998 65 481-18-53
• Reception: +998 65 481-00-00

✉️ EMAIL ADDRESSES:
• Official: romitan@exat.uz
• General: info@romitan.uz

🏢 ADDRESS:
Bukhara region, Romitan district, Mustaqillik str., 1

📅 RECEPTION HOURS:
• Khokim reception: Mon-Fri, 15:00-17:00
• Citizens reception: Every Thursday, 10:00-13:00
• Working hours: Mon-Fri, 09:00-18:00
• Lunch: 13:00-14:00

👥 DEPUTY KHOKIMS:
1. ___________________
2. ___________________
3. ___________________
4. ___________________
5. ___________________

📱 SOCIAL NETWORKS:
• Telegram: t.me/romitan_hokimlik
• Facebook: facebook.com/romitan.tumani`,
      },
      statistika_batafsil: {
        uz: `📊 ROMITAN TUMANI TO'LIQ STATISTIKASI (2024)

👥 AHOLI:
• Jami aholi: 180,000+ kishi
• Shahar aholisi: 50,000 kishi (27.8%)
• Qishloq aholisi: 130,000 kishi (72.2%)
• Erkaklar: 90,500 kishi (50.3%)
• Ayollar: 89,500 kishi (49.7%)
• Aholi zichligi: 1 km² ga 202 kishi
• O'rtacha yosh: 27.5 yil

🏫 TA'LIM:
• Umumta'lim maktablari: 42 ta
• Litsey va kollejlar: 4 ta
• Maktabgacha ta'lim: 28 ta bog'cha
• O'quvchilar: 25,000+ nafar
• O'qituvchilar: 1,600+ nafar

🏥 SOG'LIQNI SAQLASH:
• Kasalxonalar: 6 ta (450+ o'rin)
• Poliklinikalar: 10 ta
• Qishloq vrachlik punktlari: 22 ta
• Tez yordam stansiyalari: 2 ta
• Shifokorlar: 280+ nafar
• O'rta tibbiy xodimlar: 520+ nafar

🏪 IQTISODIYOT:
• Korxonalar: 1,800+ ta
• Kichik biznes: 1,600+ ta
• O'rta biznes: 100+ ta
• Yirik korxonalar: 25 ta
• Xususiy tadbirkorlik: 2,200+ ta
• Investitsiyalar hajmi: 70+ mlrd so'm

🌾 QISHLOQ XO'JALIGI:
• Fermer xo'jaliklari: 120 ta
• Qishloq xo'jaligi korxonalari: 45 ta
• Ekin maydoni: 30,000+ gektar
• Sug'oriladigan yerlar: 28,000+ gektar

🏘️ MA'MURIY HUDUDLAR:
• MFY: 13 ta
• Qishloqlar: 38 ta
• Shaharchalar: 2 ta (Romitan, G'ijduvon)`,
        ru: `📊 ПОЛНАЯ СТАТИСТИКА РОМИТАНСКОГО РАЙОНА (2024)

👥 НАСЕЛЕНИЕ:
• Всего: 180 000+ человек
• Городское: 50 000 (27.8%)
• Сельское: 130 000 (72.2%)
• Мужчины: 90 500 (50.3%)
• Женщины: 89 500 (49.7%)
• Плотность: 202 чел/км²
• Средний возраст: 27.5 лет

🏫 ОБРАЗОВАНИЕ:
• Школы: 42
• Лицеи и колледжи: 4
• Детские сады: 28
• Ученики: 25 000+
• Учителя: 1 600+

🏥 ЗДРАВООХРАНЕНИЕ:
• Больницы: 6 (450+ коек)
• Поликлиники: 10
• Сельские врачебные пункты: 22
• Врачи: 280+
• Медсестры: 520+

🏪 ЭКОНОМИКА:
• Предприятия: 1 800+
• Малый бизнес: 1 600+
• Крупные предприятия: 25
• Инвестиции: 70+ млрд сумов

🌾 СЕЛЬСКОЕ ХОЗЯЙСТВО:
• Фермерские хозяйства: 120
• Посевная площадь: 30 000+ га
• Орошаемые земли: 28 000+ га

🏘️ АДМИНИСТРАТИВНЫЕ ЕДИНИЦЫ:
• МФЙ: 13
• Сёла: 38
• Города: 2 (Ромитан, Гиждуван)`,
        en: `📊 COMPLETE STATISTICS OF ROMITAN DISTRICT (2024)

👥 POPULATION:
• Total: 180,000+
• Urban: 50,000 (27.8%)
• Rural: 130,000 (72.2%)
• Men: 90,500 (50.3%)
• Women: 89,500 (49.7%)
• Density: 202 people/km²
• Average age: 27.5 years

🏫 EDUCATION:
• Schools: 42
• Lyceums and colleges: 4
• Kindergartens: 28
• Students: 25,000+
• Teachers: 1,600+

🏥 HEALTHCARE:
• Hospitals: 6 (450+ beds)
• Polyclinics: 10
• Rural medical stations: 22
• Doctors: 280+
• Nurses: 520+

🏪 ECONOMY:
• Enterprises: 1,800+
• Small business: 1,600+
• Large enterprises: 25
• Investments: 70+ billion sums

🌾 AGRICULTURE:
• Farms: 120
• Sown area: 30,000+ hectares
• Irrigated land: 28,000+ hectares

🏘️ ADMINISTRATIVE AREAS:
• MFY: 13
• Villages: 38
• Towns: 2 (Romitan, Gijduvan)`,
      },
      bank_info: {
        uz: `🏦 ROMITAN BANK FILIALI HAQIDA MA'LUMOT

📞 ALOQA MA'LUMOTLARI:
• Asosiy telefon: +998 65 481-01-00
• Qo'llab-quvvatlash: +998 65 481-01-01
• Call-center: 1245 (24/7)
• Email: romitan@agrobank.uz

🏢 MANZIL VA FILIALLAR:
📍 MARKAZIY FILIAL:
Romitan tumani, Markaziy ko'cha, 10-uy

📍 G'IJDUVON FILIALI:
G'ijduvon shahri, Navoiy ko'chasi, 15-uy

⏰ ISH VAQTI:
• Dushanba - Juma: 09:00 - 18:00
• Shanba: 09:00 - 14:00
• Yakshanba: Dam olish kuni
• Tushlik: 13:00 - 14:00

💳 BANK XIZMATLARI:
• Plastik kartalar: Humo, Uzcard, Visa, MasterCard
• Kreditlar: 16% dan 24% gacha
• Depozitlar: 23% gacha
• Pul o'tkazmalari: Golden Pay, Contact, Western Union`,
        ru: `🏦 ИНФОРМАЦИЯ О ФИЛИАЛЕ БАНКА В РОМИТАНЕ

📞 КОНТАКТЫ:
• Основной: +998 65 481-01-00
• Поддержка: +998 65 481-01-01
• Call-центр: 1245
• Email: romitan@agrobank.uz

🏢 АДРЕС И ФИЛИАЛЫ:
📍 ЦЕНТРАЛЬНЫЙ ФИЛИАЛ:
Ромитанский район, ул. Марказий, 10

📍 ГИЖДУВАНСКИЙ ФИЛИАЛ:
Город Гиждуван, ул. Навои, 15

⏰ РЕЖИМ РАБОТЫ:
• Пн-Пт: 09:00-18:00
• Сб: 09:00-14:00
• Вс: Выходной
• Обед: 13:00-14:00

💳 УСЛУГИ:
• Карты: Humo, Uzcard, Visa, MasterCard
• Кредиты: от 16% до 24%
• Депозиты: до 23%
• Переводы: Golden Pay, Contact, Western Union`,
        en: `🏦 ROMITAN BANK BRANCH INFORMATION

📞 CONTACTS:
• Main: +998 65 481-01-00
• Support: +998 65 481-01-01
• Call-center: 1245
• Email: romitan@agrobank.uz

🏢 ADDRESS AND BRANCHES:
📍 CENTRAL BRANCH:
Romitan district, Markaziy str., 10

📍 GIJDUVAN BRANCH:
Gijduvan city, Navoiy str., 15

⏰ WORKING HOURS:
• Mon-Fri: 09:00-18:00
• Sat: 09:00-14:00
• Sun: Closed
• Lunch: 13:00-14:00

💳 SERVICES:
• Cards: Humo, Uzcard, Visa, MasterCard
• Loans: from 16% to 24%
• Deposits: up to 23%
• Transfers: Golden Pay, Contact, Western Union`,
      },
      yordam_batafsil: {
        uz: `🤖 ROMITAN AI YORDAMCHI - BARCHA MUMKIN BO'LGAN SAVOLLAR

📍 TUMAN HAQIDA: "Tuman haqida", "Tarix", "Geografiya"
🏛️ RAHBARIYAT: "Hokim", "Hokim o'rinbosarlari", "Qabul vaqti"
📊 STATISTIKA: "Statistika", "Aholi", "Maktablar", "Kasalxonalar"
🌾 QISHLOQ XO'JALIGI: "Fermerlar", "Qishloq xo'jaligi"
🏦 BANK: "Bank", "Kredit", "Kartalar"
📞 ALOQA: "Telefon", "Email", "Manzil"

❓ Istalgan savolingizga javob berishga tayyorman!
💡 Masalan: "Statistika", "Hokim", "Bank"`,
        ru: `🤖 ПОМОЩНИК ROMITAN AI - ВСЕ ВОПРОСЫ

📍 О РАЙОНЕ: "О районе", "История", "География"
🏛️ РУКОВОДСТВО: "Хоким", "Заместители", "Время приема"
📊 СТАТИСТИКА: "Статистика", "Население", "Школы", "Больницы"
🌾 СЕЛЬСКОЕ ХОЗЯЙСТВО: "Фермеры", "Сельское хозяйство"
🏦 БАНК: "Банк", "Кредит", "Карты"
📞 КОНТАКТЫ: "Телефон", "Email", "Адрес"

❓ Задайте любой вопрос!`,
        en: `🤖 ROMITAN AI ASSISTANT - ALL POSSIBLE QUESTIONS

📍 DISTRICT: "About district", "History", "Geography"
🏛️ LEADERSHIP: "Khokim", "Deputies", "Reception hours"
📊 STATISTICS: "Statistics", "Population", "Schools", "Hospitals"
🌾 AGRICULTURE: "Farms", "Agriculture"
🏦 BANK: "Bank", "Credit", "Cards"
📞 CONTACTS: "Phone", "Email", "Address"

❓ Ask me anything!`,
      },
    };

    if (msg.match(/(salom|assalom|alom|hello|hi|hay|assalomu alaykum)/i)) {
      return beautifyText(responses.salom[language]);
    }
    if (msg.match(/(tuman haqida|romitan haqida|tuman|qanday tuman)/i)) {
      return beautifyText(responses.tuman_batafsil[language]);
    }
    if (msg.match(/(hokim|rahbar|rahbariyat|tuman rahbari|hokim kim)/i)) {
      return beautifyText(responses.hokim_batafsil[language]);
    }
    if (msg.match(/(statistika|raqamlar|qancha|nechta|ma'lumotlar)/i)) {
      return beautifyText(responses.statistika_batafsil[language]);
    }
    if (msg.match(/(bank|kredit|karta|pul)/i)) {
      return beautifyText(responses.bank_info[language]);
    }
    if (msg.match(/(yordam|help|yardim|qanday ishlatiladi)/i)) {
      return beautifyText(responses.yordam_batafsil[language]);
    }
    if (msg.match(/(aholi|odam|kishi|qancha odam|aholisi)/i)) {
      return beautifyText(`👥 ROMITAN AHOLISI: 180,000+ kishi\n🏙️ Shahar: 50,000 (27.8%)\n🏕️ Qishloq: 130,000 (72.2%)`);
    }
    if (msg.match(/(telefon|tel|aloqa|nomer|qo'ng'iroq)/i)) {
      return beautifyText(`📞 ALOQA RAQAMLARI:\n• Hokim qabuli: +998 65 481-00-01\n• Ishonch telefoni: +998 65 481-18-53\n• Qabulxona: +998 65 481-00-00`);
    }
    if (msg.match(/(email|pochta|mail|elektron pochta)/i)) {
      return beautifyText(`✉️ EMAIL MANZILLARI:\n• Rasmiy: romitan@exat.uz\n• Umumiy: info@romitan.uz`);
    }
    if (msg.match(/(manzil|qayerda|borish|adres|uy)/i)) {
      return beautifyText(`📍 MANZIL: Buxoro viloyati, Romitan tumani, Mustaqillik ko'chasi, 1-uy`);
    }

    const defaultResponses = {
      uz: `🤔 Kechirasiz, men "${userMessage}" degan savolingizga aniq javob topa olmadim. 😅\n\n💡 Quyidagi so'zlardan birini yozib ko'ring:\n• "Yordam" - Barcha mumkin bo'lgan savollar\n• "Tuman haqida" - Umumiy ma'lumot\n• "Statistika" - Raqamli ma'lumotlar\n• "Hokim" - Tuman hokimi haqida\n• "Bank" - ROMITAN BANK haqida`,
      ru: `🤔 Извините, я не смог найти точный ответ на ваш вопрос "${userMessage}". 😅\n\n💡 Попробуйте написать одно из слов:\n• "Помощь" - Все возможные вопросы\n• "О районе" - Общая информация\n• "Статистика" - Цифровые данные\n• "Хоким" - О хокиме района\n• "Банк" - О РОМИТАН БАНКЕ`,
      en: `🤔 Sorry, I couldn't find an exact answer to your question "${userMessage}". 😅\n\n💡 Try typing one of these:\n• "Help" - All possible questions\n• "About district" - General information\n• "Statistics" - Numerical data\n• "Khokim" - About the district khokim\n• "Bank" - About ROMITAN BANK`,
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
      speakText(answer, aiLang);
    }, 800);
  };

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (adminData?.carousel && adminData.carousel.length > 1) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % adminData.carousel.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [adminData?.carousel]);

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
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
    { path: "/services", icon: "th-large", label: "Xizmatlar", labelRu: "Услуги", bg: "bg-blue-50", text: "text-blue-600" },
    { path: "/news", icon: "newspaper", label: "Yangiliklar", labelRu: "Новости", bg: "bg-green-50", text: "text-green-600" },
    { path: "/documents", icon: "file-alt", label: "Hujjatlar", labelRu: "Документы", bg: "bg-orange-50", text: "text-orange-600" },
    { path: "/media", icon: "photo-video", label: "Media", labelRu: "Медиа", bg: "bg-purple-50", text: "text-purple-600" },
    { path: "/organizations", icon: "building", label: "Tashkilotlar", labelRu: "Организации", bg: "bg-red-50", text: "text-red-600" },
    { path: "/statistics", icon: "chart-line", label: "Statistika", labelRu: "Статистика", bg: "bg-teal-50", text: "text-teal-600" },
    { path: "/contact", icon: "envelope", label: "Aloqa", labelRu: "Контакты", bg: "bg-pink-50", text: "text-pink-600" },
    { path: "/about", icon: "info-circle", label: "Tuman haqida", labelRu: "О районе", bg: "bg-indigo-50", text: "text-indigo-600" },
  ];

  const features = [
    { icon: "fas fa-user-check", title: t("Tez xizmat ko'rsatish", "Быстрое обслуживание"), desc: t("30 daqiqada javob", "Ответ за 30 минут") },
    { icon: "fas fa-shield-alt", title: t("Ishonchli tizim", "Надежная система"), desc: t("Ma'lumotlar himoyasi", "Защита данных") },
    { icon: "fas fa-mobile-alt", title: t("Mobil qulaylik", "Мобильное удобство"), desc: t("Har qanday qurilmadan", "С любого устройства") },
    { icon: "fas fa-headset", title: t("24/7 Yordam", "Круглосуточная помощь"), desc: t("Doimiy online qo'llab-quvvatlash", "Постоянная поддержка") },
  ];

  const receptionHours = {
    governor: { days: "Dushanba - Juma", daysRu: "Понедельник - Пятница", time: "15:00 - 17:00", location: "Hokimiyat binosi, 2-qavat", locationRu: "Здание хокимията, 2-этаж" },
    citizens: { days: "Har payshanba", daysRu: "Каждый четверг", time: "10:00 - 13:00", phone: "+998 65 481-00-00" },
  };

  const carouselList = adminData?.carousel || [];
  const leadersList = adminData?.leadership || [];
  const galleryList = adminData?.gallery || [];
  const newsList = adminData?.news || [];
  const latestNews = newsList.slice(0, 3);

  const getCategoryColor = (category) => {
    const colors = { yangilik: 'bg-blue-500', "e'lon": 'bg-green-500', tadbir: 'bg-purple-500', default: 'bg-gray-500' };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      uz: { yangilik: 'Yangilik', "e'lon": "E'lon", tadbir: 'Tadbir' },
      ru: { yangilik: 'Новость', "e'lon": 'Объявление', tadbir: 'Событие' },
      en: { yangilik: 'News', "e'lon": 'Announcement', tadbir: 'Event' }
    };
    return labels[lang]?.[category?.toLowerCase()] || category;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);
    const diffHours = Math.floor((now - date) / 3600000);
    const diffDays = Math.floor((now - date) / 86400000);
    if (diffMins < 1) return 'Hozirgina';
    if (diffMins < 60) return `${diffMins} ${lang === 'uz' ? 'daqiqa oldin' : lang === 'ru' ? 'минут назад' : 'minutes ago'}`;
    if (diffHours < 24) return `${diffHours} ${lang === 'uz' ? 'soat oldin' : lang === 'ru' ? 'часов назад' : 'hours ago'}`;
    if (diffDays < 7) return `${diffDays} ${lang === 'uz' ? 'kun oldin' : lang === 'ru' ? 'дней назад' : 'days ago'}`;
    return date.toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ backgroundImage: `url(${rasm})` }} className="relative overflow-x-hidden ">
      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .hero-orb { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.3; pointer-events: none; }
        .hero-orb-1 { width: 300px; height: 300px; background: radial-gradient(circle, #4f9fff, transparent); top: -100px; right: -100px; }
        .hero-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, #3a7bd5, transparent); bottom: -150px; left: -150px; }
        .hero-orb-3 { width: 200px; height: 200px; background: radial-gradient(circle, #6b4eff, transparent); top: 50%; left: 30%; }
        .hero-orb-4 { width: 250px; height: 250px; background: radial-gradient(circle, #ff6b4e, transparent); bottom: 20%; right: 10%; }
        .hero-title-gradient { background: linear-gradient(135deg, #ffffff, #e0e8ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .hero-accent-line { background: linear-gradient(90deg, #244db6, #6b4eff); }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .scroll-content { animation: scroll 30s linear infinite; display: flex; }
        .scroll-content:hover { animation-play-state: paused; }
        @keyframes shine { 0% { left: -100%; } 20%, 100% { left: 200%; } }
        .shine-wrapper { position: relative; overflow: hidden; }
        .shine-overlay { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: shine 4s infinite; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .anim-fade-up { animation: fadeUp 0.8s ease-out forwards; opacity: 0; }
        .anim-delay-1 { animation-delay: 0.2s; }
        .anim-delay-3 { animation-delay: 0.6s; }
        .circle { position: absolute; border-radius: 50%; background: rgba(0,0,0,0.05); animation: ripple 3s infinite; }
        .circle-1 { width: 100px; height: 100px; top: -30px; right: -30px; animation-delay: 0s; }
        .circle-2 { width: 150px; height: 150px; bottom: -50px; left: -50px; animation-delay: 1s; }
        .circle-3 { width: 80px; height: 80px; bottom: 30px; right: 30px; animation-delay: 2s; }
        @keyframes ripple { 0% { transform: scale(0); opacity: 0.5; } 100% { transform: scale(1); opacity: 0; } }
        @keyframes infiniteScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .infinite-scroll-track { animation: infiniteScroll 60s linear infinite !important; }
        .infinite-scroll-track:hover { animation-play-state: paused !important; }
        @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-modalFadeIn { animation: modalFadeIn 0.3s ease-out; }
      `}</style>

      {/* Hero Slider */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 w-full overflow-hidden pb-4 lg:rounded-b-[80px] rounded-b-[40px]">
        <video className="absolute bottom-0 object-cover w-full h-full pointer-events-none lg:flex opacity-30" src="https://media.istockphoto.com/id/675934872/video/timelapse-of-the-clear-sky.mp4?p=1&s=mp4-640x640-is&k=20&c=ew0TN6INcUMXOtPiLJENipUMAt2ywHPw4mIFLcORpPU=" autoPlay loop muted playsInline style={{ objectFit: "cover" }} />
        <span className="hero-orb hero-orb-1"></span>
        <span className="hero-orb hero-orb-2"></span>
        <span className="hero-orb hero-orb-3"></span>
        <span className="hero-orb hero-orb-4"></span>

        <div>
          <section>
            <div className="py-1 mx-auto lg:py-4 ">
              <div className="overflow-x-hidden">
                <div id="scroll-container" className="flex gap-8">
                  <div className="scroll-content gap-[11px] py-2 flex">
                    {quickLinks.map((link, idx) => (
                      <Link key={idx} to={link.path} className="custom-group group relative min-w-[150px] max-w-[220px] h-[50px] md:h-[70px] lg:min-w-[190px] lg:max-w-[300px] lg:h-[85px] bg-[#f3f4f6] rounded-md lg:rounded-xl p-6 overflow-hidden no-underline transition-all duration-200 hover:-translate-y-0 hover:shadow-lg cursor-pointer flex justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 flex items-center justify-center rounded-md lg:rounded-xl bg-[#213972] text-white shadow-[0_8px_25px_rgba(33,57,114,0.35)] transition-all duration-300 custom-group-hover:shadow-[0_12px_35px_rgba(33,57,114,0.55)] custom-group-hover:bg-[#244db6]">
                            <i className={`fas fa-${link.icon} text-xl`}></i>
                          </div>
                          <div>
                            <h3 className="mt-2 text-base font-semibold leading-none text-[#213972] transition-colors duration-300 custom-group-hover:text-[#244db6]">{t(link.label, link.labelRu)}</h3>
                            <p className="hidden text-sm font-semibold text-gray-400 transition-all duration-300 lg:block custom-group-hover:text-gray-500">{t("Davom etish", "Продолжить")}</p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 text-[#213972]/10 transition-all duration-500 ease-out origin-bottom-right group-hover:rotate-45 group-hover:text-[#244db6]/60">
                          <i className={`fas fa-${link.icon} text-7xl lg:text-8xl opacity-50`}></i>
                        </div>
                      </Link>
                    ))}
                    {quickLinks.map((link, idx) => (
                      <Link key={`dup-${idx}`} to={link.path} className="custom-group group relative min-w-[150px] max-w-[220px] h-[50px] md:h-[70px] lg:min-w-[190px] lg:max-w-[300px] lg:h-[85px] bg-[#f3f4f6] rounded-md lg:rounded-xl p-6 overflow-hidden no-underline transition-all duration-200 hover:-translate-y-0 hover:shadow-lg cursor-pointer flex justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 flex items-center justify-center rounded-md lg:rounded-xl bg-[#213972] text-white shadow-[0_8px_25px_rgba(33,57,114,0.35)] transition-all duration-300 custom-group-hover:shadow-[0_12px_35px_rgba(33,57,114,0.55)] custom-group-hover:bg-[#244db6]">
                            <i className={`fas fa-${link.icon} text-xl`}></i>
                          </div>
                          <div>
                            <h3 className="mt-2 text-base font-semibold leading-none text-[#213972] transition-colors duration-300 custom-group-hover:text-[#244db6]">{t(link.label, link.labelRu)}</h3>
                            <p className="hidden text-sm font-semibold text-gray-400 transition-all duration-300 lg:block custom-group-hover:text-gray-500">{t("Davom etish", "Продолжить")}</p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 text-[#213972]/10 transition-all duration-500 ease-out origin-bottom-right group-hover:rotate-45 group-hover:text-[#244db6]/60">
                          <i className={`fas fa-${link.icon} text-7xl lg:text-8xl opacity-50`}></i>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="w-24 h-1 bg-gradient-to-r from-[#244db6] via-[#3a6fe0] to-transparent rounded-full mb-6 hero-accent-line"></div>
            <div className="grid items-stretch grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
              <div className="flex flex-col justify-center text-white lg:col-span-3 anim-fade-up anim-delay-1">
                <h1 className="mb-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl hero-title-gradient">{t("Romitan tumani", "Ромитанский район")}</h1>

                <div className="shine-wrapper block rounded-2xl lg:rounded-3xl relative overflow-hidden w-full aspect-[16/9] sm:aspect-[12/5.5] bg-gradient-to-br from-blue-700 to-indigo-800 shadow-2xl shadow-blue-900/40 ring-1 ring-white/10">
                  <div className="relative w-full h-full">
                    {carouselList && carouselList.length > 0 ? carouselList.map((slide, index) => (
                      <div key={slide.id || index} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === activeSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"}`}>
                        {slide.image ? <img src={slide.image} className="absolute inset-0 object-cover w-full h-full" alt={slide.title || "Slide image"} onError={(e) => { e.target.style.display = "none"; e.target.parentElement.style.backgroundColor = "#1e3a8a"; }} />
                          : <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-700 to-indigo-800"><div className="text-center text-white/50"><i className="mb-4 text-6xl fas fa-image"></i><p>{slide.title || "Rasm mavjud emas"}</p></div></div>}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 z-10 p-5 text-white sm:p-6"><h4 className="text-lg font-bold tracking-wide md:text-2xl drop-shadow-lg">{slide.title}</h4>{slide.description && <p className="mt-1 text-sm sm:text-base opacity-90 line-clamp-2">{slide.description}</p>}</div>
                      </div>
                    )) : <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-700 to-indigo-800"><div className="text-center text-white"><i className="mb-4 text-6xl opacity-50 fas fa-image"></i><p className="text-lg">{t("Romitan tumani", "Ромитанский район")}</p><p className="text-sm opacity-70">{t("Rasmlar mavjud emas", "Изображения отсутствуют")}</p></div></div>}
                    
                    {carouselList.length > 1 && (<div className="carousel-dots absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">{carouselList.map((_, index) => (<button key={index} className={`transition-all duration-300 rounded-full ${index === activeSlide ? "bg-white w-8 h-2" : "bg-white/50 w-2 h-2 hover:bg-white/80"}`} onClick={() => setActiveSlide(index)} />))}</div>)}
                    {carouselList.length > 1 && (<div className="absolute bottom-0 left-0 right-0 z-20 h-1 carousel-progress-bar bg-white/20"><div className="h-full transition-all duration-500 carousel-progress-fill bg-gradient-to-r from-amber-300 to-amber-500" style={{ width: `${((activeSlide + 1) / carouselList.length) * 100}%` }}></div></div>)}
                    <span className="absolute inset-0 pointer-events-none shine-overlay"></span>
                  </div>
                </div>

                <h3 className="mt-5 mb-1 text-base font-medium sm:text-lg lg:text-xl text-white/90">{t("Romitan tumani rasmiy portali", "Официальный портал Ромитанского района")}</h3>
                <p className="mb-5 text-sm sm:text-base text-white/70">{t("Xalqimizning farovon hayoti va tuman taraqqiyoti yo'lida", "Во имя благополучия и развития нашего района")}</p>
              </div>

              <div className="flex flex-col justify-center gap-3 lg:col-span-2 anim-fade-up anim-delay-3">
                <Link to="/services" className="group relative overflow-hidden flex items-center justify-between rounded-2xl lg:rounded-3xl p-5 lg:p-6 no-underline shadow-xl shadow-amber-900/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, rgb(184,134,11) 0%, rgb(218,165,32) 35%, rgb(255,215,0) 65%, rgb(184,134,11) 100%)" }}>
                  <span className="absolute w-24 h-24 transition-transform duration-700 bg-white rounded-full -top-6 -right-6 opacity-20 blur-xl group-hover:scale-150"></span>
                  <div className="relative z-10 flex flex-col"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 mb-1">{t("Davlat xizmatlari", "Гос. услуги")}</span><span className="text-2xl font-bold tracking-wide text-white lg:text-3xl">{t("Xizmatlar", "Услуги")}</span></div>
                  <span className="relative z-10 flex items-center justify-center w-12 h-12 transition-all duration-500 border rounded-full bg-white/20 backdrop-blur-sm border-white/40 group-hover:bg-white group-hover:scale-110"><i className="text-lg text-white transition-colors duration-500 fas fa-arrow-right group-hover:text-amber-600"></i></span>
                </Link>

                <div className="flex flex-col gap-2.5">
                  {[{ to: "/news", label: t("Yangiliklar", "Новости"), icon: "fa-newspaper" }, { to: "/statistics", label: t("Statistika", "Статистика"), icon: "fa-chart-line" }, { to: "/contact", label: t("Aloqa", "Контакты"), icon: "fa-phone" }].map((item) => (
                    <Link to={item.to} key={item.to}><div className="group flex items-center gap-3 w-full text-left text-lg lg:text-xl font-semibold text-white bg-gradient-to-r from-[#2347b2] to-[#1a3680] hover:from-[#2d5ad9] hover:to-[#2347b2] rounded-2xl px-4 py-3.5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ring-1 ring-white/5">
                      <span className="flex items-center justify-center w-10 h-10 text-base text-white transition-all duration-300 bg-white/15 rounded-xl group-hover:bg-white/25 group-hover:rotate-6"><i className={`fas ${item.icon}`}></i></span>
                      <span className="flex-1 transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
                      <i className="text-base transition-all duration-300 fas fa-arrow-right text-white/70 group-hover:translate-x-1 group-hover:text-white"></i>
                    </div></Link>
                  ))}
                </div>

                <Link to="/contact" className="group relative overflow-hidden flex items-center justify-between text-black bg-white rounded-2xl lg:rounded-3xl p-5 lg:p-6 no-underline shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-0.5">
                  <div className="circles"><span className="circle circle-1"></span><span className="circle circle-2"></span><span className="circle circle-3"></span></div>
                  <div className="relative z-10 flex flex-col"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2347b2]/70 mb-1">{t("24/7 ochiq", "24/7 открыто")}</span><h5 className="font-bold text-lg md:text-2xl text-[#1a3680]">{t("Onlayn murojaat", "Онлайн обращение")}</h5></div>
                  <span className="relative z-10 rounded-full border-2 border-[#2347b2] p-3 icon-svg transition-all duration-500 group-hover:border-[#2347b2] group-hover:bg-[#2347b2] group-hover:scale-110 group-hover:rotate-12"><i className="fas fa-arrow-right text-[#2347b2] text-lg transition-colors duration-500 group-hover:text-white"></i></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-16 bg-white/80 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-blue-600 md:text-4xl">{t("Nima uchun biz?", "Почему мы?")}</h2>
            <div className="w-20 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 text-center transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-2 group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-600 group-hover:scale-110">
                  <i className={`${feature.icon} text-2xl text-blue-600 group-hover:text-white transition-all duration-300`}></i>
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

      <div ref={statsRef} className="relative z-10 pb-20 bg-white">
        <Statistics />
      </div>

      {/* Leadership Section */}
      {leadersList.length > 0 && (
        <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-blue-900">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`, backgroundSize: "30px 30px" }}></div>
          </div>

          <div className="relative z-10 mx-auto">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <i className="text-sm text-blue-400 fas fa-users"></i>
                <span className="text-xs font-semibold tracking-wider text-blue-300 uppercase">{t("Rahbariyat", "Руководство")}</span>
              </div>
              <h2 className="text-3xl font-bold text-white md:text-5xl drop-shadow-lg">{t("Romitan tumani rahbariyati", "Руководство Ромитанского района")}</h2>
              <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
              <p className="max-w-2xl mx-auto mt-4 text-blue-100">{t("Tumanimiz taraqqiyoti yo'lida fidokorona mehnat qilayotgan rahbarlar", "Руководители, самоотверженно работающие на пути развития нашего района")}</p>
            </div>

            <div className="relative py-6 overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 z-20 w-32 pointer-events-none sm:w-48 md:w-64 lg:w-80 bg-gradient-to-r from-blue-900 via-blue-900/95 to-transparent"></div>
              <div className="absolute top-0 bottom-0 right-0 z-20 w-32 pointer-events-none sm:w-48 md:w-64 lg:w-80 bg-gradient-to-l from-blue-900 via-blue-900/95 to-transparent"></div>
              <div className="overflow-hidden">
                <div className="flex gap-6 infinite-scroll-track" style={{ width: "max-content" }} onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = "paused"; }} onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = "running"; }}>
                  {leadersList.map((leader, idx) => (
                    <div key={`first-${leader.id}`} className="relative h-[450px] w-[280px] flex-shrink-0 group cursor-pointer" onClick={() => setSelectedTeacher(leader)}>
                      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-blue-500/20 border border-white/20">
                        {leader.image ? (<><img src={leader.image} alt={leader.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=No+Image"; }} /><div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40"></div></>) : (<div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700"><i className="fas fa-user-tie text-7xl text-white/40"></i></div>)}
                        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                          <p className="text-lg font-bold leading-tight text-white line-clamp-2 drop-shadow-md">{leader.name}</p>
                          <p className="mt-1 text-sm font-medium text-blue-300 line-clamp-2">{leader.position}</p>
                          <div className="absolute bottom-4 left-5 h-[2px] w-16 origin-left scale-x-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
                        </div>
                        <div className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none group-hover:opacity-100"><div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent"></div></div>
                      </div>
                    </div>
                  ))}
                  {leadersList.map((leader, idx) => (
                    <div key={`second-${leader.id}`} className="relative h-[450px] w-[280px] flex-shrink-0 group cursor-pointer" onClick={() => setSelectedTeacher(leader)}>
                      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-blue-500/20 border border-white/20">
                        {leader.image ? (<><img src={leader.image} alt={leader.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=No+Image"; }} /><div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40"></div></>) : (<div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700"><i className="fas fa-user-tie text-7xl text-white/40"></i></div>)}
                        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                          <p className="text-lg font-bold leading-tight text-white line-clamp-2 drop-shadow-md">{leader.name}</p>
                          <p className="mt-1 text-sm font-medium text-blue-300 line-clamp-2">{leader.position}</p>
                          <div className="absolute bottom-4 left-5 h-[2px] w-16 origin-left scale-x-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
                        </div>
                        <div className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none group-hover:opacity-100"><div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent"></div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button onClick={() => navigate("/about")} className="relative inline-flex items-center gap-2 px-8 py-3 overflow-hidden text-white transition-all duration-300 border rounded-full group bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20">
                <span className="relative z-10">{t("Barcha rahbarlar", "Все руководители")}</span>
                <i className="relative z-10 transition-transform duration-300 fas fa-arrow-right group-hover:translate-x-1"></i>
                <div className="absolute inset-0 transition-transform duration-500 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTeacher && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedTeacher(null)}>
          <div className="relative w-full max-w-4xl overflow-hidden border shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-white/20" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedTeacher(null)} className="absolute z-10 flex items-center justify-center w-10 h-10 text-white transition-all duration-300 rounded-full top-4 right-4 bg-black/50 hover:bg-black/70 hover:scale-110 hover:rotate-90"><i className="text-xl fas fa-times"></i></button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative overflow-hidden h-80 md:h-full bg-gradient-to-br from-blue-800 to-indigo-900">
                {selectedTeacher.image ? <img src={selectedTeacher.image} alt={selectedTeacher.name} className="object-cover w-full h-full" onError={(e) => { e.target.src = "https://via.placeholder.com/500x600?text=No+Image"; }} /> : <div className="flex items-center justify-center w-full h-full"><i className="fas fa-user-tie text-8xl text-white/30"></i></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="p-6 md:p-8">
                <div className="mb-4"><div className="w-12 h-1 mb-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div><h3 className="text-2xl font-bold text-white md:text-3xl">{selectedTeacher.name}</h3><p className="mt-1 text-lg font-medium text-blue-400">{selectedTeacher.position}</p></div>
                <div className="mb-4"><h4 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase"><i className="mr-2 text-blue-400 fas fa-user-circle"></i>{t("Biografiya", "Биография")}</h4><p className="leading-relaxed text-gray-300">{selectedTeacher.description || t("Ma'lumot mavjud emas", "Информация отсутствует")}</p></div>
                {selectedTeacher.email && (<div className="pt-4 mt-6 border-t border-gray-700"><a href={`mailto:${selectedTeacher.email}`} className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-blue-400"><i className="fas fa-envelope"></i><span>{selectedTeacher.email}</span></a></div>)}
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
              <h2 className="mb-3 text-3xl font-bold text-blue-600 md:text-4xl">{t("Galereya", "Галерея")}</h2>
              <div className="w-20 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
            </div>
            <Swiper modules={[Autoplay, Pagination, Navigation]} spaceBetween={20} slidesPerView={1} breakpoints={{ 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }} autoplay={{ delay: 2000, disableOnInteraction: false }} speed={800} pagination={{ clickable: true }} navigation loop={true} className="pb-12">
              {galleryList.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="relative overflow-hidden shadow-lg rounded-2xl group">
                    <div className="relative h-64 overflow-hidden">
                      <img src={item.image} className="object-cover w-full h-full transition duration-500 group-hover:scale-110" alt={item.title} />
                      <div className="absolute inset-0 transition duration-300 opacity-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:opacity-100" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transition duration-300 transform translate-y-full group-hover:translate-y-0"><p className="text-sm font-medium">{item.title}</p></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Reception Hours */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="relative z-10 px-4 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-white shadow-md rounded-full border border-blue-100">
              <i className="text-sm text-blue-500 fas fa-calendar-alt"></i>
              <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">{t("Ish vaqti", "Время работы")}</span>
            </div>
            <h2 className="mb-3 text-3xl font-bold text-gray-800 md:text-4xl">{t("Qabul jadvali", "График приема")}</h2>
            <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <p className="max-w-2xl mx-auto mt-4 text-gray-500">{t("Sizni qabul qilishdan mamnunmiz. Quyidagi jadval asosida murojaat qilishingiz mumkin.", "Мы рады приветствовать вас. Вы можете обратиться по следующему графику.")}</p>
          </div>

          <div className="grid max-w-5xl gap-6 mx-auto md:grid-cols-2">
            <div className="relative overflow-hidden transition-all duration-500 bg-white shadow-xl group rounded-2xl hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 transition-transform duration-700 origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:scale-x-100"></div>
              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative"><div className="absolute inset-0 transition-opacity duration-500 bg-blue-100 rounded-full opacity-0 blur-xl group-hover:opacity-100"></div><div className="relative flex items-center justify-center rounded-full shadow-lg w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600"><i className="text-2xl text-white fas fa-user-tie"></i></div></div>
                  <div><h3 className="text-xl font-bold text-gray-800">{t("Tuman hokimi qabuli", "Прием хокима района")}</h3><div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-transparent rounded-full mt-1"></div></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600 transition-colors duration-300 group-hover:text-gray-800"><div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50"><i className="text-sm text-blue-500 fas fa-calendar-alt"></i></div><div><p className="text-xs tracking-wider text-gray-400 uppercase">{t("Kunlar", "Дни")}</p><p className="font-medium">{t(receptionHours.governor.days, receptionHours.governor.daysRu)}</p></div></div>
                  <div className="flex items-center gap-3 text-gray-600 transition-colors duration-300 group-hover:text-gray-800"><div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50"><i className="text-sm text-blue-500 fas fa-clock"></i></div><div><p className="text-xs tracking-wider text-gray-400 uppercase">{t("Vaqt", "Время")}</p><p className="font-medium">{receptionHours.governor.time}</p></div></div>
                  <div className="flex items-center gap-3 text-gray-600 transition-colors duration-300 group-hover:text-gray-800"><div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50"><i className="text-sm text-blue-500 fas fa-map-marker-alt"></i></div><div><p className="text-xs tracking-wider text-gray-400 uppercase">{t("Manzil", "Адрес")}</p><p className="font-medium">{t(receptionHours.governor.location, receptionHours.governor.locationRu)}</p></div></div>
                </div>
                <div className="absolute text-blue-100 transition-opacity duration-500 opacity-0 bottom-4 right-4 group-hover:opacity-100"><i className="text-4xl fas fa-calendar-check"></i></div>
              </div>
            </div>

            <div className="relative overflow-hidden transition-all duration-500 bg-white shadow-xl group rounded-2xl hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 transition-transform duration-700 origin-left scale-x-0 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:scale-x-100"></div>
              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative"><div className="absolute inset-0 transition-opacity duration-500 rounded-full opacity-0 bg-emerald-100 blur-xl group-hover:opacity-100"></div><div className="relative flex items-center justify-center rounded-full shadow-lg w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600"><i className="text-2xl text-white fas fa-users"></i></div></div>
                  <div><h3 className="text-xl font-bold text-gray-800">{t("Fuqarolar qabuli", "Прием граждан")}</h3><div className="w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-transparent rounded-full mt-1"></div></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600 transition-colors duration-300 group-hover:text-gray-800"><div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50"><i className="text-sm text-emerald-500 fas fa-calendar-alt"></i></div><div><p className="text-xs tracking-wider text-gray-400 uppercase">{t("Kun", "День")}</p><p className="font-medium">{t(receptionHours.citizens.days, receptionHours.citizens.daysRu)}</p></div></div>
                  <div className="flex items-center gap-3 text-gray-600 transition-colors duration-300 group-hover:text-gray-800"><div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50"><i className="text-sm text-emerald-500 fas fa-clock"></i></div><div><p className="text-xs tracking-wider text-gray-400 uppercase">{t("Vaqt", "Время")}</p><p className="font-medium">{receptionHours.citizens.time}</p></div></div>
                  <div className="flex items-center gap-3 text-gray-600 transition-colors duration-300 group-hover:text-gray-800"><div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50"><i className="text-sm text-emerald-500 fas fa-phone-alt"></i></div><div><p className="text-xs tracking-wider text-gray-400 uppercase">{t("Telefon", "Телефон")}</p><p className="font-medium">{receptionHours.citizens.phone}</p></div></div>
                </div>
                <div className="absolute transition-opacity duration-500 opacity-0 bottom-4 right-4 text-emerald-100 group-hover:opacity-100"><i className="text-4xl fas fa-clock"></i></div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-blue-100 rounded-full shadow-md">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full"><i className="text-sm text-blue-500 fas fa-info-circle"></i></div>
              <span className="text-sm text-gray-600">{t("Qo'shimcha ma'lumot uchun:", "Для дополнительной информации:")}</span>
              <a href="tel:+998654810000" className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline">+998 65 481-00-00</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-blue-50/50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="relative z-10 py-16 bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-blue-50 rounded-full"><i className="text-sm text-blue-500 fas fa-newspaper"></i><span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">{t("Eng so'nggi yangiliklar", "Последние новости")}</span></div>
            <h2 className="mb-3 text-3xl font-bold text-gray-800 md:text-4xl">{t("So'nggi yangiliklar", "Последние новости")}</h2>
            <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <p className="max-w-2xl mx-auto mt-4 text-gray-500">{t("Romitan tumanidagi so'nggi yangiliklar va e'lonlardan xabardor bo'ling", "Будьте в курсе последних новостей и объявлений Ромитанского района")}</p>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((news, index) => (
                <div key={news.id} onClick={() => navigate(`/news/${news.id}`)} className="cursor-pointer group">
                  <div className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl">
                    <div className="relative h-56 overflow-hidden">
                      {news.image ? (<><img src={news.image} alt={news.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" /><div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100" /></>) : (<div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"><i className="text-6xl text-white/50 fas fa-newspaper"></i></div>)}
                      {news.category && (<div className="absolute top-4 left-4"><span className={`${getCategoryColor(news.category)} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm`}>{getCategoryLabel(news.category)}</span></div>)}
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg"><div className="flex items-center gap-2 text-xs text-white"><i className="text-blue-300 fas fa-calendar-alt"></i><span>{formatDate(news.createdAt)}</span></div></div>
                    </div>
                    <div className="p-5">
                      <h3 className="mb-2 text-xl font-bold text-gray-800 transition-colors duration-300 line-clamp-2 group-hover:text-blue-600">{news.title}</h3>
                      <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-3">{news.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100"><div className="flex items-center gap-2 text-xs text-gray-400"><i className="fas fa-eye"></i><span>{news.views || 0} {t("ko'rish", "просмотров")}</span></div><div className="flex items-center gap-1 text-sm font-medium text-blue-500 transition-all duration-300 group-hover:gap-2"><span>{t("Batafsil", "Подробнее")}</span><i className="text-xs transition-transform duration-300 fas fa-arrow-right group-hover:translate-x-1"></i></div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (<div className="py-12 text-center"><i className="mb-4 text-6xl text-gray-300 far fa-newspaper"></i><p className="text-gray-400">{t("Hozircha yangiliklar yo'q", "Новостей пока нет")}</p></div>)}
          
          {latestNews.length > 0 && (<div className="mt-12 text-center"><button onClick={() => navigate("/news")} className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"><span>{t("Barcha yangiliklar", "Все новости")}</span><i className="transition-transform duration-300 fas fa-arrow-right group-hover:translate-x-1"></i></button></div>)}
        </div>
      </div>

      {/* AI Chat Button - Kattaroq va animatsiyali variant */}
<button 
  onClick={() => setIsChatOpen(!isChatOpen)} 
  className="fixed z-50 flex items-center justify-center overflow-hidden transition-all duration-300 rounded-full shadow-lg bottom-6 right-6 group hover:shadow-2xl hover:scale-110"
  style={{ width: "70px", height: "70px" }}
>
  {isChatOpen ? (
    <div className="flex items-center justify-center w-full h-full text-white bg-gradient-to-r from-red-500 to-pink-500">
      <i className="text-2xl fas fa-times"></i>
    </div>
  ) : (
    <div className="relative w-full h-full">
      <img 
        src="https://media1.tenor.com/m/tGFp68ulbMIAAAAC/pom-bot.gif" 
        alt="AI Assistant"
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
      <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -top-1 -right-1 animate-ping"></span>
      <span className="absolute w-3 h-3 bg-green-400 border-2 border-white rounded-full -top-1 -right-1"></span>
    </div>
  )}
  
</button>

      {/* AI Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-14 right-6 z-50 w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="relative p-4 overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm"><i className="text-xl fas fa-robot"></i></div>
                <div><h3 className="font-bold text-white">Romitan AI Yordamchi</h3><div className="flex items-center gap-2 text-xs text-white/80"><span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span>Online</span><span>•</span><span className="flex items-center gap-1"><i className="text-xs fas fa-volume-up"></i>{isSpeaking ? "Gapiryapti..." : "Ovozli javob"}</span></div></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 p-0.5 rounded-lg bg-white/20 backdrop-blur-sm">{['uz', 'ru', 'en'].map((lang) => (<button key={lang} onClick={() => setAiLang(lang)} className={`px-2 py-1 text-xs rounded-md transition-all duration-200 ${aiLang === lang ? "bg-white text-blue-600 shadow-md" : "text-white hover:bg-white/20"}`}>{lang.toUpperCase()}</button>))}</div>
                <button onClick={() => setIsChatOpen(false)} className="flex items-center justify-center w-8 h-8 transition rounded-full bg-white/20 hover:bg-white/30"><i className="text-sm text-white fas fa-times"></i></button>
              </div>
            </div>
          </div>
          <div className="h-[400px] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-2 max-w-[85%] ${msg.isUser ? "flex-row-reverse" : ""}`}>
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${msg.isUser ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gradient-to-r from-purple-500 to-pink-500"}`}>
                      <i className={`text-xs text-white ${msg.isUser ? "fas fa-user" : "fas fa-robot"}`}></i>
                    </div>
                    <div className={`relative p-3 rounded-2xl shadow-md ${msg.isUser ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md" : "bg-white text-gray-700 rounded-bl-md border border-gray-100"}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <span className={`block mt-1 text-[10px] ${msg.isUser ? "text-blue-100" : "text-gray-400"}`}><i className="mr-1 far fa-clock"></i> {msg.time}</span>
                      <div className={`absolute bottom-0 w-2.5 h-2.5 transform rotate-45 ${msg.isUser ? "-right-1 bg-gradient-to-r from-blue-600 to-indigo-600" : "-left-1 bg-white border-l border-t border-gray-100"}`}></div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div className="flex items-center justify-center rounded-full w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500"><i className="text-xs text-white fas fa-robot"></i></div>
                    <div className="p-3 bg-white shadow-md rounded-2xl rounded-bl-md"><div className="flex gap-1.5"><span className="w-2 h-2 bg-gray-400 rounded-full"></span><span className="w-2 h-2 bg-gray-400 rounded-full"></span><span className="w-2 h-2 bg-gray-400 rounded-full"></span></div></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
          <div className="px-4 py-3 bg-white border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "fas fa-hand-peace", text: "Salom", query: "Salom", color: "from-blue-400 to-blue-500" },
                { icon: "fas fa-map-marker-alt", text: "Tuman", query: "Tuman haqida", color: "from-red-400 to-red-500" },
                { icon: "fas fa-user-tie", text: "Hokim", query: "Hokim", color: "from-indigo-400 to-indigo-600" },
                { icon: "fas fa-chart-line", text: "Statistika", query: "Statistika", color: "from-green-400 to-green-600" },
                { icon: "fas fa-university", text: "Bank", query: "Bank haqida", color: "from-yellow-500 to-orange-600" },
                { icon: "fas fa-phone-alt", text: "Aloqa", query: "Aloqa", color: "from-teal-400 to-teal-600" },
                { icon: "fas fa-question-circle", text: "Yordam", query: "Yordam", color: "from-purple-500 to-pink-600" },
              ].map((btn, idx) => (
                <button key={btn.text} onClick={() => setChatInput(btn.query)} className={`px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r ${btn.color} text-white shadow-md transition-all duration-200`}>
                  <i className={`${btn.icon} mr-1 text-[10px]`}></i><span>{btn.text}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <button onClick={handleVoiceInput} className="px-4 py-2.5 text-gray-600 transition-all bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:shadow-md group"><i className="fas fa-microphone"></i></button>
              <div className="relative flex-1"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="💬 Savolingizni yozing..." className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-gray-50" /></div>
              <button onClick={handleSendMessage} className="px-5 py-2.5 text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg"><i className="fas fa-paper-plane"></i></button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <span className="text-[10px] text-gray-400 flex items-center gap-1"><i className="text-yellow-400 fas fa-lightbulb"></i><span>Masalan:</span></span>
              {["Bank", "Statistika", "Hokim kim"].map((s, idx) => (<button key={s} onClick={() => setChatInput(s)} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all duration-200">{s}</button>))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}