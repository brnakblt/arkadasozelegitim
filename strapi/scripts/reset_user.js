'use strict';

async function resetUser() {
  const Strapi = require('@strapi/strapi');
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();

  try {
    // 1. Find and delete old user
    const oldUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email: 'barannakblut@gmail.com' },
    });

    if (oldUser) {
      console.log(`Found old user: ${oldUser.username} (${oldUser.email}). Deleting...`);
      await strapi.db.query('plugin::users-permissions.user').delete({
        where: { id: oldUser.id },
      });
      console.log('Old user deleted.');
    } else {
      console.log('Old user not found.');
    }

    // 2. Check if 'admin' user exists
    const adminUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { username: 'admin' },
    });

    if (adminUser) {
      console.log('User "admin" already exists. Deleting to recreate...');
      await strapi.db.query('plugin::users-permissions.user').delete({
        where: { id: adminUser.id },
      });
    }
      console.log('Creating user "admin"...');
      
      // Get Authenticated role
      const authenticatedRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      if (!authenticatedRole) {
        throw new Error('Authenticated role not found');
      }

      // Create user
      // Note: We use the service to handle password hashing
      await strapi.plugin('users-permissions').service('user').add({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: authenticatedRole.id,
        confirmed: true,
        blocked: false,
        provider: 'local',
        userType: 'parent' // Default to parent
      });
      
      console.log('User "admin" created with password "admin123".');


  } catch (error) {
    console.error('Error resetting user:', error);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

resetUser();
