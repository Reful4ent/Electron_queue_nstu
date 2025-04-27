import {FC, useCallback, useEffect, useState} from "react";
import {Button, ConfigProvider, Form, Input, Select, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../app/context/AuthProvider/context";
import axios from "axios";
import {routeURL} from "../../shared/api/route";
import './RegistrationPage.scss'
import {
    RegistrationStudentPart
} from "../../entities/RegistrationForm/RegistrationStudentPart/RegistrationStudentPart.tsx";
import {
    RegistrationEmployeePart
} from "../../entities/RegistrationForm/RegistrationEmployeePart/RegistrationEmployeePart.tsx";

export interface OptionsType {
    label: string;
    value: number | string;
}

const ROLES_OPTIONS: OptionsType[] = [
    { label: 'Студент', value: 'Student' },
    { label: 'Сотрудник', value: 'Employee' },
    { label: 'Студент-Сотрудник', value: 'StudentEmployee' },
]

export const SUBROLES_OPTIONS: OptionsType[] = [
    { label: 'Преподаватель', value: 'LECTURER' },
    { label: 'Сотрудник деканата', value: 'DEPUTY_DEAN' },
    { label: 'Инспектор', value: 'INSPECTOR' },
]

export interface IGroup {
    id: number;
    title: string;
}

export interface ISpeciality {
    title: string;
    id: number;
    groups: IGroup[]
}

export interface IFaculty {
    title: string;
    id: number;
    specialities: ISpeciality[];
}

export interface IUserRegistration {
    username: string;
    email: string;
    password: string;
    roleID?: number | null,
    faculty?: number | null,
    speciality?: number | null,
    group?: number | null,
    faculties?: number[] | null,
    specialities?: number[] | null,
    groups?: number[] | null,
    subRole?: string | null,
    surname: string,
    name: string,
    lastname?: string | null,
}



export const RegistrationPage: FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>('')
    const [selectedRole, setSelectedRole] = useState<string>('')
    const [faculties, setFaculties] = useState<IFaculty[] | null>([])
    const [specialities, setSpecialities] = useState<ISpeciality[] | null>([])
    const [specialitiesOptions, setSpecialitiesOptions] = useState<OptionsType[]>([])
    const [groupsOptions, setGroupsOptions] = useState<OptionsType[]>([])
    const [specialitiesStudent, setSpecialitiesStudent] = useState<ISpeciality[] | null>([])
    const [specialitiesStudentOptions, setSpecialitiesStudentOptions] = useState<OptionsType[]>([])
    const [groupsStudentOptions, setGroupsStudentOptions] = useState<OptionsType[]>([])


    const registerMe = useCallback(async () => {
        if (form.getFieldValue('password') == form.getFieldValue('passwordRepeat')) {
            try {
                let data: IUserRegistration = {
                    username: form.getFieldValue('email'),
                    email: form.getFieldValue('email'),
                    password: form.getFieldValue('password'),
                    surname: `${form.getFieldValue('surname')}`,
                    name: `${form.getFieldValue('name')}`,
                    lastname: `${form.getFieldValue('lastname') ?? ''}`
                };
                if (form.getFieldValue('role') == 'Student') {
                    data = {
                        ...data,
                        roleID: 14,
                        faculty: form.getFieldValue('faculty'),
                        speciality: form.getFieldValue('speciality'),
                        group: form.getFieldValue('group'),
                    };
                } else if (form.getFieldValue('role') == 'Employee') {
                    data = {
                        ...data,
                        roleID: 15,
                        faculties: form.getFieldValue('faculties'),
                        specialities: form.getFieldValue('specialities'),
                        groups: form.getFieldValue('groups'),
                        subRole: form.getFieldValue('subRole')
                    };
                } else if (form.getFieldValue('role') == 'StudentEmployee') {
                    data = {
                        ...data,
                        roleID: 16,
                        faculty: form.getFieldValue('faculty'),
                        speciality: form.getFieldValue('speciality'),
                        group: form.getFieldValue('group'),
                        faculties: form.getFieldValue('faculties'),
                        specialities: form.getFieldValue('specialities'),
                        groups: form.getFieldValue('groups'),
                        subRole: form.getFieldValue('subRole')
                    }
                }
                const response = await axios.post(`${routeURL}/auth/local/register`, data)
                auth?.setJwt(response?.data.jwt);
                navigate('/home')
            } catch (error) {
                setError('Пользователь уже зарегистрирован!')
            }
        } else {
            setError('Пароли должны совпадать')
        }
    }, [])

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
    }, [])

    useEffect(() => {
        getFaculties();
    }, []);


    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
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
            <div className={'containerRegistration'}>
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
                            options={ROLES_OPTIONS}
                            className={'input'}
                            onSelect={(value) => setSelectedRole(value)}
                            showSearch
                            placeholder={'Роль'}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                    {selectedRole == 'Student' &&
                        <RegistrationStudentPart
                            form={form}
                            faculties={faculties}
                            specialitiesStudentOptions={specialitiesStudentOptions}
                            groupsStudentOptions={groupsStudentOptions}
                            specialitiesStudent={specialitiesStudent}
                            setSpecialitiesStudentOptions={setSpecialitiesStudentOptions}
                            setGroupsStudentOptions={setGroupsStudentOptions}
                            setSpecialitiesStudent={setSpecialitiesStudent}
                        />
                    }
                    {selectedRole == 'Employee' &&
                        <RegistrationEmployeePart
                            form={form}
                            faculties={faculties}
                            specialities={specialities}
                            subroleOptions={SUBROLES_OPTIONS}
                            specialitiesOptions={specialitiesOptions}
                            groupsOptions={groupsOptions}
                            setSpecialitiesOptions={setSpecialitiesOptions}
                            setGroupsOptions={setGroupsOptions}
                            setSpecialities={setSpecialities}
                        />
                    }
                    {selectedRole == 'StudentEmployee' &&
                        <>
                            <RegistrationStudentPart
                                form={form}
                                faculties={faculties}
                                specialitiesStudentOptions={specialitiesStudentOptions}
                                groupsStudentOptions={groupsStudentOptions}
                                specialitiesStudent={specialitiesStudent}
                                setSpecialitiesStudentOptions={setSpecialitiesStudentOptions}
                                setGroupsStudentOptions={setGroupsStudentOptions}
                                setSpecialitiesStudent={setSpecialitiesStudent}
                            />
                            <RegistrationEmployeePart
                                form={form}
                                faculties={faculties}
                                specialities={specialities}
                                subroleOptions={SUBROLES_OPTIONS}
                                specialitiesOptions={specialitiesOptions}
                                groupsOptions={groupsOptions}
                                setSpecialitiesOptions={setSpecialitiesOptions}
                                setGroupsOptions={setGroupsOptions}
                                setSpecialities={setSpecialities}
                            />
                        </>
                    }
                    <Form.Item
                        name={'email'}
                        rules={[{required: true, message: "Введите почту!"}]}
                    >
                        <Input placeholder={'Почта'} className={'input'}/>
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
                        <p className="sign-in__error">{error}</p>
                    }
                    <Form.Item>
                        <Button type="primary" block htmlType="submit"
                                className="form-submit-button">Зарегистрироваться</Button>
                    </Form.Item>
                    <div className={'link'}>
                        <Link to={'/auth/login'} className={'linkIn'}>Уже есть аккаунт? Войти!</Link>
                    </div>
                </Form>
            </div>
        </ConfigProvider>
    )
}