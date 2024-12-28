import IconItem from "../Icons/IconItem"

export const CloseAreaRight = ({closeClick} : {closeClick: () => void}) => {
    return (
        <div className="flex items-center w-full h-16 bg-[white] px-4">
            <IconItem
                type="CloseOutlinedIcon"
                className="iconTheme"
                style={{ color: '#54656f', width: '50px', height: '50px', padding: '10px 10px' }}
                onclick={closeClick}
            />
        </div>
    )
}