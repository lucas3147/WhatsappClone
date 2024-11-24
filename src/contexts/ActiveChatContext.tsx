import { ActiveChatContextProps, ActiveChatContextType } from "@/types/Chat/ChatType";
import { createContext, useContext } from "react"

export const ActiveChatContext = createContext<ActiveChatContextType | null>(null);

export const ActiveChatProvider = ({activeChat, setActiveChat, children} : ActiveChatContextProps) => {
    return (
        <ActiveChatContext.Provider value={{ activeChat, setActiveChat}}>
            {children}
        </ActiveChatContext.Provider>
    );
}

export const useActiveChat = () => useContext(ActiveChatContext);