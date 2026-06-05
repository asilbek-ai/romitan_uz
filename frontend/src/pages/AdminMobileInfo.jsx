import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminMobileInfo() {
  const { mobileInfo, updateMobileInfo } = useContext(AppContext);
  const [activeSection, setActiveSection] = useState('jondor');
  const [editLang, setEditLang] = useState('uz');
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const sections = [
    { id: 'jondor', name: 'Jondor tumani', nameRu: 'Джондорский район', nameEn: 'Jondor District' },
    { id: 'site', name: 'Sayt haqida', nameRu: 'О сайте', nameEn: 'About Site' }
  ];

  const fields = {
    jondor: ['title', 'description', 'history', 'geography', 'population', 'economy', 'culture', 'leadership'],
    site: ['title', 'description', 'features', 'contact', 'email', 'address']
  };

  const fieldLabels = {
    title: { uz: 'Nomi', ru: 'Название', en: 'Title' },
    description: { uz: 'Tavsif', ru: 'Описание', en: 'Description' },
    history: { uz: 'Tarix', ru: 'История', en: 'History' },
    geography: { uz: 'Geografiya', ru: 'География', en: 'Geography' },
    population: { uz: 'Aholi', ru: 'Население', en: 'Population' },
    economy: { uz: 'Iqtisodiyot', ru: 'Экономика', en: 'Economy' },
    culture: { uz: 'Madaniyat', ru: 'Культура', en: 'Culture' },
    leadership: { uz: 'Rahbariyat', ru: 'Руководство', en: 'Leadership' },
    features: { uz: 'Xususiyatlar', ru: 'Особенности', en: 'Features' },
    contact: { uz: 'Telefon', ru: 'Телефон', en: 'Phone' },
    email: { uz: 'Email', ru: 'Email', en: 'Email' },
    address: { uz: 'Manzil', ru: 'Адрес', en: 'Address' }
  };

  const getLangName = () => {
    if (editLang === 'uz') return "O'zbek";
    if (editLang === 'ru') return "Русский";
    return "English";
  };

  const getSectionName = () => {
    const section = sections.find(s => s.id === activeSection);
    if (!section) return '';
    if (editLang === 'uz') return section.name;
    if (editLang === 'ru') return section.nameRu;
    return section.nameEn;
  };

  const handleEdit = (fieldKey) => {
    const value = mobileInfo?.[activeSection]?.[fieldKey]?.[editLang] || '';
    setEditingField(fieldKey);
    setEditValue(value);
  };

  const handleSave = () => {
    if (editingField) {
      updateMobileInfo(activeSection, editingField, editLang, editValue);
      toast.success(`${fieldLabels[editingField][editLang]} yangilandi`);
      setEditingField(null);
      setEditValue('');
    }
  };

  const getFieldValue = (fieldKey) => {
    return mobileInfo?.[activeSection]?.[fieldKey]?.[editLang] || 'Maʼlumot kiritilmagan';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-blue-600 hover:text-blue-700">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <h1 className="text-2xl font-bold">📱 Mobile Info boshqaruvi</h1>
          </div>
          <Link to="/mobile-info" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <i className="fas fa-eye mr-2"></i> Ko'rish
          </Link>
        </div>

        {/* Language Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <i className="fas fa-language text-blue-600"></i>
              <span className="font-medium">Til:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditLang('uz')}
                className={`px-4 py-2 rounded-lg transition ${editLang === 'uz' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                🇺🇿 O'zbek
              </button>
              <button
                onClick={() => setEditLang('ru')}
                className={`px-4 py-2 rounded-lg transition ${editLang === 'ru' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                🇷🇺 Русский
              </button>
              <button
                onClick={() => setEditLang('en')}
                className={`px-4 py-2 rounded-lg transition ${editLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-blue-700">
            <i className="fas fa-info-circle"></i>
            <span className="text-sm">
              Tahrirlash rejimi: <strong>{getLangName()}</strong> tili | 
              Bo'lim: <strong>{getSectionName()}</strong>
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-2 rounded-t-lg transition ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <i className={`fas fa-${section.id === 'jondor' ? 'landmark' : 'globe'} mr-2`}></i>
              {editLang === 'uz' ? section.name : editLang === 'ru' ? section.nameRu : section.nameEn}
            </button>
          ))}
        </div>

        {/* Fields List */}
        <div className="space-y-4">
          {fields[activeSection].map(fieldKey => (
            <div key={fieldKey} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <h3 className="font-bold text-gray-800">
                  <i className="fas fa-edit text-gray-400 mr-2"></i>
                  {fieldLabels[fieldKey][editLang]}
                </h3>
                {editingField === fieldKey ? (
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                      <i className="fas fa-save mr-1"></i> Saqlash
                    </button>
                    <button onClick={() => setEditingField(null)} className="px-3 py-1 bg-gray-300 rounded-lg text-sm hover:bg-gray-400">
                      Bekor
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit(fieldKey)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    <i className="fas fa-edit mr-1"></i> Tahrirlash
                  </button>
                )}
              </div>
              <div className="p-4">
                {editingField === fieldKey ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows="5"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="Matnni kiriting..."
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {getFieldValue(fieldKey)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Save Info */}
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm text-green-700">
            <i className="fas fa-save mr-1"></i> 
            O'zgarishlar avtomatik saqlanadi va localStorage da saqlanadi
          </p>
        </div>
      </div>
    </div>
  );
}