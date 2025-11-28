export default {
  async afterCreate(event) {
    const { result } = event;

    try {
      await strapi.plugins['email'].services.email.send({
        to: process.env.SMTP_USERNAME, // Send to yourself
        from: process.env.SMTP_USERNAME,
        subject: `Yeni İletişim Mesajı: ${result.name}`,
        text: `
          Web sitenizden yeni bir mesaj aldınız!
          
          Ad Soyad: ${result.name}
          E-posta: ${result.email}
          Telefon: ${result.phone}
          Adres: ${result.address}
          
          Mesaj:
          ${result.message}
        `,
        html: `
          <h3>Web sitenizden yeni bir mesaj aldınız!</h3>
          <p><strong>Ad Soyad:</strong> ${result.name}</p>
          <p><strong>E-posta:</strong> ${result.email}</p>
          <p><strong>Telefon:</strong> ${result.phone}</p>
          <p><strong>Adres:</strong> ${result.address}</p>
          <p><strong>Mesaj:</strong></p>
          <p>${result.message}</p>
        `,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
