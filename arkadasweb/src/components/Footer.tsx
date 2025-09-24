import React, { useState, useEffect } from "react";

const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Get the current scroll position and target position
      const start = window.pageYOffset || document.documentElement.scrollTop;
      const target = element.getBoundingClientRect().top + start;

      // Calculate scroll duration based on distance
      const distance = Math.abs(start - target);
      const scrollDuration = Math.min(2000, Math.max(1500, distance * 1.5));

      // Start scrolling immediately
      element.scrollIntoView({ behavior: "smooth" });

      // Wait for scroll to almost complete before starting fade animation
      setTimeout(() => {
        setIsScrolling(true);

        // Keep the button hidden for fade animation duration
        setTimeout(() => {
          setIsScrolling(false);
        }, 800); // Match the fade-out animation duration
      }, scrollDuration - 200); // Start fade slightly before scroll ends
    }
  };

  return (
    <footer
      className="bg-neutral-dark text-white relative overflow-hidden"
      role="contentinfo"
    >
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full">
        <svg
          className="w-full h-12"
          viewBox="0 0 1000 100"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0C200 50 400 0 600 30C800 60 1000 20 1000 0V100H0V0Z"
            fill="currentColor"
            className="text-neutral-dark"
          />
        </svg>
      </div>

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Newsletter Section */}
            <div className="lg:col-span-2">
              <p className="font-body text-white/80 mb-6 leading-relaxed max-w-md">
                2009 yılından bu yana özel eğitim alanında hizmet veren
                merkezimiz, özel gereksinimli çocukların eğitim ve
                rehabilitasyon süreçlerinde ailelerin yanında olmaktadır.
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
                  { name: "Ana Sayfa", id: "home" },
                  { name: "Hakkımızda", id: "about" },
                  { name: "Hizmetlerimiz", id: "services" },
                  { name: "Sürecimiz", id: "process" },
                  { name: "Galeri", id: "gallery" },
                  { name: "İletişim", id: "contact" },
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
                  <svg
                    className="w-5 h-5 text-secondary mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-body text-white/80 text-sm">
                    info@arkadasozelegitim.com
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-secondary mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <span className="font-body text-white/80 text-sm">
                      0555 123 45 67
                    </span>
                    <div className="font-body text-white/60 text-xs">
                      WhatsApp mevcut
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-secondary mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-body text-white/80 text-sm">
                    Örnek Mahallesi
                    <br />
                    Arkadaş Sokak No: 123
                    <br />
                    İstanbul, Türkiye
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <h4 className="font-body font-semibold text-white mb-3">
                  Bizi Takip Edin
                </h4>
                <div className="flex space-x-3">
                  {[
                    {
                      name: "Facebook",
                      href: "https://facebook.com/arkadasozelegitim",
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      ),
                    },
                    {
                      name: "Instagram",
                      href: "https://instagram.com/arkadasozelegitim",
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                        </svg>
                      ),
                    },
                    {
                      name: "WhatsApp",
                      href: "https://wa.me/905068103321",
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      ),
                    },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors duration-300"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="font-body text-white/60 text-sm">
                © 2024 Tüm hakları saklıdır.
              </div>

              <div className="flex flex-wrap gap-6">
                {[
                  "Gizlilik Politikası",
                  "Kullanım Şartları",
                  "Çerez Politikası",
                ].map((link) => (
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

      {/* Fixed Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/905068103321"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20bd5a] transition-all duration-300 transform hover:scale-110 ${
            !showBackToTop ? "mb-0" : "mb-4"
          }`}
          aria-label="WhatsApp ile iletişime geç"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

        {/* Back to Top Button */}
        {showBackToTop && !isScrolling && (
          <button
            onClick={() => scrollToSection("home")}
            className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-110 opacity-100 animate-fade-in"
            aria-label="Başa dön"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
