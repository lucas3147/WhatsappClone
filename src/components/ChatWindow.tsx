import { useState, useEffect, useRef, RefObject, MouseEvent } from "react";
import IconItem from "./IconItem";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import MessageItem from "./MessageItem";
import { UserType } from "@/types/UserType";
import { ChatItem } from "@/types/ChatType";
import Api from "@/services/firebase.services";
import DropDownOptions from "./DropDownOptions";
import { OptionsStateType } from "@/types/OptionsStateType";

type Props = {
    user: UserType,
    activeChat: ChatItem,
    setViewPerfil: (viewPerfil: boolean) => void
    stateOption: OptionsStateType,
}

const ChatWindow = ({user, activeChat, stateOption, setViewPerfil}: Props) => {
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);
    const [list, setList] = useState([]);
    const [users, setUsers] = useState<UserType[]>();
    const body = useRef<HTMLInputElement>(null);

    let recognition:SpeechRecognition;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition !== undefined) {
        recognition = new SpeechRecognition();
    }

    useEffect(() => {
        if (body.current && body.current.scrollHeight > body.current.offsetHeight){
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [list]);

    useEffect(() => {
        getChatContent();
    }, [activeChat.chatId]);

    const getChatContent = async () => {
        setList([]);
        let chat = await Api.onChatContent(activeChat.chatId);
        setList(chat.messages);
        setUsers(chat.users);
    }

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
                setText( e.results[0][0].transcript );
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
            await Api.sendMessage(activeChat, user.id, 'text', text, users);
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
        if (await Api.validationUser(user.id)) {
            await Api.deleteConversation(users);
            setList([]);
        } else {
            alert('Sinto muito. Você não tem acesso!');
        }
    }

    const viewerPerfil = () => {
        setViewPerfil(true);
    }

    return (
        <div className="flex flex-col h-full">

            <DropDownOptions
                options={
                    [
                        { id: 1, name: 'Apagar conversa', action: deleteConversation },
                    ]
                }
                right={27}
                stateOption={stateOption}
            />

            <div className="h-16 border-b-2 border-[#CCC] flex justify-between items-center">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={viewerPerfil}
                >
                    <img
                        className="h-10 w-10 rounded-[50%] ml-4 mr-4"
                        src={activeChat.image}
                        alt=""
                    />
                    <div
                        className="text-base text-black"
                    >
                        {activeChat.title}
                    </div>
                </div>

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
                        style={{pointerEvents: stateOption.open ? 'none' : 'auto'}}
                     >
                        <IconItem
                            className="iconTheme"
                            type="MoreVertIcon"
                            style={{ color: '#919191' }}
                        />
                    </div>

                </div>
            </div>
            <div ref={body} className="chatWindow--body">
                {list.length > 0 && list.map((item, key) => (
                    <MessageItem
                        key={key}
                        data={item} 
                        user={user}
                    />
                ))}
            </div>
            <div 
                className={"chatWindow--emojiArea " + (emojiOpen ? "h-[437px]" : "h-0")}>
                <Picker 
                    data={data} 
                    onEmojiSelect={handleEmojiClick}
                    theme={'light'} />
            </div>
            <div className="h-[62px] flex items-center">
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