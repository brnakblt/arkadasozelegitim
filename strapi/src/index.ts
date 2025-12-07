// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    const publicRole = await strapi
      .db.query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (!publicRole) {
      console.warn("Public role not found. Skipping permission bootstrap.");
      return;
    }

    const contentTypesToOpen = [
      "api::hero.hero",
      "api::service.service",
      "api::process.process",
      "api::faq.faq",
      "api::gallery.gallery",
      "api::team-member.team-member",
    ];

    for (const uid of contentTypesToOpen) {
      const permissions = await strapi
        .db.query("plugin::users-permissions.permission")
        .findMany({
          where: {
            role: publicRole.id,
            action: { $in: [`${uid}.find`, `${uid}.findOne`] },
          },
        });

      // Simple check: if we don't have exactly 2 permissions (find + findOne), add them.
      // Or just check if fewer than expected.
      const existingActions = permissions.map((p: any) => p.action);
      const actionsToAdd = [`${uid}.find`, `${uid}.findOne`].filter(
        (action) => !existingActions.includes(action)
      );

      if (actionsToAdd.length > 0) {
        console.log(`Granting Public read access (missing: ${actionsToAdd.join(", ")}) to ${uid}...`);
        for (const action of actionsToAdd) {
          await strapi.db.query("plugin::users-permissions.permission").create({
            data: {
              role: publicRole.id,
              action: action,
            },
          });
        }
      }
    }

    await seedData(strapi);
  },
};

async function seedData(strapi: any) {
  const contentTypes = {
    hero: "api::hero.hero",
    service: "api::service.service",
    process: "api::process.process",
    faq: "api::faq.faq",
    teamMember: "api::team-member.team-member",
  };

  try {
    // Helper to get the correct API (handling v5 vs v4 transition if needed, but prioritizing documents for v5)
    // We assume v5 based on package.json, so we use strapi.documents.

    // Seed Hero
    const heroCount = await strapi.documents(contentTypes.hero).count();
    if (heroCount === 0) {
      console.log("Seeding Hero data...");
      await strapi.documents(contentTypes.hero).create({
        data: {
          title: "Empowering Your Future",
          subtitle: "Professional Special Education & Consultancy",
          description: "We provide dedicated support and personalized education plans to help every individual shine.",
          stats: [
            { label: "Students", value: "500+" },
            { label: "Teachers", value: "50+" },
            { label: "Years", value: "10+" },
          ],
        },
        status: 'published',
      });
    }

    // Seed Services
    const serviceCount = await strapi.documents(contentTypes.service).count();
    if (serviceCount === 0) {
      console.log("Seeding Services data...");
      const services = [
        {
          title: "Special Education",
          description: "Tailored educational programs for children with special needs.",
          icon: "book",
          slug: "special-education",
          features: [{ text: "Individualized Plans" }, { text: "Expert Tutors" }],
        },
        {
          title: "Speech Therapy",
          description: "Helping children overcome communication challenges.",
          icon: "speech",
          slug: "speech-therapy",
          features: [{ text: "Articulation Therapy" }, { text: "Language Development" }],
        },
        {
          title: "Family Counseling",
          description: "Support and guidance for families.",
          icon: "users",
          slug: "family-counseling",
          features: [{ text: "Parental Guidance" }, { text: "Sibling Workshops" }],
        },
      ];
      for (const service of services) {
        await strapi.documents(contentTypes.service).create({
          data: service,
          status: 'published',
        });
      }
    }

    // Seed Processes
    const processCount = await strapi.documents(contentTypes.process).count();
    if (processCount === 0) {
      console.log("Seeding Processes data...");
      const processes = [
        {
          number: "01",
          title: "Consultation",
          description: "Initial meeting to understand needs.",
          icon: "chat",
        },
        {
          number: "02",
          title: "Assessment",
          description: "Detailed evaluation of skills.",
          icon: "search",
        },
        {
          number: "03",
          title: "Planning",
          description: "Creating a personalized roadmap.",
          icon: "map",
        },
      ];
      for (const process of processes) {
        await strapi.documents(contentTypes.process).create({
          data: process,
          status: 'published',
        });
      }
    }

    // Seed FAQs
    const faqCount = await strapi.documents(contentTypes.faq).count();
    if (faqCount === 0) {
      console.log("Seeding FAQs data...");
      const faqs = [
        {
          question: "What ages do you serve?",
          answer: "We support children and adolescents from ages 3 to 18.",
        },
        {
          question: "Do you offer online sessions?",
          answer: "Yes, we offer both in-person and remote therapy sessions.",
        },
        {
          question: "How do I get started?",
          answer: "Contact us via the form or call us to schedule a consultation.",
        },
      ];
      for (const faq of faqs) {
        await strapi.documents(contentTypes.faq).create({
          data: faq,
          status: 'published',
        });
      }
    }

    // Seed Team Members
    const teamCount = await strapi.documents(contentTypes.teamMember).count();
    if (teamCount === 0) {
      console.log("Seeding Team Members data...");
      const members = [
        {
          name: "Dr. Ayşe Yılmaz",
          title: "Lead Therapist",
          order: 1,
          category: { role: "Specialist" },
        },
        {
          name: "Mehmet Demir",
          title: "Educational Coordinator",
          order: 2,
          category: { role: "Coordinator" },
        },
        {
          name: "Zeynep Kaya",
          title: "Child Psychologist",
          order: 3,
          category: { role: "Psychologist" },
        },
      ];
      for (const member of members) {
        await strapi.documents(contentTypes.teamMember).create({
          data: member,
          status: 'published',
        });
      }
    }
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}
