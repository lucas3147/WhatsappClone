import { UserType } from "@/types/User/UserType";
import * as Auth from "@/communication/firebase/authorization";
import * as Firestore from "@/communication/firebase/firestore";
import { useEffect, useState } from "react";
import { Unsubscribe, User } from "firebase/auth";

const LoginTest = ({ onReceive }: { onReceive: (User: UserType) => void }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserAuthenticate: Unsubscribe;

    const onAuthenticate = async () => {
      unsubscribeUserAuthenticate = await Auth.onAuthenticateUser(async (User) => {
        loadUserProfile(User);
      }, () => {
        setIsLoading(false);
      });
    };

    onAuthenticate();

    return () => {
      if (unsubscribeUserAuthenticate) {
        unsubscribeUserAuthenticate();
      }
    };
  }, []);

  const handleLogin = async () => {
    let user = await Firestore.getUser(process.env.NEXT_PUBLIC_TEST_UUID as string);

    user = {
      id: user?.id ?? '',
      displayName: user?.displayName ?? '',
      photoURL: user?.photoURL ?? '',
      note: user?.note
    };

    onReceive(user);
  }

  const loadUserProfile = async (userAuthenticated: User | null) => {
    if (userAuthenticated) {
      let user = await Firestore.getUser(userAuthenticated.uid);
      onReceive({
        id: userAuthenticated.uid,
        displayName: user?.displayName ?? userAuthenticated.displayName ?? 'usuário',
        photoURL: user?.photoURL ?? userAuthenticated.photoURL ?? '',
        note: user?.note
      });
    }
    else {
      alert('Não foi possível logar');
    }

  }

  return (
    <button
      onClick={handleLogin}
      className="rounded-md px-4 py-2 border-[1px] border-black text-white bg-[#161A1F]">
      Entrar (modo de teste)
    </button>
  )
}

export default LoginTest;

