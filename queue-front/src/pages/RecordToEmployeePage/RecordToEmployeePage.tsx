import {FC, useCallback, useEffect, useState} from "react";
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import {Image} from "antd";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import './RecordToEmployeePage.scss'
import {IConsultation, IEmployee, IUser} from "../MyProfilePage/MyProfilePage.tsx";
import {SocialLinks} from "../../widgets/SocialLinks/SocialLinks.tsx";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {useParams} from "react-router-dom";
import {RecordConsultationListCard} from "../../entities/Consultation/RecordConsultationListCard.tsx";
import dayjs from "dayjs";
import { DateRangePicker } from "../../widgets/DateRangePicker/DateRangePicker.tsx";
import { DownOutlined, RightOutlined } from '@ant-design/icons';

interface ConsultationItem {
    key: string;
    label: React.ReactNode;
    children: boolean;
    content: React.ReactNode;
}

export const RecordToEmployeePage: FC = () => {
    const auth = useAuth();
    const { id} = useParams();
    const [currentEmployee, setCurrentEmployee] = useState<IEmployee | null>()
    const [consultationsList, setConsultationsList] = useState<ConsultationItem[]>([])
    const [userData, setUserData] = useState<IUser | null>();
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs(),
        dayjs().add(7, 'day')
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);


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

    const onDateRangeChange = (dates: any) => {
        if (dates && dates.length === 2) {
            setDateRange(dates);
        }
    };

    const handleFinish = useCallback(async () => {
        setIsLoading(true);
        try {
            const myEmployeeConsultationsData = await axios.post(
                `${routeURL}/getEmployeeConsultation`,
                {
                    employee: currentEmployee?.id,
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
                const isFirstItem = idx === 1;
                const firstConsultation = myEmployeeConsultationsData.data[item][0];
                const roomInfo = firstConsultation.corps && firstConsultation.audience
                    ? `${firstConsultation.corps}-${firstConsultation.audience}`
                    : 'Аудитория не указана';
                
                collapseConsultationsItems.push({
                    key: String(idx),
                    label: (
                        <div className="consultation-subject">
                            <span>{item}</span>
                            <span className="room-number">{roomInfo}</span>
                        </div>
                    ),
                    children: isFirstItem,
                    content: (
                        <div className="consultation-dates-container">
                            {myEmployeeConsultationsData.data[item]
                                .sort((a: IConsultation, b: IConsultation) => {
                                    const dateA = new Date(a.dateOfStart);
                                    const dateB = new Date(b.dateOfStart);
                                    return dateA.getTime() - dateB.getTime();
                                })
                                .map((consultationItem: IConsultation, idx: number) => {
                                    return (
                                        <RecordConsultationListCard
                                            key={idx}
                                            consultationItem={consultationItem}
                                            studentId={userData?.student.id}
                                            handleFinish={handleFinish}
                                        />
                                    );
                                })
                            }
                        </div>
                    )
                });
                idx++;
            }
            setConsultationsList(collapseConsultationsItems);
        } catch (error) {
            console.error("Ошибка при получении консультаций:", error);
            alert("Произошла ошибка при загрузке консультаций");
        } finally {
            setIsLoading(false);
        }
    }, [currentEmployee, dateRange, userData, auth?.jwt])

    useEffect(() => {
        if (auth?.jwt) {
            getStudentId();
        }
        getEmployee();
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
                <DateRangePicker 
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                    onFinish={handleFinish}
                    isLoading={isLoading}
                />
            </div>
            
            {consultationsList.length > 0 && (
                <div className="consultations-collapse">
                    {consultationsList.map((item) => (
                        <div key={item.key} className="ant-collapse-item">
                            <div className="ant-collapse-header" onClick={() => {
                                const newConsultations = [...consultationsList];
                                const idx = newConsultations.findIndex(c => c.key === item.key);
                                if (idx !== -1) {
                                    newConsultations[idx].children = !newConsultations[idx].children;
                                    setConsultationsList(newConsultations);
                                }
                            }}>
                                {item.children ? <DownOutlined className="collapse-icon" /> : <RightOutlined className="collapse-icon" />}
                                {item.label}
                            </div>
                            {item.children && (
                                <div className="ant-collapse-content ant-collapse-content-active">
                                    <div className="ant-collapse-content-box">
                                        {item.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}