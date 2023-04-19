import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import '../App.css';
import {HeaderConnected, HeaderNotConnected } from '../features/Structure/Headers';
import Footer from '../features/Structure/Footer';
import BodyNotConnected from '../features/Structure/Body_not_connected';
import PongGame from "../features/Game/PongGame";
import { getToken } from "../api/Api";
import { getMe } from '../api/User';
import { User } from '../utils/backend_interface';
import logo from '../assets/black_logo.png';
import { UserContext } from '../utils/UserContext';
import { Dispatch, SetStateAction } from "react";

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
			<UserContext.Provider value={{ user, setUser }}>
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
							<HeaderNotConnected url={""} />
						)}
					</div>
				</div>
				{hasToken ? <PongGame height={600} width={800} spec={spec} isQueue={false} handlefound={() => { }} /> : <BodyNotConnected />}
			</UserContext.Provider>
			<Footer />
		</div>
	);
}