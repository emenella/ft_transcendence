import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import logo from "./assets/black_logo.png";
import { HeaderConnected, HeaderNotConnected } from "./features/body/Headers";
import BodyNotConnected from "./features/body/Body_not_connected";
import BodyConnected from "./features/body/Body_connected";
import Footer from "./features/body/Footer";
import { getJwtCookie, removeJwtCookie } from "./api/Auth";
import { User, SockEvent } from "./utils/backendInterface";
import { getMe } from "./api/User.requests";
import { UserContext } from "./utils/UserContext";
import { SocketContext } from "./utils/SocketContext";

function App() {
	const [hasToken, setHasToken] = useState(!!getJwtCookie());
	const [user, setUser] = useState<User>();
	const [loading, setLoading] = useState(true);
	const socket = React.useContext(SocketContext);
	const navigate = useNavigate();
	
	function handleLogout() {
		removeJwtCookie();
		setHasToken(false);
	}
	
	// Fetch user if jwt is valid OR if refresh is required.
	useEffect(() => {
		async function fetchUser() {
			const user: User | undefined = await getMe();
			if (!user)
				handleLogout();
			setLoading(false);
			setUser(user);
			return user;
		}

		if (hasToken) {
			fetchUser().then((tmp) => {
				if (tmp && !tmp.isProfileComplete)
					navigate("/signup");
			});
		}
		else
			setLoading(false);

		socket?.on(SockEvent.SE_UPDATE_FRONT, () => { fetchUser(); });
		return () => { socket?.off(SockEvent.SE_UPDATE_FRONT); }
	}, [hasToken, navigate, socket]);

	if (loading)
		return <p>Chargement en cours...</p>;

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
						{
							hasToken ?
							<HeaderConnected logout={handleLogout} /> :
							<HeaderNotConnected />
						}
					</div>
				</div>
				{
					hasToken ?
					<BodyConnected /> :
					<BodyNotConnected />
				}
				<Footer />
			</UserContext.Provider>
		</div>
	);
}

export default App;
