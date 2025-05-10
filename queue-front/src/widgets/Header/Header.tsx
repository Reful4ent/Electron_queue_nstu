import {FC, useCallback, useEffect, useState} from "react";
import {LogoIcon} from "../../shared/ui/LogoIcon/LogoIcon.tsx";
import './Header.scss'
import {Button, GetProps, Select} from "antd";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import { ISmallUserData } from "../../types/types.ts";
import Icon from "@ant-design/icons";
import { RussianFlagSvg } from "../../shared/ui/icons/flagIcons.tsx";
import { ExitSvg } from "../../shared/ui/icons/icons.tsx";
import { Profile } from "../../entities/Profile/Profile.tsx";
import {ThemeButton} from "../../features/ThemeButton/ThemeButton.tsx";

export interface HeaderProps {

}


type CustomIconComponentProps = GetProps<typeof Icon>;

export const RussianFlagIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={RussianFlagSvg} {...props} />
);
const ExitIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ExitSvg} {...props} />
);

export const Header: FC = ({}) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState<ISmallUserData | null>(null);

    const getMyData = useCallback(async () => {
        const myData = await axios.get(
            `${routeURL}/users/me?populate=*`,
            {
                headers: {
                    Authorization: `Bearer ${auth?.jwt}`,
                }
            }
        )
        setUserData(({
            id: myData?.data?.id,
            surname: myData?.data?.surname ?? '',
            name: myData?.data?.name ?? '',
            lastname: myData?.data?.lastname ?? '',
            subRole: myData?.data?.employee?.subRole ?? 'Студент'
        }))
    },[auth?.jwt])


    useEffect(() => {
        if(auth?.jwt) {
            getMyData()
        }
    }, [auth?.jwt]);

    return(
        <div className={'header'}>
            <LogoIcon className='headerItem' link={'/home'}/>
            <div onClick={() => {}} className={'headerItems'}>
                <div className={auth?.jwt ? 'headerItemsButtons' : 'headerItemsButtonsNonAuth'}>
                    <ThemeButton/>

                    <Select disabled className={'select headerItem'} defaultValue={'russian'} options={[{value: 'russian', label: <RussianFlagIcon />}]} />
                </div>
                    
                {!auth?.jwt && location?.pathname?.split('/')?.[1] !== 'auth' &&
                    <Button className={'exitButton headerItem'} onClick={() => {
                      navigate('/auth/login')
                    }}>
                      <ExitIcon />
                    </Button>
                }
                {auth?.jwt &&
                  <Profile userData={userData} />
                }
            </div>
        </div>
    )
}