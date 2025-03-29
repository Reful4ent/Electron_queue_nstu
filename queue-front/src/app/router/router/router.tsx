import {Navigate, RouteObject} from "react-router-dom";
import {MainLayout} from "../../layout/MainLayout/MainLayout.tsx";
import {ErrorPage, HomePage, RegistrationPage, SignInPage} from "../lazyPages/lazyPages.tsx";
import {SignLayout} from "../../layout/SIgnInLayout/SignInLayout.tsx";
//import {PrivateRoute} from "../../../features/PrivateRoute/PrivateRoute.tsx";

export const router: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: 'home',
                element: <HomePage/>,
            },
            {
                path: "*",
                element: <Navigate to="home"/>
            },
            {
                path: "",
                element: <Navigate to="home"/>
            }
        ]
    },
    {
        path: 'auth/',
        element: <SignLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: 'login',
                element: <SignInPage/>
            },
            {
                path: 'register',
                element: <RegistrationPage/>
            },
            {
                path: "*",
                element: <Navigate to="login"/>
            },
            {
                path: "",
                element: <Navigate to="login"/>
            }
        ]
    }
]