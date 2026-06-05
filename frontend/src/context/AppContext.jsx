import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('uz');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Barcha state'lar
  const [news, setNews] = useState([]);
  const [services, setServices] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [receptionHours, setReceptionHours] = useState({
    governor: { days: 'Dushanba - Juma', daysRu: 'Понедельник - Пятница', time: '15:00 - 17:00', location: 'Hokimiyat binosi, 2-qavat', locationRu: 'Здание хокимията, 2-этаж' },
    citizens: { days: 'Har payshanba', daysRu: 'Каждый четверг', time: '10:00 - 13:00', phone: '+998 65 380-00-00', phoneRu: '+998 65 380-00-00' }
  });

  // Default topics
  const defaultTopics = [
    { 
      id: 1, 
      icon: "fa-landmark",
      title: { uz: "Jondor tumani", ru: "Джондорский район", en: "Jondor District" },
      image: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?w=400",
      description: { 
        uz: "Jondor tumani - Buxoro viloyatidagi go'zal tuman. 1926-yilda tashkil topgan. Aholisi 154,700 dan ortiq.",
        ru: "Джондорский район - красивый район Бухарской области. Основан в 1926 году. Население более 154 700 человек.",
        en: "Jondor district is a beautiful district in Bukhara region. Founded in 1926. Population over 154,700."
      }
    },
    { 
      id: 2, 
      icon: "fa-history",
      title: { uz: "Tarix", ru: "История", en: "History" },
      image: "https://images.pexels.com/photos/161931/lonely-tree-tree-sunset-field-161931.jpeg?w=400",
      description: { 
        uz: "Jondor tumani 1926-yilda tashkil topgan. Tuman hududida 20 dan ortiq tarixiy obidalar mavjud.",
        ru: "Джондорский район основан в 1926 году. На территории района более 20 исторических памятников.",
        en: "Jondor district was founded in 1926. There are over 20 historical monuments."
      }
    },
    { 
      id: 3, 
      icon: "fa-map-marker-alt",
      title: { uz: "Geografiya", ru: "География", en: "Geography" },
      image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?w=400",
      description: { 
        uz: "Tuman maydoni 1.2 ming km². Buxoro viloyatining shimoli-g'arbiy qismida joylashgan.",
        ru: "Площадь района 1,2 тыс. км². Расположен в северо-западной части Бухарской области.",
        en: "The area of the district is 1.2 thousand km². Located in the northwestern part of Bukhara region."
      }
    }
  ];

  // LocalStorage dan yuklash
  useEffect(() => {
    const loadData = async () => {
      try {
        // Admin login status
        const savedAdmin = localStorage.getItem('adminLoggedIn');
        if (savedAdmin === 'true') setIsAdmin(true);

        // Topics yuklash
        const savedTopics = localStorage.getItem('jondor_topics');
        if (savedTopics && savedTopics !== 'undefined') {
          const parsed = JSON.parse(savedTopics);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTopics(parsed);
          } else {
            setTopics(defaultTopics);
            localStorage.setItem('jondor_topics', JSON.stringify(defaultTopics));
          }
        } else {
          setTopics(defaultTopics);
          localStorage.setItem('jondor_topics', JSON.stringify(defaultTopics));
        }

        // Boshqa ma'lumotlar
        const savedNews = localStorage.getItem('jondor_news');
        if (savedNews) setNews(JSON.parse(savedNews));
        
        const savedServices = localStorage.getItem('jondor_services');
        if (savedServices) setServices(JSON.parse(savedServices));
        
        const savedStats = localStorage.getItem('jondor_statistics');
        if (savedStats) setStatistics(JSON.parse(savedStats));
        
        const savedOrgs = localStorage.getItem('jondor_organizations');
        if (savedOrgs) setOrganizations(JSON.parse(savedOrgs));
        
        const savedGallery = localStorage.getItem('jondor_gallery');
        if (savedGallery) setGallery(JSON.parse(savedGallery));
        
        const savedCarousel = localStorage.getItem('jondor_carousel');
        if (savedCarousel) setCarousel(JSON.parse(savedCarousel));
        
        const savedLeadership = localStorage.getItem('jondor_leadership');
        if (savedLeadership) setLeadership(JSON.parse(savedLeadership));
        
        const savedDocuments = localStorage.getItem('jondor_documents');
        if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
        
        const savedFaqs = localStorage.getItem('jondor_faqs');
        if (savedFaqs) setFaqs(JSON.parse(savedFaqs));
        
        const savedContacts = localStorage.getItem('jondor_contacts');
        if (savedContacts) setContacts(JSON.parse(savedContacts));
        
        const savedSubscribers = localStorage.getItem('jondor_subscribers');
        if (savedSubscribers) setSubscribers(JSON.parse(savedSubscribers));
        
        const savedReception = localStorage.getItem('jondor_reception');
        if (savedReception) setReceptionHours(JSON.parse(savedReception));

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Topics CRUD
  const addTopic = (topic) => {
    const newTopic = { ...topic, id: Date.now() };
    const updated = [...topics, newTopic];
    setTopics(updated);
    localStorage.setItem('jondor_topics', JSON.stringify(updated));
  };

  const updateTopic = (id, updatedTopic) => {
    const updated = topics.map(t => t.id === id ? { ...t, ...updatedTopic } : t);
    setTopics(updated);
    localStorage.setItem('jondor_topics', JSON.stringify(updated));
  };

  const deleteTopic = (id) => {
    const updated = topics.filter(t => t.id !== id);
    setTopics(updated);
    localStorage.setItem('jondor_topics', JSON.stringify(updated));
  };

  const login = async (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('adminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminLoggedIn');
  };

  const updateReceptionHours = (data) => {
    setReceptionHours(data);
    localStorage.setItem('jondor_reception', JSON.stringify(data));
  };

  const t = (uz, ru, en) => {
    if (lang === 'uz') return uz;
    if (lang === 'ru') return ru;
    return en || uz;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      lang, setLang, t, isAdmin, login, logout,
      news, setNews,
      services, setServices,
      statistics, setStatistics,
      organizations, setOrganizations,
      gallery, setGallery,
      carousel, setCarousel,
      leadership, setLeadership,
      documents, setDocuments,
      faqs, setFaqs,
      contacts, setContacts,
      subscribers, setSubscribers,
      topics, addTopic, updateTopic, deleteTopic,
      receptionHours, updateReceptionHours
    }}>
      {children}
    </AppContext.Provider>
  );
};