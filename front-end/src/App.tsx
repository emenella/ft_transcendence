import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { HeaderConnected, HeaderNotConnected } from "./features/Structure/Headers";
import BodyNotConnected from "./features/Structure/Body_not_connected";
import BodyConnected from "./features/Structure/Body_connected";
import Footer from "./features/Structure/Footer";
import { getJwtCookie, removeJwtCookie, setJwtCookie, socket } from "./api/JwtCookie";
import { getMe } from "./api/User";
import { get42URL, loginWith42 } from "./api/Auth";
import { SockEvent, User } from "./utils/backendInterface";
import { UserContext } from "./utils/UserContext";
import logo from "./assets/black_logo.png";

export default function App() {
	//~~ States
	const [hasToken, setHasToken] = useState(!!getJwtCookie());
	const [user, setUser] = useState<User>();
	const [url] = useState<string>(get42URL() as string);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	//~~ Functions
	function handleLogout() {
		removeJwtCookie();
		setHasToken(false);
		navigate("/home");
	}

	const handleLoginWithout42 = (id: number) => {
		loginWith42(id).then((token) => {
			if (token) {
				setHasToken(true);
				setJwtCookie(token);
				navigate("/home");
			}
		});
	};

	async function fetchUser() {
		const user = await getMe().catch((err) => {
			navigate("/error");
		});
		if (user)
			setUser(user);
		setLoading(false);
	}

	React.useEffect(() => {
		hasToken ? fetchUser() : setLoading(false);
	}, [hasToken]);

	React.useEffect(() => {
		socket?.on(SockEvent.SE_FRONT_UPDATE, () => {
			fetchUser().catch((err) => console.error(err));
		});
		if (user && !user.isProfileComplete)
			navigate("/home/signup");
		return () => {
			socket?.off(SockEvent.SE_FRONT_UPDATE);
		}
	}, [user]);

	//~~ Body
	if (loading)
		return <p>Chargement en cours...</p>;

	return (
		<div className="h-screen flex flex-col min-h-screen min-w-screen">
			<UserContext.Provider value={{ user, setUser }}>
			{/* <Toaster /> */}
			<div className="flex flex-1 justify-around items-center bg-teal-600 text-white h-1/6">
				<div className="text-center w-20">
					<img src={logo} alt="Logo du site" className="w-full h-full"/>
				</div>
				<div className="text-center">
					<h1 className="text-5xl font-bold underline">Pong Game</h1>
				</div>
				<div className="text-center h-max">
					{	hasToken ?
						<HeaderConnected logout={handleLogout} /> :
						<HeaderNotConnected url={url} funcLogin={handleLoginWithout42} />
					}
				</div>
			</div>
			<div className="h-5/6 flex-grow">
				{	hasToken ?
					<BodyConnected /> :
					<BodyNotConnected />
				}
			</div>
			<div className="bg-gray-800 text-gray-300 py-4 w-full h-20 bottom-0 left-0 absolute z-10">
				<Footer />
			</div>
			</UserContext.Provider>
		</div>
	);
}
