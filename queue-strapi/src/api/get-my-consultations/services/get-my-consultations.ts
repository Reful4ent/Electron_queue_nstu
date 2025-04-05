

export default {
    getMyConsultations: async(data) => {
        console.log(data);
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
            }
        })
        return consultations;
    },
};
