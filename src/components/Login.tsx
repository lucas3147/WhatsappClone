import Auth from "@/services/firebase.service.auth";
import Firestore from "@/services/firebase.service.firestore";
import { LoginProps } from "@/types/Login/LoginType";

const Login = ({ onReceive }: LoginProps) => {
	const handleLogin = async () => {
		let userGithub = await Auth.githubPopup();
		if (userGithub) {
			let user = await Firestore.getUser(userGithub.uid);
			onReceive({
				id: userGithub.uid,
				displayName: userGithub.displayName,
				photoURL: userGithub.photoURL,
				note: user?.note
			});
		} else {
			alert('Não foi possível logar');
		}
	}

	return (
		<div className="flex justify-center items-center h-screen">
			<button
				onClick={handleLogin}
				className="rounded-md px-4 py-2 border-[1px] border-black text-white bg-[#161A1F]">
				Logar com o github
			</button>
		</div>
	)
}

export default Login;