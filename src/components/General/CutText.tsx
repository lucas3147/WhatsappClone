export const CutText = ({text, className, onClick} : {text: string, className: string, onClick: () => void}) => {
    return (
        <div className={"overflow-hidden whitespace-nowrap text-ellipsis m-0 select-none" + className} onClick={onClick}>
            {text}
        </div>
    )
}