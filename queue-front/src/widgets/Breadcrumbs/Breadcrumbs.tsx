import {FC, Fragment} from "react";
import {Link} from "react-router-dom";
import './Breadcrumbs.scss'

type items = {
    title: string;
    link?: string;
}

interface BreadcrumbProps {
    items: items[];
}

export const Breadcrumbs: FC<BreadcrumbProps> = ({ items}) => {

    return (
        <div className={'breadcrumbsContainer'}>
            {items.map((item, i) => (
                <Fragment key={i}>
                    {

                        (item.link && i !== items.length - 1) ?
                            item.title &&
                            <Link to={item.link} key={i} style={{ textDecoration: 'none' }}>
                                <div className={'breadcrumbsLink'}>
                                    {item.title}
                                </div>
                            </Link>
                            :
                            item.title &&
                            <p className={'breadcrumbsItem'}  key={i}>
                                {item.title}
                            </p>
                    }
                    {(i !== items.length - 1 && item.title)&&
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="#808080" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    }
                </Fragment>
            ))}
        </div>
    )
}