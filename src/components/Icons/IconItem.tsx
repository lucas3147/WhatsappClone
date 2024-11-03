import { IconItemProps, iconMap } from "@/types/Icons/IconItemProps";

const IconItem = ({type, className, style, onclick} : IconItemProps) => {
    const IconComponent = iconMap[type];

    return (
        <div className={className} onClick={onclick}>
            {IconComponent ? <IconComponent style={style} /> : null}
        </div>
    );
};

export default IconItem;
