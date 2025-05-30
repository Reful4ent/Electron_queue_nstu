import employee from "../../employee/routes/employee";


export default {
    getMyConsultations: async(data) => {
        const consultations = await strapi.documents('api::consultation.consultation').findMany({
            filters: {
                recordedStudents: {
                    student: {
                        id: {
                            $eq: data.id,
                        }
                    }
                }
            },
            populate: {
                recordedStudents: {
                    populate: '*'
                },
                discipline: {
                    populate: '*',
                },
                employee: {
                    populate: '*'
                }
            },
        })

        const sortedConsultations = consultations.sort((a, b) => {
            return new Date(b.dateOfStart).getTime() - new Date(a.dateOfStart).getTime();
        });

        return sortedConsultations;
    },
};
