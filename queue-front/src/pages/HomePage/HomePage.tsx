import {FC, useCallback, useEffect, useState} from "react";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {RedirectCard} from "../../widgets/RedirectCard/RedirectCard.tsx";
import './HomePage.scss'
import {CardSVGDean} from "../../shared/ui/CardSVG/CardSVGDean.tsx";
import {CardSVGEmployee} from "../../shared/ui/CardSVG/CardSVGEmployee.tsx";
import {CardSVGEmployeeCon} from "../../shared/ui/CardSVG/CardSVGEmployeeCon.tsx";
import {CardSVGCreate} from "../../shared/ui/CardSVG/CardSVGCreate.tsx";

export const ROLES = [
    'Student',
    'Employee',
    'StudentEmployee'
]

export const HomePage: FC = () => {
    const auth = useAuth();
    const [currentRole, setCurrentRole] = useState<string>('')
    const [id, setID] = useState()

    const getMyData = useCallback(async () => {
        const myData = await axios.get(
            `${routeURL}/users/me?populate=*`,
            {
                headers: {
                    Authorization: `Bearer ${auth?.jwt}`,
                }
            }
        )
        setID(myData?.data?.id)
        if (myData?.data?.student && myData?.data?.employee) {
            setCurrentRole(ROLES[2])
        } else if (myData?.data?.employee) {
            setCurrentRole(ROLES[1])
        } else if (myData?.data?.student) {
            setCurrentRole(ROLES[0])
        }
    },[])

    useEffect(() => {
        if(auth?.jwt) {
            getMyData()
        }
    }, [auth?.jwt]);

    return (
        <div className={'containerHome'}>
            <p className={'headerText'}>Электронная очередь</p>
            {(currentRole == ROLES[1] || currentRole == ROLES[2]) &&
                <div className={'cardContainer'}>
                    <RedirectCard
                        url={`/profile/${id}/my-consultations`}
                        svgIcon={<CardSVGEmployeeCon/>}
                        name={'Мои консультации'}
                        text={'Просмотр информации существующих консультаций'}
                    />


                    <RedirectCard
                        url={`/profile/${id}/my-consultations/create`}
                        svgIcon={<CardSVGCreate/>}
                        name={'Создание консультации'}
                        text={'Добавление новых дополнительных консультаций для студентов'}
                    />
                </div>
            }
            {currentRole !== ROLES[1] &&
                <div className={'cardContainer'}>
                    {(currentRole == ROLES[0] || currentRole == ROLES[2]) &&
                        <RedirectCard
                            url={'/consultations/employees'}
                            svgIcon={<CardSVGEmployee/>}
                            name={'Консультации'}
                            text={'Запись к преподавателю на консультацию'}
                        />
                    }
                    <RedirectCard
                        url={'/consultations/deans'}
                        svgIcon={<CardSVGDean/>}
                        name={'Деканат'}
                        text={'Запись на прием в деканат'}
                    />
                </div>
            }
        </div>
    )
}