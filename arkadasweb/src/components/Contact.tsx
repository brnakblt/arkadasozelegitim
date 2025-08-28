import React, { useState } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" });
    alert("Mesajınız için teşekkürler! En kısa sürede size dönüş yapacağız.");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="pt-20 bg-neutral-dark relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Background Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        <path
          d="M0 250C200 100 400 700 600 400C800 100 1000 700 1000 400V1000H0V250Z"
          fill="url(#contactGradient)"
        />
        <defs>
          <linearGradient
            id="contactGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#7CB342" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-secondary font-body font-semibold text-sm uppercase tracking-wider">
            İletişim
          </span>
          <h2
            id="contact-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-6"
          >
            Bizimle İletişime
            <span className="text-secondary block">Geçin</span>
          </h2>
          <p className="font-body text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Çocuğunuzun eğitim yolculuğuna başlamak için bugün bizimle iletişime
            geçin. Uzman ekibimiz size yardımcı olmak için burada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 card-shadow">
            <h3 className="font-display text-2xl font-bold text-neutral-dark mb-6">
              Bize Mesaj Gönderin
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-body font-medium text-neutral-dark mb-2"
                  >
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-body"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-body font-medium text-neutral-dark mb-2"
                  >
                    E-posta Adresi *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-body"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block font-body font-medium text-neutral-dark mb-2"
                >
                  Telefon Numarası
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-body"
                  placeholder="0555 123 45 67"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-body font-medium text-neutral-dark mb-2"
                >
                  Mesajınız *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-body resize-none"
                  placeholder="Çocuğunuzun durumu ve ihtiyaçları hakkında bize bilgi verin..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-body font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
              >
                Mesaj Gönder
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <h3 className="font-display text-2xl font-bold text-white mb-6">
                İletişim Bilgileri
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-white mb-1">
                      E-posta
                    </h4>
                    <p className="font-body text-white/80">
                      info@arkadasozelegitim.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-white mb-1">
                      Telefon
                    </h4>
                    <p className="font-body text-white/80">0555 123 45 67</p>
                    <p className="font-body text-white/60 text-sm">
                      WhatsApp mevcut
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-white mb-1">
                      Adres
                    </h4>
                    <p className="font-body text-white/80">
                      Örnek Mahallesi
                      <br />
                      Arkadaş Sokak No: 123
                      <br />
                      İstanbul, Türkiye
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <h3 className="font-display text-2xl font-bold text-white mb-6">
                Çalışma Saatleri
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-body text-white/80">
                    Pazartesi - Cuma
                  </span>
                  <span className="font-body font-semibold text-white">
                    09:00 - 18:00
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-white/80">Cumartesi</span>
                  <span className="font-body font-semibold text-white">
                    09:00 - 16:00
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-white/80">Pazar</span>
                  <span className="font-body font-semibold text-white">
                    Kapalı
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <h3 className="font-display text-2xl font-bold text-white mb-6">
                Acil Durum
              </h3>

              <p className="font-body text-white/80 mb-4">
                Acil durumlar için 7/24 ulaşabileceğiniz telefon hattımız:
              </p>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span className="font-body font-semibold text-white text-lg">
                  0555 987 65 43
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
