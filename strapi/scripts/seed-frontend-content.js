'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function findFile(name) {
  const file = await strapi.query('plugin::upload.file').findOne({
    where: {
      name: {
        $contains: name,
      },
    },
  });
  return file;
}

async function setPublicPermissions() {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  const permissions = [
    'api::hero.hero.find',
    'api::service.service.find',
    'api::service.service.findOne',
    'api::process.process.find',
    'api::process.process.findOne',
    'api::faq.faq.find',
    'api::faq.faq.findOne',
    'api::gallery.gallery.find',
    'api::gallery.gallery.findOne',
  ];

  for (const permission of permissions) {
    const [action] = permission.split('.').slice(-1);
    const uid = permission.split('.').slice(0, -1).join('.');
    
    await strapi.query('plugin::users-permissions.permission').create({
      data: {
        action: permission,
        role: publicRole.id,
      },
    });
  }
  console.log('Public permissions set.');
}

async function seedHero() {
  const images = [];
  for (let i = 1; i <= 6; i++) {
    const file = await findFile(`${i}.webp`); // Assuming files are named 1.webp, etc.
    if (file) images.push(file);
  }

  await strapi.entityService.create('api::hero.hero', {
    data: {
      title: 'Her Çocuk',
      subtitle: 'Özel ve Değerli',
      description: 'Özel eğitim ve rehabilitasyon alanında uzman kadromuzla, her çocuğun potansiyelini keşfetmesi ve gelişmesi için bireysel eğitim programları sunuyoruz.',
      images: images,
      stats: [
        { value: '500+', label: 'Başarılı Öğrenci' },
        { value: '15+', label: 'Yıl Deneyim' },
        { value: '98%', label: 'Aile Memnuniyeti' },
        { value: '24/7', label: 'Destek Hattı' },
      ],
      publishedAt: new Date(),
    },
  });
  console.log('Hero seeded.');
}

async function seedServices() {
  const services = [
    {
      title: 'Dil ve Konuşma Terapisi',
      description: 'Dil ve konuşma bozuklukları olan çocuklar için bireysel terapi programları ve aile eğitimi.',
      icon: 'comments',
      features: [
        { text: 'Artikülasyon Terapisi' },
        { text: 'Dil Gelişimi' },
        { text: 'Sosyal İletişim' },
        { text: 'Aile Danışmanlığı' },
      ],
    },
    {
      title: 'Özel Eğitim Programları',
      description: 'Özel gereksinimli çocuklar için bireysel eğitim planları ve akademik destek programları.',
      icon: 'brain',
      features: [
        { text: 'Bireysel Eğitim Planı' },
        { text: 'Akademik Beceriler' },
        { text: 'Sosyal Beceriler' },
        { text: 'Günlük Yaşam Becerileri' },
      ],
    },
    {
      title: 'Rehabilitasyon Hizmetleri',
      description: 'Fiziksel ve bilişsel rehabilitasyon programları ile çocukların gelişimini destekleme.',
      icon: 'users',
      features: [
        { text: 'Fizyoterapi' },
        { text: 'Ergoterapisi' },
        { text: 'Bilişsel Rehabilitasyon' },
        { text: 'Oyun Terapisi' },
      ],
    },
  ];

  for (const service of services) {
    await strapi.entityService.create('api::service.service', {
      data: { ...service, publishedAt: new Date() },
    });
  }
  console.log('Services seeded.');
}

async function seedProcesses() {
  const processes = [
    { number: '01', title: 'İlk Görüşme', description: 'Çocuğunuzla tanışır ve ailenizle detaylı bir görüşme gerçekleştiririz.', icon: 'users' },
    { number: '02', title: 'Bireysel Eğitim Planı', description: 'Değerlendirme sonuçlarına göre çocuğunuza özel bireysel eğitim programı hazırlarız.', icon: 'clipboard-list' },
    { number: '03', title: 'Eğitim Sürecinin Başlatılması', description: 'Uzman öğretmenlerimiz ve terapistlerimizle bireysel eğitim seanslarına başlarız.', icon: 'bullseye' },
    { number: '04', title: 'Aile Eğitimi ve Danışmanlık', description: 'Ailelere evde uygulayabilecekleri stratejiler ve destek programları sağlarız.', icon: 'user-friends' },
    { number: '05', title: 'Düzenli Takip ve Değerlendirme', description: 'Çocuğunuzun gelişimini düzenli olarak takip eder, programı güncelleriz.', icon: 'chart-line' },
    { number: '06', title: 'Sürekli Destek', description: 'Eğitim süreci boyunca ve sonrasında sürekli destek ve danışmanlık hizmeti veriyoruz.', icon: 'handshake' },
  ];

  for (const process of processes) {
    await strapi.entityService.create('api::process.process', {
      data: { ...process, publishedAt: new Date() },
    });
  }
  console.log('Processes seeded.');
}

