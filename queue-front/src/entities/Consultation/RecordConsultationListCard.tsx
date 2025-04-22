import {FC, useCallback, useState} from "react";
import {DAYS, IConsultation} from "../../pages/MyProfilePage/MyProfilePage.tsx";
import {Button, Form, message, Radio} from "antd";
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
    const [isOpenList, setIsOpenList] = useState<boolean>(false)
    const [isError, setIsError] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleRecord = useCallback(async () => {
        const recordResult = await axios.post(
            `${routeURL}/recordStudentToEmployee`,
            {
                recordId: form.getFieldValue('currentSelectedTime'),
                consultationId: consultationItem.documentId,
                studentId: studentId,
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
                                .sort((a, b) => new Date(a?.dateStartConsultation).getHours() - new Date(b?.dateStartConsultation).getHours())
                                .filter((a) => !a.isOffByEmployee && !a.isOffByStudent)
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
                        if(typeof form.getFieldsValue().currentSelectedTime == 'undefined') {
                            setIsError(true)
                        } else {
                            handleRecord()
                        }
                    }
                }}
            >

                {isOpenList ? 'Записаться' : 'Узнать свободное время'}
            </Button>
        </div>
    )
}