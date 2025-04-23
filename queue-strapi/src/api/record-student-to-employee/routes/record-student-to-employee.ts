export default {
    routes: [
        {
            method: 'POST',
            path: '/recordStudentToEmployee',
            handler: 'record-student-to-employee.recordStudentToEmployee',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
