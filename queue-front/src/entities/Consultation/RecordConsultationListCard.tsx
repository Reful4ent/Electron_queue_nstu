import {FC, useState} from "react";
import {DAYS, IConsultation} from "../../pages/MyProfilePage/MyProfilePage.tsx";
import {Button, Form, Radio} from "antd";
import './RecordConsultationListCard.scss'

export interface IRecordConsultationListCard {
    consultationItem: IConsultation;
}

export const RecordConsultationListCard: FC<IRecordConsultationListCard> = ({consultationItem}) => {
    const [form] = Form.useForm();
    const [isOpenList, setIsOpenList] = useState<boolean>(false)
    return (
        <div>
            <div>
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
                <div></div>
                <Form.Item
                    name={'currentSelectedTime'}
                >
                    <Radio.Group
                        defaultValue={false}
                        style={{display: "flex", width: 384, flexWrap: 'wrap'}}
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
                                        style={{marginRight: 10}}
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
                    if (!isOpenList) {
                        setIsOpenList(true)
                    } else {
                        console.log(form.getFieldsValue())
                        console.log(consultationItem)
                    }
                }}
            >

                {isOpenList ? 'Записаться' : 'Узнать свободное время'}
            </Button>
        </div>
    )
}