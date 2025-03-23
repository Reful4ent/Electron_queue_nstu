// import type { Core } from '@strapi/strapi';

import type {Core} from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Registering a lifecycle subscriber for the users-permissions plugin
    strapi.db.lifecycles.subscribe({
      models: ["plugin::users-permissions.user"], // Applies only to users in users-permissions

      /**
       * Lifecycle hook triggered after a new user is created.
       * Ensures that a user profile is created with either the provided full name and bio
       * or a default generated username and bio if missing.
       * @param {any} event - The event object containing the created user's details.
       */
      async afterCreate(event: any) {
        const { result, params } = event;
        console.log(event.result)

        await strapi.documents("plugin::users-permissions.user").update({
          documentId: event.result.documentId,
          data: {
            role: {
              id: event.params.data.roleID,
            },
          }
        })

        await strapi.documents('api::student.student').create({
          data: {
            faculty: event.params.data.faculty,
            user: event.result.id,
            fio: event.params.data.fio,
            group: event.params.data.group
          }
        })
        //console.log(event);
      },

    });
  },
};
