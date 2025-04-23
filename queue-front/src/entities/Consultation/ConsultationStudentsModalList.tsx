import {FC, useState} from "react";
import {DAYS, IConsultation} from "../../pages/MyProfilePage/MyProfilePage.tsx";
import {Button, Image, Modal, message, Popconfirm} from "antd";
import './ConsultationStudentsModalList.css';
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {useAuth} from "../../app/context/AuthProvider/context.ts";

export interface IConsultationStudentsList {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    modalItemHead: string;
    modalData?: IConsultation | null;
    onConsultationUpdate?: () => void;
}

// Функция форматирования времени
const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export const ConsultationStudentModalList: FC<IConsultationStudentsList> = ({isModalOpen, setIsModalOpen, modalItemHead, modalData, onConsultationUpdate}) => {
    const auth = useAuth();
    const [loading, setLoading] = useState<Record<number, boolean>>({});
    const [cancelConsultationLoading, setCancelConsultationLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    
    // Форматируем дату
    const dateObj = modalData?.dateOfStart ? new Date(modalData.dateOfStart) : null;
    const dayName = dateObj ? DAYS[dateObj.getDay()] : '';
    const formattedDate = dateObj ? dateObj.getDate().toString().padStart(2, '0') + '.' + 
        (dateObj.getMonth() + 1).toString().padStart(2, '0') : '';
    
    const handleCancelRecord = async (recordedStudent: any, index: number) => {
        try {
            setLoading(prev => ({ ...prev, [index]: true }));
            
            console.log('Отправляю запрос на отмену записи:', {
                recordId: recordedStudent.id,
                recordedStudent: recordedStudent
            });
            
            const response = await axios.delete(
                `${routeURL}/consultations/records/${recordedStudent.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.jwt}`,
                    }
                }
            );
            
            console.log('Ответ сервера:', response.data);
            
            messageApi.success('Запись успешно отменена');
            
            setTimeout(() => {
                setIsModalOpen(false);
                if (onConsultationUpdate) {
                    onConsultationUpdate();
                }
            }, 1000);
            
        } catch (error: any) {
            console.error("Детали ошибки:", error.response?.data || error.message);
            
            try {
                console.log('Пробуем альтернативный способ отмены записи');
                const response = await axios.put(
                    `${routeURL}/consultations/cancel-record`,
                    {
                        recordId: recordedStudent.id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.jwt}`,
                        }
                    }
                );
                
                console.log('Ответ сервера (альтернативный):', response.data);
                messageApi.success('Запись успешно отменена');
                
                setTimeout(() => {
                    setIsModalOpen(false);
                    if (onConsultationUpdate) {
                        onConsultationUpdate();
                    }
                }, 1000);
                
            } catch (altError: any) {
                console.error("Ошибка при альтернативной отмене записи:", altError);
                messageApi.error('Не удалось отменить запись. Пожалуйста, обратитесь к администратору');
            }
        } finally {
            setLoading(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleCancelConsultation = async () => {
        if (!modalData || !modalData.id) {
            messageApi.error('Ошибка: данные консультации отсутствуют');
            return;
        }

        try {
            setCancelConsultationLoading(true);
            
            console.log('Отправляю запрос на отмену консультации:', {
                consultationId: modalData.id
            });
            
            const response = await axios.delete(
                `${routeURL}/consultations/${modalData.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.jwt}`,
                    }
                }
            );
            
            console.log('Ответ сервера:', response.data);
            messageApi.success('Консультация успешно отменена');
            
            setTimeout(() => {
                setIsModalOpen(false);
                if (onConsultationUpdate) {
                    onConsultationUpdate();
                }
            }, 1500);
            
        } catch (error: any) {
            console.error("Ошибка при отмене консультации:", error);
            
            try {
                console.log('Пробуем альтернативный способ отмены консультации');
                
                const response = await axios.put(
                    `${routeURL}/cancel-consultation`,
                    {
                        consultationId: modalData.id
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.jwt}`,
                        }
                    }
                );
                
                console.log('Ответ сервера (альтернативный):', response.data);
                messageApi.success('Консультация успешно отменена');
                
                setTimeout(() => {
                    setIsModalOpen(false);
                    if (onConsultationUpdate) {
                        onConsultationUpdate();
                    }
                }, 1500);
                
            } catch (altError: any) {
                console.error("Ошибка при альтернативной отмене консультации:", altError);
                messageApi.error('Не удалось отменить консультацию. Пожалуйста, обратитесь к администратору');
            }
        } finally {
            setCancelConsultationLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="Записи на косультацию"
                centered
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Popconfirm
                        key="cancelConfirm"
                        title="Отмена консультации"
                        description="Вы уверены, что хотите отменить эту консультацию? Все записи будут удалены."
                        onConfirm={handleCancelConsultation}
                        okText="Да, отменить"
                        cancelText="Нет"
                    >
                        <Button 
                            key="cancel" 
                            className="cancel-consultation-button"
                            loading={cancelConsultationLoading}
                        >
                            Отменить консультацию
                        </Button>
                    </Popconfirm>
                ]}
                width={500}
            >
                <div className="modal-consultation-container">
                    <div className={'modalConsultationHead'}>
                        <div className="modalConsultationTitle">{modalItemHead}</div>
                        {modalData?.corps && modalData?.audience && (
                            <div className="modalConsultationLocation">
                                Аудитория: {modalData.corps}-{modalData.audience}
                            </div>
                        )}
                    </div>
                    <div className={'modalConsultationTime'}>
                        <div className={'modalConsultationTimeHeader'}>
                            <div>{dayName}</div>
                            <div>{formattedDate}</div>
                        </div>
                        <div className={'modalConsultationBody'}>
                            {modalData?.recordedStudents.map((recordedStudent, index) => (
                                <div key={index} className={'modalStudentsListItem'}>
                                    <div className={'modalStudentsListItemFirstBlock'}>
                                        <Image
                                            className={'modalStudentsListItemProfileImage'}
                                            width={40}
                                            height={40}
                                            preview={false}
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Example_of_SVG_code.png/330px-Example_of_SVG_code.png"
                                        />
                                        <div className="student-info">
                                            <div className="student-name">
                                                {recordedStudent.student ? 
                                                    `${recordedStudent.student.surname} ${recordedStudent.student.name[0]}.${recordedStudent.student.lastname ? recordedStudent.student.lastname[0] + '.' : ''}` :
                                                    recordedStudent.notRegisteredUser ? 
                                                        `${recordedStudent.notRegisteredUser.surname} ${recordedStudent.notRegisteredUser.name[0]}.` :
                                                        'Свободная запись'
                                                }
                                            </div>
                                            {recordedStudent.student && recordedStudent.student.group && (
                                                <div className="student-group">
                                                    {recordedStudent.student.group.title}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="consultation-time">
                                        {recordedStudent.dateStartConsultation && recordedStudent.dateEndConsultation && 
                                            `${formatTime(new Date(recordedStudent.dateStartConsultation))}-${formatTime(new Date(recordedStudent.dateEndConsultation))}`
                                        }
                                    </div>
                                    <div className={`student-actions ${!recordedStudent.student && !recordedStudent.notRegisteredUser ? 'free-slot-actions' : ''}`}>
                                        {(recordedStudent.student || recordedStudent.notRegisteredUser) && (
                                            <button 
                                                className="student-action-button student-action-message" 
                                                title="Написать студенту"
                                                onClick={() => console.log('Написать студенту', recordedStudent)}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor"/>
                                                </svg>
                                            </button>
                                        )}
                                        <button 
                                            className="student-action-button student-action-cancel" 
                                            title="Отменить запись"
                                            onClick={() => handleCancelRecord(recordedStudent, index)}
                                            disabled={loading[index]}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}