import {FC} from "react";
import {Form, FormInstance, Select} from "antd";
import {IFaculty, ISpeciality, OptionsType} from "../../../pages/RegistrationPage/RegistrationPage.tsx";

export interface IRegistrationStudentPart {
    form: FormInstance
    faculties: IFaculty[] | null;
    specialitiesStudentOptions: OptionsType[];
    groupsStudentOptions: OptionsType[];
    specialitiesStudent: ISpeciality[] | null;
    setSpecialitiesStudentOptions: (options: OptionsType[]) => void;
    setGroupsStudentOptions: (options: OptionsType[]) => void;
    setSpecialitiesStudent: (specialities: ISpeciality[]) => void;
}

export const RegistrationStudentPart: FC<IRegistrationStudentPart> = (
    {
        form,
        faculties,
        specialitiesStudent,
        specialitiesStudentOptions,
        groupsStudentOptions,
        setSpecialitiesStudentOptions,
        setGroupsStudentOptions,
        setSpecialitiesStudent,
    }) => {
    return (
        <>
            <Form.Item
                name={'faculty'}
            >
                <Select
                    showSearch
                    placeholder={'Мой факультет'}
                    options={faculties?.map((faculty) => ({label: faculty.title, value: faculty.id}))}
                    className={'input'}
                    onChange={(value) => {
                        let finallySpecOptions: OptionsType[] = [];
                        let finallySpec: ISpeciality[] = [];
                        const specialitiesOnSelect = faculties
                            ?.filter((faculty) => value == faculty.id)
                            ?.map((faculty) => faculty.specialities) ?? []

                        specialitiesOnSelect[0]?.forEach((item) => {
                            finallySpecOptions.push({ label: item.title, value: item.id })
                            finallySpec.push(item)
                        })
                        setSpecialitiesStudentOptions(finallySpecOptions);
                        setSpecialitiesStudent(finallySpec);
                        setGroupsStudentOptions([])
                        form.setFieldValue('speciality', null);
                        form.setFieldValue('group', null);
                    }}
                />
            </Form.Item>
            <Form.Item
                name={'speciality'}
            >
                <Select
                    showSearch
                    placeholder={'Моя специальность'}
                    options={specialitiesStudentOptions}
                    className={'input'}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => {
                        let finallyGroup: OptionsType[] = [];
                        const groupsOnSelect = specialitiesStudent
                            ?.filter((speciality: ISpeciality) => value == speciality.id)
                            ?.map((speciality) => speciality.groups) ?? []
                        groupsOnSelect[0]?.forEach((item) => {
                            finallyGroup.push({ label: item.title, value: item.id })
                        })
                        setGroupsStudentOptions(finallyGroup)
                        form.setFieldValue('group', null);
                    }}
                />
            </Form.Item>
            <Form.Item
                name={'group'}
            >
                <Select
                    showSearch
                    placeholder={'Моя группа'}
                    options={groupsStudentOptions}
                    className={'input'}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>
        </>
    )
}