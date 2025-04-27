import {createContext} from "react";
import {ThemeContextType} from "./types.ts";
//ToDo: разобраться с типизацией
export const ThemeContext = createContext<ThemeContextType>([null, null]);
