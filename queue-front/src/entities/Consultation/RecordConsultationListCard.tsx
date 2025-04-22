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
    const [isOpenList, setIsOpenList] = useState<boolean>(false)
    const [isError, setIsError] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const handleRecord = useCallback(async () => {
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
        } else {
            messageApi.open({
                type: 'error',
                content: recordResult.data.message,
            });
        }
    },[])

    return (
        <div className={'recordConsultationListCardContainer'}>
            {contextHolder}
            <div className={'dateAndCloseContainer'}>
                <div>
                    <div className={'date'}>
                        {DAYS[new Date(consultationItem.dateOfStart).getDay()]}
                    </div>
                    <div className={'date'}>
                        {Intl.DateTimeFormat('ru-RU').format(new Date(consultationItem.dateOfStart))}
                    </div>
                </div>
                {isOpenList &&
                    <Button onClick={() => setIsOpenList(false)}>x</Button>
                }
            </div>
            <Form className={isOpenList ? 'timeList' : 'hiddenTimeList'} form={form}>
                <div className={'downLine'}/>
                <div className={isError ? 'errorText' : 'hiddenError'}>Выберите время для записи!</div>
                <Form.Item
                    name={'currentSelectedTime'}
                >
                    <Radio.Group
                        defaultValue={false}
                        style={{display: "flex", flexWrap: 'wrap'}}
                    >
                        {
                            consultationItem?.recordedStudents
                                .filter((a) => !a.isOffByEmployee && !a.isOffByStudent)
                                .sort((a, b) => new Date(a?.dateStartConsultation).getTime() - new Date(b?.dateStartConsultation).getTime())
                                .map((recordedStudent, index) => (
                                    <Radio.Button
                                        key={index}
                                        disabled={!!(recordedStudent?.student || recordedStudent?.notRegisteredUser)}
                                        value={recordedStudent.id}
                                        style={{marginRight: 10, marginBottom: 10}}
                                        onClick={() => setIsError(false)}
                                    >
                                        <div className={'interval'}>
                                            {`${
                                                new Date(recordedStudent?.dateStartConsultation).getHours()}
                                                :
                                                ${String(new Date(recordedStudent?.dateStartConsultation).getMinutes()) == '0' ? '00' : new Date(recordedStudent?.dateStartConsultation).getMinutes()}`}
                                        </div>
                                    </Radio.Button>
                                ))
                        }
                    </Radio.Group>
                </Form.Item>
            </Form>
            <Button
                onClick={() => {
                    setIsError(false)
                    if (!isOpenList) {
                        setIsOpenList(true)
                    } else {
                        if(typeof form.getFieldValue('currentSelectedTime') == 'undefined') {
                            setIsError(true)
                        } else if (typeof form.getFieldValue('currentSelectedTime') != 'undefined' && studentId) {
                            handleRecord()
                        } else {
                            setIsModalOpen(true)
                        }
                    }
                }}
            >

                {isOpenList ? 'Записаться' : 'Узнать свободное время'}
            </Button>
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    layout={'vertical'}
                    form={modalForm}
                    onFinish={() => {
                        setIsModalOpen(false)
                        handleRecord()
                    }}
                >
                    <p>Запись на консультацию в деканат</p>
                    <Form.Item
                        name={'surname'}
                        rules={[{required: true, message: "Введите фамилию для записи"}]}
                    >
                        <Input placeholder={'Фамилия'}/>
                    </Form.Item>
                    <Form.Item
                        name={'name'}
                        rules={[{required: true, message: "Введите имя для записи"}]}
                    >
                        <Input placeholder={'Имя'}/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'}>Записаться</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}