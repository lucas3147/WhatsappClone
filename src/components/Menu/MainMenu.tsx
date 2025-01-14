"use client"

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { UserType } from "@/types/User/UserType";
import { ChatUserItem } from "@/types/Chat/ChatType";
import { Unsubscribe } from "firebase/auth";
import { MainMenuProps } from "@/types/Menu/MenuType";
import DropDownOptions from "../Options/DropDownOptions";
import NewChat from "../Chats/NewChat";
import Perfil from "../Perfil/Perfil";
import IconItem from "../Icons/IconItem";
import ChatListItem from "../Chats/ChatListItem";
import * as Firebase from '@/communication/Firebase/firestore';
import * as Auth from '@/communication/Firebase/authorization';
import { useDropDownOptions } from "@/contexts/DropDownOptionsContext";

export const MainMenu = ({ userState, onClickChatListItem }: MainMenuProps) => {

  const dropDownOptionsContext = useDropDownOptions();
  const [chatList, setChatList] = useState<ChatUserItem[]>([]);
  const [listUsersToConnect, setListUsersToConnect] = useState<UserType[]>([]);
  const [chatSearch, setChatSearch] = useState<string>('');
  const [listenerChats, setListenerChats] = useState<boolean>();
  const [listenerUsers, setListenerUsers] = useState<boolean>();
  const [showNewChat, setShowNewChat] = useState<boolean>(false);
  const [showPerfil, setShowPerfil] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribeChats: Unsubscribe;
    let unsubscribeUsers: Unsubscribe;

    const onChatList = async (userId: string) => {
      unsubscribeChats = await Firebase.onChatList(userId, async (myChats) => {
        handleUsersToConnect(userId);
        setChatList(handleSortChats(myChats));
      });
    };

    const onUserList = async (userId: string) => {
      unsubscribeUsers = await Firebase.onUsersToConnectList(userId, async () => {
        handleUsersToConnect(userId);
      });
    };

    if (userState.state !== null && listenerChats) {
      onChatList(userState.state.id);
    }

    if (userState.state !== null && listenerUsers) {
      onUserList(userState.state.id);
    }

    return () => {
      if (unsubscribeChats) {
        unsubscribeChats();
      }

      if (unsubscribeUsers) {
        unsubscribeUsers();
      }
    };
  }, [listenerChats, listenerUsers]);

  const handleListeners = () => {
    setListenerChats(true);
    setListenerUsers(true);
    handleUsersToConnect(userState.state.id);
  }

  const handleSortChats = (chats: ChatUserItem[]) => {
    chats.sort((a, b) => {
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

  const handleUsersToConnect = async (userId: string) => {
    const listUsers = await Firebase.getUsersToConnect(userId);
    setListUsersToConnect(listUsers);
  }

  const handleNewChat = () => {
    setShowNewChat(true);
  }

  const handlePerfil = () => {
    setShowPerfil(true);
  }

  const handleAddNewChat = async (otherUser: UserType) => {
    if (userState.state) {
      setShowNewChat(false);
      await Firebase.addNewChat(userState.state, otherUser);
      setListenerChats(false);
      setListenerChats(true);
    }
  }

  const handleSignOut = async () => {
    var logout = await Auth.signOut();
    if (logout) {
      userState.setState(null);
    }
  }

  const handleGeneralOptions = (e: MouseEvent) => {
    e.preventDefault();
    dropDownOptionsContext?.setShow(!dropDownOptionsContext.show);
  }

  const handleChatSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    setChatSearch(e.target.value);
  }

  return (
    <div className="menu-section" onLoad={handleListeners}>
      <div className='relative'>
        <DropDownOptions
          options={
            [
              { id: 1, name: 'Visite a página do Dev', action: () => window.location.href = 'https://github.com/lucas3147' },
              { id: 2, name: 'Configurações', action: () => alert('Em desenvolvimento...') },
              { id: 3, name: 'Desconectar', action: () => handleSignOut() }
            ]
          }
          right={20}
          stateOption={{
            open: dropDownOptionsContext?.show ?? null,
            setOpen: dropDownOptionsContext?.setShow!
          }}
        />
      </div>
      <div className="chatList-section">
        <NewChat
          addNewChat={handleAddNewChat}
          show={showNewChat}
          setShow={setShowNewChat}
          listUsers={listUsersToConnect}
        />
        <Perfil
          show={showPerfil}
          setShow={setShowPerfil}
          user={userState.state}
          setUser={userState.setState}
        />
        <div >
          <header className="h-16 px-4 flex justify-between items-center bg-[#F6F6F6]">
            <div onClick={handlePerfil}>
              <img
                className="w-10 h-10 rounded-[20px] cursor-pointer"
                src={userState.state.photoURL ?? ""}
                alt="icone do avatar" />
            </div>
            <div className="flex">
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
                className="chatSearch"
                type="text"
                value={chatSearch}
                onChange={handleChatSearch}
                placeholder="Procurar ou começar uma nova conversa" />

              {chatSearch &&
                <button
                  type="button"
                  id="clearButton"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 font-extrabold hover:text-green-700 focus:outline-none"
                  onClick={() => setChatSearch('')}
                >
                  &times;
                </button>
              }
            </div>

          </div>
          <div className="chatList">
            {chatList &&
              chatList
                .filter((item) => item.title.toLowerCase().includes(chatSearch.toLowerCase()))
                .map((item, key) => (
                  <ChatListItem
                    key={key}
                    chatItem={item}
                    onClick={() => onClickChatListItem(item)}
                  />
                ))}
          </div>
        </div>

      </div>
    </div>
  )
}