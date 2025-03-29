export default ({ env }) => ({
    // ...
    "users-permissions": {
        config: {
            register: {
                allowedFields: [
                    "fio",
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