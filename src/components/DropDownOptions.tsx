'use client'

import { OptionsType } from "@/types/Options";
import { OptionsStateType } from "@/types/OptionsStateType";

type Props = {
    options: OptionsType[],
    stateOption: OptionsStateType,
    left?: number,
    right?: number,
};

const DropDownOptions = ({options, left, right, stateOption} : Props) => {
    var myStyle = setStyleBox(left, right);

    return (
        <div
            className={"options " + setStateBox(stateOption.open)}
            onClick={() => stateOption.setOpen(!stateOption.open)}
            style={myStyle}
        >
            <ul>
                {options.map((item) => (
                    <li key={item.id}>
                        <div
                            className="flex w-64 hover:bg-[#F5F5F5] cursor-pointer"
                            onClick={item.action}
                        >
                            <p className="overflow-hidden whitespace-nowrap text-ellipsis px-[24px] py-2">
                                {item.name}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const setStyleBox = (leftPosition?: number, righPosition?: number) : any => {
    var style: any = {
        position: 'absolute', 
        top: '50px', 
    }

    if (leftPosition) {
        style = {
            ...style,
            left: `${leftPosition.toFixed()}px`
        }
    }

    if (righPosition) {
        style = {
            ...style,
            right: `${righPosition.toFixed()}px`
        }
    }

    return style;
}

const setStateBox = (isOpen : boolean | null) : string => {
    return (isOpen == null ? '' : isOpen ? 'openOptions' : 'closeOptions')
}

export default DropDownOptions;