import {FC, Suspense} from "react";
import {Header} from "../../../widgets/Header/Header.tsx";
import {Footer} from "../../../widgets/Footer/Footer.tsx";
import {Loader} from "../../../shared/ui/Loader/Loader.tsx";


export const MainLayout: FC = () => {
    return (
        <>
            <Header/>
            <Suspense fallback={<Loader/>}>
                <Outlet></Outlet>
            </Suspense>
            <Footer/>
        </>
    )
}