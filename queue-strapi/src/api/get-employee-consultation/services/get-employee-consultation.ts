
export default {
    getEmployeeConsultation: async(data) => {
        const startDate = new Date(data?.startPeriod);
        const endDate = new Date(data?.endPeriod);
        console.log(data);

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
                    },
                },
                groups: {
                    populate: '*'
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
                },
                isOffByEmployee: {
                    $eq: false,
                },
                recordedStudents: {
                    isOffByEmployee: {
                        $eq: false,
                    },
                    isOffByStudent: {
                        $eq: false,
                    }
                }
            },
        })

        let filteredEmployeeConsultation = employeeConsultation;
        if (data.group) {
            filteredEmployeeConsultation = employeeConsultation.filter((consultation) => {
                if (!consultation.groups || consultation.groups.length === 0) {
                    return true;
                }
                for (const group of consultation.groups) {
                    if (group.title == data.group) {
                        return true;
                    }
                }
                return false;
            });
        }

        const groupedByDisciplineTitle = filteredEmployeeConsultation.reduce((acc, consultation) => {
            const disciplineTitle = consultation.discipline.title;
            if (!acc[disciplineTitle]) {
                acc[disciplineTitle] = [];
            }
            acc[disciplineTitle].push(consultation);
            return acc;
        }, {});


        return groupedByDisciplineTitle;
    },
};
