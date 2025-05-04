import {FC, useCallback, useEffect, useState} from "react";
import axios from "axios";
import {routeURL} from "../../shared/api/route.ts";
import {IEmployee} from "../MyProfilePage/MyProfilePage.tsx";
import './DeansConsultationsPage.scss'
import {EmployeeCardSearch} from "../../entities/Employee/EmployeeCardSearch.tsx";
import {Breadcrumbs} from "../../widgets/Breadcrumbs/Breadcrumbs.tsx";
import { SearchInput } from "../../widgets/Search/SearchInput.tsx";
import { employeesSearchFunction } from "../../features/Functions/employeesSearchFunction.ts";


export const DeansConsultationsPage: FC = ({}) => {
    const [employees, setEmployees] = useState<IEmployee[] | null>([])
    const [searchData, setSearchData] = useState<IEmployee[] | null>([])
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
        setSearchData(deansData.data.data)
    },[])

    const SearchHandle = (searchValue: string) => {
      setSearchData(employeesSearchFunction(employees, searchValue))
    }

    useEffect(() => {
        getDeans();
    }, []);

    return (
        <div className={'containerDeansConsultations'}>
            <Breadcrumbs items={itemsForBreadcrumbs}/>
            <div className={'containerDeansHead'}>
                <p className={'consultationDeansHeadText'}>Запись в деканат</p>
                <SearchInput onSearch={SearchHandle} />
            </div>

            {/* <div className={'filtersButton'}>
                <svg style={{marginRight: 10}} width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.5 1.75H1.5L11.5 13.575V21.75L16.5 24.25V13.575L26.5 1.75Z" stroke="#00CC73"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className={'filtersButtonText'}>Фильтры</div>
            </div> */}
            <div className={'employeeList'}>
                {searchData?.map((employee, index) => (
                    <EmployeeCardSearch employee={employee} link={`/recording/deans/${employee.documentId}`} key={index}/>
                ))}
            </div>
        </div>
    )
}