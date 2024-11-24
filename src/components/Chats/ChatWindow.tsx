import { useState, useEffect, useRef, MouseEvent } from "react";
import IconItem from "../Icons/IconItem";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import MessageItem from "./MessageItem";
import { UsersIdType } from "@/types/User/UserType";
import { ChatWindowProps } from "@/types/Chat/ChatType";
import * as Firebase from "@/communication/firebase/firestore";
import DropDownOptions from "../Options/DropDownOptions";
import { MessageItemType } from "@/types/Chat/MessageType";
import { Timestamp } from "firebase/firestore";
import { recognition, startSpeechRecognition } from "@/utils/AccessMicrophone";
import { CutText } from "../General/CutText";
import { useActiveChat } from "@/contexts/ActiveChatContext";

const ChatWindow = ({user, stateOption, setViewPerfil}: ChatWindowProps) => {

    const { activeChat, setActiveChat } = useActiveChat()!;

    const [emojiOpen, setEmojiOpen] = useState(false);
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);
    const [listMessages, setListMessages] = useState<MessageItemType[]>([]);
    const [users, setUsers] = useState<UsersIdType>([]);
    const body = useRef<HTMLInputElement>(null);

    startSpeechRecognition();
    
    useEffect(() => {
        if (body.current && body.current.scrollHeight > body.current.offsetHeight){
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [listMessages]);

    useEffect(() => {
        const onChatContent = async () => {
            return Firebase.onChatContent(activeChat!.chatId, (chat) => {
                setListMessages([]);
                setListMessages(chat.messages);
                setUsers(chat.users);
            });
        }

        onChatContent();
    }, [activeChat?.chatId]);

    const handleEmojiClick = (data: any) => {
        setText(text + data.native);
    }

    const handleMicClick = () => {
        if (recognition !== null) {
            recognition.onstart = () => {
                setListening(true);
            }
            recognition.onend = () => {
                setListening(false);
            }
            recognition.onresult = (e) => {
                setText(e.results[0][0].transcript);
            }

            recognition.start();

        } else {
            alert('Sinto muito! Esse recurso não está disponível para o seu navegador.');
        }
    }

    const handleSendClick = async () => {
        if (text !== '') {
            setText('');
            setEmojiOpen(false);
            const message : MessageItemType = { author: user.id, body: text, date: Timestamp.fromDate(new Date()), type: 'text'};
            await Firebase.sendMessage(activeChat!.chatId, message, users);
        }
    }

    const handleInputKeyUp = (e: any) => {
        if (e.keyCode == 13) {
            handleSendClick();
        }
    }

    const handleUserOptions = (e: MouseEvent) => {
        stateOption.setOpen(!stateOption.open);
    }

    const deleteConversation = async () => {
        stateOption.setOpen(false);
        if (await Firebase.validationUser(user.id)) {
            await Firebase.deleteConversation(users);
            setListMessages([]);
        } else {
            alert('Sinto muito. Você não tem acesso!');
        }
    }

    const viewerPerfil = () => {
        setViewPerfil(true);
    }

    return (
        <div className="flex flex-col absolute w-full h-full">

            <DropDownOptions
                options={
                    [
                        { id: 1, name: 'Apagar conversa', action: deleteConversation }
                    ]
                }
                right={27}
                stateOption={stateOption}
            />

            <div className="h-16 border-b-2 border-[#CCC] flex justify-between items-center no-select">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={viewerPerfil}
                >
                    <img
                        className="h-10 w-10 rounded-[50%] ml-4 mr-4"
                        src={activeChat?.image}
                        alt=""
                    />
                </div>
                <div className="flex flex-1 min-w-0 flex-wrap justify-center">
                    <div className="flex justify-between items-center w-full">
                        <CutText 
                            text={activeChat!.title} 
                            className={"text-base text-black"} 
                            onClick={viewerPerfil}
                        />
                        <div className="flex items-center mr-4">
                            <IconItem
                                className="iconTheme"
                                type="SearchIcon"
                                style={{ color: '#919191' }}
                            />
                            <IconItem
                                className="iconTheme"
                                type="AttachFileIcon"
                                style={{ color: '#919191' }}
                            />
                            <div
                                onClick={(e) => handleUserOptions(e)}
                                style={{ pointerEvents: stateOption.open ? 'none' : 'auto' }}
                            >
                                <IconItem
                                    className="iconTheme"
                                    type="MoreVertIcon"
                                    style={{ color: '#919191' }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div ref={body} className="chatWindow--body">
                {listMessages.length > 0 && listMessages.map((item, key) => (
                    <MessageItem
                        key={key}
                        data={item} 
                        user={user}
                    />
                ))}
            </div>
            <div className={"chatWindow--emojiArea " + (emojiOpen ? "h-[437px]" : "h-0")}>
                <Picker 
                    data={data} 
                    onEmojiSelect={handleEmojiClick}
                    theme={'light'} />
            </div>
            <div className={`h-[62px] flex items-center`}>
                <div className="flex my-0 mx-4" onClick={() => setEmojiOpen(!emojiOpen)}>
                    <IconItem
                        className="iconTheme"
                        type="EmojiEmotionsIcon"
                        style={{ color: emojiOpen ? '#009688' : '#919191' }}
                    />
                </div>
                <div className="flex-1">
                    <input
                        className="w-full h-10 border-0 outline-none bg-white rounded-3xl text-base text-[#4A4A4A] px-4"
                        type="text"
                        placeholder="Digite uma mensagem"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyUp={handleInputKeyUp}
                    />
                </div>
                <div className="flex my-0 mx-4">
                    {text === '' &&
                        <div onClick={handleMicClick}>
                            <IconItem
                                className="iconTheme"
                                type="MicIcon"
                                style={{ color: listening ? '#009688' : '#919191' }}
                            />
                        </div>
                    }
                    
                    {text !== '' && 
                        <div onClick={handleSendClick}>
                            <IconItem
                                className="iconTheme"
                                type="SendIcon"
                                style={{ color: '#919191' }}
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ChatWindow;