async function seedFAQs() {
  const faqs = [
    { question: 'Hangi yaş gruplarına hizmet veriyorsunuz?', answer: '0-18 yaş arası tüm çocuklara hizmet veriyoruz. Erken müdahale programlarından okul çağı destek eğitimlerine kadar geniş bir yaş yelpazesinde uzmanlaşmış hizmetler sunuyoruz.' },
    { question: 'Özel eğitim süreci nasıl başlıyor?', answer: 'İlk olarak ailemizle görüşme yapıyor, çocuğunuzun ihtiyaçlarını değerlendiriyoruz. Ardından kapsamlı bir değerlendirme süreci başlatıyor ve bireysel eğitim planı hazırlıyoruz. Tüm süreç ailenin aktif katılımıyla gerçekleşir.' },
    { question: 'Hangi alanlarda uzmanlaşmış hizmet veriyorsunuz?', answer: 'Dil ve konuşma terapisi, özel eğitim, fizyoterapi, ergoterapisi, oyun terapisi ve aile danışmanlığı alanlarında uzman kadromuzla hizmet veriyoruz. Her çocuğun bireysel ihtiyaçlarına uygun programlar hazırlıyoruz.' },
    { question: 'Eğitim seansları ne kadar sürer?', answer: 'Seansların süresi çocuğun yaşına, dikkat süresine ve ihtiyaçlarına göre belirlenir. Genellikle 30-45 dakika arasında değişir. Bireysel eğitim planında seansların sıklığı ve süresi detaylandırılır.' },
    { question: 'Ailelere nasıl destek sağlıyorsunuz?', answer: 'Aile eğitimi ve danışmanlık hizmetleri sunuyoruz. Evde uygulayabilecekleri stratejiler öğretiyoruz ve düzenli aile görüşmeleri yapıyoruz. Ailenin sürece aktif katılımını destekliyoruz.' },
    { question: 'Randevu nasıl alabilirim?', answer: 'Telefon, WhatsApp veya web sitemizden randevu alabilirsiniz. İlk görüşme ücretsizdir ve çocuğunuzun ihtiyaçlarını değerlendirmek için detaylı bir görüşme gerçekleştiririz.' },
  ];

  for (const faq of faqs) {
    await strapi.entityService.create('api::faq.faq', {
      data: { ...faq, publishedAt: new Date() },
    });
  }
  console.log('FAQs seeded.');
}

async function seedGallery() {
  const galleryItems = [
    { src: '1.webp', title: 'Bireysel Çalışmalar', category: 'Eğitim', alt: 'Arkadaş Özel Eğitim ve Rehabilitasyon Merkezi - Uzman eğitmenler ile bireysel çalışmalar' },
    { src: '2.webp', title: 'Özel Eğitim Sınıfları', category: 'Eğitim', alt: 'Arkadaş Özel Eğitim Merkezi - Modern özel eğitim sınıfları, çocuklar öğreniyor, destekleyici eğitim ortamı' },
    { src: '3.webp', title: 'Eğitici Aktiviteler', category: 'Sosyal Aktivite', alt: 'Arkadaş Özel Eğitim Merkezi - Eğitici aktiviteler, renkli öğrenme materyalleri, interaktif öğrenme' },
    { src: '4.webp', title: 'Bireysel Eğitim', category: 'Eğitim', alt: 'Arkadaş Özel Eğitim Merkezi - Bireyselleştirilmiş eğitim çalışmaları' },
    { src: '5.webp', title: 'Grup Çalışmaları', category: 'Sosyal Aktivite', alt: 'Arkadaş Özel Eğitim Merkezi - Grup çalışmaları, sosyal beceri geliştirme, çocuklar birlikte öğreniyor' },
    { src: '6.webp', title: 'Aile Danışmanlığı', category: 'Danışmanlık', alt: 'Arkadaş Özel Eğitim Merkezi - Aile danışmanlığı ve rehberlik hizmetleri' },
  ];

  for (const item of galleryItems) {
    const file = await findFile(item.src);
    if (file) {
      await strapi.entityService.create('api::gallery.gallery', {
        data: {
          title: item.title,
          category: item.category,
          alt: item.alt,
          image: file,
          publishedAt: new Date(),
        },
      });
    }
  }
  console.log('Gallery seeded.');
}

async function main() {
  const Strapi = require('@strapi/strapi');
  const app = await Strapi({
    appDir: path.resolve(__dirname, '..'),
    distDir: path.resolve(__dirname, '../dist'),
  }).load();

  app.log.level = 'error';

  try {
    await setPublicPermissions();
    await seedHero();
    await seedServices();
    await seedProcesses();
    await seedFAQs();
    await seedGallery();
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  }

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
