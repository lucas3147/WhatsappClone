import { ClosedMenu } from "./ClosedMenu";
import { MainMenu } from "./MainMenu";
import { ScaleMenuProps } from "@/types/Menu/MenuType";

export const ScaleMenu = ({isOpenMainMenu, userState, handleOpenClosedMenu, handleClickChatItem} : ScaleMenuProps) => {
    return (
        <>
            {!isOpenMainMenu &&
                <ClosedMenu
                    handleOpenMenu={handleOpenClosedMenu}
                />
            }
            {isOpenMainMenu &&
                <MainMenu
                    userState={userState}
                    onClickChatListItem={handleClickChatItem}
                />
            }
        </>
    )
}