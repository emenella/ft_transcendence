import React, { useState, useEffect } from 'react';
import './Body_connected.css';
import UserSidebar from '../Profile/UserSidebar';
import Chat from '../Chat/Chat';
import io, { Socket } from 'socket.io-client'
import { url } from '../../api/Api';
import { getToken } from '../../api/Api';

function BodyConnected() {
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		const newSocket = io(url + '/user', { extraHeaders: { Authorization: getToken() as string } });
		setSocket(newSocket);
	}, [setSocket])

	return (
		<div className="connected">
			<Chat />
			<UserSidebar />
		</div>
	);
}

export default BodyConnected;
