import * as Auth from "@/communication/Firebase/authorization";
import * as Firestore from "@/communication/Firebase/firestore";
import { LoginProps } from "@/types/Login/LoginType";
import { Unsubscribe, User } from "firebase/auth";
import { useEffect, useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import IconItem from "../Icons/IconItem";

const Login = ({ onReceive }: LoginProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');

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
		loadUserProfile(await Auth.githubPopup() as any);
	}

	const loadUserProfile = async (userAuthenticated: User | null) => {
		if (userAuthenticated) {
			let user = await Firestore.getUser(userAuthenticated.uid);
			onReceive({
				id: userAuthenticated.uid,
				displayName: user?.displayName ?? userAuthenticated.displayName ?? 'usuário',
				photoURL: user?.photoURL ?? userAuthenticated.photoURL ?? '',
				note: user?.note,
				allowNotifications: user?.allowNotifications ?? false
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
				<div className="w-[80vw] max-w-[800px] h-[70svh] bg-white flex rounded-md">
					<div className="w-[50%] h-full bg-black hidden sm:block rounded-l-md">
						
					</div>
					<div className="flex-1 flex items-center justify-center flex-col relative">
						<div className="text-2xl font-bold mb-10 select-none">Login</div>
						<div className="flex flex-col items-center mb-10">
							<div className="mb-4">
								<input 
									type="text"
									placeholder="Nome de usuário"
									className="border-0 outline-none rounded-full bg-[#ddd] py-2 px-4"
									value={userName}
									onChange={(e) => setUserName(e.target.value)}
								/>
							</div>
							<div className="mb-4">
								<input 
									type="password"
									placeholder="Senha"
									className="border-0 outline-none rounded-full bg-[#ddd] py-2 px-4"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<div className="w-full">
								<button className="uppercase w-full py-2 px-4 rounded-full bg-[#6FB454] text-white mb-4">
									Entrar
								</button>
								<p className="cursor-pointer text-sm text-[#686868] text-center">Cadastre-se</p>
							</div>
						</div>
						<div className="absolute bottom-4 flex flex-col items-center">
							<p className="text-sm text-[#686868] mb-2 select-none">Entrar com outras plataformas</p>
							<IconItem
                                type='GitHubIcon'
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    color: '#000',
                                    cursor: 'pointer'
                                }}
                                onclick={handleLogin}
                            />
						</div>
					</div>
				</div>
			}
			
		</div>
	)
}

export default Login;