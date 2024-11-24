"use client"

import { MouseEvent, useEffect, useState } from 'react';
import { UserType } from '@/types/User/UserType';
import { ChatUserItem } from '@/types/Chat/ChatType';
import Login from '@/components/Login/Login';
import ChatIntro from '@/components/Chats/ChatIntro';
import ChatWindow from '@/components/Chats/ChatWindow';
import OtherPerfil from '@/components/Perfil/OtherPerfil';
import * as Firebase from '@/communication/firebase/firestore';
import { ScaleMenu } from '@/components/Menu/ScaleMenu';
import { DropDownOptionsProvider } from '@/contexts/DropDownOptionsContext';
import { ActiveChatProvider } from '@/contexts/ActiveChatContext';

export default function Home() {

  const [activeChat, setActiveChat] = useState<ChatUserItem | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [showOtherPerfil, setShowOtherPerfil] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState<boolean | null>(null);
  const [showGeneralOptions, setShowGeneralOptions] = useState<boolean | null>(null);
  const [otherUser, setOtherUser] = useState<UserType | null>(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLoginData = async (user: UserType) => {
    let existUser = await Firebase.existUser(user.id);
    if (!existUser) 
    {
      await Firebase.addUser(user);
    }
    setUser(user);
  }

  const handleLoginTest = async () => {
    const user = await Firebase.getUser('54Afzw9Oo1XuVKqqJ6JccAzeho23');
    if (user) {
      console.log('passando aqui')
      setUser(user);
    }
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
    return (
      <Login onReceive={handleLoginData}/>
    );
  }

  return (
    <div className="hiddenComponents">
      <div className="absolute w-screen h-[141px] bg-[#00A884] top-0">
      </div>
      <div className="home" onClick={handleDisableFeatures}>
        <ActiveChatProvider
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        >
          <DropDownOptionsProvider
            show={showGeneralOptions}
            setShow={setShowGeneralOptions}
          >
            <ScaleMenu
              isOpenMainMenu={(windowSize.width > 700 || otherUser == null)}
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
        </ActiveChatProvider>
      </div>
    </div>
  )
}
