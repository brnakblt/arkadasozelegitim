import React, { useState } from "react";

const Team: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Yönetim");

  const categories = [
    "Yönetim",
    "Eğitmenler",
    "Uzmanlar",
    "Danışmanlar",
  ];

  const teamMembers = [
    {
      name: "Dr. Ayşe Yılmaz",
      title: "Merkez Müdürü",
      category: "Yönetim",
      image: "/images/team/member1.jpg", // Bu resimler örnek, gerçek resimleri eklemeniz gerekecek
      specialization: "Çocuk Gelişimi ve Eğitimi Uzmanı",
      description: "20 yıllık deneyim",
    },
    {
      name: "Mehmet Kaya",
      title: "Özel Eğitim Uzmanı",
      category: "Uzmanlar",
      image: "/images/team/member2.jpg",
      specialization: "Davranış ve Gelişim Uzmanı",
      description: "15 yıllık deneyim",
    },
    {
      name: "Zeynep Demir",
      title: "Aile Danışmanı",
      category: "Danışmanlar",
      image: "/images/team/member3.jpg",
      specialization: "Aile ve Çocuk Psikolojisi",
      description: "12 yıllık deneyim",
    },
    {
      name: "Ali Can",
      title: "Özel Eğitim Öğretmeni",
      category: "Eğitmenler",
      image: "/images/team/member4.jpg",
      specialization: "Özel Gereksinimli Çocuklar Eğitimi",
      description: "8 yıllık deneyim",
    },
  ];

  const filteredMembers = teamMembers.filter(
    (member) => member.category === activeCategory
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

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-w-1 aspect-h-1 mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-2xl"
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
                <div className="flex justify-center space-x-4 mt-4">
                  <button className="text-neutral-dark/60 hover:text-primary transition-colors duration-200">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm5.75 8.75v1.5h-1.5v-1.5h1.5zm-10 0v1.5h-1.5v-1.5h1.5zm7.5 6.5h-6.5v-1.5h6.5v1.5z" />
                    </svg>
                  </button>
                  <button className="text-neutral-dark/60 hover:text-primary transition-colors duration-200">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default Team;
