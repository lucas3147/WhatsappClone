import { DropDownOptionsContextProps, optionsStateType } from "@/types/Options/Options";
import { createContext, ReactNode, useContext, useState } from "react"

export const DropDownOptionsContext = createContext<optionsStateType | null>(null);

export const DropDownOptionsProvider = ({show, setShow, children} : DropDownOptionsContextProps) => {
    return (
        <DropDownOptionsContext.Provider value={{ show, setShow}}>
            {children}
        </DropDownOptionsContext.Provider>
    );
}

export const useDropDownOptions = () => useContext(DropDownOptionsContext);