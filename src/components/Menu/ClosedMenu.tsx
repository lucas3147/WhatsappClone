import { ClosedMenuProps } from "@/types/Menu/MenuType"
import IconItem from "../Icons/IconItem"

export const ClosedMenu = ({handleOpenMenu, children} : ClosedMenuProps) => {
    return (
        <div className="closed-menu-section">
            <IconItem
                type="MenuIcon"
                style={{ color: '#919191' }}
                className="iconTheme"
                onclick={handleOpenMenu}
            />

            <div className="flex flex-col items-center mb-3">
                {children}
            </div>
        </div>
    )
}