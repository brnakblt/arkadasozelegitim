# 🎓 Arkadaş Özel Eğitim ERP Sistemi

**Arkadaş Özel Eğitim ve Rehabilitasyon Merkezi** için geliştirilmiş kapsamlı ERP (Kurumsal Kaynak Planlama) sistemi.

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org/)
[![Strapi](https://img.shields.io/badge/Strapi-v5-blue?logo=strapi)](https://strapi.io/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-purple?logo=react)](https://expo.dev/)
[![Python](https://img.shields.io/badge/Python-3.11-yellow?logo=python)](https://python.org/)

---

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Proje Mimarisi](#-proje-mimarisi)
- [Gereksinimler](#-gereksinimler)
- [Kurulum](#-kurulum)
- [Çalıştırma](#-çalıştırma)
- [Proje Yapısı](#-proje-yapısı)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Ortam Değişkenleri](#-ortam-değişkenleri)

---

## ✨ Özellikler

### 🏫 Kurum Yönetimi

- Öğrenci profil yönetimi (engel bilgisi, kan grubu, veli bilgileri)
- Öğretmen ve terapist profilleri
- Rol tabanlı erişim kontrolü (RBAC)
- Kullanıcı yönetimi paneli

### 📅 Program ve Planlama

- Haftalık/aylık takvim görünümü
- Ders, terapi, toplantı ve etkinlik planlaması
- Bireysel eğitim planları (BEP)

### 📋 Yoklama Sistemi

- **Yüz tanıma** ile otomatik yoklama (AI destekli)
- Manuel yoklama girişi
- Günlük/aylık raporlama
- CSV dışa aktarma

### 🚌 Servis Takip

- Gerçek zamanlı GPS takibi
- Şoför modu (konum paylaşımlı)
- Rota ve durak yönetimi
- Veli bildirimleri

### 📁 Dosya Yönetimi

- **Nextcloud** entegrasyonu
- Otomatik kullanıcı ve klasör oluşturma
- OnlyOffice ile belge düzenleme

### 🤖 Yapay Zeka Servisleri

- Yüz kodlama ve eşleştirme
- Güven skoru hesaplama
- Batch model eğitimi

---

## 🏗 Proje Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
├─────────────────────────────┬───────────────────────────────┤
│      Web (Next.js 15)       │    Mobile (React Native)      │
│      localhost:3000         │       Expo Go / APK           │
└─────────────┬───────────────┴───────────────┬───────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
├─────────────────────────────┬───────────────────────────────┤
│      Strapi v5 (CMS)        │     AI Service (Python)       │
│      localhost:1337         │       localhost:8000          │
└─────────────┬───────────────┴───────────────┬───────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Infrastructure                           │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  PostgreSQL  │   Nextcloud  │  OnlyOffice  │     Redis      │
│   :5432      │    :8080     │    :8088     │     :6379      │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

---

## 📦 Gereksinimler

| Yazılım | Sürüm | Notlar |
|---------|-------|--------|
| Node.js | 18.x - 22.x | `nvm install 22` önerilir |
| Python | 3.11 | AI servisi için |
| Docker | 20.x+ | Infrastructure için |
| Git | 2.x+ | Versiyon kontrolü |

### Opsiyonel

- PostgreSQL 15+ (production için)
- Google Maps API Key (GPS takip için)

---

## 🚀 Kurulum

### Otomatik Kurulum

**Windows (PowerShell):**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup_windows.ps1
```

**Linux/macOS:**

```bash
chmod +x setup_project.sh
./setup_project.sh
```

**Arch Linux (tam kurulum):**

```bash
sudo ./setup_arch.sh
```

### Manuel Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/your-org/arkadasozelegitim.git
cd arkadasozelegitim

# 2. Node.js 22 kur (NVM ile)
nvm install 22
nvm use 22

# 3. Tüm bağımlılıkları yükle
npm run install:all

# 4. AI servisi için Python ortamı
npm run install:ai

# 5. Ortam değişkenlerini ayarla
cp strapi/.env.example strapi/.env
cp web/.env.example web/.env.local
cp ai-service/.env.example ai-service/.env
```

---

## ▶️ Çalıştırma

### Geliştirme Modu

```bash
# Tüm servisleri başlat (Strapi + Web + AI)
npm run dev

# Veya ayrı ayrı:
npm run dev:strapi   # Backend API (localhost:1337)
npm run dev:web      # Frontend (localhost:3000)
npm run dev:ai       # AI Service (localhost:8000)
npm run dev:mobile   # Mobile (Expo)
npm run dev:docker   # Infrastructure (Nextcloud, etc.)
```

### Production Modu

```bash
# Build
npm run build

# Başlat
npm run start

# Durdur
npm run stop
```

### Erişim Adresleri

| Servis | URL | Açıklama |
|--------|-----|----------|
| Web Frontend | <http://localhost:3000> | Next.js uygulaması |
| Strapi Admin | <http://localhost:1337/admin> | CMS yönetim paneli |
| Strapi API | <http://localhost:1337/api> | REST API |
| AI Service | <http://localhost:8000/docs> | FastAPI Swagger UI |
| Nextcloud | <http://localhost:8080> | Dosya yönetimi |
| OnlyOffice | <http://localhost:8088> | Belge düzenleme |

---

## 📁 Proje Yapısı

```
arkadasozelegitim/
├── 📂 strapi/                 # Backend CMS (Strapi v5)
│   ├── src/
│   │   ├── api/               # Content-types & Controllers
│   │   ├── policies/          # RBAC Policies
│   │   ├── middlewares/       # Custom Middlewares
│   │   ├── services/          # Nextcloud OCS Service
│   │   └── bootstrap/         # Role Seeding
│   └── .env                   # Strapi environment
│
├── 📂 web/                    # Frontend (Next.js 15)
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   └── services/          # API services
│   └── .env.local             # Web environment
│
├── 📂 mobile/                 # Mobile App (React Native/Expo)
│   ├── app/                   # Expo Router
│   ├── hooks/                 # useLocation, useCamera
│   └── components/            # Mobile components
│
├── 📂 ai-service/             # AI Face Recognition (Python)
│   ├── app/
│   │   ├── api/               # FastAPI routes
│   │   ├── services/          # face_service.py
│   │   └── core/              # Configuration
│   └── requirements.txt
│
├── 📂 infrastructure/         # Docker & DB
│   ├── docker-compose.yml     # Nextcloud, OnlyOffice, etc.
│   └── schema.sql             # PostgreSQL schema
│
├── 📜 package.json            # Root package with scripts
├── 📜 setup_project.sh        # Linux/macOS setup
├── 📜 setup_windows.ps1       # Windows setup
├── 📜 setup_arch.sh           # Arch Linux full setup
└── 📜 yapilacaklar.txt        # Task list (Turkish)
```

---

## 📡 API Dokümantasyonu

### Strapi API

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/student-profiles` | GET/POST | Öğrenci profilleri |
| `/api/teacher-profiles` | GET/POST | Öğretmen profilleri |
| `/api/schedules` | GET/POST | Program/takvim |
| `/api/attendance-logs` | GET/POST | Yoklama kayıtları |
| `/api/service-routes` | GET/POST | Servis rotaları |
| `/api/location-logs` | POST | GPS konum kayıtları |
| `/api/nextcloud-sync/provision` | POST | Nextcloud kullanıcı oluştur |

### AI Service API

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/encode` | POST | Yüz kodlama (base64) |
| `/api/match` | POST | Yüz eşleştirme |
| `/api/train` | POST | Model eğitimi |
| `/api/users` | GET | Kayıtlı kullanıcı listesi |
| `/api/health` | GET | Servis sağlık kontrolü |

---

## ⚙️ Ortam Değişkenleri

### Strapi (`.env`)

```env
DATABASE_CLIENT=sqlite
NEXTCLOUD_URL=http://localhost:8080
NEXTCLOUD_ADMIN_USER=admin
NEXTCLOUD_ADMIN_PASSWORD=admin123
```

### Web (`.env.local`)

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

### AI Service (`.env`)

```env
STRAPI_URL=http://localhost:1337
FACE_RECOGNITION_THRESHOLD=0.6
```

---

## 🧪 Test

```bash
# Web testleri
npm run test --prefix web

# Linting
npm run lint
```

---

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje **Arkadaş Özel Eğitim ve Rehabilitasyon Merkezi** için özel olarak geliştirilmiştir.

---

<p align="center">
  <strong>🎓 Her Çocuk Özel ve Değerli! 🎓</strong>
</p>
