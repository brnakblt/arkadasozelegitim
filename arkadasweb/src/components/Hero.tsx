import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/1.jpg"
          alt="Arkadaş Özel Eğitim ve Rehabilitasyon Merkezi - Özel eğitim sınıfı, çocuklar öğreniyor, destekleyici eğitim ortamı"
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%' }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20"></div>
      </div>

      {/* Curved Overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-full">
        <div className="relative w-full h-full">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="-150 0 400 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0C150 100 200 300 100 400C50 500 150 600 200 800H400V0H0Z"
              fill="url(#heroGradient)"
              fillOpacity="0.3"
            />
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#A5D6A7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Her Çocuk
              <span className="block text-secondary">Özel ve Değerli</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
              Özel eğitim ve rehabilitasyon alanında uzman kadromuzla, her çocuğun 
              potansiyelini keşfetmesi ve gelişmesi için bireysel eğitim programları sunuyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-secondary text-white px-8 py-4 rounded-full font-body font-semibold hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105"
              >
                Randevu Alın
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-4 rounded-full font-body font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                Daha Fazla Bilgi
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="text-3xl font-display font-bold text-secondary mb-2">500+</div>
                <div className="font-body text-neutral-dark/80">Başarılı Öğrenci</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="text-3xl font-display font-bold text-secondary mb-2">15+</div>
                <div className="font-body text-neutral-dark/80">Yıl Deneyim</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="text-3xl font-display font-bold text-secondary mb-2">98%</div>
                <div className="font-body text-neutral-dark/80">Aile Memnuniyeti</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="text-3xl font-display font-bold text-secondary mb-2">24/7</div>
                <div className="font-body text-neutral-dark/80">Destek Hattı</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
