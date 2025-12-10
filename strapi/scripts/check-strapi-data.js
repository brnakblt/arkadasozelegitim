const Strapi = require('@strapi/strapi');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function checkData() {
  const appDir = process.cwd();
  const distDir = path.join(appDir, 'dist');

  const strapi = await Strapi({ appDir, distDir }).load();

  try {
    // Check Hero Data
    const hero = await strapi.entityService.findMany('api::hero.hero');
    console.log('Hero Data:', hero ? 'Found' : 'Not Found');
    if (hero) console.log(JSON.stringify(hero, null, 2));

    // Check Permissions
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
      populate: ['permissions'],
    });

    const heroPermissions = publicRole.permissions.filter(p => p.action.startsWith('api::hero'));
    console.log('Hero Permissions:', heroPermissions.map(p => p.action));

  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    strapi.stop();
  }
}

checkData();
