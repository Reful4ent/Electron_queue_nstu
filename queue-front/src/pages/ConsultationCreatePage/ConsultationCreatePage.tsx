import {FC, useState, useEffect, useCallback} from "react";
import {ProfileCard} from "../../entities/Profile/ProfileCard/ProfileCard.tsx";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {ROLES} from "../HomePage/HomePage.tsx";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import {IUser} from "../MyProfilePage/MyProfilePage.tsx";
import {Button, Checkbox, DatePicker, Form, message, Select, TimePicker, ConfigProvider, Row, Col} from "antd";
import './ConsultationCreatePage.scss'
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import {IGroup, OptionsType} from "../RegistrationPage/RegistrationPage.tsx";
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/ru_RU';
import { CalendarOutlined, ClockCircleOutlined, FieldTimeOutlined, HomeOutlined, BankOutlined, CheckOutlined, RightOutlined } from '@ant-design/icons';
import { Input } from "antd";

export interface IDiscipline {
    id: number;
    title: string;
}

export const INTERVAL_OPTIONS: OptionsType[] = [
    {label: '5 мин.', value: 5},
    {label: '10 мин.', value: 10},
    {label: '15 мин.', value: 15},
    {label: '30 мин.', value: 30},
    {label: '1 час', value: 60},
    {label: '1.5 часа', value: 90},
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
    const [currentRole, setCurrentRole] = useState<string>('');
    const [disciplinesOptions, setDisciplinesOptions] = useState<OptionsType[]>([]);
    const [groupOptions, setGroupOptions] = useState<OptionsType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [audienceOptions, setAudienceOptions] = useState<OptionsType[]>([]);
    const [isDisciplineOpen, setIsDisciplineOpen] = useState<boolean>(false);
    const [isGroupOpen, setIsGroupOpen] = useState<boolean>(false);
    const [selectedCorps, setSelectedCorps] = useState<number | null>(null);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const [selectedDiscipline, setSelectedDiscipline] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [selectedTime, setSelectedTime] = useState<any>(null);
    
    const itemsForBreadcrumbs = [
        {
            title: 'Электронная очередь',
            link: '/'
        },
        {
            title: 'Создание консультации',
        }
    ];

    const getMyData = useCallback(async () => {
        try {
            const myData = await axios.get(
                `${routeURL}/users/me?populate[student][populate][group][populate]=*&populate[student][populate][socialLinks][populate]=*&populate[student][populate][faculty][populate]=*&populate[employee][populate][groups][populate]=*&populate[employee][populate][faculties][populate]=*&populate[employee][populate][consultations][populate]=*&populate[employee][populate][socialLinks][populate]=*`,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.jwt}`,
                    }
                }
            );

            setGroupOptions([{ label: 'Для всех', value: 0 }].concat(
                myData?.data?.employee?.groups?.map((group: IGroup) => ({
                    label: group.title,
                    value: group.id
                })) ?? []
            ));
            
            setUserData(myData.data);
            
            if (myData?.data?.student && myData?.data?.employee) {
                setCurrentRole(ROLES[2]);
            } else if (myData?.data?.employee) {
                setCurrentRole(ROLES[1]);
            } else if (myData?.data?.student) {
                setCurrentRole(ROLES[0]);
            }

            const disciplinesData = await axios.get(
                `${routeURL}/disciplines`,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.jwt}`,
                    }
                }
            );

            setDisciplinesOptions(
                disciplinesData?.data?.data
                    ?.map((discipline: IDiscipline) => ({label: discipline.title, value: discipline.id}))
                    ?.filter((option: OptionsType) => {
                        if (myData?.data?.employee?.subRole === 'LECTURER') {
                            return !option.label.toLowerCase().includes('консультация');
                        } else {
                            return option.label.toLowerCase().includes('консультация');
                        }
                    }) ?? []
            );

            setSelectedGroups([]);
            setSelectedDiscipline(null);
            setSelectedDate(null);
            setSelectedTime(null);
            setSelectedCorps(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            messageApi.error('Ошибка при загрузке данных');
        }
    }, [auth?.jwt]);

    useEffect(() => {
        if (auth?.jwt) {
            getMyData();
        }
    }, [auth?.jwt, getMyData]);


    const handleCorpsChange = useCallback((value: number) => {
        form.setFieldValue('audience', undefined);
        setSelectedCorps(value);
        
        // Генерируем аудитории для выбранного корпуса
        const audiencesByCorps = {
            1: [{ label: '101', value: '101' }, { label: '102', value: '102' }, { label: '103', value: '103' }],
            2: [{ label: '201', value: '201' }, { label: '202', value: '202' }, { label: '203', value: '203' }],
            3: [{ label: '301', value: '301' }, { label: '302', value: '302' }, { label: '303', value: '303' }],
            4: [{ label: '401', value: '401' }, { label: '402', value: '402' }, { label: '403', value: '403' }],
            5: [{ label: '501', value: '501' }, { label: '502', value: '502' }, { label: '503', value: '503' }],
            6: [{ label: '601', value: '601' }, { label: '602', value: '602' }, { label: '603', value: '603' }],
            7: [{ label: '701', value: '701' }, { label: '702', value: '702' }, { label: '703', value: '703' }],
        };
        
        const options = audiencesByCorps[value as keyof typeof audiencesByCorps] || [];
        
        setAudienceOptions(options);
    }, [form]);

    const handleFinish = useCallback(async () => {
        const timeStart = formatTime(form.getFieldValue('time')[0]);
        const timeEnd = formatTime(form.getFieldValue('time')[1]);
        const date = formatDate(form.getFieldValue('date'));

        console.log(form.getFieldValue('duration'))

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
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${auth?.jwt}`,
                    }
                }
            );
            
            messageApi.open({
                type: 'success',
                content: 'Консультация успешно добавлена!',
            });
            setSelectedGroups([]);
            setSelectedDiscipline(null);
            form.setFieldValue('audience', null)
            form.setFieldValue('groups', null)
            form.setFieldValue('corps', null)
            form.setFieldValue('date', null)
            form.setFieldValue('discipline', null)
            form.setFieldValue('duration', null)
            form.setFieldValue('title', null)
            form.setFieldValue('time', null)
            setSelectedDate(null);
            setSelectedTime(null);
            setSelectedCorps(null);
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: error.message,
            });
        }
    }, [userData, auth?.jwt]);

    return (
        <div className="consultationCreateContainer">
            {contextHolder}
            <Breadcrumbs items={itemsForBreadcrumbs}/>
            <p className="consultationCreateHead">Создание консультации</p>
            <div className="consultationCreateContent">
                <ProfileCard
                    userData={userData ?? null}
                    currentRole={currentRole}
                />
                <div className="consultationCreateForm">
                    <ConfigProvider
                        theme={{
                            components: {
                                Select: {
                                    colorPrimary: '#00B265',
                                    colorPrimaryHover: '#00B265',
                                    lineWidth: 1,
                                    colorBorder: '#d9d9d9',
                                    borderRadius: 8,
                                },
                                DatePicker: {
                                    colorPrimary: '#00B265',
                                    colorPrimaryHover: '#00B265',
                                    lineWidth: 1,
                                    colorBorder: '#d9d9d9',
                                    borderRadius: 8,
                                },
                                Checkbox: {
                                    colorPrimary: '#00B265',
                                    borderRadius: 3,
                                    lineWidth: 1,
                                }
                            }
                        }}
                    >
                        <Form 
                            form={form} 
                            className="consultationAppointmentCard"
                            onFinish={handleFinish}
                            layout="vertical"
                            requiredMark={false}
                        >
                            <h2 className="consultationAppointmentTitle">Назначение консультации</h2>
                            
                            <div className="appointmentFormFields">
                                <Form.Item 
                                    name="title" 
                                    className="formItem"
                                    rules={[{ required: false, message: 'Введите название консультации' }]}
                                >
                                    <Input
                                        placeholder="Название консультации"
                                        className="consultationInput"
                                    />
                                </Form.Item>
                                
                                <Form.Item 
                                    name="discipline" 
                                    className="formItem"
                                    rules={[{ required: true, message: 'Пожалуйста, выберите дисциплину' }]}
                                >
                                    <Select 
                                        placeholder="Выберите дисциплину" 
                                        options={disciplinesOptions}
                                        suffixIcon={null}
                                        className={`formSelect ${isDisciplineOpen ? 'ant-select-open' : ''}`}
                                        dropdownStyle={{ borderRadius: '12px' }}
                                        onDropdownVisibleChange={(open) => setIsDisciplineOpen(open)}
                                        showSearch
                                        allowClear
                                        value={selectedDiscipline}
                                        onChange={(value) => {
                                            setSelectedDiscipline(value);
                                            form.setFieldsValue({ discipline: value });
                                        }}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                    <RightOutlined className={`select-arrow ${isDisciplineOpen ? 'open' : ''}`} />
                                </Form.Item>
                                
                                <Form.Item 
                                    name="groups" 
                                    className="formItem"
                                    rules={[{ required: true, message: 'Пожалуйста, выберите группу' }]}
                                >
                                    <Select
                                        placeholder="Выберите группу"style={{ color: '#00B265' }}
                                        options={groupOptions}
                                        mode="multiple"
                                        suffixIcon={null}
                                        className={`formSelect ${isGroupOpen ? 'ant-select-open' : ''}`}
                                        dropdownStyle={{ borderRadius: '12px' }}
                                        menuItemSelectedIcon={<CheckOutlined style={{ color: '#00B265' }} />}
                                        onDropdownVisibleChange={(open) => setIsGroupOpen(open)}
                                        value={selectedGroups}
                                        onChange={(value) => {
                                            let newValue: number[];
                                            if (value.includes(0)) {
                                                newValue = [0];
                                            } else {
                                                newValue = value.filter((v: number) => v !== 0);
                                            }
                                            setSelectedGroups(newValue);
                                            form.setFieldsValue({ groups: newValue });
                                        }}
                                    />
                                    <RightOutlined className={`select-arrow ${isGroupOpen ? 'open' : ''}`} />
                                </Form.Item>
                                
                                <Row className="dateTimeRow" gutter={10}>
                                    <Col xs={24} sm={8}>
                                        <Form.Item 
                                            name="date" 
                                            className="formItem datePickerItem"
                                            rules={[{ required: true, message: 'Выберите дату' }]}
                                        >
                                            <div className="icon-left">
                                                <CalendarOutlined className="fieldIcon" />
                                            </div>
                                            <DatePicker 
                                                format="DD.MM.YYYY" 
                                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                                placeholder={dayjs().format('DD.MM.YYYY')}
                                                suffixIcon={null}
                                                className="datePicker"
                                                locale={locale}
                                                value={selectedDate}
                                                onChange={(date) => {
                                                    setSelectedDate(date);
                                                    form.setFieldsValue({ date });
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Form.Item 
                                            name="time" 
                                            className="formItem timePickerItem"
                                            rules={[{ required: true, message: 'Выберите время' }]}
                                        >
                                            <div className="icon-left">
                                                <ClockCircleOutlined className="fieldIcon" />
                                            </div>
                                            <TimePicker.RangePicker
                                                format="HH:mm"
                                                placeholder={['12:00', '13:30']}
                                                minuteStep={15}
                                                separator="-"
                                                suffixIcon={null}
                                                className="timePicker timeRangePicker"
                                                locale={locale}
                                                disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 23]}
                                                allowClear={false}
                                                bordered={true}
                                                value={selectedTime}
                                                onChange={(time) => {
                                                    setSelectedTime(time);
                                                    form.setFieldsValue({ time });
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Form.Item 
                                            name={['duration']}
                                            className="formItem durationItem"
                                            rules={[{ required: true, message: 'Выберите длительность' }]}
                                        >
                                            <div className="icon-left">
                                                <FieldTimeOutlined className="fieldIcon" />
                                            </div>
                                            <Select 
                                                options={INTERVAL_OPTIONS}
                                                placeholder="15 мин."
                                                suffixIcon={null}
                                                className="formSelect"
                                                onSelect={(value) => form.setFieldValue('duration', value) }
                                                dropdownStyle={{ borderRadius: '8px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row className="locationRow" gutter={10}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item 
                                            name="corps" 
                                            className="formItem corpsItem"
                                            rules={[{ required: true, message: 'Выберите корпус' }]}
                                        >
                                            <div className="icon-left">
                                                <HomeOutlined className="fieldIcon" />
                                            </div>
                                            <Select 
                                                placeholder="Корпус" 
                                                options={CORP_OPTIONS}
                                                suffixIcon={null}
                                                className="corpsSelect"
                                                dropdownStyle={{ borderRadius: '8px' }}
                                                onChange={(value) => {
                                                    form.setFieldsValue({ corps: value });
                                                    handleCorpsChange(value);
                                                }}
                                            />
                                            <RightOutlined className="select-arrow" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item 
                                            name="audience" 
                                            className="formItem audienceItem"
                                            rules={[{ required: true, message: 'Выберите аудиторию' }]}
                                        >
                                            <div className="icon-left">
                                                <BankOutlined className="fieldIcon" />
                                            </div>
                                            <Select
                                                placeholder="Аудитория"
                                                options={audienceOptions}
                                                suffixIcon={null}
                                                className="audienceSelect"
                                                dropdownStyle={{ borderRadius: '8px' }}
                                                disabled={!selectedCorps}
                                                showSearch
                                                allowClear
                                                onChange={(value) => {
                                                    form.setFieldsValue({ audience: value });
                                                }}
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            />
                                            <RightOutlined className="select-arrow" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/*
                                    <Form.Item
                                        name="permanent"
                                        className="formItem permanentCheckbox"
                                        valuePropName="checked"
                                    >
                                        <Checkbox>
                                            Сделать постоянной
                                        </Checkbox>
                                    </Form.Item>
                                */}

                                <Button 
                                    className="submitButton" 
                                    htmlType="submit"
                                    loading={isLoading}
                                >
                                    Создать
                                </Button>
                            </div>
                        </Form>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
};