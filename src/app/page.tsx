"use client"

import { MouseEvent, useEffect, useState } from 'react';
import { UserType } from '@/types/User/UserType';
import { ChatUserItem } from '@/types/Chat/ChatType';
import Login from '@/components/Login/Login';
import ChatIntro from '@/components/Chats/ChatIntro';
import ChatWindow from '@/components/Chats/ChatWindow';
import OtherPerfil from '@/components/Perfil/OtherPerfil';
import * as Firebase from '@/communication/firebase/firestore';
import { ScaledMenu } from '@/components/Menu/ScaledMenu';
import { DropDownOptionsProvider } from '@/contexts/DropDownOptionsContext';
import { ActiveChatProvider } from '@/contexts/ActiveChatContext';
import TopBar from '@/components/General/TopBar';
import VideoCall from '@/components/VideoCall/VideoCall';
import { HomeContainer } from '@/components/StyledComponents/Containers/Home';
import { HiddenComponentsContainer } from '@/components/StyledComponents/Containers/HiddenComponents';
import LoginTest from '@/components/Login/LoginTest';

export default function Home() {

  const [activeChat, setActiveChat] = useState<ChatUserItem | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [showOtherPerfil, setShowOtherPerfil] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState<boolean | null>(null);
  const [showGeneralOptions, setShowGeneralOptions] = useState<boolean | null>(null);
  const [otherUser, setOtherUser] = useState<UserType | null>(null);

  const handleLoginData = async (user: UserType) => {
    let existUser = await Firebase.existUser(user.id);
    if (!existUser) 
    {
      await Firebase.addUser(user);
    }
    setUser(user);
  }

  const handleLoginTest = async (user: UserType) => {
    setUser(user);
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

  const handleOtherUser = async (userId : string) => {
    const user = await Firebase.getUser(userId);
    if (user) {
      setOtherUser(user);
    }
  }

  if (user === null) {
    if (process.env.NEXT_PUBLIC_NODE_ENV !== 'testAndroid') {
      return (
        <Login onReceive={handleLoginData}/>
      );
    }
    else {
      return (
        <LoginTest onReceive={handleLoginTest}/>
      );
    }
  }

  return (
    <HiddenComponentsContainer>
      <TopBar />
      <HomeContainer onClick={handleDisableFeatures}>
        <ActiveChatProvider
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        >
          <DropDownOptionsProvider
            show={showGeneralOptions}
            setShow={setShowGeneralOptions}
          >
            <ScaledMenu
              userState={{
                state: user,
                setState: setUser
              }}
              handleOpenClosedMenu={() => {
                setOtherUser(null);
                setActiveChat(null);
              }}
              handleClickChatItem={(chatUserItem) => {
                setActiveChat(chatUserItem);
                setShowOtherPerfil(false);
                setShowUserOptions(null);
                handleOtherUser(chatUserItem.with);
              }}
            />
          </DropDownOptionsProvider>
          <div className="flex-1 h-full overflow-hidden">
            {activeChat?.chatId !== undefined &&
              <div className="h-full w-full relative">
                <ChatWindow
                  user={user}
                  setShowOtherPerfil={setShowOtherPerfil}
                  setShowVideoCall={setShowVideoCall}
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

                {otherUser && showVideoCall && 
                  <VideoCall
                    show={showVideoCall}
                    setShow={setShowVideoCall}
                    otherUser={otherUser}
                  />  
                }
                
              </div>
            }
            {activeChat?.chatId == undefined &&
              <ChatIntro />
            }
          </div>
        </ActiveChatProvider>
      </HomeContainer>
    </HiddenComponentsContainer>
  )
}
