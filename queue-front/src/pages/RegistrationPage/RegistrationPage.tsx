import {FC, useCallback, useState} from "react";
import {Button, ConfigProvider, Form, Input, Select, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import './RegistrationPage.scss'

const ROLES = [
    { label: 'Студент', value: 'Student'},
    { label: 'Сотрудник', value: 'Employee'},
    { label: 'Студент-Сотрудник', value: 'StudentEmployee'},
]

export const RegistrationPage: FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>('')

    const registerMe = useCallback( async () => {
        setError('')
        try {
            const response = await axios.post(`${routeURL}/auth/local`,{
                identifier: form.getFieldValue('email'),
                password: form.getFieldValue('password'),
            })
            auth?.setJwt(response?.data.jwt);
            navigate('/home')
        } catch (error) {
            setError('Неправильный логин или пароль')
        }
    },[])

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
                        <Select options={ROLES} className={'input'}/>
                    </Form.Item>
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