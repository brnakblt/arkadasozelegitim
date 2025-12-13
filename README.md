# 🎓 Arkadaş Özel Eğitim ERP Sistemi

<div align="center">

**Arkadaş Özel Eğitim ve Rehabilitasyon Merkezi** için geliştirilmiş kapsamlı kurumsal kaynak planlama sistemi.

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Strapi](https://img.shields.io/badge/Strapi-v5-4945FF?style=for-the-badge&logo=strapi&logoColor=white)](https://strapi.io/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)

[📖 Dokümantasyon](./docs) • [🚀 Hızlı Başlangıç](#-hızlı-başlangıç) • [📋 API](./docs/docs/api)

</div>

---

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Sistem Mimarisi](#-sistem-mimarisi)
- [Gereksinimler](#-gereksinimler)
- [Hızlı Başlangıç](#-hızlı-başlangıç)
- [Proje Yapısı](#-proje-yapısı)
- [Çalıştırma](#-çalıştırma)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Test](#-test)
- [Deployment](#-deployment)
- [Katkıda Bulunma](#-katkıda-bulunma)

---

## ✨ Özellikler

<table>
<tr>
<td width="50%">

### 🏫 Kurum Yönetimi

- Öğrenci profil yönetimi (engel bilgisi, veli bilgileri)
- Öğretmen ve terapist profilleri
- Rol tabanlı erişim kontrolü (RBAC)
- Kullanıcı yönetimi paneli

### 📅 Program ve Planlama

- Haftalık/aylık takvim görünümü
- Ders, terapi ve etkinlik planlaması
- Sürükle-bırak program düzenleyici

### 📋 Yoklama Sistemi

- **Yüz tanıma** ile otomatik yoklama
- QR kod ile hızlı yoklama
- Günlük/aylık raporlama
- PDF ve Excel dışa aktarma

</td>
<td width="50%">

### 🚌 Servis Takip

- Gerçek zamanlı GPS takibi
- Şoför modu (konum paylaşımlı)
- Rota ve durak yönetimi
- Veli bildirim sistemi

### 📁 Dosya Yönetimi

- **Nextcloud** entegrasyonu
- Otomatik kullanıcı ve klasör oluşturma
- OnlyOffice ile belge düzenleme

### 🤖 Yapay Zeka Servisleri

- Yüz kodlama ve eşleştirme
- Güven skoru hesaplama
- Batch model eğitimi

</td>
</tr>
</table>

---

## 🏗 Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├────────────────────────────────┬────────────────────────────────┤
│        Web (Next.js 15)        │     Mobile (React Native)      │
│        localhost:3000          │        Expo Go / APK           │
└───────────────┬────────────────┴────────────────┬───────────────┘
                │                                  │
                ▼                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                              │
├────────────────────────────────┬────────────────────────────────┤
│       Strapi v5 (CMS)          │      AI Service (Python)       │
│       localhost:1337           │        localhost:8000          │
└───────────────┬────────────────┴────────────────┬───────────────┘
                │                                  │
                ▼                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       INFRASTRUCTURE                             │
├──────────────┬───────────────┬───────────────┬──────────────────┤
│  PostgreSQL  │   Nextcloud   │   OnlyOffice  │      Redis       │
│    :5432     │     :8080     │     :8088     │      :6379       │
└──────────────┴───────────────┴───────────────┴──────────────────┘
```

---

## 📦 Gereksinimler

| Yazılım | Minimum Sürüm | Önerilen |
|---------|---------------|----------|
| Node.js | 18.x | 22.x |
| Python | 3.10 | 3.11 |
| Docker | 20.x | 24.x |
| PostgreSQL | 14 | 16 |
| Git | 2.x | 2.40+ |

---

## 🚀 Hızlı Başlangıç

### Otomatik Kurulum

<details>
<summary><b>Windows (PowerShell)</b></summary>

```powershell
# ExecutionPolicy ayarla
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Kurulum scriptini çalıştır
.\setup_windows.ps1
```

</details>

<details>
<summary><b>Linux / macOS</b></summary>

```bash
chmod +x setup_project.sh
./setup_project.sh
```

</details>

<details>
<summary><b>Arch Linux (Tam Kurulum)</b></summary>

```bash
sudo ./setup_arch.sh
```

</details>

### Manuel Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/brnakblt/arkadasozelegitim.git
cd arkadasozelegitim

# 2. Node.js 22 kur (NVM ile)
nvm install 22 && nvm use 22

# 3. Tüm bağımlılıkları yükle
npm run install:all

# 4. AI servisi için Python ortamı
npm run install:ai

# 5. Ortam değişkenlerini kopyala
cp strapi/.env.example strapi/.env
cp web/.env.example web/.env.local

# 6. Geliştirme sunucusunu başlat
npm run dev
```

---

## 📁 Proje Yapısı

```
arkadasozelegitim/
├── 📂 strapi/              # Backend CMS (Strapi v5)
│   ├── src/api/            # 21 Content-type
│   ├── src/policies/       # RBAC Policies
│   └── config/             # Database, plugins
│
├── 📂 web/                 # Frontend (Next.js 15)
│   ├── src/app/            # App Router pages
│   ├── src/components/     # 34+ React components
│   └── src/lib/            # Auth, cache, CDN utils
│
├── 📂 mobile/              # Mobile App (React Native/Expo)
│   ├── hooks/              # Offline, biometric, location
│   └── screens/            # QR attendance, etc.
│
├── 📂 ai-service/          # AI Face Recognition (Python)
│   └── app/api/            # FastAPI endpoints
│
├── 📂 mebbis-service/      # Arkadaş MEBBIS Automation (Node.js)
│   ├── src/services/       # MEBBIS automation services
│   ├── src/api/            # REST API endpoints
│   └── src/types/          # TypeScript type definitions
│
├── 📂 docs/                # MkDocs documentation
│   └── docs/api/           # OpenAPI specification
│
├── 📂 scripts/             # Utility scripts
│   ├── database-indexes.sql
│   ├── run-tests.ps1
│   └── run-tests.sh
│
└── 📂 infrastructure/      # Docker Compose
    └── docker-compose.yml
```

---

## ▶️ Çalıştırma

### Geliştirme Modu

```bash
# Tüm servisleri başlat
npm run dev

# Veya ayrı ayrı:
npm run dev:strapi   # Backend API     → localhost:1337
npm run dev:web      # Frontend        → localhost:3000
npm run dev:ai       # AI Service      → localhost:8000
npm run dev:mebbis   # MEBBIS Service  → localhost:4000
npm run dev:mobile   # Mobile          → Expo Go
npm run dev:docker   # Infrastructure  → Nextcloud, etc.
```

### Servis Adresleri

| Servis | URL | Açıklama |
|--------|-----|----------|
| Web Frontend | <http://localhost:3000> | Next.js uygulaması |
| Strapi Admin | <http://localhost:1337/admin> | CMS yönetim paneli |
| API Docs | <http://localhost:1337/api> | REST API |
| AI Service | <http://localhost:8000/docs> | FastAPI Swagger |
| Arkadaş MEBBIS | <http://localhost:4000/api> | MEBBIS Otomasyon Servisi |
| Nextcloud | <http://localhost:8080> | Dosya yönetimi |

---

## 📡 API Dokümantasyonu

### Strapi REST API

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/auth/local` | POST | Kullanıcı girişi |
| `/api/student-profiles` | GET/POST | Öğrenci profilleri |
| `/api/attendance-logs` | GET/POST | Yoklama kayıtları |
| `/api/schedules` | GET/POST | Program/takvim |
| `/api/service-routes` | GET/POST | Servis rotaları |

### AI Service API

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/encode` | POST | Yüz kodlama |
| `/api/match` | POST | Yüz eşleştirme |
| `/api/train` | POST | Model eğitimi |
| `/api/health` | GET | Sağlık kontrolü |

### Arkadaş MEBBIS Service API

MEBBIS (Milli Eğitim Bakanlığı Bilişim Sistemleri) ile entegrasyon için otomasyon servisi.

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/health` | GET | Servis sağlık kontrolü |
| `/api/sync/students` | POST | Öğrenci verilerini MEBBIS'ten senkronize et |
| `/api/sync/educators` | POST | Eğitimci verilerini senkronize et |
| `/api/education/submit` | POST | Eğitim bilgisi kayıtlarını MEBBIS'e aktar |
| `/api/invoices/create` | POST | Fatura oluştur |
| `/api/invoices/approve` | POST | Bekleyen faturaları onayla |
| `/api/bep/submit` | POST | BEP formlarını (EK-4, EK-5, EK-6) aktar |
| `/api/status/:jobId` | GET | Arka plan işlerinin durumunu sorgula |

📖 Detaylı API dokümantasyonu için: [docs/docs/api/openapi.yaml](./docs/docs/api/openapi.yaml)

---

## 🧪 Test

```bash
# Tüm testleri çalıştır
npm run test:all

# Sadece web unit testleri
npm run test --prefix web

# E2E testleri
npm run test:e2e --prefix web

# Mobile testleri
npm run test --prefix mobile
```

---

## 🚀 Deployment

Detaylı deployment rehberi için: [docs/docs/deployment/index.md](./docs/docs/deployment/index.md)

### Hızlı Production Build

```bash
# Tüm projeleri build et
npm run build

# Docker ile deployment
docker-compose -f infrastructure/docker-compose.yml up -d

# PM2 ile Strapi
cd strapi && pm2 start npm --name "strapi" -- start
```

---

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje **Arkadaş Özel Eğitim ve Rehabilitasyon Merkezi** için özel olarak geliştirilmiştir.

---

<div align="center">

**🎓 Her Çocuk Özel ve Değerli! 🎓**

Made with ❤️ in Turkey

</div>
