import {FC, useCallback, useEffect, useState} from "react";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import {Col, Modal, Row} from "antd";
import './MyProfilePage.scss'
import {ROLES} from "../HomePage/HomePage.tsx";
import {RedirectCard} from "../../widgets/RedirectCard/RedirectCard.tsx";
import {CardSVGEmployeeCon} from "../../shared/ui/CardSVG/CardSVGEmployeeCon.tsx";
import {CardSVGCreate} from "../../shared/ui/CardSVG/CardSVGCreate.tsx";
import {ConsultationStudentProfileCard} from "../../entities/Consultation/ConsultationStudentProfileCard.tsx";
import {ProfileCard} from "../../entities/Profile/ProfileCard/ProfileCard.tsx";


export interface MyProfilePageProps {

}

export interface ISpeciality {
    id:number;
    title: string;
}

export interface IFaculty {
    id:number;
    title: string;
}


export interface IGroup {
    id:number;
    title: string;
    speciality: ISpeciality;
}

export interface IEmployee {
    documentId: string;
    id: number;
    surname: string;
    name: string;
    lastname?: string | null;
    subRole: string;
    socialLinks?: {
        vk?: string,
        phone?: string,
        email?: string,
        telegram?: string,
    }
}

export interface IConsultation {
    id: number;
    documentId: string
    title: string;
    discipline: {
        id: number
        title: string;
    };
    groups: {
        title: string;
    }[];
    isOffByEmployee: boolean;
    corps: string;
    audience: string;
    dateOfStart: string;
    dateOfEnd: string;
    duration: string;
    durationNumber: number;
    recordedStudents: {
        id: number;
        student: {
            id: number;
            fio: string;
            name: string;
            surname: string;
            lastname: string;
            group: IGroup;
        };
        timeRecord: any;
        isOffByEmployee: boolean;
        isOffByStudent: boolean;
        dateStartConsultation: string;
        dateEndConsultation: string;
        notRegisteredUser: {
            name: string;
            surname: string;
        }
    }[];
    employee: IEmployee;
}

export interface IUser {
    id: number;
    email: string;
    surname: string;
    name: string;
    lastname?: string | null;
    student: {
        id: number;
        group: IGroup;
        faculty: IFaculty
        socialLinks?: {
            vk?: string,
            phone?: string,
            email?: string,
            telegram?: string,
        }
    };
    employee: {
        id: number;
        subRole: string;
        groups: IGroup[];
        faculties: IFaculty[];
        consultations: IConsultation[];
        socialLinks?: {
            vk?: string,
            phone?: string,
            email?: string,
            telegram?: string,
        }
    },
}

export const STATUS_OF_CONSULTATION = [
    'Вы записаны!',
    'Запись отменена'
]

export const DAYS = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
];


export const MyProfilePage: FC<MyProfilePageProps> = ({}) => {
    const auth = useAuth();
    const [userData, setUserData] = useState<IUser | null>();
    const [currentRole, setCurrentRole] = useState<string>('')
    const [myConsultationsStudent, setMyConsultationsStudent] = useState<IConsultation[] | null>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [currentConsultationId, setCurrentConsultationId] = useState<string>('')
    const [currentRecordId, setCurrentRecordId] = useState<number | null>()

    const getMyData = useCallback(async () => {
        const myData = await axios.get(
            `${routeURL}/users/me?populate[student][populate][group][populate]=*&populate[student][populate][socialLinks][populate]=*&populate[student][populate][faculty][populate]=*&populate[employee][populate][groups][populate]=*&populate[employee][populate][faculties][populate]=*&populate[employee][populate][consultations][populate]=*&populate[employee][populate][socialLinks][populate]=*
            `,
            {
                headers: {
                    Authorization: `Bearer ${auth?.jwt}`,
                }
            }
        )
        setUserData(myData.data)
        if (myData?.data?.student && myData?.data?.employee) {
            setCurrentRole(ROLES[2])
        } else if (myData?.data?.employee) {
            setCurrentRole(ROLES[1])
        } else if (myData?.data?.student) {
            setCurrentRole(ROLES[0])
        }
        if(myData?.data?.student) {
            const myConsultations = await axios.post(
                `${routeURL}/getMyConsultations`,
                {
                    id: myData?.data?.student?.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth?.jwt}`,
                    }
                }
            )

            setMyConsultationsStudent(myConsultations.data)
        }
    },[])

    useEffect(() => {
        if(auth?.jwt) {
            getMyData()
        }
    }, [auth?.jwt]);

    const handleCancel = useCallback(async () => {
        console.log(currentConsultationId, currentRecordId)
        if (currentConsultationId && currentRecordId) {
            try {
                await axios.post(
                    `${routeURL}/deleteStudentRecord`,
                    {
                        consultationId: currentConsultationId,
                        recordId: currentRecordId,
                        userType: 'Student'
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.jwt}`,
                        }
                    }
                )
            } catch (e) {
                console.log(e)
            }
        }


        const myConsultations = await axios.post(
            `${routeURL}/getMyConsultations`,
            {
                id: userData?.student?.id,
            },
            {
                headers: {
                    Authorization: `Bearer ${auth?.jwt}`,
                }
            }
        )

        setMyConsultationsStudent(myConsultations.data)
    },[currentConsultationId, currentRecordId])


    return (
        <div className={'containerProfile'}>
            <ProfileCard userData={userData ?? null} currentRole={currentRole}/>
            {(currentRole != ROLES[0]) &&
                <div>
                    <Row gutter={[52,52]} style={{marginBottom: 52}}>
                        <Col>
                            <RedirectCard
                                url={`/profile/${userData?.id}/my-consultations`}
                                svgIcon={<CardSVGEmployeeCon/>}
                                name={'Мои консультации'}
                                text={'Просмотр информации существующих консультаций'}
                            />
                        </Col>
                        <Col>
                            <RedirectCard
                                url={`/profile/${userData?.id}/my-consultations/create`}
                                svgIcon={<CardSVGCreate/>}
                                name={'Создание консультации'}
                                text={'Добавление новых дополнительных консультаций для студентов'}/>
                        </Col>
                    </Row>
                </div>
            }
            {currentRole != ROLES[1] &&
                <div className={'myConsultationList'}>
                    {myConsultationsStudent?.map((consultation, index) => (
                        <ConsultationStudentProfileCard
                            key={index}
                            consultation={consultation}
                            userData={userData}
                            setIsModalOpen={setIsModalOpen}
                            setCurrentConsultationId={setCurrentConsultationId}
                            setCurrentRecordId={setCurrentRecordId}
                        />
                    ))}
                </div>
            }
            {/*ToDo: сделать отмену записи при нажатии на ок*/}
            {currentRole == ROLES[0] &&
                <Modal
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    title="Вы точно хотите отменить запись?"
                    okText={'Да'}
                    okType={'primary'}
                    cancelText={'Нет'}
                    onOk={() => {
                        handleCancel();
                        setIsModalOpen(false);
                    }}
                />
            }
        </div>
    )
}