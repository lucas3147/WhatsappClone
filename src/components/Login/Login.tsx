import * as Auth from "@/communication/Firebase/authorization";
import * as Firestore from "@/communication/Firebase/firestore";
import { LoginProps } from "@/types/Login/LoginType";
import { Unsubscribe, User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import IconItem from "../Icons/IconItem";
import { CubeContainer, CubeFaceFront, CubeFaceLeft, CubeFaceRight, CubeScene, SideType } from "../StyledComponents/Cubo/Cube";
import { LoadingItem } from "@/types/Loading/LoadingItem";
import { Button, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInObject, SignInSchema, SignUpObject, SignUpSchema } from "@/schemas/Login/LoginSchemas";
import { generateId } from "@/utils/GenerateId";
import { photoUrlEmpty, UserType } from "@/types/User/UserType";
import { combineHashAndSalt, generateSalt, hashPassword, separateHashAndSalt, verifyPassword } from "@/utils/Crypto";
import DotsLoading from "../StyledComponents/Loading/DotsLoading";

const Login = ({ onReceive }: LoginProps) => {

	const {
		control: controlSignUp,
		handleSubmit: handleSubmitSignUp,
		setValue: setValueSignUp,
		setError: setErrorSignUp,
		clearErrors: clearErrorsSignUp
	} = useForm<SignUpObject>({
		resolver: zodResolver(SignUpSchema)
	});

	const {
		control : controlSignIn,
		handleSubmit : handleSubmitSignIn,
		setValue: setValueSignIn,
		setError : setErrorSignIn,
		clearErrors : clearErrorsSignIn
	} = useForm<SignInObject>({
		resolver: zodResolver(SignInSchema)
	});

	const [loading, setLoading] = useState<LoadingItem>({active: true});
	const [loadingSignUp, setLoadingSignUp] = useState(false);
	const [sideCube, setSideCube] = useState<SideType>('right');

	useEffect(() => {
		let unsubscribeUserAuthenticate: Unsubscribe;
	
		const onAuthenticate = async () => {
			unsubscribeUserAuthenticate = await Auth.onAuthenticateUser(async (User) => {
				loadUserProfile(User);
			}, () => {
				setSideCube('front');
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

	const handleSignUp : SubmitHandler<SignUpObject> = async ({privateName, displayName, password}) => {
		setLoadingSignUp(true);
		
		if (!await Firestore.existUserByPrivateName(privateName)) {
			const passSalt = generateSalt();

			const user : UserType = {
				id: generateId(),
				displayName,
				privateName,
				password: combineHashAndSalt(hashPassword(password, passSalt), passSalt),
				photoURL: photoUrlEmpty,
				note: '',
				allowNotifications: false
			}
			if (await Firestore.addUser(user)) {
				GoAreaSignIn();
			}
			else {
				alert('Algo deu errado ao cadastrar o usuário...');
			}
		}
		else {
			setErrorSignUp('privateName', {
				type: "manual",
				message: "Já existe um usuário cadastrado com esse nome",
			});
		}

		setLoadingSignUp(false);
	}

	const handleSignIn : SubmitHandler<SignInObject> = async({privateName, password}) => {
		let user : UserType | null = await Firestore.getUserByPrivateName(privateName);

		if (user) {
			if (user.password && verifyPassword(password, user.password)) {
				user.password = undefined;
				onReceive(user);
			}
			else {
				setErrorSignIn('privateName', {
					type: "manual",
					message: "O nome de usuário ou senha não correspondem",
				});
			}
		}
		else {
			setErrorSignIn('privateName', {
				type: "manual",
				message: "Usuário não cadastrado",
			});
		}
	}

	const GoAreaSignIn = () => {
		setSideCube('front');
		clearFieldsSignUp();
		clearErrorsFieldsSignUp();
	}

	const GoAreaSignUp = () => {
		console.log('dentro do GoAreaSignUp');
		setSideCube('left');
		clearFieldsSignIn();
		clearErrorsFieldsSignIn();
	}

	const clearFieldsSignUp = () => {
		setValueSignUp('privateName', '');
		setValueSignUp('displayName', '');
		setValueSignUp('password', '');
		setValueSignUp('confirmPassword', '');
	}

	const clearFieldsSignIn = () => {
		setValueSignIn('privateName', '');
		setValueSignIn('password', '');
	}

	const clearErrorsFieldsSignUp = () => {
		clearErrorsSignUp('privateName');
		clearErrorsSignUp('displayName');
		clearErrorsSignUp('password');
		clearErrorsSignUp('confirmPassword');
	}

	const clearErrorsFieldsSignIn = () => {
		clearErrorsSignIn('privateName');
		clearErrorsSignIn('password');
	}

	return (
		<CubeContainer>
			<CubeScene
				className="sm:w-[400px] w-[280px] h-[70svh]"
				side={sideCube}
			>
				<CubeFaceLeft
					className="flex flex-col justify-center items-center bg-white"
				>
					<div className="w-full flex items-center justify-center flex-col px-10 py-8">
						<div className="absolute top-4 right-4">
							<IconItem
								className="iconTheme"
								type="ArrowForwardIcon"
								onclick={GoAreaSignIn}
							/>
						</div>
						<div className="text-2xl font-bold mb-10 select-none">Cadastre-se</div>
						<div className="w-full flex flex-col items-center mb-10">
							<form onSubmit={handleSubmitSignUp(handleSignUp)}>
								<Controller
									control={controlSignUp}
									name="privateName"
									render={({field, fieldState}) => 
										<TextField
											{...field}
											required
											label="Nome privado"
											variant="outlined"
											style={{ 
												marginBottom: '16px', 
												width: '100%'
											}}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>
								<Controller
									control={controlSignUp}
									name="displayName"
									render={({field, fieldState}) => 
										<TextField
											{...field}
											required
											label="Nome público"
											variant="outlined"
											style={{ 
												marginBottom: '16px', 
												width: '100%'
											}}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>

								<Controller
									control={controlSignUp}
									name="password"
									render={({field, fieldState}) => 
										<TextField
											required
											{...field}
											label="Senha"
											variant="outlined"
											type="password"
											style={{ marginBottom: '16px', width: '100%' }}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>

								<Controller
									control={controlSignUp}
									name="confirmPassword"
									render={({field, fieldState}) => 
										<TextField
											required
											{...field}
											label="Confirme a senha"
											variant="outlined"
											type="password"
											style={{ marginBottom: '16px', width: '100%' }}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>

								<Button
									type='submit'
									variant="contained"
									className="w-full text-white"
									style={{
										marginBottom: '16px',
										background: '#6FB454',
										pointerEvents: loadingSignUp ? 'none' : 'auto' 
									}}
								>
									{loadingSignUp && 
										<>Aguarde</>
									}
									{!loadingSignUp && 
										<>Logar</>
									}
									
								</Button>
							</form>
						</div>
					</div>
				</CubeFaceLeft>
				<CubeFaceFront
					className="flex flex-col justify-center items-center bg-white"
				>
					<div className="w-full flex items-center justify-center flex-col px-10 py-8">
						<div className="text-2xl font-bold mb-10 select-none">Login</div>
						<div className="w-full flex flex-col items-center mb-10">
							<form onSubmit={handleSubmitSignIn(handleSignIn)} >
								<Controller
									control={controlSignIn}
									name="privateName"
									render={({field, fieldState}) => 
										<TextField
											{...field}
											label="Nome de usuário"
											variant="outlined"
											style={{ 
												marginBottom: '16px', 
												width: '100%'
											}}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>

								<Controller
									control={controlSignIn}
									name="password"
									render={({field, fieldState}) => 
										<TextField
											{...field}
											label="Senha"
											variant="outlined"
											type="password"
											style={{ marginBottom: '16px', width: '100%' }}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>

								<Button 
									type='submit'
									variant="contained"
									className="w-full text-white"
									style={{
										marginBottom: '8px',
										background: '#6FB454'
									}}
								>
									Entrar
								</Button>
							</form>
							<p 
								className="inline-block cursor-pointer text-sm text-[#686868] hover:text-[#000] underline underline-offset-2"
								onClick={GoAreaSignUp}
							>
								Cadastre-se
							</p>
						</div>
						<div className="absolute bottom-6 flex flex-col items-center w-full px-10">
							<div className="flex items-center mb-1 w-full">
								<span className="w-[35%] h-[1px] bg-[#686868] mr-1"></span>
								<p className="text-[12px] text-[#686868] select-none">Ou entre com</p>
								<span className="ml-1 w-[35%] h-[1px] bg-[#686868]"></span>
							</div>
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
				</CubeFaceFront>
				<CubeFaceRight
					className="bg-white flex justify-center items-center"
				>
					{loading?.active &&
						<DotsLoading 
							style={{backgroundColor: "#6FB454"}}
						/>
					}
				</CubeFaceRight>
			</CubeScene>
		</CubeContainer>
	)
}

export default Login;