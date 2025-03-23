import {FC, Suspense} from "react";
import {Header} from "../../../widgets/Header/Header.tsx";
import {Footer} from "../../../widgets/Footer/Footer.tsx";
import {Loader} from "../../../shared/ui/Loader/Loader.tsx";
import {Outlet} from "react-router-dom";


export const MainLayout: FC = () => {
    return (
        <>
            <Header/>
            <Suspense fallback={<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}><Loader/></div>}>
                <Outlet></Outlet>
            </Suspense>
            <Footer/>
        </>
    )
}