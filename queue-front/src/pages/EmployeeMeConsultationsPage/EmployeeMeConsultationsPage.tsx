import {FC, useCallback, useEffect, useState} from "react";
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import {ProfileCard} from "../../entities/Profile/ProfileCard.tsx";
import {DAYS, IConsultation, IUser} from "../MyProfilePage/MyProfilePage.tsx";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {ROLES} from "../HomePage/HomePage.tsx";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import './EmployeeMeConsultationsPage.scss'
import {Button, Collapse, CollapseProps, DatePicker, Form} from "antd";
import {ConsultationStudentModalList} from "../../entities/Consultation/ConsultationStudentsModalList.tsx";

export const EmployeeMeConsultationsPage: FC = () => {
    const auth = useAuth();
    const [form] = Form.useForm();
    const [userData, setUserData] = useState<IUser | null>();
    const [currentRole, setCurrentRole] = useState<string>('')
    const [consultations, setConsultations] = useState<CollapseProps['items']>([])
    const [modalData, setModalData] = useState<IConsultation | null>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalItemHead, setModalItemHead] = useState<string>('')
    const itemsForBreadcrumbs = [
        {
            title: 'Электронная очередь',
            link: '/'
        },
        {
            title: 'Мои консультации',
        }
    ]

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

    },[])

    useEffect(() => {
        if(auth?.jwt) {
            getMyData()
        }
    }, [auth?.jwt]);

    const handleConsultation = useCallback( (consultationItem: IConsultation, item: string) => {
        console.log(consultationItem)
        setModalData(consultationItem)
        setIsModalOpen(true)
        setModalItemHead(item)
    },[])

    const handleFinish = useCallback(async () => {
        const myEmployeeConsultationsData = await axios.post(
            `${routeURL}/getEmployeeConsultation`,
            {
                employee: userData?.employee.id,
                startPeriod: form.getFieldValue('period')[0],
                endPeriod: form.getFieldValue('period')[1],
            },
            {
                headers: {
                    Authorization: `Bearer ${auth?.jwt}`,
                }
            }
        )
        let collapseConsultationsItems: CollapseProps['items'] = [];
        let idx = 1;
        for (const item of Object.keys(myEmployeeConsultationsData.data)) {
            collapseConsultationsItems.push(
                {
                    key: String(idx),
                    label: item,
                    children: (
                        <div>
                            {myEmployeeConsultationsData.data[item].map((consultationItem: IConsultation, idx: number) => (
                                <div key={idx}>
                                    <div>
                                        <div className={'date'}>
                                            {DAYS[new Date(consultationItem.dateOfStart).getDay()]}
                                        </div>
                                        <div className={'date'}>
                                            {Intl.DateTimeFormat('ru-RU').format(new Date(consultationItem.dateOfStart))}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            handleConsultation(consultationItem, item)
                                        }}>

                                        Узнать записавшихся
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )
                }
            )
            idx++;
        }
        setConsultations(collapseConsultationsItems);
    },[userData])

    return (
        <div className={'consultationMeContainer'}>
            <Breadcrumbs items={itemsForBreadcrumbs}/>
            <p className={'consultationMeHead'}>Консультации</p>
            <div className={'consultationMeContent'}>
                <ProfileCard
                    userData={userData ?? null}
                    currentRole={currentRole}
                />
                <div className={'consultationMeForm'}>
                    <Form layout={'vertical'} className={'consultationMeFormInner'} onFinish={() => handleFinish()} form={form}>
                        <p className={'consultationMeFormHead'}>
                            Выберите период
                        </p>
                        <Form.Item
                            name={['period']}
                            rules={[{required: true, message: "Выберите период!"}]}
                        >
                            <DatePicker.RangePicker/>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType={'submit'}>Получить расписание</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <Collapse items={consultations}/>
            <ConsultationStudentModalList
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                modalItemHead={modalItemHead}
                modalData={modalData}
            />
        </div>
    )
}