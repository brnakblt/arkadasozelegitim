import React, { useState } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    message: false,
  });

  const [kvkkApproved, setKvkkApproved] = useState(false);
  const [kvkkError, setKvkkError] = useState("");
  const [isKvkkOpen, setIsKvkkOpen] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Ad Soyad alanı zorunludur" : "";
      case "email":
        return value.trim() === ""
          ? "E-posta alanı zorunludur"
          : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
          ? "Geçerli bir e-posta adresi giriniz"
          : "";
      case "phone":
        return value.trim() === ""
          ? "Telefon numarası zorunludur"
          : !/^[0-9\s()-]+$/.test(value)
          ? "Geçerli bir telefon numarası giriniz"
          : "";
      case "address":
        return value.trim() === "" ? "Lütfen bir adres giriniz" : "";
      case "message":
        return value.trim() === "" ? "Mesaj alanı zorunludur" : "";
      default:
        return "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!kvkkApproved) {
      setKvkkError(
        "Kişisel verilerin işlenmesi hakkında bilgilendirmeyi okuyup onaylamanız gerekmektedir."
      );
      return;
    }

    // Validate all fields
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      address: validateField("address", formData.address),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      message: true,
    });

    // Check if there are any errors
    if (Object.values(newErrors).every((error) => error === "")) {
      // Form is valid, proceed with submission
      console.log("Form submitted:", formData);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        message: "",
      });
      setTouched({
        name: false,
        email: false,
        phone: false,
        address: false,
        message: false,
      });
      alert("Mesajınız için teşekkürler! En kısa sürede size dönüş yapacağız.");
    }
  };

  const handleTextAreaResize = (element: HTMLTextAreaElement) => {
    // Reset height to auto first to handle text removal
    element.style.height = "auto";
    // Set height to scrollHeight to fit content
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Handle textarea auto-resize
    if (e.target instanceof HTMLTextAreaElement) {
      handleTextAreaResize(e.target);
    }

    // Clear error when the user starts typing in a field
    if (value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    } else if (touched[name as keyof typeof touched]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    const error = validateField(name, e.target.value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // If there is an error (field is empty), set a timeout to clear it after 5 seconds
    if (error) {
      setTimeout(() => {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }, 5000); // 5 seconds
    }
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
        preserveAspectRatio="none"
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
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    aria-required="true"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary transition-all duration-200 font-body ${
                      touched.name && errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-transparent"
                    }`}
                    placeholder="Adınız ve soyadınız"
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-body font-medium text-neutral-dark mb-2"
                  >
                    E-posta Adresi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    aria-required="true"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary transition-all duration-200 font-body ${
                      touched.email && errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-transparent"
                    }`}
                    placeholder="ornek@email.com"
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block font-body font-medium text-neutral-dark mb-2"
                >
                  Telefon Numarası <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  aria-required="true"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary transition-all duration-200 font-body ${
                    touched.phone && errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-transparent"
                  }`}
                  placeholder="+90 555 123 45 67"
                />
                {touched.phone && errors.phone && (
                  <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block font-body font-medium text-neutral-dark mb-2"
                >
                  Adres <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  aria-required="true"
                  rows={1}
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ minHeight: "42px", overflowY: "hidden" }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary transition-all duration-200 font-body ${
                    touched.address && errors.address
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-transparent"
                  }`}
                  placeholder="Sokak, Mahalle, Bina ve Daire No, İlçe / İzmir"
                />
                {touched.address && errors.address && (
                  <p className="mt-1 text-red-500 text-sm">{errors.address}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-body font-medium text-neutral-dark mb-2"
                >
                  Mesajınız <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  aria-required="true"
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ minHeight: "84px", overflowY: "hidden" }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary transition-all duration-200 font-body ${
                    touched.message && errors.message
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-transparent"
                  }`}
                  placeholder="Bize çocuğunuzun ve sizin ihtiyaçlarınızı kısaca anlatmak ister misiniz? Böylece size en iyi şekilde destek olabiliriz 💚"
                />
                {touched.message && errors.message && (
                  <p className="mt-1 text-red-500 text-sm">{errors.message}</p>
                )}
              </div>

              <div className="space-y-4">
                {/* KVKK Section with Accordion */}
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <div
                    onClick={() => setIsKvkkOpen(!isKvkkOpen)}
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center h-5 mt-1">
                        <input
                          id="kvkk"
                          name="kvkk"
                          type="checkbox"
                          checked={kvkkApproved}
                          onChange={(e) => {
                            e.stopPropagation();
                            setKvkkApproved(e.target.checked);
                            if (e.target.checked) {
                              setKvkkError("");
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                      <label
                        htmlFor="kvkk"
                        className="font-body text-sm text-gray-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Kişisel verilerimin işlenmesi hakkında bilgilendirmeyi
                        okudum ve onaylıyorum.{" "}
                        <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isKvkkOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Collapsible Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isKvkkOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="p-4 text-sm text-gray-600 leading-relaxed border-t border-gray-200">
                      <p className="mb-2">İlgili kanun ve yönetmelikler:</p>
                      <ul className="list-disc pl-5 space-y-2 mb-2">
                        <li>
                          <a
                            href="https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            KVKK
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=24038&MevzuatTur=7&MevzuatTertip=5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Veri İşleme Yönetmeliği
                          </a>
                        </li>
                      </ul>
                      <p>
                        Kişisel verileriniz hizmet sunumu ve yasal yükümlülükler
                        kapsamında işlenmekte olup, üçüncü şahıslarla
                        paylaşılmamaktadır.
                      </p>
                    </div>
                  </div>
                </div>
                {kvkkError && (
                  <p className="text-red-500 text-sm">{kvkkError}</p>
                )}
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
                      arkadasozelegitim@hotmail.com
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
                    <p className="font-body text-white/80">+90 506 810 33 21</p>
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
                      Maltepe Mahallesi 8108. Sk. No:9
                      <br />
                      35600 Çiğli/İzmir
                      <br />
                      İzmir
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
