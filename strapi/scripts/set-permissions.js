const Strapi = require('@strapi/strapi');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function setPermissions() {
  const appDir = process.cwd();
  const distDir = path.join(appDir, 'dist');

  const strapi = await Strapi({ appDir, distDir }).load();

  try {
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    const permissionsToSet = [
      // Hero (Single Type)
      { action: 'api::hero.hero.find', role: publicRole.id },
      
      // Services (Collection Type)
      { action: 'api::service.service.find', role: publicRole.id },
      { action: 'api::service.service.findOne', role: publicRole.id },

      // Processes (Collection Type)
      { action: 'api::process.process.find', role: publicRole.id },
      { action: 'api::process.process.findOne', role: publicRole.id },

      // FAQs (Collection Type)
      { action: 'api::faq.faq.find', role: publicRole.id },
      { action: 'api::faq.faq.findOne', role: publicRole.id },

      // Gallery (Collection Type)
      { action: 'api::gallery.gallery.find', role: publicRole.id },
      { action: 'api::gallery.gallery.findOne', role: publicRole.id },
    ];

    for (const permission of permissionsToSet) {
      const existing = await strapi.query('plugin::users-permissions.permission').findOne({
        where: {
          action: permission.action,
          role: permission.role,
        },
      });

      if (!existing) {
        const created = await strapi.query('plugin::users-permissions.permission').create({
          data: permission,
        });
        console.log(`Set permission: ${permission.action}`, created);
      } else {
        console.log(`Permission already exists: ${permission.action}`);
      }
    }

    // Verify after setting
    const updatedRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
      populate: ['permissions'],
    });
    const heroPerms = updatedRole.permissions.filter(p => p.action.startsWith('api::hero'));
    console.log('Hero Permissions after update:', heroPerms.map(p => p.action));

    console.log('Permissions updated successfully.');

  } catch (error) {
    console.error('Error setting permissions:', error);
  } finally {
    strapi.stop();
  }
}

setPermissions();
