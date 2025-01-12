import * as Auth from "@/communication/Firebase/authorization";
import * as Firestore from "@/communication/Firebase/firestore";
import { LoginProps } from "@/types/Login/LoginType";
import { Unsubscribe, User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import IconItem from "../Icons/IconItem";
import { CubeContainer, CubeFaceFront, CubeFaceLeft, CubeFaceRight, CubeScene } from "../StyledComponents/Cubo/Cube";
import CircularProgressBasic from "../Progress/CircularProgressBasic";
import { LoadingItem } from "@/types/Loading/LoadingItem";

const Login = ({ onReceive }: LoginProps) => {
	const cube = useRef<any>();
	const angleCube : number = 90;
	let xRotationCube : number = 0;
	let yRotationCube : number = 0;

	const [loading, setLoading] = useState<LoadingItem>({active: true, message: 'Carregando'});
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		let unsubscribeUserAuthenticate: Unsubscribe;
	
		const onAuthenticate = async () => {
			unsubscribeUserAuthenticate = await Auth.onAuthenticateUser(async (User) => {
				loadUserProfile(User);
			}, () => {
				setLoading({active: false});
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

	const rotateLeftCube = () => {
		yRotationCube += angleCube;
		if (cube.current) {
			cube.current.style.transform = `rotateX(${xRotationCube}deg) rotateY(${yRotationCube}deg)`;
		}
	}

	return (
		<CubeContainer>
			<CubeScene
				ref={cube}
				className="w-[80vw] max-w-[400px] h-[70svh]"
				onClick={rotateLeftCube}
			>
				<CubeFaceLeft
					className="bg-white rounded-md"
				>
					
				</CubeFaceLeft>
				<CubeFaceFront
					className="flex flex-col justify-center items-center bg-white rounded-md"
				>
					<div className="w-full flex items-center justify-center flex-col px-10 py-8">
						<div className="text-2xl font-bold mb-10 select-none">Login</div>
						<div className="w-full flex flex-col items-center mb-10">
							<input
								type="text"
								placeholder="Nome de usuário"
								className="w-full border-0 outline-none rounded-full bg-[#ddd] py-2 px-4 mb-4"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
							/>
							<input
								type="password"
								placeholder="Senha"
								className="w-full border-0 outline-none rounded-full bg-[#ddd] py-2 px-4 mb-4"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button className="uppercase w-full py-2 px-4 rounded-full bg-[#6FB454] text-white mb-4">
								Entrar
							</button>
							<p className="cursor-pointer text-sm text-[#686868] text-center">Cadastre-se</p>
						</div>
					</div>
					<div className="relative bottom-4 flex flex-col items-center">
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
				</CubeFaceFront>
				<CubeFaceRight
					className="bg-white rounded-md"
				>
					{loading?.active &&
						<CircularProgressBasic style={{ color: "#00A884" }}>
							<div className="text-[#00A884] text-lg font-semibold">{loading?.message}</div>
						</CircularProgressBasic>
					}
				</CubeFaceRight>
			</CubeScene>
		</CubeContainer>
	)
}

export default Login;