import {FC} from "react";
import {Form, FormInstance, Select} from "antd";
import {IFaculty, ISpeciality, OptionsType} from "../../../pages/RegistrationPage/RegistrationPage.tsx";
import './RegistrationEmployeePart.scss'

export interface IRegistrationEmployeePart {
    form: FormInstance
    faculties: IFaculty[] | null;
    specialities: ISpeciality[] | null;
    subroleOptions: OptionsType[];
    specialitiesOptions: OptionsType[];
    groupsOptions: OptionsType[];
    setSpecialitiesOptions: (options: OptionsType[]) => void;
    setGroupsOptions: (options: OptionsType[]) => void;
    setSpecialities: (specialities: ISpeciality[]) => void;
}

export const RegistrationEmployeePart: FC<IRegistrationEmployeePart> = (
    {
        form,
        faculties,
        specialities,
        subroleOptions,
        specialitiesOptions,
        groupsOptions,
        setSpecialitiesOptions,
        setGroupsOptions,
        setSpecialities
    }) => {
    return (
        <>
            <Form.Item
                name={'faculties'}
            >
                <Select
                    showSearch
                    placeholder={'Факультеты к которым вы прикреплены'}
                    options={faculties?.map((faculty) => ({label: faculty.title, value: faculty.id}))}
                    className={'input'}
                    mode={'multiple'}
                    onChange={(value) => {
                        let finallySpecOptions: {label: string, value: number}[] = [];
                        let finallySpec: ISpeciality[] = [];
                        const specialitiesOnSelect = faculties
                            ?.filter((faculty) => value?.includes(faculty.id))
                            ?.map((faculty) => faculty.specialities) ?? []
                        for(const spec of specialitiesOnSelect) {
                            spec?.forEach((item) => {
                                finallySpecOptions.push({ label: item.title, value: item.id })
                                finallySpec.push(item)
                            })
                        }
                        setSpecialitiesOptions(finallySpecOptions);
                        setSpecialities(finallySpec);
                        setGroupsOptions([])
                        form.setFieldValue('specialities', null);
                        form.setFieldValue('groups', null);
                    }}
                />
            </Form.Item>
            <Form.Item
                name={'specialities'}
            >
                <Select
                    showSearch
                    placeholder={'Специальности к которым вы прикреплены'}
                    options={specialitiesOptions}
                    className={'input'}
                    mode={'multiple'}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => {
                        let finallyGroup: {label: string, value: number}[] = [];
                        const groupsOnSelect = specialities
                            ?.filter((speciality: ISpeciality) => value?.includes(speciality.id))
                            ?.map((speciality) => speciality.groups) ?? []
                        for(const group of groupsOnSelect) {
                            group?.forEach((item) => {
                                finallyGroup.push({ label: item.title, value: item.id })
                            })
                        }
                        setGroupsOptions(finallyGroup)
                        form.setFieldValue('groups', null);
                    }}
                />
            </Form.Item>
            <Form.Item
                name={'groups'}
            >
                <Select
                    showSearch
                    placeholder={'Группы к которым вы прикреплены'}
                    options={groupsOptions}
                    className={'input'}
                    mode={'multiple'}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>
            <Form.Item
                name={'subRole'}
            >
                <Select
                    showSearch
                    placeholder={'Роль'}
                    options={subroleOptions}
                    className={'input'}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>
        </>
    )
}