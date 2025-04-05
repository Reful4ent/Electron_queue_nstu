import {FC, useCallback, useState} from "react";
import {Button, Checkbox, ConfigProvider, Form, Input, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import './SignInPage.scss'
import {useAuth} from "../../app/context/AuthProvider/context";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";

export const SignInPage: FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>('')

    const authMe = useCallback( async () => {
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
                }
            }}
        >
            <div className={'containerSignIn'}>
                <Form layout={'vertical'} className={'form'} form={form} onFinish={() => authMe()}>
                    <Typography.Text className={'text'}>E-Queue | NSTU NETI</Typography.Text>
                    <Typography.Title className={'title'}>Вход</Typography.Title>
                    <Form.Item
                        name={'email'}
                    >
                        <Input placeholder={'Логин'} className={'input'}/>
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                    >
                        <Input.Password placeholder={'Пароль'} className={'input'}/>
                    </Form.Item>
                    {error &&
                        <p className="sign-in__error">Неверный логин или пароль</p>
                    }
                    <div className={'subContainer'}>
                    <Form.Item>
                            <Checkbox>Запомнить меня</Checkbox>
                        </Form.Item>
                        <Link to={'/'} className={'linkIn'}>Забыли пароль?</Link>
                    </div>
                    <Form.Item>
                        <Button type="primary" block htmlType="submit" className="form-submit-button">Войти</Button>
                    </Form.Item>
                    <div className={'link'}>
                        <Link to={'/auth/register'} className={'linkIn'}>Нет аккаунта? Зарегистрироваться!</Link>
                    </div>
                </Form>
            </div>
        </ConfigProvider>
    )
}