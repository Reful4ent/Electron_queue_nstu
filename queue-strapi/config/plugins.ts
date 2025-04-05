export default ({ env }) => ({
    // ...
    "users-permissions": {
        config: {
            register: {
                allowedFields: [
                    "surname",
                    "name",
                    "lastname",
                    'roleID',
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