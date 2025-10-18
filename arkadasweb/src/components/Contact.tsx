
import React, { useState } from "react";

type FormDataType = {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
};

type ErrorsType = {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
};

type TouchedType = {
  name: boolean;
  email: boolean;
  phone: boolean;
  address: boolean;
  message: boolean;
};

const Contact = () => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [errors, setErrors] = useState<ErrorsType>({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [touched, setTouched] = useState<TouchedType>({
    name: false,
    email: false,
    phone: false,
    address: false,
    message: false,
  });
  const [kvkkApproved, setKvkkApproved] = useState(false);
  const [kvkkError, setKvkkError] = useState("");
  const [isKvkkOpen, setIsKvkkOpen] = useState(false);

  // Alan doğrulama fonksiyonu
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Ad Soyad zorunlu." : "";
      case "email":
        if (value.trim() === "") return "E-posta zorunlu.";
        // Basit e-posta kontrolü
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Geçerli bir e-posta giriniz.";
        return "";
      case "phone":
        return value.trim() === "" ? "Telefon zorunlu." : "";
      case "address":
        return value.trim() === "" ? "Adres zorunlu." : "";
      case "message":
        return value.trim() === "" ? "Mesaj zorunlu." : "";
      default:
        return "";
    }
  };

  // Form submit fonksiyonu
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: ErrorsType = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      address: validateField("address", formData.address),
      message: validateField("message", formData.message),
    };
    setErrors(newErrors);
    if (!kvkkApproved) {
      setKvkkError("KVKK onayı gereklidir.");
    } else {
      setKvkkError("");
    }
    // Hatalar yoksa formu gönder
    if (Object.values(newErrors).every((error) => error === "") && kvkkApproved) {
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

  const handleKvkkHeaderClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;

    // If the click is on the checkbox input itself, let it do its thing.
    // The accordion should not toggle.
    if (target.id === "kvkk") {
      return;
    }

    // If the click was on the label, prevent its default action (toggling the checkbox).
    if (target.closest('label[for="kvkk"]')) {
      e.preventDefault();
    }

    // For any click that wasn't on the checkbox input, toggle the accordion.
    setIsKvkkOpen((prev) => !prev);
  };

  return (
    <section id="contact" className="py-20 bg-neutral-dark text-white relative overflow-hidden">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form Alanı ve İletişim Bilgileri tek bir üst div ile sarıldı */}
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              ...existing code...
            </form>
            <div className="flex justify-center">
              ...existing code...
            </div>
          </>
        </div>
      </div>
    </section>
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary transition-all duration-200 font-body ${
                  touched.name && errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-transparent"
                }`}
                placeholder="Adınızı ve Soyadınızı giriniz"
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block font-body font-medium text-neutral-dark mb-2">
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
            <div>
              <label htmlFor="phone" className="block font-body font-medium text-neutral-dark mb-2">
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
              <label htmlFor="address" className="block font-body font-medium text-neutral-dark mb-2">
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
              <label htmlFor="message" className="block font-body font-medium text-neutral-dark mb-2">
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
            {/* KVKK Section with Accordion */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <div
                  onClick={handleKvkkHeaderClick}
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
                          setKvkkApproved(e.target.checked);
                          if (e.target.checked) {
                            setKvkkError("");
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex-initial">
                      <label htmlFor="kvkk" className="font-body text-sm text-gray-600">
                        Kişisel verilerimin işlenmesi hakkında bilgilendirmeyi okudum ve onaylıyorum. <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isKvkkOpen ? "rotate-180" : ""}`}
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
                <div className={`transition-all duration-300 ease-in-out ${isKvkkOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
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
                      Kişisel verileriniz hizmet sunumu ve yasal yükümlülükler kapsamında işlenmekte olup, üçüncü şahıslarla paylaşılmamaktadır.
                    </p>
                  </div>
                </div>
              </div>
              {kvkkError && <p className="text-red-500 text-sm">{kvkkError}</p>}
            </div>
          </form>
          {/* İletişim Bilgileri ve Sosyal Medya */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 w-full max-w-2xl">
              <h3 className="font-display text-2xl font-bold text-white mb-6">İletişim Bilgileri</h3>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-white mb-1">E-posta</h4>
                    <p className="font-body text-white/80">arkadasozelegitim@hotmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-white mb-1">Telefon</h4>
                    <p className="font-body text-white/80">+90 506 810 33 21</p>
                  </div>
                </div>
                {/* Diğer iletişim ve sosyal medya alanları buraya eklenebilir */}
              </div>
              {/* Harita */}
              <div className="rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3131.857964893978!2d27.13839331562209!3d38.41924897964609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDI1JzA5LjMiTiAyN8KwMDgnMjguMCJF!5e0!3m2!1str!2str!4v1680000000000!5m2!1str!2str"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Arkadaş Özel Eğitim Merkezi Konumu"
                ></iframe>
              </div>
              {/* Çalışma Saatleri */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:col-span-2 mt-8">
                <h3 className="font-display text-2xl font-bold text-white mb-6">Çalışma Saatleri</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-white/80">Pazartesi - Cuma</span>
                    <span className="font-body font-semibold text-white">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-white/80">Cumartesi</span>
                    <span className="font-body font-semibold text-white">09:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-white/80">Pazar</span>
                    <span className="font-body font-semibold text-white">Kapalı</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <div className="mt-12">
                <h3 className="font-display text-2xl font-bold text-white mb-6">
                  Bizi Sosyal Medyada Takip Edin
                </h3>
                <div className="flex space-x-4 mb-8">
                  <a
                    href="https://facebook.com/arkadasozelegitim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors duration-300"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com/arkadasozelegitim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors duration-300"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/905068103321"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors duration-300"
                    aria-label="WhatsApp"
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
                {/* Google Maps iframe */}
                <div className="rounded-2xl overflow-hidden shadow-lg mt-8 relative">
                  <iframe
                    title="Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d781.5588374609657!2d27.074553631889314!3d38.48897329720051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b97b823b05b37d%3A0xef6f8c3297c8719c!2z7Iqk7YOA7J6F7KCV7J2EIOyDge2SiOygleyepQ!5e0!3m2!1str!2str!4v1697908789234!5m2!1str!2str"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                  {/* Short link to open in Maps app or full Google Maps */}
                  <div className="mt-3 text-right px-3 pb-3">
                    <a
                      href="https://maps.app.goo.gl/zuUQwm7RvJ14sc2Z9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm font-semibold text-white/90 hover:underline"
                      aria-label="Haritayı uygulamada aç"
                    >
                      Haritayı uygulamada aç
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:col-span-2">
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
