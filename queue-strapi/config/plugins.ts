export default ({ env }) => ({
    // ...
    "users-permissions": {
        config: {
            register: {
                allowedFields: [
                    "surname",
                    "name",
                    "lastname",
                    'roleName',
                    'faculty',
                    'faculties',
                    'speciality',
                    'specialities',
                    'group',
                    'groups',
                    'subRole'
                ],
            },
        },
    },
    // ...
});