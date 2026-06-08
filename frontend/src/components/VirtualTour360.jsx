import React, { useState, useEffect } from 'react';

export default function VirtualTour360() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Jondor tumani 360° virtual tour URL
  const tourUrl = "https://tour.panoee.net/iframe/6969e1494b80a0573672649b";

  const toggleFullscreen = () => {
    const container = document.getElementById('tour-container');
    if (!isFullscreen) {
      if (container?.requestFullscreen) {
        container.requestFullscreen();
      } else if (container?.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container?.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Video Background - ENDI YORQIN */}
      <video 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.85 }}
        src="https://media.istockphoto.com/id/1642903124/video/bukhara-uzbekistan-poi-kalan-mosque-and-citadele-ark-of-bukhara.mp4?p=1&s=mp4-640x640-is&k=20&c=hB4j4RhCLq2Hn_lBo5Im6-7bFBnHod-_1-a6XT8FpvY=" 
        autoPlay 
        loop 
        muted
        playsInline
      />
      
      {/* Yengil gradient overlay - videoni matn bilan yaxshiroq uyg'unlashtirish uchun */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-indigo-100/20 pointer-events-none"></div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-blue-100">
            <i className="text-blue-500 fas fa-vr-cardboard text-sm"></i>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">360° Tajriba</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
            Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">360°</span> Ekskursiya
          </h2>
          <div className="w-24 h-1 mx-auto mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-700">
            Virtual sayohat orqali <span className="font-semibold text-blue-600">Romitan tumanini</span> kashf eting. 
            Erkin harakatlaning va tumanimizni ajoyib tafsilotlarda kuzating.
          </p>
        </div>

        {/* 360° Viewer Container */}
        <div className="max-w-6xl mx-auto overflow-hidden bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/50">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {!isLoaded && !iframeError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                  <p className="text-gray-500">360° ekskursiya yuklanmoqda...</p>
                </div>
              </div>
            )}
            
            {iframeError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center p-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-3xl text-blue-500"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Virtual tur vaqtincha ishlamayapti</h3>
                  <p className="text-gray-500 max-w-md">Texnik ishlar olib borilmoqda. Tez orada ajoyib 360° tajriba sizni kutib oladi.</p>
                  <button 
                    onClick={() => {
                      setIframeError(false);
                      setIsLoaded(false);
                    }}
                    className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Qayta urinish
                  </button>
                </div>
              </div>
            ) : (
              <iframe 
                id="tour-container"
                title="Romitan 360° Virtual Tour" 
                src={tourUrl} 
                className="absolute top-0 left-0 w-full h-full" 
                frameBorder="0" 
                scrolling="no" 
                allow="vr; xr; accelerometer; gyroscope; autoplay; fullscreen" 
                allowFullScreen
                onLoad={() => setIsLoaded(true)}
                onError={() => setIframeError(true)}
              />
            )}
          </div>

          {/* Controls Bar */}
          <div className="p-4 border-t border-white/30 bg-white/60 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                  <i className="fas fa-mobile-alt"></i>
                  <span>Mobil qurilmalar uchun</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  <i className="fas fa-arrows-alt"></i>
                  <span>Harakat faollashtirilgan</span>
                </div>
              </div>
              <button 
                onClick={toggleFullscreen}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
              >
                <i className="fas fa-expand"></i>
                <span>To'liq ekran rejimi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="p-4 mt-8 text-center rounded-lg bg-white/70 backdrop-blur-sm border border-blue-100">
          <p className="text-sm text-gray-700">
            <i className="mr-2 fas fa-info-circle text-blue-500"></i>
            Ekskursiya davomida sichqoncha yoki barmoq bilan suring, zoom qilish uchun ikki marta bosing
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}