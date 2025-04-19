import {Navigate, RouteObject} from "react-router-dom";
import {MainLayout} from "../../layout/MainLayout/MainLayout.tsx";
import {
    ConsultationCreatePage,
    DeansConsultationsPage,
    EmployeesConsultationsPage,
    ErrorPage,
    HomePage, MyProfilePage,
    RegistrationPage,
    SignInPage
} from "../lazyPages/lazyPages.tsx";
import {PrivateRoute} from "../../../features/PrivateRoute/PrivateRoute.tsx";
import {EmployeeMeConsultationsPage} from "../../../pages/EmployeeMeConsultationsPage/EmployeeMeConsultationsPage.tsx";

export const router: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: 'home',
                element: <HomePage/>
            },
            {
                path: '/consultations/deans',
                element: <DeansConsultationsPage/>
            },
            {
                path: '/consultations/employees',
                element: <PrivateRoute><EmployeesConsultationsPage/></PrivateRoute>
            },
            {
                path: '/profile/:id/my-consultations/create',
                element: <PrivateRoute><ConsultationCreatePage/></PrivateRoute>
            },
            {
                path: '/profile/:id/my-consultations',
                element: <PrivateRoute><EmployeeMeConsultationsPage/></PrivateRoute>
            },
            {
                path: '/profile/:id',
                element: <PrivateRoute><MyProfilePage/></PrivateRoute>
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
        element: <MainLayout/>,
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