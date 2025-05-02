import {FC, useCallback, useState} from "react";
import {DAYS, IConsultation} from "../../pages/MyProfilePage/MyProfilePage.tsx";
import {Button, Form, Input, message, Modal, Radio} from "antd";
import './RecordConsultationListCard.scss'
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";

export interface IRecordConsultationListCard {
    consultationItem: IConsultation;
    studentId?: number;
    handleFinish: () => void;
}

export const RecordConsultationListCard: FC<IRecordConsultationListCard> = ({consultationItem, studentId, handleFinish}) => {
    const [form] = Form.useForm();
    const [modalForm] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [isError, setIsError] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleRecord = useCallback(async () => {
        if (!form.getFieldValue('currentSelectedTime')) {
            setIsError(true);
            return;
        }
        
        const recordResult = await axios.post(
            `${routeURL}/recordStudentToEmployee`,
            {
                recordId: form.getFieldValue('currentSelectedTime'),
                consultationId: consultationItem.documentId,
                studentId: studentId,
                surname: modalForm.getFieldValue('surname'),
                name: modalForm.getFieldValue('name')
            }
        )
        if(!recordResult.data || recordResult.data.length === 0) {
            handleFinish();
            messageApi.open({
                type: 'success',
                content: 'Вы записаны!',
            });
            form.resetFields();
        } else {
            messageApi.open({
                type: 'error',
                content: recordResult.data.message,
            });
        }
    }, [form, consultationItem, studentId, modalForm, handleFinish, messageApi]);

    const dateObj = new Date(consultationItem.dateOfStart);
    const dayName = DAYS[dateObj.getDay()];
    const formattedDate = dateObj.getDate().toString().padStart(2, '0') + '.' + 
        (dateObj.getMonth() + 1).toString().padStart(2, '0');

    
    const availableTimes = consultationItem?.recordedStudents
        .filter((a) => !a.isOffByEmployee && !a.isOffByStudent)
        .sort((a, b) => new Date(a.dateStartConsultation).getTime() - new Date(b.dateStartConsultation).getTime());

    const shouldShowTimeSlots = isHovering;
    
    // Обработчик клика по временному слоту
    const handleTimeClick = (value: any) => {
        if (form.getFieldValue('currentSelectedTime') === value) {
            form.resetFields(); 
            setIsHovering(false);
        } else {
            setIsError(false); 
        }
    };

    return (
        <div
            className="consultation-date-item"
        >
            {contextHolder}
            
            <div className="consultation-header" onClick={() => setIsHovering(!isHovering)}>
                <div className="day-date">
                    <span className="day">{dayName}</span>
                    <span className="date">{formattedDate}</span>
                </div>
            </div>
            
            <div className="consultation-separator"></div>
            
            {shouldShowTimeSlots && (
                <div className="time-slots-container">
                    {isError && <div className="error-message">Выберите время для записи!</div>}
                    
                    <Form form={form} className="time-form">
                        <Form.Item name="currentSelectedTime">
                            <Radio.Group className="time-slots">
                                {availableTimes.map((recordedStudent, index) => {
                                    const isDisabled = !!(recordedStudent.student || recordedStudent.notRegisteredUser);
                                    const date = new Date(recordedStudent.dateStartConsultation);
                                    const hours = date.getHours();
                                    const minutes = date.getMinutes();
                                    const timeText = `${hours}:${minutes === 0 ? '00' : minutes}`;
                                    
                                    return (
                                        <Radio 
                                            key={index}
                                            value={recordedStudent.id}
                                            disabled={isDisabled}
                                            className="time-slot-radio"
                                            onClick={() => handleTimeClick(recordedStudent.id)}
                                        >
                                            {timeText}
                                        </Radio>
                                    );
                                })}
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </div>
            )}
            
            <Button
                className="record-button"
                onClick={() => {
                    if(!isHovering) {
                        setIsHovering(true)
                    }
                    if (!form.getFieldValue('currentSelectedTime')) {
                        setIsError(true);
                    } else if (form.getFieldValue('currentSelectedTime') && studentId) {
                        handleRecord();
                    } else {
                        setIsModalOpen(true);
                    }
                }}
            >
                Записаться
            </Button>
            
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                title="Запись на консультацию в деканат"
                destroyOnClose
                className={'formToRecord'}
            >
                <Form
                    layout={'vertical'}
                    form={modalForm}
                    onFinish={() => {
                        setIsModalOpen(false);
                        handleRecord();
                    }}
                >
                    <Form.Item
                        name={'surname'}
                        rules={[{required: true, message: "Введите фамилию для записи"}]}
                    >
                        <Input placeholder={'Фамилия'} className={'inputToRecord'}/>
                    </Form.Item>
                    <Form.Item
                        name={'name'}
                        rules={[{required: true, message: "Введите имя для записи"}]}
                    >
                        <Input placeholder={'Имя'} className={'inputToRecord'}/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} className="action-button primary buttonToRecord">Записаться</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}