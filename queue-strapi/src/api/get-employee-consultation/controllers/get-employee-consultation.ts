export default {
    getEmployeeConsultation: async (ctx) => {
        const data = ctx.request.body;

        const consultations = await strapi.service(
            'api::get-employee-consultation.get-employee-consultation',
        ).getEmployeeConsultation(
            data,
        );

        return consultations;
    },
};
