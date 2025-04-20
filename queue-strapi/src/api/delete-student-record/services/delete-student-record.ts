import {up} from "inquirer/lib/utils/readline";

export default {
    deleteStudentRecordByStudent: async(data) => {
        const consultation = await strapi.documents('api::consultation.consultation').findOne({
            documentId: data.consultationId,
            populate: {
                recordedStudents: {
                    populate: '*'
                }
            }
        })

        const studentIndex = consultation.recordedStudents.findIndex(
            (recordedStudent) => recordedStudent.id === data.recordId
        );

        const updatedRecordedStudents = [...consultation.recordedStudents];


        updatedRecordedStudents[studentIndex].isOffByStudent = true

        updatedRecordedStudents.push({
            id: null,
            student: null,
            notRegisteredUser: null,
            isOffByEmployee: false,
            isOffByStudent: false,
            dateStartConsultation: consultation.recordedStudents[studentIndex].dateStartConsultation,
            dateEndConsultation: consultation.recordedStudents[studentIndex].dateEndConsultation,
        });


        await strapi.documents('api::consultation.consultation').update({
            documentId: data.consultationId,
            data: {
                recordedStudents: updatedRecordedStudents.map((updatedRecordedStudent) => ({
                    dateStartConsultation: updatedRecordedStudent.dateStartConsultation,
                    dateEndConsultation: updatedRecordedStudent.dateEndConsultation,
                    isOffByStudent: updatedRecordedStudent.isOffByStudent,
                    isOffByEmployee: updatedRecordedStudent.isOffByEmployee,
                    notRegisteredUser: updatedRecordedStudent.notRegisteredUser,
                    student: updatedRecordedStudent.student,
                })),
            }
        })

        return [];
    },
    deleteStudentRecordByEmployee: async(data) => {
        const consultation = await strapi.documents('api::consultation.consultation').findOne({
            documentId: data.consultationId,
            populate: {
                recordedStudents: {
                    populate: '*'
                }
            }
        })

        const studentIndex = consultation.recordedStudents.findIndex(
            (recordedStudent) => recordedStudent.id === data.recordId
        );

        const updatedRecordedStudents = [...consultation.recordedStudents];


        updatedRecordedStudents[studentIndex].isOffByEmployee = true

        updatedRecordedStudents.push({
            id: null,
            student: null,
            notRegisteredUser: null,
            isOffByEmployee: false,
            isOffByStudent: false,
            dateStartConsultation: consultation.recordedStudents[studentIndex].dateStartConsultation,
            dateEndConsultation: consultation.recordedStudents[studentIndex].dateEndConsultation,
        });


        await strapi.documents('api::consultation.consultation').update({
            documentId: data.consultationId,
            data: {
                recordedStudents: updatedRecordedStudents.map((updatedRecordedStudent) => ({
                    dateStartConsultation: updatedRecordedStudent.dateStartConsultation,
                    dateEndConsultation: updatedRecordedStudent.dateEndConsultation,
                    isOffByStudent: updatedRecordedStudent.isOffByStudent,
                    isOffByEmployee: updatedRecordedStudent.isOffByEmployee,
                    notRegisteredUser: updatedRecordedStudent.notRegisteredUser,
                    student: updatedRecordedStudent.student,
                })),
            }
        })

        return [];
    },
};
