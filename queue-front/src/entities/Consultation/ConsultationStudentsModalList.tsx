import {FC, useCallback} from "react";
import {DAYS, IConsultation} from "../../pages/MyProfilePage/MyProfilePage.tsx";
import {Button, Image, Modal} from "antd";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {useAuth} from "../../app/context/AuthProvider/context.ts";

export interface IConsultationStudentsList {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    modalItemHead: string;
    modalData?: IConsultation | null;
    handleFinish: () => void;
}

export const ConsultationStudentModalList: FC<IConsultationStudentsList> = ({isModalOpen, setIsModalOpen, modalItemHead, modalData, handleFinish}) => {
    const auth = useAuth();

    const handleCancelConsultation = useCallback(async (id?: string) => {
        if(id) {
            try {
                await axios.put(
                    `${routeURL}/consultations/${id}`,
                    {
                        data: {
                            isOffByEmployee: true,
                        }
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.jwt}`,
                        }
                    }
                )
                handleFinish()
                setIsModalOpen(false);
            } catch (e) {
                console.log(e)
            }
        }
    },[])

    return (
        <Modal
            centered
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[
                <Button key="submit" color="danger" variant="solid" onClick={() => handleCancelConsultation(modalData?.documentId)}>
                    Отменить консультацию
                </Button>,
                <Button key="back" color="primary" variant="solid" onClick={() => setIsModalOpen(false)}>
                    Ок
                </Button>,
            ]}
        >
            <p className={'modalConsultationHead'}>Записи на консультации</p>
            <div className={'modalConsultationList'}>
                <p className={'modalConsultationHeadItem'}>{modalItemHead}</p>
                <div className={'modalConsultationTime'}>
                    <div>
                        {modalData?.dateOfStart && DAYS[new Date(modalData?.dateOfStart).getDay()]}
                    </div>
                    <div>
                        {modalData?.dateOfStart && Intl.DateTimeFormat('ru-RU').format(new Date(modalData.dateOfStart))}
                    </div>
                </div>
                <div className={'modalConsultationBody'}>
                    {
                        modalData?.recordedStudents.map((recordedStudent, index) => (
                            <>
                                {(recordedStudent.student || recordedStudent.notRegisteredUser) ?
                                    <div key={index} className={'modalStudentsListItem'}>
                                        <div className={'modalStudentsListItemFirstBlock'}>
                                            <Image
                                                className={'modalStudentsListItemProfileImage'}
                                                width={40}
                                                height={40}
                                                preview={false}
                                                src={recordedStudent.student
                                                    ?
                                                    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Example_of_SVG_code.png/330px-Example_of_SVG_code.png'
                                                    :
                                                    '../../../public/images/notRegisteredUser.png'
                                                }
                                            />
                                            <div>
                                                {recordedStudent.student ?
                                                    <>
                                                        <div>
                                                            {`${recordedStudent.student.surname} ${recordedStudent.student.name[0]}.${recordedStudent.student.lastname[0]}.`}
                                                        </div>
                                                        <div>
                                                            {recordedStudent.student.group.title}
                                                        </div>
                                                    </>
                                                    :
                                                    <div>
                                                        {`${recordedStudent.notRegisteredUser.surname} ${recordedStudent.notRegisteredUser.name[0]}.`}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <div className={'interval'}>
                                                    {`${
                                                        new Date(recordedStudent?.dateStartConsultation).getHours()}
                                                        :
                                                        ${String(new Date(recordedStudent?.dateStartConsultation).getMinutes()) == '0' ? '00' : new Date(recordedStudent?.dateStartConsultation).getMinutes()}
                                                         - 
                                                         ${new Date(recordedStudent?.dateEndConsultation).getHours()}
                                                         :
                                                         ${String(new Date(recordedStudent?.dateEndConsultation).getMinutes()) == '0' ? '00' : new Date(recordedStudent?.dateEndConsultation).getMinutes()}`}
                                                </div>
                                            </div>
                                            <Button color="danger" variant="solid" onClick={() => {}}>
                                                Отменить запись
                                            </Button>
                                        </div>
                                    </div>
                                    :
                                    <div key={index} className={'modalStudentsListItem'}>
                                        <div>Свободная запись</div>
                                        <div>
                                            <div className={'interval'}>
                                                {`${
                                                    new Date(recordedStudent?.dateStartConsultation).getHours()}
                                                        :
                                                        ${String(new Date(recordedStudent?.dateStartConsultation).getMinutes()) == '0' ? '00' : new Date(recordedStudent?.dateStartConsultation).getMinutes()}
                                                         - 
                                                         ${new Date(recordedStudent?.dateEndConsultation).getHours()}
                                                         :
                                                         ${String(new Date(recordedStudent?.dateEndConsultation).getMinutes()) == '0' ? '00' : new Date(recordedStudent?.dateEndConsultation).getMinutes()}`}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </>
                        ))
                    }
                </div>
            </div>
        </Modal>
    )
}