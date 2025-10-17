import React, { useState } from "react";

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      src: "/images/1.webp",
      alt: "Arkadaş Özel Eğitim ve Rehabilitasyon Merkezi - Uzman eğitmenler ile bireysel çalışmalar",
      title: "Bireysel Çalışmalar",
      category: "Eğitim",
    },
    {
      src: "/images/2.webp",
      alt: "Arkadaş Özel Eğitim Merkezi - Modern özel eğitim sınıfları, çocuklar öğreniyor, destekleyici eğitim ortamı",
      title: "Özel Eğitim Sınıfları",
      category: "Eğitim",
    },
    {
      src: "/images/3.webp",
      alt: "Arkadaş Özel Eğitim Merkezi - Eğitici aktiviteler, renkli öğrenme materyalleri, interaktif öğrenme",
      title: "Eğitici Aktiviteler",
      category: "Sosyal Aktivite",
    },
    {
      src: "/images/4.webp",
      alt: "Arkadaş Özel Eğitim Merkezi - Bireyselleştirilmiş eğitim çalışmaları",
      title: "Bireysel Eğitim",
      category: "Eğitim",
    },
    {
      src: "/images/5.webp",
      alt: "Arkadaş Özel Eğitim Merkezi - Grup çalışmaları, sosyal beceri geliştirme, çocuklar birlikte öğreniyor",
      title: "Grup Çalışmaları",
      category: "Sosyal Aktivite",
    },
    {
      src: "/images/6.webp",
      alt: "Arkadaş Özel Eğitim Merkezi - Aile danışmanlığı ve rehberlik hizmetleri",
      title: "Aile Danışmanlığı",
      category: "Danışmanlık",
    },
  ];

  const categories = ["Hepsi", "Eğitim", "Sosyal Aktivite", "Danışmanlık"];
  const [activeCategory, setActiveCategory] = useState("Hepsi");

  const filteredImages =
    activeCategory === "Hepsi"
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-body font-semibold text-sm uppercase tracking-wider">
            Galeri
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark mt-4 mb-6">
            Merkezimizden
            <span className="text-gradient block">Kareler</span>
          </h2>
          <p className="font-body text-lg text-neutral-dark/80 max-w-3xl mx-auto leading-relaxed">
            Özel eğitim ve rehabilitasyon merkezimizde gerçekleştirdiğimiz
            çalışmalardan ve mutlu anlardan kareler.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-body font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-neutral-dark hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image) => (
            <div
              key={image.src}
              className="group relative overflow-hidden rounded-3xl cursor-pointer transform transition-all duration-500 hover:scale-105"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ width: "100%", height: "256px" }}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-xs font-body font-medium text-secondary mb-2 uppercase tracking-wider">
                    {image.category}
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">
                    {image.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-body">Detayları Görün</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center justify-center">
                <span className="text-xs font-body font-medium text-neutral-dark">
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Gallery image"
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="font-body text-neutral-dark/80 mb-6">
            Merkezimizi ziyaret etmek ve daha fazla bilgi almak ister misiniz?
          </p>
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-primary text-white px-8 py-4 rounded-full font-body font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
          >
            Randevu Alın
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
