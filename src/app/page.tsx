"use client"

import { MouseEvent, useEffect, useState } from 'react';
import ChatListItem from '@/components/Chats/ChatListItem';
import ChatIntro from '@/components/Chats/ChatIntro';
import ChatWindow from '@/components/Chats/ChatWindow';
import { ChatUserItem } from '@/types/Chat/ChatType';
import IconItem from '@/components/Icons/IconItem';
import NewChat from '@/components/Chats/NewChat';
import { UserType } from '@/types/User/UserType';
import Login from '@/components/Login';
import Firebase from '@/services/firebase.service.firestore';
import Auth from '@/services/firebase.service.auth';
import Perfil from '@/components/Perfil/Perfil';
import DropDownOptions from '@/components/Options/DropDownOptions';
import { useRouter } from 'next/navigation';
import OtherPerfil from '@/components/Perfil/OtherPerfil';

export default function Home() {

  const [chatList, setChatList] = useState<ChatUserItem[]>([]);
  const [listContacts, setListContacts] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<ChatUserItem>();
  const [user, setUser] = useState<UserType | null>(null);
  const [otherUser, setOtherUser] = useState<UserType>();
  const [showNewChat, setShowNewChat] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [showOtherPerfil, setShowOtherPerfil] = useState(false);
  const [showGeneralOptions, setShowGeneralOptions] = useState<boolean | null>(null);
  const [showUserOptions, setShowUserOptions] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      return Firebase.onChatList(user.id, (myChats) => {
        setChatList(handleSortChats(myChats));
      });
    }
  },[listContacts]);

  const handleSortChats = (chats : ChatUserItem[]) => {
    chats.sort((a,b) => {
      if (a.lastMessageDate === undefined) {
        return -1;
      }
      if (b.lastMessageDate === undefined) {
        return -1;
      }
      if (a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
        return 1;
      } else {
        return -1;
      }
    });

    return chats;
  }

  const handleLoginData = async (user: UserType) => {
    let existUser = await Firebase.existUser(user.id);
    if (!existUser) 
    {
      await Firebase.addUser(user);
    }
    let contacts = await Firebase.getContactsIncluded(user.id);
    setUser(user);
    setListContacts(contacts);
  }

  const handleNewChat = () => {
    setShowNewChat(true);
  }

  const handlePerfil = () => {
    setShowPerfil(true);
  }

  const handleGeneralOptions = (e: MouseEvent) => {
    e.preventDefault();
    setShowGeneralOptions(!showGeneralOptions);
  }

  const handleDisableFeatures = (e: MouseEvent) => {
    e.preventDefault();
    var divElement: any = e.target;
    if (divElement.classList[0] != 'options') {
      if (showGeneralOptions) {
        setShowGeneralOptions(false);
      }
      if (showUserOptions) {
        setShowUserOptions(false);
      }
    }
  }

  const handleSignOut = async () => {
    var logout = await Auth.signOut();
    if (logout) {
      setUser(null);
    }
  }

  const handleOtherUser = async (userId : string) => {
    const user = await Firebase.getUser(userId);
    if (user) {
      setOtherUser(user);
    }
  }

  if (user === null) {
    return (
      <Login onReceive={handleLoginData}/>
    );
  }

  return (
    <div className="hiddenComponents">
      <div className="absolute w-screen h-[141px] bg-[#00A884] top-0">
      </div>
      <div className="home" onClick={(e) => handleDisableFeatures(e)}>
        <div className="relative sidebar w-2/6 max-w-[415px] min-w-[350px] flex flex-col border-r-2 border-[#ddd]">
          <div className='relative'>
            <DropDownOptions
              options={
                [
                  { id: 1, name: 'Visite a página do Dev', action: () => router.push('https://github.com/lucas3147')},
                  { id: 2, name: 'Configurações', action: () => alert('Em desenvolvimento...') },
                  { id: 3, name: 'Desconectar', action: () => handleSignOut() }
                ]
              }
              right={20}
              stateOption={{
                open: showGeneralOptions,
                setOpen: setShowGeneralOptions
              }}
            />
          </div>
          <div className="relative w-full h-full flex flex-col bg-[white]">
            <NewChat
              listContacts={listContacts}
              setListContacts={setListContacts}
              user={user}
              show={showNewChat}
              setShow={setShowNewChat}
            />
            <Perfil
              show={showPerfil}
              setShow={setShowPerfil}
              user={user}
              setUser={setUser}
            />
            <div >
              <header className="h-16 px-4 flex justify-between items-center bg-[#F6F6F6]">
                <div onClick={handlePerfil}>
                  <img
                    className="w-10 h-10 rounded-[20px] cursor-pointer"
                    src={user.photoURL ? user.photoURL : ""}
                    alt="icone do avatar" />
                </div>
                <div
                  className="flex"
                >
                  <IconItem
                    className="iconTheme"
                    type='DonutLargeIcon'
                    style={{ color: '#919191' }}
                  />
                  <div onClick={handleNewChat}>
                    <IconItem
                      className="iconTheme"
                      type='ChatIcon'
                      style={{ color: '#919191' }}
                    />
                  </div>
                  <div onClick={(e) => handleGeneralOptions(e)}>
                    <IconItem
                      className="iconTheme"
                      type='MoreVertIcon'
                      style={{ color: '#919191' }}
                    />
                  </div>
                </div>
              </header>

              <div className="bg-[#F6F6F6] border-b-2 border-[#EEE] py-1 px-4">
                <div className="bg-[white] h-10 rounded-[20px] flex items-center py-0 px-[10px]">
                  <IconItem
                    className="iconTheme"
                    type='SearchIcon'
                    style={{ color: '#919191' }}
                  />
                  <input
                    className="bg-[transparent] flex-1 border-0 outline-none ml-2 overflow-hidden whitespace-nowrap"
                    type="search"
                    placeholder="Procurar ou começar uma nova conversa" />
                </div>

              </div>
              <div className="chatList">
                {chatList && chatList.map((item, key) => (
                  <ChatListItem
                    key={key}
                    chatItem={chatList[key]}
                    active={activeChat?.chatId == chatList[key].chatId}
                    onClick={() => {
                      setActiveChat(chatList[key]);
                      setShowOtherPerfil(false);
                      setShowUserOptions(null);
                      handleOtherUser(chatList[key].with);
                    }}
                  />
                ))}
              </div>
            </div>
            
          </div>
          </div>
        <div className="flex-1">
          {activeChat?.chatId !== undefined &&
            <div className="h-full w-full relative">
              <ChatWindow
                user={user}
                activeChat={activeChat}
                setViewPerfil={setShowOtherPerfil}
                stateOption={{
                  open: showUserOptions,
                  setOpen: setShowUserOptions
                }}
              />

              {otherUser &&
                <OtherPerfil
                  user={otherUser}
                  setShow={setShowOtherPerfil}
                  show={showOtherPerfil}
                />
              }
            </div>
          }
          {activeChat?.chatId == undefined &&
            <ChatIntro />
          }
        </div>
      </div>
    </div>
  )
}
