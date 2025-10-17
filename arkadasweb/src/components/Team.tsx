import React, { useState } from "react";

const Team: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const categories = [
    "Yönetim",
    "Eğitim Danışmanı",
    "Psikolog",
    "Dil ve Konuşma Terapisti",
    "Öğretmen",
    "Fizyoterapist",
    "Halkla İlişkiler",
    "Şoför",
    "Temizlik Personeli",
  ];

  const teamMembers = [
    {
      name: "Psk. Halil Çetinkaya",
      title: "Merkez Müdürü",
      category: ["Yönetim"],
      image: "/images/Profil Fotoğrafları/halilcetinkaya.webp",
      specialization: "Çocuk Gelişimi ve Eğitimi Uzmanı",
      description: "20 yıllık deneyim",
      objectPosition: "center",
    },
    {
      name: "Prof. Yusuf Ziya Tavil",
      title: "Özel Eğitim Uzmanı",
      category: ["Eğitim Danışmanı"],
      image: "/images/Profil Fotoğrafları/yusufziyatavil.webp",
      specialization: "Davranış ve Gelişim Uzmanı",
      description: "15 yıllık deneyim",
      objectPosition: "50% 30%", // Yatayda ortalı, dikeyde %30 (biraz yukarı)
    },
    {
      name: "Psk. Damla Mercan",
      title: "Psikolog",
      category: ["Psikolog"],
      image: "/images/Profil Fotoğrafları/damlamercan.webp",
      specialization: "Çocuk ve Ergen Psikolojisi",
      description: "10 yıllık deneyim",
      objectPosition: "center",
    },
    {
      name: "Ahmet Sait Kurt",
      title: "Dil ve Konuşma Terapisti",
      category: ["Dil Ve Konuşma Terapisti"],
      image: "/images/Profil Fotoğrafları/ahmetsaitkurt.webp",
      specialization: "Dil ve Konuşma Bozuklukları",
      description: "5 yıllık deneyim",
      objectPosition: "center",
    },
    {
      name: "Ömür Mutlu",
      title: "Fizyoterapist",
      category: ["Fizyoterapist"],
      image: "/images/Profil Fotoğrafları/omurmutlu.webp",
      specialization: "Pediatrik Fizyoterapi",
      description: "7 yıllık deneyim",
      objectPosition: "center",
    },
    {
      name: "Psk. Gaye Nur Yıldız",
      title: "Aile Danışmanı",
      category: ["Danışmanlar", "Psikolog"],
      image: "/images/4.webp", // Bu resim yolu güncellenecek
      specialization: "Aile ve Çocuk Psikolojisi",
      description: "12 yıllık deneyim",
      objectPosition: "center",
    },
    {
      name: "Ali Can",
      title: "Özel Eğitim Öğretmeni",
      category: ["Özel Eğitim Alanı Öğretmeni"],
      image: "/images/5.webp", // Bu resim yolu güncellenecek
      specialization: "Özel Gereksinimli Çocuklar Eğitimi",
      description: "8 yıllık deneyim",
      objectPosition: "center",
    },
  ];

  const filteredMembers = useMemo(
    () =>
      activeCategory === "Tümü"
        ? teamMembers.slice(0, 8)
        : teamMembers.filter((member) =>
            member.category.includes(activeCategory)
          ),
    [activeCategory, teamMembers]
  );

  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-body font-semibold text-sm uppercase tracking-wider">
            Ekibimiz
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark mt-4 mb-6">
            Uzman
            <span className="text-gradient block">Kadromuz</span>
          </h2>
          <p className="font-body text-lg text-neutral-dark/80 max-w-3xl mx-auto leading-relaxed">
            Alanında uzman ve deneyimli ekibimizle öğrencilerimize en iyi
            eğitimi sunuyoruz.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-nowrap overflow-x-auto gap-4 mb-12 py-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-body font-medium transition-all duration-300 whitespace-nowrap ${
                activeCategory === category
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-neutral-dark hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredMembers.map((member) => (
            <div
              key={member.name}
              className="group relative overflow-hidden bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative z-20">
                <div className="w-56 h-56 mx-auto mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-2xl"
                    style={{ objectPosition: member.objectPosition || "center" }}
                  />
                </div>

                <div className="text-center">
                  <h3 className="font-display text-xl font-bold text-neutral-dark mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-body font-medium text-sm mb-2">
                    {member.title}
                  </p>
                  <p className="text-neutral-dark/70 font-body text-sm mb-2">
                    {member.specialization}
                  </p>
                  <p className="text-neutral-dark/60 font-body text-xs">
                    {member.description}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4 mt-4"></div>
                </div>
              </div>

              {/* Gradient Hover Effect */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-secondary/40 to-transparent transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 z-10"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;