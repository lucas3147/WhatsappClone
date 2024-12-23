import * as Auth from "@/communication/firebase/authorization";
import * as Firestore from "@/communication/firebase/firestore";
import { LoginProps } from "@/types/Login/LoginType";
import { Unsubscribe, User } from "firebase/auth";
import { useEffect, useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

const Login = ({ onReceive }: LoginProps) => {

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let unsubscribeUserAuthenticate: Unsubscribe;
	
		const onAuthenticate = async () => {
			unsubscribeUserAuthenticate = await Auth.onAuthenticateUser(async (User) => {
				loadUserProfile(User);
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
		loadUserProfile(await Auth.githubPopup() as any);
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
		<div className="flex justify-center items-center h-screen">
			{isLoading && 
				<LoadingButton
					loading
					style={{color: 'black'}}
					loadingPosition="start"
					startIcon={<SaveIcon />}
					variant="outlined"
				>
					Carregando
				</LoadingButton>
			}
			{!isLoading &&
				<button
					onClick={handleLogin}
					className="rounded-md px-4 py-2 border-[1px] border-black text-white bg-[#161A1F]">
					Logar com o github
				</button>
			}
			
		</div>
	)
}

export default Login;