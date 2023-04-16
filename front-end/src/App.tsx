import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import './App.css';
import logo from './assets/black_logo.png';
import Footer from './components/Footer';
import HeaderConnected from './components/Header_connected';
import HeaderNotConnected from './components/Header_not_connected';
import BodyNotConnected from './components/Body_not_connected';
import BodyConnected from './components/Body_connected';
import { getToken, setToken } from './api/Api';
import { getMe, changeUserStatus } from './api/User';
import { User, UserStatus } from './utils/backend_interface';

function App() {
	const [hasToken, setHasToken] = useState(!!getToken());
	const [user, setUser] = useState<User>();
	const [loading, setLoading] = useState(true);
  	const [error, setError] = useState<any>(null);

	function handleLogout() {
		localStorage.removeItem('token');
		changeUserStatus(UserStatus.Disconnected);
		setHasToken(false);
	}

	function handleLogin(token: string) {
		setToken(token);
		setHasToken(true);
	}

	async function fetchUser() {
		try {
			const user = await getMe();
			setUser(user);
			setLoading(false);
		}
		catch (error) {
			setError(error);
			setLoading(false);
		}
	}

	React.useEffect(() => {
		if (hasToken) {
			fetchUser();
		}
		else {
			setLoading(false);
		}
	}, [hasToken]);

	if (loading) {
		return <p>Chargement en cours...</p>;
	  }
	
	if (error) {
		return <p>Erreur : {error.message}</p>;
	  }

	return (
		<div>
			<Toaster />
			<div className='flex-container'>
				<div>
					<img src={logo} alt='Logo du site' />
				</div>
				<div>
					<h1>Le meilleur jeu de pong de tout 42</h1>
				</div>
				<div>
					{hasToken ? (
						<HeaderConnected logout={handleLogout} />
					) : (
						<HeaderNotConnected login={handleLogin} />
					)}
				</div>
			</div>
			{hasToken ? <BodyConnected user={user!} /> : <BodyNotConnected />}
			<Footer />
		</div>
	);
}

export default App;
