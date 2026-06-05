import { useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function HeroSlider() {
  const { t, adminData } = useContext(AppContext);

  const slides = adminData.carousel.length > 0 ? adminData.carousel : [
    { id: 1, image: "https://images.pexels.com/photos/154801/pexels-photo-154801.jpeg?w=1600", title: "Jondor tumaniga xush kelibsiz", titleRu: "Добро пожаловать в Джондорский район" }
  ];

  return (
    <div className="relative h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <img src={slide.image} alt={slide.title} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="px-4 text-center text-white">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-4 text-4xl font-bold md:text-7xl"
                  >
                    {t(slide.title, slide.titleRu)}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-8 text-xl md:text-2xl"
                  >
                    {t('Jondor tumani rasmiy portali', 'Официальный портал Джондорского района')}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Link to="/services">
                      <button className="px-8 py-3 font-semibold text-white transition rounded-full bg-primary hover:bg-primaryLight">
                        <i className="mr-2 fas fa-th-large"></i> {t('Xizmatlar', 'Услуги')}
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}