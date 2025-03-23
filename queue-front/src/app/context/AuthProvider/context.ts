import {createContext, useContext} from "react";
import {AuthContextType} from "./types.ts";

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext);