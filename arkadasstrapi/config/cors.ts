export default {
  enabled: true,
  origin: ['http://localhost:5173', 'http://localhost:1337', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  headers: [
    'Content-Type',
    'Authorization',
    'Origin',
    'Accept',
  ],
  keepHeaderOnError: true,
};
