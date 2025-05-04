import {FC, PropsWithChildren, useCallback, useState} from "react";
import {AuthContext} from "./context.ts";


export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [jwt, setJwt] = useState<string>(localStorage.getItem('jwt') ?? '');

    const setJwtHandler = useCallback((value: string) => {
        localStorage.setItem('jwt', value);
        setJwt(value);
    }, []);

    const value = {
        jwt: jwt,
        setJwt: setJwtHandler
    }

    return (
        <AuthContext value={value}>
            {children}
        </AuthContext>
    )
}