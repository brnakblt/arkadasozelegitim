
/*
 *
 * ============================================================
 * WARNING: THIS FILE HAS BEEN COMMENTED OUT
 * ============================================================
 *
 * CONTEXT:
 *
 * The lifecycles.js file has been commented out to prevent unintended side effects when starting Strapi 5 for the first time after migrating to the document service.
 *
 * STRAPI 5 introduces a new document service that handles lifecycles differently compared to previous versions. Without migrating your lifecycles to document service middlewares, you may experience issues such as:
 *
 * - `unpublish` actions triggering `delete` lifecycles for every locale with a published entity, which differs from the expected behavior in v4.
 * - `discardDraft` actions triggering both `create` and `delete` lifecycles, leading to potential confusion.
 *
 * MIGRATION GUIDE:
 *
 * For a thorough guide on migrating your lifecycles to document service middlewares, please refer to the following link:
 * [Document Services Middlewares Migration Guide](https://docs.strapi.io/dev-docs/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service)
 *
 * IMPORTANT:
 *
 * Simply uncommenting this file without following the migration guide may result in unexpected behavior and inconsistencies. Ensure that you have completed the migration process before re-enabling this file.
 *
 * ============================================================
 */

// export default {
//   async afterCreate(event) {
//     const { result } = event;
// 
//     try {
//       await strapi.plugins['email'].services.email.send({
//         to: process.env.SMTP_USERNAME, // Send to yourself
//         from: process.env.SMTP_USERNAME,
//         subject: `Yeni İletişim Mesajı: ${result.name}`,
//         text: `
//           Web sitenizden yeni bir mesaj aldınız!
//           
//           Ad Soyad: ${result.name}
//           E-posta: ${result.email}
//           Telefon: ${result.phone}
//           Adres: ${result.address}
//           
//           Mesaj:
//           ${result.message}
//         `,
//         html: `
//           <h3>Web sitenizden yeni bir mesaj aldınız!</h3>
//           <p><strong>Ad Soyad:</strong> ${result.name}</p>
//           <p><strong>E-posta:</strong> ${result.email}</p>
//           <p><strong>Telefon:</strong> ${result.phone}</p>
//           <p><strong>Adres:</strong> ${result.address}</p>
//           <p><strong>Mesaj:</strong></p>
//           <p>${result.message}</p>
//         `,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
// 