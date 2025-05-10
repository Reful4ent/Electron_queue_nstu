import {FC, useCallback, useEffect, useState} from "react";
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import {ProfileCard} from "../../entities/Profile/ProfileCard/ProfileCard.tsx";
import {DAYS, IConsultation, IUser} from "../MyProfilePage/MyProfilePage.tsx";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {ROLES} from "../HomePage/HomePage.tsx";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import './EmployeeMeConsultationsPage.scss'
import {Button} from "antd";
import {ConsultationStudentModalList} from "../../entities/Consultation/ConsultationStudentsModalList.tsx";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { DateRangePicker } from "../../widgets/DateRangePicker/DateRangePicker.tsx";

export const EmployeeMeConsultationsPage: FC = () => {
    const auth = useAuth();
    const [userData, setUserData] = useState<IUser | null>(null);
    const [currentRole, setCurrentRole] = useState<string>('')
    const [consultations, setConsultations] = useState<any[]>([])
    const [modalData, setModalData] = useState<IConsultation | null>();
    const [currentItem, setCurrentItem] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalItemHead, setModalItemHead] = useState<string>('')
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs(),
        dayjs().add(1, 'month')
    ]);
    const [isModalUpdated, setIsModalUpdated] = useState<boolean>(false);
    const [currentConsultationId, setCurrentConsultationId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [initialLoad, setInitialLoad] = useState(true);
    
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

    const handleConsultation = useCallback( (consultationItem: IConsultation, item: string) => {
        console.log(consultationItem)
        setModalData(consultationItem)
        setIsModalOpen(true)
        setModalItemHead(item)
    },[])

    const handleFinish = useCallback(async () => {
        setIsModalUpdated(false)
        setIsLoading(true)
        try {
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
            );
            console.log(myEmployeeConsultationsData.data)
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
                    children: isFirstItem, // Флаг для открытия/закрытия
                    content: (
                        <div className="consultation-dates-container">
                            {myEmployeeConsultationsData.data[item]
                                .sort((a: IConsultation, b: IConsultation) => {
                                    const dateA = new Date(a.dateOfStart);
                                    const dateB = new Date(b.dateOfStart);
                                    return dateA.getTime() - dateB.getTime();
                                })
                                .map((consultationItem: IConsultation, idx: number) => {
                                const dateObj = new Date(consultationItem.dateOfStart);
                                const dayName = DAYS[dateObj.getDay()];
                                const formattedDate = dateObj.getDate().toString().padStart(2, '0') + '.' + 
                                    (dateObj.getMonth() + 1).toString().padStart(2, '0');
                                
                                return (
                                    <div key={idx} className="consultation-date-item">
                                        <div className="consultation-date-info">
                                            <div className="date-day">
                                                {dayName}
                                            </div>
                                            <div className="date-value">
                                                {formattedDate}
                                            </div>
                                        </div>
                                        <div className="consultation-date-info">
                                            <div className="date-day">
                                                Группы:
                                            </div>
                                            <div className="date-value">
                                                {!consultationItem.groups || !consultationItem.groups.length
                                                    ? 'Для всех'
                                                    : consultationItem.groups
                                                        .map((group) => group.title).join(', ')
                                                }
                                            </div>
                                        </div>

                                        <Button
                                            className="consultation-button"
                                            onClick={() => {
                                                handleConsultation(consultationItem, item)
                                                setCurrentItem(item)
                                            }}
                                        >
                                            Узнать записавшихся
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )
                });
                idx++;
            }
            
            setConsultations(collapseConsultationsItems);
            if (isModalOpen) {
                setModalData(myEmployeeConsultationsData.data[currentItem].find((cons: IConsultation) => cons.documentId == currentConsultationId))
            }
        } catch (error) {
            console.error("Ошибка при получении консультаций:", error);
            alert("Произошла ошибка при загрузке консультаций");
        } finally {
            setIsLoading(false);
            setInitialLoad(false);
        }
    }, [userData, dateRange, auth?.jwt, handleConsultation, isModalOpen, currentConsultationId]);

    const onDateRangeChange = (dates: any) => {
        if (dates && dates.length === 2) {
            setDateRange(dates);
        }
    };

    useEffect(() => {
      if(auth?.jwt) {
          getMyData()
      }
  }, [auth?.jwt]);

    useEffect(() => {
        if(isModalUpdated) {
            handleFinish();
        }
    }, [isModalUpdated, currentConsultationId]);

    useEffect(() => {
      if (initialLoad && userData != null && dateRange) {
        handleFinish();
      }
  }, [userData, dateRange, initialLoad]);

    return (
        <div className={'consultationMeContainer'}>
            <Breadcrumbs items={itemsForBreadcrumbs}/>
            <p className={'consultationMeHead'}>Консультации</p>
            <div className={'consultationMeContent'}>
                <ProfileCard
                    userData={userData ?? null}
                    currentRole={currentRole}
                />
                <DateRangePicker 
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                    onFinish={handleFinish}
                    isLoading={isLoading}
                />
            </div>
            {consultations.length > 0 && (
                <div className="consultations-collapse">
                    {consultations.map((item) => (
                        <div key={item.key} className="ant-collapse-item">
                            <div className="ant-collapse-header" onClick={() => {
                                const newConsultations = [...consultations];
                                const idx = newConsultations.findIndex(c => c.key === item.key);
                                if (idx !== -1) {
                                    newConsultations[idx].children = !newConsultations[idx].children;
                                    setConsultations(newConsultations);
                                }
                            }}>
                                {item.children ? <DownOutlined className="collapse-icon" /> : <RightOutlined className="collapse-icon" />}
                                <div className="consultation-subject">
                                    <span>{item.label.props.children[0]}</span>
                                    <span className="room-number">{item.label.props.children[1].props.children}</span>
                                </div>
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
            <ConsultationStudentModalList
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                modalItemHead={modalItemHead}
                modalData={modalData}
                setIsModalUpdated={setIsModalUpdated}
                setCurrentConsultationId={setCurrentConsultationId}
            />
        </div>
    )
}