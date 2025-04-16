export default {
    routes: [
        {
            method: 'POST',
            path: '/delete-student-record',
            handler: 'delete-student-record.deleteStudentRecord',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
