"use client"

import { MouseEvent, useState } from 'react';
import ChatIntro from '@/components/Chats/ChatIntro';
import ChatWindow from '@/components/Chats/ChatWindow';
import { UserType } from '@/types/User/UserType';
import Login from '@/components/Login/Login';
import * as Firebase from '@/communication/firebase/firestore';
import OtherPerfil from '@/components/Perfil/OtherPerfil';
import { useActiveChat } from '@/contexts/ActiveChatContext';
import { useGeneralOptions } from '@/contexts/generalOptionsContext';
import { MainMenu } from '@/components/Menu/MainMenu';

export default function Home() {

  const activeChatContext = useActiveChat();
  const generalOptionsContext = useGeneralOptions();
  const [user, setUser] = useState<UserType | null>(null);
  const [otherUser, setOtherUser] = useState<UserType>();
  const [showOtherPerfil, setShowOtherPerfil] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState<boolean | null>(null);

  const handleLoginData = async (user: UserType) => {
    let existUser = await Firebase.existUser(user.id);
    if (!existUser) 
    {
      await Firebase.addUser(user);
    }
    setUser(user);
  }

  const handleDisableFeatures = (e: MouseEvent) => {
    e.preventDefault();
    var divElement: any = e.target;
    if (divElement.classList[0] != 'options') {
      if (generalOptionsContext?.show) {
        generalOptionsContext.setShow(false);
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
          <MainMenu
            user={user}
            setUser={setUser}
            setOtherUser={setOtherUser}
            setShowOtherPerfil={setShowOtherPerfil}
            setShowUserOptions={setShowUserOptions}
          />
          <div className="flex-1">
            {activeChatContext?.chat?.chatId !== undefined &&
              <div className="h-full w-full relative">
                <ChatWindow
                  user={user}
                  activeChat={activeChatContext?.chat}
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
            {activeChatContext?.chat?.chatId == undefined &&
              <ChatIntro />
            }
          </div>
        </div>
    </div>
  )
}
