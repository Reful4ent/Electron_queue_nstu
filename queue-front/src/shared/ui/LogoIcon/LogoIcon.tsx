import {FC} from "react";
import {useNavigate} from "react-router-dom";
export interface LogoIconProps {
    link?: string;
}

export const LogoIcon: FC<LogoIconProps> = ({link}) => {
    const navigate = useNavigate();
    return (
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(link ?? '#')}>
            <mask id="mask0_177_837" maskUnits="userSpaceOnUse" x="0" y="0" width="42"
                  height="42">
                <path fillRule="evenodd" clipRule="evenodd" d="M42 0H0V42H42V0ZM30 12H12V30H30V12Z"
                      fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_177_837)">
                <path d="M42 0H0V42L42 0Z" fill="url(#paint0_linear_177_837)"/>
                <path d="M42 0H0V17L42 0Z" fill="url(#paint1_linear_177_837)"/>
                <path d="M0 42H42V0L0 42Z" fill="url(#paint2_linear_177_837)"/>
                <path d="M25 42H42V0L25 42Z" fill="url(#paint3_linear_177_837)"/>
            </g>
            <defs>
                <linearGradient id="paint0_linear_177_837" x1="42" y1="0" x2="-1.24531e-07" y2="28.5"
                                gradientUnits="userSpaceOnUse">
                    <stop offset="0.25" stopColor="#FB3A4F"/>
                    <stop offset="1" stopColor="#C00140"/>
                </linearGradient>
                <linearGradient id="paint1_linear_177_837" x1="42" y1="-4.85355e-06" x2="-1.42882" y2="3.55752"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="#BA013F"/>
                    <stop offset="1" stopColor="#791C33"/>
                </linearGradient>
                <linearGradient id="paint2_linear_177_837" x1="29" y1="-1.41916e-07" x2="0" y2="42"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="#40E2A2"/>
                    <stop offset="1" stopColor="#0E8C59"/>
                </linearGradient>
                <linearGradient id="paint3_linear_177_837" x1="33.5" y1="42" x2="42" y2="-2.39075e-06"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0F4837"/>
                    <stop offset="1" stopColor="#0F8A58"/>
                </linearGradient>
            </defs>
        </svg>
    )
}