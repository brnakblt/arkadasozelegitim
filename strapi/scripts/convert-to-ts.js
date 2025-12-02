const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'src', 'api');

const contentTypes = ['hero', 'service', 'process', 'faq', 'gallery'];

contentTypes.forEach(ct => {
  const dir = path.join(apiDir, ct);
  
  ['controllers', 'routes', 'services'].forEach(subDir => {
    const subDirPath = path.join(dir, subDir);
    if (fs.existsSync(subDirPath)) {
      const jsFile = path.join(subDirPath, `${ct}.js`);
      const tsFile = path.join(subDirPath, `${ct}.ts`);
      
      if (fs.existsSync(jsFile)) {
        let content = fs.readFileSync(jsFile, 'utf8');
        // Convert require to import/export for TS if needed, or just keep as CommonJS but in .ts file (Strapi supports both, but factories usually use factories.createCore...)
        // Actually, Strapi v4 TS usually uses `import { factories } from '@strapi/strapi'; export default factories.createCoreController(...)`
        
        // Let's rewrite content to proper TS format for Strapi
        if (subDir === 'controllers') {
          content = `/**
 * ${ct} controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::${ct}.${ct}');
`;
        } else if (subDir === 'routes') {
           content = `/**
 * ${ct} router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::${ct}.${ct}');
`;
        } else if (subDir === 'services') {
           content = `/**
 * ${ct} service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::${ct}.${ct}');
`;
        }

        fs.writeFileSync(tsFile, content);
        fs.unlinkSync(jsFile); // Remove JS file
        console.log(`Converted ${jsFile} to ${tsFile}`);
      }
    }
  });
});
