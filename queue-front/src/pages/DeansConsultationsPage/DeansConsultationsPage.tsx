import {FC, useCallback, useEffect, useState} from "react";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {IEmployee} from "../MyProfilePage/MyProfilePage.tsx";
import {useNavigate} from "react-router-dom";
import {Image} from "antd";
import {SUBROLES_OPTIONS} from "../RegistrationPage/RegistrationPage.tsx";
import './DeansConsultationsPage.scss'


export const DeansConsultationsPage: FC = ({}) => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<IEmployee[] | null>([])

    const getDeans = useCallback(async() => {
        const deansData = await axios.get(
            `${routeURL}/employees?filters[subRole][$eqi]=DEPUTY_DEAN`
        )
        setEmployees(deansData.data.data)
    },[])

    useEffect(() => {
        getDeans();
    }, []);

    return (
        <div className={'containerDeansConsultations'}>
            <div className={'employeeList'}>
                {employees?.map((employee, index) => (
                    <div onClick={() => navigate(`/recording/deans/${employee.id}`)}>
                        <div key={index} className={'deanSmallCardContainer'}>
                            <div className={'innerDeanSmallCardContainer'}>
                                <Image
                                    width={67}
                                    height={67}
                                    preview={false}
                                    src={'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Example_of_SVG_code.png/330px-Example_of_SVG_code.png'}
                                    className={'employeeDeanImage'}
                                />
                                <div className={'textDeanContainer'}>
                                    <div className={'employeeDeanFIO'}>
                                        {`${employee.surname} ${employee?.name[0]}. ${employee?.lastname && employee.lastname[0] + '.'}`}
                                    </div>
                                    <div className={'employeeDeanSubRole'}>
                                        {SUBROLES_OPTIONS.find((subRole) => subRole.value == employee.subRole)?.label}
                                    </div>
                                </div>
                            </div>
                            <svg width="47" height="47" viewBox="0 0 47 47" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M23.4998 7.30587L28.206 16.8401C28.4243 17.2824 28.8461 17.5891 29.3341 17.6604L39.8605 19.199L32.2449 26.6166C31.8911 26.9612 31.7296 27.4579 31.8131 27.9447L33.6101 38.422L24.198 33.4723C23.7609 33.2424 23.2387 33.2424 22.8017 33.4723L13.3896 38.422L15.1866 27.9447C15.2701 27.4579 15.1086 26.9612 14.7548 26.6166L7.13912 19.199L17.6655 17.6604C18.1536 17.5891 18.5753 17.2824 18.7936 16.8401L23.4998 7.30587Z"
                                    stroke="#808080" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}