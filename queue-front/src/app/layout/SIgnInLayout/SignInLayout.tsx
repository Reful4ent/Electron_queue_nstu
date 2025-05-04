import {Suspense} from "react";
import {Outlet} from "react-router-dom";
import {Loader} from "../../../shared/ui/Loader/Loader";
import {Header} from "../../../widgets/Header/Header";
import {Footer} from "../../../widgets/Footer/Footer";
import './SignInLayout.scss'

export const SignLayout = () => {
    return (
        <div className='mainContent'>
            <Header/>
            <Suspense
                fallback={<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                    <Loader/></div>}>
                <Outlet></Outlet>
            </Suspense>
            <Footer/>
        </div>
    )
}