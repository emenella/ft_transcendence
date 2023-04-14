import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { getToken, setToken } from "../api/Api";
import PongGame from "../components/Game/PongGame";
import { Toaster } from 'react-hot-toast';
import '../App.css';
import logo from '../assets/black_logo.png';
import Footer from '../components/Footer';
import HeaderConnected from '../components/Header_connected';
import HeaderNotConnected from '../components/Header_not_connected';
import BodyNotConnected from '../components/Body_not_connected';


export default function Spectate() {
    const navigate = useNavigate();
    const token = getToken();
    const spec = window.location.pathname.split("/")[2];
    console.log(spec);
    if (!token || !spec) {
        navigate("/error");
    }

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
			{hasToken ? <PongGame height={600} width={800} token={token as string} spec={spec} isQueue={false} />: <BodyNotConnected />}
			<Footer />
            
		</div>
	);
}