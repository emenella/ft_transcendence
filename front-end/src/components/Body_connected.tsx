import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Body_connected.css';
import Matchmaking from './Game/Matchmaking';
import Profil from './Profil';
import AccountManagement from './AccountManagement';
import UserSidebar from './UserSidebar';
import Chat from '../chat/Chat';
import { User } from '../utils/backend_interface';

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
						<Route path="/" element={<Matchmaking />} />
						<Route path="/accountmanagement" element={<AccountManagement user={user!} />} />
						<Route path="/profil/:id" element={<Profil />} />
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
