import React from "react";

const Process: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "İlk Görüşme ve Değerlendirme",
      description:
        "Çocuğunuzla tanışır, aile görüşmesi yapar ve kapsamlı bir değerlendirme süreci başlatırız.",
      icon: "👥",
    },
    {
      number: "02",
      title: "Bireysel Eğitim Planı",
      description:
        "Değerlendirme sonuçlarına göre çocuğunuza özel bireysel eğitim programı hazırlarız.",
      icon: "📋",
    },
    {
      number: "03",
      title: "Eğitim Sürecinin Başlatılması",
      description:
        "Uzman öğretmenlerimiz ve terapistlerimizle bireysel eğitim seanslarına başlarız.",
      icon: "🎯",
    },
    {
      number: "04",
      title: "Aile Eğitimi ve Danışmanlık",
      description:
        "Ailelere evde uygulayabilecekleri stratejiler ve destek programları sağlarız.",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      number: "05",
      title: "Düzenli Takip ve Değerlendirme",
      description:
        "Çocuğunuzun gelişimini düzenli olarak takip eder, programı güncelleriz.",
      icon: "📊",
    },
    {
      number: "06",
      title: "Sürekli Destek",
      description:
        "Eğitim süreci boyunca ve sonrasında sürekli destek ve danışmanlık hizmeti veriyoruz.",
      icon: "🤝",
    },
  ];

  return (
    <section
      id="process"
      className="py-20 bg-white relative overflow-hidden"
      aria-labelledby="process-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-body font-semibold text-sm uppercase tracking-wider">
            Sürecimiz
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark mt-4 mb-6">
            Nasıl
            <span className="text-gradient block">Çalışıyoruz</span>
          </h2>
          <p className="font-body text-lg text-neutral-dark/80 max-w-3xl mx-auto leading-relaxed">
            Kanıta dayalı yöntemlerimiz ve sistematik yaklaşımımızla her çocuğun
            bireysel gelişim sürecini titizlikle planlıyor ve uyguluyoruz.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Sharp S-shaped path with prominent arrows */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
              {/* Connection lines (subtle) */}
              <line
                x1="200"
                y1="150"
                x2="600"
                y2="150"
                stroke="#7CB342"
                strokeWidth="2"
                strokeDasharray="4,2"
                opacity="0.4"
              />
              <line
                x1="600"
                y1="150"
                x2="1000"
                y2="150"
                stroke="#7CB342"
                strokeWidth="2"
                strokeDasharray="4,2"
                opacity="0.4"
              />
              <line
                x1="1000"
                y1="150"
                x2="1000"
                y2="300"
                stroke="#A5D6A7"
                strokeWidth="2"
                strokeDasharray="4,2"
                opacity="0.4"
              />
              <line
                x1="1000"
                y1="300"
                x2="200"
                y2="300"
                stroke="#A5D6A7"
                strokeWidth="2"
                strokeDasharray="4,2"
                opacity="0.4"
              />
              <line
                x1="200"
                y1="300"
                x2="200"
                y2="450"
                stroke="#F4A261"
                strokeWidth="2"
                strokeDasharray="4,2"
                opacity="0.4"
              />
              <line
                x1="200"
                y1="450"
                x2="600"
                y2="450"
                stroke="#F4A261"
                strokeWidth="2"
                strokeDasharray="4,2"
                opacity="0.4"
              />
              <line
                x1="600"
                y1="450"
                x2="1000"
                y2="450"
                stroke="#F4A261"
                strokeWidth="2"
                strokeDasharray="4,2"
                opacity="0.4"
              />

              {/* Connection dots */}
              <circle
                cx="200"
                cy="150"
                r="4"
                fill="#7CB342"
                className="animate-pulse"
              />
              <circle
                cx="600"
                cy="150"
                r="4"
                fill="#7CB342"
                className="animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <circle
                cx="1000"
                cy="150"
                r="4"
                fill="#7CB342"
                className="animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <circle
                cx="200"
                cy="450"
                r="4"
                fill="#F4A261"
                className="animate-pulse"
                style={{ animationDelay: "1.5s" }}
              />
              <circle
                cx="600"
                cy="450"
                r="4"
                fill="#F4A261"
                className="animate-pulse"
                style={{ animationDelay: "2s" }}
              />
              <circle
                cx="1000"
                cy="450"
                r="4"
                fill="#F4A261"
                className="animate-pulse"
                style={{ animationDelay: "2.5s" }}
              />
              <circle cx="1000" cy="300" r="3" fill="#A5D6A7" />
              <circle cx="200" cy="300" r="3" fill="#A5D6A7" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-x-16 lg:gap-y-20 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 card-shadow hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Step Number - Centered at top */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-20">
                  <span className="font-display font-bold text-white text-xl">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="text-5xl mb-6 mt-10 text-center filter drop-shadow-lg">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-neutral-dark mb-4 group-hover:text-primary transition-colors duration-300 text-center">
                  {step.title}
                </h3>

                <p className="font-body text-neutral-dark/80 leading-relaxed text-center">
                  {step.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-secondary/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 card-shadow">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-white flex items-center justify-center"
                >
                  <span className="text-white font-body font-semibold text-sm">
                    {i}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-neutral-dark">
                Başlamaya hazır mısınız?
              </div>
              <div className="font-body text-sm text-neutral-dark/70">
                500+ mutlu aileye katılın
              </div>
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-primary text-white px-6 py-3 rounded-full font-body font-semibold hover:bg-primary/90 transition-colors duration-300"
            >
              Hemen Başlayın
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
