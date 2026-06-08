import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Documents from './pages/Documents';
import Media from './pages/Media';
import Contact from './pages/Contact';
import Statistics from './pages/Statistics';
import Organizations from './pages/Organizations';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import DashboardStatistics from './pages/DashboardStatistics';
import MobileInfo from './pages/MobileInfo';
import AdminTopics from './pages/AdminTopics';

import { authAPI, documentsAPI, mediaAPI, newsAPI, servicesAPI, statisticsAPI, toApiUrl } from './services/api';

// OneID va boshqa tashkilotlar uchun login/register sahifalari
import OneIDLogin from './pages/OneIDLogin';
import OneIDRegister from './pages/OneIDRegister';
import IDUZLogin from './pages/IDUZLogin';
import IDUZRegister from './pages/IDUZRegister';
import MyIDLogin from './pages/MyIDLogin';
import MyIDRegister from './pages/MyIDRegister';
import EImzoLogin from './pages/EImzoLogin';
import EImzoRegister from './pages/EImzoRegister';
import MyGovLogin from './pages/MyGovLogin';
import MyGovRegister from './pages/MyGovRegister';

// Murojaatlar moduli

import { MurojaatProvider } from './context/MurojaatContext';
import Murojatlar from './pages/Murojatlar';
import AdminMurojat from './pages/AdminMurojat';
// import AdminMurojat from './pages/AdminMurojatlarStatistikasi';
import AdminMalumotlar from './pages/AdminMalumotlar';

export const AppContext = createContext();

