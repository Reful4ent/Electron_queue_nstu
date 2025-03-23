import {FC, useCallback, useEffect, useState} from "react";
import {Button, ConfigProvider, Form, Input, Select, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../app/context/AuthProvider/context";
import axios from "axios";
import {routeURL} from "../../shared/api/route";
import './RegistrationPage.scss'

const ROLES = [
    { label: 'Студент', value: 'Student'},
    { label: 'Сотрудник', value: 'Employee'},
    { label: 'Студент-Сотрудник', value: 'StudentEmployee'},
]

export interface IFaculty {
    title: string;
    id: number;
    specialities: {
        title: string;
        id: number;
        groups: {
            id: number;
            title: string;
        }[]
    }[];
}

export const RegistrationPage: FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>('')
    const [selectedRole, setSelectedRole] = useState<string>('')
    const [faculties, setFaculties] = useState<IFaculty[] | null>([])
    const [selectedFacultyID, setSelectedFacultyID] = useState<number | null>();
    const [selectedSpecialityID, setSelectedSpecialityID] = useState<number | null>();
    const [selectedGroupID, setSelectedGroupID] = useState<number | null>();

    const registerMe = useCallback( async () => {
        try{
            const response = await axios.post(`${routeURL}/auth/local/register`,{
                username: form.getFieldValue('email'),
                email: form.getFieldValue('email'),
                password: form.getFieldValue('password'),
                fio: `${form.getFieldValue('surname')} ${form.getFieldValue('name')} ${form.getFieldValue('lastname')}`,
                roleID: 14,
                faculty: selectedFacultyID,
                speciality: selectedSpecialityID,
                group: form.getFieldValue('group'),
            })
            auth?.setJwt(response?.data.jwt);
        } catch (error) {
            setError('Пользователь уже зарегистрирован!')
        }
    },[])

    const getFaculties = useCallback(async () => {
        const facultiesData = await axios.get(
            `${routeURL}/faculties?populate[specialities][populate][groups][populate]=*`
        )
        setFaculties(facultiesData?.data?.data?.map((faculty: any) => ({
            id: faculty.id,
            title: faculty.title,
            specialities: faculty?.specialities.map((speciality: any) => ({
                id: speciality.id,
                title: speciality.title,
                groups: speciality?.groups?.map((group: any) => ({
                    id: group.id,
                    title: group.title,
                }))
            }))
        })))
    },[])

    useEffect(() => {
        console.log(selectedFacultyID)
    }, [selectedFacultyID]);

    useEffect(() => {
        getFaculties();
    }, []);



    return(
        <ConfigProvider
            theme={{
                components: {
                    Button:{
                        colorPrimaryHover: '#02a66b',
                        colorPrimaryActive: '#02a66b',
                    },
                    Input: {
                        hoverBorderColor: '#02a66b',
                        activeBorderColor: '#02a66b',
                    },
                    Select: {
                        hoverBorderColor: '#02a66b',
                        activeBorderColor: '#02a66b',
                    }
                }
            }}
        >
            <div className={'container'}>
                <Form className={'form'} form={form} onFinish={() => registerMe()}>
                    <Typography.Text className={'text'}>E-Queue | NSTU NETI</Typography.Text>
                    <Typography.Title className={'title'}>Регистрация</Typography.Title>
                    <Form.Item
                        name={'surname'}
                        rules={[{required: true, message: "Введите фамилию!"}]}
                    >
                        <Input placeholder={'Фамилия'} className={'input'}/>
                    </Form.Item>
                    <Form.Item
                        name={'name'}
                        rules={[{required: true, message: "Введите имя!"}]}
                    >
                        <Input placeholder={'Имя'} className={'input'}/>
                    </Form.Item>
                    <Form.Item
                        name={'lastname'}
                    >
                        <Input placeholder={'Отчество (при наличии)'} className={'input'}/>
                    </Form.Item>
                    <Form.Item
                        name={'role'}
                    >
                        <Select
                            options={ROLES}
                            className={'input'}
                            onSelect={(value) => setSelectedRole(value)}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                    {selectedRole == 'Student' &&
                        <>
                            <Form.Item
                                name={'faculty'}
                            >
                                <Select
                                    showSearch
                                    options={faculties?.map((faculty) => ({label: faculty.title, value: faculty.id}))}
                                    className={'input'}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    onSelect={(value) => setSelectedFacultyID(value)}
                                />
                            </Form.Item>
                            <Form.Item
                                name={'speciality'}
                            >
                                <Select
                                    showSearch
                                    options={
                                        faculties
                                            ?.find((faculty) => faculty.id == selectedFacultyID)
                                            ?.specialities
                                                ?.map((speciality) => ({label: speciality.title, value: speciality.id}))
                                    }
                                    className={'input'}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    onSelect={(value) => setSelectedSpecialityID(value)}
                                />
                            </Form.Item>
                            <Form.Item
                                name={'group'}
                            >
                                <Select
                                    showSearch
                                    options={
                                        faculties
                                            ?.find((faculty) => faculty.id == selectedFacultyID)
                                            ?.specialities
                                                ?.find((speciality) => speciality.id == selectedSpecialityID)
                                                ?.groups
                                                    ?.map((group) => ({label: group.title, value: group.id}))
                                    }
                                    className={'input'}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    onSelect={(value) => setSelectedGroupID(value)}
                                />
                            </Form.Item>
                        </>
                    }
                    <Form.Item
                        name={'email'}
                        rules={[{required: true, message: "Введите почту!"}]}
                    >
                        <Input placeholder={'Логин'} className={'input'}/>
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                        rules={[{required: true, message: "Введите пароль!"}]}
                    >
                        <Input.Password placeholder={'Пароль'} className={'input'}/>
                    </Form.Item>
                    <Form.Item
                        name={'passwordRepeat'}
                        rules={[{required: true, message: "Введите пароль!"}]}
                    >
                        <Input.Password placeholder={'Повторите пароль'} className={'input'}/>
                    </Form.Item>
                    {error &&
                        <p className="sign-in__error">Неверный логин или пароль</p>
                    }
                    <Form.Item>
                        <Button type="primary" block htmlType="submit" className="form-submit-button">Зарегистрироваться</Button>
                    </Form.Item>
                    <div className={'link'}>
                        <Link to={'/auth/login'} className={'linkIn'}>Уже есть аккаунт? Войти!</Link>
                    </div>
                </Form>
            </div>
        </ConfigProvider>
    )
}