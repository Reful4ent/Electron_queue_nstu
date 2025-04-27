import {useLocalStorage} from "../../../shared/hooks/useLocalStorage/useLocalStorage.ts";
import {FC, PropsWithChildren, useEffect} from "react";
import {ThemeContext} from "./context.ts";

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useLocalStorage('theme','light');

    const components = [
        'body',
    ]

    useEffect(() => {
        if(theme === 'dark') {
            components.forEach(component => document.querySelectorAll(component).forEach(el => el.classList.add("dark")));
        } else {
            components.forEach(component => document.querySelectorAll(component).forEach(el => el.classList.remove("dark")));
        }
    }, [theme]);

    return(
        <>
            <ThemeContext.Provider value={[theme, setTheme]}>
                {children}
            </ThemeContext.Provider>
        </>
    )
}