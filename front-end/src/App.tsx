import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { HeaderConnected, HeaderNotConnected } from "./features/Structure/Headers";
import BodyNotConnected from "./features/Structure/Body_not_connected";
import BodyConnected from "./features/Structure/Body_connected";
import Footer from "./features/Structure/Footer";
import { getJwtCookie, removeJwtCookie } from "./api/JwtCookie";
import { getMe } from "./api/User";
import { firstConnexion } from "./api/Auth";
import { User } from "./utils/backend_interface";
import { UserContext } from "./utils/UserContext";
import logo from "./assets/black_logo.png";

function App() {
	//~~ States
	const [hasToken, setHasToken] = useState(!!getJwtCookie());
	const [user, setUser] = useState<User>();
	const [url, setUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	//~~ Functions
	function handleLogout() {
		removeJwtCookie();
		setHasToken(false);
		navigate("/home");
	}

	async function fetchUser() {
		setLoading(true);
		const user = await getMe();
		setUser(user);
		setLoading(false);
	}

	async function fetchUrl() {
		setLoading(true);
		const url = await firstConnexion() as string;
		setUrl(url);
		setLoading(false);
	}

	React.useEffect(() => {
		hasToken ? fetchUser() : fetchUrl();
	}, [hasToken]);

	//~~ Body
	if (loading)
		return <p>Chargement en cours...</p>;

	if (user && !user.isProfileComplete)
		navigate("/set-username");

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
						<HeaderNotConnected url={url!} />
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
