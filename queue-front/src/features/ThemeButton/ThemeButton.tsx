import {FC, useContext} from "react";
import {ThemeContext} from "../../app/context/ThemeProvider/context.ts";
import {MoonOutlined, SunOutlined} from "@ant-design/icons";
import {Button} from "antd";

export const ThemeButton: FC = () => {
    const [theme, setTheme] = useContext(ThemeContext);


    const themeHandleChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    }

    return (
        <>
            <Button className="headerItem themeButton" onClick={themeHandleChange}>
                {theme == "light" ? <MoonOutlined className='themeIcon' /> : <SunOutlined className='themeIcon' style={{color: 'white'}} />}
            </Button>
        </>
    )
}