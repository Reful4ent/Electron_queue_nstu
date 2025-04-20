import {FC, useCallback, useEffect, useState} from "react";
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import {Button, Collapse, CollapseProps, DatePicker, Form, Image} from "antd";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import './RecordToEmployeePage.scss'
import {IEmployee} from "../MyProfilePage/MyProfilePage.tsx";
import {SocialLinks} from "../../widgets/SocialLinks/SocialLinks.tsx";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {useParams} from "react-router-dom";

export const RecordToEmployeePage: FC = () => {
    const auth = useAuth();
    const { id} = useParams();
    const [form] = Form.useForm();
    const [currentEmployee, setCurrentEmployee] = useState<IEmployee | null>()
    const [consultationsList, setConsultationsList] = useState<CollapseProps['items']>([])
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
        console.log(employeeData)

        setCurrentEmployee(employeeData.data.data)
    },[])

    useEffect(() => {
        if (auth?.jwt) {
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
                    <Form layout={'vertical'} className={'consultationMeFormInner'} onFinish={() => {
                    }} form={form}>
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