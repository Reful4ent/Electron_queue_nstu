import {FC, useCallback, useEffect, useState} from "react";
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import {ProfileCard} from "../../entities/Profile/ProfileCard.tsx";
import {DAYS, IConsultation, IUser} from "../MyProfilePage/MyProfilePage.tsx";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {ROLES} from "../HomePage/HomePage.tsx";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import './EmployeeMeConsultationsPage.scss'
import {Button, Collapse, CollapseProps, DatePicker, Form, Modal} from "antd";

export const EmployeeMeConsultationsPage: FC = () => {
    const auth = useAuth();
    const [form] = Form.useForm();
    const [userData, setUserData] = useState<IUser | null>();
    const [currentRole, setCurrentRole] = useState<string>('')
    const [consultations, setConsultations] = useState<CollapseProps['items']>([])
    const [modalData, setModalData] = useState();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
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
            console.log(myEmployeeConsultationsData.data[item])
            collapseConsultationsItems.push(
                {
                    key: String(idx),
                    label: item,
                    children: (
                        <div>
                            {myEmployeeConsultationsData.data[item].map((consultationItem: IConsultation) => (
                                <div>
                                    <div>
                                        <div className={'date'}>
                                            {DAYS[new Date(consultationItem.dateOfStart).getDay()]}
                                        </div>
                                        <div className={'date'}>
                                            {Intl.DateTimeFormat('ru-RU').format(new Date(consultationItem.dateOfStart))}
                                        </div>
                                    </div>
                                    <Button>Узнать записавшихся</Button>
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
            <Modal
                open={isModalOpen}
            />
        </div>
    )
}