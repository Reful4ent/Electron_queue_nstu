import {FC} from "react";
import {LogoIcon} from "../../shared/ui/LogoIcon/LogoIcon.tsx";
import './Header.scss'

export interface HeaderProps {}

export const Header: FC = ({}) => {
    return(
        <div className={'header'}>
            <LogoIcon/>
            <div onClick={() => {}}>
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
            </div>

        </div>
    )
}