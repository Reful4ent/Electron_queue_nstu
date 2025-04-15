export default {
    routes: [
        {
            method: 'POST',
            path: '/getEmployeeConsultation',
            handler: 'get-employee-consultation.getEmployeeConsultation',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
