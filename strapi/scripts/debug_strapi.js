const Strapi = require('@strapi/strapi');
console.log('Type of Strapi:', typeof Strapi);
console.log('Keys:', Object.keys(Strapi));
if (typeof Strapi === 'object') {
    console.log('createStrapi:', typeof Strapi.createStrapi);
    console.log('compileStrapi:', typeof Strapi.compileStrapi);
    console.log('Strapi factory:', typeof Strapi.Strapi);
}
