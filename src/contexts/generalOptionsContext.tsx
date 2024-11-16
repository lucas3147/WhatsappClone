import { optionsStateType } from "@/types/Options/Options";
import { createContext, ReactNode, useContext, useState } from "react"

export const GeneralOptionsContext = createContext<optionsStateType | null>(null);

export const GeneralOptionsProvider = ({children} : {children: ReactNode}) => {
    const [show, setShow] = useState<boolean | null>(null);

    return (
        <GeneralOptionsContext.Provider value={{ show, setShow}}>
            {children}
        </GeneralOptionsContext.Provider>
    );
}

export const useGeneralOptions = () => useContext(GeneralOptionsContext);