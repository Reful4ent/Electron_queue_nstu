export default {
    recordStudentToEmployee: async (ctx) => {
        const data = ctx.request.body;

        const record = await strapi.service(
            'api::record-student-to-employee.record-student-to-employee',
        ).recordStudentToEmployee(
            data,
        );

        return record;
    },
};
