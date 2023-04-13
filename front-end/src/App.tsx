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

function App() {
	const [hasToken, setHasToken] = useState(!!getToken());

	function handleLogout() {
		localStorage.removeItem('token');
		setHasToken(false);
	}

	function handleLogin(token: string) {
		setToken(token);
		setHasToken(true);
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
			{hasToken ? <BodyConnected /> : <BodyNotConnected />}
			<Footer />
		</div>
	);
}

export default App;
