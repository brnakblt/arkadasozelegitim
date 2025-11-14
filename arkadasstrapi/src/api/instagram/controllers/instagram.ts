/**
 * A set of functions called "actions" for the `instagram` API
 */

export default {
  getFeed: async (ctx, next) => {
    try {
      // In a real application, you would fetch the Instagram feed here
      // using a long-lived access token.
      // For now, we will return mock data.

      const mockData = [
        {
          id: '1',
          media_url: 'http://localhost:1337/uploads/1_1c877a033c.webp',
          caption: 'Bireysel Çalışmalar',
          permalink: '#',
        },
        {
          id: '2',
          media_url: 'http://localhost:1337/uploads/2_37c685389a.webp',
          caption: 'Özel Eğitim Sınıfları',
          permalink: '#',
        },
        {
          id: '3',
          media_url: 'http://localhost:1337/uploads/3_132111e9ed.webp',
          caption: 'Eğitici Aktiviteler',
          permalink: '#',
        },
        {
          id: '4',
          media_url: 'http://localhost:1337/uploads/4_8256a1ab3d.webp',
          caption: 'Bireysel Eğitim',
          permalink: '#',
        },
        {
          id: '5',
          media_url: 'http://localhost:1337/uploads/5_bf256046b6.webp',
          caption: 'Grup Çalışmaları',
          permalink: '#',
        },
        {
          id: '6',
          media_url: 'http://localhost:1337/uploads/6_c7c22c6f2d.webp',
          caption: 'Aile Danışmanlığı',
          permalink: '#',
        },
      ];

      ctx.body = mockData;
    } catch (err) {
      ctx.body = err;
    }
  },
};
