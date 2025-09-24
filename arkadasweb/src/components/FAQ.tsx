import React, { useState } from "react";

const FAQ: React.FC = () => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const faqs = [
    {
      question: "Hangi yaş gruplarına hizmet veriyorsunuz?",
      answer:
        "0-18 yaş arası tüm çocuklara hizmet veriyoruz. Erken müdahale programlarından okul çağı destek eğitimlerine kadar geniş bir yaş yelpazesinde uzmanlaşmış hizmetler sunuyoruz.",
    },
    {
      question: "Özel eğitim süreci nasıl başlıyor?",
      answer:
        "İlk olarak ailemizle görüşme yapıyor, çocuğunuzun ihtiyaçlarını değerlendiriyoruz. Ardından kapsamlı bir değerlendirme süreci başlatıyor ve bireysel eğitim planı hazırlıyoruz. Tüm süreç ailenin aktif katılımıyla gerçekleşir.",
    },
    {
      question: "Hangi alanlarda uzmanlaşmış hizmet veriyorsunuz?",
      answer:
        "Dil ve konuşma terapisi, özel eğitim, fizyoterapi, ergoterapisi, oyun terapisi ve aile danışmanlığı alanlarında uzman kadromuzla hizmet veriyoruz. Her çocuğun bireysel ihtiyaçlarına uygun programlar hazırlıyoruz.",
    },
    {
      question: "Eğitim seansları ne kadar sürer?",
      answer:
        "Seansların süresi çocuğun yaşına, dikkat süresine ve ihtiyaçlarına göre belirlenir. Genellikle 30-45 dakika arasında değişir. Bireysel eğitim planında seansların sıklığı ve süresi detaylandırılır.",
    },
    {
      question: "Ailelere nasıl destek sağlıyorsunuz?",
      answer:
        "Aile eğitimi ve danışmanlık hizmetleri sunuyoruz. Evde uygulayabilecekleri stratejiler öğretiyoruz ve düzenli aile görüşmeleri yapıyoruz. Ailenin sürece aktif katılımını destekliyoruz.",
    },
    {
      question: "Randevu nasıl alabilirim?",
      answer:
        "Telefon, WhatsApp veya web sitemizden randevu alabilirsiniz. İlk görüşme ücretsizdir ve çocuğunuzun ihtiyaçlarını değerlendirmek için detaylı bir görüşme gerçekleştiririz.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prevIndexes) => {
      if (prevIndexes.includes(index)) {
        // Eğer zaten açıksa, kapat
        return prevIndexes.filter((i) => i !== index);
      } else {
        // Eğer kapalıysa, aç
        return [...prevIndexes, index];
      }
    });
  };

  return (
    <section
      id="faq"
      className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern
              id="faqPattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="10"
                cy="10"
                r="1"
                fill="currentColor"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#faqPattern)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-body font-semibold text-sm uppercase tracking-wider">
            Sıkça Sorulan Sorular
          </span>
          <h2
            id="faq-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark mt-4 mb-6"
          >
            Merak Ettikleriniz
            <span className="text-gradient block">Burada</span>
          </h2>
          <p className="font-body text-lg text-neutral-dark/80 max-w-2xl mx-auto leading-relaxed">
            Özel eğitim ve rehabilitasyon hizmetlerimiz hakkında en çok sorulan
            soruların yanıtlarını burada bulabilirsiniz.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl card-shadow overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="font-display text-lg font-semibold text-neutral-dark pr-4">
                  {faq.question}
                </h3>
                <div
                  className={`flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndexes.includes(index) ? "rotate-180 bg-primary" : ""
                  }`}
                >
                  <svg
                    className={`w-4 h-4 transition-colors duration-300 ${
                      openIndexes.includes(index)
                        ? "text-white"
                        : "text-primary"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndexes.includes(index)
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-100 pt-6">
                    <p className="font-body text-neutral-dark/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl p-8 card-shadow">
            <div className="max-w-2xl mx-auto">
              <h3 className="font-display text-2xl font-bold text-neutral-dark mb-4">
                Başka sorularınız mı var?
              </h3>
              <p className="font-body text-neutral-dark/80 mb-6">
                Uzman ekibimiz tüm sorularınızı yanıtlamak ve size en uygun
                eğitim programını önermek için burada.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-primary text-white px-8 py-4 rounded-full font-body font-semibold hover:bg-primary/90 transition-colors duration-300"
                >
                  Bize Ulaşın
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
