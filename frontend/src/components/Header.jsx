import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('uz');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ news: [], services: [] });
  const [showSearch, setShowSearch] = useState(false);
  const [settings, setSettings] = useState({});
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const [newsRes, servicesRes] = await Promise.all([
        api.get(`/news?q=${searchQuery}`),
        api.get(`/services?q=${searchQuery}`)
      ]);
      setSearchResults({ news: newsRes.data, services: servicesRes.data });
      setShowSearch(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleResultClick = (path) => {
    setShowSearch(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-xl py-2' : 'bg-white/95 backdrop-blur-md py-4'}`}>
      <div className="container-max">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 transition opacity-50 bg-primary rounded-xl blur-md group-hover:opacity-75"></div>
              <div className="relative flex items-center justify-center transition duration-300 shadow-lg w-11 h-11 bg-gradient-to-br from-primary to-primaryDark rounded-xl group-hover:scale-105">
                <i className="text-xl text-white fas fa-landmark"></i>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-primary to-primaryDark bg-clip-text">Jondor tumani</h1>
              <p className="text-xs text-gray-500">Rasmiy portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-center hidden gap-1 lg:flex">
            {/* <Link to="/" className="relative px-4 py-2 font-medium transition rounded-lg hover:bg-gray-100 group">Bosh sahifa</Link> */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2 font-medium transition rounded-lg hover:bg-gray-100">
                Tuman haqida <i className="text-xs fas fa-chevron-down"></i>
              </button>
              <div className="absolute left-0 z-50 invisible w-56 transition-all duration-300 bg-white border shadow-xl opacity-0 top-full rounded-xl group-hover:opacity-100 group-hover:visible">
                <Link to="/about#history" className="block px-4 py-2 transition-all hover:bg-gray-50 hover:pl-6">📜 Tarix</Link>
                <Link to="/about#leadership" className="block px-4 py-2 transition-all hover:bg-gray-50 hover:pl-6">👥 Rahbariyat</Link>
                <Link to="/about#economy" className="block px-4 py-2 transition-all hover:bg-gray-50 hover:pl-6">📊 Iqtisodiyot</Link>
                <Link to="/about#projects" className="block px-4 py-2 transition-all hover:bg-gray-50 hover:pl-6">🏗 Loyihalar</Link>
              </div>
            </div>
            <Link to="/services" className="px-4 py-2 font-medium transition rounded-lg hover:bg-gray-100">Xizmatlar</Link>
            <Link to="/news" className="px-4 py-2 font-medium transition rounded-lg hover:bg-gray-100">Yangiliklar</Link>
            <Link to="/documents" className="px-4 py-2 font-medium transition rounded-lg hover:bg-gray-100">Hujjatlar</Link>
            <Link to="/media" className="px-4 py-2 font-medium transition rounded-lg hover:bg-gray-100">Media</Link>
            <Link to="/contact" className="px-4 py-2 font-medium transition rounded-lg hover:bg-gray-100">Aloqa</Link>
            <Link to="/statistics" className="px-4 py-2 font-medium transition rounded-lg hover:bg-gray-100">Statistika</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <i className="text-sm fas fa-clock text-primary"></i>
              <span className="text-sm font-medium">{new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <form onSubmit={handleSearch} className="relative" ref={searchRef}>
              <div className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Qidirish..."
                  className="hidden w-64 px-4 py-2 transition border md:block rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button type="submit" className="hidden btn-outline btn-sm md:flex">
                  <i className="fas fa-search"></i> Qidirish
                </button>
                <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg lg:hidden hover:bg-gray-100">
                  <i className="text-xl fas fa-bars"></i>
                </button>
              </div>
              {showSearch && (searchResults.news.length > 0 || searchResults.services.length > 0) && (
                <div className="absolute left-0 right-0 z-50 mt-2 overflow-y-auto bg-white border shadow-xl top-full rounded-xl max-h-96 animate-scaleIn">
                  <div className="p-3 border-b bg-gray-50"><span className="text-sm font-semibold text-gray-500">Natijalar</span></div>
                  {searchResults.news.map(n => (
                    <button key={n.id} onClick={() => handleResultClick(`/news/${n.id}`)} className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-gray-50">
                      <i className="fas fa-newspaper text-primary"></i>
                      <div><div className="font-medium">{n.title}</div><div className="text-xs text-gray-500">Yangilik</div></div>
                    </button>
                  ))}
                  {searchResults.services.map(s => (
                    <button key={s.id} onClick={() => handleResultClick(`/services/${s.id}`)} className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-gray-50">
                      <i className="fas fa-gear text-primary"></i>
                      <div><div className="font-medium">{s.name}</div><div className="text-xs text-gray-500">Xizmat</div></div>
                    </button>
                  ))}
                </div>
              )}
            </form>

            <button onClick={() => setLang(l => l === 'uz' ? 'ru' : (l === 'ru' ? 'en' : 'uz'))} className="hidden btn-outline btn-sm sm:flex">
              <i className="fas fa-globe"></i> {lang.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="pt-4 mt-4 border-t lg:hidden animate-fadeInUp">
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Bosh sahifa</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Tuman haqida</Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Xizmatlar</Link>
              <Link to="/news" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Yangiliklar</Link>
              <Link to="/documents" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Hujjatlar</Link>
              <Link to="/media" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Media</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Aloqa</Link>
              <Link to="/statistics" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Statistika</Link>
              <Link to="/mobile-info" className="flex items-center gap-2 text-gray-700">
                <i className="fas fa-mobile-alt text-blue-600"></i>
                <span>Mobile Info</span>
              </Link>
              {/* <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-white rounded-lg bg-primary">Admin panel</Link> */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}