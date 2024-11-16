import { ActiveChatContextType, ChatUserItem } from "@/types/Chat/ChatType";
import { createContext, ReactNode, useContext, useState } from "react"

export const ActiveChatContext = createContext<ActiveChatContextType | null>(null);

export const ActiveChatProvider = ({children} : {children: ReactNode}) => {
    const [chat, setChat] = useState<ChatUserItem | null>(null);

    return (
        <ActiveChatContext.Provider value={{ chat, setChat}}>
            {children}
        </ActiveChatContext.Provider>
    );
}

export const useActiveChat = () => useContext(ActiveChatContext);