// Default data
const defaultData = {
  news: [
    { id: 1, title: "Jondor tumanida yangi maktab ochildi", titleRu: "Новая школа открылась", content: "600 o'rinli zamonaviy maktab foydalanishga topshirildi.", date: "2025-05-20", image: "https://images.pexels.com/photos/159740/classroom-school-desk-lecture-159740.jpeg?w=800", views: 245 },
    { id: 2, title: "Investitsiya forumida shartnomalar imzolandi", titleRu: "На инвестиционном форуме подписаны контракты", content: "15 ta xorijiy kompaniya bilan hamkorlik o'rnatildi.", date: "2025-05-18", image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=800", views: 189 }
  ],
  services: [
    { id: 1, name: "Fuqarolik holati aktlari", nameRu: "Акты гражданского состояния", icon: "id-card", description: "Tug'ilish, nikoh va vafot hujjatlarini rasmiylashtirish", department: "ZAGS" },
    { id: 2, name: "Yer uchastkasi", nameRu: "Земельный участок", icon: "map-marked-alt", description: "Yer uchastkasini ajratish va rasmiylashtirish", department: "Yer resurslari" }
  ],
  statistics: [
    { id: 1, label: "Aholi soni", labelRu: "Численность населения", value: 128500, icon: "users", color: "blue", prefix: "", suffix: "+" },
    { id: 2, label: "Maktablar", labelRu: "Школы", value: 42, icon: "school", color: "green", prefix: "", suffix: "" },
    { id: 3, label: "Kasalxonalar", labelRu: "Больницы", value: 3, icon: "hospital", color: "red", prefix: "", suffix: "" },
    { id: 4, label: "Tadbirkorlar", labelRu: "Предприниматели", value: 1250, icon: "briefcase", color: "purple", prefix: "", suffix: "+" }
  ],
  organizations: [
    { id: 1, name: "Jondor tuman hokimligi", nameRu: "Хокимият Джондорского района", phone: "+998 65 380-00-00", email: "info@jondor.uz", address: "Jondor shahri" }
  ],
  gallery: [
    { id: 1, image: "https://images.pexels.com/photos/159740/classroom-school-desk-lecture-159740.jpeg?w=800", title: "Yangi maktab", titleRu: "Новая школа" }
  ],
  carousel: [
    { id: 1, image: "https://images.pexels.com/photos/154801/pexels-photo-154801.jpeg?w=1600", title: "Jondor tumaniga xush kelibsiz", titleRu: "Добро пожаловать в Джондорский район" }
  ],
  leadership: [],
  documents: [],
  faqs: [],
  contacts: [],
  subscribers: [],
  topics: [],
  mobileInfo: {
    jondor: {
      title: { uz: "Jondor tumani", ru: "Джондорский район", en: "Jondor District" },
      description: { uz: "Jondor tumani - Buxoro viloyatidagi go'zal tuman. 1926-yilda tashkil topgan.", ru: "Джондорский район - красивый район Бухарской области. Основан в 1926 году.", en: "Jondor district is a beautiful district in Bukhara region. Founded in 1926." },
      history: { uz: "Jondor tumani 1926-yilda tashkil topgan. Tuman hududida ko'plab tarixiy obidalar mavjud.", ru: "Джондорский район основан в 1926 году. На территории района находятся множество исторических памятников.", en: "Jondor district was founded in 1926. There are many historical monuments." },
      geography: { uz: "Tuman maydoni 1.2 ming km². Buxoro viloyatining shimoli-g'arbiy qismida joylashgan.", ru: "Площадь района 1,2 тыс. км². Расположен в северо-западной части Бухарской области.", en: "The area of the district is 1.2 thousand km². Located in the northwestern part of Bukhara region." },
      population: { uz: "Aholisi 154,700 dan ortiq kishi.", ru: "Население более 154,700 человек.", en: "Population over 154,700 people." },
      economy: { uz: "Asosiy tarmoqlar: paxtachilik, chorvachilik, sabzavotchilik va bog'dorchilik.", ru: "Основные отрасли: хлопководство, животноводство, овощеводство и садоводство.", en: "Main industries: cotton growing, animal husbandry, vegetable growing and gardening." },
      culture: { uz: "Chor Bakr majmuasi, Sitorai Mohi Xosa kabi tarixiy obidalar mavjud.", ru: "Имеются такие исторические памятники, как комплекс Чор-Бакр, Ситораи Мохи Хоса.", en: "There are historical monuments such as Chor-Bakr complex, Sitorai Mohi Hosa." },
      leadership: { uz: "Tuman hokimi - Xudoyev Jamshid Rajabovich.", ru: "Хоким района - Худоев Джамшид Раджабович.", en: "Khokim of the district - Khudoyev Jamshid Rajabovich." }
    },
    site: {
      title: { uz: "Sayt haqida", ru: "О сайте", en: "About Site" },
      description: { uz: "Jondor tumani rasmiy portali - raqamli boshqaruv va tahlil markazi.", ru: "Официальный портал Джондорского района - центр цифрового управления и анализа.", en: "The official portal of Jondor district is a digital management and analysis center." },
      features: { uz: "Statistika, Hujjatlar, Xizmatlar, Yangiliklar, Galereya, AI Yordamchi.", ru: "Статистика, Документы, Услуги, Новости, Галерея, AI Помощник.", en: "Statistics, Documents, Services, News, Gallery, AI Assistant." },
      contact: { uz: "Telefon: +998 65 582-18-53", ru: "Телефон: +998 65 582-18-53", en: "Phone: +998 65 582-18-53" },
      email: { uz: "jondor.t@exat.uz", ru: "jondor.t@exat.uz", en: "jondor.t@exat.uz" },
      address: { uz: "Jondor tumani, M. Tarobiy ko'chasi, 26", ru: "Джондорский район, ул. М. Таробий, 26", en: "Jondor district, M. Tarobiy str., 26" }
    }
  },
  receptionHours: {
    governor: { days: 'Dushanba - Juma', daysRu: 'Понедельник - Пятница', time: '15:00 - 17:00', location: 'Hokimiyat binosi, 2-qavat', locationRu: 'Здание хокимията, 2-этаж' },
    citizens: { days: 'Har payshanba', daysRu: 'Каждый четверг', time: '10:00 - 13:00', phone: '+998 65 380-00-00', phoneRu: '+998 65 380-00-00' }
  }
};

const normalizeMediaItem = (item) => ({
  ...item,
  image: toApiUrl(item.image || item.imageUrl || item.thumbnailUrl),
  imageUrl: toApiUrl(item.imageUrl),
  thumbnailUrl: toApiUrl(item.thumbnailUrl),
});

const normalizeNewsItem = (item) => ({
  ...item,
  image: toApiUrl(item.image || item.imageUrl),
  imageUrl: toApiUrl(item.imageUrl),
  date: item.date || item.publishedDate?.split?.('T')?.[0] || item.createdAt?.split?.('T')?.[0],
});

const formatFileSize = (size) => {
  if (!size) return '';
  return `${(Number(size) / 1024 / 1024).toFixed(2)} MB`;
};

const normalizeDocumentItem = (item) => ({
  ...item,
  name: item.name || item.title,
  nameRu: item.nameRu || item.titleRu,
  category: item.category || item.type,
  date: item.date || item.createdAt?.split?.('T')?.[0],
  fileUrl: toApiUrl(item.fileUrl),
  fileSize: typeof item.fileSize === 'number' ? formatFileSize(item.fileSize) : item.fileSize,
});

const newsPayload = (item) => {
  const payload = withoutGeneratedId(item);
  return {
    ...payload,
    imageUrl: item.imageUrl || item.image,
    imageId: item.imageId || null,
    publishedDate: item.publishedDate || (item.date ? `${item.date}T00:00:00` : undefined),
  };
};

const documentPayload = (item) => ({
  title: item.title || item.name,
  titleRu: item.titleRu || item.nameRu,
  titleEn: item.titleEn,
  type: item.type || item.category,
  year: item.year || (item.date ? Number(item.date.split('-')[0]) : new Date().getFullYear()),
  fileUrl: item.fileUrl,
  fileId: item.fileId || null,
  description: item.description,
  descriptionRu: item.descriptionRu,
  descriptionEn: item.descriptionEn,
  downloadCount: item.downloadCount,
  isPublished: item.isPublished,
});

const withoutGeneratedId = (item) => {
  const { id, date, image, ...payload } = item;
  return payload;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('uz');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(defaultData);

  useEffect(() => {
    const loadData = async () => {
      let initialData = defaultData;

      const saved = localStorage.getItem('jondor_portal_data');
      if (localStorage.getItem('access_token')) {
        setIsAdmin(true);
      }

      if (saved) {
        try {
          initialData = { ...defaultData, ...JSON.parse(saved) };
          setAdminData(initialData);
        } catch (e) {
          console.error('Error loading local data:', e);
        }
      } else {
        localStorage.setItem('jondor_portal_data', JSON.stringify(defaultData));
      }

      try {
        const [newsRes, servicesRes, statsRes, mediaRes, documentsRes] = await Promise.all([
          newsAPI.getAll(),
          servicesAPI.getAll(),
          statisticsAPI.getAll(),
          mediaAPI.getAll(),
          documentsAPI.getAll(),
        ]);

        const backendData = {
          ...initialData,
          news: Array.isArray(newsRes.data) ? newsRes.data.map(normalizeNewsItem) : initialData.news,
          services: Array.isArray(servicesRes.data) ? servicesRes.data : initialData.services,
          statistics: Array.isArray(statsRes.data) ? statsRes.data : initialData.statistics,
          gallery: Array.isArray(mediaRes.data) ? mediaRes.data.map(normalizeMediaItem) : initialData.gallery,
          documents: Array.isArray(documentsRes.data) ? documentsRes.data.map(normalizeDocumentItem) : initialData.documents,
        };

        setAdminData(backendData);
        localStorage.setItem('jondor_portal_data', JSON.stringify(backendData));
      } catch (e) {
        console.error('Error loading backend data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateData = (newData) => {
    setAdminData(newData);
    localStorage.setItem('jondor_portal_data', JSON.stringify(newData));
  };

  const login = async (username, password) => {
    try {
      const res = await authAPI.login({ phone: username, password, rememberMe: true });
      if (res.data?.access_token) {
        localStorage.setItem('access_token', res.data.access_token);
        if (res.data.refresh_token) {
          localStorage.setItem('refresh_token', res.data.refresh_token);
        }
        localStorage.setItem('adminToken', res.data.access_token);
        localStorage.setItem('adminLoggedIn', 'true');
        setIsAdmin(true);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoggedIn');
    setIsAdmin(false);
  };

  // CRUD functions
  const addNews = async (item) => {
    const res = await newsAPI.create(newsPayload(item));
    updateData({ ...adminData, news: [normalizeNewsItem(res.data), ...adminData.news] });
  };
  const deleteNews = async (id) => {
    await newsAPI.delete(id);
    updateData({ ...adminData, news: adminData.news.filter(n => n.id !== id) });
  };
  const updateNews = async (item) => {
    const res = await newsAPI.update(item.id, newsPayload(item));
    updateData({ ...adminData, news: adminData.news.map(n => n.id === item.id ? normalizeNewsItem(res.data) : n) });
  };

  const addService = async (item) => {
    const res = await servicesAPI.create(withoutGeneratedId(item));
    updateData({ ...adminData, services: [...adminData.services, res.data] });
  };
  const deleteService = async (id) => {
    await servicesAPI.delete(id);
    updateData({ ...adminData, services: adminData.services.filter(s => s.id !== id) });
  };
  const updateService = async (item) => {
    const res = await servicesAPI.update(item.id, item);
    updateData({ ...adminData, services: adminData.services.map(s => s.id === item.id ? res.data : s) });
  };

  const addStatistic = async (item) => {
    const res = await statisticsAPI.create(withoutGeneratedId(item));
    updateData({ ...adminData, statistics: [...adminData.statistics, res.data] });
  };
  const deleteStatistic = async (id) => {
    await statisticsAPI.delete(id);
    updateData({ ...adminData, statistics: adminData.statistics.filter(s => s.id !== id) });
  };
  const updateStatistic = async (item) => {
    const res = await statisticsAPI.update(item.id, item);
    updateData({ ...adminData, statistics: adminData.statistics.map(s => s.id === item.id ? res.data : s) });
  };

  const addOrganization = (item) => updateData({ ...adminData, organizations: [...adminData.organizations, item] });
  const deleteOrganization = (id) => updateData({ ...adminData, organizations: adminData.organizations.filter(o => o.id !== id) });
  const updateOrganization = (item) => updateData({ ...adminData, organizations: adminData.organizations.map(o => o.id === item.id ? item : o) });

  const addGallery = async (item) => {
    const payload = {
      ...withoutGeneratedId(item),
      imageUrl: item.imageUrl || item.image,
      imageId: item.imageId || null,
      thumbnailUrl: item.thumbnailUrl || item.image,
    };
    const res = await mediaAPI.create(payload);
    updateData({ ...adminData, gallery: [...adminData.gallery, normalizeMediaItem(res.data)] });
  };
  const deleteGallery = async (id) => {
    await mediaAPI.delete(id);
    updateData({ ...adminData, gallery: adminData.gallery.filter(g => g.id !== id) });
  };
  const updateGallery = async (item) => {
    const payload = {
      ...item,
      imageUrl: item.imageUrl || item.image,
      imageId: item.imageId || null,
      thumbnailUrl: item.thumbnailUrl || item.image,
    };
    const res = await mediaAPI.update(item.id, payload);
    updateData({ ...adminData, gallery: adminData.gallery.map(g => g.id === item.id ? normalizeMediaItem(res.data) : g) });
  };

  const addCarousel = (item) => updateData({ ...adminData, carousel: [...adminData.carousel, item] });
  const deleteCarousel = (id) => updateData({ ...adminData, carousel: adminData.carousel.filter(c => c.id !== id) });
  const updateCarousel = (item) => updateData({ ...adminData, carousel: adminData.carousel.map(c => c.id === item.id ? item : c) });

  const addLeadership = (item) => updateData({ ...adminData, leadership: [...adminData.leadership, item] });
  const deleteLeadership = (id) => updateData({ ...adminData, leadership: adminData.leadership.filter(l => l.id !== id) });
  const updateLeadership = (item) => updateData({ ...adminData, leadership: adminData.leadership.map(l => l.id === item.id ? item : l) });

  const addDocument = async (item) => {
    const res = await documentsAPI.create(documentPayload(item));
    updateData({ ...adminData, documents: [...adminData.documents, normalizeDocumentItem(res.data)] });
  };
  const deleteDocument = async (id) => {
    await documentsAPI.delete(id);
    updateData({ ...adminData, documents: adminData.documents.filter(d => d.id !== id) });
  };
  const updateDocument = async (item) => {
    const res = await documentsAPI.update(item.id, documentPayload(item));
    updateData({ ...adminData, documents: adminData.documents.map(d => d.id === item.id ? normalizeDocumentItem(res.data) : d) });
  };

  const addFaq = (item) => updateData({ ...adminData, faqs: [...adminData.faqs, item] });
  const deleteFaq = (id) => updateData({ ...adminData, faqs: adminData.faqs.filter(f => f.id !== id) });
  const updateFaq = (item) => updateData({ ...adminData, faqs: adminData.faqs.map(f => f.id === item.id ? item : f) });

  // Topics functions
  const addTopic = (item) => {
    const updated = [...(adminData.topics || []), { ...item, id: Date.now() }];
    updateData({ ...adminData, topics: updated });
  };
  const deleteTopic = (id) => {
    const updated = (adminData.topics || []).filter(t => t.id !== id);
    updateData({ ...adminData, topics: updated });
  };
  const updateTopic = (id, updatedTopic) => {
    const updated = (adminData.topics || []).map(t => t.id === id ? { ...t, ...updatedTopic } : t);
    updateData({ ...adminData, topics: updated });
  };

  // Mobile Info functions
  const updateMobileInfo = (section, field, lang, value) => {
    const updatedMobileInfo = {
      ...adminData.mobileInfo,
      [section]: {
        ...adminData.mobileInfo[section],
        [field]: {
          ...adminData.mobileInfo[section][field],
          [lang]: value
        }
      }
    };
    updateData({ ...adminData, mobileInfo: updatedMobileInfo });
  };

  const submitContact = (data) => {
    const newContact = { ...data, id: Date.now(), date: new Date().toISOString().split('T')[0] };
    updateData({ ...adminData, contacts: [newContact, ...adminData.contacts] });
    return true;
  };

  const subscribe = (email) => {
    if (adminData.subscribers.find(s => s.email === email)) return true;
    updateData({ ...adminData, subscribers: [...adminData.subscribers, { id: Date.now(), email, date: new Date().toISOString().split('T')[0] }] });
    return true;
  };

  const updateReceptionHours = (data) => updateData({ ...adminData, receptionHours: data });

  const t = (uz, ru, en) => {
    if (lang === 'uz') return uz;
    if (lang === 'ru') return ru;
    return en || uz;
  };

  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div></div>;
  }

  return (
    <AppContext.Provider value={{
      lang, setLang, t, isAdmin, setIsAdmin, login, logout, adminData, updateData,
      news: adminData.news, deleteNews, addNews, updateNews,
      services: adminData.services, deleteService, addService, updateService,
      statistics: adminData.statistics, deleteStatistic, addStatistic, updateStatistic,
      organizations: adminData.organizations, deleteOrganization, addOrganization, updateOrganization,
      gallery: adminData.gallery, deleteGallery, addGallery, updateGallery,
      carousel: adminData.carousel, deleteCarousel, addCarousel, updateCarousel,
      leadership: adminData.leadership, deleteLeadership, addLeadership, updateLeadership,
      documents: adminData.documents, deleteDocument, addDocument, updateDocument,
      faqs: adminData.faqs, deleteFaq, addFaq, updateFaq,
      contacts: adminData.contacts, subscribers: adminData.subscribers,
      topics: adminData.topics || [], addTopic, deleteTopic, updateTopic,
      mobileInfo: adminData.mobileInfo, updateMobileInfo,
      receptionHours: adminData.receptionHours, submitContact, subscribe, updateReceptionHours
    }}>
      <MurojaatProvider>
        <Router>
          <Toaster position="top-right" />
          <div className="flex flex-col min-h-screen bg-gray-50">
            {!window.location.pathname.includes('/admin') && <Navbar />}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/media" element={<Media />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/dashboard" element={<DashboardStatistics />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/mobile-info" element={<MobileInfo />} />
                <Route path="/admin-topics" element={<AdminTopics />} />
                <Route path="/admin/*" element={<Admin />} />
                
                {/* OneID */}
                <Route path="/oneid-login" element={<OneIDLogin />} />
                <Route path="/oneid-register" element={<OneIDRegister />} />
                
                {/* ID.UZ */}
                <Route path="/iduz-login" element={<IDUZLogin />} />
                <Route path="/iduz-register" element={<IDUZRegister />} />
                
                {/* MyID */}
                <Route path="/myid-login" element={<MyIDLogin />} />
                <Route path="/myid-register" element={<MyIDRegister />} />
                
                {/* E-IMZO */}
                <Route path="/eimzo-login" element={<EImzoLogin />} />
                <Route path="/eimzo-register" element={<EImzoRegister />} />
                
                {/* my.gov.uz */}
                <Route path="/mygov-login" element={<MyGovLogin />} />
                <Route path="/mygov-register" element={<MyGovRegister />} />

                {/* Murojaatlar moduli */}
                <Route path="/murojatlar" element={<Murojatlar />} />
                <Route path="/admin/murojat" element={<AdminMurojat />} />
                {/* <Route path="/admin/murojat-statistika" element={<AdminMurojatStatistikasi />} /> */}
                <Route path="/admin/malumotlar" element={<AdminMalumotlar />} />
              </Routes>
            </main>
            {!window.location.pathname.includes('/admin') && <Footer />}
            <ScrollToTop />
          </div>
        </Router>
      </MurojaatProvider>
    </AppContext.Provider>
  );
}

export default App;