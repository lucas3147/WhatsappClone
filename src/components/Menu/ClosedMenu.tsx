import { ClosedMenuProps } from "@/types/Menu/MenuType"
import IconItem from "../Icons/IconItem"

export const ClosedMenu = ({handleOpenMenu} : ClosedMenuProps) => {
    return (
        <div className="closed-menu-section">
            <IconItem
                type="MenuIcon"
                style={{ color: '#919191' }}
                className="iconTheme"
                onclick={handleOpenMenu}
            />
        </div>
    )
}