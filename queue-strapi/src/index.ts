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
        const role = await strapi.documents("plugin::users-permissions.role").findMany({

        });
        const roleID = role.find((item) => item.name == event.params.data.roleName).id;

        await strapi.documents("plugin::users-permissions.user").update({
          documentId: event.result.documentId,
          data: {
            role: {
              id: roleID,
            },
          }
        })

        if(event?.params?.data?.roleName == 'Student') {
          await strapi.documents('api::student.student').create({
            data: {
              faculty: event.params.data.faculty,
              user: event.result.id,
              surname: event.params.data.surname,
              fio: `${event.params.data.surname} ${event.params.data.name} ${event.params.data.lastname ?? ''}`,
              name: event.params.data.name,
              lastname: event.params.data.lastname ?? '',
              group: event.params.data.group
            }
          })
        } else if (event?.params?.data?.roleName == 'Employee') {
          await strapi.documents('api::employee.employee').create({
            data: {
              faculties: event.params.data.faculties,
              user: event.result.id,
              surname: event.params.data.surname,
              name: event.params.data.name,
              fio: `${event.params.data.surname} ${event.params.data.name} ${event.params.data.lastname ?? ''}`,
              lastname: event.params.data.lastname ?? '',
              groups: event.params.data.groups,
              subRole: event.params.data.subRole
            }
          })
        } else if (event?.params?.data?.roleName == 'StudentEmployee') {
          await strapi.documents('api::student.student').create({
            data: {
              faculty: event.params.data.faculty,
              user: event.result.id,
              fio: `${event.params.data.surname} ${event.params.data.name} ${event.params.data.lastname ?? ''}`,
              surname: event.params.data.surname,
              name: event.params.data.name,
              lastname: event.params.data.lastname ?? '',
              group: event.params.data.group
            }
          })

          await strapi.documents('api::employee.employee').create({
            data: {
              faculties: event.params.data.faculties,
              user: event.result.id,
              fio: `${event.params.data.surname} ${event.params.data.name} ${event.params.data.lastname ?? ''}`,
              surname: event.params.data.surname,
              name: event.params.data.name,
              lastname: event.params.data.lastname ?? '',
              groups: event.params.data.groups,
              subRole: event.params.data.subRole
            }
          })
        }
      },
    });
    strapi.db.lifecycles.subscribe({
      models: ["api::consultation.consultation"],

      async afterCreate(event: any) {
        console.log(event);
        const dateOfStart = new Date(event.params.data.dateOfStart);
        const dateOfEnd = new Date(event.params.data.dateOfEnd);
        const minutes = event.params.data.durationNumber * 60 * 1000;

        const intervals = [];
        let currentDate = dateOfStart;

        while (currentDate.getTime() < dateOfEnd.getTime()) {
          const endTime = new Date(currentDate.getTime() + minutes);
          const end = endTime > dateOfEnd ? dateOfEnd : endTime;

          intervals.push(`${currentDate.toISOString()} - ${end.toISOString()}`);
          currentDate = end;
        }

        await strapi.documents('api::consultation.consultation').update({
          documentId: event.result.documentId,
          data: {
            recordedStudents: intervals.map((interval) => ({
              dateStartConsultation: interval.split(' - ')[0],
              dateEndConsultation: interval.split(' - ')[1],
              isOffByStudent: false,
              isOffByEmployee: false,
              notRegisteredUser: null,
              student: null,
            })),
          }
        })

        console.log(intervals);
      }
    });
  },
};
