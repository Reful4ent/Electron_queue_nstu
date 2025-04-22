import {FC, useCallback, useEffect, useState} from "react";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {IEmployee} from "../MyProfilePage/MyProfilePage.tsx";
import './DeansConsultationsPage.scss'
import {EmployeeCardSearch} from "../../entities/Employee/EmployeeCardSearch.tsx";
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import {Input} from "antd";


export const DeansConsultationsPage: FC = ({}) => {
    const [employees, setEmployees] = useState<IEmployee[] | null>([])
    const itemsForBreadcrumbs = [
        {
            title: 'Электронная очередь',
            link: '/'
        },
        {
            title: 'Деканат',
        }
    ]

    const getDeans = useCallback(async() => {
        const deansData = await axios.get(
            `${routeURL}/employees?filters[$or][0][subRole][$eqi]=DEPUTY_DEAN&filters[$or][1][subRole][$eqi]=INSPECTOR`
        )
        setEmployees(deansData.data.data)
    },[])

    useEffect(() => {
        getDeans();
    }, []);

    return (
        <div className={'containerDeansConsultations'}>
            <Breadcrumbs items={itemsForBreadcrumbs}/>
            <div className={'containerDeansHead'}>
                <p className={'consultationDeansHeadText'}>Запись в деканат</p>
                {/*ToDo:Сделать поиск по фио или должности или кафедре*/}
                <Input
                    className={'consultationMeHeadSearch'}
                    prefix={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21.5 23.25L13.625 15.375C13 15.875 12.2812 16.2708 11.4688 16.5625C10.6562 16.8542 9.79167 17 8.875 17C6.60417 17 4.68229 16.2135 3.10938 14.6406C1.53646 13.0677 0.75 11.1458 0.75 8.875C0.75 6.60417 1.53646 4.68229 3.10938 3.10938C4.68229 1.53646 6.60417 0.75 8.875 0.75C11.1458 0.75 13.0677 1.53646 14.6406 3.10938C16.2135 4.68229 17 6.60417 17 8.875C17 9.79167 16.8542 10.6562 16.5625 11.4688C16.2708 12.2812 15.875 13 15.375 13.625L23.25 21.5L21.5 23.25ZM8.875 14.5C10.4375 14.5 11.7656 13.9531 12.8594 12.8594C13.9531 11.7656 14.5 10.4375 14.5 8.875C14.5 7.3125 13.9531 5.98438 12.8594 4.89062C11.7656 3.79688 10.4375 3.25 8.875 3.25C7.3125 3.25 5.98438 3.79688 4.89062 4.89062C3.79688 5.98438 3.25 7.3125 3.25 8.875C3.25 10.4375 3.79688 11.7656 4.89062 12.8594C5.98438 13.9531 7.3125 14.5 8.875 14.5Z"
                                fill="#00CC73"/>
                        </svg>
                    }
                    placeholder={'Поиск...'}
                />
            </div>

            <div className={'filtersButton'}>
                {/*ToDo:Сделать фильтры*/}
                <svg style={{marginRight: 10}} width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.5 1.75H1.5L11.5 13.575V21.75L16.5 24.25V13.575L26.5 1.75Z" stroke="#00CC73"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className={'filtersButtonText'}>Фильтры</div>
            </div>
            <div className={'employeeList'}>
                {employees?.map((employee, index) => (
                    <EmployeeCardSearch employee={employee} link={`/recording/deans/${employee.documentId}`} key={index}/>
                ))}
            </div>
        </div>
    )
}