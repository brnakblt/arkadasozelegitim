const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'src', 'api');

const contentTypes = [
  { name: 'hero', uid: 'api::hero.hero' },
  { name: 'service', uid: 'api::service.service' },
  { name: 'process', uid: 'api::process.process' },
  { name: 'faq', uid: 'api::faq.faq' },
  { name: 'gallery', uid: 'api::gallery.gallery' },
];

contentTypes.forEach(ct => {
  const dir = path.join(apiDir, ct.name);
  
  // Create directories if they don't exist
  ['controllers', 'routes', 'services'].forEach(subDir => {
    const subDirPath = path.join(dir, subDir);
    if (!fs.existsSync(subDirPath)) {
      fs.mkdirSync(subDirPath, { recursive: true });
    }
  });

  // Create Controller
  const controllerPath = path.join(dir, 'controllers', `${ct.name}.js`);
  if (!fs.existsSync(controllerPath)) {
    const content = `const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('${ct.uid}');
`;
    fs.writeFileSync(controllerPath, content);
    console.log(`Created controller for ${ct.name}`);
  }

  // Create Router
  const routerPath = path.join(dir, 'routes', `${ct.name}.js`);
  if (!fs.existsSync(routerPath)) {
    const content = `const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('${ct.uid}');
`;
    fs.writeFileSync(routerPath, content);
    console.log(`Created router for ${ct.name}`);
  }

  // Create Service
  const servicePath = path.join(dir, 'services', `${ct.name}.js`);
  if (!fs.existsSync(servicePath)) {
    const content = `const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('${ct.uid}');
`;
    fs.writeFileSync(servicePath, content);
    console.log(`Created service for ${ct.name}`);
  }
});
