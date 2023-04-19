import React, { useState, useEffect } from 'react';
import App from '../../App';
import { Route, Routes, Navigate } from 'react-router-dom';
import './Body_connected.css';
import Profile from '../Profile/Profile';
import AccountManagement from '../Profile/AccountManagement';
import UserSidebar from '../Profile/UserSidebar';
import Chat from '../Chat/Chat';
import Matchmaking from '../Game/Matchmaking';
import PongGame from '../Game/PongGame';
import { User } from '../../utils/backend_interface';
import io, { Socket } from 'socket.io-client'
import { url } from '../../api/Api';
import { getToken } from '../../api/Api';

function BodyConnected({ user }: { user: User }) {
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		const newSocket = io(url + '/user', { extraHeaders: { Authorization: getToken() as string } });
		setSocket(newSocket);
	}, [setSocket, url])
	
	return (
		<div className="connected">
			<Chat user={user}/>
			<UserSidebar />
		</div>
	);
}

export default BodyConnected;
