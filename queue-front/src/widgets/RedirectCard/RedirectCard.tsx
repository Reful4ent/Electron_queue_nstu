import {FC, ReactNode} from "react";
import {useNavigate} from "react-router-dom";
import './RedirectCard.scss'



export interface IRedirectCardProps {
    url: string;
    svgIcon: ReactNode;
    name: string;
    text: string;
}

export const RedirectCard: FC<IRedirectCardProps> = ({url, svgIcon, name , text}) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(url)}
            className={'redirectCard'}
        >
            {svgIcon}
            <p className={'redirectCardName'}>{name}</p>
            <div className={'redirectCardText'}>{text}</div>
        </div>
    )
}