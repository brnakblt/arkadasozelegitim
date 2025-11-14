import React, { useState, useEffect } from "react";

const STRAPI_URL = "http://localhost:1337";

interface InstagramPost {
  id: string;
  media_url: string;
  caption: string;
  permalink: string;
}

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sanitizeUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return "";
  };

  useEffect(() => {
    const fetchInstagramFeed = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${STRAPI_URL}/api/instagram-feed`);
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram feed');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch Instagram feed:", err);
        setError("Instagram akışı yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramFeed();
  }, []);

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-white text-center">
        <p className="font-body text-lg text-neutral-dark/80">Yükleniyor...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className="py-20 bg-white text-center text-red-600">
        <p className="font-body text-lg">{error}</p>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-body font-semibold text-sm uppercase tracking-wider">
            Galeri
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark mt-4 mb-6">
            Instagram
            <span className="text-gradient block">Akışımız</span>
          </h2>
          <p className="font-body text-lg text-neutral-dark/80 max-w-3xl mx-auto leading-relaxed">
            En son gönderilerimize göz atın ve bizi Instagram'da takip edin.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <a
              key={post.id}
              href={sanitizeUrl(post.permalink)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl cursor-pointer transform transition-all duration-500 hover:scale-105"
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={sanitizeUrl(post.media_url)}
                  alt={post.caption}
                  loading="lazy"
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ width: "100%", height: "256px" }}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="font-body text-sm clamp-3">{post.caption}</p>
                </div>
              </div>
            </a>
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