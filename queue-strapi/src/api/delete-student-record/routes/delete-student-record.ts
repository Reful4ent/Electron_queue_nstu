export default {
    routes: [
        {
            method: 'POST',
            path: '/deleteStudentRecord',
            handler: 'delete-student-record.deleteStudentRecord',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
