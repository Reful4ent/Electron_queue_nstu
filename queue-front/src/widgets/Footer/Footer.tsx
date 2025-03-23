import {FC} from "react";
import './Footer.scss'
import {Link} from "react-router-dom";
export interface FooterProps {}

export const Footer: FC = ({}) => {
    return(
        <div className={'footer'}>
            <p className={'privates'}>E-Queue Новосибирский государственный технический университет НЭТИ © 2022-2025 </p>
            <div className={'contacts'}>
                <p>Техническая поддержка Центр информатизации университета, 1 корпус, к. 306 319-61-10 </p>
                <a href="mailto:e-queue@ciu.nstu.ru">e-queue@ciu.nstu.ru</a>
            </div>
            <Link to={'https://www.nstu.ru/'} className={'link'}>Портал НГТУ</Link>
        </div>
    )
}