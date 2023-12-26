"use client"

import { MouseEvent, useEffect, useState } from 'react';
import ChatListItem from '@/components/ChatListItem';
import ChatIntro from '@/components/ChatIntro';
import ChatWindow from '@/components/ChatWindow';
import { ChatItem } from '@/types/ChatType';
import IconItem from '@/components/IconItem';
import NewChat from '@/components/NewChat';
import { UserType } from '@/types/UserType';
import Login from '@/components/Login';
import Api from '@/Api';
import Perfil from '@/components/Perfil';
import DropDownOptions from '@/components/DropDownOptions';
import { redirect, useRouter } from 'next/navigation';

export default function Home() {

  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [activeChat, setActiveChat] = useState<ChatItem>();
  const [user, setUser] = useState<UserType | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [listContacts, setListContacts] = useState<any[]>([]);
  const [showGeneralOptions, setShowGeneralOptions] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      let onsub = Api.onChatList(user.codeDataBase, setChatList);
      return onsub;
    }
  },[listContacts]);

  const handleLoginData = async (newUser: UserType) => {
    let userAdded = await Api.addUser(newUser);
    if (userAdded == false) {
      newUser = await Api.getUser(newUser.id);
    }
    let contacts = await Api.getContactsIncluded(newUser.id);
    setListContacts(contacts);
    setUser(newUser);
  }

  const handleNewChat = async () => {
    setShowNewChat(true);
  }

  const handlePerfil = async () => {
    setShowPerfil(true);
  }

  const handleGeneralOptions = (e: MouseEvent) => {
    setShowGeneralOptions(!showGeneralOptions);
  }

  const handleDisableFeatures = (e: MouseEvent) => {
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
        <div className="sidebar w-2/6 max-w-[415px] min-w-[350px] flex flex-col border-r-2 border-[#ddd]">
          <div className="relative">
          {showGeneralOptions &&
            <DropDownOptions
              options={
                [
                  { id: 1, name: 'Visite a página do Dev', action: () => router.push('https://github.com/lucas3147')},
                  { id: 2, name: 'Configurações', action: () => alert('Em desenvolvimento...') },
                  { id: 3, name: 'Desconectar', action: () => alert('Em desenvolvimento...') }
                ]
              }
              right={20}
            />
          }
          </div>
          
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
          <header className="h-16 px-4 flex justify-between items-center">
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
                onClick={() => setActiveChat(chatList[key])}
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          {activeChat?.chatId !== undefined &&
            <ChatWindow
              user={user}
              activeChat={activeChat}
              showUserOptions={showUserOptions}
              setShowUserOptions={setShowUserOptions}
            />
          }
          {activeChat?.chatId == undefined &&
            <ChatIntro />
          }

        </div>
      </div>
    </div>
  )
}
