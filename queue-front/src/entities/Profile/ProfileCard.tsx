import {FC} from "react";
import {Image} from "antd";
import {ROLES} from "../../pages/HomePage/HomePage.tsx";
import {SUBROLES_OPTIONS} from "../../pages/RegistrationPage/RegistrationPage.tsx";
import {SocialLinks} from "../../widgets/SocialLinks/SocialLinks.tsx";
import {IUser} from "../../pages/MyProfilePage/MyProfilePage.tsx";
import './ProfileCard.scss'

export interface IProfileCard {
    userData: IUser | null,
    currentRole: string
    socialLinks?: {
        vk?: string,
        phone?: string,
        email?: string,
        telegram?: string,
    }
}

export const ProfileCard: FC<IProfileCard> = ({userData, currentRole, socialLinks}) => {
    return (
        <div className={'profileCard'}>
            {/*ToDo: Поменять изображение*/}
            <Image className={'profileImage'} width={128} height={128} preview={false}
                   src={'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Example_of_SVG_code.png/330px-Example_of_SVG_code.png'}/>
            <div>
                <div className={'profileFIO'}>
                    {`${userData?.surname} ${userData?.name} ${userData?.lastname}`}
                </div>
                <div className={'profileSubRole'}>
                    {
                        currentRole == ROLES[0]
                            ? `${userData?.student?.faculty?.title}(${userData?.student?.group?.title})`
                            : currentRole == ROLES[1]
                                ? SUBROLES_OPTIONS.find((subRole) => subRole.value === userData?.employee?.subRole)?.label
                                : `${SUBROLES_OPTIONS.find((subRole) => subRole.value === userData?.employee?.subRole)?.label}, ${userData?.student?.faculty?.title}(${userData?.student?.group?.title})`
                    }
                </div>
                {/*ToDo: Создать социалс в страпи и сделать универсальным*/}
                {socialLinks &&
                    <SocialLinks
                        vkLink={socialLinks.vk}
                        phone={socialLinks.phone}
                        telegramLink={socialLinks.telegram}
                        email={socialLinks.email}
                    />
                }
            </div>
        </div>
    )
}