import { SliderCardTitleProps } from "@/types/Sliders/SliderCardType";
import IconItem from "../Icons/IconItem";

const SliderCardLeftTitle = ({title, handleShow} : SliderCardTitleProps) => {
    return (
        <div>
            <div className="flex bg-[#008069] items-center px-4 pb-4 pt-[60px]">
                <div onClick={() => handleShow(false)}>
                    <IconItem
                        className="iconTheme"
                        type="ArrowBackIcon"
                        style={{ color: '#FFF' }}
                    />
                </div>

                <div className="text-[19px] leading-10 h-10 flex-1 font-bold text-white ml-5">
                    {title}
                </div>
            </div>
        </div>
    )
}

export default SliderCardLeftTitle;