import {Suspense} from "react";
import {Outlet} from "react-router-dom";
import {Loader} from "../../../shared/ui/Loader/Loader";
import {Header} from "../../../widgets/Header/Header";
import {Footer} from "../../../widgets/Footer/Footer";

export const SignLayout = () => {
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