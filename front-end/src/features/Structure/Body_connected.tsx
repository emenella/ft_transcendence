import React from 'react';
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

function ChatSidebar() {
	return (
		<div className='chatSidebar'>
			<table>
				<thead>
					<tr>
						<th scope='row'>Channels rejoints</th>
						<th scope='row'>+</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Nom du channel</td>
						<td>-</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

function ChatFront() {
	return (
		<div className='chat'>
			<table>
				<tbody>
					<tr>
						<td>Bla bla</td>
					</tr>
					<tr>
						<td>Bla bla</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}


function BodyConnected({ user }: { user: User }) {
	return (
		<div className="connected">
			<ChatSidebar />
			<div className="connectedCenter">
				<div>
					<Routes>
						<Route index element={<Matchmaking user={user} />}></Route>
							<Route path="profile/:id" element={<Profile me={user} />} />
							<Route path="accountmanagement" element={<AccountManagement user={user!} />} />
							<Route path="spec/:id" element={<PongGame height={600} width={800} spec={null} isQueue={false} user={user} handlefound={() => {}} />} />
							<Route path="*" element={<Navigate to="/home" replace />} />
					</Routes>
				</div>
				<div>
					<Routes>
						<Route path="/" element={<Chat />} />
					</Routes>
				</div>
				<ChatFront />
			</div>
			<UserSidebar />
		</div>
	);
}

export default BodyConnected;
