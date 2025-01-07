import { useEffect, useState } from "react";
import { ClosedMenu } from "./ClosedMenu";
import { MainMenu } from "./MainMenu";
import { ScaleMenuProps } from "@/types/Menu/MenuType";
import { useActiveChat } from "@/contexts/ActiveChatContext";

export const ScaledMenu = ({userState, handleOpenClosedMenu, handleClickChatItem, showMenu} : ScaleMenuProps) => {
    const { activeChat } = useActiveChat()!;
    const [widthPage, setWidthPage] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidthPage(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {!(widthPage > 700 || activeChat == null) && showMenu &&
                <ClosedMenu
                    handleOpenMenu={handleOpenClosedMenu}
                />
            }
            {(widthPage > 700 || activeChat == null) &&
                <MainMenu
                    userState={userState}
                    onClickChatListItem={handleClickChatItem}
                />
            }
        </>
    )
}