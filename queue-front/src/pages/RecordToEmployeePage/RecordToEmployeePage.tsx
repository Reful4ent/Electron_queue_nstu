import {FC, useCallback, useEffect, useState} from "react";
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import {Button, Collapse, CollapseProps, DatePicker, Form, Image} from "antd";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import './RecordToEmployeePage.scss'
import {IConsultation, IEmployee, IUser} from "../MyProfilePage/MyProfilePage.tsx";
import {SocialLinks} from "../../widgets/SocialLinks/SocialLinks.tsx";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {useParams} from "react-router-dom";
import {RecordConsultationListCard} from "../../entities/Consultation/RecordConsultationListCard.tsx";

export const RecordToEmployeePage: FC = () => {
    const auth = useAuth();
    const { id} = useParams();
    const [form] = Form.useForm();
    const [currentEmployee, setCurrentEmployee] = useState<IEmployee | null>()
    const [consultationsList, setConsultationsList] = useState<CollapseProps['items']>([])
    const [userData, setUserData] = useState<IUser | null>();


    const itemsForBreadcrumbs = [
        {
            title: 'Электронная очередь',
            link: '/'
        },
        {
            title: 'Консультации',
            link: '/consultations/employees'
        },
        {
            title: `${currentEmployee?.surname} ${currentEmployee?.name[0]}. ${currentEmployee?.lastname ? currentEmployee?.lastname[0] + '.' : ''}`
        }
    ]

    const getEmployee = useCallback(async () => {
        const employeeData = await axios.get(
            `${routeURL}/employees/${id}?populate[socialLinks]=*`,
            {
                headers: {
                    Authorization: `Bearer ${auth?.jwt}`,
                }
            }
        )

        setCurrentEmployee(employeeData.data.data)
    },[])

    const getStudentId = useCallback(async () => {
        const myData = await axios.get(
            `${routeURL}/users/me?populate[student]=*
            `,
            {
                headers: {
                    Authorization: `Bearer ${auth?.jwt}`,
                }
            }
        )
        setUserData(myData.data)
    },[])

    const handleFinish = useCallback(async () => {
        const myEmployeeConsultationsData = await axios.post(
            `${routeURL}/getEmployeeConsultation`,
            {
                employee: currentEmployee?.id,
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
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 25}}>
                            {myEmployeeConsultationsData.data[item].map((consultationItem: IConsultation, idx: number) => (
                                <RecordConsultationListCard
                                    key={idx}
                                    consultationItem={consultationItem}
                                    studentId={userData?.student.id}
                                    handleFinish={handleFinish}
                                />
                            ))}
                        </div>
                    )
                }
            )
            idx++;
        }
        setConsultationsList(collapseConsultationsItems);
    }, [currentEmployee])

    useEffect(() => {
        if (auth?.jwt) {
            getStudentId();
            getEmployee();
        }
    }, []);

    return (
        <div className={'consultationMeContainer'}>
            <Breadcrumbs items={itemsForBreadcrumbs}/>
            <p className={'consultationMeHead'}>Консультации</p>
            <div className={'consultationMeContent'}>
                <div className={'profileCard'}>
                    <Image className={'profileImage'} width={128} height={128} preview={false}
                           src={'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Example_of_SVG_code.png/330px-Example_of_SVG_code.png'}/>
                    <div>
                        <div className={'profileFIO'}>
                            {`${currentEmployee?.surname} ${currentEmployee?.name} ${currentEmployee?.lastname ?? ''}`}
                        </div>
                        {/*ToDo: Создать социалс в страпи и сделать универсальным*/}
                        {
                            currentEmployee &&
                            <SocialLinks
                                vkLink={currentEmployee?.socialLinks?.vk || currentEmployee?.socialLinks?.vk}
                                phone={currentEmployee?.socialLinks?.phone || currentEmployee?.socialLinks?.phone}
                                telegramLink={currentEmployee?.socialLinks?.telegram || currentEmployee?.socialLinks?.telegram}
                                email={currentEmployee?.socialLinks?.email || currentEmployee?.socialLinks?.email}
                            />
                        }
                    </div>
                </div>
                <div className={'consultationMeForm'}>
                    <Form layout={'vertical'} className={'consultationMeFormInner'} onFinish={handleFinish} form={form}>
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
            <Collapse items={consultationsList}/>
        </div>
    )
}