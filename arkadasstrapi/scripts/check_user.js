async function checkUser() {
  const Strapi = require('@strapi/strapi');
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();

  try {
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { username: 'admin' },
      populate: ['role']
    });

    if (user) {
      console.log('User found:');
      console.log('ID:', user.id);
      console.log('Username:', user.username);
      console.log('Email:', user.email);
      console.log('Confirmed:', user.confirmed);
      console.log('Blocked:', user.blocked);
      console.log('Provider:', user.provider);
      console.log('Role:', user.role ? user.role.name : 'No Role');
    } else {
      console.log('User "admin" not found.');
    }

  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

checkUser();
