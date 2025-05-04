export default {
    deleteStudentRecord: async (ctx) => {
        const data = ctx.request.body;

        let record;
        if (data.userType === 'Student') {
            record = await strapi.service(
                'api::delete-student-record.delete-student-record',
            ).deleteStudentRecordByStudent(
                data,
            );
        } else if (data.userType === 'Employee') {
            record = await strapi.service(
                'api::delete-student-record.delete-student-record',
            ).deleteStudentRecordByEmployee(
                data,
            );
        }


        return record;
    },
};
