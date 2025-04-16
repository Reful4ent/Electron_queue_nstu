
export default {
    getEmployeeConsultation: async(data) => {
        const startDate = new Date(data?.startPeriod);
        const endDate = new Date(data?.endPeriod);

        const employeeConsultation = await strapi.documents('api::consultation.consultation').findMany({
            populate: {
                discipline: {
                    populate: '*'
                },
                employee: {
                    populate: '*'
                },
                recordedStudents: {
                    populate: {
                        student: {
                            populate: ['group']
                        },
                        notRegisteredUser: {
                            populate: '*'
                        }
                    }
                }
            },
            filters: {
                employee: {
                    id: data.employee,
                },
                dateOfStart: {
                    $gte: startDate,
                },
                dateOfEnd: {
                    $lte: endDate,
                }
            },
        })

        const groupedByDisciplineTitle = employeeConsultation.reduce((acc, consultation) => {
            const disciplineTitle = consultation.discipline.title; // Путь к title дисциплины
            if (!acc[disciplineTitle]) {
                acc[disciplineTitle] = [];
            }
            acc[disciplineTitle].push(consultation);
            return acc;
        }, {});


        return groupedByDisciplineTitle;
    },
};
