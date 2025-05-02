import {FC, Suspense} from "react";
import {Header} from "../../../widgets/Header/Header.tsx";
import {Footer} from "../../../widgets/Footer/Footer.tsx";
import {Loader} from "../../../shared/ui/Loader/Loader.tsx";
import {Outlet} from "react-router-dom";
import './MainLayout.scss';

//ToDO: Вернул старые лейауты чтобы основной контент был кверху а не по центру, для страниц регистрации и авторизации сделал по центру
export const MainLayout: FC = () => {
    return (
        <div className='mainContent'>
            <div>
                <Header/>
                <Suspense fallback={<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}><Loader/></div>}>
                    <Outlet></Outlet>
                </Suspense>
            </div>
            <Footer/>
        </div>
    )
}