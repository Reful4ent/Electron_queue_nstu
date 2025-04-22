
import { errors } from '@strapi/utils';
import ignore from "ignore";
const { ApplicationError } = errors;

export default {
    recordStudentToEmployee: async(data) => {
        const consultation = await strapi.documents('api::consultation.consultation').findOne({
            documentId: data?.consultationId,
            populate: {
                recordedStudents: {
                    populate: '*'
                }
            }
        })

        if(consultation.recordedStudents.find((item) => item.id == data.recordId)?.student?.id) {
            return new errors.ApplicationError('На это время записан кто-то другой!');
        }

        if (data.recordId && data.consultationId && data.studentId) {
            for (const recordedStudent of consultation?.recordedStudents) {
                if (recordedStudent?.student?.id == data.studentId &&
                    recordedStudent.isOffByEmployee == false &&
                    recordedStudent.isOffByStudent == false &&
                    consultation.isOffByEmployee == false
                ) {
                    return new errors.ApplicationError('У вас уже есть запись на эту консультацию!');
                }
            }

            const recordIndex = consultation.recordedStudents.findIndex(
                (record) => record?.id === data.recordId
            );

            const updatedRecordedStudents = [...consultation.recordedStudents];


            updatedRecordedStudents[recordIndex].student = await strapi.entityService.findOne('api::student.student', data.studentId);

            await strapi.documents('api::consultation.consultation').update({
                documentId: data.consultationId,
                data: {
                    recordedStudents: updatedRecordedStudents,
                }
            })
            return [];
        } else if (data.recordId && data.consultationId && data.surname && data.name) {
            console.log(data.recordId,data.consultationId, data.surname, data.name)
            const recordIndex = consultation.recordedStudents.findIndex(
                (record) => record?.id === data.recordId
            );
            const updatedRecordedStudents = [...consultation.recordedStudents];

            updatedRecordedStudents[recordIndex].notRegisteredUser = {
                surname: data.surname,
                name: data.name,
            } as any;

            try {
                await strapi.documents('api::consultation.consultation').update({
                    documentId: data.consultationId,
                    data: {
                        recordedStudents: updatedRecordedStudents,
                    }
                })
            } catch (e) {
                console.log(e)
            }

            return [];
        }
        return new errors.ApplicationError('Ошибка!');
    },
};
