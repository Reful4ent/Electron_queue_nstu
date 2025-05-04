import {FC, PropsWithChildren} from "react";
import {useAuth} from "../../app/context/AuthProvider/context.ts";
import {Navigate} from "react-router-dom";


export const PrivateRoute:FC<PropsWithChildren> = ({children}) => {
    const auth = useAuth();

    if(auth?.jwt == '' || auth?.jwt == null)
        return <Navigate to="/auth/login" replace/>;
    return children;
}