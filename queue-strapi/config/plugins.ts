export default ({ env }) => ({
    // ...
    "users-permissions": {
        config: {
            register: {
                allowedFields: ["fio", 'roleID', 'faculty', 'speciality', 'group'],
            },
        },
    },
    // ...
});