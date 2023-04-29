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

function App() {
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

		return () => {
			socket?.off(SockEvent.SE_FRONT_UPDATE);
		}
	}, []);

	//~~ Body
	if (loading)
		return <p>Chargement en cours...</p>;

	if (user && !user.isProfileComplete)
		navigate("/home/signup");

	return (
		<div>
			<UserContext.Provider value={{ user, setUser }}>
			<Toaster />
			<div className="flex-container">
				<div>
					<img src={logo} alt="Logo du site" />
				</div>
				<div>
					<h1>Pong Game</h1>
				</div>
				<div>
					{	hasToken ?
						<HeaderConnected logout={handleLogout} /> :
						<HeaderNotConnected url={url} funcLogin={handleLoginWithout42} />
					}
				</div>
			</div>
			{	hasToken ?
				<BodyConnected /> :
				<BodyNotConnected />
			}
			<Footer />
			</UserContext.Provider>
		</div>
	);
}

export default App;
