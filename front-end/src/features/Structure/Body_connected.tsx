import React, { useState, useEffect } from 'react';
import './Body_connected.css';
import UserSidebar from '../Profile/UserSidebar';
import Chat from '../Chat/Chat';
import io, { Socket } from 'socket.io-client'
import { url } from '../../api/Api';
import { getToken } from '../../api/Api';
import { SocketContext } from '../../utils/SocketContext';

function BodyConnected() {
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		const newSocket = io(url + '/user', { extraHeaders: { Authorization: getToken() as string } });
		setSocket(newSocket);
	}, [])

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
