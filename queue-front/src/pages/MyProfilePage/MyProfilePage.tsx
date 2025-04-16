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
import {ProfileCard} from "../../entities/Profile/ProfileCard.tsx";


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
    id: number;
    surname: string;
    name: string;
    lastname?: string | null;
    subRole: string;
}

export interface IConsultation {
    id: number;
    title: string;
    discipline: {
        id: number
        title: string;
    };
    isOffByEmployee: boolean;
    corps: string;
    audience: string;
    dateOfStart: string;
    dateOfEnd: string;
    duration: string;
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
    };
    employee: {
        id: number;
        subRole: string;
        groups: IGroup[];
        faculties: IFaculty[];
        consultations: IConsultation[];
    }
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

    const getMyData = useCallback(async () => {
        const myData = await axios.get(
            `${routeURL}/users/me?populate[student][populate][group][populate]=*&populate[student][populate][faculty][populate]=*&populate[employee][populate][groups][populate]=*&populate[employee][populate][faculties][populate]=*&populate[employee][populate][consultations][populate]=*
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
    },[])

    useEffect(() => {
        if(auth?.jwt) {
            getMyData()
        }
    }, [auth?.jwt]);


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
                            consultation={consultation}
                            userData={userData}
                            index={index}
                            setIsModalOpen={setIsModalOpen}
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
                        setIsModalOpen(false);
                    }}
                />
            }
        </div>
    )
}