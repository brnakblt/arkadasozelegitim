export default {
  routes: [
    {
      method: 'GET',
      path: '/instagram-feed',
      handler: 'instagram.getFeed',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
