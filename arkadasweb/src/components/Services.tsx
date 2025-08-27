import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faComments, faBrain } from '@fortawesome/free-solid-svg-icons';

const Services: React.FC = () => {
  const services = [
    {
      icon: faComments,
      title: 'Dil ve Konuşma Terapisi',
      description: 'Dil ve konuşma bozuklukları olan çocuklar için bireysel terapi programları ve aile eğitimi.',
      features: ['Artikülasyon Terapisi', 'Dil Gelişimi', 'Sosyal İletişim', 'Aile Danışmanlığı']
    },
    {
      icon: faBrain,
      title: 'Özel Eğitim Programları',
      description: 'Özel gereksinimli çocuklar için bireysel eğitim planları ve akademik destek programları.',
      features: ['Bireysel Eğitim Planı', 'Akademik Beceriler', 'Sosyal Beceriler', 'Günlük Yaşam Becerileri']
    },
    {
      icon: faUsers,
      title: 'Rehabilitasyon Hizmetleri',
      description: 'Fiziksel ve bilişsel rehabilitasyon programları ile çocukların gelişimini destekleme.',
      features: ['Fizyoterapi', 'Ergoterapisi', 'Bilişsel Rehabilitasyon', 'Oyun Terapisi']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden" aria-labelledby="services-heading">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-primary rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-accent rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border-2 border-secondary rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-body font-semibold text-sm uppercase tracking-wider">
            Hizmetlerimiz
          </span>
          <h2 id="services-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark mt-4 mb-6">
            Çocuğunuz İçin
            <span className="text-gradient block">En İyi Hizmetler</span>
          </h2>
          <p className="font-body text-lg text-neutral-dark/80 max-w-3xl mx-auto leading-relaxed">
            Uzman kadromuz ve kanıta dayalı yöntemlerimizle, her çocuğun bireysel 
            ihtiyaçlarına uygun özel eğitim ve rehabilitasyon hizmetleri sunuyoruz.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 card-shadow hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <FontAwesomeIcon 
                    icon={service.icon} 
                    className="text-2xl text-primary group-hover:text-white transition-colors duration-500"
                  />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-neutral-dark mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="font-body text-neutral-dark/80 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                      <span className="font-body text-sm text-neutral-dark/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className="font-body text-primary font-semibold text-sm hover:text-primary/80 transition-colors duration-200 flex items-center space-x-2 group">
                    <span>Detayları Görün</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white">
            <h3 className="font-display text-2xl font-bold mb-4">
              Çocuğunuzun Gelişimi İçin Hemen Başlayın
            </h3>
            <p className="font-body text-white/90 mb-6 max-w-2xl mx-auto">
              Uzman ekibimizle tanışın ve çocuğunuzun bireysel ihtiyaçlarına uygun 
              eğitim programını birlikte belirleyelim.
            </p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-primary px-8 py-4 rounded-full font-body font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Ücretsiz Değerlendirme
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;