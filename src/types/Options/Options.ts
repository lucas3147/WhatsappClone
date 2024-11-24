import { ReactNode } from "react";
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

export type DropDownOptionsContextProps = {
    show: boolean | null,
    setShow: (show: boolean | null) => void,
    children: ReactNode
}