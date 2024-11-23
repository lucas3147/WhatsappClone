import { SliderCardProps } from "@/types/Sliders/SliderCardType";

const SliderCardLeft = ({children, show} : SliderCardProps) => {
    return (
        <div className={`transition-all duration-500 w-full border-[#DDD] bg-[white] flex flex-col border-r-[1px] verticalFlap absolute top-0 bottom-0 left-0 ${show ? 'openFlap translate-x-0' : 'closeFlap translate-x-[-100%]'}`}>
            {children}
        </div>
    )
}

export default SliderCardLeft;