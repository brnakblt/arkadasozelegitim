import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-neutral-dark text-white relative overflow-hidden" role="contentinfo">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full">
        <svg className="w-full h-12" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none">
          <path
            d="M0 0C200 50 400 0 600 30C800 60 1000 20 1000 0V100H0V0Z"
            fill="currentColor"
            className="text-white"
          />
        </svg>
      </div>

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Logo size="lg" className="mb-4" />
              <p className="font-body text-white/80 mb-6 leading-relaxed max-w-md">
                2009 yılından bu yana özel eğitim alanında hizmet veren merkezimiz, 
                özel gereksinimli çocukların eğitim ve rehabilitasyon süreçlerinde 
                ailelerin yanında olmaktadır.
              </p>
              
              {/* Newsletter Signup */}
              <div className="mb-6">
                <h3 className="font-body font-semibold text-white mb-3">
                  Haberdar Olun
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary font-body"
                  />
                  <button className="bg-secondary text-white px-6 py-3 rounded-xl font-body font-semibold hover:bg-secondary/90 transition-colors duration-300">
                    Abone Ol
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-4">
                Hızlı Linkler
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Ana Sayfa', id: 'home' },
                  { name: 'Hakkımızda', id: 'about' },
                  { name: 'Hizmetlerimiz', id: 'services' },
                  { name: 'Sürecimiz', id: 'process' },
                  { name: 'Galeri', id: 'gallery' },
                  { name: 'İletişim', id: 'contact' }
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="font-body text-white/80 hover:text-secondary transition-colors duration-200"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-4">
                İletişim Bilgileri
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-secondary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-body text-white/80 text-sm">info@arkadasozelegitim.com</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-secondary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <span className="font-body text-white/80 text-sm">0555 123 45 67</span>
                    <div className="font-body text-white/60 text-xs">WhatsApp mevcut</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-secondary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-body text-white/80 text-sm">
                    Örnek Mahallesi<br />
                    Arkadaş Sokak No: 123<br />
                    İstanbul, Türkiye
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <h4 className="font-body font-semibold text-white mb-3">Bizi Takip Edin</h4>
                <div className="flex space-x-3">
                  {[
                    { name: 'Facebook', icon: 'F' },
                    { name: 'Instagram', icon: 'I' },
                    { name: 'WhatsApp', icon: 'W' },
                    { name: 'YouTube', icon: 'Y' }
                  ].map((social) => (
                    <button
                      key={social.name}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors duration-300"
                      aria-label={social.name}
                    >
                      <span className="font-body font-semibold text-sm">{social.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="font-body text-white/60 text-sm">
                © 2024 Arkadaş Özel Eğitim ve Rehabilitasyon Merkezi. Tüm hakları saklıdır.
              </div>
              
              <div className="flex flex-wrap gap-6">
                {['Gizlilik Politikası', 'Kullanım Şartları', 'Çerez Politikası'].map((link) => (
                  <button
                    key={link}
                    className="font-body text-white/60 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => scrollToSection('home')}
        className="fixed bottom-8 right-8 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-110 z-40"
        aria-label="Başa dön"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;