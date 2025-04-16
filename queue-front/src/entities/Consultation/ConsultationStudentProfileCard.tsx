import {DAYS, IConsultation, IUser, STATUS_OF_CONSULTATION} from "../../pages/MyProfilePage/MyProfilePage.tsx";
import {FC} from "react";
import {Button, ConfigProvider, Image} from "antd";
import {SUBROLES_OPTIONS} from "../../pages/RegistrationPage/RegistrationPage.tsx";
import {Link} from "react-router-dom";
import './ConsultationStudentProfileCard.scss'


export interface IConsultationStudentProfileCard {
    consultation: IConsultation;
    userData?: IUser | null;
    index: number
    setIsModalOpen: (isModalOpen: boolean) => void
}

export const ConsultationStudentProfileCard: FC<IConsultationStudentProfileCard> = ({consultation, userData, setIsModalOpen, index}) => {
    return (
        <div
            key={index}
            className={(!consultation?.recordedStudents.find((student) => student?.student?.id == userData?.student.id)?.isOffByStudent
                && !consultation?.recordedStudents.find((student) => student?.student?.id == userData?.student.id)?.isOffByEmployee
                && !consultation.isOffByEmployee)
                ?
                'myConsultationCard'
                :
                'myConsultationCard disabled'
            }
        >
            <div className={'cardHeader'}>
                {(!consultation?.recordedStudents.find((student) => student?.student?.id == userData?.student.id)?.isOffByStudent
                    && !consultation?.recordedStudents.find((student) => student?.student?.id == userData?.student.id)?.isOffByEmployee
                    && !consultation.isOffByEmployee)
                    ?
                    <>
                        <div className={'cardStatus'}>
                            {STATUS_OF_CONSULTATION[0]}
                        </div>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        textTextColor: '#808080',
                                        textTextHoverColor: '#6c6b6b',
                                    }
                                }
                            }}
                        >
                            <Button
                                type={'text'}
                                className={'revokeButton'}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Отменить
                            </Button>
                        </ConfigProvider>
                    </>
                    :
                    <div className={'cardStatusFalse'}>
                        {STATUS_OF_CONSULTATION[1]}
                    </div>
                }
            </div>
            <div className={'cardDate'}>
                <div className={'date'}>
                    {DAYS[new Date(consultation.dateOfStart).getDay()]}
                </div>
                <div className={'date'}>
                    {Intl.DateTimeFormat('ru-RU').format(new Date(consultation.dateOfStart))}
                </div>
            </div>
            <div className={'interval'}>
                {`${
                    new Date(consultation?.recordedStudents.find((student) => student?.student?.id == userData?.student.id)?.dateStartConsultation).getHours()}
                                    :
                                    ${new Date(consultation?.recordedStudents.find((student) => student?.student?.id == userData?.student.id)?.dateStartConsultation).getMinutes() == '0' ? '00' : new Date(consultation?.recordedStudents.find((student) => student?.student?.id == userData?.student.id)?.dateStartConsultation).getMinutes()}
                                     - 
                                     ${new Date(consultation?.recordedStudents.find((student) => student?.student?.id == userData?.student.id)?.dateEndConsultation).getHours()}
                                     :
                                     ${new Date(consultation?.recordedStudents.find((student) => student?.student?.id == userData?.student.id)?.dateEndConsultation).getMinutes() == '0' ? '00' : new Date(consultation?.recordedStudents.find((student) => student?.student?.id == userData?.student.id)?.dateEndConsultation).getMinutes()}`}
            </div>
            <div className={'employeePart'}>
                <div className={'employeeInfo'}>
                    <Image className={'employeeImage'} height={107} width={107} preview={false}
                           src={'https://t4.ftcdn.net/jpg/05/17/69/51/360_F_517695126_xVHlxMfMqZlBw1dtwgtiRKjunSjxX0wj.jpg'}/>
                    <div className={'employeeTextCard'}>
                        <div
                            className={'employeeFIO'}>{`${consultation.employee.surname} ${consultation?.employee?.name[0]}. ${consultation?.employee?.lastname && consultation.employee.lastname[0] + '.'}`}</div>
                        <div
                            className={'employeeSubRole'}>{SUBROLES_OPTIONS.find((subRole) => subRole.value == consultation.employee.subRole)?.label}</div>
                        {/*Придумать как сделать линку*/}
                        <Link to={'#'}>
                            <div className={'employeeProfileLink'}>Страница сотрудника</div>
                        </Link>
                    </div>
                </div>
                <div>
                    <div className={'contacts'}>Контактные данные:</div>
                    {/*TODO: привязку почты*/}
                    <Link to={'mailto:#'}>
                        <div className={'employeeMailLink'}>hardcode@mail.com</div>
                    </Link>
                </div>
            </div>
            <div className={'cardDiscipline'}>
                {consultation.discipline.title}
            </div>
            <div className={'cardFooter'}>
                Вам необходимо посетить консультацию в указанное время.
            </div>
            <div className={'cardFooter'}>
                Место проведения: {consultation.corps} корпус, {consultation.audience} аудитория
            </div>
        </div>
    )
}