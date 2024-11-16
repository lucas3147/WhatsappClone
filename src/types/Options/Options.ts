import { OptionsStateType } from "./OptionsStateType";

export type OptionsType = {
    id: number,
    name: string,
    action?: () => void;
}

export type DropDownOptionsProps = {
    options: OptionsType[],
    stateOption: OptionsStateType,
    left?: number,
    right?: number,
};

export type optionsStateType = {
    show: boolean | null,
    setShow: (show: boolean | null) => void
}