import { FC, useState } from 'react';
import { Modal, Button, message } from 'antd';
import { IConsultation } from '../../pages/MyProfilePage/MyProfilePage';
import './ConsultationTimeSlots.scss';
import axios from 'axios';
import { routeURL } from '../../shared/api/route';
import { useAuth } from '../../app/context/AuthProvider/context';

interface ConsultationTimeSlotsProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    consultation: IConsultation | null;
    onRecordSuccess?: () => void;
}

interface TimeSlot {
    time: string;
    isAvailable: boolean;
    id?: number;
}

const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return dayNames[date.getDay()];
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
};

export const ConsultationTimeSlots: FC<ConsultationTimeSlotsProps> = ({
    isModalOpen,
    setIsModalOpen,
    consultation,
    onRecordSuccess
}) => {
    const auth = useAuth();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    
    if (!consultation) return null;
    
    // Получаем день недели и дату из dateOfStart
    const dayName = getDayName(consultation.dateOfStart);
    const formattedDate = formatDate(consultation.dateOfStart);
    
    // Создаем слоты времени на основе времени начала/конца консультации и ее длительности
    const generateTimeSlots = (): TimeSlot[] => {
        if (!consultation) return [];
        
        const startTime = new Date(consultation.dateOfStart);
        const endTime = new Date(consultation.dateOfEnd);
        const durationInMinutes = consultation.durationNumber || 15; // По умолчанию 15 минут, если не указано
        
        const slots: TimeSlot[] = [];
        const currentTime = new Date(startTime);
        
        // Получаем занятые слоты из записей студентов
        const bookedTimes = new Set(
            consultation.recordedStudents?.map(record => 
                formatTime(record.timeRecord)
            ) || []
        );
        
        while (currentTime < endTime) {
            const slotTime = formatTime(currentTime.toISOString());
            slots.push({
                time: slotTime,
                isAvailable: !bookedTimes.has(slotTime)
            });
            
            currentTime.setMinutes(currentTime.getMinutes() + durationInMinutes);
        }
        
        return slots;
    };
    
    const timeSlots = generateTimeSlots();
    
    const handleSlotClick = (time: string) => {
        setSelectedSlot(time);
    };
    
    const handleRecord = async () => {
        if (!selectedSlot) {
            messageApi.error('Выберите время для записи');
            return;
        }
        
        if (!consultation) {
            messageApi.error('Данные о консультации не загружены');
            return;
        }
        
        if (!auth?.jwt) {
            messageApi.error('Необходимо авторизоваться для записи на консультацию');
            return;
        }
        
        setIsLoading(true);
        try {
            await axios.post(
                `${routeURL}/recordStudentToEmployee`,
                {
                    consultation: consultation.id,
                    timeRecord: selectedSlot
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.jwt}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            messageApi.success('Вы успешно записались на консультацию');
            setIsModalOpen(false);
            if (onRecordSuccess) {
                onRecordSuccess();
            }
        } catch (error) {
            console.error('Ошибка при записи на консультацию:', error);
            messageApi.error('Не удалось записаться на консультацию');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedSlot(null);
    };
    
    return (
        <Modal
            title={`${dayName} ${formattedDate}`}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            className="consultation-time-slots-modal"
        >
            {contextHolder}
            <div className="time-slots-container">
                {timeSlots.map((slot, index) => (
                    <div 
                        key={index} 
                        className={`time-slot ${!slot.isAvailable ? 'disabled' : ''} ${selectedSlot === slot.time ? 'selected' : ''}`}
                        onClick={() => slot.isAvailable && handleSlotClick(slot.time)}
                    >
                        {slot.time}
                    </div>
                ))}
            </div>
            <div className="record-button-container">
                <Button 
                    className="record-button"
                    onClick={handleRecord}
                    disabled={!selectedSlot || isLoading}
                    loading={isLoading}
                >
                    Записаться
                </Button>
            </div>
        </Modal>
    );
}; 