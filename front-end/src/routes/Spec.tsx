import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { getToken } from "../api/Api";
import PongGame from "../components/Game/PongGame";
import { Toaster } from 'react-hot-toast';
import '../App.css';
import logo from '../assets/black_logo.png';
import Footer from '../components/Footer';
import {HeaderConnected, HeaderNotConnected } from '../components/Headers';
import BodyNotConnected from '../components/Body_not_connected';
import { User } from '../utils/backend_interface';
import { getMe } from '../api/User';


export default function Spectate() {
    const navigate = useNavigate();
    const token = getToken();
    const spec = window.location.pathname.split("/")[2];
    console.log(spec);
    if (!token || !spec) {
        navigate("/error");
    }

    const [hasToken, setHasToken] = useState(!!getToken());
	const [user, setUser] = useState<User>();
	const [loading, setLoading] = useState(true);
  	const [error, setError] = useState<any>(null);

	React.useEffect(() => {
		if (hasToken) {
			fetchUser();
		}
		else {
			setLoading(false);
		}
	}, [hasToken]);

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

	function handleLogout() {
		localStorage.removeItem('token');
		setHasToken(false);
	}

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
						<HeaderConnected logout={handleLogout} user={user!} />
					) : (
						<HeaderNotConnected url={""} />
					)}
				</div>
			</div>
			{hasToken ? <PongGame height={600} width={800} spec={spec} isQueue={false} user={user!} />: <BodyNotConnected />}
			<Footer />
            
		</div>
	);
}