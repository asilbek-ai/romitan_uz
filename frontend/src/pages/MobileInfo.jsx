import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';

export default function MobileInfo() {
  const { topics, lang, setLang } = useContext(AppContext);
  
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [aiLang, setAiLang] = useState('uz');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatEndRef = useRef(null);

  // topics ni tekshirish
  const topicsList = Array.isArray(topics) && topics.length > 0 ? topics : [];

  // Mavzu tanlash
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setShowChat(true);
    setChatMessages([]);
    
    setTimeout(() => {
      const response = topic.description?.[aiLang] || topic.description?.uz || "Ma'lumot mavjud emas";
      const aiMsg = {
        id: Date.now(),
        text: response,
        isUser: false,
        time: new Date().toLocaleTimeString(),
        image: topic.image,
        icon: topic.icon
      };
      setChatMessages([aiMsg]);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedTopic) return;
    
    const userMsg = {
      id: Date.now(),
      text: chatInput,
      isUser: true,
      time: new Date().toLocaleTimeString()
    };
    setChatMessages(prev => [...prev, userMsg]);
    const question = chatInput;
    setChatInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      let response = selectedTopic.description?.[aiLang] || selectedTopic.description?.uz || "Ma'lumot mavjud emas";
      
      if (question.toLowerCase().includes('salom')) {
        response = aiLang === 'uz' ? "Assalomu alaykum! 👋 Sizga qanday yordam bera olaman?" :
                  aiLang === 'ru' ? "Здравствуйте! 👋 Чем могу помочь?" :
                  "Hello! 👋 How can I help you?";
      }
      if (question.toLowerCase().includes('manzil')) {
        response = aiLang === 'uz' ? "Manzil: Jondor tumani, M. Tarobiy ko'chasi, 26" :
                  aiLang === 'ru' ? "Адрес: Джондорский район, ул. М. Таробий, 26" :
                  "Address: Jondor district, M. Tarobiy str., 26";
      }
      if (question.toLowerCase().includes('telefon')) {
        response = aiLang === 'uz' ? "Telefon: +998 65 582-18-53" :
                  aiLang === 'ru' ? "Телефон: +998 65 582-18-53" :
                  "Phone: +998 65 582-18-53";
      }
      
      const aiMsg = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        time: new Date().toLocaleTimeString(),
        image: selectedTopic.image,
        icon: selectedTopic.icon
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Agar topics bo'lmasa
  if (topicsList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-[380px] h-[700px] bg-black rounded-[3rem] shadow-2xl overflow-hidden relative">
        <div className="absolute inset-[3px] bg-gradient-to-b from-blue-50 to-white rounded-[2.7rem] overflow-hidden flex flex-col">
          
          {/* Status Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 pt-3 pb-2 flex justify-between text-xs">
            <span>9:41</span>
            <span>📶 🔋 100%</span>
          </div>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-arrow-left text-sm"></i>
              </Link>
              <div className="flex items-center gap-2">
                <i className="fas fa-mobile-alt"></i>
                <h1 className="font-bold">Jondor AI</h1>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setAiLang('uz')} className={`text-xs px-2 py-1 rounded ${aiLang === 'uz' ? 'bg-white/30' : ''}`}>Uz</button>
                <button onClick={() => setAiLang('ru')} className={`text-xs px-2 py-1 rounded ${aiLang === 'ru' ? 'bg-white/30' : ''}`}>Ru</button>
                <button onClick={() => setAiLang('en')} className={`text-xs px-2 py-1 rounded ${aiLang === 'en' ? 'bg-white/30' : ''}`}>En</button>
              </div>
            </div>
          </div>
          
          {/* AI Avatar */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 py-6 text-white text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-robot text-3xl text-blue-600"></i>
            </div>
            <h2 className="font-bold">Jondor AI Assistant</h2>
            <p className="text-xs opacity-80">3 tilda so'zlashuvchi yordamchi</p>
          </div>
          
          {/* Mavzular */}
          <div className="px-3 py-2 border-b">
            <p className="text-xs text-gray-500 mb-2">📌 Mavzu tanlang:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {topicsList.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition ${
                    selectedTopic?.id === topic.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <i className={`fas ${topic.icon} mr-1 text-xs`}></i>
                  {topic.title?.[aiLang] || topic.title?.uz}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {!showChat ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <i className="fas fa-comment-dots text-4xl mb-3"></i>
                <p className="text-sm">Yuqoridan mavzu tanlang</p>
              </div>
            ) : (
              <>
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`mb-3 ${msg.isUser ? 'flex justify-end' : 'flex justify-start'}`}>
                    {!msg.isUser && msg.image && (
                      <img src={msg.image} className="w-10 h-10 rounded-full object-cover mr-2" alt="" />
                    )}
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      msg.isUser 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white text-gray-800 rounded-bl-sm shadow'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-3">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </>
            )}
          </div>
          
          {/* Input */}
          {showChat && (
            <div className="p-3 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Savol yozing..."
                  className="flex-1 px-3 py-2 border rounded-full text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center"
                >
                  <i className="fas fa-paper-plane text-sm"></i>
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {['Salom', 'Tarix', 'Aholi', 'Manzil', 'Telefon'].map(btn => (
                  <button key={btn} onClick={() => setChatInput(btn)} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Home indicator */}
          <div className="py-2 flex justify-center">
            <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}