import { ReactNode } from "react"

export type SliderCardProps = {
    show: boolean,
    children: ReactNode
}

export type SliderCardTitleProps = {
    title: string,
    handleShow: (show: boolean) => void
}