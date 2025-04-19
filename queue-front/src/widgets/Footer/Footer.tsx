import {FC} from "react";
import './Footer.scss'
import {Link} from "react-router-dom";
export interface FooterProps {}

export const Footer: FC = ({}) => {
  return(
    <div className="footer">
      <div className="contentContainer">
        <div className="contentBlock">
          <span className="title">E-Queue</span>
          <p className="text">Новосибирский государственный технический университет НЭТИ</p>
          <span className="span">©2022-2025</span>
        </div>
        <div className="contentBlock">
          <span className="title">Техническая поддержка</span>
          <p className="text">Центр информатизации университета, 1 корпус, к. 306</p>
          <a className="contact" href="tel:3196110">319-61-10</a>
          <a className="contact" href="mailto:e-queue@ciu.nstu.ru">e-queue@ciu.nstu.ru</a>
        </div>
      </div>
        <div className="linkContainer">
          <Link to={'https://www.nstu.ru/'} className={'link'}>Портал НГТУ</Link>
        </div>
    </div>
  )
}