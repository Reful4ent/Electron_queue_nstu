import {FC, useCallback, useEffect, useState} from "react";
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import {ProfileCard} from "../../entities/Profile/ProfileCard/ProfileCard.tsx";
import {DAYS, IConsultation, IUser} from "../MyProfilePage/MyProfilePage.tsx";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {ROLES} from "../HomePage/HomePage.tsx";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import './EmployeeMeConsultationsPage.scss'
import {Button, DatePicker, ConfigProvider} from "antd";
import {ConsultationStudentModalList} from "../../entities/Consultation/ConsultationStudentsModalList.tsx";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import locale from 'antd/locale/ru_RU';
import { CalendarOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

export const EmployeeMeConsultationsPage: FC = () => {
    const auth = useAuth();
    const [userData, setUserData] = useState<IUser | null>();
    const [currentRole, setCurrentRole] = useState<string>('')
    const [consultations, setConsultations] = useState<any[]>([])
    const [modalData, setModalData] = useState<IConsultation | null>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalItemHead, setModalItemHead] = useState<string>('')
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs(),
        dayjs().add(7, 'day')
    ]);
    
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
                startPeriod: dateRange[0],
                endPeriod: dateRange[1],
            },
            {
                headers: {
                    Authorization: `Bearer ${auth?.jwt}`,
                }
            }
        )
        let collapseConsultationsItems = [];
        let idx = 1;
        for (const item of Object.keys(myEmployeeConsultationsData.data)) {
            collapseConsultationsItems.push(
                {
                    key: String(idx),
                    label: (
                        <div className="consultation-subject">
                            <span>{item}</span>
                            <span className="room-number">7-218</span>
                        </div>
                    ),
                    children: (
                        <div className="consultation-dates-container">
                            {myEmployeeConsultationsData.data[item].map((consultationItem: IConsultation, idx: number) => (
                                <div key={idx} className="consultation-date-item">
                                    <div className="consultation-date-info">
                                        <div className="date-day">
                                            {DAYS[new Date(consultationItem.dateOfStart).getDay()]}
                                        </div>
                                        <div className="date-value">
                                            {Intl.DateTimeFormat('ru-RU').format(new Date(consultationItem.dateOfStart))}
                                        </div>
                                    </div>
                                    <Button 
                                        className="consultation-button"
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
    },[userData, dateRange])

    const onDateRangeChange = (dates: any) => {
        if (dates && dates.length === 2) {
            setDateRange(dates);
        }
    };

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
                    <div className={'consultationMeFormInner'}>
                        <p className={'consultationMeFormHead'}>
                            Выберите период
                        </p>
                        <ConfigProvider locale={locale} theme={{
                            token: {
                                colorPrimary: '#00B265',
                                colorSuccess: '#00B265',
                                fontSizeLG: 16,
                                borderRadiusSM: 8,
                            },
                            components: {
                                DatePicker: {
                                    activeBorderColor: '#00B265',
                                    hoverBorderColor: '#00B265',
                                    cellActiveWithRangeBg: '#e6f7ff'
                                }
                            }
                        }}>
                            <div className="date-picker-wrapper">
                                <RangePicker
                                    className="date-range-picker"
                                    value={dateRange}
                                    onChange={onDateRangeChange}
                                    format="DD.MM.YYYY"
                                    allowClear={false}
                                    placeholder={['', '']}
                                    inputReadOnly
                                />
                                <div className="date-fields-container">
                                    <div className="date-field">
                                        <CalendarOutlined className="calendar-icon" />
                                        <div className="date-text">
                                            {dateRange[0]?.format('DD.MM.YYYY')}
                                        </div>
                                    </div>
                                    <div className="arrow-separator">
                                        →
                                    </div>
                                    <div className="date-field">
                                        <CalendarOutlined className="calendar-icon" />
                                        <div className="date-text">
                                            {dateRange[1]?.format('DD.MM.YYYY')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ConfigProvider>
                        <Button 
                            onClick={handleFinish} 
                            className="get-schedule-button"
                        >
                            Получить расписание
                        </Button>
                    </div>
                </div>
            </div>
            {consultations.length > 0 && (
                <div className="consultations-collapse">
                    {consultations.map((item) => (
                        <div key={item.key} className="ant-collapse-item">
                            <div className="ant-collapse-header">
                                {item.label}
                            </div>
                            <div className="ant-collapse-content">
                                <div className="ant-collapse-content-box">
                                    {item.children}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ConsultationStudentModalList
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                modalItemHead={modalItemHead}
                modalData={modalData}
            />
        </div>
    )
}