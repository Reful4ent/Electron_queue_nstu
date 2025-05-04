export default {
    getMyConsultations: async (ctx) => {
        const data = ctx.request.body;

        const consultations = await strapi.service(
            'api::get-my-consultations.get-my-consultations',
        ).getMyConsultations(
            data,
        );

        return consultations;
    },
};
