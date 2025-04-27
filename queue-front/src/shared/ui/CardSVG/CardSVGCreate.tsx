import {FC} from "react";
import './CardSVG.scss'

export const CardSVGCreate: FC = () => {
    return (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" rx="10" fill="#EDFBF5" className={'CardSVGIcon'}/>
            <g transform="translate(0, 0)">
                <path d="M30 43.3335L50 43.3335" stroke="#00CC73" strokeWidth="3" strokeLinecap="round"/>
                <path d="M30 30L43.3333 30" stroke="#00CC73" strokeWidth="3" strokeLinecap="round"/>
                <path d="M30 56.6665L43.3333 56.6665" stroke="#00CC73" strokeWidth="3" strokeLinecap="round"/>
                <path
                    d="M63.3337 43.3333V64C63.3337 66.8284 63.3337 68.2426 62.455 69.1213C61.5763 70 60.1621 70 57.3337 70H22.667C19.8386 70 18.4244 70 17.5457 69.1213C16.667 68.2426 16.667 66.8284 16.667 64V16C16.667 13.1716 16.667 11.7574 17.5457 10.8787C18.4244 10 19.8386 10 22.667 10H36.667"
                    stroke="#00CC73" strokeWidth="3"/>
                <path d="M60 10L60 30" stroke="#00CC73" strokeWidth="3" strokeLinecap="round"/>
                <path d="M70 20L50 20" stroke="#00CC73" strokeWidth="3" strokeLinecap="round"/>
            </g>
        </svg>
    )
}