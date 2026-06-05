import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import AdminNews from './AdminNews';
import AdminServices from './AdminServices';
import AdminStatistics from './AdminStatistics';
import AdminOrganizations from './AdminOrganizations';
import AdminGallery from './AdminGallery';
import AdminCarousel from './AdminCarousel';
import AdminLeadership from './AdminLeadership';
import AdminFaq from './AdminFaq';
import AdminDocuments from './AdminDocuments';
import AdminDashboardSettings from './AdminDashboardSettings';
import AdminTopics from './AdminTopics';
import AdminMurojat from './AdminMurojat';
import AdminMalumotlar from './AdminMalumotlar';

export default function Admin() {
  const { 
    t, isAdmin, login, logout,
    news, services, statistics, organizations, gallery, carousel, leadership, documents, faqs, contacts, subscribers, receptionHours, updateReceptionHours,
    topics
  } = useContext(AppContext);
  
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState(null);
  
  // Reception Hours Form
  const [receptionForm, setReceptionForm] = useState({
    governor: { days: 'Dushanba - Juma', daysRu: 'Понедельник - Пятница', time: '15:00 - 17:00', location: 'Hokimiyat binosi, 2-qavat', locationRu: 'Здание хокимията, 2-этаж' },
    citizens: { days: 'Har payshanba', daysRu: 'Каждый четверг', time: '10:00 - 13:00', phone: '+998 65 380-00-00', phoneRu: '+998 65 380-00-00' }
  });

  useEffect(() => {
    if (receptionHours) {
      setReceptionForm(receptionHours);
    }
  }, [receptionHours]);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showMessage = (msg, type = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(loginData.username, loginData.password);
    if (success) {
      setError('');
      showMessage('Xush kelibsiz!');
    } else {
      setError('Login yoki parol xato!');
    }
  };

  const handleUpdateReception = () => {
    updateReceptionHours(receptionForm);
    showMessage('Qabul jadvali yangilandi!');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003580] to-[#001a4a] p-4">
        <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#003580] to-[#0066cc] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="text-3xl text-white fas fa-landmark"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            <p className="mt-1 text-sm text-gray-500">Jondor tumani boshqaruvi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <i className="absolute text-gray-400 -translate-y-1/2 fas fa-user left-4 top-1/2"></i>
              <input type="text" placeholder="Login" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#003580] transition" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} />
            </div>
            <div className="relative">
              <i className="absolute text-gray-400 -translate-y-1/2 fas fa-lock left-4 top-1/2"></i>
              <input type="password" placeholder="Parol" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#003580] transition" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
            </div>
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl">{error}</div>}
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#003580] to-[#0066cc] text-white font-bold rounded-xl hover:shadow-lg transition">
              <i className="mr-2 fas fa-sign-in-alt"></i> Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'chart-line' },
    { id: 'dashboardSettings', label: 'Dashboard sozlamalari', icon: 'tachometer-alt' },
    { id: 'news', label: 'Yangiliklar', icon: 'newspaper' },
    { id: 'services', label: 'Xizmatlar', icon: 'th-large' },
// { id: 'murojaatStatistika', label: '📊 Murojaat Statistikasi', icon: 'chart-line' },
    { id: 'statistics', label: 'Statistika', icon: 'chart-bar' },
    { id: 'organizations', label: 'Tashkilotlar', icon: 'building' },
    { id: 'gallery', label: 'Galereya', icon: 'images' },
    { id: 'carousel', label: 'Karusel', icon: 'sliders-h' },
    { id: 'documents', label: 'Hujjatlar', icon: 'file-alt' },
    { id: 'leadership', label: 'Rahbariyat', icon: 'users' },
    { id: 'faq', label: 'FAQ', icon: 'question-circle' },
    { id: 'reception', label: 'Qabul jadvali', icon: 'calendar-alt' },
    { id: 'contacts', label: 'Murojaatlar', icon: 'envelope' },
    { id: 'subscribers', label: 'Obunalar', icon: 'bell' },
    // ============ YANGI QO'SHILGANLAR (tab sifatida) ============
    { id: 'adminMurojat', label: ' Admin Murojaat', icon: 'comment-alt' },
    { id: 'adminMalumotlar', label: ' Admin Ma\'lumotlar', icon: 'database' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {message && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slideInRight ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {message.text}
        </div>
      )}

      {/* Sidebar */}
     <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-2xl transition-all duration-300 transform flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
  {/* Header - yuqori qism */}
  <div className="bg-gradient-to-r from-[#003580] to-[#0066cc] p-5 flex-shrink-0">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
        <i className="text-2xl text-white fas fa-landmark"></i>
      </div>
      <div>
        <h1 className="text-lg font-bold text-white">Admin Panel</h1>
        <p className="text-xs text-white/70">Jondor tumani</p>
      </div>
    </div>
    <button onClick={() => setSidebarOpen(false)} className="absolute top-5 right-4 text-white/70 hover:text-white md:hidden">
      <i className="text-xl fas fa-times"></i>
    </button>
  </div>

  {/* Menu items - scroll qiladigan qism */}
  <div className="flex-1 px-3 py-4 overflow-y-auto">
    {menuItems.map(item => (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1.5 transition-all duration-200 ${
          activeTab === item.id 
            ? 'bg-primary/10 text-primary shadow-md' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeTab === item.id ? 'bg-primary/20' : 'bg-gray-100'}`}>
          <i className={`fas fa-${item.icon} text-sm ${activeTab === item.id ? 'text-primary' : 'text-gray-500'}`}></i>
        </div>
        <span className="flex-1 text-sm font-medium text-left">{item.label}</span>
        {item.id === 'contacts' && contacts.length > 0 && (
          <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">{contacts.length}</span>
        )}
        {item.id === 'subscribers' && subscribers.length > 0 && (
          <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-blue-500 rounded-full">{subscribers.length}</span>
        )}
        {item.id === 'topics' && topics && topics.length > 0 && (
          <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-indigo-500 rounded-full">{topics.length}</span>
        )}
      </button>
    ))}
  </div>

  {/* Footer - pastki qism */}
  <div className="flex-shrink-0 p-4 border-t bg-gray-50">
    <button onClick={logout} className="flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium">
      <i className="fas fa-sign-out-alt"></i> Chiqish
    </button>
  </div>
</div>

{sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 transition rounded-lg hover:bg-gray-100">
            <i className="text-xl fas fa-bars text-[#003580]"></i>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <i className="fas fa-calendar-alt text-[#003580] text-sm"></i>
              <span className="text-sm text-gray-600">{new Date().toLocaleDateString('uz-UZ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#003580] to-[#0066cc] rounded-full flex items-center justify-center text-white shadow-md">
                <i className="text-sm fas fa-user"></i>
              </div>
              <span className="hidden text-sm font-medium text-gray-700 sm:inline">Admin</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>
              <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
                <div className="p-5 bg-white border shadow-sm rounded-xl">
                  <div className="text-3xl font-bold text-primary">{news.length}</div>
                  <div className="text-sm text-gray-500">Yangiliklar</div>
                </div>
                <div className="p-5 bg-white border shadow-sm rounded-xl">
                  <div className="text-3xl font-bold text-primary">{services.length}</div>
                  <div className="text-sm text-gray-500">Xizmatlar</div>
                </div>
                <div className="p-5 bg-white border shadow-sm rounded-xl">
                  <div className="text-3xl font-bold text-primary">{topics?.length || 0}</div>
                  <div className="text-sm text-gray-500">Mavzular (Mobile)</div>
                </div>
                <div className="p-5 bg-white border shadow-sm rounded-xl">
                  <div className="text-3xl font-bold text-primary">{organizations.length}</div>
                  <div className="text-sm text-gray-500">Tashkilotlar</div>
                </div>
                <div className="p-5 bg-white border shadow-sm rounded-xl">
                  <div className="text-3xl font-bold text-primary">{subscribers.length}</div>
                  <div className="text-sm text-gray-500">Obunalar</div>
                </div>
              </div>
              <div className="mt-8">
                <h2 className="mb-4 text-lg font-bold text-gray-800">So'nggi murojaatlar</h2>
                <div className="overflow-hidden bg-white border shadow-sm rounded-xl">
                  {contacts.slice(0, 5).map(contact => (
                    <div key={contact.id} className="p-4 border-b hover:bg-gray-50">
                      <div className="font-medium text-gray-800">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                      <p className="mt-1 text-sm text-gray-600">{contact.message?.slice(0, 100)}</p>
                    </div>
                  ))}
                  {contacts.length === 0 && <div className="p-8 text-center text-gray-500">Hech qanday murojaat yo'q</div>}
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD SETTINGS TAB */}
          {activeTab === 'dashboardSettings' && <AdminDashboardSettings />}
          
          {/* NEWS TAB */}
          {activeTab === 'news' && <AdminNews />}
          
          {/* SERVICES TAB */}
          {activeTab === 'services' && <AdminServices />}
          
          {/* TOPICS TAB */}
          {activeTab === 'topics' && <AdminTopics />}
          
          {/* STATISTICS TAB */}
          {activeTab === 'statistics' && <AdminStatistics />}

          {/* {activeTab === 'murojaatStatistika' && <MurojaatStatistika />} */}
          
          {/* ORGANIZATIONS TAB */}
          {activeTab === 'organizations' && <AdminOrganizations />}
          
          {/* GALLERY TAB */}
          {activeTab === 'gallery' && <AdminGallery />}
          
          {/* CAROUSEL TAB */}
          {activeTab === 'carousel' && <AdminCarousel />}
          
          {/* DOCUMENTS TAB */}
          {activeTab === 'documents' && <AdminDocuments />}
          
          {/* LEADERSHIP TAB */}
          {activeTab === 'leadership' && <AdminLeadership />}
          
          {/* FAQ TAB */}
          {activeTab === 'faq' && <AdminFaq />}
          
          {/* RECEPTION TAB */}
          {activeTab === 'reception' && (
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h2 className="mb-4 text-xl font-bold">Qabul jadvali boshqaruvi</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-blue-50">
                  <h3 className="mb-3 font-bold"><i className="mr-2 text-blue-600 fas fa-user-tie"></i> Tuman hokimi qabuli</h3>
                  <div className="space-y-3">
                    <div><label className="block mb-1 text-sm font-medium">Kunlar (UZ)</label><input type="text" className="w-full p-2 border rounded-lg" value={receptionForm.governor.days} onChange={e => setReceptionForm({...receptionForm, governor: {...receptionForm.governor, days: e.target.value}})} /></div>
                    <div><label className="block mb-1 text-sm font-medium">Kunlar (RU)</label><input type="text" className="w-full p-2 border rounded-lg" value={receptionForm.governor.daysRu} onChange={e => setReceptionForm({...receptionForm, governor: {...receptionForm.governor, daysRu: e.target.value}})} /></div>
                    <div><label className="block mb-1 text-sm font-medium">Vaqt</label><input type="text" className="w-full p-2 border rounded-lg" value={receptionForm.governor.time} onChange={e => setReceptionForm({...receptionForm, governor: {...receptionForm.governor, time: e.target.value}})} /></div>
                    <div><label className="block mb-1 text-sm font-medium">Manzil (UZ)</label><input type="text" className="w-full p-2 border rounded-lg" value={receptionForm.governor.location} onChange={e => setReceptionForm({...receptionForm, governor: {...receptionForm.governor, location: e.target.value}})} /></div>
                    <div><label className="block mb-1 text-sm font-medium">Manzil (RU)</label><input type="text" className="w-full p-2 border rounded-lg" value={receptionForm.governor.locationRu} onChange={e => setReceptionForm({...receptionForm, governor: {...receptionForm.governor, locationRu: e.target.value}})} /></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-green-50">
                  <h3 className="mb-3 font-bold"><i className="mr-2 text-green-600 fas fa-users"></i> Fuqarolar qabuli</h3>
                  <div className="space-y-3">
                    <div><label className="block mb-1 text-sm font-medium">Kunlar (UZ)</label><input type="text" className="w-full p-2 border rounded-lg" value={receptionForm.citizens.days} onChange={e => setReceptionForm({...receptionForm, citizens: {...receptionForm.citizens, days: e.target.value}})} /></div>
                    <div><label className="block mb-1 text-sm font-medium">Kunlar (RU)</label><input type="text" className="w-full p-2 border rounded-lg" value={receptionForm.citizens.daysRu} onChange={e => setReceptionForm({...receptionForm, citizens: {...receptionForm.citizens, daysRu: e.target.value}})} /></div>
                    <div><label className="block mb-1 text-sm font-medium">Vaqt</label><input type="text" className="w-full p-2 border rounded-lg" value={receptionForm.citizens.time} onChange={e => setReceptionForm({...receptionForm, citizens: {...receptionForm.citizens, time: e.target.value}})} /></div>
                    <div><label className="block mb-1 text-sm font-medium">Telefon</label><input type="text" className="w-full p-2 border rounded-lg" value={receptionForm.citizens.phone} onChange={e => setReceptionForm({...receptionForm, citizens: {...receptionForm.citizens, phone: e.target.value}})} /></div>
                  </div>
                </div>
              </div>
              <button onClick={handleUpdateReception} className="mt-6 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition"><i className="mr-2 fas fa-save"></i> Saqlash</button>
            </div>
          )}
          
          {/* CONTACTS TAB */}
          {activeTab === 'contacts' && (
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h2 className="mb-4 text-xl font-bold">Murojaatlar</h2>
              {contacts.length === 0 ? (
                <div className="py-8 text-center text-gray-500">Hech qanday murojaat yo'q</div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-96">
                  {contacts.map(c => (
                    <div key={c.id} className="p-3 rounded-lg bg-gray-50">
                      <div className="font-bold">{c.name}</div>
                      <div className="text-sm text-gray-500">{c.email}</div>
                      <p className="mt-1 text-sm">{c.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* SUBSCRIBERS TAB */}
          {activeTab === 'subscribers' && (
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h2 className="mb-4 text-xl font-bold">Obunalar</h2>
              {subscribers.length === 0 ? (
                <div className="py-8 text-center text-gray-500">Hech qanday obuna yo'q</div>
              ) : (
                <div className="space-y-2">
                  {subscribers.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-2 border-b">
                      <span>{s.email}</span>
                      <span className="text-xs text-gray-400">{s.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============ ADMIN MUROJAT TAB ============ */}
          {activeTab === 'adminMurojat' && <AdminMurojat />}
          
          {/* ============ ADMIN MA'LUMOTLAR TAB ============ */}
          {activeTab === 'adminMalumotlar' && <AdminMalumotlar />}
        </div>
      </div>
    </div>
  );
}