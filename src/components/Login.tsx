import Auth from "@/services/firebase.service.auth";
import { UserType } from "@/types/User/UserType";

type Props = {
    onReceive: (userRegister: UserType) => Promise<void>
}

const Login = ({onReceive}: Props) => {
    const handleLogin = async () => {
        let user = await Auth.githubPopup();
        if (user){
            onReceive({id: user.uid, displayName: user.displayName, photoURL: user.photoURL});
        } else {
            alert('Não foi possível logar')
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
                <button 
                    onClick={handleLogin} 
                    className="rounded-md px-4 py-2 border-[1px] border-black text-white bg-[#161A1F]"
                >
                    Logar com o github
                </button>
        </div>
    )
}

export default Login;