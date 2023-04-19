import React from 'react';
import './Body_connected.css';
import UserSidebar from '../Profile/UserSidebar';
import Chat from '../Chat/Chat';

function BodyConnected() {
	return (
		<div className="connected">
			<Chat />
			<UserSidebar />
		</div>
	);
}

export default BodyConnected;
