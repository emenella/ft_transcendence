import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { HeaderConnected, HeaderNotConnected } from './features/Structure/Headers';
import BodyNotConnected from './features/Structure/Body_not_connected';
import BodyConnected from './features/Structure/Body_connected';
import Footer from './features/Structure/Footer';
import { getToken } from './api/Api';
import { getMe, changeUserStatus } from './api/User';
import { firstConnexion } from './api/Auth';
import { User, UserStatus } from './utils/backend_interface';
import logo from './assets/black_logo.png';
import { UserContext } from './utils/UserContext';

function App() {
	//~~ States
	const [hasToken, setHasToken] = useState(!!getToken());
	const [user, setUser] = useState<User>();
	const [url, setUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<any>(null);

	//~~ Functions
	function handleLogout() {
		changeUserStatus(UserStatus.Disconnected);
		// Supprimer cookie
		localStorage.removeItem('token');
		setHasToken(false);
	}

	async function fetchUser() {
		try {
			setLoading(true);
			const user = await getMe();
			setUser(user);
			setLoading(false);
		}
		catch (error) {
			setError(error);
			setLoading(false);
		}
	}

	async function fetchUrl() {
		try {
			setLoading(true);
			const url = await firstConnexion() as string;
			setUrl(url);
			setLoading(false);
		}
		catch (error) {
			setError(error);
		}
	}

	React.useEffect(() => {
		if (hasToken) {
			fetchUser();
		}
		else {
			fetchUrl();
		}
	}, [hasToken]);

	//~~ Body
	if (loading) {
		return <p>Chargement en cours...</p>;
	}
	
	if (error) {
		return <p>Erreur : {error.message}</p>;
	}

	return (
		<div>
			<UserContext.Provider value={user}>
			<Toaster />
			<div className='flex-container'>
				<div>
					<img src={logo} alt='Logo du site' />
				</div>
				<div>
					<h1>Le meilleur jeu de pong de tout 42</h1>
				</div>
				<div>
					{	hasToken ?
						<HeaderConnected logout={handleLogout} /> :
						<HeaderNotConnected url={url!} />
					}
				</div>
			</div>
			{	hasToken ?
				<BodyConnected user={user!} /> :
				<BodyNotConnected />
			}
			<Footer />
			</UserContext.Provider>
		</div>
	);
}

export default App;
