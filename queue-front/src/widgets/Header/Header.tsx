import {FC, useCallback, useEffect, useState} from "react";
import {LogoIcon} from "../../shared/ui/LogoIcon/LogoIcon.tsx";
import './Header.scss'
import {Button, ConfigProvider, Image} from "antd";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {SUBROLES_OPTIONS} from "../../pages/RegistrationPage/RegistrationPage.tsx";

export interface HeaderProps {

}

export interface ISmallUserData {
    id?: number;
    surname: string;
    name: string;
    lastname?: string | null;
    subRole: string;
}

export const Header: FC = ({}) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState<ISmallUserData | null>();

    const getMyData = useCallback(async () => {
        const myData = await axios.get(
            `${routeURL}/users/me?populate=*`,
            {
                headers: {
                    Authorization: `Bearer ${auth?.jwt}`,
                }
            }
        )
        console.log(myData.data)
        setUserData(({
            id: myData?.data?.id,
            surname: myData?.data?.surname ?? '',
            name: myData?.data?.name ?? '',
            lastname: myData?.data?.lastname ?? '',
            subRole: myData?.data?.employee?.subRole ?? 'Студент'
        }))
    },[])

    useEffect(() => {
        if(auth?.jwt) {
            getMyData()
        }
    }, [auth?.jwt]);

    return(
        <div className={'header'}>
            <LogoIcon link={'/home'}/>
            <div onClick={() => {}} className={'headerButtons'}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_177_824)">
                        <path
                            d="M13.9998 1.1665V3.49984M13.9998 24.4998V26.8332M4.92317 4.92317L6.57984 6.57984M21.4198 21.4198L23.0765 23.0765M1.1665 13.9998H3.49984M24.4998 13.9998H26.8332M4.92317 23.0765L6.57984 21.4198M21.4198 6.57984L23.0765 4.92317M19.8332 13.9998C19.8332 17.2215 17.2215 19.8332 13.9998 19.8332C10.7782 19.8332 8.1665 17.2215 8.1665 13.9998C8.1665 10.7782 10.7782 8.1665 13.9998 8.1665C17.2215 8.1665 19.8332 10.7782 19.8332 13.9998Z"
                            stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_177_824">
                            <rect width="28" height="28" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                <Button className={'languageButton'}>
                    <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="22" height="5" fill="#D9D9D9"/>
                        <rect y="5" width="22" height="5" fill="#0011FF"/>
                        <rect y="10" width="22" height="5" fill="#FF0004"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="#757575" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </Button>
                {!auth?.jwt && location?.pathname?.split('/')?.[1] !== 'auth' &&
                    <Button className={'languageButton'} onClick={() => {
                        navigate('/auth/login')
                    }}>
                        <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 1h15v22H7v-8h1v7h13V2H8v8H7zm7.309 12l-2.649 2.648.707.707 3.89-3.89-3.832-3.833-.707.707L14.378 12H2v1z"/>
                            <path fill="none" d="M0 0h24v24H0z"/>
                        </svg>
                    </Button>
                }
                {auth?.jwt &&
                    <div className={'dropdown'}>
                        <div className={'profileButtons'}>
                            <div>
                                <div className={'userDataName'}>
                                    {`${userData?.surname} ${userData?.name[0]}. ${userData?.lastname ? userData.lastname[0] + '.' : ''}`}
                                </div>
                                <div className={'userDataSubRole'}>
                                    {SUBROLES_OPTIONS.find((subRole) => subRole.value === userData?.subRole)?.label ?? userData?.subRole}
                                </div>
                            </div>
                            {/*ToDo: Поменять изображение*/}
                            <Image preview={false} className={'profileImage'} width={46} height={46}
                                   src={'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Example_of_SVG_code.png/330px-Example_of_SVG_code.png'}/>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="#606060" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className={'dropdown-content'}>
                            <div onClick={() => navigate(`/profile/${userData?.id}`)}>
                                <div className={'dropdownContentUserData'}>
                                    <div>
                                        <div className={'userDataName'}>
                                            {`${userData?.surname} ${userData?.name[0]}. ${userData?.lastname ? userData.lastname[0] + '.' : ''}`}
                                        </div>
                                        <div className={'userDataSubRole'}>
                                            {SUBROLES_OPTIONS.find((subRole) => subRole.value === userData?.subRole)?.label ?? userData?.subRole}
                                        </div>
                                    </div>
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_177_2221)">
                                            <path
                                                d="M12.5 22.9163C18.253 22.9163 22.9167 18.2526 22.9167 12.4997C22.9167 6.74671 18.253 2.08301 12.5 2.08301C6.74707 2.08301 2.08337 6.74671 2.08337 12.4997C2.08337 18.2526 6.74707 22.9163 12.5 22.9163Z"
                                                stroke="#00CC73" strokeWidth="3" strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                            <path
                                                d="M12.5 15.6247C14.2259 15.6247 15.625 14.2256 15.625 12.4997C15.625 10.7738 14.2259 9.37467 12.5 9.37467C10.7742 9.37467 9.37504 10.7738 9.37504 12.4997C9.37504 14.2256 10.7742 15.6247 12.5 15.6247Z"
                                                stroke="#00CC73" strokeWidth="3" strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_177_2221">
                                                <rect width="25" height="25" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </div>
                            </div>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Button: {
                                            colorPrimary: '#B22034',
                                            colorPrimaryHover: '#951328',
                                            colorPrimaryActive: '#951328',
                                            textTextColor: '#fff',
                                        }
                                    }
                                }}
                            >
                                <Button
                                    onClick={() => {
                                        auth?.setJwt('')
                                        navigate('/auth/login')
                                    }}
                                    className={'signOutButton'}
                                    type={'primary'}
                                >
                                    <svg width="26" height="27" viewBox="0 0 26 27" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.52977 22.9015H5.35115C4.79703 22.9015 4.26561 22.6813 3.87379 22.2895C3.48196 21.8977 3.26184 21.3663 3.26184 20.8121V6.18697C3.26184 5.63285 3.48196 5.10142 3.87379 4.7096C4.26561 4.31778 4.79703 4.09766 5.35115 4.09766H9.52977M16.8424 18.7228L22.0656 13.4996M22.0656 13.4996L16.8424 8.27628M22.0656 13.4996H9.52977"
                                            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <div className={'signOutButtonText'}>Выйти</div>
                                </Button>
                            </ConfigProvider>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}