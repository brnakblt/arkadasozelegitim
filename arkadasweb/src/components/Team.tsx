import React, { useState, useMemo, useEffect, useCallback } from "react";

const Team: React.FC = () => {
  interface TeamMember {
    id: number; // Strapi'den gelen her öğenin bir ID'si olur
    name: string;
    title: string;
    category: string[]; // Strapi'den JSON olarak gelecek
    image: { url: string; alternativeText?: string }; // Strapi Media yapısı
    specialization: string;
    description: string;
    objectPosition?: string;
  }
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STRAPI_URL = "http://localhost:1337"; // Strapi sunucunuzun adresi

  const fetchTeamMembers = useCallback(async () => {
    const defaultCategories = [
      "Yönetim",
      "Eğitim Danışmanı",
      "Psikolog",
      "Danışmanlar",
      "Dil ve Konuşma Terapisti",
      "Öğretmen",
      "Fizyoterapist",
    ];
    try {
      setLoading(true);
      const response = await fetch(`${STRAPI_URL}/api/team-members?populate=image&sort=order:asc`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const formattedMembers: TeamMember[] = data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        title: item.title,
        category: item.category || [],
        image: {
          url: item.image?.url
            ? `${STRAPI_URL}${item.image.url}`
            : "/images/placeholder.webp",
          alternativeText: item.image?.alternativeText || item.name,
        },
        specialization: item.specialization,
        description: item.description,
        objectPosition: item.objectPosition || "center",
      }));
      setTeamMembers(formattedMembers);

      const uniqueCategories = [
        ...new Set(formattedMembers.flatMap((member) => member.category)),
      ];
      // Remove "Tümü" and ensure categories are unique and valid
      setCategories([...defaultCategories, ...uniqueCategories].filter((value, index, self) => self.indexOf(value) === index && value));
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      setError("Ekip üyeleri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [STRAPI_URL]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const filteredMembers = useMemo(() => {
    if (!activeCategory) {
      return teamMembers.slice(0, 8);
    }
    return teamMembers.filter(
      (member) => member.category && member.category.includes(activeCategory)
    );
  }, [activeCategory, teamMembers]);

  if (loading) {
    return (
      <section id="team" className="py-20 bg-gray-50 text-center">
        <p className="font-body text-lg text-neutral-dark/80">Yükleniyor...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="team" className="py-20 bg-gray-50 text-center text-red-600">
        <p className="font-body text-lg">{error}</p>
      </section>
    );
  }

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
              key={member.id}
              className="group relative overflow-hidden bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative z-20">
                <div className="w-56 h-56 mx-auto mb-6 rounded-2xl overflow-hidden">
                  <img
                    src={member.image.url}
                    alt={member.image.alternativeText || member.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-2xl"
                    style={{
                      objectPosition: member.objectPosition || "center",
                    }}
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
