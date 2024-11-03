import { MessageItemProps } from "@/types/Chat/MessageType";

const MessageItem = ({data, user}: MessageItemProps) => {

    const myMessageStyle = (myStyle: string, otherStyle: string) => {
        return user.id === data.author ? myStyle : otherStyle
    }
    return (
        <div 
            className="mb-2 flex"
            style={
                {justifyContent: myMessageStyle('flex-end','flex-start')}
            }
            >
            
            <div 
                className="bg-[white] rounded-[10px] shadow-[0_1px_1px_1px_#CCC] flex flex-col p-1 max-w-[90%]"
                style={
                    {backgroundColor: myMessageStyle('#DCF8C6', 'white')}
                }
                >
                <div className="text-sm my-[5px] mr-10 ml-[5px]">{data.body}</div>
                <div className="text-[11px] text-[#999] mt-[-15px] mr-[5px] text-right h-4">{`${data.date.toDate().getHours().toString().padStart(2, '0')}:${data.date.toDate().getMinutes().toString().padStart(2, '0')}`}</div>
            </div>

        </div>
    )
}

export default MessageItem;