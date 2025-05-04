export default {
    routes: [
        {
            method: 'POST',
            path: '/getMyConsultations',
            handler: 'get-my-consultations.getMyConsultations',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
