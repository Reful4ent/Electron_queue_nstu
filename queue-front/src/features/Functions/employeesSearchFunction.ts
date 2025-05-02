import { IEmployee } from "../../pages/MyProfilePage/MyProfilePage";


export const employeesSearchFunction = (employees: IEmployee[] | null, searchValue: string) => {
      console.log(searchValue);
      if (!searchValue.trim()) {
        return employees; // Если строка пустая, возвращаем всех сотрудников
      }

      const searchLower = searchValue.toLowerCase();

      return employees && employees.filter(employee => {
        // Проверяем каждое поле на совпадение
        return (
          (employee.surname && employee.surname.toLowerCase().includes(searchLower)) ||
          (employee.name && employee.name.toLowerCase().includes(searchLower)) ||
          (employee.lastname && employee.lastname.toLowerCase().includes(searchLower)) ||
          (employee.subRole && employee.subRole.toLowerCase().includes(searchLower))
        );
      })
    }