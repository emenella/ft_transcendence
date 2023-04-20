import React, { useState, useEffect, useContext } from 'react';
import App from '../../App';
import { Route, Routes, Navigate } from 'react-router-dom';
import './Body_connected.css';
import UserSidebar from '../Profile/UserSidebar';
import Chat from '../Chat/Chat';
import Matchmaking from '../Game/Matchmaking';
import PongGame from '../Game/PongGame';
import { User } from '../../utils/backend_interface';
import io, { Socket } from 'socket.io-client'
import { url } from '../../api/Api';
import { getToken } from '../../api/Api';
import { SocketContext } from '../../utils/SocketContext';

function BodyConnected() {
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		const newSocket = io(url + '/user', { extraHeaders: { Authorization: getToken() as string } });
		setSocket(newSocket);
	}, [setSocket, url])

	return (
		<div className="connected">
			<SocketContext.Provider value={socket}>
			<Chat />
			<UserSidebar />
			</SocketContext.Provider>
		</div>
	);
}

export default BodyConnected;
