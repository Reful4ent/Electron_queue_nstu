import {FC, useCallback, useEffect, useState} from "react";
import {ProfileCard} from "../../entities/Profile/ProfileCard/ProfileCard.tsx";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {ROLES} from "../HomePage/HomePage.tsx";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import {IUser} from "../MyProfilePage/MyProfilePage.tsx";
import {Button, Checkbox, DatePicker, Form, Input, message, Select, TimePicker} from "antd";
import './ConsultationCreatePage.scss'
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import {IGroup, OptionsType} from "../RegistrationPage/RegistrationPage.tsx";
import dayjs from 'dayjs';

export interface IDiscipline {
    id: number;
    title: string;
}

export const INTERVAL_OPTIONS: OptionsType[] = [
    {label: '5м', value: 5},
    {label: '10м', value: 10},
    {label: '15м', value: 15},
    {label: '30м', value: 30},
    {label: '1ч', value: 60},
    {label: '1ч 30м', value: 90},
]

export const CORP_OPTIONS: OptionsType[] = [
    {label: '1', value: 1},
    {label: '2', value: 2},
    {label: '3', value: 3},
    {label: '4', value: 4},
    {label: '5', value: 5},
    {label: '6', value: 6},
    {label: '7', value: 7},
]

function formatTime(dateString: any) {
    const date = new Date(dateString);
    return date.toISOString().split('.')[0] + '.000Z';
}

function formatDate(dateString: any) {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date.toISOString().split('.')[0] + '.000Z';
}

export const ConsultationCreatePage: FC = () => {
    const auth = useAuth();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [userData, setUserData] = useState<IUser | null>();
    const [currentRole, setCurrentRole] = useState<string>('')
    const [disciplinesOptions, setDisciplinesOptions] = useState<OptionsType[]>([])
    const [groupOptions, setGroupOptions] = useState<OptionsType[]>([])
    const itemsForBreadcrumbs = [
        {
            title: 'Электронная очередь',
            link: '/'
        },
        {
            title: 'Создание консультации',
        }
    ]

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

        console.log(myData.data)

        setGroupOptions([{ label: 'Для всех', value: 0 }].concat(
            myData?.data?.employee?.groups?.map((group: IGroup) => ({
                label: group.title,
                value: group.id
            }))) ?? [])
        setUserData(myData.data)
        if (myData?.data?.student && myData?.data?.employee) {
            setCurrentRole(ROLES[2])
        } else if (myData?.data?.employee) {
            setCurrentRole(ROLES[1])
        } else if (myData?.data?.student) {
            setCurrentRole(ROLES[0])
        }

        const disciplinesData = await axios.get(
            `${routeURL}/disciplines
            `,
            {
                headers: {
                    Authorization: `Bearer ${auth?.jwt}`,
                }
            }
        )

        setDisciplinesOptions(
            disciplinesData?.data?.data
                ?.map((discipline: IDiscipline) => ({label: discipline.title, value: discipline.id}))
                ?.filter((option: OptionsType) => {
                    if (myData?.data?.employee?.subRole == 'LECTURER') {
                        return !option.label.toLowerCase().includes('консультация')
                    } else {
                        return option.label.toLowerCase().includes('консультация')
                    }
                })
            ??
            []
        )
    },[])

    useEffect(() => {
        if(auth?.jwt) {
            getMyData()
        }
    }, [auth?.jwt]);

    const handleFinish = useCallback(async () => {
        const timeStart = formatTime(form.getFieldValue('time')[0]);
        const timeEnd = formatTime(form.getFieldValue('time')[1]);
        const date = formatDate(form.getFieldValue('date'));
        try {
            await axios.post(
                `${routeURL}/consultations`,
                {
                    data: {
                        employee: userData?.employee.id,
                        title: form.getFieldValue('title'),
                        corps: String(form.getFieldValue('corps')),
                        audience: form.getFieldValue('audience'),
                        groups: form.getFieldValue('groups').includes(0) ? [] : form.getFieldValue('groups'),
                        duration: INTERVAL_OPTIONS?.find((duration) => duration?.value == form.getFieldValue('duration'))?.label,
                        durationNumber: form.getFieldValue('duration'),
                        discipline: form.getFieldValue('discipline'),
                        dateOfStart: `${date.split('T')[0]}T${timeStart.split('T')[1]}`,
                        dateOfEnd: `${date.split('T')[0]}T${timeEnd.split('T')[1]}`,
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${auth?.jwt}`,
                    }
                }
            )
            messageApi.open({
                type: 'success',
                content: 'Консультация успешно добавлена!',
            });
        } catch (e: any) {
            messageApi.open({
                type: 'error',
                content: e.message,
            });
        }
    },[userData])

    return (
        <div className={'consultationCreateContainer'}>
            {contextHolder}
            <Breadcrumbs items={itemsForBreadcrumbs}/>
            <p className={'consultationCreateHead'}>Создание консультации</p>
            <div className={'consultationCreateContent'}>
                <ProfileCard
                    userData={userData ?? null}
                    currentRole={currentRole}
                />
                <div className={'consultationCreateForm'}>
                    <Form layout={'vertical'} className={'consultationCreateFormInner'} form={form} onFinish={handleFinish}>
                        <p className={'consultationCreateFormHead'}>Назначение консультации</p>
                        <Form.Item
                            name={['title']}
                            rules={[{required: true, message: "Введите название!"}]}
                        >
                            <Input placeholder={'Название консультации'}/>
                        </Form.Item>
                        <Form.Item
                            name={['discipline']}
                            rules={[{required: true, message: "Выберите дисциплину!"}]}
                        >
                            <Select placeholder={'Выберите дисциплину'} options={disciplinesOptions}/>
                        </Form.Item>
                        <Form.Item
                            name={['groups']}
                            rules={[{required: true, message: "Выберите группы!"}]}
                        >
                            <Select
                                placeholder={'Выберите группы'}
                                options={groupOptions} mode={'multiple'}
                                onChange={(value) => {
                                    if (value.includes(0)) {
                                        form.setFieldValue('groups',[0])
                                    }
                                }}
                            />
                        </Form.Item>
                        <div className={'consultationCreateDateContainer'}>
                            <Form.Item
                                name={['date']}
                                rules={[{required: true, message: "Выберите дату проведения!"}]}
                            >
                                <DatePicker format="DD.MM.YYYY" minDate={dayjs()}/>
                            </Form.Item>
                            <Form.Item
                                name={['time']}
                                rules={[{required: true, message: "Выберите время!"}]}
                            >
                                <TimePicker.RangePicker
                                    format={'HH:mm'}
                                    minuteStep={15}
                                    disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 23]}
                                />
                            </Form.Item>
                            <Form.Item
                                name={['duration']}
                                rules={[{required: true, message: "Выберите время одной консультации!"}]}
                            >
                                <Select options={INTERVAL_OPTIONS} style={{width: 100}}/>
                            </Form.Item>
                        </div>
                        <Form.Item
                            name={['corps']}
                            rules={[{required: true, message: "Выберите корпус!"}]}
                        >
                            <Select placeholder={'Корпус'} options={CORP_OPTIONS}/>
                        </Form.Item>
                        <Form.Item
                            name={['audience']}
                            rules={[{required: true, message: "Выберите аудиторию!"}]}
                        >
                            <Input placeholder={'Аудитория'}/>
                        </Form.Item>
                        <div><Checkbox/> Сделать постоянной</div>
                        <Form.Item>
                            <Button htmlType={'submit'}>Выбрать</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}